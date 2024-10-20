import { Suspense } from 'react'
import { toggleFavoriteAiImage, deleteAiImage, getAiImages } from '@/actions/queries'
import { Button } from '@/components/ui/button'
import { Heart, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { DownloadButton } from './download-button'

export async function Gallery() {
  const images = await getAiImages()
  return (
    <div className='columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4'>
      {images.map((image) => (
        <div key={image.id} className='group relative mb-5'>
          <Link
            shallow
            // href={`/?photoId=${id}`}
            // as={`/img/${image.id}`}
            href={`/img/${image.id}`}
            className='after:content after:shadow-highlight group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg'
          >
            <Image
              alt={`Generated image ${image.id} - ${image.name}`}
              className='transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110'
              style={{ transform: 'translate3d(0, 0, 0)' }}
              placeholder={image.blurDataUrl ? 'blur' : 'empty'}
              blurDataURL={image.blurDataURL || undefined}
              src={image.url}
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
            <form action={toggleFavoriteAiImage.bind(null, image.id)}>
              <input type='hidden' name='imageId' value={image.id} />
              <Button type='submit' variant='secondary' size='icon'>
                <Heart className={`h-4 w-4 ${image.isFavorite ? 'fill-current' : ''}`} />
              </Button>
            </form>
            <form action={deleteAiImage.bind(null, image.id)}>
              <input type='hidden' name='imageId' value={image.id} />
              <Button type='submit' variant='secondary' size='icon'>
                <Trash2 className='h-4 w-4' />
              </Button>
            </form>
            <DownloadButton image={image} />
          </div>
        </div>
      ))}
    </div>
  )
}
