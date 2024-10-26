import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import promptsData from '@/lib/data/prompts.json'
import { customAlphabet } from 'nanoid'
// This function has been moved to server-utils.ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { SamplePrompts, SamplePromptTag } from '@/lib/types'

export function extractLatestPercentage(logs: string) {
  // Split the logs into individual lines
  const lines = logs.split('\n')
  let lastPercentage = null

  // Regular expression to match the percentage at the beginning of a line
  const percentageRegex = /^\s*(\d+)%\|/

  // Iterate over each line to find the latest percentage
  for (const line of lines) {
    const match = line.match(percentageRegex)
    if (match) {
      lastPercentage = parseInt(match[1], 10)
    }
  }

  return lastPercentage
}

// 7-character random string
export const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 7)

export function nFormatter(num: number, digits?: number) {
  if (!num) return '0'
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ]
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value
    })
  return item ? (num / item.value).toFixed(digits || 1).replace(rx, '$1') + item.symbol : '0'
}

export function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export function randomPrompt(key: SamplePromptTag = 'complex') {
  const randomPrompt = promptsData[key][Math.floor(Math.random() * promptsData[key].length)]
  return randomPrompt
}

export function randomPrompts(key: SamplePromptTag = 'complex', num: number = 5): string[] {
  const availablePrompts = promptsData[key]
  if (!availablePrompts || availablePrompts.length === 0) {
    console.warn(`No prompts available for key: ${key}`)
    return []
  }

  const randoms = []
  for (let i = 0; i < num; i++) {
    randoms.push(availablePrompts[Math.floor(Math.random() * availablePrompts.length)])
  }
  return randoms

  // const shuffled = [...availablePrompts].sort(() => 0.5 - Math.random())
  // return shuffled.slice(0, num)
}

export const randomInt = (max: number = 100000) => Math.floor(Math.random() * max)
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

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// Download photo functions
function forceDownload(blobUrl: string, filename: string) {
  let a: HTMLAnchorElement = document.createElement('a')
  a.download = filename
  a.href = blobUrl
  document.body.appendChild(a)
  a.click()
  a.remove()
}

export function downloadPhoto(url: string, filename?: string | null) {
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
/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 * @param array The array to be shuffled
 * @returns The same array, shuffled in place
 */
