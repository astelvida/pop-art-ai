import { toggleFavoriteAiImage, deleteAiImage } from "@/actions/queries"
import { Button } from "@/components/ui/button"
import { AiImageType } from "@/db/schema"
import { Heart, Trash2, Download } from "lucide-react"
import Link from "next/link"

interface ImageGalleryProps {
  images: AiImageType[]
}

export function ImageGallery({ images }: ImageGalleryProps) {
  
  
  const downloadAiImage = async (imageUrl: string, name: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      // Use a default name if name is null or undefined
      a.download = name || 'image';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map(({url, name, id, isFavorite, description = "No description available", title = "No title available"}, index) => (
        <div key={index} className="relative group">
          <Link href={`/img/${id}`}>
            <img src={url} alt={`Generated image ${index + 1} - ${name || "a pop art image"} `} className="w-full h-auto rounded-lg" />
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
            <Button variant="secondary" size="icon" onClick={() =>  downloadAiImage(url, name)}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
 