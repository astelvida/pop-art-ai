
export type ImageOrImages = string | string[];

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