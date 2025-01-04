import { eq, exists, not } from 'drizzle-orm'

import { db } from '@/db/drizzle'
import { AiImages } from '@/db/schema'
import { embedText } from './openai'

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
