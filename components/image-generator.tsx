'use client'

import { useState, useCallback, useEffect } from 'react'
import { PromptInput } from '@/components/prompt-input'
import { saveAiImage } from '@/actions/queries'
import { toggleLike } from '@/actions/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Heart, MoreHorizontal, Download, Copy, ThumbsUp, Flag, Shuffle, Share2, Loader2 } from 'lucide-react'
import { downloadPhoto, sleep } from '@/lib/utils'
import { type Prediction } from 'replicate'
import prompts from '@/lib/data/prompts.json'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { type SettingsSchema } from '@/lib/schemas/inputSchema'
import { Progress } from '@/components/ui/progress'
import { extractLatestPercentage } from '@/lib/utils'
import { type AiImage } from '@/db/schema'
import confetti from 'canvas-confetti'
import { useToast } from '@/hooks/use-toast'
import LikeButton from '@/components/buttons/like-button'

export function ImageGenerator({ settings, children }: { settings: SettingsSchema; children?: React.ReactNode }) {
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [prompt, setPrompt] = useState(prompts['complex'][8])
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentImage, setCurrentImage] = useState<AiImage | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [progress, setProgress] = useState(0)
  const { user } = useUser()
  const { toast } = useToast()

  useEffect(() => {
    const preventClose = (e: BeforeUnloadEvent) => {
      if (isGenerating) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', preventClose)
    return () => window.removeEventListener('beforeunload', preventClose)
  }, [isGenerating])

  const handleCopy = useCallback(() => {
    if (!currentImage) return
    navigator.clipboard
      .writeText(currentImage.imageUrl)
      .then(() => alert('Copied to clipboard!'))
      .catch((err) => console.error('Failed to copy: ', err))
  }, [currentImage?.imageUrl])

  useEffect(() => {
    console.log(prediction?.status)
    console.log('prediction', prediction)
  }, [prediction])

  const handleGenerateImage = useCallback(async () => {
    setIsGenerating(true)
    setShowModal(true)
    setCurrentImage(null)
    setError(null)
    setProgress(0)

    try {
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, ...settings }),
      })

      let predictionResult = await response.json()
      if (response.status !== 201) {
        throw new Error(predictionResult.detail || 'An error occurred during image generation')
      }

      while (predictionResult.status !== 'succeeded' && predictionResult.status !== 'failed') {
        await sleep(1000)
        const response = await fetch('/api/predictions/' + predictionResult.id, { cache: 'no-store' })
        predictionResult = await response.json()
        if (response.status !== 200) {
          throw new Error(predictionResult.detail || 'An error occurred while checking prediction status')
        }
        // Update progress based on prediction status
        if (predictionResult.status === 'processing') {
          const percentage = extractLatestPercentage(predictionResult.logs)
          if (percentage !== null) {
            setProgress(percentage)
          }
        }
      }

      if (predictionResult.status === 'succeeded') {
        setProgress(100)
        console.log('Final prediction', predictionResult)
        setPrediction(predictionResult)

        const newAiImage = await saveAiImage({
          imageUrl: predictionResult.vercelUrl,
          prompt: predictionResult.input.prompt,
          aspectRatio: predictionResult.input.aspect_ratio,
        })

        setCurrentImage(newAiImage)
      } else {
        throw new Error('Image generation failed')
      }
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsGenerating(false)
    }
  }, [prompt, settings])

  const getAspectRatioClass = (ratio: SettingsSchema['aspect_ratio']) => {
    switch (ratio) {
      case '1:1':
        return 'aspect-square'
      case '16:9':
        return 'aspect-video'
      case '9:16':
        return 'aspect-[9/16]'
      case '3:4':
        return 'aspect-[3/4]'
      case '4:3':
        return 'aspect-[4/3]'
      default:
        return '9:16'
    }
  }

  const aspectRatio = settings.aspect_ratio

  const handleShare = useCallback(() => {
    if (!currentImage) return

    const shareData = {
      title: 'Check out this AI-generated image!',
      text: `Generated with the prompt: "${currentImage.prompt}"`,
      url: currentImage.imageUrl,
    }

    if (navigator.share) {
      navigator
        .share(shareData)
        .then(() => toast({ title: 'Shared successfully!' }))
        .catch((error) => {
          console.error('Error sharing:', error)
          toast({ title: 'Error sharing', description: 'Please try again later.', variant: 'destructive' })
        })
    } else {
      navigator.clipboard
        .writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`)
        .then(() => toast({ title: 'Share info copied to clipboard!' }))
        .catch(() =>
          toast({ title: 'Failed to copy share info', description: 'Please try again.', variant: 'destructive' }),
        )
    }
  }, [currentImage])

  const handleRemix = useCallback(() => {
    if (!currentImage) return

    // Set the current image's prompt as the new prompt
    setPrompt(currentImage.prompt)

    // Optionally, you can modify some settings here
    // For example, slightly change the aspect ratio or other parameters

    // Generate a new image with the remixed prompt
    handleGenerateImage()

    toast({ title: 'Remixing image...', description: 'Creating a new variation based on the current image.' })
  }, [currentImage, handleGenerateImage])

  // Update the useEffect hook that handles the modal
  useEffect(() => {
    if (isGenerating || currentImage) {
      setShowModal(true)
    }
  }, [isGenerating, currentImage])

  return (
    <>
      <PromptInput
        handleGenerateImage={handleGenerateImage}
        isGenerating={isGenerating}
        prompt={prompt}
        setPrompt={setPrompt}
      />
      <Dialog
        open={showModal}
        onOpenChange={(open) => {
          if (!isGenerating) {
            setShowModal(open)
          }
        }}
      >
        <DialogContent className='sm:max-w-[450px]'>
          <Card className='w-full border-0 shadow-none'>
            <div className='flex items-center space-x-2'>
              {/* <Avatar>
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback>S</AvatarFallback>
              </Avatar> */}
              {/* <span className='font-semibold'>{user?.username || user?.emailAddresses[0]?.emailAddress}</span> */}
            </div>
            <div className='flex items-center justify-between pb-4 pt-6'>
              {!isGenerating && (
                <>
                  <h1 className='text-xl font-semibold'>{currentImage?.title}</h1>
                  <div className='flex items-center space-x-2'>
                    {/* <form action={toggleLike.bind(null, currentImage?.id)} name='toggle'>
                      <input type='hidden' name='imageId' value={currentImage?.id} />
                      <Button type='submit' variant='secondary' size='icon'>
                        <Heart className={`h-4 w-4 ${currentImage?.liked ? 'fill-current' : ''}`} />
                      </Button>
                    </form> */}

                    <LikeButton
                      showLikes={false}
                      imageId={Number(currentImage?.id)}
                      initialLikes={Number(currentImage?.numLikes) || 0}
                      initialLikedState={currentImage?.liked || false}
                    />
                    <Button variant='secondary' size='icon' onClick={() => downloadPhoto(currentImage.imageUrl)}>
                      <Download className='h-4 w-4' />
                      <span className='sr-only'>Download</span>
                    </Button>
                    <Button variant='secondary' size='icon' onClick={handleCopy}>
                      <Copy className='h-4 w-4' />
                      <span className='sr-only'>Copy</span>
                    </Button>
                  </div>
                </>
              )}
            </div>
            <CardContent className='p-0'>
              {isGenerating ? (
                <div
                  className={`w-full max-w-[400px] ${getAspectRatioClass(aspectRatio)} flex flex-col items-center justify-center rounded-md bg-muted`}
                >
                  <Loader2 className='h-8 w-8 animate-spin text-primary' />
                  <p className='text-sm text-muted-foreground'>Generating image...</p>
                </div>
              ) : currentImage && currentImage.imageUrl ? (
                <div className={`relative w-full max-w-[400px] ${getAspectRatioClass(aspectRatio)}`}>
                  <Image
                    src={currentImage.imageUrl}
                    width={400}
                    height={
                      400 *
                      (aspectRatio === '16:9'
                        ? 9 / 16
                        : aspectRatio === '9:16'
                          ? 16 / 9
                          : aspectRatio === '3:4'
                            ? 4 / 3
                            : aspectRatio === '4:3'
                              ? 3 / 4
                              : 1)
                    }
                    onLoad={() => {
                      confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 },
                      })
                    }}
                    alt='Generated image'
                    className='h-full w-full rounded-md object-cover'
                  />
                </div>
              ) : null}
            </CardContent>
            <CardFooter className='flex flex-col items-stretch justify-center space-y-8 pt-6'>
              {isGenerating ? (
                <div className='w-full space-y-2'>
                  <Progress value={progress} className='w-full' />
                  <p className='text-center'>{progress}%</p>
                </div>
              ) : (
                <div className='flex flex-col justify-center space-y-2'>
                  <div className='flex justify-between space-x-2'>
                    <Button variant='outline' className='mr-2 w-full' onClick={handleRemix}>
                      <Shuffle className='mr-2 h-4 w-4' /> Remix
                    </Button>
                    <Button variant='outline' className='ml-2 w-full' onClick={handleShare}>
                      <Share2 className='mr-2 h-4 w-4' /> Share
                    </Button>
                  </div>
                  <p className='text-center align-bottom text-xs text-muted-foreground'>
                    Generated with AI in {Math.round(Number(prediction?.metrics?.predict_time) * 100) / 100} seconds
                  </p>
                </div>
              )}
            </CardFooter>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  )
}
