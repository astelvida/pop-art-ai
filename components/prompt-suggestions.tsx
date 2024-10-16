import { Button } from "@/components/ui/button"
import { promptSuggestions } from '@/lib/form-data'

interface PromptSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void
}

export function PromptSuggestions({ onSuggestionClick }: PromptSuggestionsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-center text-muted-foreground">Or try out an example to get started!</h3>
      <div className="flex flex-wrap justify-center gap-2">
        {promptSuggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            className="flex items-center space-x-2 shadow-sm hover:shadow-md transition-shadow duration-200 suggestion-button"
            onClick={() => onSuggestionClick(suggestion.text)}
          >
            <suggestion.icon className="w-4 h-4" />
            <span>{suggestion.text}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
