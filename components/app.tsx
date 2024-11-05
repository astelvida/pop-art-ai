'use client'

import { ImageGenerator } from '@/components/image-generator'
import { Gallery, GallerySkeleton } from '@/components/gallery'
import { Suspense, useState, useMemo, use } from 'react'
import { Sidebar, SidebarHeader, SidebarContent, SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import SettingsForm from '@/components/settings-form'
import { settingsData } from '@/lib/data/settings'
import { type SettingsSchema } from '@/lib/schemas/inputSchema'
import { Header } from '@/components/header'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { type AiImage } from '@/db/schema'

// export const dynamic = 'force-dynamic' // TODO: remove this
import { type ActiveTab } from '@/lib/types'

const initialSettingsState = settingsData.reduce<SettingsSchema>((acc, setting) => {
  acc[setting.name as keyof SettingsSchema] = setting.default as SettingsSchema[keyof SettingsSchema]
  return acc
}, {} as SettingsSchema)

export function App({ imagesPromise }: { imagesPromise: Promise<Array<AiImage>> }) {
  const [settings, setSettings] = useState<SettingsSchema>(initialSettingsState)
  const [activeTab, setActiveTab] = useState<ActiveTab>('explore')

  const handleSettingChange = (name: keyof SettingsSchema, value: SettingsSchema[keyof SettingsSchema]) => {
    setSettings((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <SidebarProvider defaultOpen={false}>
      {/* SETTINGS SIDEBAR */}
      <Sidebar className='border-r-0'>
        <SidebarHeader>
          <h2 className='mb-4 mt-4 text-center text-lg font-bold'>Image Generation Settings</h2>
        </SidebarHeader>
        <SidebarContent>
          <SettingsForm handleSettingChange={handleSettingChange} settings={settings} />
        </SidebarContent>
      </Sidebar>
      {/* MAIN CONTENT */}
      <SidebarInset className='min-h-screen'>
        <main className='container mx-auto flex min-h-screen flex-col space-y-4 p-4'>
          <Header />
          <div className='mb-6 flex-grow text-center'>
            <h1 className='mb-6 font-marker text-6xl font-bold'>Existential Pop Art </h1>
            <h2 className='mx-auto mb-4 max-w-5xl text-lg text-muted-foreground'>
              Discover dynamic pop art comic book style images created with the Flux/Dev Lora model, inspired by Roy
              Lichtenstein's signature aesthetic. Each artwork features expressive characters, comic book speech
              bubbles, and explores themes like love, suffering, patriarchy, and impossible beauty standards. With its
              satirical, tongue-in-cheek style, these images evoke strong emotions while delivering a dose of irony and
              humor. <br /> Perfect for those seeking bold visuals with depth and meaning.
            </h2>
          </div>

          <ImageGenerator settings={settings} />

          <Separator className='my-12 space-y-12' />

          <div className='my-12 mb-6 flex items-center justify-start space-x-16 space-y-8'>
            <h1 className='text-center font-rubik text-6xl font-bold'>Gallery </h1>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className='w-full max-w-md pb-2'
              defaultValue='explore'
            >
              <TabsList className='grid w-full grid-cols-2 pb-16'>
                <TabsTrigger value='explore' className='p-4 font-rubik text-xl font-bold'>
                  Explore
                </TabsTrigger>
                <TabsTrigger value='myGenerations' className='p-4 font-rubik text-xl font-bold'>
                  My Generations
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <Suspense fallback={<GallerySkeleton />}>
            <Gallery key={activeTab} imagesPromise={imagesPromise} activeTab={activeTab} />
          </Suspense>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
