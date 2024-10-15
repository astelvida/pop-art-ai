"use server"
import replicateAI from './replicate'

const MODEL = 'astelvida/pop-art:393c9b328cd1ac2f0127db9c7871eef86fded0c369ce2bfb888f9f217c21ca62'
const TRIGGER_WORD = 'pop art comic book'

export async function generatePopArtImage(prompt: string) {
  console.log('Running...')

  if (!prompt.includes(TRIGGER_WORD)) {
    prompt = `${prompt}, in the style of ${TRIGGER_WORD}`
  }

  const output = await replicateAI.run(MODEL, {
    input: {
      model: 'dev',
      lora_scale: 1,
      num_outputs: 1,
      aspect_ratio: '16:9',
      output_format: 'jpg',
      guidance_scale: 3.5,
      output_quality: 80,
      prompt_strength: 0.8,
      extra_lora_scale: 1,
      num_inference_steps: 28,
      // height: 512,
      // width: 512,
      prompt: prompt,
    }
  })


  const result = output[0]
  console.log('Done!', result)
  return result
}



const suggestions = []


async function generateImages() {
  for (const suggestion of suggestions) {
    const output = await generatePopArtImage(suggestion)
    console.log(JSON.stringify({ suggestion, output }, null, 2))
  }
}

// generateImages()

// const prompts = ['pop art comic book image of donaldtrump and melania, tears, drama, and speech bubbles with nothing but the words "what the fuck"']
// const consumerismRebellion = 'A pop art-style image inspired by Roy Lichtenstein, showcasing a shopping cart overflowing with luxury items like designer handbags, jewelry, and electronics. The central figure, a person with exaggerated features and a pained expression, pushes the cart through a chaotic, neon-colored cityscape. Comic-book speech bubbles scream "BUY!" and "MORE!" in bold text, satirizing the relentless pursuit of consumerism. The bright colors and dotted shading create a vibrant, commercialized nightmare.'



// const moodPrompts = {
//   depressed: "despair, hangover, ecstasy",
//   mysterious: "shadowy, enigmatic, subversive",
//   dramatic: "intense, emotional, dramatic",
//   humorous: "whimsical, exaggerated, playful",
//   dark: "gloomy, somber, despair"
// };
// const moodPrompt = moodPrompts[mood as keyof typeof moodPrompts] || "";