import { createImage } from '@/app/actions'

export default function CreateImagePage() {
  return (
    <div>
      <h1>Create AI Image</h1>
      <form action={createImage}>
        <input type='text' name='predictionId' placeholder='Prediction ID' required />
        <input type='url' name='imageUrl' placeholder='Image URL' required />
        <input type='text' name='aspectRatio' placeholder='Aspect Ratio' required />
        <input type='text' name='prompt' placeholder='Prompt' required />
        <input type='text' name='title' placeholder='Title' />
        <input type='text' name='caption' placeholder='Caption' />
        <textarea name='description' placeholder='Description'></textarea>
        <button type='submit'>Create Image</button>
      </form>
    </div>
  )
}
