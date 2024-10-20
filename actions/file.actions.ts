'use server'

import { UTApi } from 'uploadthing/server'
import { handleError } from '@/lib/error-handler'

const utapi = new UTApi()

export type MaybeURL = string | URL
export type URLWithOverrides = { url: MaybeURL; name?: string; customId?: string }

export function getFileType(url: URL): string {
  try {
    const pathSegments = url.pathname.split('/')
    return pathSegments[pathSegments.length - 1].split('.')[1]
  } catch (error) {
    console.error('Failed to parse URL', error)
    return ''
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

export function getFileName(title: string, url: MaybeURL) {
  return `${slugify(title)}.${getFileType(new URL(url))}`
}

export async function uploadFromUrl(url: MaybeURL, title: string) {
  const replicateUrl = new URL(url)
  const fileName = `${slugify(title)}.${getFileType(replicateUrl)}`

  const uploadedFile = await utapi.uploadFilesFromUrl({
    url: url,
    name: fileName,
  } as URLWithOverrides)

  if (!uploadedFile.data && uploadedFile.error) {
    return handleError(uploadedFile.error)
  }

  const { appUrl, name } = uploadedFile.data
  const imageUrl = `${appUrl}/${name}`
  console.log('imageUrl', imageUrl)

  return imageUrl
}

// Example usage
// const exampleUrl = 'https://replicate.delivery/yhqm/Dfe2oomyuCg7eJ20rzEPwPi4ZI3yW0ofN3pOQyJWx9DZPpiOB/out-0.jpg'
// const exampleTitle = 'Glass Ceilings I Prefer Skylights! 0'
// uploadFromUrl(exampleUrl, exampleTitle)
