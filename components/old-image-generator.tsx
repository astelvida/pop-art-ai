"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Shuffle } from "lucide-react"
import { generatePopArtImage } from '@/actions/ai-services';
import { ImageActions } from './ImageActions'
import { SkeletonLoader } from './SkeletonLoader'
import { EmptyState } from './EmptyState'
import Image from "next/image"
import { saveAiImage } from "@/actions/queries"



export function OldImageGenerator() {
  const [prompt, setPrompt] = useState("")œ
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setImageUrl(null)

    try {
      const output = await generatePopArtImage(prompt)
      setImageUrl(output)
      await saveAiImage({ url: output, prompt })
    } catch (err) {
      setError("An error occurred while generating the image.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value)
  }

  const handleRandomize = () => {
    const randomPrompt = randomPrompts[Math.floor(Math.random() * randomPrompts.length)]
    setPrompt(randomPrompt)
  }

  const handleDelete = (index: number) => {
    // setGeneratedImages(prevImages => prevImages.filter((_, i) => i !== index))
  }

  const handleSave = (index: number) => {
    // Implement save functionality
    console.log(`Saving image at index ${index}`)
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Textarea
            placeholder="Enter your image prompt here..."
            value={prompt}
            onChange={handlePromptChange}
            className="min-h-[100px] pr-10"
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={handleRandomize}
            disabled={isLoading}
          >
            <Shuffle className="h-4 w-4" />
            <span className="sr-only">Randomize prompt</span>
          </Button>
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Generate Image"
          )}
        </Button>
      </form>
      <div className="aspect-square w-[300px] h-[300px] border rounded-lg overflow-hidden bg-muted relative">
        {isLoading ? (
          <SkeletonLoader />
        ) : imageUrl ? (
          <Image
            src={imageUrl}
            alt="Generated image"
            width={300}
            height={300}
          />
        ) : (
          <EmptyState error={error} />
        )}
      </div>
      {imageUrl && <ImageActions imageUrl={imageUrl} prompt={prompt} />}
    </div>
  )
}
