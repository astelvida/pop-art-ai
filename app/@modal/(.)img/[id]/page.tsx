import ImageViewContainer from '@/components/image-view-container'
import { ModalImage } from '@/components/modal-image'
import { Suspense } from 'react'

export default async function ImageModalPage({ params }: { params: { id: string } }) {
  const { id } = params
  return (
    <ModalImage>
      <Suspense fallback={<div>Loading...</div>}>
        <ImageViewContainer imageId={id} />
      </Suspense>
    </ModalImage>
  )
}
