'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { toggleLike } from '../actions'
import { Heart } from 'lucide-react'

export default function LikeButton({ imageId, initialLikes, initialLikedState }: { imageId: number, initialLikes: number, initialLikedState: boolean }) {
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(initialLikedState)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleLike = async () => {
    setIsLoading(true)
    const result = await toggleLike(imageId)
    setIsLoading(false)
    if (result.success) {
      setIsLiked(result.liked)
      setLikes(prev => result.liked ? prev + 1 : prev - 1)
    }
  }

  return (
    <Button 
      onClick={handleToggleLike} 
      disabled={isLoading} 
      variant={isLiked ? "default" : "outline"}
      size="sm"
    >
      <Heart className={`mr-2 h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
      {likes}
    </Button>
  )
}
