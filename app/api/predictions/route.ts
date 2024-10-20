import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function POST(req: Request) {
  const data = await req.formData()
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error(
      'The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it.',
    )
  }

  const prediction = await replicate.predictions.create({
    // See https://replicate.com/astelvida/pop-art:393c9b328cd1ac2f0127db9c7871eef86fded0c369ce2bfb888f9f217c21ca62
    version: '393c9b328cd1ac2f0127db9c7871eef86fded0c369ce2bfb888f9f217c21ca62',

    // This is the text prompt that will be submitted by a form on the frontend
    input: { prompt: data.get('prompt') },
  })

  if (prediction?.error) {
    return new Response(JSON.stringify({ detail: prediction.error.detail }), { status: 500 })
  }

  return new Response(JSON.stringify(prediction), { status: 201 })
}
