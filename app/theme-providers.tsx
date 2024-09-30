'use client'

import { ThemeProvider } from 'next-themes'
import { SITE_METADATA } from '~/data/site-metadata'

export function ThemeProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme={SITE_METADATA.theme} enableSystem>
      {children}
    </ThemeProvider>
  )
}
