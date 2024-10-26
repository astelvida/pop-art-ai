import { type AiImage } from '@/db/schema'
import Generator from './generator'
import { AiImageData, getAiImages } from '@/actions/queries'

export default async function Page() {
  const images = await getAiImages()
  return <Generator images={images as AiImage[]} />
}
