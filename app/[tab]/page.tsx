import Gallery, { GallerySkeleton } from '@/components/gallery'
import { Suspense } from 'react'
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/header'
import { SearchBox } from '@/components/search-box'
import { ImageGenerator } from '@/components/image-generator'
import { ImageCounter } from '@/components/image-counter'
import ArtsyImageGenerator from '@/components/ArtsyImageGenerator/artsy-image-generator'
import { TabButtons } from '@/components/tab-buttons'

export const experimental_ppr = true

type PageProps = {
  params: Promise<{ tab: '' | 'library' }>
}

export default async function HomePage({ params }: PageProps) {
  const { tab = 'explore' } = await params

  // return <ArtsyImageGenerator />
  return (
    <SidebarProvider defaultOpen={false}>
      {/* SETTINGS SIDEBAR */}
      <Sidebar className="border-r-0">
        <SidebarHeader>
          <h2 className="mb-4 mt-4 text-center text-lg font-bold">Image Generation Settings</h2>
        </SidebarHeader>
        <SidebarContent>
          <p>SIDEBAR</p>
        </SidebarContent>
      </Sidebar>
      {/* MAIN CONTENT */}
      <SidebarInset className="min-h-screen">
        <main className="container mx-auto flex min-h-screen flex-col space-y-4 p-4">
          <Header />

          <div className="space-y-4 ">
            <h1 className="font-marker text-6xl font-bold text-center">Existential Pop Art</h1>
            <ImageCounter />

            <ImageGenerator />

            {/* <SearchBox /> */}

            <Separator />

            <TabButtons activeTab={tab} />

            <Suspense fallback={<GallerySkeleton />}>
              <Gallery tab={tab} />
            </Suspense>
          </div>
          <SidebarTrigger />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
