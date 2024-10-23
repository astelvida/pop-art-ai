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
  const { control, watch } = useForm<SettingsSchema>({
    resolver: zodResolver(inputSchema.omit({ prompt: true })),
    defaultValues: settings,
  })

  const formValues = useRef(settings)

  useEffect(() => {
    const subscription = watch((value) => {
      formValues.current = value as InputSchema
      handleSettingChange(value)
    })
    return () => subscription.unsubscribe()
  }, [watch, handleSettingChange])

  console.log(Object.entries(inputSchema.shape).filter(([key]) => key !== 'prompt' && key in settings))

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
          {Object.entries(inputSchema.shape)
            .filter(([key]) => key !== 'prompt' && key in settings)
            .map(([key, value]) => (
              <div key={key} className='space-y-2'>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label htmlFor={key}>{value.description}</Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{value.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Controller
                  name={key as keyof SettingsSchema}
                  control={control}
                  render={({ field }) => {
                    if (key === 'aspect_ratio') {
                      return (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id={key}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(value as any)._def.values.map((option: string) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )
                    } else if (key === 'output_format') {
                      return (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id={key}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(value as any)._def.values.map((option: string) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )
                    } else if (key === 'num_inference_steps' || key === 'num_outputs' || key === 'output_quality') {
                      return (
                        <div className='flex items-center space-x-2'>
                          <Slider
                            id={key}
                            min={(value as any).minValue ?? 0}
                            max={(value as any).maxValue ?? 100}
                            step={1}
                            value={[field.value]}
                            onValueChange={([val]) => field.onChange(val)}
                          />
                          <span className='w-12 text-right'>{field.value}</span>
                        </div>
                      )
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
