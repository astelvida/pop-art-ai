'use server'

import { UTApi } from 'uploadthing/server'
import { type Prediction } from 'replicate'
import { db } from '@/db/drizzle'
import { AiImages } from '@/db/schema'
import { eq } from 'drizzle-orm'

const utapi = new UTApi()

export type MaybeURL = string | URL
export type URLWithOverrides = { url: MaybeURL; name?: string; customId?: string }

export async function getFileFromUrl(prediction: Prediction) {
  try {
    const file = await fetch(prediction.output[0])
      .then((res) => res.blob())
      .then((blob) => new File([blob], `${prediction.id}.${prediction.input.output_format}`))

    const { data, error } = await utapi.uploadFiles(file)

    console.log('data', data)

    if (error) throw error
    return data.appUrl
  } catch (error) {
    console.error('Error getting file from url', error)
    throw error
  }
}

// Script to update the imageUrls in the database - migrating from vercel storage to uploadthing
export async function updateUrls() {
  const urls = await db.select({ id: AiImages.id, imageUrl: AiImages.imageUrl }).from(AiImages)

  console.log(JSON.stringify(urls, null, 2))

  const updatedUrls: string[] = []
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    const file = await fetch(url.imageUrl)
      .then((res) => res.blob())
      .then((blob) => new File([blob], `image-${url.id}-${i}.webp`))
    const response = await utapi.uploadFiles(file)
    const newUrl = response?.data?.appUrl
    console.log(newUrl)

    const updated = await db
      .update(AiImages)
      .set({ imageUrl: newUrl })
      .where(eq(AiImages.id, url.id))
      .returning()

    updatedUrls.push(updated[0].imageUrl)
  }

  return updatedUrls
}

// updateUrls()
