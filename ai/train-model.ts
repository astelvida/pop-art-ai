
import replicateAI from './replicate'

export default async function trainModel() {
  console.log('start training')
  const training = await replicateAI.trainings.create(
    "ostris",
    "flux-dev-lora-trainer",
    "6f1e7ae9f285cfae6e12f8c18618418cfefe24b07172a17ff10a64fb23a6b772",
    {
      // You need to create a model on Replicate that will be the destination for the trained version.
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
        autocaption_prefix: "SMA, Inspired from the comic strip, Lichtenstein’s pop art painting is composed of evenly spaced Ben-Day dots and unbroken areas of flat color divided by black lines of varying thickness.",
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


trainModel()