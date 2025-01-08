'use client'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Paintbrush, Wand2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { randomPrompt } from '@/lib/utils'
import { SamplePromptTag } from '@/lib/types'
import { REGROUPED_PROMPTS as prompts } from '@/lib/data/prompts'
import { toast } from 'sonner'

const suggestions = Object.keys(prompts).map((category) => {
  const [name] = category.split(': ')
  return {
    id: category,
    name,
  }
})

interface PromptInputProps {
  handleGenerateImage: () => void
  isGenerating: boolean
  prompt: string
  setPrompt: (prompt: string) => void
  settingsTrigger: React.ReactNode
}

export default function PromptForm({
  handleGenerateImage,
  isGenerating,
  prompt,
  setPrompt,
  settingsTrigger,
}: PromptInputProps) {
  const [isSticky, setIsSticky] = useState(false)
  const stickyRef = useRef<HTMLDivElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      handleGenerateImage()
    }
  }

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      if (isGenerating) {
        toast.info('Please wait for the model to finish its response!')
      } else {
        handleSubmit(event)
      }
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (stickyRef.current) {
        const { top } = stickyRef.current.getBoundingClientRect()
        setIsSticky(top <= 0)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      ref={stickyRef}
      className={`sticky top-0 z-10 transition-all duration-300 ease-in-out
          ${isSticky ? 'bg-white/80 backdrop-blur-md shadow-lg' : ''}`}
    >
      <div className="container mx-auto max-w-4xl px-4 py-4">
        <div className="relative mb-4">
          <div className="absolute top-4 left-3 pointer-events-none">
            <Paintbrush className="h-5 w-5 text-gray-400" />
          </div>
          <div className="relative">
            <Textarea
              placeholder="Start with one of the suggested themes below or write your own"
              value={prompt}
              onChange={handlePromptChange}
              className="pl-10 pr-32 py-4 h-24 rounded-none border-4 border-black focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 ease-in-out resize-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-md"
              onKeyDown={handleKeyDown}
            />

            <div className="absolute right-4 bottom-4 flex items-center space-x-2">
              {settingsTrigger}
              <Button
                onClick={handleGenerateImage}
                disabled={isGenerating}
                className="rounded-none px-4 py-2 bg-black text-white font-bold transition-all duration-300 ease-in-out hover:bg-purple-600 hover:translate-x-1 hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating...
                  </div>
                ) : (
                  <>
                    <Wand2 className="h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {suggestions.map((suggestedCategory) => (
            <button
              key={suggestedCategory.id}
              onClick={() => setPrompt(randomPrompt(suggestedCategory.id as SamplePromptTag))}
              className="px-3 py-1 bg-white text-black border-2 border-black rounded-full text-sm font-bold hover:bg-purple-100 transition-colors duration-150 ease-in-out shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              {suggestedCategory.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
