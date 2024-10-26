'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { likeImage } from '@/app/actions'

export default function LikeButton({ imageId, initialLikes }: { imageId: number, initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes)
  const [isLoading, setIsLoading] = useState(false)

  const handleLike = async () => {
    setIsLoading(true)
    const result = await likeImage(imageId)
    setIsLoading(false)
    if (result.success) {
      setLikes(likes + 1)
    }
  }

  return (
    <Button onClick={handleLike} disabled={isLoading}>
      Like ({likes})
    </Button>
  )
}
