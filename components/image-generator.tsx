'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { ImagePromptInput } from '@/components/image-prompt-input'
import { PromptSuggestions } from '@/components/prompt-suggestions'
import { ImageGenerationDialog } from '@/components/image-generation-dialog'
import { ImageGallery } from '@/components/image-gallery'
import { AiImageType } from '@/db/schema'
import { addBulkAiImages, deleteAiImage, newImage, saveAiImage, toggleFavoriteAiImage } from '@/actions/queries'
import { generatePopArtImage } from '@/actions/ai-services'
import { Button } from './ui/button'
import prompts from '@/public/prompts.json'
import { ImageGenerationSettingsPopover } from './image-generation-settings-popover'
import { ImageGenerationOptions, ImageOrImages } from '@/lib/types'

// const sampleImages= ['/burning-farewell.jpg','/sarcastic-remarks.jpg', 'sarcastic-smirk.jpg', /* 'the-final-farewell.jpg' */]
// const sampleImages = ['https://utfs.io/f/DJ9iVbfnTNKnydv6GkHwMQAKVom5Hf1nUvRlrNPEha9pOijx', 'https://utfs.io/f/DJ9iVbfnTNKnd9yWhpGJM6OmhvEpnZ1qTaY5rkuGKP9wxfjW']
                  // src={`/${image}`} 
const Confetti = dynamic(() => import('react-confetti'), { ssr: false })

export function ImageGenerator({ images }: {images: AiImageType[]}) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentImages, setCurrentImages] = useState<string[]>([])
  const [showModal, setShowModal] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  
  // Image generation settings
  const [settings, setSettings] = useState<ImageGenerationOptions> ({
    aspectRatio: "1:1",
    numInferenceSteps: 28,
    guidanceScale: 3.5,
    promptStrength: 0.80,
    seed: "",
    outputFormat: "jpg",
    outputQuality: 90,
    numOutputs: 1
  })

  const toggleSettings = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsSettingsOpen(!isSettingsOpen)
  }

  const handleGenerateImage = async () => {
    setIsGenerating(true)
    setProgress(0)
    setShowModal(true)
    // setCurrentImages([])

    // Simulating image generation with a delay
    for (let i = 0; i <= 100; i += 10) {
      new Promise(resolve => setTimeout(resolve, 500)).then(() => setProgress(i))
    }

    try {
      const imageUrls = await generatePopArtImage(prompt, settings)
      setCurrentImages(imageUrls)
      console.dir(imageUrls)
      console.log(typeof imageUrls, Array.isArray(imageUrls))
      // Save all generated images
      // for (const imageUrl of imageUrls) {
      //   await saveAiImage({ url: imageUrl, prompt: prompt })
      // }
      
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000)
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

    const handleSave = async (data: ImageOrImages): Promise<void> => {
    if (typeof data === 'string') {
        console.log("String length:", data.length);
        await saveAiImage({ url: data, prompt: prompt }) 
    } else if (Array.isArray(data)) {
        console.log("Array length:", data.length);
        const saveImagePromises = data.map((item, index) => {
          return saveAiImage({ url: item, prompt: prompt }) 
        });
        await Promise.all(saveImagePromises)
        setShowModal(false)
        setPrompt('')
    } else {
        throw new Error("Invalid input type");
    }
}

  const handleDiscard = (data: ImageOrImages): void => {
    console.log("discarding data", typeof data, data)
    if (typeof data === 'string') {
      setCurrentImages(prevImages => {
        const updatedImages = prevImages.filter(img => img !== data)
        console.log({ prevImages, updatedImages})
        return updatedImages
      })
    } else if (Array.isArray(data)) {
      setCurrentImages([])
      setPrompt('')
      setShowModal(false)
    } else {
      throw new Error("Invalid input type");
    }
  } 
  
  const handleSettingChange = (key: keyof ImageGenerationOptions, value: any) => {
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
