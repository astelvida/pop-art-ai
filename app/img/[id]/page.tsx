import { CloseButton } from '@/components/buttons/close-button'
import { FullPageImageView } from '@/components/full-page-image-view'

export default async function PhotoModal({ params: { id: imageId } }: { params: { id: string } }) {
  return (
    <main className='fixed inset-0 overflow-hidden'>
      <FullPageImageView imageId={imageId} />
      <CloseButton />
    </main>
  )
}
