import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import data from '@/lib/data/prompts.json'
// This function has been moved to server-utils.ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
import { SamplePrompts, SamplePromptTag } from '@/lib/types'

const prompts: SamplePrompts = data

export function randomPrompt(key: SamplePromptTag = 'complex') {
  const randomPrompt = prompts[key][Math.floor(Math.random() * prompts[key].length)]
  return randomPrompt
}

export function randomPrompts(key: SamplePromptTag = 'complex', num: number = 5): string[] {
  const availablePrompts = prompts[key]
  if (!availablePrompts || availablePrompts.length === 0) {
    console.warn(`No prompts available for key: ${key}`)
    return []
  }

  const shuffled = [...availablePrompts].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, num)
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const randomInt = (max: number) => Math.floor(Math.random() * max)
// Range function
export const range = (start: number, end: number) => {
  const output = []
  if (typeof end === 'undefined') {
    end = start
    start = 0
  }
  for (let i = start; i < end; i += 1) {
    output.push(i)
  }
  return output
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// Download photo functions
function forceDownload(blobUrl: string, filename: string) {
  let a: HTMLAnchorElement = document.createElement('a')
  a.download = filename
  a.href = blobUrl
  document.body.appendChild(a)
  a.click()
  a.remove()
}

export function downloadPhoto(url: string, filename: string) {
  if (!filename) {
    const urlParts = url.split(/[\\\/]/)
    filename = urlParts[urlParts.length - 1] || ''
  }

  return fetch(url, {
    headers: new Headers({
      Origin: location.origin,
    }),
    mode: 'cors',
  })
    .then((response) => response.blob())
    .then((blob) => {
      let blobUrl = window.URL.createObjectURL(blob)
      forceDownload(blobUrl, filename)
    })
    .catch((e) => console.error(e))
}
