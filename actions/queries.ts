'use server'

import { eq, not, desc, and, sql, getTableColumns, like, asc, exists } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import * as schema from '@/db/schema'
import { db } from '@/db/drizzle'
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { pp } from '@/lib/pprint'
import { generateImageDetails, embedText } from '@/actions/openai'
import fs from 'fs'
import { cache } from 'react'

export const handleClose = async () => {
  redirect('/')
}

const { AiImages, Likes, Users } = schema

const { embedding: _, ...rest } = getTableColumns(AiImages)

const AiImagesWithoutEmbedding = {
  ...rest,
  embedding: sql<number[]>`ARRAY[]::integer[]`,
}

export type AiImageData = {
  imageUrl: string
  prompt: string
  aspectRatio: '1:1' | '16:9' | '9:16'
}

// First function to create basic image record with custom ID
export async function createAiImage(id: number, { imageUrl, prompt, aspectRatio }: AiImageData) {
  const { userId } = await auth()
  if (!userId) {
    return new Error('Unauthorized')
  }

  const [insertedAiImage] = await db
    .insert(AiImages)
    .values({
      id,
      userId,
      imageUrl,
      aspectRatio,
      prompt,
    })
    .returning()

  revalidatePath('/')
  revalidatePath(`/img/${insertedAiImage.id}`)
  return insertedAiImage
}

// Second function to update with AI-generated details
export async function updateAiImageDetails(imageId: number) {
  const image = await getAiImage(imageId)
  if (!image || image instanceof Error) {
    return new Error('Image not found')
  }

  const imageDetails = await generateImageDetails(image.imageUrl, image.prompt)
  const { title, caption, description } = imageDetails || {}

  const [updatedImage] = await db
    .update(AiImages)
    .set({
      title,
      caption,
      description,
    })
    .where(eq(AiImages.id, imageId))
    .returning()

  const text = `${title}\n${caption}\n${description}`
  await embedText(text)

  revalidatePath('/')
  revalidatePath(`/img/${imageId}`)

  return updatedImage
}

// You can keep the original saveAiImage as a convenience function that combines both:
export async function saveAiImage({ imageUrl, prompt, aspectRatio }: AiImageData) {
  const { userId } = await auth()
  if (!userId) {
    return new Error('Unauthorized')
  }

  const imageDetails = await generateImageDetails(imageUrl, prompt)
  const { title, caption, description } = imageDetails || {}

  const [insertedAiImage] = await db
    .insert(AiImages)
    .values({
      userId,
      imageUrl,
      aspectRatio,
      prompt,
      title,
      caption,
      description,
    })
    .returning()

  const text = `${title}\n${caption}\n${description}`
  embedText(text)

  revalidatePath('/')
  revalidatePath(`/img/${insertedAiImage.id}`)

  return insertedAiImage
}

export async function getAiImage(imageId: string | number) {
  const { userId } = await auth()
  if (!userId) return new Error('Unauthorized')

  const [image] = await db
    .select()
    .from(AiImages)
    .where(eq(AiImages.id, Number(imageId)))
    .limit(1)

  pp(image, 'image')

  return image
}

export async function deleteAiImage(id: string) {
  const { userId } = await auth()
  if (!userId) return new Error('Unauthorized')

  try {
    await db.delete(AiImages).where(and(eq(AiImages.id, Number(id)), eq(AiImages.userId, userId)))

    revalidatePath('/')
    return { message: 'Deleted Image.' }
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Image.' }
  }
}

export async function createUser() {
  const user = await currentUser()
  if (!user) return new Error('User not found')

  const { id, firstName, lastName, imageUrl, emailAddresses, primaryEmailAddressId } = user

  const fullName = firstName || lastName ? `${firstName} ${lastName}` : null
  const email = emailAddresses.find((email) => email.id === primaryEmailAddressId)?.emailAddress

  const [insertedUser] = await db
    .insert(Users)
    .values({
      id,
      name: fullName,
      email: email,
      avatarUrl: imageUrl,
    })
    .returning()

  pp(insertedUser, 'insertedUser')
  return insertedUser
}

type GetImagesProps = {
  limit?: number
  offset?: number
}

