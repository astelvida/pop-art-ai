'use client'

import { ImageGenerator } from '@/components/image-generator'
import { Gallery } from '@/components/gallery'
import { Suspense } from 'react'
import { GallerySkeleton } from '@/components/gallery-skeleton'
import { Sidebar, SidebarHeader, SidebarContent, SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { SettingsLayout } from '@/components/settings-layout'
import { useState } from 'react'
import { settingsData } from '@/lib/data/settings'
import { type SettingsSchema } from '@/lib/schemas/inputSchema'

const initialSettingsState = settingsData.reduce(
  (acc, setting) => {
    acc[setting.name] = setting.default
    return acc
  },
  {} as { [key in keyof SettingsSchema]: SettingsSchema[key] },
)

export default function Generator({ images }: { images: AiImage[] }) {
  const [settings, setSettings] = useState<SettingsSchema>(initialSettingsState)

  const handleSettingChange = (name: string, value: string | number) => {
    setSettings((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <SidebarProvider>
      {/* SETTINGS SIDEBAR */}
      <Sidebar className='border-r-0'>
        <SidebarHeader>
          <h1>Hello</h1>
        </SidebarHeader>
        <SidebarContent>
          <SettingsLayout handleSettingChange={handleSettingChange} settings={settings} />
        </SidebarContent>
      </Sidebar>
      {/* MAIN CONTENT */}
      <SidebarInset>
        <main className='container mx-auto flex-grow space-y-4 p-4'>
          <div className='mb-2 text-center'>
            <h1 className='mb-2 text-6xl font-bold' style={{ fontFamily: "'Rubik Mono One', sans-serif" }}>
              POP ART AI
            </h1>
            <h2
              className='text-2xl font-semibold text-muted-foreground'
              style={{ fontFamily: "'Rubik Mono One', sans-serif" }}
            >
              A tribute to Roy Lichtenstein
            </h2>
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            <ImageGenerator settings={settings} />
          </Suspense>
          <Suspense fallback={<GallerySkeleton />}>
            <Gallery images={images} />
          </Suspense>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
