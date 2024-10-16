import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface ImageGenerationDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  isGenerating: boolean
  progress: number
  currentImage: string | null
  onSave: () => void
  onDiscard: () => void
}

export function ImageGenerationDialog({
  isOpen,
  onOpenChange,
  isGenerating,
  progress,
  currentImage,
  onSave,
  onDiscard
}: ImageGenerationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isGenerating ? 'Generating Image' : 'Generated Image'}</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center h-[300px]">
          {isGenerating ? (
            <div className="text-center">
              <p className="mb-4">Generating your pop art masterpiece...</p>
              <Progress value={progress} className="w-[250px]" />
            </div>
          ) : currentImage ? (
            <img src={currentImage} alt="Generated image" className="max-w-full max-h-full object-contain rounded-lg" />
          ) : (
            <p>No image generated yet.</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onDiscard} disabled={isGenerating}>
            Discard
          </Button>
          <Button onClick={onSave} disabled={isGenerating || !currentImage}>
            Save to Gallery
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
