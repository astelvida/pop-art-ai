import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { type SettingsSchema } from '@/lib/schemas/inputSchema'
import { settingsData } from '@/lib/data/settings'

export function SettingsLayout({
  handleSettingChange,
  settings,
}: {
  handleSettingChange: (settings: SettingsSchema) => void
  settings: SettingsSchema
}) {
  return (
    <form className='mx-auto max-w-2xl space-y-8 p-6'>
      <h2 className='mb-4 text-2xl font-bold'>Image Generation Settings</h2>
      <div className='space-y-6'>
        {settingsData.map((setting) => (
          <TooltipProvider key={setting.name}>
            <div className='space-y-2'>
              <div className='flex justify-between'>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Label htmlFor={setting.name} className='cursor-help'>
                      {setting.label}
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent side='right' align='start' className='max-w-xs'>
                    {setting.description}
                  </TooltipContent>
                </Tooltip>
                {setting.type === 'number' && (
                  <span className='text-sm text-muted-foreground'>{settings[setting.name]}</span>
                )}
              </div>
              {setting.type === 'text' && (
                <Input
                  id={setting.name}
                  value={settings[setting.name] as string}
                  onChange={(e) => handleSettingChange(setting.name, e.target.value)}
                  placeholder={`Enter ${setting.label.toLowerCase()}`}
                />
              )}
              {setting.type === 'number' && (
                <Slider
                  id={setting.name}
                  min={setting.min}
                  max={setting.max}
                  step={setting.step}
                  value={[settings[setting.name] as number]}
                  onValueChange={(value) => handleSettingChange(setting.name, value[0])}
                />
              )}
              {setting.type === 'select' && (
                <Select
                  value={settings[setting.name] as string}
                  onValueChange={(value) => handleSettingChange(setting.name, value)}
                >
                  <SelectTrigger id={setting.name}>
                    <SelectValue placeholder={`Select ${setting.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {setting.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </TooltipProvider>
        ))}
      </div>
    </form>
  )
}
