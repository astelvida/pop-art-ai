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
  revalidatePath('/gallery')
  revalidatePath(`/img/${insertedAiImage[0].id}`)

  return insertedAiImage[0]
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

export async function toggleFavoriteAiImage(formData: FormData) {
  const id = formData.get('imageId')
  // const id = formData.get('imageId')
  //
  try {
    const { userId } = auth()
    if (!userId) throw new AppError('User not authorized', 401)

    const [updatedImage] = await db
      .update(AiImages)
      .set({ liked: not(AiImages.liked) })
      .where(eq(AiImages.id, Number(id)))
      .returning()

    if (updatedImage.liked) {
      await incrementLikes(Number(id), userId)
    } else {
      await decrementLikes(Number(id), userId)
    }
    console.log('LIKED UPDATED')
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
  const [updatedImage] = await db
    .update(AiImages)
    .set({ numLikes: sql`${AiImages.numLikes} + 1` })
    .where(eq(AiImages.id, imageId))
    .returning()

  await db.insert(schema.Likes).values({
    userId,
    aiImageId: imageId,
  })

  revalidatePath('/')
  return updatedImage
}

export async function decrementLikes(imageId: number, userId: string) {
  const [updatedImage] = await db
    .update(AiImages)
    .set({ numLikes: sql`${AiImages.numLikes} - 1` })
    .where(eq(AiImages.id, imageId))
    .returning()

  await db.delete(schema.Likes).where(and(eq(Likes.userId, userId), eq(Likes.aiImageId, imageId)))

  revalidatePath('/')

  return updatedImage
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
