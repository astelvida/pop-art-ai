import { useRef, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Settings } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Switch } from '@/components/ui/switch'
import { type InputSchema, type SettingsSchema, inputSchema } from '@/lib/schemas/inputSchema'
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
