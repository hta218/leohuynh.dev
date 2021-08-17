import '@/css/tailwind.css'
import '@/css/twemoji.css'
import ScrollTop from '@/components/ScrollTop'

import { ThemeProvider } from 'next-themes'
import Head from 'next/head'

import LayoutWrapper from '@/components/LayoutWrapper'

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class">
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <LayoutWrapper>
        <ScrollTop />
        <Component {...pageProps} />
      </LayoutWrapper>
    </ThemeProvider>
  )
}
