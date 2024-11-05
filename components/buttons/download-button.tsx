'use client'

import { Button } from '@/components/ui/button'
import { DownloadIcon } from 'lucide-react'
import { downloadPhoto } from '@/lib/utils'

export const DownloadButton = ({ url, title }: { url: string; title?: string | null }) => {
  // Create a functional component
  return (
    // Return the button JSX
    <Button
      onClick={(e) => {
        e.preventDefault()
        downloadPhoto(url, title)
      }}
      variant='secondary'
      size='icon'
    >
      <DownloadIcon className='h-5 w-5' />
    </Button>
  )
}
