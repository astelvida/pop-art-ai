'use client'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { X, LoaderCircle } from 'lucide-react'
import { DownloadButton } from '@/components/buttons/download-button'
import { ExternalLinkButton } from '@/components/buttons/external-link-button'
import { useState } from 'react'
import { type AiImage } from '@/db/schema'
import LikeButton from '@/components/buttons/like-button'
import { ImageDetails } from './image-details'

export function ImageView({ image }: { image: AiImage }) {
  const [isOpen, setIsOpen] = useState(true)
  const [imageLoading, setImageLoading] = useState(true)

  const { imageUrl, title, caption, description, id, numLikes, liked, aspectRatio } = image

  const [w, h] = aspectRatio.split(':').map(Number)
  const imageHeight = (h * 500) / w

  return (
    <div className="bg-grey-50 fixed inset-0 flex flex-col overflow-hidden md:flex-row">
      {/* Updated overlay with dark gray gradients and subtle effects */}
      <div className="absolute inset-0 z-10">
        <div className="absolute inset-0 backdrop-blur-3xl"></div>
        <div className="absolute inset-0 bg-gray-100/20"></div>
      </div>

      <div
        className={`relative z-20 flex transition-all duration-300 ease-in-out md:flex-grow ${isOpen ? 'md:mr-[400px]' : ''}`}
      >
        <div className="relative flex h-full w-full flex-col items-center justify-center md:items-center md:justify-center">
          {imageLoading && (
            <div className="absolute snap-center self-center">
              <LoaderCircle className="h-12 w-12 animate-spin" />
            </div>
          )}
          <Image
            className="max-h-[50vh] object-contain md:h-[80%] md:max-h-[100vh] md:w-[80%]"
            src={imageUrl + `?timestamp=${Date.now()}`}
            alt={title || 'AI generated image'}
            priority
            width={500}
            height={imageHeight}
            sizes="50vw"
            onLoad={() => setImageLoading(false)}
          />
          <div className="mt-6 hidden md:flex">
            <Button
              variant="outline"
              className="w-full p-6 font-bangers text-xl"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? 'Hide Details' : 'Show Details'}
            </Button>
          </div>
          <div className="absolute right-4 top-4 flex flex-row space-x-2 md:right-6 md:top-4">
            <ExternalLinkButton url={imageUrl} />
            <DownloadButton url={imageUrl} title={title} />
            <LikeButton
              imageId={id}
              initialLikes={numLikes || 0}
              initialLikedState={liked || false}
              showLikes={false}
            />
          </div>
        </div>
      </div>

      <ImageDetails
        title={title}
        caption={caption}
        description={description}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </div>
  )
}
