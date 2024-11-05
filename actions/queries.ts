'use server'

import { eq, not, desc, and, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import * as schema from '@/db/schema'
import { db } from '@/db/drizzle'
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { generateImageDetails } from './openai'
import { handleError, AppError } from '@/lib/error-handler'
import { pp } from '@/lib/pprint'
import { Users } from '@/db/schema'

const { AiImages, Likes } = schema

export const handleClose = async () => {
  redirect('/')
}
export type AiImageData = {
  imageUrl: string
  prompt: string
  aspectRatio: '1:1' | '3:4' | '4:3' | '16:9' | '9:16'
}

export async function saveAiImage({ imageUrl, prompt, aspectRatio }: AiImageData) {
  const { userId } = auth()
  if (!userId) throw new AppError('User not authorized', 401)
  // Generate image details can be an update function to
  const imageDetails = await generateImageDetails(imageUrl, prompt)
  const { title, caption, description } = imageDetails || {}

  const insertedAiImage = await db
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
  // pp(insertedAiImage, 'INSERTED AI IMAGE')
  revalidatePath('/')
  revalidatePath(`/img/${insertedAiImage[0].id}`)

  return insertedAiImage[0]
}

export async function getAiImage(id: string) {
  const { userId } = auth()
  if (!userId) throw new AppError('Unauthorized', 401)

  const [image] = await db
    .select()
    .from(AiImages)
    .where(eq(AiImages.id, Number(id)))
  if (!image) {
    redirect('/')
  }

  return image
}

export async function deleteAiImage(id: number) {
  const { userId } = auth()
  if (!userId) throw new AppError('Unauthorized', 401)

  const image = await getAiImage(id.toString())
  if (image.userId !== userId) return { success: false, error: 'Unauthorized' }

  const deletedImage = await db.delete(AiImages).where(and(eq(AiImages.id, Number(id)), eq(AiImages.userId, userId)))

  console.log('DELETED IMAGE', deletedImage)
  revalidatePath('/')
}

export async function createUser() {
  const { userId } = auth()
  if (!userId) return new Error('User not found')

  const myUser = await currentUser()
  if (!myUser || !userId) return new Error('User not found')

  const { firstName, lastName, id, emailAddresses } = myUser

  const userName = firstName || lastName ? `${firstName} ${lastName}` : null

  const [insertedUser] = await db
    .insert(Users)
    .values({
      id,
      name: userName,
      email: emailAddresses[0].emailAddress,
    })
    .returning()

  pp(insertedUser, 'insertedUser')
  return insertedUser
}

export async function getImages(limit = 20, offset = 0) {
  const { userId } = auth()
  if (!userId) {
    return new Error('Unauthorized')
  }

  const user = await db.select().from(Users).where(eq(Users.id, userId)).limit(1)

  if (!user.length) {
    await createUser()
  }

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
    .orderBy(desc(AiImages.createdAt))
  // .limit(limit)
  // .offset(offset)

  return images
}

export async function toggleLike(imageId: number) {
  const { userId } = auth()
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
