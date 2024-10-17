import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface ImageGenerationDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  isGenerating: boolean
  progress: number
  currentImages: string[]
  onSave: () => void
  onDiscard: () => void
}

export function ImageGenerationDialog({
  isOpen,
  onOpenChange,
  isGenerating,
  progress,
  currentImages,
  onSave,
  onDiscard
}: ImageGenerationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isGenerating ? 'Generating Images' : 'Generated Images'}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-wrap items-center justify-center gap-4 max-h-[400px] overflow-y-auto">
          {isGenerating ? (
            <div className="text-center w-full">
              <p className="mb-4">Generating your pop art masterpieces...</p>
              <Progress value={progress} className="w-[250px] mx-auto" />
            </div>
          ) : currentImages.length > 0 ? (
            currentImages.map((image, index) => (
              <img 
                key={index} 
                src={image} 
                alt={`Generated image ${index + 1}`} 
                className="max-w-[200px] max-h-[200px] object-contain rounded-lg"
              />
            ))
          ) : (
            <p>No images generated yet.</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onDiscard} disabled={isGenerating}>
            Discard
          </Button>
          <Button onClick={onSave} disabled={isGenerating || currentImages.length === 0}>
            Save to Gallery
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
