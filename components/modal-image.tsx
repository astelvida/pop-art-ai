'use client'

import { Dialog, DialogContent, DialogClose, DialogPortal, DialogOverlay } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

export function ModalImage({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  // const [isOpen, setIsOpen] = useState(true)

  function onClose() {
    router.back()
  }

  return (
    <Dialog open={true} modal={true}>
      <DialogPortal container={document.getElementById('modal-root')}>
        <DialogOverlay />
        <DialogContent hideCloseButton={true} className='mx-auto h-full max-w-[1960px] border-none'>
          {children}
          <DialogClose asChild>
            <Button className='absolute left-4 top-4 z-50' variant='secondary' size='icon' onClick={onClose}>
              <X className='h-5 w-5' />
            </Button>
          </DialogClose>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
