// import { clerkClient } from '@clerk/nextjs/server'
import { Button } from '@/components/ui/button'
import { deleteAiImage, getAiImage, toggleFavoriteAiImage } from '@/actions/queries'
// import { HeartIcon, DownloadIcon, TrashIcon } from '@radix-ui/react-icons'
import Image from 'next/image'
import { Heart, Heart as HeartIcon, X } from 'lucide-react'
import { DownloadButton } from '@/components/download-button'
import { ExternalLinkIcon } from '@/components/external-link-icon'
import { ImageView } from './image-view'
import { notFound } from 'next/navigation'

export async function FullPageImageView({ imageId, children }: { imageId: string; children?: React.ReactNode }) {
  console.log('IMAGE', imageId)
  const image = await getAiImage(imageId)
  if (!image) notFound()

  return <ImageView image={image} toggleFavorite={toggleFavoriteAiImage.bind(null, image.id)} />
}
