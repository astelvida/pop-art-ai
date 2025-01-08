import Link from 'next/link'
import Image from 'next/image'
import { DownloadButton } from './buttons/download-button'
import { Skeleton } from '@/components/ui/skeleton'
import DeleteButton from './buttons/delete-button'
import LikeButton from './buttons/like-button'
import { getImages } from '@/actions/queries'
import { auth } from '@clerk/nextjs/server'

type PageProps = {
  tab?: 'explore' | 'favorites' | 'library'
}

type ImageResult = {
  id: number
  imageUrl: string
  aspectRatio: string
  prompt: string
  title: string | null | undefined
  caption: string | null
  description: string | null
  numLikes: number | null
  userId: string
  createdAt: Date
  isLikedByUser: boolean
}

export default async function Gallery({ tab = 'explore' }: PageProps) {
  const { userId } = await auth()
  const images = await getImages({ tab, userId })

  return (
    <div className="columns-1 gap-8 pt-8 sm:columns-2 xl:columns-3 2xl:columns-4">
      {images?.length > 0 &&
        images?.map((image: ImageResult) => (
          <div
            key={image.id}
            className="group relative mb-8 transform transition-all duration-500 ease-in-out hover:scale-[1.02]"
          >
            <div className="overflow-hidden rounded-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <Link
                href={`/img/${image.id}`}
                className="after:content after:shadow-highlight block w-full after:pointer-events-none after:absolute after:inset-0"
              >
                <Image
                  alt={`Generated image ${image.id}${image.title ? ` - ${image.title}` : ''}`}
                  className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
                  src={image.imageUrl}
                  width={720}
                  height={480}
                  quality={50}
                  loading="lazy"
                  sizes="(max-width: 640px) 60vw,
                  (max-width: 1280px) 40vw,
                  (max-width: 1536px) 25vw,
                  20vw"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-black bg-opacity-50 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <h3 className="mb-1 text-lg font-bold text-white">
                    {image.title ?? 'No title available'}
                  </h3>
                  <p className="text-sm text-white">
                    {image.caption ??
                      image.description?.substring(0, 100) ??
                      'No description available'}
                  </p>
                </div>
              </Link>
            </div>
            <div className="absolute right-4 top-4 flex space-x-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="flex items-center space-x-2 rounded-md bg-white bg-opacity-90 px-3 py-1 text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
                <p>{image.numLikes ?? 0} likes</p>
                <LikeButton
                  imageId={Number(image.id)}
                  initialLiked={image.isLikedByUser}
                  initialLikeCount={image.numLikes ?? 0}
                />
                <DeleteButton imageId={String(image.id)} />
                <DownloadButton url={image.imageUrl} title={image.title ?? undefined} />
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}

export function GallerySkeleton() {
  return (
    <div className="columns-1 gap-8 sm:columns-2 xl:columns-3 2xl:columns-4">
      {[...Array(12)].map((_, index) => (
        <div key={index} className="mb-8">
          <div className="overflow-hidden rounded-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
            <Skeleton className="h-64 w-full" />
            <div className="mt-2 p-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="mt-1 h-3 w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
