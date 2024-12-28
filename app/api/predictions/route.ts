import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})


const TRIGGER = 'pop art comic book'

const imageKeywords = ['image', 'depiction', 'illustration', 'scene', 'picture', 'artwork', 'visual']

const enhancePrompt = (prompt: string): string => {
  if (prompt.search(/(pop art comic book)/i) === -1) {
    return `pop art comic book style illustration, ${prompt.trim()}`
  }
  return prompt.trim()
}

export async function POST(req: Request) {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error(
      'The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it.',
    )
  }

  const { prompt, ...settingsData } = await req.json()


  prompt.search('pop art comic book')

  const input = { ...settingsData, prompt: enhancePrompt(prompt) }


  console.log('input', input)

  const prediction = await replicate.predictions.create({
    version: '393c9b328cd1ac2f0127db9c7871eef86fded0c369ce2bfb888f9f217c21ca62',
    input,
  })

  if (prediction?.error) {
    return new Response(JSON.stringify({ detail: prediction.error }), { status: 500 })
  }

  return new Response(JSON.stringify(prediction), { status: 201 })
}
