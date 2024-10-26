import { z } from 'zod'

export const inputSchema = z.object({
  prompt: z
    .string()
    .describe(
      'Prompt for generated image. If you include the `trigger_word` used in the training process you are more likely to activate the trained object, style, or concept in the resulting image. [Title: Prompt]',
    ),

  num_inference_steps: z
    .number()
    .int()
    .min(1)
    .max(50)
    .optional()
    .default(28)
    .describe(
      'Number of inference steps. More steps can give more detailed images, but take longer. [Title: Num Inference Steps]',
    ),

  num_outputs: z.number().int().min(1).max(4).default(1).describe('Number of images to output. [Title: Num Outputs]'),

  aspect_ratio: z
    .enum(['1:1', '16:9', '9:16', '3:4', '4:3' /* '21:9', '3:2', '2:3', '4:5', '5:4', 'custom' */])
    .default('1:1')
    .optional()
    .describe(
      "Aspect ratio for the generated image in text-to-image mode. The size will always be 1 megapixel, i.e. 1024x1024 if aspect ratio is 1:1. To use arbitrary width and height, set aspect ratio to 'custom'. Note: Ignored in img2img and inpainting modes. [Title: Aspect Ratio]",
    ),

  output_format: z
    .enum(['webp', 'jpg', 'png'])
    .default('webp')
    .describe('Format of the output images. [Title: Output Format]'),

  output_quality: z
    .number()
    .int()
    .min(0)
    .max(100)
    .default(90)
    .optional()
    .describe(
      'Quality when saving the output images, from 0 to 100. 100 is best quality, 0 is lowest quality. Not relevant for .png outputs [Title: Output Quality]',
    ),
})

export type InputSchema = z.infer<typeof inputSchema>
export type SettingsSchema = Omit<InputSchema, 'prompt'>
// mask: z
//     .string()
//     .url()
//     .optional()
//     .describe(
//       "Input mask for inpainting mode. Black areas will be preserved, white areas will be inpainted. Must be provided along with 'image' for inpainting mode. [Title: Mask]",
//     ),

// seed: z.number().int().optional().describe('Random seed. Set for reproducible generation. [Title: Seed]'),

// image: z
//   .string()
//   .url()
//   .optional()
//   .describe(
//     'Input image for img2img or inpainting mode. If provided, aspect_ratio, width, and height inputs are ignored. [Title: Image]',
//   ),

// model: z
//   .enum(['dev', 'schnell'])
//   .default('dev')
//   .optional()
//   .describe(
//     'Which model to run inferences with. The dev model needs around 28 steps but the schnell model only needs around 4 steps. [Title: Model]',
//   ),

// width: z
//   .number()
//   .int()
//   .min(256)
//   .max(1440)
//   .optional()
//   .describe(
//     "Width of the generated image in text-to-image mode. Only used when aspect_ratio=custom. Must be a multiple of 16 (if it's not, it will be rounded to nearest multiple of 16). Note: Ignored in img2img and inpainting modes. [Title: Width]",
//   ),

// height: z
//   .number()
//   .int()
//   .min(256)
//   .max(1440)
//   .optional()
//   .describe(
//     "Height of the generated image in text-to-image mode. Only used when aspect_ratio=custom. Must be a multiple of 16 (if it's not, it will be rounded to nearest multiple of 16). Note: Ignored in img2img and inpainting modes. [Title: Height]",
//   ),

// extra_lora: z
//   .string()
//   .optional()
//   .describe(
//     "Combine this fine-tune with another LoRA. Supports Replicate models in the format <owner>/<username> or <owner>/<username>/<version>, HuggingFace URLs in the format huggingface.co/<owner>/<model-name>, CivitAI URLs in the format civitai.com/models/<id>[/<model-name>], or arbitrary .safetensors URLs from the Internet. For example, 'fofr/flux-pixar-cars' [Title: Extra Lora]",
//   ),

// lora_scale: z
//   .number()
//   .min(-1)
//   .max(2)
//   .default(1)
//   .optional()
//   .describe(
//     'Determines how strongly the main LoRA should be applied. Sane results between 0 and 1. [Title: Lora Scale]',
//   ),

// guidance_scale: z
//   .number()
//   .min(0)
//   .max(10)
//   .default(3.5)
//   .optional()
//   .describe(
//     'Guidance scale for the diffusion process. Lower values can give more realistic images. Good values to try are 2, 2.5, 3 and 3.5 [Title: Guidance Scale]',
//   ),

// prompt_strength: z
//   .number()
//   .min(0)
//   .max(1)
//   .default(0.8)
//   .optional()
//   .describe(
//     'Prompt strength when using img2img / inpaint. 1.0 corresponds to full destruction of information in image [Title: Prompt Strength]',
//   ),

// extra_lora_scale: z
//   .number()
//   .min(-1)
//   .max(2)
//   .default(1)
//   .optional()
//   .describe('Determines how strongly the extra LoRA should be applied. [Title: Extra Lora Scale]'),

// replicate_weights: z
//   .string()
//   .optional()
//   .describe('Replicate LoRA weights to use. Leave blank to use the default weights. [Title: Replicate Weights]'),

// disable_safety_checker: z
//   .boolean()
//   .default(false)
//   .describe('Disable safety checker for generated images. [Title: Disable Safety Checker]'),
