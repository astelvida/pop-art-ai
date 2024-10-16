import { ImageGenerator } from "@/components/image-generator";
import { Header } from "@/components/header";
import { getAiImages } from "@/actions/queries";

export default async function Page() {
  const images = await getAiImages();

  // console.log(images)
  return (
      <ImageGenerator images={images} />
    
  );
}
