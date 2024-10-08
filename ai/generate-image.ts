import replicateAI from './replicate'
import fs from 'fs'

const MODEL = 'astelvida/pop-art:393c9b328cd1ac2f0127db9c7871eef86fded0c369ce2bfb888f9f217c21ca62'

const defaultParams = {
  model: 'dev',
  lora_scale: 1,
  num_outputs: 1,
  aspect_ratio: '1:1',
  output_format: 'webp',
  guidance_scale: 3.5,
  output_quality: 90,
  prompt_strength: 0.8,
  extra_lora_scale: 1,
  num_inference_steps: 28,
}

export async function generatePopArtImage(prompt: string, customParams = {}) {
  const input = {
    ...defaultParams,
    ...customParams,
    prompt,
  }

  console.log('Using model: %s', MODEL)
  console.log('With input: %O', input)

  console.log('Running...')
  const output = await replicateAI.run(MODEL, { input })
  console.log('Done!', output)

  fs.writeFileSync('output.webp', output[0].output)

  return output
}

const prompts = ['pop art comic book image of donaldtrump and melania, tears, drama, and speech bubbles with nothing but the words "what the fuck"']
const consumerismRebellion = 'A pop art-style image inspired by Roy Lichtenstein, showcasing a shopping cart overflowing with luxury items like designer handbags, jewelry, and electronics. The central figure, a person with exaggerated features and a pained expression, pushes the cart through a chaotic, neon-colored cityscape. Comic-book speech bubbles scream "BUY!" and "MORE!" in bold text, satirizing the relentless pursuit of consumerism. The bright colors and dotted shading create a vibrant, commercialized nightmare.'
prompts.push(consumerismRebellion)
// prompts.forEach(prompt => {
generatePopArtImage(prompts[1x])
// })





