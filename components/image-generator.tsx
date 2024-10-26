'use client'

import { useState, useCallback, useEffect } from 'react'
import { PromptInput } from '@/components/prompt-input'
import { saveAiImage, toggleFavoriteAiImage } from '@/actions/queries'
import { SettingsPopover } from './settings-popover'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { settingsData } from '@/lib/data/settings'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Heart, MoreHorizontal, Download, Copy, ThumbsUp, Flag, Shuffle, Share2, Loader2 } from 'lucide-react'
import confetti from 'canvas-confetti'
import { downloadPhoto } from '@/lib/utils'
import { type Prediction } from 'replicate'
import prompts from '@/lib/data/prompts.json'
import { sleep } from '@/lib/utils'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { type SettingsSchema } from '@/lib/schemas/inputSchema'

function extractLatestPercentage(logs: string) {
  // Split the logs into individual lines
  const lines = logs.split('\n')
  let lastPercentage = null

  // Regular expression to match the percentage at the beginning of a line
  const percentageRegex = /^\s*(\d+)%\|/

  // Iterate over each line to find the latest percentage
  for (const line of lines) {
    const match = line.match(percentageRegex)
    if (match) {
      lastPercentage = parseInt(match[1], 10)
    }
  }

  return lastPercentage
}

const initialSettingsState = settingsData.reduce(
  (acc, setting) => {
    acc[setting.name] = setting.default
    return acc
  },
  {} as { [key in keyof SettingsSchema]: SettingsSchema[key] },
)

export function ImageGenerator({ children }: { children?: React.ReactNode }) {
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [prompt, setPrompt] = useState(prompts['complex'][8])
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [promptCategory, setPromptCategory] = useState<keyof typeof prompts>('complex')
  const [settings, setSettings] = useState<SettingsSchema>(initialSettingsState)
  const [progress, setProgress] = useState(0)
  const { user } = useUser()

  console.log(user)
  const handleCopy = useCallback(() => {
    navigator.clipboard
      .writeText(currentImage)
      .then(() => alert('Copied to clipboard!'))
      .catch((err) => console.error('Failed to copy: ', err))
  }, [currentImage])

  useEffect(() => {
    console.log(prediction?.status)
    console.log('prediction', prediction)
  }, [prediction])

  const handleSettingChange = (name: string, value: string | number) => {
    setSettings((prev) => ({ ...prev, [name]: value }))
  }

  const toggleSettings = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsSettingsOpen((prev) => !prev)
  }, [])

  const handleGenerateImage = useCallback(async () => {
    setIsGenerating(true)
    setShowModal(true)
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

      setPrediction(predictionResult)

      while (predictionResult.status !== 'succeeded' && predictionResult.status !== 'failed') {
        await sleep(1000)
        const response = await fetch('/api/predictions/' + predictionResult.id, { cache: 'no-store' })
        predictionResult = await response.json()
        if (response.status !== 200) {
          throw new Error(predictionResult.detail || 'An error occurred while checking prediction status')
        }
        setPrediction(predictionResult)
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
        setCurrentImage(predictionResult.vercelUrl) // Set only the first image
        setPrediction(predictionResult)

        saveAiImage({
          predictionId: predictionResult.id,
          url: predictionResult.vercelUrl,
          prompt: predictionResult.input.prompt,
          aspectRatio: predictionResult.input.aspect_ratio,
        })
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

  const discardImage = useCallback(() => {
    setCurrentImage(null)
    setPrompt('')
    setShowModal(false)
  }, [])

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
  return (
    <>
      <PromptInput
        handleGenerateImage={handleGenerateImage}
        isGenerating={isGenerating}
        prompt={prompt}
        setPrompt={setPrompt}
        category={promptCategory}
      >
        <SettingsPopover
          isOpen={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
          handleSettingChange={handleSettingChange}
          settings={settings}
          toggleSettings={toggleSettings}
        />
        <Select value={promptCategory} onValueChange={(value) => setPromptCategory(value as keyof typeof prompts)}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Select prompt category' />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(prompts).map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PromptInput>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className='sm:max-w-[450px]'>
          <Card className='w-full border-0 shadow-none'>
            <div className='flex items-center justify-between space-y-0 pb-2'>
              <div className='flex items-center space-x-2'>
                <Avatar>
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback>S</AvatarFallback>
                </Avatar>
                <span className='font-semibold'>{user?.username || user?.emailAddresses[0].emailAddress}</span>
              </div>
              <div className='flex items-center space-x-2'>
                {/* <Button variant='ghost' size='icon' onClick={() => toggleFavoriteAiImage(prediction?.id)}>
                  <Heart className='h-4 w-4' />
                  <span className='sr-only'>Like</span>
                </Button> */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='icon'>
                      <MoreHorizontal className='h-4 w-4' />
                      <span className='sr-only'>More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem>
                      <Download className='mr-2 h-4 w-4' />
                      <span>Download</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className='mr-2 h-4 w-4' />
                      <span>Copy</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ThumbsUp className='mr-2 h-4 w-4' />
                      <span>Rate</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Flag className='mr-2 h-4 w-4' />
                      <span>Report</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <CardContent className='p-0'>
              {isGenerating ? (
                <div
                  className={`w-full max-w-[400px] ${getAspectRatioClass(aspectRatio)} flex flex-col items-center justify-center rounded-md bg-muted`}
                >
                  <Loader2 className='h-8 w-8 animate-spin text-primary' />
                </div>
              ) : currentImage ? (
                <div className={`relative w-full max-w-[400px] ${getAspectRatioClass(aspectRatio)}`}>
                  <Image
                    src={currentImage}
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
                    alt='A crocodile in bed'
                    className='h-full w-full rounded-md object-cover'
                  />
                  <div className='absolute right-2 top-2 flex space-x-2'>
                    <Button variant='secondary' size='icon' onClick={() => downloadPhoto(currentImage)}>
                      <Download className='h-4 w-4' />
                      <span className='sr-only'>Download</span>
                    </Button>
                    <Button variant='secondary' size='icon' onClick={handleCopy}>
                      <Copy className='h-4 w-4' />
                      <span className='sr-only'>Copy</span>
                    </Button>
                  </div>
                </div>
              ) : null}
            </CardContent>
            <CardFooter className='flex justify-between pt-4'>
              {isGenerating ? (
                <div className='w-full space-y-2'>
                  <div className='h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700'>
                    <div className='bg-grey-800 h-2.5 rounded-full' style={{ width: `${progress}%` }}></div>
                  </div>
                  {/* <Progress value={progress} className='w-full' /> */}
                  <p className='text-center text-sm text-muted-foreground'>Generating image... {progress}%</p>
                </div>
              ) : (
                <>
                  <Button variant='outline' className='mr-2 w-full'>
                    <Shuffle className='mr-2 h-4 w-4' /> Remix
                  </Button>
                  <Button variant='outline' className='ml-2 w-full'>
                    <Share2 className='mr-2 h-4 w-4' /> Share
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  )
}
