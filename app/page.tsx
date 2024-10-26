'use client'

import { ImageGenerator } from '@/components/image-generator'
import { Gallery } from '@/components/gallery'
import { Suspense } from 'react'
import { GallerySkeleton } from '@/components/gallery-skeleton'
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarRail,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { SettingsLayout } from '@/components/settings-layout'
import { useState } from 'react'
import { settingsData } from '@/lib/data/settings'
import { type SettingsSchema } from '@/lib/schemas/inputSchema'
import { Separator } from '@/components/ui/separator'
import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

const initialSettingsState = settingsData.reduce(
  (acc, setting) => {
    acc[setting.name] = setting.default
    return acc
  },
  {} as { [key in keyof SettingsSchema]: SettingsSchema[key] },
)

export default function Page() {
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
        {/* <SidebarRail /> */}
        {/* <Separator orientation='vertical' className='mr-2 h-4' /> */}
        <main className='container mx-auto flex-grow space-y-8 p-4'>
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
          <ImageGenerator settings={settings} />
          <Suspense fallback={<GallerySkeleton />}>
            <Gallery />
          </Suspense>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
