'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Save, Trash2, X, Download } from 'lucide-react'
import { DownloadButton } from '@/components/download-button'
import { Skeleton } from '@/components/ui/skeleton'

interface GenerationModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  isGenerating: boolean
  progress: number
  currentImage: string | null
  discardImage: () => void
  saveImage: () => void
  aspectRatio: string
}

export function GenerationModal({
  isOpen,
  onOpenChange,
  isGenerating,
  progress,
  currentImage,
  discardImage,
  saveImage,
  aspectRatio,
}: GenerationModalProps) {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)
  const [imageSize, setImageSize] = useState({ width: 300, height: 300 })

  const getSkeletonDimensions = () => {
    const [width, height] = aspectRatio.split(':').map(Number)
    const ratio = height / width
    const skeletonWidth = 400
    const skeletonHeight = skeletonWidth * ratio
    return { width: skeletonWidth, height: skeletonHeight }
  }

  const { width, height } = getSkeletonDimensions()

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='w-[95vw] max-w-[1200px]'>
        <div className='flex max-h-[80vh] items-center justify-center gap-8 overflow-y-auto'>
          <div className='relative'>
            {isGenerating ? (
              <>
                <Skeleton
                  className='mx-auto'
                  style={{
                    width: `${width}px`,
                    height: `${height}px`,
                  }}
                />
                <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4'>
                  <Progress value={progress} className='w-full' />
                  <p className='mt-2 text-center text-white'>{Math.round(progress)}% complete</p>
                </div>
              </>
            ) : currentImage ? (
              <div className='flex flex-col items-center'>
                <h3 className='font-comic-sans mb-2 text-center text-xl'>Generated Image</h3>
                <img
                  src={currentImage}
                  alt='Generated image'
                  style={{
                    maxWidth: `${width}px`,
                    maxHeight: `${height}px`,
                    width: 'auto',
                    height: 'auto',
                  }}
                  className='mb-4 cursor-pointer rounded-lg object-contain'
                  onClick={() => setZoomedImage(currentImage)}
                />
                <div className='flex space-x-2'>
                  <Button variant='destructive' size='sm' onClick={discardImage}>
                    <Trash2 className='mr-2 h-4 w-4' />
                    Discard Image
                  </Button>
                  <DownloadButton url={currentImage} />
                </div>
              </div>
            ) : (
              <p>No image generated yet.</p>
            )}
          </div>
        </div>
      </DialogContent>
      {zoomedImage && (
        <Dialog open={!!zoomedImage} onOpenChange={() => setZoomedImage(null)}>
          <DialogContent className='h-auto max-h-none w-auto max-w-none p-0'>
            <div className='relative'>
              <img src={zoomedImage} alt='Zoomed image' className='h-auto w-auto object-contain' />
              <Button
                variant='secondary'
                size='icon'
                className='absolute right-2 top-2'
                onClick={() => setZoomedImage(null)}
              >
                <X className='h-4 w-4' />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  )
}
