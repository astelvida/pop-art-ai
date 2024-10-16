"use server"
import Replicate from 'replicate'

const replicateAI = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

const MODEL = 'astelvida/pop-art:393c9b328cd1ac2f0127db9c7871eef86fded0c369ce2bfb888f9f217c21ca62'
const TRIGGER_WORD = 'pop art comic book'

export async function generatePopArtImage(prompt: string) {
  console.log('Running...')
  console.log("PROMPT", prompt)
  let finalPrompt = prompt
  if (!prompt.includes(TRIGGER_WORD)) {
    finalPrompt = `${prompt}, in ${TRIGGER_WORD} style`
  }
  console.log("FINAL PROMPT", finalPrompt)
  const output = await replicateAI.run(MODEL, {
    input: {
      model: 'dev',
      lora_scale: 1,
      num_outputs: 1,
      aspect_ratio: '1:1',
      output_format: 'jpg',
      guidance_scale: 3.5,
      output_quality: 40,
      prompt_strength: 0.8,
      extra_lora_scale: 1,
      num_inference_steps: 10,
      prompt: prompt,
    }
  })

  const result = output[0]
  console.log('Done!', result)
  return result
}

export async function trainModel() {
  console.log('start training')
  const training = await replicateAI.trainings.create(
    "ostris",
    "flux-dev-lora-trainer",
    "6f1e7ae9f285cfae6e12f8c18618418cfefe24b07172a17ff10a64fb23a6b772",
    {
      destination: "astelvida/pop-art",
      input: {
        steps: 1000,
        hf_token: "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",
        lora_rank: 30,
        optimizer: "adamw8bit",
        batch_size: 1,
        hf_repo_id: "astelvida/pop-art",
        resolution: "512,768,1024",
        autocaption: true,
        input_images: "https://example.com/image_inputs.zip",
        trigger_word: "SMA",
        learning_rate: 0.0004,
        wandb_project: "flux_train_replicate",
        autocaption_prefix: "SMA, Inspired from the comic strip, Lichtenstein's pop art painting is composed of evenly spaced Ben-Day dots and unbroken areas of flat color divided by black lines of varying thickness.",
        autocaption_suffix: "in the style of SMA",
        wandb_save_interval: 100,
        caption_dropout_rate: 0.05,
        cache_latents_to_disk: false,
        wandb_sample_interval: 100,
        safety_checker: "no",
      }
    }
  );

  console.log('done!!!!!')
  console.dir(training, { depth: 10 })

  return training
}

// Uncomment these lines if you want to run the functions
// const suggestions = []
// async function generateImages() {
//   for (const suggestion of suggestions) {
//     const output = await generatePopArtImage(suggestion)
//     console.log(JSON.stringify({ suggestion, output }, null, 2))
//   }
// }
// generateImages()
// trainModel()
