import mdx from '@astrojs/mdx'
import { unified } from '@astrojs/markdown-remark'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import vercel from '@astrojs/vercel'
import { defineConfig } from 'astro/config'
import expressiveCode from 'astro-expressive-code'
import { remarkCodeTitles } from './src/plugins/remark-code-titles.mjs'

// Production site URL — kept in parity with legacy `data/site-metadata.ts`.
export default defineConfig({
  site: 'https://www.leohuynh.dev',
  adapter: vercel(),
  // No trailing slash, matching the legacy Next.js canonical URLs.
  trailingSlash: 'never',
  // expressiveCode must run before mdx so it owns code-block rendering.
  integrations: [
    expressiveCode({
      // Default light, with a manually selectable dark variant via <html data-theme="...">.
      themes: ['github-light-default', 'github-dark-default'],
      useDarkModeMediaQuery: false,
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
    processor: unified({
      remarkPlugins: [remarkCodeTitles],
    }),
  },
  // v4 route rebrand: old section prefixes 301 to the new ones (slugs preserved).
  // The specific legacy redirect must precede the broader `/snippets/*` rule.
  redirects: {
    '/snippets/crawling-goodreads-books-data': {
      status: 301,
      destination: '/log/crawling-goodreads-books-data',
    },
    '/about': { status: 301, destination: '/whoami' },
    '/blog': { status: 301, destination: '/log' },
    '/blog/page/[page]': { status: 301, destination: '/log/page/[page]' },
    '/blog/[...slug]': { status: 301, destination: '/log/[...slug]' },
    '/snippets': { status: 301, destination: '/gists' },
    '/snippets/[...slug]': { status: 301, destination: '/gists/[...slug]' },
    '/projects': { status: 301, destination: '/builds' },
    '/books': { status: 301, destination: '/shelf' },
    '/movies': { status: 301, destination: '/shelf' },
    '/tags': { status: 301, destination: '/topics' },
    '/tags/[tag]': { status: 301, destination: '/topics/[tag]' },
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
