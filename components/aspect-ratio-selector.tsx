'use client'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface AspectRatioOption {
  value: string
  label: string
  icon: string
}

const aspectRatioOptions: AspectRatioOption[] = [
  { value: '16:9', label: '16:9', icon: '⬛' },
  { value: '9:16', label: '9:16', icon: '▯' },
  { value: '1:1', label: '1:1', icon: '□' },
  { value: '5:2', label: '5:2', icon: '▭' },
  { value: '4:5', label: '4:5', icon: '▯' },
  { value: '4:3', label: '4:3', icon: '▭' },
]

interface AspectRatioSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function AspectRatioSelector({ value, onChange }: AspectRatioSelectorProps) {
  const selectedOption = aspectRatioOptions.find((option) => option.value === value)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-[200px] justify-start rounded-none border-2 border-black bg-white hover:bg-purple-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:-translate-y-1 hover:shadow-none transition-all',
            !value && 'text-muted-foreground'
          )}
        >
          <span className="mr-2 text-lg">{selectedOption?.icon}</span>
          {selectedOption?.label || 'Select aspect ratio'}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[280px] p-4 rounded-none border-2 border-black bg-[#1C1C1C] text-white"
        align="start"
      >
        <div className="space-y-4">
          <h4 className="font-medium leading-none text-lg">Aspect ratio</h4>
          <div className="grid grid-cols-2 gap-2">
            {aspectRatioOptions.map((option) => (
              <Button
                key={option.value}
                variant="ghost"
                className={cn(
                  'justify-start rounded-none border border-gray-700 hover:bg-gray-800 hover:border-gray-600 transition-colors',
                  value === option.value && 'bg-gray-800 border-gray-600'
                )}
                onClick={() => onChange(option.value)}
              >
                <span className="mr-2 text-lg">{option.icon}</span>
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
