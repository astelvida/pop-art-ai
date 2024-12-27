import Replicate from 'replicate'
import { NextResponse } from 'next/server'
import { getFileFromUrl } from '@/lib/upload-file'

const replciateUrl = 'https://replicate.delivery/yhqm/8PbXPik8rNIUMNE8GWAkoteREu4SO9Ta1qU1dIyROVppe6tTA/out-0.webp'
const predictionId = 'yhqm'
const outputFormat = 'webp'

// getFileFromUrl(replciateUrl)

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const prediction = await replicate.predictions.get(params.id)

  if (prediction.status === 'succeeded') {
    prediction.hostedUrl = await getFileFromUrl(prediction)
    console.log('GET prediction', prediction.hostedUrl)
  }

  if (prediction?.error) {
    return NextResponse.json({ detail: prediction?.error?.detail }, { status: 500 })
  }

  return NextResponse.json(prediction, { status: 200 })
}
