import { pp } from '@/lib/pprint'
import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

const MODEL_OWNER = 'astelvida'
const MODEL_NAME = 'pop-art'

export async function GET(request: Request) {
  const response = await replicate.models.versions.list(MODEL_OWNER, MODEL_NAME)
  pp(response)
  if (response?.error) {
    return new Response(JSON.stringify({ detail: response.error.detail }), { status: 500 })
  }

  return new Response(JSON.stringify(response), { status: 200 })
}
