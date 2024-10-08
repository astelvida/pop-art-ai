"use server"
import replicateAI from './replicate'

const MODEL = 'astelvida/pop-art:393c9b328cd1ac2f0127db9c7871eef86fded0c369ce2bfb888f9f217c21ca62'

export async function generatePopArtImage(prompt: string) {
  console.log('Running...')
  const output = await replicateAI.run(
    MODEL,
    {
      model: 'dev',
      lora_scale: 1,
      num_outputs: 1,
      aspect_ratio: '1:1',
      output_format: 'jpg',
      guidance_scale: 3.5,
      output_quality: 90,
      prompt_strength: 0.8,
      extra_lora_scale: 1,
      num_inference_steps: 28,
      prompt: prompt,
    })
  console.log(output)
  console.log('Done!')
  return output
}

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