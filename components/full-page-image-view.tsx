// import { clerkClient } from '@clerk/nextjs/server'
import { Button } from '@/components/ui/button'
import { deleteAiImage, getAiImage, toggleFavoriteAiImage } from '@/actions/queries'
// import { HeartIcon, DownloadIcon, TrashIcon } from '@radix-ui/react-icons'
import Image from 'next/image'
import { Heart as HeartIcon } from 'lucide-react'
import { DownloadButton } from '@/components/download-button'
import { ExternalLinkIcon } from '@/components/external-link-icon'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { notFound } from 'next/navigation'
import { useState } from 'react'

export async function FullPageImageView({ imageId, children }: { imageId: string; children?: React.ReactNode }) {
  console.log('IMAGE', imageId)
  const image = await getAiImage(imageId)

  if (!image) notFound()

  // const userInfo = await clerkClient.users.getUser(image.userId)
  const toggleFavorite = toggleFavoriteAiImage.bind(null, image.id)
  // const deleteImage = deleteAiImage.bind(null, idAsNumber)

  // const [isCardOpen, setIsCardOpen] = useState(true)
  const [isCardOpen, setIsCardOpen] = [true, (prev) => !prev]

  // const toggleCard = () => {
  //   setIsCardOpen((prev) => !prev)
  // }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='relative h-full w-full p-10'>
        {/* Image container with transition */}
        <div className={`transition-transform duration-300 ${isCardOpen ? '-translate-x-24 transform' : ''}`}>
          <Image
            src={image.imageUrl}
            alt={image.title || 'AI generated image'}
            layout='fill'
            objectFit='contain'
            className='backdrop-blur-3xl'
          />
        </div>

        <div className='absolute inset-0 backdrop-blur-3xl' />
        <div className='absolute inset-20 flex items-center justify-center'>
          {/* <div className='relative h-full w-full'> */}
          <Image
            className='relative'
            src={image.imageUrl}
            alt={image.title || 'AI generated image'}
            layout='fill'
            objectFit='contain'
            priority
          />
          <div className='absolute right-0 top-0 flex flex-row space-x-3 p-4'>
            <ExternalLinkIcon url={image.imageUrl} />
            <DownloadButton image={image} />
          </div>

          <div className='absolute left-0 top-0 flex flex-row space-x-3 p-4'>
            <form action={toggleFavorite} name='toggleFavorite'>
              <input type='hidden' name='imageId' value={imageId} />
              <Button type='submit' variant='secondary' size='icon'>
                <HeartIcon className={`h-5 w-5 ${image.isFavorite ? 'fill-current' : ''}`} />
              </Button>
            </form>
          </div>

          {/* Button to toggle the card */}
          <Button /* onClick={toggleCard} */ variant='outline' size='sm'>
            {isCardOpen ? 'Collapse' : 'Expand'} Card
          </Button>

          {/* Redesigned Sidebar/Popover Card */}
          <Card
            className={`absolute bottom-0 right-0 rounded-lg bg-white shadow-lg transition-all duration-300 ${isCardOpen ? 'max-h-96' : 'max-h-0 overflow-hidden'}`}
          >
            <CardHeader className='border-b p-4'>
              <CardTitle className='text-lg font-semibold'>{image.title || 'Untitled'}</CardTitle>
              <CardDescription className='text-sm text-gray-500'>
                {image.caption || 'No caption available'}
              </CardDescription>
            </CardHeader>

            <CardContent className='p-4'>
              <p className='text-gray-700'>{image.description || 'No description available'}</p>
              <p className='italic text-gray-600'>{image.nextPrompt || 'No Next Prompt'}</p>
            </CardContent>
            <CardFooter className='border-t p-4'>
              <Button variant='outline' size='sm'>
                Generate Next
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
