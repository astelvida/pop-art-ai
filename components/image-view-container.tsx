import { getAiImage } from '@/actions/queries'
import { ImageView } from './image-view'
import { notFound } from 'next/navigation'

export default async function ImageViewContainer({ imageId }: { imageId: string }) {
  const image = await getAiImage(imageId)

  if (!image) notFound()

  return <ImageView image={image} />
}
