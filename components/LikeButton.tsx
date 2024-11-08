'use client'

import { toggleLike } from '@/actions/queries'
import { Button } from '@/components/ui/button'
import { useToast } from '@/lib/hooks/use-toast'
import { Heart } from 'lucide-react'
import { useState } from 'react'


interface LikeButtonProps {
  imageId: number
  initialLiked: boolean
  initialLikeCount: number
}

export function LikeButton({ imageId, initialLiked, initialLikeCount }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleToggleLike = async () => {
    setIsLoading(true)
    // Optimistic update
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)

    try {
      const response = await toggleLike(imageId)
      
      if (!response.success) {
        // Revert optimistic update if failed
        setIsLiked(isLiked)
        setLikeCount(likeCount)
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error || "Failed to toggle like"
        })
      }
    } catch (error) {
      // Revert optimistic update if failed
      setIsLiked(isLiked)
      setLikeCount(likeCount)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to toggle like"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isLoading}
      onClick={handleToggleLike}
      className="gap-2"
    >
      <Heart
        className={`h-4 w-4 ${isLiked ? 'fill-current text-red-500' : ''}`}
      />
      <span>{likeCount}</span>
    </Button>
  )
} 