'use client'

import { useState, useCallback } from 'react'
import { PromptInput } from '@/components/prompt-input'
import { PromptSuggestions } from '@/components/prompt-suggestions'
import { saveAiImage } from '@/actions/queries'
import { SettingsPopover } from './settings-popover'
import { GenerationModal } from './generation-modal'
import { randomPrompt } from '@/lib/utils'
import { type Prediction } from 'replicate'
import prompts from '@/lib/data/prompts.json'
import { sleep } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { settingsData } from '@/lib/data/settings'
import { Skeleton } from '@/components/ui/skeleton'

export function ImageGenerator({ children }: { children?: React.ReactNode }) {
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [prompt, setPrompt] = useState(prompts['complex'][0])
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [selectedPromptCategory, setSelectedPromptCategory] = useState<keyof typeof prompts>('complex')
  const [settings, setSettings] = useState(() => {
    const initialState: { [key: string]: string | number } = {}
    settingsData.forEach((setting) => {
      initialState[setting.name] = setting.default
    })
    return initialState
  })
  const [progress, setProgress] = useState(0)

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

      let prediction = await response.json()
      if (response.status !== 201) {
        throw new Error(prediction.detail || 'An error occurred during image generation')
      }

      setPrediction(prediction)

      while (prediction.status !== 'succeeded' && prediction.status !== 'failed') {
        await sleep(1000)
        const response = await fetch('/api/predictions/' + prediction.id, { cache: 'no-store' })
        prediction = await response.json()
        if (response.status !== 200) {
          throw new Error(prediction.detail || 'An error occurred while checking prediction status')
        }
        setPrediction(prediction)

        // Update progress based on prediction status
        if (prediction.status === 'starting') {
          setProgress(10)
        } else if (prediction.status === 'processing') {
          setProgress(50)
        } else if (prediction.output && prediction.output.length > 0) {
          setProgress(90)
        }
      }

      if (prediction.status === 'succeeded') {
        setProgress(100)
        console.log('PREDICTION', prediction)
        setCurrentImage(prediction.vercelUrl) // Set only the first image
        await saveAiImage({
          predictionId: prediction.id,
          url: prediction.vercelUrl,
          prompt,
          aspectRatio: settings.aspect_ratio,
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

  const saveImage = useCallback(() => {
    if (currentImage && prediction) {
      saveAiImage({
        predictionId: prediction.id,
        url: currentImage,
        prompt,
        aspectRatio: settings.aspect_ratio,
      })
    }
  }, [currentImage, prediction, prompt, settings.aspect_ratio])

  const discardImage = useCallback(() => {
    setCurrentImage(null)
    setPrompt('')
    setShowModal(false)
  }, [])

  return (
    <>
      <PromptInput
        handleGenerateImage={handleGenerateImage}
        isGenerating={isGenerating}
        prompt={prompt}
        setPrompt={setPrompt}
        handleRandomize={() => setPrompt(randomPrompt(selectedPromptCategory))}
      >
        <SettingsPopover
          isOpen={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
          handleSettingChange={handleSettingChange}
          settings={settings}
          toggleSettings={toggleSettings}
        />
        <Select
          value={selectedPromptCategory}
          onValueChange={(value) => setSelectedPromptCategory(value as keyof typeof prompts)}
        >
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
      <PromptSuggestions setPrompt={setPrompt} category={selectedPromptCategory} />
      <GenerationModal
        isOpen={showModal}
        onOpenChange={setShowModal}
        isGenerating={isGenerating}
        progress={progress}
        currentImage={currentImage}
        discardImage={discardImage}
        saveImage={saveImage}
        aspectRatio={settings.aspect_ratio as string}
      />
    </>
  )
}
