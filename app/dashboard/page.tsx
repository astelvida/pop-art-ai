import { AppSidebar } from "@/components/app-sidebar";
import { SidebarLayout, SidebarTrigger } from "@/components/ui/sidebar";
import { ImageGenerator } from "@/components/image-generator";


export default function Page() {
  return (
    <SidebarLayout>
      <AppSidebar />
      <main className="flex flex-1 flex-col p-2 transition-all duration-300 ease-in-out">
        <div className="h-full rounded-md border-2 border-dashed p-2">
          <SidebarTrigger />
          <ImageGenerator />
        </div>
      </main>
    </SidebarLayout>
  );
}
