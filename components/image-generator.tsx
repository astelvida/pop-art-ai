'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { ImagePromptInput } from '@/components/image-prompt-input'
import { PromptSuggestions } from '@/components/prompt-suggestions'
import { ImageGenerationDialog } from '@/components/image-generation-dialog'
import { ImageGallery } from '@/components/image-gallery'
import { AiImageType } from '@/db/schema'
import { ImageGenerationSettings, ImageGenerationSettingsValues } from '@/components/image-generation-settings'
import { addBulkAiImages, deleteAiImage, newImage, saveAiImage, toggleFavoriteAiImage } from '@/actions/queries'
import { generatePopArtImage } from '@/actions/ai-services'
import { Button } from './ui/button'
import prompts from '@/public/prompts.json'
import { ImageGenerationSettingsPopover } from './image-generation-settings-popover'

const Confetti = dynamic(() => import('react-confetti'), { ssr: false })

export function ImageGenerator({ images }: {images: AiImageType[]}) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentImages, setCurrentImages] = useState<string[]>([])
  const [showModal, setShowModal] = useState(true)
  const [prompt, setPrompt] = useState('')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  
  // Image generation settings
  const [settings, setSettings] = useState({
    aspectRatio: "1:1",
    inferenceSteps: 28,
    guidanceScale: 3.5,
    promptStrength: 0.80,
    seed: "",
    outputFormat: "jpg",
    outputQuality: 90,
    numberOfOutputs: 1
  })

  const toggleSettings = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsSettingsOpen(!isSettingsOpen)
  }

  const handleGenerateImage = async () => {
    setIsGenerating(true)
    setProgress(0)
    setShowModal(true)
    setCurrentImages([])

    // Simulating image generation with a delay
    for (let i = 0; i <= 100; i += 10) {
      new Promise(resolve => setTimeout(resolve, 500)).then(() => setProgress(i))
    }

    try {
      const imageUrls = await generatePopArtImage(prompt, settings)
      console.log(imageUrls)
      setCurrentImages(imageUrls)
      // Save all generated images
      for (const imageUrl of imageUrls) {
        await saveAiImage({ url: imageUrl, prompt: prompt })
      }
      
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2000)
    } catch (err) { 
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }
  
  const handleRandomize = () => {
    const randomPrompt = prompts.witty[Math.floor(Math.random() * prompts.witty.length)];
    setPrompt(randomPrompt);
  };

  const handleSave = () => {
    if (currentImages.length > 0) {
      setCurrentImages([])
      setShowModal(false)
      setPrompt('')
    }
  }

  const handleDiscard = () => {
    setCurrentImages([])
    setShowModal(false)
    setPrompt('')
  }

  const handleSettingChange = (key: keyof ImageGenerationSettingsValues, value: any) => {
    setSettings(prevSettings => ({ ...prevSettings, [key]: value }))
  }


  return (
      <main className="flex-grow container mx-auto p-4 space-y-8">
        <div className="text-center mb-2">
          <h1 className="text-6xl font-bold mb-2" style={{ fontFamily: "'Rubik Mono One', sans-serif" }}>POP ART AI</h1>
          <h2 className="text-2xl font-semibold text-muted-foreground" style={{ fontFamily: "'Rubik Mono One', sans-serif" }}>A tribute to Roy Lichtenstein</h2>
        </div>
        {showConfetti && <Confetti />}
        <ImagePromptInput 
          handleGenerateImage={handleGenerateImage} 
          isGenerating={isGenerating} 
          toggleSettings={toggleSettings}
          prompt={prompt}
          setPrompt={setPrompt}
          handleRandomize={handleRandomize}
        >
          <ImageGenerationSettingsPopover  
            isOpen={isSettingsOpen}
            onOpenChange={setIsSettingsOpen}
            handleSettingChange={handleSettingChange}
            settings={settings}
            toggleSettings={toggleSettings}
            />
        </ImagePromptInput>
        <PromptSuggestions onSuggestionClick={setPrompt} />
        <ImageGenerationDialog
          isOpen={showModal}
          onOpenChange={setShowModal}
          isGenerating={isGenerating}
          progress={progress}
          currentImages={currentImages}
          onSave={handleSave}
          onDiscard={handleDiscard}
        />
        <ImageGallery
          images={images}
        />
      </main>
  )
}
