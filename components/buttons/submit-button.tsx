'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus()

  return (
    <Button type={pending ? 'button' : 'submit'} aria-disabled={pending} className='relative'>
      {children}
      {pending && (
        <span className='absolute right-4 animate-spin'>
          <Loader2 />
        </span>
      )}
      <span aria-live='polite' className='sr-only' role='status'>
        {pending ? 'Loading' : 'Submit form'}
      </span>
    </Button>
  )
}
