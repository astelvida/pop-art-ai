'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import PromptForm from '@/components/prompt-form'
import { saveAiImage } from '@/actions/queries'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Download, Copy, Shuffle, Share2, Loader2 } from 'lucide-react'
import { cn, downloadPhoto, extractLastIterationNumber, sleep } from '@/lib/utils'
import { type Prediction } from 'replicate'
import { PROMPTS as prompts } from '@/lib/data/prompts'
import Image from 'next/image'
import { type SettingsSchema } from '@/lib/schemas/inputSchema'
import { Progress } from '@/components/ui/progress'
import { type AiImage } from '@/db/schema'
import confetti from 'canvas-confetti'
import LikeButton from '@/components/buttons/like-button'
import SettingsForm from '@/components/settings-form'
import { settingsData } from '@/lib/data/settings'
import { toast } from 'sonner'
import { ImageDetails } from './image-details'
import { CreditDisplay } from './credit-display'

const initialSettingsState = settingsData.reduce<SettingsSchema>((acc, setting) => {
  if (typeof setting.default !== 'undefined') {
    acc[setting.name as keyof SettingsSchema] =
      setting.default as SettingsSchema[keyof SettingsSchema]
  }
  return acc
}, {} as SettingsSchema)

export function ImageGenerator({ children }: { children?: React.ReactNode }) {
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [prompt, setPrompt] = useState(prompts['fresh_meat'][0])
  const [settings, setSettings] = useState<SettingsSchema>(initialSettingsState)
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentImage, setCurrentImage] = useState<AiImage | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [progress, setProgress] = useState(0)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [showCreditDisplay, setShowCreditDisplay] = useState(false)
  const [userCredits, setUserCredits] = useState(0)

  const handleSettingChange = (
    name: keyof SettingsSchema,
    value: SettingsSchema[keyof SettingsSchema]
  ) => {
    setSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenerateImage = useCallback(async () => {
    setIsGenerating(true)
    setShowModal(true)
    setCurrentImage(null)
    setImageUrl(null)
    setProgress(0)
    setShowCreditDisplay(false)

    try {
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, ...settings }),
      })

      const data = await response.json()

      if (response.status === 402) {
        setShowCreditDisplay(true)
        setUserCredits(data.currentCredits)
        toast.error(data.message || 'Insufficient credits')
        return
      }

      if (response.status !== 201) {
        throw new Error(data.error || 'An error occurred during image generation')
      }

      let prediction = data

      while (prediction.status !== 'succeeded' && prediction.status !== 'failed') {
        await sleep(1000)
        const response = await fetch('/api/predictions/' + prediction.id)
        prediction = await response.json()
        if (response.status !== 200)
          throw new Error(prediction.detail || 'An error occurred while checking prediction status')
        if (prediction.status === 'processing') {
          const lastIterationNumber = extractLastIterationNumber(prediction.logs)
          if (lastIterationNumber !== null && typeof lastIterationNumber === 'number') {
            const percentage =
              Math.floor((lastIterationNumber / Number(settings.num_inference_steps)) * 100) || 0
            if (percentage !== null) setProgress(percentage)
          }
        }
      }

      if (prediction.status === 'succeeded') {
        setProgress(100)
        setImageUrl(prediction.output[0])
        setPrediction(prediction)

        const newAiImage = await saveAiImage({
          imageUrl: prediction.hostedUrl,
          prompt: prediction.input.prompt,
          aspectRatio: prediction.input.aspect_ratio,
        })
        if (newAiImage instanceof Error) {
          throw newAiImage
        }
        setCurrentImage(newAiImage)
      } else {
        throw new Error('Image generation DID NOT SUCCEED')
      }
    } catch (err) {
      console.error('Error during image generation', err)
      toast.error(err instanceof Error ? err.message : 'An error occurred during image generation')
    } finally {
      setIsGenerating(false)
    }
  }, [prompt, settings])

  const handleCopy = useCallback(() => {
    if (!imageUrl) return
    navigator.clipboard
      .writeText(imageUrl)
      .then(() => toast.success('Copied to clipboard!'))
      .catch((err) => {
        console.error(err)
        toast.error('Failed to copy: ' + err.name, { description: err.message })
      })
  }, [imageUrl])

  const handleShare = useCallback(() => {
    if (!imageUrl) return

    const shareData = {
      title: prompt,
      text: `Prompt: "${prompt}"`,
      url: imageUrl,
    }

    if (navigator.share) {
      navigator
        .share(shareData as ShareData)
        .then(() => toast.success('Shared successfully!'))
        .catch((err) => {
          console.error(err)
          toast.error('Failed to share: ' + err.name, { description: err.message })
        })
    } else {
      navigator.clipboard
        .writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`)
        .then(() => toast.success('Share info copied to clipboard!'))
        .catch((err) => {
          console.error(err)
          toast.error('Failed to copy share info: ' + err.name, { description: err.message })
        })
    }
  }, [imageUrl, prompt])

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

  useEffect(() => {
    if (isGenerating || currentImage) {
      setShowModal(true)
    }
  }, [isGenerating, currentImage])

  const { aspect_ratio } = settings
  const imageHeight = useMemo(
    () => 400 * (aspect_ratio === '16:9' ? 9 / 16 : aspect_ratio === '9:16' ? 16 / 9 : 1),
    [aspect_ratio]
  )
  const classNames = `aspect-${aspect_ratio === '16:9' ? 'video' : aspect_ratio === '9:16' ? '[9/16]' : 'square'}`

  useEffect(() => {
    // Fetch user's current credits
    const fetchCredits = async () => {
      try {
        const response = await fetch('/api/credits')
        const data = await response.json()
        if (response.ok) {
          setUserCredits(data.credits)
        }
      } catch (error) {
        console.error('Error fetching credits:', error)
      }
    }

    fetchCredits()
  }, [])

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
        <DialogContent className="sm:max-w-[580px]">
          {showCreditDisplay ? (
            <CreditDisplay credits={userCredits} />
          ) : (
            <Card className="w-full border-0 shadow-none">
              <div className="flex items-center justify-between pb-4 pt-6">
                <DialogTitle className="text-center italic">
                  {!isGenerating && currentImage ? currentImage.title : '...'}
                </DialogTitle>
                {!isGenerating && currentImage ? (
                  <>
                    <div className="flex items-center space-x-2">
                      <LikeButton
                        showLikes={false}
                        imageId={Number(currentImage?.id)}
                        initialLikes={0}
                        initialLikedState={false}
                      />
                      <Button
                        variant="secondary"
                        size="icon"
                        disabled={!imageUrl}
                        onClick={() => imageUrl && downloadPhoto(imageUrl)}
                      >
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        disabled={!imageUrl}
                        onClick={handleCopy}
                      >
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy</span>
                      </Button>
                    </div>
                  </>
                ) : null}
              </div>

              <CardContent className="p-0">
                {isGenerating ? (
                  <div
                    className={cn(
                      `w-full max-w-[400px] flex flex-col items-center justify-center rounded-md bg-muted`,
                      classNames
                    )}
                  >
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Generating image...</p>
                  </div>
                ) : imageUrl ? (
                  <div className={cn(`relative w-full max-w-[500px] mx-auto`, classNames)}>
                    <Image
                      src={imageUrl}
                      width={400}
                      height={imageHeight}
                      onLoad={() => {
                        confetti({
                          particleCount: 100,
                          spread: 70,
                          origin: { y: 0.6 },
                        })
                      }}
                      alt="Generated image"
                      className="h-full w-full rounded-md object-cover"
                    />
                  </div>
                ) : null}
              </CardContent>
              <CardFooter className="flex flex-col items-stretch justify-center space-y-8 pt-6">
                {isGenerating ? (
                  <div className="w-full space-y-2">
                    Best things are worth waiting for...
                    <Progress value={progress} className="w-full" />
                    <p className="text-center">{progress}%</p>
                  </div>
                ) : (
                  <div className="flex flex-col justify-center space-y-2">
                    <div className="flex justify-between space-x-2">
                      <Button
                        variant="outline"
                        className="mr-2 w-full"
                        onClick={handleGenerateImage}
                      >
                        <Shuffle className="mr-2 h-4 w-4" /> Remix
                      </Button>
                      <Button variant="outline" className="ml-2 w-full" onClick={handleShare}>
                        <Share2 className="mr-2 h-4 w-4" /> Share
                      </Button>
                    </div>
                    <p className="text-center align-bottom text-xs text-muted-foreground mb-4">
                      Generated with AI in{' '}
                      {Math.round(Number(prediction?.metrics?.predict_time) * 100) / 100} seconds
                    </p>

                    <Button
                      variant="outline"
                      className="w-full p-6 font-bangers text-xl"
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      {isOpen ? 'Hide Details' : 'Show Details'}
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
