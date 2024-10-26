import { type AiImage as LibraryImage } from '@/db/schema'
import Generator from './generator'
import { getImages } from '@/actions/actions'
// export const dynamic = 'force-dynamic'

export default async function Page() {
  const images = await getImages()
  return <Generator images={images} />
}
