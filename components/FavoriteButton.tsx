import { toggleFavoriteAiImage } from "@/actions/queries";
import { Heart } from "lucide-react";

export function FavoriteButton({ image }) {
  return (
    <form
      action={async () => {
        "use server";
        await toggleFavoriteAiImage(image.id, image.isFavorite);
      }}
    >
      <button
        type="submit"
        className="absolute right-2 top-2 rounded-full bg-white bg-opacity-75 p-2 shadow-sm transition-colors duration-300 focus:opacity-100 focus:outline-none group-hover:opacity-100"
        aria-label={
          image.isFavorite ? "Remove from favorites" : "Add to favorites"
        }
      >
        <Heart
          className={`h-6 w-6 ${image.isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
        />
      </button>
    </form>
  );
}
