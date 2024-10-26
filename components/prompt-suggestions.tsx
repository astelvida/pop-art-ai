'use client'

import { Button } from '@/components/ui/button'
import { ArrowTopRightIcon } from '@radix-ui/react-icons'
import prompts from '@/lib/data/prompts.json'
import { shuffle } from '@/lib/utils'
interface PromptSuggestionsProps {
  setPrompt: (suggestion: string) => void
  category: string
}

export function PromptSuggestions({ setPrompt, category }: PromptSuggestionsProps) {
  const truncateSuggestion = (suggestion: string, maxLength: number) => {
    return suggestion.length > maxLength ? suggestion.slice(0, maxLength - 3) + '...' : suggestion
  }

  return (
    <div className='flex flex-wrap items-center justify-center gap-2 space-x-2 pb-2'>
      {prompts[category as keyof typeof prompts].slice(0, 5).map((suggestion, index) => (
        <Button
          key={suggestion.substring(0, 20)}
          variant='outline'
          className='flex-shrink-0 rounded-full'
          onClick={async (e) => {
            // e.preventDefault()
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
