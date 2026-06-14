import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

// Production site URL — kept in parity with legacy `data/site-metadata.ts`.
export default defineConfig({
  site: 'https://www.leohuynh.dev',
  // No trailing slash, matching the legacy Next.js canonical URLs.
  trailingSlash: 'never',
  integrations: [mdx(), react(), sitemap()],
  // Preserve the legacy 301 (next.config.js redirects()). In static output Astro
  // emits a redirect page; on a Vercel deploy this maps to a real 301.
  redirects: {
    '/snippets/crawling-goodreads-books-data': {
      status: 301,
      destination: '/blog/crawling-goodreads-books-data',
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
