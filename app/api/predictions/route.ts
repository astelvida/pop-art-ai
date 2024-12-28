import Replicate from 'replicate'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/db/drizzle'
import { Users } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

const TRIGGER = 'pop art comic book'
const CREDITS_PER_GENERATION = 3

const imageKeywords = [
  'image',
  'depiction',
  'illustration',
  'scene',
  'picture',
  'artwork',
  'visual',
]

const enhancePrompt = (prompt: string): string => {
  if (prompt.search(/(pop art comic book)/i) === -1) {
    return `pop art comic book style illustration, ${prompt.trim()}`
  }
  return prompt.trim()
}

export async function POST(req: Request) {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error(
      'The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it.'
    )
  }

  const { userId } = await auth()
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  // Check if user has enough credits
  const [user] = await db
    .select({ credits: Users.credits })
    .from(Users)
    .where(eq(Users.id, userId))
    .limit(1)

  //  UNCOMMENT FOR NOW TO TEST
  // const currentCredits = user?.credits ?? 0
  // if (!user || currentCredits < CREDITS_PER_GENERATION) {
  //   return new Response(
  //     JSON.stringify({
  //       error: 'Insufficient credits',
  //       message: 'Please purchase more credits to continue generating images.',
  //       currentCredits,
  //       requiredCredits: CREDITS_PER_GENERATION - currentCredits,
  //     }),
  //     { status: 402 }
  //   )
  // }

  const { prompt, ...settingsData } = await req.json()

  const input = { ...settingsData, prompt: enhancePrompt(prompt) }

  try {
    const prediction = await replicate.predictions.create({
      version: '393c9b328cd1ac2f0127db9c7871eef86fded0c369ce2bfb888f9f217c21ca62',
      input,
    })

    if (prediction?.error) {
      return new Response(JSON.stringify({ detail: prediction.error }), { status: 500 })
    }

    // Deduct credits only after successful generation
    await db
      .update(Users)
      .set({
        credits: sql`${Users.credits} - ${CREDITS_PER_GENERATION}`,
      })
      .where(eq(Users.id, userId))

    return new Response(JSON.stringify(prediction), { status: 201 })
  } catch (error) {
    console.error('Error during image generation:', error)
    return new Response(JSON.stringify({ error: 'Failed to generate image' }), { status: 500 })
  }
}
