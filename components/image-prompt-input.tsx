import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, ArrowUp, Shuffle } from "lucide-react";

interface ImagePromptInputProps {
  handleGenerateImage: () => void;
  isGenerating: boolean;
  prompt: string;
  setPrompt: (prompt: string) => void;
  handleRandomize: () => void;
  toggleSettings: () => void;
}

export function ImagePromptInput({  
  handleRandomize,
  handleGenerateImage,
  isGenerating,
  toggleSettings,
  prompt,
  setPrompt
}: ImagePromptInputProps) {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      handleGenerateImage();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Textarea
            placeholder="Enter your image prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
            className="min-h-[100px] pr-10 pb-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={handleRandomize}
            disabled={isGenerating}
          >
            <Shuffle className="h-4 w-4" />
            <span className="sr-only">Randomize prompt</span>
          </Button>
          <div className="absolute bottom-2 left-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={toggleSettings}
            >
              <SlidersHorizontal className="h-6 w-6" />
              <span className="sr-only">Open settings</span>
            </Button>
          </div>
          <Button
            type="submit"
            disabled={isGenerating || !prompt.trim()}
            className="absolute bottom-2 right-2 h-8 w-8 p-0"
          >
            <ArrowUp className="h-4 w-4" />
            <span className="sr-only">Generate Image</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
