// 'use client'

import Gallery, { GallerySkeleton } from '@/components/gallery'
import { Suspense } from 'react'
import { Sidebar, SidebarHeader, SidebarContent, SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { settingsData } from '@/lib/data/settings'
import { type SettingsSchema } from '@/lib/schemas/inputSchema'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/header'
import { SearchBox } from '@/components/search-box'
import { getImages } from '@/actions/queries'

// import SettingsForm from '@/components/settings-form'
// import { ImageGenerator } from '@/components/image-generator'
export const dynamic = 'force-dynamic' // TODO: remove this

const initialSettingsState = settingsData.reduce<SettingsSchema>((acc, setting) => {
  acc[setting.name as keyof SettingsSchema] = setting.default as SettingsSchema[keyof SettingsSchema]
  return acc
}, {} as SettingsSchema)

export default async function HomePage({
  searchParams,
  params,
  children,
}: {
  searchParams?: { q?: string }
  params?: { tab: '' | 'library' }
  children?: React.ReactNode
}) {
  const { q = '' } = await searchParams
  const images = await getImages(q)

  // const [settings, setSettings] = useState<SettingsSchema>(initialSettingsState)
  // const handleSettingChange = (name: keyof SettingsSchema, value: SettingsSchema[keyof SettingsSchema]) => {
  //   setSettings((prev) => ({ ...prev, [name]: value }))
  // }
  return (
    <SidebarProvider defaultOpen={false}>
      {/* SETTINGS SIDEBAR */}
      <Sidebar className='border-r-0'>
        <SidebarHeader>
          <h2 className='mb-4 mt-4 text-center text-lg font-bold'>Image Generation Settings</h2>
        </SidebarHeader>
        <SidebarContent>
          Hell
          {/* <SettingsForm handleSettingChange={handleSettingChange} settings={settings} /> */}
        </SidebarContent>
      </Sidebar>
      {/* MAIN CONTENT */}
      <SidebarInset className='min-h-screen'>
        <main className='container mx-auto flex min-h-screen flex-col space-y-4 p-4'>
          <Header />

          <h1 className='mb-6 font-marker text-6xl font-bold'>Existential Pop Art </h1>

          {/* <ImageGenerator settings={settings} /> */}

          <Separator className='my-12 space-y-12' />

          <SearchBox />
          <Suspense fallback={<GallerySkeleton />}>
            <Gallery images={images} q={q} params={params} />
          </Suspense>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
