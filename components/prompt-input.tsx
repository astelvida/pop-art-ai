'use client'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ArrowUp, SettingsIcon, Shuffle } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import useWindowSize from '@/hooks/use-window-size'
import { ArrowTopRightIcon } from '@radix-ui/react-icons'
import { randomPrompt, randomPrompts, shuffle } from '@/lib/utils'
import { SamplePromptTag } from '@/lib/types'
import { useSidebar } from '@/components/ui/sidebar'
import { useToast } from '@/hooks/use-toast'
import prompts from '@/lib/data/prompts.json'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
interface PromptSuggestionsProps {
  setPrompt: (suggestion: string) => void
  category: string
}

interface PromptInputProps {
  handleGenerateImage: () => void
  isGenerating: boolean
  prompt: string
  setPrompt: (prompt: string) => void
  children?: React.ReactNode
}
export function PromptInput({ handleGenerateImage, isGenerating, prompt, setPrompt, children }: PromptInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { width } = useWindowSize()
  const [promptCategory, setPromptCategory] = useState<keyof typeof prompts>('complex')
  const { toggleSidebar } = useSidebar()
  const { toast } = useToast()
  const [suggestions, setSuggestions] = useState<string[]>([])

  // Use useCallback to memoize the function
  const generateSuggestions = useCallback(() => {
    const newSuggestions = randomPrompts(promptCategory as SamplePromptTag)
    setSuggestions(newSuggestions)
  }, [promptCategory])

  // Use useEffect to generate suggestions on mount and when promptCategory changes
  useEffect(() => {
    generateSuggestions()
  }, [generateSuggestions])

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
    adjustHeight()
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
      <form onSubmit={handleSubmit} className='mx-auto flex w-full gap-2 bg-background px-3 pb-1 md:max-w-3xl md:pb-2'>
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
                  toast({
                    title: 'Please wait for the model to finish its response!',
                  })
                } else {
                  handleSubmit(event)
                }
              }
            }}
          />
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
            Settings
            <span className='sr-only'>Open settings</span>
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='absolute right-2 top-2'
            onClick={(e) => {
              e.preventDefault()
              setPrompt(randomPrompt(promptCategory as SamplePromptTag))
              adjustHeight()
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
          <div className='absolute bottom-3 right-10'>
            {/* <Select value={promptCategory} onValueChange={(value) => setPromptCategory(value as keyof typeof prompts)}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Select prompt category' />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(prompts).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}
          </div>
        </div>
      </form>
      {/* const NoSSR = dynamic(() => import('../components/no-ssr'), { ssr: false }) */}

      <div className='flex flex-wrap justify-center gap-2 space-x-2 pb-2'>
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant='outline'
            className='flex-shrink-0 rounded-full'
            onClick={(e) => {
              e.preventDefault()
              setPrompt(suggestion)
              adjustHeight()
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
