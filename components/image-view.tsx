'use client'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Heart, X } from 'lucide-react'
import { DownloadButton } from '@/components/buttons/download-button'
import { ExternalLinkButton } from '@/components/buttons/external-link-button'
import { useState } from 'react'
import { type AiImage } from '@/db/schema'
import LikeButton from '@/components/buttons/like-button'
export function ImageView({ image }: { image: AiImage }) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className='bg-grey-50 fixed inset-0 flex flex-col overflow-hidden md:flex-row'>
      {/* Updated overlay with dark gray gradients and subtle effects */}
      <div className='absolute inset-0 z-10'>
        <div className='via-gray-150 absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-100'></div>
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-100/20 via-gray-200/15 to-transparent'></div>
        <div className='absolute inset-0 backdrop-blur-3xl'></div>
        <div className='absolute inset-0 bg-gray-100/20'></div>
      </div>

      <div
        className={`relative z-20 flex flex-grow transition-all duration-300 ease-in-out ${isOpen ? 'md:mr-[400px]' : ''}`}
      >
        <div className='relative flex h-full w-full flex-col items-center justify-center'>
          {/* Image container */}
          <div className='relative h-full w-full md:h-[80vh] md:max-h-[80%] md:max-w-[90%] md:p-4'>
            <Image
              className='object-contain'
              src={image.imageUrl}
              alt={image.title || 'AI generated image'}
              layout='fill'
              priority
            />
          </div>
          <div className='mt-6 hidden md:flex'>
            <Button variant='outline' className='w-full p-6 font-bangers text-xl' onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? 'Hide Details' : 'Show Details'}
            </Button>
          </div>
          <div className='absolute right-4 top-4 flex flex-row space-x-2 md:right-6 md:top-4'>
            <ExternalLinkButton url={image.imageUrl} />
            <DownloadButton url={image.imageUrl} title={image.title} />
            <LikeButton
              imageId={image.id}
              initialLikes={image.numLikes || 0}
              initialLikedState={image.liked || false}
              showLikes={false}
            />
          </div>
        </div>
      </div>
      <div
        className={`relative z-20 w-full overflow-y-auto border-l border-gray-200 bg-white p-4 md:fixed md:bottom-0 md:right-0 md:top-0 md:w-[400px] md:transform md:transition-transform md:duration-300 md:ease-in-out ${isOpen ? 'md:translate-x-0' : 'md:translate-x-full'} `}
      >
        <div className='md:hidden'>
          <h2 className='mb-6 font-bangers text-4xl font-bold'>{image.title}</h2>
          <p className='mb-4 text-base font-medium'>{image.caption}</p>
          <p className='mb-4 text-sm text-gray-600'>{image.description}</p>
        </div>
        <div className='hidden md:block'>
          <Button
            variant='ghost'
            size='icon'
            className='absolute right-4 top-4'
            onClick={() => setIsOpen(false)}
            aria-label='Close details'
          >
            <X className='h-4 w-4' />
          </Button>
          <h2 className='mb-6 font-bangers text-4xl font-bold'>{image.title}</h2>
          <p className='mb-4 text-base font-semibold'>{image.caption}</p>
          <p className='mb-4 text-base text-gray-600'>{image.description}</p>
        </div>
      </div>
    </div>
  )
}
