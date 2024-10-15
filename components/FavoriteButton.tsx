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
        className="rounded-full bg-white bg-opacity-75 p-2 shadow-sm transition-colors duration-300 hover:bg-opacity-100 focus:outline-none"
        aria-label={
          image.isFavorite ? "Remove from favorites" : "Add to favorites"
        }
      >
        <Heart
          className={`h-5 w-5 ${image.isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
        />
      </button>
    </form>
  );
}
