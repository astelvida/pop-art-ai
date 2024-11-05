import { App } from '@/components/app'
import { getImages } from '@/actions/queries'
import Head from 'next/head'
import { Header } from '@/components/header'
// export const dynamic = 'force-dynamic'

export default async function Page() {
  const imagesPromise = getImages()

  return (
    <App imagesPromise={imagesPromise}>
      <Header />
    </App>
  )
}
