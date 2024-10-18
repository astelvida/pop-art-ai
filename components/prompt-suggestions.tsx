import { Button } from "@/components/ui/button";
import prompts from "@/public/prompts.json";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
interface PromptSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

export function PromptSuggestions({
  onSuggestionClick,
}: PromptSuggestionsProps) {
  const truncateSuggestion = (suggestion: string, maxLength: number) => {
    return suggestion.length > maxLength
      ? suggestion.slice(0, maxLength - 3) + "..."
      : suggestion;
  };
  const suggestions = prompts.emotional.slice(0, 3)
  return (
    <div className="flex items-center space-x-2 pb-2 flex-wrap gap-2 justify-center">
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
            className="rounded-full flex-shrink-0"
          onClick={() => onSuggestionClick(suggestion)}
        >
          <span className="text-s text-muted-foreground whitespace-nowrap">{truncateSuggestion(suggestion, 50)}</span>
          <ArrowTopRightIcon className="ml-1 h-3 w-3" />
        </Button>
      ))}
    </div>
  );
}