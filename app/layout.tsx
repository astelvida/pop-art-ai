import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Bangers, Permanent_Marker } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster as SonnerToaster } from 'sonner'
import { ImageGenerator } from '@/components/image-generator'
import { ImageCounter } from '@/components/image-counter'
import { Header } from '@/components/header'

// If loading a variable font, you don't need to specify the font weight
const bangers = Bangers({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-bangers',
})

const marker = Permanent_Marker({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-marker',
})

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'Pop Art AI',
  description: 'An app that generated pop art in the style of Andy Warhol and Roy Lichtenstein',
}

// ${rubik.variable} ${rubikMono.variable} ${lato.variable}
export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bangers.variable} ${marker.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider>
            <main className="min-h-screen pb-20 bg-gray-100">
              <Header />

              <div className="container mx-auto px-4 mb-12">
                <h2 className="text-5xl font-black mb-2 text-center">Pop Art</h2>
                <p className="text-xl text-center mb-8">
                  Transform your ideas into stunning visuals
                </p>
                <ImageCounter />
              </div>

              <ImageGenerator />

              {children}
            </main>
            {modal}
            <div id="modal-root" />
            <Toaster />
            <SonnerToaster position="top-center" richColors />
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
