import { ImageGenerator } from "@/components/image-generator";
import { Header } from "@/components/header";
import { getAiImages } from "@/actions/queries";

export default async function Page() {
  const images = await getAiImages();
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <ImageGenerator images={images} />
    </div>
  );
}
