import 'css/tailwind.css'
import 'css/twemoji.css'
import 'pliny/search/algolia.css'
import 'remark-github-blockquote-alert/alert.css'

import Header from '@/components/Header'
import siteMetadata from '@/data/siteMetadata'
import clsx from 'clsx'
import type { Metadata } from 'next'
import { Cairo, JetBrains_Mono, Nunito } from 'next/font/google'
import type { AnalyticsConfig } from 'pliny/analytics'
import { Analytics } from 'pliny/analytics'
import type { SearchConfig } from 'pliny/search'
import { SearchProvider } from 'pliny/search'
import { Footer } from '~/components/Footer'
import { TiltedGridBackground } from '~/components/ui/tilted-grid-background'
import { ThemeProviders } from './theme-providers'

const FONT_SPACE_GROTESK = Cairo({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-space-grotesk',
})

const FONT_NUNITO = Nunito({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-nunito',
})

const FONT_JETBRAINS_MONO = JetBrains_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
})

export let metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: './',
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: './',
    types: {
      'application/rss+xml': `${siteMetadata.siteUrl}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: siteMetadata.title,
    card: 'summary_large_image',
    images: [siteMetadata.socialBanner],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  let basePath = process.env.BASE_PATH || ''

  return (
    <html
      lang={siteMetadata.language}
      className={clsx(
        'scroll-smooth',
        FONT_NUNITO.variable,
        FONT_JETBRAINS_MONO.variable,
        FONT_SPACE_GROTESK.variable
      )}
      suppressHydrationWarning
    >
      <link rel="apple-touch-icon" sizes="76x76" href={`${basePath}/static/favicons/favicon.png`} />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={`${basePath}/static/favicons/favicon.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={`${basePath}/static/favicons/favicon.png`}
      />
      <link rel="manifest" href={`${basePath}/static/favicons/site.webmanifest`} />
      <link
        rel="mask-icon"
        href={`${basePath}/static/favicons/safari-pinned-tab.svg`}
        color="#5bbad5"
      />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
      <link rel="alternate" type="application/rss+xml" href={`${basePath}/feed.xml`} />
      <body
        className={clsx([
          'antialiased',
          'relative min-h-screen pl-[calc(100vw-100%)]',
          'flex flex-col',
          'bg-white text-gray-900',
          'dark:bg-dark dark:text-gray-100',
        ])}
      >
        <TiltedGridBackground className="inset-x-0 top-0 z-[-1] h-[50vh]" />
        <ThemeProviders>
          <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
          <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
            <Header />
            <main className="mb-auto grow">{children}</main>
          </SearchProvider>
          <Footer />
        </ThemeProviders>
      </body>
    </html>
  )
}
