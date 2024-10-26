import Replicate from 'replicate'
import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const prediction = await replicate.predictions.get(params.id)

  if (prediction.status === 'succeeded') {
    const file = await fetch(prediction.output[0]).then((res) => res.blob())
    // upload & store in Vercel Blob
    const { url } = await put(`${prediction.id}.${prediction.input.output_format || 'webp'}`, file, {
      access: 'public',
    })
    console.log('url', url, 'id', prediction.id)
    prediction.vercelUrl = url
    console.log('GET prediction', prediction)
  }

  if (prediction?.error) {
    return NextResponse.json({ detail: prediction.error.detail }, { status: 500 })
  }

  return NextResponse.json(prediction, { status: 200 })
}
