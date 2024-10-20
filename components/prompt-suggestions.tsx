import { Button } from '@/components/ui/button'
import prompts from '@/public/prompts.json'
import { ArrowTopRightIcon } from '@radix-ui/react-icons'
interface PromptSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void
}

export function PromptSuggestions({ onSuggestionClick }: PromptSuggestionsProps) {
  const truncateSuggestion = (suggestion: string, maxLength: number) => {
    return suggestion.length > maxLength ? suggestion.slice(0, maxLength - 3) + '...' : suggestion
  }
  const suggestions = prompts.sarcastic.slice(0, 5)
  return (
    <div className='flex flex-wrap items-center justify-center gap-2 space-x-2 pb-2'>
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant='outline'
          className='flex-shrink-0 rounded-full'
          onClick={() => onSuggestionClick(suggestion)}
        >
          <span className='text-s whitespace-nowrap text-muted-foreground'>{truncateSuggestion(suggestion, 50)}</span>
          <ArrowTopRightIcon className='ml-1 h-3 w-3' />
        </Button>
      ))}
    </div>
  )
}
