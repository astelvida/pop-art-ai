import { useState } from 'react'
import { type SettingsSchema, settingsData } from '@/lib/schemas/settings'

const defaultSettings: SettingsSchema = Object.fromEntries(
  settingsData.map((setting) => [setting.name, setting.default])
) as SettingsSchema

export function useSettings() {
  const [settings, setSettings] = useState<SettingsSchema>(defaultSettings)

  const updateSetting = (
    name: keyof SettingsSchema,
    value: SettingsSchema[keyof SettingsSchema]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return {
    settings,
    updateSetting,
  }
}
