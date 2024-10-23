export type Setting = {
  name: string
  type: 'text' | 'number' | 'select'
  label: string
  description: string
  default: string | number
  options?: string[]
  min?: number
  max?: number
  step?: number
}

export const settingsData: Setting[] = [
  // {
  //   name: 'prompt',
  //   type: 'text',
  //   label: 'Prompt',
  //   description: 'Prompt for generated image. If you include the `trigger_word` used in the training process you are more likely to activate the trained object, style, or concept in the resulting image.',
  //   default: '',
  // },
  {
    name: 'num_inference_steps',
    type: 'number',
    label: 'Num Inference Steps',
    description: 'Number of inference steps. More steps can give more detailed images, but take longer.',
    default: 28,
    min: 1,
    max: 50,
    step: 1,
  },
  {
    name: 'num_outputs',
    type: 'number',
    label: 'Num Outputs',
    description: 'Number of images to output.',
    default: 1,
    min: 1,
    max: 4,
    step: 1,
  },
  {
    name: 'aspect_ratio',
    type: 'select',
    label: 'Aspect Ratio',
    description:
      "Aspect ratio for the generated image in text-to-image mode. The size will always be 1 megapixel, i.e. 1024x1024 if aspect ratio is 1:1. To use arbitrary width and height, set aspect ratio to 'custom'. Note: Ignored in img2img and inpainting modes.",
    default: '1:1',
    options: ['1:1', '16:9', '9:16', '3:4', '4:3', '21:9', '3:2', '2:3', '4:5', '5:4', 'custom'],
  },
  {
    name: 'output_format',
    type: 'select',
    label: 'Output Format',
    description: 'Format of the output images.',
    default: 'webp',
    options: ['webp', 'jpg', 'png'],
  },
  {
    name: 'output_quality',
    type: 'number',
    label: 'Output Quality',
    description:
      'Quality when saving the output images, from 0 to 100. 100 is best quality, 0 is lowest quality. Not relevant for .png outputs.',
    default: 90,
    min: 0,
    max: 100,
    step: 1,
  },
]
