import { getAiImageCount } from '@/actions/queries'
import { Suspense } from 'react'

export const CountDisplay = ({ count }: { count?: number }) => {
  return (
    <p className="text-gray-500 mb-12 text-base animate-in fade-in slide-in-from-bottom-4 duration-1200 ease-in-out text-center">
      {count || '...'} images generated and counting!
    </p>
  )
}

export async function AsyncAiImageCount() {
  const count = await getAiImageCount()
  return <CountDisplay count={count} />
}

export async function ImageCounter() {
  return (
    <Suspense fallback={<CountDisplay />}>
      <AsyncAiImageCount />
    </Suspense>
  )
}
