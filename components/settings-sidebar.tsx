'use client'

import * as React from 'react'
import { Settings2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { settingsData, type Setting, type SettingsSchema } from '@/lib/schemas/settings'
import { AspectRatioSelector } from './aspect-ratio-selector'

interface SettingsSidebarProps {
  settings: Partial<SettingsSchema>
  onSettingChange: (name: keyof SettingsSchema, value: SettingsSchema[keyof SettingsSchema]) => void
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SettingsSidebar({
  settings,
  onSettingChange,
  isOpen: externalIsOpen,
  onOpenChange,
}: SettingsSidebarProps) {
  const [internalIsOpen, setInternalIsOpen] = React.useState(false)

  const isOpen = externalIsOpen ?? internalIsOpen
  const setIsOpen = onOpenChange ?? setInternalIsOpen

  const renderSetting = (setting: Setting) => {
    switch (setting.type) {
      case 'number':
        return (
          <div key={setting.name} className="space-y-2 mb-6">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold">{setting.label}</label>
              <span className="text-sm tabular-nums">{settings[setting.name]}</span>
            </div>
            <Slider
              value={[settings[setting.name] as number]}
              onValueChange={([value]) => onSettingChange(setting.name, value)}
              min={setting.min}
              max={setting.max}
              step={setting.step}
              className="w-full"
            />
            <p className="text-xs text-gray-500">{setting.description}</p>
          </div>
        )
      case 'select':
        return (
          <div key={setting.name} className="space-y-2 mb-6">
            <label className="text-sm font-bold block">{setting.label}</label>
            <Select
              value={settings[setting.name] as string}
              onValueChange={(value) => onSettingChange(setting.name, value)}
            >
              <SelectTrigger className="w-full rounded-none border-2 border-black">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {setting.options?.map((option) => (
                  <SelectItem
                    key={option}
                    value={option}
                    className="rounded-none cursor-pointer hover:bg-purple-100"
                  >
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">{setting.description}</p>
          </div>
        )
      default:
        return null
    }
  }

  const settingsContent = (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-black">Prompt Settings</h2>
        <p className="text-sm text-gray-500">Customize your prompt generation settings</p>
      </div>
      <div className="space-y-6">{settingsData.map(renderSetting)}</div>
    </>
  )

  return (
    <>
      <div className="fixed top-0 right-0 bottom-0 w-12 bg-black flex items-center justify-center z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(true)}
          className="text-white hover:bg-white hover:text-black transition-colors"
        >
          <Settings2 className="h-6 w-6" />
          <span className="sr-only">Open settings sidebar</span>
        </Button>
      </div>

      <div
        className={`fixed top-0 right-0 bottom-0 w-[300px] sm:w-[350px] md:w-[300px] bg-white border-l-4 border-black transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full overflow-y-auto p-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 hover:bg-purple-100"
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close settings sidebar</span>
          </Button>
          {settingsContent}
        </div>
      </div>
    </>
  )
}
