import Gallery, { GallerySkeleton } from '@/components/gallery'
import { Suspense } from 'react'
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
    <div className="container mx-auto px-4 py-8">
      <TabButtons activeTab={tab} />

      <Suspense fallback={<GallerySkeleton />}>
        <Gallery tab={tab} key={tab} />
      </Suspense>
    </div>
  )
}
