'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { ImagePromptInput } from '@/components/image-prompt-input'
import { PromptSuggestions } from '@/components/prompt-suggestions'
import { ImageGenerationDialog } from '@/components/image-generation-dialog'
import { ImageGallery } from '@/components/image-gallery'
import { AiImageType } from '@/db/schema'
import { additionalPrompts, placeholderImages } from '@/lib/form-data'
import { ImageGenerationSettings } from '@/components/image-generation-settings'
import { deleteAiImage, newImage, saveAiImage, toggleFavoriteAiImage } from '@/actions/queries'
import { generatePopArtImage } from '@/actions/ai-services'

const Confetti = dynamic(() => import('react-confetti'), { ssr: false })

export function ImageGenerator({ images }: {images: AiImageType[]}) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentImages, setCurrentImages] = useState<string[]>([])
  const [showModal, setShowModal] = useState(false)
  // const [images, setImages] = useState(placeholderImages)
  const [prompt, setPrompt] = useState('')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // Image generation settings
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [numInferenceSteps, setNumInferenceSteps] = useState(28)
  const [guidanceScale, setGuidanceScale] = useState(3.5)
  const [promptStrength, setPromptStrength] = useState(0.8)
  const [seed, setSeed] = useState('')
  const [outputFormat, setOutputFormat] = useState('jpg')
  const [outputQuality, setOutputQuality] = useState(90)
  const [numOutputs, setNumOutputs] = useState(2)

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
      const options = {
        aspectRatio,
        numInferenceSteps,
        guidanceScale,
        promptStrength,
        seed,
        outputFormat,
        outputQuality,
        numOutputs
      }
      console.log({options})
      const imageUrls = await generatePopArtImage(prompt, options)
      setCurrentImages(imageUrls)
      
      // Save all generated images
      for (const imageUrl of imageUrls) {
        await saveAiImage({ url: imageUrl, prompt: prompt })
      }

      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000)
    } catch (err) { 
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }
  const handleRandomize = () => {
    const randomPrompt =
      additionalPrompts[Math.floor(Math.random() * additionalPrompts.length)];
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

  const handleFavorite = (imageId: number) => {
    toggleFavoriteAiImage(imageId)
  }

  const handleDelete = (id: number) => {
    deleteAiImage(id)
  }

  const handleDownload = async (imageUrl: string, name: string | null) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };


  return (


      <main className="flex-grow container mx-auto p-4 space-y-8">
        <div className="text-center mb-8">
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
        />
        <ImageGenerationSettings
          isOpen={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          numInferenceSteps={numInferenceSteps}
          setNumInferenceSteps={setNumInferenceSteps}
          guidanceScale={guidanceScale}
          setGuidanceScale={setGuidanceScale}
          promptStrength={promptStrength}
          setPromptStrength={setPromptStrength}
          seed={seed}
          setSeed={setSeed}
          outputFormat={outputFormat}
          setOutputFormat={setOutputFormat}
          outputQuality={outputQuality}
          setOutputQuality={setOutputQuality}
          numOutputs={numOutputs}
          setNumOutputs={setNumOutputs}
        />
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
          onFavorite={handleFavorite}
          onDelete={handleDelete}
          onDownload={handleDownload}
        />
      </main>
  )
}
