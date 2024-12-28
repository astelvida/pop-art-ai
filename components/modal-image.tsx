'use client'

import { Dialog, DialogContent, DialogClose, DialogPortal, DialogOverlay, DialogTitle } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

export function ModalImage({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  function onClose(e: React.MouseEvent<HTMLButtonElement>) {
    router.back()
  }

  return (
    <Dialog open={true} modal={true}>
      <DialogPortal container={document.getElementById('modal-root')}>
        <DialogOverlay />
        <DialogContent hideCloseButton={true} className='mx-auto h-full max-w-[1960px] border-none'>
          <DialogTitle className='text-center italic' aria-hidden={true}>IMAGE DETAILS</DialogTitle>      
          {children}
          <DialogClose asChild>
            <Button
              className='absolute left-4 top-4 z-50 data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'
              variant='secondary'
              size='icon'
              onClick={onClose}
            >
              <X className='h-5 w-5' />
            </Button>
          </DialogClose>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
