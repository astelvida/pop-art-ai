'use server'

import { eq, not, desc, and, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import * as schema from '@/db/schema'
import { db } from '@/db/drizzle'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { generateImageDetails } from './openai'
import { handleError, AppError } from '@/lib/error-handler'
import { pp } from '@/lib/pprint'

const { AiImages, Likes } = schema

export const handleClose = async () => {
  redirect('/')
}
export type AiImageData = {
  predictionId: string
  url: string
  prompt: string
  aspectRatio: '1:1' | '3:4' | '4:3' | '16:9' | '9:16'
}

export async function saveAiImage({ predictionId, url, prompt, aspectRatio }: AiImageData) {
  try {
    const { userId } = auth()
    if (!userId) throw new AppError('User not authorized', 401)

    // Generate image details can be an update function to
    const imageDetails = await generateImageDetails(url, prompt)
    const { title, caption, description } = imageDetails || {}

    const insertedAiImage = await db
      .insert(AiImages)
      .values({
        predictionId,
        userId,
        imageUrl: url,
        aspectRatio,
        prompt,
        title,
        caption,
        description,
      })
      .returning()
    // pp(insertedAiImage, 'INSERTED AI IMAGE')
    revalidatePath('/')

    return insertedAiImage[0]
  } catch (error) {
    return handleError(error)
  }
}

export const getAiImages = async () => {
  try {
    const { userId } = auth()
    if (!userId) throw new AppError('User not authorized', 401)

    const aiImages = await db
      .select()
      .from(AiImages)
      .where(eq(AiImages.userId, userId))
      .orderBy(desc(AiImages.createdAt))

    return aiImages
  } catch (error) {
    return handleError(error)
  }
}

export const getPublicAiImages = async () => {
  try {
    const aiImages = await db.select().from(AiImages).orderBy(desc(AiImages.createdAt))
    return aiImages
  } catch (error) {
    return handleError(error)
  }
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

  if (image.userId !== userId) throw new AppError('Unauthorized', 403)

  return image
}

export async function deleteAiImage(formData: FormData) {
  const id = formData.get('imageId')
  try {
    const { userId } = auth()
    if (!userId) throw new AppError('Unauthorized', 401)

    await db.delete(AiImages).where(and(eq(AiImages.id, Number(id)), eq(AiImages.userId, userId)))
  } catch (error) {
    return handleError(error)
  }

  revalidatePath('/')
}

export async function toggleFavoriteAiImage(formData: FormData, imageId?: number) {
  console.log(formData, 'FORM DATA')
  console.log(imageId, 'IMAGE ID')
  const id = imageId || formData.get('imageId')
  // const id = formData.get('imageId')
  //
  try {
    const { userId } = auth()
    if (!userId) throw new AppError('User not authorized', 401)

    await db
      .update(AiImages)
      .set({ liked: not(AiImages.liked) })
      .where(eq(AiImages.id, Number(id)))
  } catch (error) {
    return handleError(error)
  }
  revalidatePath('/')
}

export async function getAiImageById(id: number) {
  try {
    const { userId } = auth()
    if (!userId) throw new AppError('User not authorized', 401)

    const image = await db
      .select()
      .from(AiImages)
      .where(and(eq(AiImages.id, id), eq(AiImages.userId, userId)))
      .limit(1)

    if (!image.length) throw new AppError('Image not found', 404)

    return image[0]
  } catch (error) {
    return handleError(error)
  }
}

export async function incrementLikes(imageId: number, userId: string) {
  return db.transaction(async (tx) => {
    const [updatedImage] = await tx
      .update(AiImages)
      .set({ numLikes: sql`${AiImages.numLikes} + 1` })
      .where(eq(AiImages.id, imageId))
      .returning()

    await tx.insert(schema.Likes).values({
      userId,
      aiImageId: imageId,
    })

    return updatedImage
  })
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
