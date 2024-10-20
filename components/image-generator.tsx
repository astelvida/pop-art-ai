'use client'

import { Suspense, useState } from 'react'
import dynamic from 'next/dynamic'
import { PromptInput } from '@/components/prompt-input'
import { PromptSuggestions } from '@/components/prompt-suggestions'
import { Gallery } from '@/components/gallery'
import { AiImageType } from '@/db/schema'
import { saveAiImage } from '@/actions/queries'
import { generatePopArtImage } from '@/actions/ai-services'
import { SettingsPopover } from './settings-popover'
import { ImageGenerationOptions, ImageOrImages } from '@/lib/types'
import { GenerationModal } from './generation-modal'
import { GallerySkeleton } from './gallery-skeleton'
import { randomPrompt } from '@/lib/utils'

const Confetti = dynamic(() => import('react-confetti'), { ssr: false })

export function ImageGenerator({ children }: { children?: React.ReactNode }) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentImages, setCurrentImages] = useState<string[]>([])
  const [showModal, setShowModal] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // Image generation settings
  const [settings, setSettings] = useState<ImageGenerationOptions>({
    aspectRatio: '1:1',
    numInferenceSteps: 28,
    guidanceScale: 3.5,
    promptStrength: 0.8,
    seed: '',
    outputFormat: 'jpg',
    outputQuality: 90,
    numOutputs: 1,
  })

  const toggleSettings = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsSettingsOpen(!isSettingsOpen)
  }

  const handleGenerateImage = async () => {
    setIsGenerating(true)
    setProgress(0)
    setShowModal(true)

    // Simulating image generation with a delay
    // for (let i = 0; i <= 100; i += 10) {
    //   await new Promise((resolve) => setTimeout(resolve, 500))
    //   setProgress(i)
    // }

    try {
      const imageUrls = await generatePopArtImage(prompt, settings)
      console.log({ imageUrls, settings })

      saveAll(imageUrls, settings)
      setCurrentImages(imageUrls)
      // setShowConfetti(true)
      // setTimeout(() => setShowConfetti(false), 5000)
    } catch (err) {
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  const saveOne = async (image: string) => {
    await saveAiImage({ url: image, prompt }, settings)
    if (currentImages.length === 1) {
      setPrompt('')
      setShowModal(false)
    }
  }

  const saveAll = async (urls: string[], settings: ImageGenerationOptions) => {
    await Promise.all(urls.map((item) => saveAiImage({ url: item, prompt: prompt }, settings)))
    setShowModal(false)
    setPrompt('')
  }

  const discardOne = (image: string): void => {
    setCurrentImages((prevImages) => prevImages.filter((img) => img !== image))
    if (currentImages.length === 1) {
      setPrompt('')
      setShowModal(false)
    }
  }

  const discardAll = () => {
    setCurrentImages([])
    setPrompt('')
    setShowModal(false)
  }

  const handleSettingChange = (key: keyof ImageGenerationOptions, value: any) => {
    setSettings((prevSettings) => ({ ...prevSettings, [key]: value }))
  }

  return (
    <>
      <PromptInput
        handleGenerateImage={handleGenerateImage}
        isGenerating={isGenerating}
        prompt={prompt}
        setPrompt={setPrompt}
        handleRandomize={randomPrompt.bind(null, 'complex')}
      >
        <SettingsPopover
          isOpen={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
          handleSettingChange={handleSettingChange}
          settings={settings}
          toggleSettings={toggleSettings}
        />
      </PromptInput>
      <PromptSuggestions onSuggestionClick={setPrompt} />
      <GenerationModal
        isOpen={showModal}
        onOpenChange={setShowModal}
        isGenerating={isGenerating}
        progress={progress}
        currentImages={currentImages}
        discardOne={discardOne}
        discardAll={discardAll}
        saveOne={saveOne}
        saveAll={saveAll}
      />
      {children || null}
    </>
  )
}
