import Image from "next/image";
// import { getFavorites, getImages } from "~/server/db/queries";
import { FavoriteButton } from "./FavoriteButton";
import { DownloadButton } from "./DownloadButton";
import Link from "next/link";
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => (
            <div key={image.id} className="group relative">
              {/* <Link href={`/img/${image.id}`}> */}
              <Image
                src={image.url}
                alt={image.id.toString()}
                width={300}
                height={300}
                className="h-auto w-full rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
              />
              {/* </Link> */}
              <div className="absolute bottom-2 right-2 flex space-x-2">
                <DownloadButton imageUrl={image.url} />
                <FavoriteButton image={image} />
              </div>
              {/* <div>{image.name}</div> */}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
