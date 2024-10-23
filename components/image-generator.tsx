'use client'

import { useState, useCallback } from 'react'
import { PromptInput } from '@/components/prompt-input'
import { PromptSuggestions } from '@/components/prompt-suggestions'
import { saveAiImage } from '@/actions/queries'
import { SettingsPopover } from './settings-popover'
import { GenerationModal } from './generation-modal'
import { randomPrompt } from '@/lib/utils'
import { type Prediction } from 'replicate'
import { ImageGenerationSettings } from '@/lib/schemas/image-generation-schema'
import inputData from '@/lib/data/input.json'
import prompts from '@/lib/data/prompts.json'
import { randomInt, sleep } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const mySettings = {
  aspect_ratio: '1:1',
  num_outputs: 2,
  output_format: 'jpg',
  output_quality: 90,
  num_inference_steps: 28,
  // seed: null,
}

export function ImageGenerator({ children }: { children?: React.ReactNode }) {
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [prompt, setPrompt] = useState(prompts['complex'][0])
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentImages, setCurrentImages] = useState<string[]>([])
  const [showModal, setShowModal] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [selectedPromptCategory, setSelectedPromptCategory] = useState<keyof typeof prompts>('complex')

  const getInitialSettings = () => {
    const initialSettings: Partial<ImageGenerationSettings> = {}
    Object.entries(inputData).forEach(([key, value]) => {
      if (value.default !== undefined) {
        initialSettings[key as keyof ImageGenerationSettings] = value.default
      }
    })
    console.log(initialSettings)
    return initialSettings as ImageGenerationSettings
  }

  const [settings, setSettings] = useState<ImageGenerationSettings>(mySettings)

  const toggleSettings = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsSettingsOpen((prev) => !prev)
  }, [])

  const handleGenerateImage = useCallback(async () => {
    setIsGenerating(true)
    setShowModal(true)
    setError(null)

    console.log({ prompt, ...settings })
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
        console.log('---', prediction)
      }

      if (prediction.status === 'succeeded') {
        console.log('PREDICTION', prediction)
        console.log('PREDICTION OUTPUT', prediction.output)
        setCurrentImages(prediction.output)
        for (let i = 0; i < prediction.output.length; i++) {
          const currentImage = prediction.output[i]
          await saveAiImage({
            predictionId: prediction.id,
            url: currentImage,
            prompt,
          })
        }
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

  const handleSettingChange = useCallback((newSettings: Partial<ImageGenerationSettings>) => {
    setSettings((prevSettings) => ({ ...prevSettings, ...newSettings }))
  }, [])

  const saveOne = (url: string) => saveAiImage.bind(null, { predictionId: prediction?.id, url, prompt })

  const saveAll = useCallback(async () => {
    await Promise.all(currentImages.map((url) => saveOne(url)))
    setShowModal(false)
    setPrompt('')
  }, [currentImages, prompt, settings])

  const discardOne = useCallback(
    (image: string) => {
      setCurrentImages((prevImages) => prevImages.filter((img) => img !== image))
      if (currentImages.length === 1) {
        setPrompt('')
        setShowModal(false)
      }
    },
    [currentImages.length],
  )

  const discardAll = useCallback(() => {
    setCurrentImages([])
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
      </PromptInput>
      <div className='mb-4 flex items-center space-x-4'>
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
      </div>
      <PromptSuggestions setPrompt={setPrompt} category={selectedPromptCategory} />
      <GenerationModal
        isOpen={showModal}
        onOpenChange={setShowModal}
        isGenerating={isGenerating}
        progress={prediction?.status === 'processing' ? 50 : prediction?.status === 'succeeded' ? 100 : 0}
        currentImages={currentImages}
        discardOne={discardOne}
        discardAll={discardAll}
        saveOne={saveOne}
        saveAll={saveAll}
      />
      <div className='mt-4 text-red-500'>{error || ''}</div>
      <pre>{JSON.stringify(settings, null, 2)}</pre>
      {children}
    </>
  )
}
