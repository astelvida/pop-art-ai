'use server'

import { db } from '@/db/drizzle'
import { AiImages, Likes, Users } from '@/db/schema'
import { pp } from '@/lib/pprint'
import { auth, currentUser } from '@clerk/nextjs/server'
import { eq, and, desc, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

async function createUser() {
  const { userId } = auth()
  if (!userId) return new Error('User not found')

  const myUser = await currentUser()
  if (!myUser || !userId) return new Error('User not found')

  pp(myUser, 'myUser')
  const insertedUser = await db
    .insert(Users)
    .values({
      id: myUser.id,
      name: myUser.firstName + ' ' + myUser?.lastName,
      email: myUser?.emailAddresses[0]?.emailAddress,
    })
    .returning()

  pp(insertedUser, 'insertedUser')
  return insertedUser[0]
}

export async function createImage(formData: FormData) {
  const { userId } = auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const imageUrl = formData.get('imageUrl') as string
  const aspectRatio = formData.get('aspectRatio') as string
  const prompt = formData.get('prompt') as string
  const title = formData.get('title') as string
  const caption = formData.get('caption') as string
  const description = formData.get('description') as string

  try {
    const newImage = await db
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

    revalidatePath('/gallery')
    return { success: true, image: newImage[0] }
  } catch (error) {
    console.error('Error creating AI image:', error)
    return { success: false, error: 'Failed to create image' }
  }
}

export async function getImages(limit = 10, offset = 0) {
  const { userId } = auth()
  
  try {
    const images = await db.select({
      id: AiImages.id,
      imageUrl: AiImages.imageUrl,
      title: AiImages.title,
      caption: AiImages.caption,
      numLikes: AiImages.numLikes,
      createdAt: AiImages.createdAt,
      userName: Users.name,
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
  } catch (error) {
    console.error('Error fetching images:', error)
    throw new Error('Failed to fetch images')
  }
}

export async function toggleLike(imageId: number) {
  const { userId } = auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }

  try {
    // Check if the user has already liked the image
    const existingLike = await db.select()
      .from(Likes)
      .where(and(eq(Likes.userId, userId), eq(Likes.aiImageId, imageId)))
      .limit(1)

    if (existingLike.length > 0) {
      // Unlike: Remove the existing like
      await db.delete(Likes)
        .where(and(eq(Likes.userId, userId), eq(Likes.aiImageId, imageId)))

      // Decrement the like count
      await db.update(AiImages)
        .set({ numLikes: sql`${AiImages.numLikes} - 1` })
        .where(eq(AiImages.id, imageId))

      revalidatePath('/gallery')
      return { success: true, liked: false }
    } else {
      // Like: Create a new like
      await db.insert(Likes).values({
        userId,
        aiImageId: imageId,
      })

      // Increment the like count
      await db.update(AiImages)
        .set({ numLikes: sql`${AiImages.numLikes} + 1` })
        .where(eq(AiImages.id, imageId))

      revalidatePath('/gallery')
      return { success: true, liked: true }
    }
  } catch (error) {
    console.error('Error toggling like:', error)
    return { success: false, error: 'Failed to toggle like' }
  }
}
