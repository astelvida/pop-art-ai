'use client'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ArrowUp, Paintbrush, SettingsIcon, Shuffle, Wand2 } from 'lucide-react'
import { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react'
import useWindowSize from '@/lib/hooks/use-window-size'
import { ArrowTopRightIcon } from '@radix-ui/react-icons'
import { randomPrompt, randomPrompts, shuffle } from '@/lib/utils'
import { SamplePromptTag } from '@/lib/types'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { REGROUPED_PROMPTS as prompts } from '@/lib/data/prompts'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import SettingsForm from '@/components/settings-form'
import { settingsData } from '@/lib/data/settings'
import { type SettingsSchema } from '@/lib/schemas/inputSchema'
import { toast } from 'sonner'

const suggestions = Object.keys(prompts).map((category) => {
  const [name, description] = category.split(': ')
  return {
    id: category,
    name,
    description,
  }
})

interface PromptSuggestionsProps {
  setPrompt: (suggestion: string) => void
  category: string
}

interface PromptInputProps {
  handleGenerateImage: () => void
  isGenerating: boolean
  prompt: string
  setPrompt: (prompt: string) => void
  settings: SettingsSchema
  handleSettingChange: (settingKey: keyof SettingsSchema, value: any) => void
  children?: React.ReactNode
}
export default function PromptForm({
  handleGenerateImage,
  isGenerating,
  prompt,
  setPrompt,
  settings,
  handleSettingChange,
  children,
}: PromptInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [promptCategory, setPromptCategory] = useState<keyof typeof prompts>()
  // const [suggestions, setSuggestions] = useState<string[]>([])
  const [isSticky, setIsSticky] = useState(false)
  const stickyRef = useRef<HTMLDivElement>(null)
  // Use useCallback to memoize the function
  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      handleGenerateImage()
    }
  }

  const truncateSuggestion = (suggestion: string, maxLength: number) => {
    return suggestion.length > maxLength ? suggestion.slice(0, maxLength - 3) + '...' : suggestion
  }

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value)
    adjustHeight()
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      if (isGenerating) {
        toast.info('Please wait for the model to finish its response!')
      } else {
        handleSubmit(event)
      }
    }
  }

  // Use useEffect to generate suggestions on mount and when promptCategory changes
  useLayoutEffect(() => {
    adjustHeight()
  }, [prompt])

  // Add useEffect to handle textarea resizing on input change

  return (
    <div
      ref={stickyRef}
      className={`sticky top-0 z-10 transition-all duration-300 ease-in-out
          ${isSticky ? 'bg-white/80 backdrop-blur-md shadow-lg' : ''}`}
    >
      <div className="container mx-auto max-w-4xl px-4 py-4">
        <div className="relative mb-4">
          <div className="absolute top-4 left-3 pointer-events-none">
            <Paintbrush className="h-5 w-5 text-gray-400" />
          </div>
          <div className="relative">
            <Textarea
              ref={textareaRef}
              placeholder="Start with one of the suggested themes below or write your own"
              value={prompt}
              onChange={handlePromptChange}
              className="pl-10 pr-20 py-4 rounded-none border-4 border-black focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 ease-in-out resize-none overflow-hidden min-h-[6rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
              rows={3}
              onKeyDown={handleKeyDown}
            />

            <Button
              onClick={handleGenerateImage}
              disabled={isGenerating}
              className="absolute right-4 bottom-4 rounded-none px-4 py-2 bg-black text-white font-bold transition-all duration-300 ease-in-out hover:bg-purple-600 hover:translate-x-1 hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating...
                </div>
              ) : (
                <>
                  <Wand2 className="h-5 w-5 mr-2" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {suggestions.slice(0).map((suggestedCategory, index) => (
            <button
              key={suggestedCategory.id}
              onClick={() => setPrompt(randomPrompt(suggestedCategory.id as SamplePromptTag))}
              className="px-3 py-1 bg-white text-black border-2 border-black rounded-full text-sm font-bold hover:bg-purple-100 transition-colors duration-150 ease-in-out shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              {suggestedCategory.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// {/* SETTINGS POPOVER TRIGGER BUTTON */}
// {/* <Popover>
//       <PopoverTrigger asChild>
//         <Button className="absolute bottom-3 left-3 rounded-full [&_svg]:size-6">
//           <SettingsIcon className="h-6 w-6" />
//           Settings
//           <span className="sr-only">Open settings</span>
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-80">
//         <div className="grid gap-4">
//           <div className="space-y-2">
//             <h4 className="font-medium leading-none">Prompt Settings</h4>
//             <p className="text-sm text-muted-foreground">
//               Customize your prompt generation settings
//             </p>
//           </div>
//           <SettingsForm handleSettingChange={handleSettingChange} settings={settings} />
//           <div className="grid gap-2">
//             <div className="grid grid-cols-3 items-center gap-4">
//               <Label htmlFor="category">Category</Label>
//               <Select
//                 value={promptCategory}
//                 onValueChange={(value) => setPromptCategory(value as keyof typeof prompts)}
//                 className="col-span-2"
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select category" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {Object.keys(prompts).map((category) => (
//                     <SelectItem key={category} value={category}>
//                       {category}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </div>
//       </PopoverContent>
//     </Popover> */}
// {/* RANDOMIZE BUTTON */}
// {/* <Button
//       type="button"
//       variant="ghost"
//       size="icon"
//       className="absolute right-2 top-2"
//       onClick={() => setPrompt(randomPrompt(promptCategory as SamplePromptTag))}
//       disabled={isGenerating}
//     >
//       <Shuffle className="h-4 w-4" />
//       <span className="sr-only">Randomize prompt</span>
//     </Button> */}
// {/* GENERATE BUTTON */}
// {/* <Button
//       type="submit"
//       disabled={isGenerating || !prompt.trim()}
//       size="icon"
//       className="absolute bottom-4 right-4 rounded-full"
//     >
//       <ArrowUp className="h-4 w-4" />
//       <span className="sr-only">Generate Image</span>
//     </Button> */}
