import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import expressiveCode from 'astro-expressive-code'
import { remarkCodeTitles } from './src/plugins/remark-code-titles.mjs'

// Production site URL — kept in parity with legacy `data/site-metadata.ts`.
export default defineConfig({
  site: 'https://www.leohuynh.dev',
  // No trailing slash, matching the legacy Next.js canonical URLs.
  trailingSlash: 'never',
  // expressiveCode must run before mdx so it owns code-block rendering.
  integrations: [
    expressiveCode({
      // Dark code panels on the light editor canvas — matches sketch 006.
      themes: ['github-dark-default'],
      styleOverrides: {
        borderRadius: '12px',
        borderColor: 'transparent',
        codeFontSize: '13.5px',
        codeFontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        frames: {
          shadowColor: 'transparent',
        },
      },
      defaultProps: {
        wrap: true,
      },
    }),
    mdx(),
    react(),
    sitemap(),
  ],
  markdown: {
    // Normalize legacy `lang:title` fences before Expressive Code renders them.
    remarkPlugins: [remarkCodeTitles],
  },
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
