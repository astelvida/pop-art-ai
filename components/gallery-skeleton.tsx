import { Skeleton } from '@/components/ui/skeleton'

export function GallerySkeleton() {
  return (
    <div className='columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4'>
      {[...Array(12)].map((_, index) => (
        <div key={index} className='mb-5'>
          <Skeleton className='h-64 w-full rounded-lg' />
          <div className='mt-2'>
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='mt-1 h-3 w-1/2' />
          </div>
        </div>
      ))}
    </div>
  )
}
