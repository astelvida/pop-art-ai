import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Save, Trash2, X, Download } from "lucide-react"


const sampleImages= ['/burning-farewell.jpg','/sarcastic-remarks.jpg', 'sarcastic-smirk.jpg', /* 'the-final-farewell.jpg' */]
                  // src={`/${image}`} 
interface ImageGenerationDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  isGenerating: boolean
  progress: number
  currentImages: string[]
  onSave: (image?: string) => void
  onDiscard: (image?: string) => void
  onDownload: (image?: string) => void
}

export function ImageGenerationDialog({
  isOpen,
  onOpenChange,
  isGenerating,
  progress,
  currentImages,
  onSave,
  onDiscard,
  onDownload
}: ImageGenerationDialogProps) {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)
  const [imageSize, setImageSize] = useState({ width: 300, height: 300 })

  useEffect(() => {
    const updateImageSize = () => {
      const width = Math.min(window.innerWidth * 0.4, 500)
      const height = Math.min(window.innerHeight * 0.6, 500)
      setImageSize({ width, height })
    }

    updateImageSize()
    window.addEventListener('resize', updateImageSize)
    return () => window.removeEventListener('resize', updateImageSize)
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[1200px]">
        <div className="flex flex-wrap items-center justify-center gap-8 max-h-[80vh] overflow-y-auto">
          {isGenerating ? (
            <div className="text-center w-full">
              <p className="mb-4">Generating your pop art masterpieces...</p>
              <Progress value={progress} className="w-[250px] mx-auto" />
            </div>
          ) : sampleImages.length > 0 ? (
            sampleImages.map((image, index) => (
              <div key={index} className="flex flex-col items-center">
                <h3 className="font-comic-sans text-xl mb-2 text-center">Image {index + 1}</h3>
                <img 
                  src={image} 
                  alt={`Generated image ${index + 1}`} 
                  style={{
                    maxWidth: `${imageSize.width}px`,
                    maxHeight: `${imageSize.height}px`,
                    width: 'auto',
                    height: 'auto'
                  }}
                  className="object-contain rounded-lg cursor-pointer mb-4"
                  onClick={() => setZoomedImage(image)}
                />
                <div className="flex space-x-2">
                  <Button variant="default" size="sm" onClick={() => onSave(image)}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDiscard(image)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Discard
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onDownload(image)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p>No images generated yet.</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onDiscard} disabled={isGenerating}>
            Discard All
          </Button>
          <Button onClick={onSave} disabled={isGenerating || currentImages.length === 0}>
            Save All to Gallery
          </Button>
        </DialogFooter>
      </DialogContent>
      {zoomedImage && (
        <Dialog open={!!zoomedImage} onOpenChange={() => setZoomedImage(null)}>
          <DialogContent className="max-w-none max-h-none w-auto h-auto p-0">
            <div className="relative">
              <img 
                src={zoomedImage} 
                alt="Zoomed image" 
                className="w-auto h-auto object-contain"
              />
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => setZoomedImage(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  )
}
