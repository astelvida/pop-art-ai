import { NextResponse } from 'next/server'
import Replicate, { Prediction } from 'replicate'

const replciateUrl =
  'https://replicate.delivery/yhqm/8PbXPik8rNIUMNE8GWAkoteREu4SO9Ta1qU1dIyROVppe6tTA/out-0.webp'
const predictionId = 'yhqm'
const outputFormat = 'webp'

// getFileFromUrl(replciateUrl)

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const prediction: Prediction = await replicate.predictions.get(id)

  if (prediction.status === 'succeeded') {
    console.log('GET prediction SUCCEEDED\n', prediction.output)

    // console.log('GET prediction OUTPUT\n', prediction.output[0])
  }

  if (prediction?.error) {
    return NextResponse.json({ detail: prediction.error }, { status: 500 })
  }

  return NextResponse.json(prediction, { status: 200 })
}
