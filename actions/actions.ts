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

export async function getImages(limit = 10, offset = 0) {
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
    revalidatePath('/gallery')
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
    revalidatePath('/gallery')
    revalidatePath(`/img/${imageId}`)

    return { success: true, liked: true }
  }
}
