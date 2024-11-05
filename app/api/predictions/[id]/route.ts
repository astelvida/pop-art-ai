import Replicate from 'replicate'
import { NextResponse } from 'next/server'
import { UTApi } from 'uploadthing/server'
import { type Prediction } from 'replicate'

const utapi = new UTApi()

export type MaybeURL = string | URL
export type URLWithOverrides = { url: MaybeURL; name?: string; customId?: string }

const replciateUrl = 'https://replicate.delivery/yhqm/8PbXPik8rNIUMNE8GWAkoteREu4SO9Ta1qU1dIyROVppe6tTA/out-0.webp'

const predictionId = 'yhqm'
const outputFormat = 'webp'

async function getFileFromUrl(prediction: Prediction) {
  const file = await fetch(prediction.output[0])
    .then((res) => res.blob())
    .then((blob) => new File([blob], `${prediction.id}.${prediction.input.output_format}`))
  const response = await utapi.uploadFiles(file)
  return response?.data?.appUrl
}

// getFileFromUrl(replciateUrl)

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function GET(request: Request, { params }: { params: { id: string } }) {
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
