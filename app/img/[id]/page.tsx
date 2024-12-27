import { CloseButton } from '@/components/buttons/close-button'
import ImageViewContainer from '@/components/image-view-container'
import { Suspense } from 'react'

export default async function ImageFullPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const {
    id: imageId
  } = params;

  return (
    <main className='fixed inset-0 overflow-hidden'>
      <Suspense fallback={<div>Loading...</div>}>
        <ImageViewContainer imageId={imageId} />
      </Suspense>
      <CloseButton />
    </main>
  )
}
