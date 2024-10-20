import { FullPageImageView } from '@/components/full-page-image-view'
import { ModalImage } from '@/components/modal-image'

export default async function PhotoModal({ params: { id: imageId } }: { params: { id: string } }) {
  console.log('IMAGE ID', imageId)
  return (
    <ModalImage>
      <FullPageImageView imageId={imageId} />
    </ModalImage>
  )
}
