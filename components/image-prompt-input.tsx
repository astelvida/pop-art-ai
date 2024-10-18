import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, ArrowUp, Shuffle, Settings } from "lucide-react";
import { useEffect, useRef } from "react";

interface ImagePromptInputProps {
  handleGenerateImage: () => void;
  isGenerating: boolean;
  prompt: string;
  setPrompt: (prompt: string) => void;
  handleRandomize: () => void;
  children: React.ReactNode;
}

export function ImagePromptInput({
  handleRandomize,
  handleGenerateImage,
  isGenerating,
  prompt,
  setPrompt,
  children,
}: ImagePromptInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "autåo";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [prompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      handleGenerateImage();
    }
  };

  return (
    <div className="max-w-2xl mx-auto pr-4 space-y-1">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            placeholder="Ask v0 a question..."
            value={prompt}
            onChange={handlePromptChange}
            className="min-h-[100px] pb-16 pt-4 px-4 pr-16 rounded-2xl resize-none overflow-hidden"
          />

          <div className="absolute bottom-3 left-3 flex items-center space-x-2">
            {children}
          </div>
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
            <Button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              size="icon"
              className="absolute bottom-3 right-3 rounded-full"
            >
              <ArrowUp className="h-4 w-4" />
              <span className="sr-only">Generate Image</span>
            </Button>
        </div>
      </form>
    </div>
  );
}
