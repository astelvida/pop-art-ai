'use client'

import { Button } from '@/components/ui/button'
import { ArrowTopRightIcon } from '@radix-ui/react-icons'
import prompts from '@/lib/data/prompts.json'

interface PromptSuggestionsProps {
  setP: (suggestion: string) => void
}

export function PromptSuggestions({ setPrompt }: PromptSuggestionsProps) {
  const truncateSuggestion = (suggestion: string, maxLength: number) => {
    return suggestion.length > maxLength ? suggestion.slice(0, maxLength - 3) + '...' : suggestion
  }

  return (
    <div className='flex flex-wrap items-center justify-center gap-2 space-x-2 pb-2'>
      {prompts['complex'].map((suggestion, index) => (
        <Button
          key={index}
          variant='outline'
          className='flex-shrink-0 rounded-full'
          onClick={(e) => {
            e.preventDefault()
            setPrompt(suggestion)
          }}
        >
          <span className='text-s whitespace-nowrap text-muted-foreground'>{truncateSuggestion(suggestion, 50)}</span>
          <ArrowTopRightIcon className='ml-1 h-3 w-3' />
        </Button>
      ))}
    </div>
  )
}
