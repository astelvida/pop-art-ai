import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsStore {
  settings: SettingsSchema
  updateSettings: (key: keyof SettingsSchema, value: any) => void
  resetSettings: () => void
}

export const useSettings = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: initialSettingsState,
      updateSettings: (key, value) =>
        set((state) => ({
          settings: { ...state.settings, [key]: value },
        })),
      resetSettings: () => set({ settings: initialSettingsState }),
    }),
    {
      name: 'settings-storage',
    }
  )
) 