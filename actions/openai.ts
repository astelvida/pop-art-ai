import { pp } from '@/lib/pprint'
import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'
import { TRIGGER_WORD } from '@/lib/data/constants'
import { measureExecutionTime } from '@/lib/utils'
import { Completions } from 'openai/resources/completions.mjs'
/* eslint-disable */
/* prettier-ignore-file */

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/*
* 
IMAGE DETAILS
* 
*/

/* prettier-ignore-start */
const AiImageDetails = z.object({
  title: z.string().describe('Title of the image, like a typical artwork title'),
  caption: z.string().describe('Caption that we will use as metadata for the image'),
  description: z.string().describe('Description of the image from the perspective of a professional art critic'),
})  
/* prettier-ignore-end */

/**
 * Generates detailed analysis of an AI-generated image
 * @param imageUrl URL of the image to analyze
 * @param prompt Original prompt used to generate the image
 * @returns Structured object containing image details (title, caption, description, etc.)
 */
export async function generateImageDetails(imageUrl: string, prompt: string) {

  const promptText = `
You are a talented art critic. You are given an image and the following prompt which was used to generate the image:

Prompt: "${prompt}".

Extract the title, caption and description of the image from the perspective of a professional art critic.
`
    const completion = await openai.beta.chat.completions.parse({
      model: 'gpt-4o-2024-08-06',
      messages: [{
        role: 'user',
        content: [{
          type: 'image_url',
          image_url: { url: imageUrl },
        },{
          type: 'text',
          text: promptText,
        }],
      }],
      response_format: zodResponseFormat(AiImageDetails, 'ai_image_details'),
    })

    pp(completion.choices[0].message.parsed, 'image details') 
    return completion.choices[0].message.parsed
}






/*
* 
PROMPT GENERATORS
* 
*/

/**
 * Builds a prompt for generating multiple AI images
 * @param options Configuration object containing:
 *   - count: Number of prompts to generate
 *   - style: Optional style specification
 *   - theme: Optional theme specification
 *   - triggerWord: Required trigger word for the model
 * @returns Formatted prompt string
 */
export const promptBuilder = ({
  count = 5,
  style = '',
  theme = '',
  triggerWord,
}: {
  count: number
  style?: string
  theme?: string
  triggerWord: string
}) => `
Generate ${count} prompts using Flux/Dev Lora model finetuned with Roy Lichtenstein pop art artwork in Replica.
All prompts must include the trigger word "${triggerWord}"'.

The following features are important:
- Impact conveyed through facial expressions with a sense of dynamism and drama, evoking strong emotions
- A speech bubble written in a comic book style font, where you emphasxize the font, the color, the style and the correctness.
- ${theme ? `Theme: ${theme}` : 'N/A'}
- If them is N/A choose one of the following themes or come up with similar ones: damsel in distress, anxiety, despair, crying women, feeling stuck in bad relationships, patriarchy, poking at impossible beauty standards, romance, suffering, depression, longing, or the search for fame and money, the hypocrisy, does money make you happy or just empty, rich society, drugs, alcohol, etc.   
- A style that is tongue-in-cheek, satirical at times, high-brow humour, and a sense of irony
- The image should be a single image, not a series of images.
- It's an image and reinterpretation of Roy Lictenstein and comic books from the 70s and 80s. Be creative with the plot, the message, the characters, but don't deviate from this.
The prompts should be unique and not similar to each other. Be clever and aim for a mix of themes and styles.
`

/**
 * Prompt for describing images as if you were a professional art critic
 */
const PROMPT_ART_DESCRIBER = `
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

/**
 * Generates multiple creative prompts for AI image generation
 * Uses GPT-4 to create varied prompts based on specified themes
 * @returns String containing multiple generated prompts
 */
const defaultPromptOptions = {
  count: 5,
  theme: "society's beauty standards and drugs of choice",
  triggerWord: TRIGGER_WORD,
}
export async function generatePrompts(options = defaultPromptOptions) {
  const { result } = await measureExecutionTime(async () => {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: [
            {
              type: 'text',
              text: PROMPT_ART_DESCRIBER,
            },
          ],
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: promptBuilder(options),
            },
          ],
        },
      ],
    })
    return completion.choices[0].message.content
  })
  pp(result, 'prompts')
  return result
}


/**
 * Creates an embedding vector for given text using OpenAI's embedding model
 * @param text Text to create embedding for
 * @returns Float array representing the text embedding
 */
export async function embedText(text: string) {
  const result = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
    encoding_format: 'float',
  })

  console.log(result.data[0].embedding)
  return result.data[0].embedding
}

/**
 * Test function for image analysis using GPT-4 vision
 * @param imageUrl URL of the image to analyze
 * @param prompt Context prompt for the analysis
 * @returns AI-generated description of the image
 */
export async function testImageCompletion(imageUrl: string, prompt: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'What’s in this image? Give me a title, caption, and description.',
          },
          { type: 'image_url', image_url: { url: imageUrl } },
        ],
      },
    ],
  })

  const result = response.choices[0].message.content
  console.log(result)
  return result
}


// generatePrompts()   
// generateImageDetails('https://i.imgur.com/52xjYbU.png', 'a woman crying').then(pp)



// const themeDescription = 'Cheating on your partner'
// const withTheme = (theme: string) => `
// Create a one paragraph vivid and creative description based on the following theme:
// Theme: ${theme}
// `
