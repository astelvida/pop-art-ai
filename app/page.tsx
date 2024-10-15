import { AppSidebar } from "@/components/app-sidebar";
import { SidebarLayout, SidebarTrigger } from "@/components/ui/sidebar";
import { ImageGenerator } from "@/components/image-generator";
import { Header } from "@/components/header";
import { Suspense } from "react";
import { ImageGallery } from "@/components/ImageGallery";


export default function Page() {
  return (
    <main className="flex flex-1 flex-col p-2 transition-all duration-300 ease-in-out">
      <div className="h-full rounded-md border-2 border-dashed p-2">
        <h1 className="text-3xl font-bold mb-6">Pop Art Image Generator</h1>
        <ImageGenerator />
        <Suspense fallback={<div>Loading...</div>}>
          <ImageGallery />
        </Suspense>
      </div>
    </main>
  );
}
