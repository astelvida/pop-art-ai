import Gallery, { GallerySkeleton } from '@/components/gallery'
import { Suspense } from 'react'

import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/header'
import { ImageGenerator } from '@/components/image-generator'
import { ImageCounter } from '@/components/image-counter'
import { TabButtons } from '@/components/tab-buttons'
// export const experimental_ppr = true

type PageProps = {
  params: Promise<{ tab: 'explore' | 'favorites' | 'library' }>
}

export default async function HomePage(props: PageProps) {
  // return <ArtsyImageGenerator />
  const { tab } = await props.params
  console.log(tab)
  return (
    <main className="min-h-screen pb-20 bg-gray-100">
      <Header />

      <div className="container mx-auto px-4 mb-12">
        <h2 className="text-5xl font-black mb-2 text-center">Pop Art</h2>
        <p className="text-xl text-center mb-8">Transform your ideas into stunning visuals</p>
        <ImageCounter />
      </div>

      <ImageGenerator />

      <div className="container mx-auto px-4 py-8">
        <TabButtons activeTab={tab} />

        <Suspense fallback={<GallerySkeleton />}>
          <Gallery tab={tab} key={tab} />
        </Suspense>
      </div>
    </main>
  )
}
