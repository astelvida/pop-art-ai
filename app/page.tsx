import { ImageGenerator } from "@/components/image-generator";
import { getAiImages } from "@/actions/queries";

export default async function Page() {
  const images = await getAiImages();
  return (
      <ImageGenerator images={images} />
  );
}