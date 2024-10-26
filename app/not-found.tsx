import Link from 'next/link'
import { Frown } from 'lucide-react'
import { Button } from '@/components/ui/button'
export default function NotFound() {
  return (
    <main className='h-full'>
      <div className='flex flex-col items-center justify-center gap-2'>
        <Frown className='h-10 w-10' />
        <h2 className='text-xl font-semibold'>404 Not Found</h2>
        <p>Oops! This page does not exist!</p>
        <Link href='/'>
          <Button asChild>
            <span>Go Back to Home</span>
          </Button>
        </Link>
      </div>
    </main>
  )
}
