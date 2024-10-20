'use client'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ArrowUp, Shuffle } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface PromptInputProps {
  handleGenerateImage: () => void
  isGenerating: boolean
  prompt: string
  setPrompt: (prompt: string) => void
  handleRandomize: (category: string) => void
  children: React.ReactNode
}

export function PromptInput({
  handleRandomize,
  handleGenerateImage,
  isGenerating,
  prompt,
  setPrompt,
  children,
}: PromptInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value)
    adjustTextareaHeight()
  }

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [prompt])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      handleGenerateImage()
    }
  }

  return (
    <div className='mx-auto max-w-2xl space-y-1 pr-4'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='relative'>
          <Textarea
            ref={textareaRef}
            defaultValue={prompt}
            placeholder={
              prompt.length > 0 ? '' : 'Write a pop art comic book scene or start with some of the suggestions below'
            }
            value={prompt}
            onChange={handlePromptChange}
            className='min-h-[100px] resize-none overflow-hidden rounded-2xl px-4 pb-16 pr-16 pt-4'
          />

          <div className='absolute bottom-3 left-3 flex items-center space-x-2'>{children}</div>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='absolute right-2 top-2'
            onClick={handleRandomize}
            disabled={isGenerating}
          >
            <Shuffle className='h-4 w-4' />
            <span className='sr-only'>Randomize prompt</span>
          </Button>
          <Button
            type='submit'
            disabled={isGenerating || !prompt.trim()}
            size='icon'
            className='absolute bottom-3 right-3 rounded-full'
          >
            <ArrowUp className='h-4 w-4' />
            <span className='sr-only'>Generate Image</span>
          </Button>
        </div>
      </form>
    </div>
  )
}
