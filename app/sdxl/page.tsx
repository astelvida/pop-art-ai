'use client'
import { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Prediction } from 'replicate'
import { randomPrompt, randomPrompts } from '@/lib/utils'
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
export default function Home() {
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const response = await fetch('/api/predictions', {
      method: 'POST',
      body: new FormData(e.currentTarget),
    })

    let prediction = await response.json()
    if (response.status !== 201) {
      setError(prediction.detail)
      return
    }
    setPrediction(prediction)

    while (prediction.status !== 'succeeded' && prediction.status !== 'failed') {
      await sleep(1000)
      const response = await fetch('/api/predictions/' + prediction.id, { cache: 'no-store' })
      prediction = await response.json()
      if (response.status !== 200) {
        setError(prediction.detail)
        return
      }
      console.log(prediction)
      setPrediction(prediction)
    }
  }

  return (
    <main className='flex min-h-screen flex-col items-center justify-center bg-gray-100 p-24'>
      <div className='z-10 flex w-full max-w-5xl flex-col items-center justify-between rounded-3xl border-2 border-solid border-gray-300 bg-white p-10 font-mono text-sm lg:flex'>
        <Head>
          <title>Replicate + Next.js</title>
        </Head>

        <p className='mb-4 text-lg text-gray-700'>
          Dream something with{' '}
          <a href='https://replicate.com/stability-ai/stable-diffusion' className='text-blue-500 hover:underline'>
            SDXL
          </a>
          :
        </p>

        <Button
          onClick={async () => {
            const response = await fetch('/api/predictions/list')
            const data = await response.json()
            console.log(data)
          }}
        >
          List Predictions
        </Button>

        <Button
          onClick={async () => {
            const response = await fetch('/api/models/list')
            const data = await response.json()
            console.log(data)
          }}
        >
          List Model Versions
        </Button>
        <form onSubmit={handleSubmit} className='flex w-full flex-col items-center'>
          <textarea
            rows={10}
            name='prompt'
            defaultValue={randomPrompt('complex')}
            placeholder='Enter a prompt to generate a pop art comic book image'
            className='w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <button
            type='submit'
            className='mt-4 w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            Go!
          </button>
        </form>

        {error && <div className='mt-4 text-red-500'>{error}</div>}

        {prediction && (
          <div className='mt-4'>
            {prediction.output && (
              <div className='flex w-full flex-col items-center justify-center'>
                <Image
                  src={prediction.output[prediction.output.length - 1]}
                  alt='output'
                  width={500}
                  height={500}
                  className='h-full w-full rounded-md border-gray-300 object-cover'
                />
              </div>
            )}
            <p className='mt-4 text-lg text-gray-700'>status: {prediction.status}</p>
          </div>
        )}
        <div className='mt-4 rounded-md bg-gray-200 p-4'>
          {prediction?.logs && prediction.logs.split('\n').map((log) => <p key={log}>{log}</p>)}
        </div>
      </div>
    </main>
  )
}
