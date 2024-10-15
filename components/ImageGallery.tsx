import Image from "next/image";
// import { getFavorites, getImages } from "~/server/db/queries";
import { FavoriteButton } from "./FavoriteButton";
import { DownloadButton } from "./DownloadButton";
import { getAiImages } from "@/actions/queries";

export const dynamic = "force-dynamic";

// Define the structure of our image objects
interface ImageItem {
  id: number;
  src: string;
  alt: string;
}

export async function ImageGallery() {
  const images = await getAiImages();

  return (
    <main className="flex-grow">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => (
            <div key={image.id} className="group relative">
              <Image
                src={image.url}
                alt={image.id.toString()}
                width={300}
                height={300}
                className="h-auto w-full rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                <FavoriteButton image={image} />
                <DownloadButton imageUrl={image.url} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
