import Gallery, { GallerySkeleton } from '@/components/gallery'
import { Suspense, useState, useEffect } from 'react'
import { Sidebar, SidebarHeader, SidebarContent, SidebarProvider, SidebarInset } from '@/components/ui/sidebar'

import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/header'
import { SearchBox } from '@/components/search-box'
import { ImageGenerator } from '@/components/image-generator'

export const dynamic = 'force-dynamic' // TODO: remove this


export default function HomePage({
  searchParams,
  params,
  children,
}: {
  searchParams?: { q?: string }
  params?: { tab: '' | 'library' }
  children?: React.ReactNode
}) {
  const { q = '' } = searchParams ?? {}

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
              <Gallery  q={q} params={params} />
            </Suspense>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
