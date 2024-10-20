import { pp } from '@/lib/pprint'
import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const AiImageDetails = z.object({
  title: z.string(),
  caption: z.string(),
  description: z.string(),
  story: z.string(),
  nextPrompt: z.string(),
  isTextAccurate: z.boolean(),
})

export async function generateImageDetails(imageUrl: string, prompt: string) {
  const completion = await openai.beta.chat.completions.parse({
    model: 'gpt-4o-2024-08-06',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: imageUrl,
            },
          },
          {
            type: 'text',
            text: `Given this image, and this prompt: "pop art comic book image of ${prompt}", extract the title, caption that goes with the image, a description, a short story scene that would describe a comic book panel. If there is a speech bubble, compare the text inside it to the prompt and determine if it is accurate, if there is none then set it to NULL. If it is, set isTextAccurate to true, otherwise false. Finally, suggest the next prompt to generate an image that continues the comic book series.`,
          },
        ],
      },
    ],
    response_format: zodResponseFormat(AiImageDetails, 'ai_image_details'),
  })

  const result = completion.choices[0].message.parsed
  pp(result, 'RESULT')
  return result
}

const promptArtDescriber = `
You are an art describer who describes images using text as if you were a professional art critic with extensive knowledge. 
When given any text, treat it as if it is a brief artwork description, then expand on it whilst keeping the original style, subject, and any quoted text. 
Focus on:
1. The main subject (describe in more detail)
2. The artistic style
3. The background or setting
4. How the quoted text is shown
Be creative but stay true to the original concept.
Create a single paragraph description, focusing on details relevant for image generation.
Maintain the style of Stable Diffusion prompts, keeping the original concept intact while adding creative details.
Maintain any text in quotes. 
Do not ask questions or add any preamble.
`

const promptPopArt = `
You are an artist generating pop art comic book style images using Flux/Dev model finetuned with Lora in Replica. 
All prompts must include the trigger word 'pop art comic book' and should feature a speech bubble in most prompts.
Create a one paragraph vivid and creative description with the following features:
- A pop art comic book visual style (comic book imagery, Ben-Day dots, vibrant colours: acid yellow, dull green, purplish-blue, and Life Magazine red)
- Specific elements of the scene
- Emotional impact conveyed through facial expressions and exaggerated features
- A speech bubble with what the main character is saying
- A sense of dynamism and drama
- Common themes like damsel in distress, anxious or crying women, feeling stuck in bad relationships, patriarchy, poking at impossible beauty standards, romance, suffering, depression, longing, or the search for fame and money
- A style that is tongue-in-cheek, satirical at times, high-brow humour
Focus on:
1. The main subject (describe in more detail)
2. The artistic style
3. The background or setting
4. How the quoted text is shown
Be creative but stay true to the original concept.
`

export async function generatePrompts() {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      // {
      //   role: 'system',
      //   content: [
      //     {
      //       type: 'text',
      //       text: promptArtDescriber,
      //     },
      //   ],
      // },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: promptPopArt,
          },
        ],
      },
    ],
  })

  const result = completion.choices[0].message.content
  pp(result, 'RESULT')
  return result
}

// export async function generateImageDetails(imageUrl: string, prompt: string) {
//   const response = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [
//       {
//         role: "user",
//         content: [
//           { type: "text", text: "What’s in this image? Give me a title, caption, and description." },
//           {
//             type: "image_url",
//             image_url: {
//               url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
//             },
//           },
//         ],
//       },
//     ],
//   });
//   console.log(response.choices[0]);

//   return response.choices[0].message.content;
// }
// generateImageDetailsStructuredOutput('https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg', 'An image of a nature boardwalk with a clear sky and grass')

// const themeDescription = 'Cheating on your partner'
// const withTheme = (theme: string) => `
// Create a one paragraph vivid and creative description based on the following theme:
// Theme: ${theme}
// `
