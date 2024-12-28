import Link from 'next/link'
import Image from 'next/image'
import { DownloadButton } from './buttons/download-button'
import { Skeleton } from '@/components/ui/skeleton'
import { AiImageResult } from '@/db/schema'
import DeleteButton from './buttons/delete-button'
import { LikeButton } from './LikeButton'
import { getImages } from '@/actions/queries'

type PageProps = {
  tab?: 'library' | 'favorites' | '' 
  q?: string
}


export default async function Gallery({ tab = '', q = ''}: PageProps) {
  const images = await getImages(q)

  
  return (
    <div className='columns-1 gap-4 pt-8 sm:columns-2 xl:columns-3 2xl:columns-4'>
      {images?.length > 0 && images?.map((image) => (
        <div key={image.id} className='group relative mb-5'>
          <Link
            href={`/img/${image.id}`}
            className='after:content after:shadow-highlight m b-5 group relative block w-full after:pointer-events-none after:absolute after:inset-0 after:rounded-lg'
          >
            <Image
              alt={`Generated image ${image.id} - ${image.title}`}
              style={{ transform: 'translate3d(0, 0, 0)' }}
              className='transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110'
              src={image.imageUrl}
              width={720}
              height={480}
              quality={50}
              loading='lazy'
              sizes='(max-width: 640px) 60vw,
                (max-width: 1280px) 40vw,
                (max-width: 1536px) 25vw,
                20vw'
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
            <LikeButton imageId={image.id} initialLiked={image.isLikedByUser} initialLikeCount={image.numLikes} />    
            <DeleteButton imageId={image.id} />
            <DownloadButton url={image.imageUrl} title={image.title} />
          </div>
          </div>
      ))}
    </div>
  )
}




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
