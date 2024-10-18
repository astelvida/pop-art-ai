import { ImageGenerator } from "@/components/image-generator";
import { getAiImages } from "@/actions/queries";
import './app.config'

export default async function Page() {
  const images = await getAiImages();
  console.log('/nIMAGES', images.slice(0, 2))
  return (
      <ImageGenerator images={images} />
  );
}
