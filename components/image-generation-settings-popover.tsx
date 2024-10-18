import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, Settings } from "lucide-react";
import { aspectRatios, outputFormats } from "@/lib/form-data";
import { Label } from "@/components/ui/label";
import { useState } from "react";
export interface ImageGenerationSettingsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  aspectRatio: string;
  setAspectRatio: (ratio: string) => void;
  numInferenceSteps: number;
  setNumInferenceSteps: (steps: number) => void;
  guidanceScale: number;
  setGuidanceScale: (scale: number) => void;
  promptStrength: number;
  setPromptStrength: (strength: number) => void;
  outputFormat: "jpg" | "png" | "webp";
  setOutputFormat: (format: string) => void;
  outputQuality: number;
  setOutputQuality: (quality: number) => void;
  numOutputs: number;
  setNumOutputs: (num: number) => void;
  seed: string;
  setSeed: (seed: string) => void;
}

export interface ImageGenerationOptions {
  aspectRatio?: string;
  numInferenceSteps?: number;
  guidanceScale?: number;
  promptStrength?: number;
  outputFormat?: "jpg" | "png" | "webp";
  outputQuality?: number;
  numOutputs?: number;
  seed?: string;
}

export type ImageGenerationSettingsValues = Partial<
  Pick<
    ImageGenerationSettingsProps,
    | "aspectRatio"
    | "numInferenceSteps"
    | "guidanceScale"
    | "promptStrength"
    | "outputQuality"
    | "numOutputs"
    | "outputFormat"
    | "seed"
  >
>;

export function ImageGenerationSettingsPopover({
  isOpen,
  onOpenChange,
  toggleSettings,
  handleSettingChange,
  settings,
}: ImageGenerationSettingsProps) {
  return (
      <Popover open={isOpen} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={toggleSettings}
            >
              <Settings  className="h-6 w-6" />
              <span className="sr-only">Open settings</span>
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
        <div className="space-y-4">
                <h3 className="font-semibold">Image Generation Settings</h3>
                <div className="space-y-2">
                  <Label>Aspect Ratio</Label>
                  <Select value={settings.aspectRatio} onValueChange={(value) => handleSettingChange('aspectRatio', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1:1">1:1</SelectItem>
                      <SelectItem value="16:9">16:9</SelectItem>
                      <SelectItem value="4:3">4:3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Inference Steps: {settings.inferenceSteps}</Label>
                  <Slider min={1} max={50} step={1} value={[settings.inferenceSteps]} onValueChange={([value]) => handleSettingChange('inferenceSteps', value)} />
                </div>
                <div className="space-y-2">
                  <Label>Guidance Scale: {settings.guidanceScale}</Label>
                  <Slider min={1} max={10} step={0.1} value={[settings.guidanceScale]} onValueChange={([value]) => handleSettingChange('guidanceScale', value)} />
                </div>
                <div className="space-y-2">
                  <Label>Prompt Strength: {settings.promptStrength}</Label>
                  <Slider min={0} max={1} step={0.01} value={[settings.promptStrength]} onValueChange={([value]) => handleSettingChange('promptStrength', value)} />
                </div>
                <div className="space-y-2">
                  <Label>Seed</Label>
                  <Input placeholder="Enter seed (optional)" value={settings.seed} onChange={(e) => handleSettingChange('seed', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Output Format</Label>
                  <Select value={settings.outputFormat} onValueChange={(value) => handleSettingChange('outputFormat', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jpg">jpg</SelectItem>
                      <SelectItem value="png">png</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Output Quality: {settings.outputQuality}</Label>
                  <Slider min={1} max={100} step={1} value={[settings.outputQuality]} onValueChange={([value]) => handleSettingChange('outputQuality', value)} />
                </div>
                <div className="space-y-2">
                  <Label>Number of Outputs</Label>
                  <Input type="number" min={1} max={10} value={settings.numberOfOutputs} onChange={(e) => handleSettingChange('numberOfOutputs', parseInt(e.target.value))} />
                </div>
                
              </div>
        </PopoverContent>
      </Popover>
  );
}
