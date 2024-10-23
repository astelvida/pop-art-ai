import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Header } from '@/components/header'
import { Bangers } from 'next/font/google'
import { ThemeProvider as NextThemesProvider, ThemeProvider } from 'next-themes'

// If loading a variable font, you don't need to specify the font weight
const bangers = Bangers({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-bangers',
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

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body className={`${geistSans.variable} ${geistMono.variable} ${bangers.variable} antialiased`}>
          <NextThemesProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
            <div className='flex min-h-screen flex-col'>
              <Header />
              {children}
              {modal}
            </div>
            <div id='modal-root' />
          </NextThemesProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
