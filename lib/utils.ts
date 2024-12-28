import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { REGROUPED_PROMPTS as promptsData } from '@/lib/data/prompts'
import { customAlphabet } from 'nanoid'
// This function has been moved to server-utils.ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { SamplePrompts, SamplePromptTag } from '@/lib/types'

export function getPercentageFromLine(line: string) {
  const match = line.trim().match(/^(\d+)%/)
  console.log(match)
  return match ? match[1] : null
}

export function extractLastIterationNumber(logs: string) {
  // Match digits before 'it' at the start of the last line
  const pattern = /^(\d+)it/m
  const lines = logs.trim().split('\n')
  const lastLine = lines[lines.length - 1]
  const match = lastLine.match(pattern)
  console.log('match', match?.[1])
  return match ? parseInt(match[1]) : null
}

export function extractLatestPercentage(logs: string) {
  // Split the logs into individual lines
  const lastLine = logs.trim().split('\n').pop()?.trim()
  console.log('lastLine', lastLine)
  const lastPercentage = getPercentageFromLine(lastLine || '')

  console.log('lastPercentage', lastPercentage)
  return lastPercentage
}

// 7-character random string
export const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  7
)

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

export function randomPrompt(key: SamplePromptTag = 'fresh_meat') {
  const randomPrompt = promptsData[key][Math.floor(Math.random() * promptsData[key].length)]
  return randomPrompt
}

export function randomPrompts(key: SamplePromptTag = 'fresh_meat', num: number = 5): string[] {
  const shuffled = promptsData[key].slice().sort(() => 0.5 - Math.random())
  // Get sub-array of first n elements after shuffled
  let selected = shuffled.slice(0, num)
  return selected
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
    filename = urlParts[urlParts.length - 1] || 'popart-image'
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

/**
 * Measures the execution time of an asynchronous function
 * @param fn The async function to measure
 * @param args Arguments to pass to the function
 * @returns Object containing the function result and execution time in milliseconds
 */
export async function measureExecutionTime<T>(
  fn: (...args: any[]) => Promise<T>,
  ...args: any[]
): Promise<{ result: T; executionTime: number }> {
  const start = performance.now()
  const result = await fn(...args)
  const end = performance.now()
  const executionTime = end - start

  console.log(`Execution time: ${executionTime.toFixed(2)}ms`)
  return { result, executionTime }
}
