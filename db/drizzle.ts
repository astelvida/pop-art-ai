import { config } from 'dotenv'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'
import { and, sql } from 'drizzle-orm'

config({ path: ['.env.local', '.env'] })

const sql_client = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql_client, { schema })

async function test(userId: string) {
  const uid = userId
  if (!uid) throw new Error('User ID not found')

  const images = await db.query.AiImages.findMany({
    columns: {
      id: true,
      embedding: false,
      prompt: true,
      imageUrl: true,
      numLikes: true,
    },
    with: {
      likes: {
        where: (likes, { eq }) => eq(likes.userId, uid),
      },
    },
  })

  const imagesWithLikeStatus = images.map(({ likes, ...image }) => ({
    ...image,
    isLiked: likes.length > 0,
  }))
  return imagesWithLikeStatus
}

const id = 'user_2nTrPtux9tZhQdg2O1SG5R2fnVX'

// test(id)
