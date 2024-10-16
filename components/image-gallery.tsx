import { Button } from "@/components/ui/button"
import { AiImageType } from "@/db/schema"
import { Heart, Trash2, Download } from "lucide-react"
import Link from "next/link"
interface ImageGalleryProps {
  images: AiImageType[]
  onFavorite: (id: number) => void
  onDelete: (id: number) => void
  onDownload: (url: string) => void
}

export function ImageGallery({ images, onFavorite, onDelete, onDownload }: ImageGalleryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map(({url, name = "a pop art image", id, isFavorite  }, index) => (
        <div key={index} className="relative group">
          <Link href={`/img/${id}`}>
            <img src={url} alt={`Generated image ${index + 1} - ${name || "a pop art image"} `} className="w-full h-auto rounded-lg"  />
          </Link>
          <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button variant="secondary" size="icon" onClick={() => onFavorite(id)}>
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
            </Button>
            <Button variant="secondary" size="icon" onClick={() => onDelete(id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" onClick={() => onDownload(url)}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
