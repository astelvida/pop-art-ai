'use client'

import * as Sentry from '@sentry/nextjs'
import NextError from 'next/error'
import { useEffect } from 'react'

// We can check this at the module level since it's replaced at build time
const isProd = process.env.NODE_ENV === 'production'

console.log('isProd', isProd, process.env)

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    if (isProd) {
      console.log('captureException', error, isProd)
      Sentry.captureException(error)
    }
    console.error(error)
  }, [error])
  return (
    // global-error must include html and body tags
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again BIATCH</button>
        <NextError statusCode={0} />
      </body>
    </html>
  )
}
