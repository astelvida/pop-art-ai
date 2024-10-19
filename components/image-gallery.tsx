import { toggleFavoriteAiImage, deleteAiImage } from "@/actions/queries"
import { Button } from "@/components/ui/button"
import { AiImageType } from "@/db/schema"
import { downloadAiImage } from "@/lib/helpers"
import { Heart, Trash2, Download } from "lucide-react"
import Link from "next/link"
import Image from "next/image"


interface ImageGalleryProps {
  images: AiImageType[]
}

export function ImageGallery({ images }: ImageGalleryProps) {
  return (
    <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
      {images.map(({ url, name, id, isFavorite, description = "No description available", title = "No title available", blurDataUrl }) => (
        <div key={id} className="relative group mb-5">
          <Link href={`/img/${id}`} className="after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight">
            <Image
              alt={`Generated image ${id} - ${name}`}
              className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
              style={{ transform: "translate3d(0, 0, 0)" }}
              placeholder={blurDataUrl ? "blur" : "empty"}
              blurDataURL={blurDataUrl || undefined}
              src={url}
              width={720}
              height={480}
              sizes="(max-width: 640px) 100vw,
                (max-width: 1280px) 50vw,
                (max-width: 1536px) 33vw,
                25vw"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 rounded-lg">
              <h3 className="text-white font-semibold text-lg mb-1">{title}</h3>
              <p className="text-white text-sm">{description}</p>
            </div>
          </Link>
          <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button variant="secondary" size="icon" onClick={() => toggleFavoriteAiImage(id)}>
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
            </Button>
            <Button variant="secondary" size="icon" onClick={() => deleteAiImage(id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" onClick={() => downloadAiImage(url, name)}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
