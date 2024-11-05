import { CloseButton } from '@/components/buttons/close-button'
import ImageViewContainer from '@/components/image-view-container'
import { Suspense } from 'react'

export default async function ImageFullPage({ params: { id: imageId } }: { params: { id: string } }) {
  return (
    <main className='fixed inset-0 overflow-hidden'>
      <Suspense fallback={<div>Loading...</div>}>
        <ImageViewContainer imageId={imageId} />
      </Suspense>
      <CloseButton />
    </main>
  )
}
