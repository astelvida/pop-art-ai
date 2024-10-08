"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon, Loader2, Settings, Share2, Download, AlertCircle, Check, Trash2, Shuffle } from "lucide-react"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"
import { motion, AnimatePresence } from "framer-motion"

const suggestions = [
  "A serene landscape with mountains and a lake",
  "A futuristic cityscape at night",
  "A cute cartoon character in a whimsical forest",
  "An abstract painting with vibrant colors",
  "A realistic portrait of a historical figure",
]

const randomPrompts = [
  "A steampunk-inspired flying machine in the clouds",
  "A magical library with books floating in the air",
  "An underwater city with bioluminescent creatures",
  "A cyberpunk street scene with neon signs and hovering vehicles",
  "A surreal landscape with impossible geometry",
  "A cozy cabin in a snowy forest at twilight",
  "A futuristic space station orbiting a distant planet",
  "An ancient temple hidden in a dense jungle",
  "A whimsical tea party with anthropomorphic animals",
  "A post-apocalyptic cityscape reclaimed by nature",
]

export function ImageGeneratorComponent() {
  const [prompt, setPrompt] = useState("")
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
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
    setImageUrl(null)

    try {
      // This is a placeholder for the actual image generation API call
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate image")
      }

      const data = await response.json()
      setImageUrl(data.imageUrl)
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
    { icon: Settings, label: "Tweak it", color: "text-primary" },
    { icon: Share2, label: "Share", color: "text-primary" },
    { icon: Download, label: "Download", color: "text-primary" },
    { icon: AlertCircle, label: "Report", color: "text-primary" },
    { icon: Check, label: "Added", color: "text-green-500" },
    { icon: Trash2, label: "Delete", color: "text-red-500" },
  ]

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-4 left-4 right-4 flex flex-wrap justify-center gap-2 bg-black/50 p-2 rounded-lg"
      >
        {actions.map((action, index) => (
          <motion.button
            key={action.label}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors ${action.color}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <action.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{action.label}</span>
          </motion.button>
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