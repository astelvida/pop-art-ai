import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { type SettingsSchema } from '@/lib/schemas/inputSchema'
import { settingsData, type Setting } from '@/lib/data/settings'

export default function SettingsForm({
  handleSettingChange,
  settings,
}: {
  handleSettingChange: (settingKey: keyof SettingsSchema, value: string | number) => void
  settings: SettingsSchema
}) {
  return (
    <form className='space-y-8 p-4'>
      <TooltipProvider>
        {settingsData.map((setting: Setting) => (
          <div className='space-y-2' key={setting.name}>
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
                <span className='text-sm text-muted-foreground'>{settings[setting.name as keyof SettingsSchema]}</span>
              )}
            </div>
            {setting.type === 'text' && (
              <Input
                id={setting.name}
                value={settings[setting.name as keyof SettingsSchema]}
                onChange={(e) => handleSettingChange(setting.name as keyof SettingsSchema, e.target.value)}
                placeholder={`Enter ${setting.label.toLowerCase()}`}
              />
            )}
            {setting.type === 'number' && (
              <Slider
                id={setting.name}
                min={setting.min}
                max={setting.max}
                step={setting.step}
                value={[settings[setting.name as keyof SettingsSchema] as number]}
                onValueChange={(value) => handleSettingChange(setting.name as keyof SettingsSchema, value[0])}
              />
            )}
            {setting.type === 'select' && (
              <Select
                value={settings[setting.name as keyof SettingsSchema] as string}
                onValueChange={(value) => handleSettingChange(setting.name as keyof SettingsSchema, value)}
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
        ))}
      </TooltipProvider>
    </form>
  )
}
