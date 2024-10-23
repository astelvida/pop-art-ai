'use client'
// import { clerkClient } from '@clerk/nextjs/server'
import { Button } from '@/components/ui/button'
// import { HeartIcon, DownloadIcon, TrashIcon } from '@radix-ui/react-icons'
import Image from 'next/image'
import { Download, Heart, Heart as HeartIcon, X } from 'lucide-react'
import { DownloadButton } from '@/components/download-button'
import { ExternalLinkIcon } from '@/components/external-link-icon'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { notFound } from 'next/navigation'
import { useState } from 'react'

export function ImageView({ image, toggleFavorite }: { image: AiImage; toggleFavorite: () => void }) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className='fixed inset-0 flex flex-col overflow-hidden bg-gray-950 md:flex-row'>
      {/* Updated overlay with dark gray gradients and subtle effects */}
      <div className='absolute inset-0 z-10'>
        <div className='absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800'></div>
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-gray-900/15 to-transparent'></div>
        <div className='backdrop-blur- absolute inset-0'></div>
        <div className='absolute inset-0 bg-black/20'></div>
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
            <Button variant='outline' className='font-bangers w-full p-6 text-xl' onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? 'Hide Details' : 'Show Details'}
            </Button>
          </div>
          <div className='absolute right-4 top-4 flex flex-row space-x-2 md:right-6 md:top-4'>
            <ExternalLinkIcon url={image.imageUrl} />
            <DownloadButton image={image} />
            <form action={toggleFavorite} name='toggleFavorite'>
              <input type='hidden' name='imageId' value={image.id} />
              <Button variant='secondary' size='icon' type='submit'>
                <HeartIcon className={`h-5 w-5 ${image.liked ? 'fill-current text-current' : ''}`} />
              </Button>
            </form>
          </div>
        </div>
      </div>
      <div
        className={`relative z-20 w-full overflow-y-auto bg-white p-4 md:fixed md:bottom-0 md:right-0 md:top-0 md:w-[400px] md:transform md:transition-transform md:duration-300 md:ease-in-out ${isOpen ? 'md:translate-x-0' : 'md:translate-x-full'} `}
      >
        <div className='md:hidden'>
          <h2 className='font-bangers mb-4 text-4xl font-bold'>{image.title}</h2>
          <p className='mb-4 text-base font-medium'>{image.caption}</p>
          <p className='mb-6 text-sm text-gray-600'>{image.description}</p>
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
          <h2 className='font-bangers mb-4 text-4xl font-bold'>{image.title}</h2>
          <p className='mb-4 text-base font-medium'>{image.caption}</p>
          <p className='mb-6 text-sm text-gray-600'>{image.description}</p>
        </div>
      </div>
    </div>
  )
}