export async function getImages(q = '', { limit = 10, offset = 0 }: GetImagesProps = {}) {
  const authUser = await auth()
  console.log(authUser, 'authUser')

  const userId = authUser.userId

  if (!userId) {
    return []
  }

  // const user = await db.select().from(Users).where(eq(Users.id, userId)).limit(1)

  // if (!user.length) {
  //   await createUser()
  // }

  const images = await db
    .select({
      id: AiImages.id,
      imageUrl: AiImages.imageUrl,
      aspectRatio: AiImages.aspectRatio,
      prompt: AiImages.prompt,
      title: AiImages.title,
      caption: AiImages.caption,
      description: AiImages.description,
      numLikes: AiImages.numLikes,
      createdAt: AiImages.createdAt,
      userId: Users.id,
      isLikedByUser: sql<boolean>`EXISTS (
        SELECT 1 FROM ${Likes}
        WHERE ${Likes.aiImageId} = ${AiImages.id}
        AND ${Likes.userId} = ${userId}
      )`.as('isLikedByUser'),
    })
    .from(AiImages)
    .innerJoin(Users, eq(AiImages.userId, Users.id))
    // .where(like(AiImages.title, `%${q}%`))
    .orderBy(desc(AiImages.createdAt))
  // .limit(limit)
  // .offset(offset)

  return images
}




export async function toggleLike(imageId: number) {
  const { userId } = await auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }

  // Check if the user has already liked the image
  const existingLike = await db
    .select()
    .from(Likes)
    .where(and(eq(Likes.userId, userId), eq(Likes.aiImageId, imageId)))
    .limit(1)

  if (existingLike.length > 0) {
    // Unlike: Remove the existing like
    await db.delete(Likes).where(and(eq(Likes.userId, userId), eq(Likes.aiImageId, imageId)))

    // Decrement the like count
    await db
      .update(AiImages)
      .set({ numLikes: sql`${AiImages.numLikes} - 1` })
      .where(eq(AiImages.id, imageId))

    revalidatePath('/')
    revalidatePath(`/img/${imageId}`)

    return { success: true, liked: false }
  } else {
    // Like: Create a new like
    await db.insert(Likes).values({
      userId,
      aiImageId: imageId,
    })

    // Increment the like count
    await db
      .update(AiImages)
      .set({ numLikes: sql`${AiImages.numLikes} + 1` })
      .where(eq(AiImages.id, imageId))

    revalidatePath('/')
    revalidatePath(`/img/${imageId}`)

    return { success: true, liked: true }
  }
}

// images: schema.AiImageResult
export async function embedImage(image: schema.AiImageResult) {
  const { id, title, caption, description } = image

  const text = `${title}\n${caption}\n${description}`

  const embedding = await embedText(text)

  await db.update(AiImages).set({ embedding }).where(eq(AiImages.id, image.id))

  console.log(`Embedded image ${image.id}`)
}
// images: schema.AiImageResult
export async function embedAiImages() {
  const imageIds = await db
    .select({
      id: AiImages.id,
      title: AiImages.title,
      caption: AiImages.caption,
      description: AiImages.description,
    })
    .from(AiImages)
    .where(not(exists(AiImages.embedding)))
  console.log(imageIds)

  for (const image of imageIds) {
    const { id, title, caption, description } = image

    const text = `${title}\n${caption}\n${description}`

    const embedding = await embedText(text)

    await db.update(AiImages).set({ embedding }).where(eq(AiImages.id, image.id))

    console.log(`Embedded image ${image.id}`)
  }

  console.log(`EMBEDDINGS updated ${imageIds.length} images`)

  return imageIds
}

// embedAiImages()

// const imageIds = [85, 100, 89, 90, 91]

// for (let i = 0; i < imageIds.length; i++) {
//   embedAiImage(imageIds[i])
// }

// export async function updateNullAiImageNames() {
//   try {
//     const { userId } = auth()
//     if (!userId) throw new AppError('User not authorized', 401)

//     const result = await db
//       .update(AiImages)
//       .set({ name: 'pop_art_image.jpg' })
//       .where(isNull(AiImages.name))
//       .returning({ updatedId: AiImages.id })

//     console.log(`Updated ${result.length} images with null names`)
//     revalidatePath('/')
//     return result
//   } catch (error) {
//     return handleError(error)
//   }
// }

export const getAiImageCount = cache(async (): Promise<number> => {
  const [count] = await db.select({ count: sql<number>`count(*)` }).from(AiImages)
  return count.count
})
