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
import { type InputSchema, type SettingsSchema } from '@/lib/schemas/inputSchema'
import { settingsData } from '@/lib/data/settings'

const mySettings: SettingsSchema = {
  aspect_ratio: '1:1',
  num_outputs: 2,
  output_format: 'webp',
  output_quality: 90,
  num_inference_steps: 28,
  // seed: null,
}

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

  const handleSetting = (name: string, value: string | number) => {
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
      }

      if (prediction.status === 'succeeded') {
        console.log('PREDICTION', prediction)
        setCurrentImage(prediction.output[0]) // Set only the first image
        await saveAiImage({
          predictionId: prediction.id,
          url: prediction.output[0],
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
          handleSettingChange={handleSetting}
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
        currentImage={currentImage}
        discardImage={discardImage}
        saveImage={saveImage}
      />
      <div className='mt-4 text-red-500'>{error || ''}</div>
      <pre>{JSON.stringify(settings, null, 2)}</pre>
      {children}
    </>
  )
}
