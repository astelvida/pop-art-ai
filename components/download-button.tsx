'use client'

import { Button } from '@/components/ui/button'
import { DownloadIcon } from 'lucide-react'
import { downloadPhoto } from '@/lib/utils'
import { type AiImage } from '@/db/schema'

export const DownloadButton = ({ image }: { image: AiImage }) => {
  // Create a functional component
  return (
    // Return the button JSX
    <Button
      onClick={async (e) => {
        e.preventDefault()
        await downloadPhoto(image.imageUrl, image.title || 'img')
      }}
      variant='secondary'
      size='icon'
    >
      <DownloadIcon className='h-5 w-5' />
    </Button>
  )
}
