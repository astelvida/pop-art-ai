import { getAiImage } from '@/actions/queries'
import { ImageView } from './image-view'
import { notFound } from 'next/navigation'

export async function FullPageImageView({ imageId }: { imageId: string }) {
  const image = await getAiImage(imageId)
  if (!image) notFound()

  return <ImageView image={image} />
}
