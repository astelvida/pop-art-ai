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
import { imageGenerationSchema, ImageGenerationSettings } from '@/lib/schemas/image-generation-schema'
import inputData from '@/lib/data/input.json'

interface SettingsPopoverProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  handleSettingChange: (settings: Partial<ImageGenerationSettings>) => void
  settings: ImageGenerationSettings
  toggleSettings: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export function SettingsPopover({
  isOpen,
  onOpenChange,
  handleSettingChange,
  settings,
  toggleSettings,
}: SettingsPopoverProps) {
  const { control, watch } = useForm<ImageGenerationSettings>({
    resolver: zodResolver(imageGenerationSchema),
    defaultValues: settings,
  })

  const formValues = useRef(settings)

  useEffect(() => {
    const subscription = watch((value) => {
      formValues.current = value as ImageGenerationSettings
      handleSettingChange(value)
    })
    return () => subscription.unsubscribe()
  }, [watch, handleSettingChange])

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant='outline' size='icon' className='rounded-full' onClick={toggleSettings}>
          <Settings className='h-6 w-6' />
          <span className='sr-only'>Open settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-80'>
        <div className='space-y-4'>
          <h3 className='font-semibold'>Image Generation Settings</h3>
          {Object.entries(inputData)
            .filter(([key]) => key in settings)
            .map(([key, value]) => (
              <div key={key} className='space-y-2'>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label>{value.title}</Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{value.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Controller
                  name={key as keyof ImageGenerationSettings}
                  control={control}
                  render={({ field }) => {
                    if ((value.type === 'string' && value.enum) || (value.allOf && value.allOf[0].enum)) {
                      const enumValues = value.enum || value.allOf[0].enum
                      return (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {enumValues.map((option: string) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )
                    } else if (value.type === 'integer' || value.type === 'number') {
                      return (
                        <div className='flex items-center space-x-2'>
                          <Slider
                            min={value.minimum}
                            max={value.maximum}
                            step={value.type === 'integer' ? 1 : 0.1}
                            value={[field.value]}
                            onValueChange={([val]) => field.onChange(val)}
                          />
                          <span className='w-12 text-right'>{field.value}</span>
                        </div>
                      )
                    } else if (value.type === 'boolean') {
                      return (
                        <Input
                          type='checkbox'
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      )
                    } else {
                      return <Input {...field} />
                    }
                  }}
                />
              </div>
            ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
