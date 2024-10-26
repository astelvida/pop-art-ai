import { getImages } from '../actions'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import LikeButton from '../components/LikeButton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'

export default async function GalleryPage() {
  const images = await getImages(20)

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Image Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden">
            <CardContent className="p-0">
              <img src={image.imageUrl} alt={image.title || 'AI Generated Image'} className="w-full h-64 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{image.title}</h2>
                <p className="text-gray-600 mb-4">{image.caption}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarImage src={`https://avatar.vercel.sh/${image.userId}`} />
                      <AvatarFallback>{image.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{image.userName}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(image.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50">
              <LikeButton 
                imageId={image.id} 
                initialLikes={image.numLikes} 
                initialLikedState={image.isLikedByUser} 
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
