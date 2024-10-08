import replicateAI from './replicate'

export default async function trainModel() {
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
        lora_rank: 16,
        optimizer: "adamw8bit",
        batch_size: 1,
        hf_repo_id: "astelvida/pop-art",
        resolution: "512,768,1024",
        autocaption: true,
        input_images: "https://example.com/pop_art_images.zip",
        trigger_word: "pop art\ncomic book",
        learning_rate: 0.0004,
        wandb_project: "flux_train_replicate",
        autocaption_prefix: "pop art comic book image of",
        autocaption_suffix: "in the style of artist Roy Lichtenstein",
        wandb_save_interval: 100,
        caption_dropout_rate: 0.05,
        cache_latents_to_disk: false,
        wandb_sample_interval: 100
      }
    }
  )

  return training
}
