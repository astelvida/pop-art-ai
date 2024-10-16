import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDown } from "lucide-react"
import { aspectRatios, outputFormats } from '@/lib/form-data'

interface ImageGenerationSettingsProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  aspectRatio: string
  setAspectRatio: (ratio: string) => void
  numInferenceSteps: number
  setNumInferenceSteps: (steps: number) => void
  guidanceScale: number
  setGuidanceScale: (scale: number) => void
  promptStrength: number
  setPromptStrength: (strength: number) => void
  seed: string
  setSeed: (seed: string) => void
  outputFormat: string
  setOutputFormat: (format: string) => void
  outputQuality: number
  setOutputQuality: (quality: number) => void
  numOutputs: number
  setNumOutputs: (num: number) => void
}

export function ImageGenerationSettings({
  isOpen,
  onOpenChange,
  aspectRatio,
  setAspectRatio,
  numInferenceSteps,
  setNumInferenceSteps,
  guidanceScale,
  setGuidanceScale,
  promptStrength,
  setPromptStrength,
  seed,
  setSeed,
  outputFormat,
  setOutputFormat,
  outputQuality,
  setOutputQuality,
  numOutputs,
  setNumOutputs
}: ImageGenerationSettingsProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Image Generation Settings</SheetTitle>
        </SheetHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="aspect-ratio" className="text-sm font-medium">
              Aspect Ratio
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button id="aspect-ratio" variant="outline" className="w-full justify-between">
                  {aspectRatio}
                  <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <div className="grid grid-cols-2 gap-2 p-2">
                  {aspectRatios.map((ratio) => (
                    <Button
                      key={ratio.value}
                      variant={aspectRatio === ratio.value ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setAspectRatio(ratio.value)}
                      className="w-full justify-start"
                    >
                      <span className="mr-2">{ratio.icon}</span>
                      {ratio.label}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <label htmlFor="num_inference_steps" className="text-sm font-medium">
              Inference Steps: {numInferenceSteps}
            </label>
            <Slider
              id="num_inference_steps"
              min={1}
              max={50}
              step={1}
              value={[numInferenceSteps]}
              onValueChange={(value) => setNumInferenceSteps(value[0])}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="guidance_scale" className="text-sm font-medium">
              Guidance Scale: {guidanceScale.toFixed(1)}
            </label>
            <Slider
              id="guidance_scale"
              min={0}
              max={10}
              step={0.1}
              value={[guidanceScale]}
              onValueChange={(value) => setGuidanceScale(value[0])}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="prompt_strength" className="text-sm font-medium">
              Prompt Strength: {promptStrength.toFixed(2)}
            </label>
            <Slider
              id="prompt_strength"
              min={0}
              max={1}
              step={0.01}
              value={[promptStrength]}
              onValueChange={(value) => setPromptStrength(value[0])}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="seed" className="text-sm font-medium">
              Seed
            </label>
            <Input
              id="seed"
              type="number"
              placeholder="Enter seed (optional)"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="output_format" className="text-sm font-medium">
              Output Format
            </label>
            <Select value={outputFormat} onValueChange={setOutputFormat}>
              <SelectTrigger id="output_format">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                {outputFormats.map((format) => (
                  <SelectItem key={format.value} value={format.value}>{format.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="output_quality" className="text-sm font-medium">
              Output Quality: {outputQuality}
            </label>
            <Slider
              id="output_quality"
              min={0}
              max={100}
              step={1}
              value={[outputQuality]}
              onValueChange={(value) => setOutputQuality(value[0])}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="num_outputs" className="text-sm font-medium">
              Number of Outputs
            </label>
            <Input
              id="num_outputs"
              type="number"
              min={1}
              max={4}
              value={numOutputs}
              onChange={(e) => setNumOutputs(Number(e.target.value))}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
