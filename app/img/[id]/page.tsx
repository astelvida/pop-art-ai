import { CloseButton } from '@/components/close-button'
import { FullPageImageView } from '@/components/full-page-image-view'

export default async function PhotoModal({ params: { id: imageId } }: { params: { id: string } }) {
  return (
    <main className='mx-auto max-w-[1960px] p-4'>
      <FullPageImageView imageId={imageId} />
      <CloseButton />
    </main>
  )
}
