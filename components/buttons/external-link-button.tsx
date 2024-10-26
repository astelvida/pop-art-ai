'use client'

import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'

interface ExternalLinkButtonProps {
  url: string
}

export function ExternalLinkButton({ url }: ExternalLinkButtonProps) {
  return (
    <Button
      variant='secondary'
      size='icon'
      onClick={(e) => {
        e.preventDefault()
        window.open(url, '_blank')
      }}
    >
      <ExternalLink className='h-5 w-5' />
    </Button>
  )
}
