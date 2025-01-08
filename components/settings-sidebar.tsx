'use client'

import * as React from 'react'
import { Settings2, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { settingsData, type Setting, type SettingsSchema } from '@/lib/schemas/settings'

const aspectRatios = [
  { value: '16:9', icon: '⬛' },
  { value: '9:16', icon: '⬜' },
  { value: '1:1', icon: '□' },
  { value: '21:9', icon: '▭' },
  { value: '4:5', icon: '▯' },
  { value: '4:3', icon: '▬' },
]

interface SettingsSidebarProps {
  settings: Partial<SettingsSchema>
  onSettingChange: (name: keyof SettingsSchema, value: SettingsSchema[keyof SettingsSchema]) => void
}

export function SettingsSidebar({ settings, onSettingChange }: SettingsSidebarProps) {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const renderSetting = (setting: Setting) => {
    switch (setting.type) {
      case 'number':
        return (
          <div key={setting.name} className="space-y-2">
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
        if (setting.name === 'aspect_ratio') return null // Skip aspect ratio as it's handled separately
        return (
          <div key={setting.name} className="space-y-2">
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
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-bold text-lg">Image Settings</h4>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              settingsData.forEach((setting) => onSettingChange(setting.name, setting.default))
            }}
            variant="ghost"
            className="rounded-none hover:bg-purple-100"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset all
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h5 className="font-bold text-sm">Aspect Ratio</h5>
            <div className="grid grid-cols-2 gap-2">
              {aspectRatios.map((ratio) => (
                <Button
                  key={ratio.value}
                  onClick={() => onSettingChange('aspect_ratio', ratio.value)}
                  className={`
                    h-16 rounded-none border-2 border-black
                    ${
                      settings.aspect_ratio === ratio.value
                        ? 'bg-black text-white translate-x-1 translate-y-1 shadow-none'
                        : 'bg-white text-black hover:bg-purple-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                    }
                  `}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl">{ratio.icon}</span>
                    <span className="text-sm font-bold">{ratio.value}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
          {/* Render first half of remaining settings */}
          {settingsData
            .filter((setting) => setting.name !== 'aspect_ratio')
            .slice(0, Math.ceil(settingsData.length / 2))
            .map(renderSetting)}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Render second half of remaining settings */}
          {settingsData
            .filter((setting) => setting.name !== 'aspect_ratio')
            .slice(Math.ceil(settingsData.length / 2))
            .map(renderSetting)}
        </div>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="rounded-none border-2 border-black hover:bg-purple-100"
          >
            <Settings2 className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-[80vh]">
          <div className="max-w-md mx-auto px-4 py-8 overflow-y-auto h-full">{settingsContent}</div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="rounded-none border-2 border-black hover:bg-purple-100"
        >
          <Settings2 className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[600px] p-4 rounded-none border-4 border-black" align="end">
        {settingsContent}
      </PopoverContent>
    </Popover>
  )
}
