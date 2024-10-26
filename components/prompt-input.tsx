'use client'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ArrowUp, SettingsIcon, Shuffle } from 'lucide-react'
import { useEffect, useMemo, useRef } from 'react'
import useWindowSize from '@/lib/hooks/use-window-size'
import { ArrowTopRightIcon } from '@radix-ui/react-icons'
import { randomPrompt, randomPrompts, shuffle } from '@/lib/utils'
import prompts from '@/lib/data/prompts.json'
import { SamplePromptTag } from '@/lib/types'
import { useSidebar } from '@/components/ui/sidebar'

interface PromptSuggestionsProps {
  setPrompt: (suggestion: string) => void
  category: string
}

interface PromptInputProps {
  handleGenerateImage: () => void
  isGenerating: boolean
  prompt: string
  setPrompt: (prompt: string) => void
  category: string
  children: React.ReactNode
}
export function PromptInput({
  handleGenerateImage,
  isGenerating,
  prompt,
  setPrompt,
  category,
  children,
}: PromptInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { width } = useWindowSize()
  const suggestions = useMemo(() => randomPrompts(category as SamplePromptTag), [category])
  const { toggleSidebar } = useSidebar()

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight()
    }
  }, [prompt])

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`
    }
  }

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value)
    // adjustHeight()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      handleGenerateImage()
    }

    if (width && width > 768) {
      textareaRef.current?.focus()
    }
  }

  const truncateSuggestion = (suggestion: string, maxLength: number) => {
    return suggestion.length > maxLength ? suggestion.slice(0, maxLength - 3) + '...' : suggestion
  }

  return (
    <>
      <form onSubmit={handleSubmit} className='mx-auto flex w-full gap-2 bg-background px-4 pb-4 md:max-w-3xl md:pb-6'>
        <div className='relative flex w-full flex-col gap-4'>
          <Textarea
            ref={textareaRef}
            placeholder={
              prompt.length > 0 ? '' : 'Write a pop art comic book scene or start with some of the suggestions below'
            }
            value={prompt}
            onChange={handlePromptChange}
            className='min-h-[24px] resize-none overflow-hidden rounded-xl border-none bg-muted px-4 pb-16 pr-16 pt-4 text-base focus-visible:ring-0 focus-visible:ring-offset-0'
            rows={3}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()

                if (isGenerating) {
                  // toast.error('Please wait for the model to finish its response!')
                } else {
                  handleSubmit(event)
                }
              }
            }}
            // className='text-md min-h-[150px] resize-none overflow-hidden rounded-2xl px-4 pb-16 pr-16 pt-4'
          />

          {/* <div className='absolute bottom-3 left-3 flex items-center space-x-2'> */}
          <Button
            // variant='secondary'
            // size='icon'
            className='absolute bottom-3 left-3 rounded-full [&_svg]:size-6'
            onClick={(e) => {
              e.preventDefault()
              toggleSidebar()
            }}
          >
            <SettingsIcon className='h-6 w-6' />
            <span>Settings</span>
            <span className='sr-only'>Open settings</span>
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='absolute right-2 top-2'
            onClick={(e) => {
              e.preventDefault()
              setPrompt(randomPrompt(category as SamplePromptTag))
              // adjustHeight()
            }}
            disabled={isGenerating}
          >
            <Shuffle className='h-4 w-4' />
            <span className='sr-only'>Randomize prompt</span>
          </Button>
          <Button
            type='submit'
            disabled={isGenerating || !prompt.trim()}
            size='icon'
            className='absolute bottom-4 right-4 rounded-full'
          >
            <ArrowUp className='h-4 w-4' />
            <span className='sr-only'>Generate Image</span>
          </Button>
        </div>
      </form>

      <div className='flex flex-wrap items-center justify-center gap-2 space-x-2 pb-2'>
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant='outline'
            className='flex-shrink-0 rounded-full'
            onClick={(e) => {
              e.preventDefault()
              setPrompt(suggestion)
              // adjustHeight()
            }}
          >
            <span className='text-s whitespace-nowrap text-muted-foreground'>{truncateSuggestion(suggestion, 50)}</span>
            <ArrowTopRightIcon className='ml-1 h-3 w-3' />
          </Button>
        ))}
      </div>
    </>
  )
}
