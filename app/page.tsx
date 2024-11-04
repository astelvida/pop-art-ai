import { App } from '@/components/app'
import { getImages } from '@/actions/actions'
// export const dynamic = 'force-dynamic'

export default async function Page() {
  const images = await getImages()

  return <App images={images} />
}
