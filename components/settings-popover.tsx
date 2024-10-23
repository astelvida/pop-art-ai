import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Settings } from 'lucide-react'
import { type SettingsSchema } from '@/lib/schemas/inputSchema'
import { SettingsLayout } from '@/components/settings-layout'

interface SettingsPopoverProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  handleSettingChange: (settings: SettingsSchema) => void
  settings: SettingsSchema
  toggleSettings: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export function SettingsPopover({
  isOpen,
  onOpenChange,
  handleSettingChange,
  settings,
  toggleSettings,
}: SettingsPopoverProps) {
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant='outline' size='icon' className='rounded-full' onClick={toggleSettings}>
          <Settings className='h-6 w-6' />
          <span className='sr-only'>Open settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-80'>
        <SettingsLayout handleSettingChange={handleSettingChange} settings={settings} />
      </PopoverContent>
    </Popover>
  )
}
