'use client'

import React from 'react' // Ensure React is imported
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export const CloseButton = () => {
  const router = useRouter()
  return (
    <Button
      type="submit"
      className="absolute left-4 top-4 z-50"
      variant="secondary"
      size="icon"
      onClick={() => {
        router.push('/')
      }}
    >
      <X className="h-5 w-5" />
    </Button>
  )
}
