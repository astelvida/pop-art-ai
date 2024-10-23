import { getAiImage, toggleFavoriteAiImage } from '@/actions/queries'
import { ImageView } from './image-view'
import { notFound } from 'next/navigation'

export async function FullPageImageView({ imageId, children }: { imageId: string; children?: React.ReactNode }) {
  const image = await getAiImage(imageId)
  if (!image) notFound()

  return <ImageView image={image} toggleFavorite={toggleFavoriteAiImage} />
}
