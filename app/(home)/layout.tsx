import { Header } from '@/components/header'
import { ImageCounter } from '@/components/image-counter'
import { ImageGenerator } from '@/components/image-generator'

// ${rubik.variable} ${rubikMono.variable} ${lato.variable}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="min-h-screen pb-20 bg-gray-100">
      <Header />

      <div className="container mx-auto px-4 mb-12">
        <h2 className="text-5xl font-black mb-2 text-center">Pop Art</h2>
        <p className="text-xl text-center mb-8">Transform your ideas into stunning visuals</p>
        <ImageCounter />
      </div>

      <ImageGenerator />

      {children}
    </main>
  )
}
