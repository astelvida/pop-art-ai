import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function GET(request: Request) {
  const predictions = await replicate.predictions.list()

  if (predictions?.error) {
    return new Response(JSON.stringify({ detail: predictions.error.detail }), { status: 500 })
  }

  return new Response(JSON.stringify(predictions), { status: 200 })
}
