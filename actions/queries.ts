'use server'

import { eq, not, desc, and, sql, getTableColumns, like, asc, exists } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import * as schema from '@/db/schema'
import { db } from '@/db/drizzle'
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { pp } from '@/lib/pprint'
import { Users } from '@/db/schema'
import { generateImageDetails, embedText } from '@/actions/openai'
import fs from 'fs'

export const handleClose = async () => {
  redirect('/')
}

const { AiImages, Likes } = schema

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

export async function saveAiImage({ imageUrl, prompt, aspectRatio }: AiImageData) {
  const { userId } = await auth()
  if (!userId) {
    return new Error('Unauthorized')
  }
  // Generate image details can be an update function to
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


  // fs.writeFileSync('imageDetails.json', JSON.stringify(imageDetails, null, 2))

  const text = `${title}\n${caption}\n${description}`
  embedText(text)
  // pp(insertedAiImage, 'INSERTED AI IMAGE')
  revalidatePath('/')
  revalidatePath(`/img/${insertedAiImage.id}`)

  return insertedAiImage
}

export async function getAiImage(id: string | number) {
  const { userId } = await auth()
  if (!userId) return new Error('Unauthorized')
    
  const [image] = await db
    .select()
    .from(AiImages)
    .where(eq(AiImages.id, Number(id)))
    
  if (!image) {
    redirect('/')
    return null
  }

  return image
}

export async function deleteAiImage(id: string) {
  const { userId } = await auth()
  if (!userId) return new Error('Unauthorized')

  try {
    await db
      .delete(AiImages)
    .where(and(eq(AiImages.id, Number(id)), eq(AiImages.userId, userId)))

    revalidatePath('/')
    return { message: "Deleted Image." };

  } catch (error) {
    return { message: "Database Error: Failed to Delete Image." };
  }
}

export async function createUser() {
  const { userId } = await auth()
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

type GetImagesProps = {
  limit?: number
  offset?: number
}

export async function getImages(q = '', { limit = 10, offset = 0 }: GetImagesProps = {}) {
  const authUser = await auth()  
  console.log(authUser, 'authUser')

  const userId = authUser.userId

  if (!userId) {
    return new Error('Unauthorized')
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

    const {id, title, caption, description} = image
    
    const text = `${title}\n${caption}\n${description}`
  
    const embedding = await embedText(text)

    await db.update(AiImages).set({ embedding }).where(eq(AiImages.id, image.id))

    console.log(`Embedded image ${image.id}`) 
}
// images: schema.AiImageResult
export async function embedAiImages() {

  const imageIds = await db
    .select({id: AiImages.id, title: AiImages.title, caption: AiImages.caption, description: AiImages.description})
    .from(AiImages)
    .where(not(exists(AiImages.embedding)))
  console.log(imageIds)

  for (const image of imageIds) { 
    const {id, title, caption, description} = image
    
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
