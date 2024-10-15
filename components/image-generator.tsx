"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon, Loader2, Shuffle } from "lucide-react"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"
import { generatePopArtImage } from '@/actions/ai-services';
import { ImageActions } from './ImageActions'
import { SkeletonLoader } from './SkeletonLoader'
import { EmptyState } from './EmptyState'

const suggestions = [
  "SMA, a woman cries silently in a crowded room, feeling completely invisible. She whispers, 'Can anyone see me?'",
  "SMA, a man gazes at his shattered reflection in the mirror, his face twisted in anger. He exclaims, 'This isn't who I am!'",
  "SMA, a persson wanders through a never-ending labyrinth, desperately searching for an escape. They murmur, 'Will I ever escape this maze?'",
  "SMA, a couple stands beneath a stormy sky, arguing intensely. She screams, 'You never listened!'",
  "SMA, a character rips apart a photograph with a bitter smile, their voice dripping with sarcasm as they say, 'Happily ever after—what a joke!'"
]

const randomPrompts = [
  "A pop art comic book image of a woman standing alone in a dimly lit room, tears streaming down her face as she clutches a broken mirror. Speech bubble: 'How did it all go wrong?'",
  "A pop art comic book image of a man and woman in a heated argument, the man turning away in anger while the woman shouts, 'You never listened!' Their broken relationship is the focus.",
  "A pop art comic book image of a young woman staring out a rainy window, her reflection distorted by tears. Speech bubble: 'It’s always the same, isn’t it?' Sadness and despair fill the scene.",
  "A dark pop art comic book image of a man kneeling on the floor, holding his head in his hands, overwhelmed by his own thoughts. Speech bubble: 'I can’t take this anymore!'",
  "A pop art comic book image of two young lovers saying goodbye at a train station, the train’s shadow casting a line between them. Speech bubble: 'Goodbye forever.' Their faces are filled with regret.",
  "A pop art comic book image of a woman crying while applying lipstick in a broken compact mirror. Speech bubble: 'I have to smile through this, don’t I?' Despair is hidden under vibrant colors.",
  "A pop art comic book image of a man shouting in frustration, smashing his fist against a wall. Speech bubble: 'It’s all falling apart!' His anger contrasts with the bold, exaggerated lines.",
  "A pop art comic book image of a woman walking away from a shattered phone, tears running down her face. Speech bubble: 'I should have known you’d never call.' Broken pieces symbolize her emotional breakdown.",
  "A pop art comic book image of a woman standing in the rain, soaked and looking up at the sky. Speech bubble: 'Not again, not you.' Her face reflects anger and deep sorrow.",
  "A pop art comic book image of a couple, their backs turned to each other in a dark room filled with broken glass. Speech bubble from the woman: 'We were never meant to last, were we?' Both characters are lost in their own despair.",
]

const defaultImage = 'https://replicate.delivery/yhqm/4zciqh7pLvodJpk0f3Vz6Wh86qzRX1ChIWr3NcUe3jXb4mkTA/out-0.jpg'

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("")
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const commandRef = useRef<HTMLDivElement>(null)


  useEffect(() => {
    console.log('imageUrl', imageUrl)
  })

  function downloadFile(url: string) {
    const link = document.createElement('a');
    link.href = '';
    link.download = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (commandRef.current && !commandRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setImageUrl(null)

    try {
      const output = await generatePopArtImage(prompt)
      console.log(JSON.stringify(output, null, 2))
      setImageUrl(output)
    } catch (err) {
      setError("An error occurred while generating the image.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value)
    setShowSuggestions(true)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion)
    setShowSuggestions(false)
  }

  const handleRandomize = () => {
    const randomPrompt = randomPrompts[Math.floor(Math.random() * randomPrompts.length)]
    setPrompt(randomPrompt)
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="aspect-video w-full border rounded-lg overflow-hidden bg-muted relative">
        {isLoading ? (
          <SkeletonLoader />
        ) : imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt="Generated image"
              className="w-full h-full object-cover"
            />
            {/* <ImageActions imageUrl={imageUrl} prompt={prompt} /> */}
          </>
        ) : (
          <EmptyState error={error} />
        )}
      </div>
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
          {showSuggestions && (
            <div ref={commandRef} className="absolute z-10 w-full mt-1">
              <Command className="border rounded-md shadow-md">
                <CommandGroup heading="Suggestions">
                  {suggestions
                    .filter((s) => s.toLowerCase().includes(prompt.toLowerCase()))
                    .map((suggestion) => (
                      <CommandItem
                        key={suggestion}
                        onSelect={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </Command>
            </div>
          )}
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

      {imageUrl && <ImageActions imageUrl={imageUrl} prompt={prompt} />}

    </div>
  )
}