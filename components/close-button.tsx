import React from 'react' // Ensure React is imported
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { handleClose } from '@/actions/queries'

export const CloseButton = () => {
  return (
    <form action={handleClose}>
      <input type='hidden' name='redirect' value='/' />
      <Button type='submit' className='absolute left-4 top-4 z-50' variant='secondary' size='icon'>
        <X className='h-5 w-5' />
      </Button>
    </form>
  )
}
