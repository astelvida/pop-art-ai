'use client'

import * as Sentry from '@sentry/nextjs'
import NextError from 'next/error'
import { useEffect } from 'react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error)
    console.error(error)
  }, [error])

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-yellow-300'>
      {/* `NextError` is the default Next.js error page component. Its type
        definition requires a `statusCode` prop. However, since the App Router
        does not expose status codes for errors, we simply pass 0 to render a
        generic error message. */}
      <NextError statusCode={0} message={error.message} name={error.name} />
      <div className='flex flex-col items-center justify-center gap-4 border-emerald-800'>
        <h2>Something went wrong!</h2>
        <p>Error name: {error.name}</p>
        <p>Error message: {error.message}</p>
        <button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Try again
        </button>
      </div>
    </div>
  )
}
