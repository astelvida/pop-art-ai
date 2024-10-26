import { deleteAiImage } from '@/actions/queries'
import { toggleLike } from '@/actions/actions'
import { Button } from '@/components/ui/button'
import { Heart, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useUser } from '@clerk/nextjs'
import { DownloadButton } from './buttons/download-button'

export function Gallery({ images }: { images: AiImage[] }) {
  const user = useUser()
  return (
    <div className='columns-1 gap-4 pt-8 sm:columns-2 xl:columns-3 2xl:columns-4'>
      {images.map((image) => (
        <div key={image.id} className='group relative mb-5'>
          <Link
            href={`/img/${image.id}`}
            className='after:content after:shadow-highlight group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg'
          >
            <Image
              alt={`Generated image ${image.id} - ${image.title}`}
              className='transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110'
              style={{ transform: 'translate3d(0, 0, 0)' }}
              // placeholder={image.blurDataUrl ? 'blur' : 'empty'}
              // blurDataURL={image.blurDataURL || undefined}
              src={image.imageUrl}
              width={720}
              height={480}
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
            <form action={toggleLike.bind(null, image.id)} name='toggleLike'>
              {/* <input type='hidden' name='imageId' value={image.id} /> */}
              <Button type='submit' variant='secondary' size='icon'>
                <Heart className={`h-4 w-4 ${image.isLikedByUser ? 'fill-current' : ''}`} />
              </Button>
            </form>
            {/* <LikeButton 
              imageId={image.id} 
              initialLikes={image.numLikes || 0} 
              initialLikedState={image.isLikedByUser || false} 
            />     */}

            {user?.user?.id === image.userId && (
              <form action={deleteAiImage.bind(null, Number(image.id))} name='deleteAiImage'>
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
