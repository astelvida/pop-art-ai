import { FullPageImageView } from '@/components/full-page-image-view'
import { ModalImage } from '@/components/modal-image'

export default async function PhotoModal({ params: { id: imageId } }: { params: { id: string } }) {
  return (
    <ModalImage>
      <FullPageImageView imageId={imageId} />
    </ModalImage>
  )
}
