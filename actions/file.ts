'use server'

import { UTApi } from 'uploadthing/server'
import { handleError } from '@/lib/error-handler'

const utapi = new UTApi()

export type MaybeURL = string | URL
export type URLWithOverrides = { url: MaybeURL; name?: string; customId?: string }

function getFileType(url: URL): string {
  try {
    const pathSegments = url.pathname.split('/')
    return pathSegments[pathSegments.length - 1].split('.')[1]
  } catch (error) {
    console.error('Failed to parse URL', error)
    return ''
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

function getFileName(url: MaybeURL, title: string) {
  return `${slugify(title)}.${getFileType(new URL(url))}`
}

export async function uploadFromUrl(url: MaybeURL, title: string) {
  const replicateUrl = new URL(url)
  const fileName = getFileName(url, title)

  const uploadedFile = await utapi.uploadFilesFromUrl({
    url,
    name: fileName,
  } as URLWithOverrides)

  if (!uploadedFile.data && uploadedFile.error) {
    return handleError(uploadedFile.error)
  }

  const { appUrl, name } = uploadedFile.data
  const imageUrl = `${appUrl}/${name}`
  console.log('imageUrl', imageUrl)

  return { imageUrl, fileName: name }
}

// Example usage
// const exampleUrl = 'https://replicate.delivery/yhqm/Dfe2oomyuCg7eJ20rzEPwPi4ZI3yW0ofN3pOQyJWx9DZPpiOB/out-0.jpg'
// const exampleTitle = 'Glass Ceilings I Prefer Skylights! 0'
// uploadFromUrl(exampleUrl, exampleTitle)
