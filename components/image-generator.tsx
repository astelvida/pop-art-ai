"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon, Loader2, Settings, Share2, Download, AlertCircle, Check, Trash2, Shuffle, Trash, CheckCircle, Flag, ArrowDownToLine, Share } from "lucide-react"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"
import { motion, AnimatePresence } from "framer-motion"
import { generatePopArtImage } from '@/ai/generate-image';

const suggestions = [
  "A serene landscape with mountains and a lake",
  "A futuristic cityscape at night",
  "A cute cartoon character in a whimsical forest",
  "An abstract painting with vibrant colors",
  "A realistic portrait of a historical figure",
]

const randomPrompts = [
  "A pop art comic book image in SPELL style of a woman standing alone in a dimly lit room, tears streaming down her face as she clutches a broken mirror. Speech bubble: 'How did it all go wrong?'",
  "A pop art comic book image in SPELL style of a man and woman in a heated argument, the man turning away in anger while the woman shouts, 'You never listened!' Their broken relationship is the focus.",
  "A pop art comic book image in SPELL style of a young woman staring out a rainy window, her reflection distorted by tears. Speech bubble: 'It’s always the same, isn’t it?' Sadness and despair fill the scene.",
  "A dark pop art comic book image in SPELL style of a man kneeling on the floor, holding his head in his hands, overwhelmed by his own thoughts. Speech bubble: 'I can’t take this anymore!'",
  "A pop art comic book image in SPELL style of two young lovers saying goodbye at a train station, the train’s shadow casting a line between them. Speech bubble: 'Goodbye forever.' Their faces are filled with regret.",
  "A pop art comic book image in SPELL style of a woman crying while applying lipstick in a broken compact mirror. Speech bubble: 'I have to smile through this, don’t I?' Despair is hidden under vibrant colors.",
  "A pop art comic book image in SPELL style of a man shouting in frustration, smashing his fist against a wall. Speech bubble: 'It’s all falling apart!' His anger contrasts with the bold, exaggerated lines.",
  "A pop art comic book image in SPELL style of a woman walking away from a shattered phone, tears running down her face. Speech bubble: 'I should have known you’d never call.' Broken pieces symbolize her emotional breakdown.",
  "A pop art comic book image in SPELL style of a woman standing in the rain, soaked and looking up at the sky. Speech bubble: 'Not again, not you.' Her face reflects anger and deep sorrow.",
  "A pop art comic book image in SPELL style of a couple, their backs turned to each other in a dark room filled with broken glass. Speech bubble from the woman: 'We were never meant to last, were we?' Both characters are lost in their own despair.",
]

const defaultImage = 'https://replicate.delivery/yhqm/4zciqh7pLvodJpk0f3Vz6Wh86qzRX1ChIWr3NcUe3jXb4mkTA/out-0.jpg'

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("")
  const [imageUrl, setImageUrl] = useState<string | null>(defaultImage)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const commandRef = useRef<HTMLDivElement>(null)

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
    // setImageUrl(null)

    try {
      const output = await generatePopArtImage(prompt)
      console.log(JSON.stringify(output, null, 2))
      setImageUrl(output[0])
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
            <ImageActions />
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
    </div>
  )
}

function ImageActions() {
  const actions = [
    { icon: Settings, label: "Tweak it" },
    { icon: Share, label: "Share" },
    { icon: ArrowDownToLine, label: "Download" },
    { icon: Flag, label: "Report" },
    { icon: CheckCircle, label: "Added" },
    { icon: Trash, label: "Delete" },
  ]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="absolute top-4 left-4 right-4 flex flex-wrap justify-center gap-2"
      >
        {actions.map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              variant="secondary"
              size="sm"
              className="flex items-center space-x-1"
            >
              <action.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{action.label}</span>
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  )
}

function SkeletonLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-muted animate-pulse">
      <div className="w-16 h-16 rounded-full bg-muted-foreground/20"></div>
    </div>
  )
}

function EmptyState({ error }: { error: string | null }) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">
        {error ? "Error" : "No image generated yet"}
      </h3>
      <p className="text-sm text-muted-foreground">
        {error || "Enter a prompt and click 'Generate Image' to create an image."}
      </p>
    </div>
  )
}