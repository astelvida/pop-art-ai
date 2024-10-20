'use client'
import React, { useState } from 'react' // Ensure React is imported
import { Button } from '@/components/ui/button'
import { DownloadIcon } from 'lucide-react'
import { downloadPhoto } from '@/lib/utils'
import clsx from 'clsx'

export const DownloadButton = ({ image }) => {
  const [downloaded, setDownloaded] = useState(false)
  // Create a functional component    
  return (
    // Return the button JSX
    <Button
      onClick={async (e) => {
        e.preventDefault()
        await downloadPhoto(image.url, image.name) // Call the function directly
        setDownloaded(true)
      }}
      variant='secondary'
      size='icon'
    >
      <DownloadIcon className={clsx('h-5 w-5', downloaded && 'fill-slate-500')} />
    </Button>
  )
}
