import Gallery, { GallerySkeleton } from '@/components/gallery'
import { Suspense  } from 'react'
import { Sidebar, SidebarHeader, SidebarContent, SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/header'
import { SearchBox } from '@/components/search-box'   
import { ImageGenerator } from '@/components/image-generator'

export const experimental_ppr = true

type PageProps = {
  searchParams: Promise<{ q?: string }>
  params: Promise<{ tab: '' | 'library' }>
}


export default async function HomePage(   
  {
    searchParams,
    params  
  }: PageProps
) {   

  // const { q } = await searchParams
  // const { tab } = await params

  return (
    <SidebarProvider defaultOpen={false}>
      {/* SETTINGS SIDEBAR */}
      <Sidebar className='border-r-0'>
        <SidebarHeader>
          <h2 className='mb-4 mt-4 text-center text-lg font-bold'>Image Generation Settings</h2>
        </SidebarHeader>
        <SidebarContent>
          <p>SIDEBAR</p>
        </SidebarContent>
      </Sidebar>
      {/* MAIN CONTENT */}
      <SidebarInset className='min-h-screen'>
        <main className='container mx-auto flex min-h-screen flex-col space-y-4 p-4'>
          <Header />

          <div className='space-y-4'>
            <h1 className='font-marker text-6xl font-bold'>Existential Pop Art</h1>

            <ImageGenerator />

            {/* <SearchBox /> */}

            <Separator />

            <Suspense fallback={<GallerySkeleton />}>
              <Gallery />
            </Suspense>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
