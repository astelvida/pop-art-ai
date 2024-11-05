import { pp } from '@/lib/pprint'
import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'
import { TRIGGER_WORD } from '@/lib/data/constants'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const AiImageDetails = z.object({
  title: z.string().optional().describe('Title of the image, like a typical artwork title'),
  caption: z.string().optional().describe('Caption that we will use as metadata for the image'),
  description: z
    .string()
    .optional()
    .describe(
      'Description a professional art critic would write. Be creative and interpret what the artist was trying to convey.',
    ),
  text: z
    .string()
    .optional()
    .describe(
      'The written text inside the bubble speech or multiple speech bubbles if needed. Look for ANY TEXT in the image. Write always the correct text, the one in the prompt.',
    ),
  enhancedPrompt: z
    .string()
    .optional()
    .describe(
      'An enhanced prompt that will make this artwork better. Focus on the following elements that sometimes need improvement:',
    ),
  rating: z.any().optional().describe('On a scale from 1 to 5, how good is the image?'),
  theme: z
    .string()
    .optional()
    .describe(
      'Theme, category or main idea of the image. Write three words that describe the image, separated by commas.',
    ),
})

const createPrompt = (prompt: string) => {
  let triggerWordPrompt = prompt.includes(TRIGGER_WORD) ? prompt : `${TRIGGER_WORD} image of ${prompt}`

  triggerWordPrompt = triggerWordPrompt.trim()

  return `
You are an contemporary pop art comic book artist and art critic. Roy Lichtenstein or Bansky would be proud of your work and your sharp eye and ocassionally sharp tongue.
You are also an amazing Prompt Engineer working with a finetuned version of Flux/Dev Lora model, trained with Roy Lichtenstein's most famous pop art artwork.  

Given the image from the image_url in this message thread and the image's prompt:
\`\`\`
${triggerWordPrompt}
\`\`\`

As a great art critic and art describer and prompt writer, you need to write the following:
  - title of the image, like a typical artwork title
  - caption that wed will use as metadata for the image
  - description a professional art critic would write. Be creative and interpret what the artist was trying to convey.
  - theme, category or main idea of the image. Write three words that describe the image, separated by commas. 
  - the written text inside the bubble speech or multiple speech bubbles if needed. Look for ANY TEXT in the image. Write always the correct text, the one in the prompt.

Then write an enhanced prompt of the current prompt that you think will get better results and nmake the artwork more impactful.
Focus on the following elements that sometimes needÍ improvement:
  - MAKE SURE THE TEXT IN THE IMAGE IS ACCURATE, LEGIBLE AND CONSISTENT WITH THE PROMPT. Check the speech-bubble text in the image and the text in the prompt. 
  - correct and emphasize the importance of accurate text. The text is in speech bubbes, but can also appear in other parts og the image.
  - the style is not really similar to Lichtenstein's style, there should be at least 3 elements from his style. Remind the artist what Roy Lichtenstein would do in this situation.
  - visual elements don't really mirror the prompt, write a clearer, better, more detailed prompt.
  - the image is artwork, it should make you feel something. A sense of drama, subtle humour/satire while still feeling a bit uneasy. Make the viewer think. Remind the artist of this.

Finally, on a scale from 1 to 5, how good is the image?
  - Give a rating to the image. 1 means the image is not good at all, it was boring and unitersting or poorly excuted, and 5 means it is perfect, you felt the emotion and thought about it.  The rating is given by his colleagues, other artists. It's relative to this specific artistic style.
`
}

// a short comic book scene,
// the next prompt to generate the next comic book panel
// Also, determine if the text in the speech bubble is accurate and legible.

export async function embedText(text: string) {
  const result = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
    encoding_format: 'float',
  })

  console.log(result.data[0].embedding)
  return result.data[0].embedding
}

export async function generateImageDetails(imageUrl: string, prompt: string) {
  const completion = await openai.beta.chat.completions.parse({
    model: 'gpt-4o-2024-08-06',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: imageUrl },
          },
          {
            type: 'text',
            text: createPrompt(prompt),
          },
        ],
      },
    ],
    response_format: zodResponseFormat(AiImageDetails, 'ai_image_details'),
  })

  const result = completion.choices[0].message.parsed

  return result
}

// const promptArtDescriber = `
// You are an art describer who describes images using text as if you were a professional art critic with extensive knowledge.
// When given any text, treat it as if it is a brief artwork description, then expand on it whilst keeping the original style, subject, and any quoted text.
// Focus on:
// 1. The main subject (describe in more detail)
// 2. The artistic style
// 3. The background or setting
// 4. How the quoted text is shown
// Be creative but stay true to the original concept.
// Create a single paragraph description, focusing on details relevant for image generation.
// Maintain the style of Stable Diffusion prompts, keeping the original concept intact while adding creative details.
// Maintain any text in quotes.
// Do not ask questions or add any preamble.
// `

// const promptPopArt = `
// Generate 5 pop art comic book style images using Flux/Dev Lora model finetuned with Roy Lichtenstein pop art artwork in Replica.
// All prompts must include the trigger word 'pop art comic book'.
// The following features are important:
// - Impact conveyed through facial expressions with a sense of dynamism and drama, evoking strong emotions
// - A speech bubble written in a comic book style font
// - Themes like damsel in distress, anxious or crying women, feeling stuck in bad relationships, patriarchy, poking at impossible beauty standards, romance, suffering, depression, longing, or the search for fame and money
// - A style that is tongue-in-cheek, satirical at times, high-brow humour, and a sense of irony

// The prompts should be unique and not similar to each other. Think outside the box.
// `

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

//   return response.choices[0].message.content;
// }
// generateImageDetailsStructuredOutput('https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg', 'An image of a nature boardwalk with a clear sky and grass')

// const themeDescription = 'Cheating on your partner'
// const withTheme = (theme: string) => `
// Create a one paragraph vivid and creative description based on the following theme:
// Theme: ${theme}
// `
