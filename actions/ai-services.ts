"use server";
import { ImageGenerationOptions } from "@/lib/types";
import Replicate from "replicate";
import { pp, pp2 } from "@/lib/pprint";

const replicateAI = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export type PredictionInput = {
  model: string;
  prompt: string;
  lora_scale: number;
  num_outputs: number;
  aspect_ratio: string;
  output_format: "jpg" | "png" | "webp";
  guidance_scale: number;
  output_quality: number;
  prompt_strength: number;
  extra_lora_scale: number;
  num_inference_steps: number;
  seed?: string;
};

// const MODEL_SMA =
//   "astelvida/sma-lora-trainer:393c9b328cd1ac2f0127db9c7871eef86fded0c369ce2bfb888f9f217c21ca62";
// const TRIGGER_WORD = "SMA";
const MODEL_POP_ART =
  "astelvida/pop-art:393c9b328cd1ac2f0127db9c7871eef86fded0c369ce2bfb888f9f217c21ca62";
const TRIGGER_WORD= "pop art comic book";
// let finalPrompt = prompt;
// if (!prompt.includes(TRIGGER_WORD)) {
//   finalPrompt = `${prompt}, in ${TRIGGER_WORD} style`;
// }

export async function generatePopArtImage(
  prompt: string,
  options: ImageGenerationOptions
) {
  console.log("Running...");
  console.log("PROMPT", prompt);
  const finalPrompt = `${TRIGGER_WORD} image of ${prompt} `
  const input = {
    prompt: finalPrompt,
    model: "dev",
    lora_scale: 1,
    num_outputs: options.numOutputs || 1,
    aspect_ratio: options.aspectRatio || "1:1",
    output_format: options.outputFormat || "jpg",
    guidance_scale: options.guidanceScale || 3.5,
    output_quality: options.outputQuality || 90,
    prompt_strength: options.promptStrength || 0.8,
    extra_lora_scale: 1,
    num_inference_steps: options.numInferenceSteps || 28,
  };

  if (options.seed) { 
    input.seed = options.seed;
  }

  pp(input);
  const output = await replicateAI.run(MODEL_POP_ART, {
    input,
  });
  pp(output);

  return output;
}