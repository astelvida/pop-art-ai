import { App } from '@/components/app'
import { getImages } from '@/actions/actions'
// export const dynamic = 'force-dynamic'

export default async function Page() {
  const imagesPromise = getImages()

  return <App imagesPromise={imagesPromise} />
}
