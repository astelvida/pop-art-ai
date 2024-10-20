import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// This function has been moved to server-utils.ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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
