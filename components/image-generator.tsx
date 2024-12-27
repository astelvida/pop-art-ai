'use client'

import { useState, useCallback, useEffect } from 'react'
import PromptForm from '@/components/prompt-form'
import { saveAiImage } from '@/actions/queries'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Download, Copy, Shuffle, Share2, Loader2 } from 'lucide-react'
import { downloadPhoto, sleep } from '@/lib/utils'
import { type Prediction } from 'replicate'
import { PROMPTS as prompts } from '@/lib/data/prompts'
import Image from 'next/image'
import { type SettingsSchema } from '@/lib/schemas/inputSchema'
import { Progress } from '@/components/ui/progress'
import { extractLatestPercentage } from '@/lib/utils'
import { type AiImage } from '@/db/schema'
import confetti from 'canvas-confetti'
import { useToast } from '@/lib/hooks/use-toast'
import LikeButton from '@/components/buttons/like-button'
import SettingsForm from '@/components/settings-form'
import { settingsData, type Setting } from '@/lib/data/settings'    


const initialSettingsState = settingsData.reduce<SettingsSchema>((acc, setting) => {
  acc[setting.name as keyof SettingsSchema] = setting.default as SettingsSchema[keyof SettingsSchema]
  return acc
}, {} as SettingsSchema)

export function ImageGenerator({  children }: { children?: React.ReactNode }) {
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [prompt, setPrompt] = useState(prompts['fresh_meat'][0])
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentImage, setCurrentImage] = useState<AiImage | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()
  const [settings, setSettings] = useState<SettingsSchema>(initialSettingsState)

  const handleSettingChange = (name: keyof SettingsSchema, value: SettingsSchema[keyof SettingsSchema]) => {
    setSettings((prev) => ({ ...prev, [name]: value }))
  }


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



  const handleGenerateImage = useCallback(async () => {
    setIsGenerating(true)
    setShowModal(true)
    setCurrentImage(null)
    setProgress(0)

    try {
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, ...settings }),
      })

      let result = await response.json()
      if (response.status !== 201) 
        throw new Error(result.detail || 'An error occurred during image generation')
      

      while (result.status !== 'succeeded' && result.status !== 'failed') {
        await sleep(1000)
        const response = await fetch('/api/predictions/' + result.id, { cache: 'no-store' })
        result = await response.json()

        if (response.status !== 200) throw new Error(result.detail || 'An error occurred while checking prediction status')
      
        // Update progress based on prediction status
        if (result.status === 'processing') {
          const percentage = extractLatestPercentage(result.logs)
          if (percentage !== null) setProgress(percentage)
        }
      }

      if (result.status === 'succeeded') {
        setProgress(100)
        setPrediction(result)

        const newAiImage = await saveAiImage({
          imageUrl: result.hostedUrl,
          prompt: result.input.prompt,
          aspectRatio: result.input.aspect_ratio,
        })

        setCurrentImage(newAiImage)
      } else {
        throw new Error('Image generation failed')
      }
    } catch (err) {
      console.error(err)
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
      default:
        return 'aspect-square'
    }
  }

  const aspectRatio = settings.aspect_ratio

  const handleCopy = useCallback(() => {
    if (!currentImage) return
    navigator.clipboard
      .writeText(currentImage.imageUrl)
      .then(() => toast({ title: 'Copied to clipboard!' }))
      .catch((err) => {
        console.error(err)
        toast({ title: 'Failed to share: ' + err.name, description: err.message, variant: 'destructive' })
      })
  }, [currentImage?.imageUrl])

  const handleShare = useCallback(() => {
    if (!currentImage) return

    const shareData = {
      title: currentImage.title,
      text: `Prompt: "${currentImage.prompt}"`,
      url: currentImage.imageUrl,
    }

    if (navigator.share) {
      navigator
      .share(shareData)
        .then(() => toast({ title: 'Shared successfully!' }))
        .catch((err) => {
          console.error(err)
          toast({ title: 'Failed to share: ' + err.name, description: err.message, variant: 'destructive' })
        })
    } else {  
      navigator.clipboard
        .writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`)
        .then(() => toast({ title: 'Share info copied to clipboard!' }))
        .catch((err) => {
          console.error(err)
          toast({ title: 'Failed to copy share info: ' + err.name, description: err.message, variant: 'destructive' })
        })
    }
  }, [currentImage])

  const handleRemix = useCallback(() => {
    if (!currentImage) return
    setPrompt(currentImage.prompt)
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
      <PromptForm
        handleGenerateImage={handleGenerateImage}
        isGenerating={isGenerating}
        prompt={prompt}
        setPrompt={setPrompt}
        settings={settings}
        handleSettingChange={handleSettingChange}
      >
        
        <SettingsForm handleSettingChange={handleSettingChange} settings={settings} />    
      </PromptForm>
      <Dialog open={showModal} onOpenChange={(open) => !isGenerating && setShowModal(open)}>
        <DialogContent className='sm:max-w-[450px]'>
          <Card className='w-full border-0 shadow-none'>
            <div className='flex items-center justify-between pb-4 pt-6'>
              {!isGenerating && currentImage ? (
                <>
                  <h1 className='text-xl font-semibold'>{currentImage?.title}</h1>
                  <div className='flex items-center space-x-2'>
                    <LikeButton
                      showLikes={false}
                      imageId={Number(currentImage?.id)}
                      initialLikes={Number(currentImage?.numLikes) || 0}
                      initialLikedState={false}
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
              ) : null}
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
                    height={400 * (aspectRatio === '16:9' ? 9 / 16 : aspectRatio === '9:16' ? 16 / 9 : 1)}
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







 