'use server'

import { eq, not, desc, and, isNull } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import * as schema from '@/db/schema'
import { db } from '@/db/drizzle'
import { auth } from '@clerk/nextjs/server'
import { uploadFromUrl } from './file.actions'
import { redirect } from 'next/navigation'
import { generateImageDetails } from './openai'
import { handleError, AppError } from '@/lib/error-handler'

const { AiImages } = schema

export const handleClose = async () => {
  redirect('/')
}

export type NewImage = {
  url: string
  prompt: string
}

export async function saveAiImage({ url, prompt }: NewImage) {
  try {
    const { userId } = auth()
    if (!userId) throw new AppError('User not authorized', 401)

    // Generate image details can be an update function to
    const imageDetails = await generateImageDetails(url, prompt)
    console.log(imageDetails, 'IMAGE DETAILS')

    const { title, caption, description, story, nextPrompt, isTextAccurate } = imageDetails || {}
    const imageUrl = await uploadFromUrl(url, title || 'out.jpg')

    const insertedAiImage = await db
      .insert(AiImages)
      .values({
        userId: userId,
        url: imageUrl,
        name: ,
        prompt: prompt,
        title: title,
        caption: caption,
        description: description,
        story: story,
        nextPrompt: nextPrompt,
        isTextAccurate: isTextAccurate,
        model: 'pop-art',
      })
      .returning()
    // console.log(insertedAiImage)
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

export async function getAiImage(id: number) {
  const { userId } = auth()
  if (!userId) throw new AppError('Unauthorized', 401)

  const [image] = await db.select().from(AiImages).where(eq(AiImages.id, id))

  if (!image) {
    redirect('/')
  }

  if (image.userId !== userId) throw new AppError('Unauthorized', 403)

  return image
}

export async function deleteAiImage(id: number) {
  try {
    const { userId } = auth()
    if (!userId) throw new AppError('Unauthorized', 401)

    await db.delete(AiImages).where(and(eq(AiImages.id, id), eq(AiImages.userId, userId)))
  } catch (error) {
    return handleError(error)
  }

  revalidatePath('/')
}

export async function toggleFavoriteAiImage(id: number) {
  try {
    const { userId } = auth()
    if (!userId) throw new AppError('User not authorized', 401)

    await db
      .update(AiImages)
      .set({ isFavorite: not(AiImages.isFavorite) })
      .where(eq(AiImages.id, id))

    revalidatePath('/')
    // revalidatePath(`/img/${id}`)
  } catch (error) {
    return handleError(error)
  }
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

export async function updateNullAiImageNames() {
  try {
    const { userId } = auth()
    if (!userId) throw new AppError('User not authorized', 401)

    const result = await db
      .update(AiImages)
      .set({ name: 'pop_art_image.jpg' })
      .where(isNull(AiImages.name))
      .returning({ updatedId: AiImages.id })

    console.log(`Updated ${result.length} images with null names`)
    revalidatePath('/')
    return result
  } catch (error) {
    return handleError(error)
  }
}

export async function incrementLikes(imageId: number, userId: string) {
  return db.transaction(async (tx) => {
    const [updatedImage] = await tx
      .update(AiImages)
      .set({ favoriteCount: AiImages.favoriteCount + 1 })
      .where(eq(AiImages.id, imageId))
      .returning()

    await tx.insert(schema.Likes).values({
      userId,
      aiImageId: imageId,
    })

    return updatedImage
  })
}
