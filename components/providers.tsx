import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ClerkProvider } from '@clerk/nextjs'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
      <ClerkProvider>{children}</ClerkProvider>
    </NextThemesProvider>
  )
}
