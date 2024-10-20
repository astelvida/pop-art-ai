export type ImageOrImages = string | string[]

export interface ImageGenerationOptions {
  aspectRatio?: string
  numInferenceSteps?: number
  guidanceScale?: number
  promptStrength?: number
  outputFormat?: 'jpg' | 'png' | 'webp'
  outputQuality?: number
  numOutputs?: number
  seed?: string
}

// Sample Prompt Tags
export type SamplePromptTag = 'general' | 'sarcastic' | 'witty' | 'sarcastic_no_speech_bubbles' | 'complex'

export type SamplePrompts = {
  [key in SamplePromptTag]: string[]
}
