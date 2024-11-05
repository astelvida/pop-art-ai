import ImageViewContainer from '@/components/image-view-container'
import { ModalImage } from '@/components/modal-image'
import { Suspense } from 'react'

export default async function ImageModalPage({ params: { id: imageId } }: { params: { id: string } }) {
  return (
    <ModalImage>
      <Suspense fallback={<div>Loading...</div>}>
        <ImageViewContainer imageId={imageId} />
      </Suspense>
    </ModalImage>
  )
}
