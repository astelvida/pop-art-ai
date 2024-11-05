import { deleteAiImage, toggleLike } from '@/actions/queries'
import { Button } from '@/components/ui/button'
import { Heart, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useUser } from '@clerk/nextjs'
import { DownloadButton } from './buttons/download-button'
import { Skeleton } from '@/components/ui/skeleton'
import { useMemo } from 'react'
import { AiImage, AiImageResult } from '@/db/schema'
import { use } from 'react'
import { useOptimistic } from 'react'
import { ActiveTab } from '@/lib/types'

export function GallerySkeleton() {
  return (
    <div className='columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4'>
      {[...Array(12)].map((_, index) => (
        <div key={index} className='mb-5'>
          <Skeleton className='h-64 w-full rounded-lg' />
          <div className='mt-2'>
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='mt-1 h-3 w-1/2' />
          </div>
        </div>
      ))}
    </div>
  )
}

export function Gallery({
  imagesPromise,
  activeTab,
}: {
  imagesPromise: Promise<AiImageResult[]>
  activeTab: ActiveTab
}) {
  const images = use(imagesPromise)
  const { user } = useUser()

  const [optimisticImages, updateOptimisticImages] = useOptimistic(images, (state, updatedImage: AiImageResult) => {
    const index = state.findIndex((img) => img.id === updatedImage.id)

    return [
      ...state.slice(0, index),
      {
        ...updatedImage,
      },
      ...state.slice(index + 1),
    ]
  })

  const filteredImages = useMemo(() => {
    return activeTab === 'myGenerations' ? optimisticImages.filter((img) => img.userId === user?.id) : optimisticImages
  }, [activeTab, optimisticImages, user?.id])

  return (
    <div className='columns-1 gap-4 pt-8 sm:columns-2 xl:columns-3 2xl:columns-4'>
      {filteredImages.map((image) => (
        <div key={image.id} className='group relative mb-5'>
          <Link
            href={`/img/${image.id}`}
            className='after:content after:shadow-highlight group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg'
          >
            <Image
              alt={`Generated image ${image.id} - ${image.title}`}
              style={{ transform: 'translate3d(0, 0, 0)' }}
              className='transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110'
              src={image.imageUrl}
              width={720}
              height={480}
              priority
              sizes='(max-width: 640px) 100vw,
                (max-width: 1280px) 50vw,
                (max-width: 1536px) 33vw,
                25vw'
            />
            <div className='absolute inset-0 flex flex-col justify-end rounded-lg bg-black bg-opacity-50 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
              <h3 className='mb-1 text-lg font-semibold text-white'>{image.title || 'No title available'}</h3>
              <p className='text-sm text-white'>
                {image.caption || image.description?.substring(0, 100) || 'No description available'}
              </p>
            </div>
          </Link>
          <div className='absolute right-2 top-2 flex space-x-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
            <p className='rounded-md bg-muted px-2 py-1 text-sm'>{image.numLikes} likes</p>
            <form
              action={async () => {
                updateOptimisticImages({
                  ...image,
                  isLikedByUser: !image.isLikedByUser,
                  numLikes: image.isLikedByUser ? image.numLikes! - 1 : image.numLikes! + 1,
                })
                await toggleLike(image.id)
              }}
              name='toggleLike'
            >
              <Button type='submit' variant='secondary' size='icon'>
                <Heart className={`h-4 w-4 ${image.isLikedByUser ? 'fill-current' : ''}`} />
              </Button>
            </form>

            {user?.id === image.userId && (
              <form
                action={async (formData: FormData) => {
                  await deleteAiImage(Number(image.id))
                }}
                name='deleteAiImage'
              >
                <input type='hidden' name='imageId' value={image.id} />
                <Button type='submit' variant='secondary' size='icon'>
                  <Trash2 className='h-4 w-4' />
                </Button>
              </form>
            )}
            <DownloadButton url={image.imageUrl} title={image.title} />
          </div>
        </div>
      ))}
    </div>
  )
}
