import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

/**
 * v4 content schema — mirrors the legacy `contentlayer.config.ts` field set so MDX
 * frontmatter migrates 1:1 and existing URLs/SEO stay intact.
 *
 * Content is NOT duplicated: collections load the existing MDX from `./data`
 * (single source of truth). Slug = filename, so URLs map to
 * `/blog/<slug>` and `/snippets/<slug>` exactly like the Next.js site.
 */

// `images` is authored as a YAML array of paths, occasionally a bare string.
const images = z.union([z.string(), z.array(z.string())]).optional()

const sharedFields = {
  date: z.coerce.date(),
  lastmod: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().optional(),
  summary: z.string().optional(),
  images,
  authors: z.array(z.string()).optional(),
  layout: z.string().optional(),
  bibliography: z.string().optional(),
  canonicalUrl: z.string().optional(),
}

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './data/blog' }),
  schema: z.object({
    title: z.string(),
    ...sharedFields,
  }),
})

const snippets = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './data/snippets' }),
  schema: z.object({
    heading: z.string(),
    title: z.string(),
    icon: z.string(),
    ...sharedFields,
  }),
})

const misc = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './data/misc' }),
  schema: z.object({
    title: z.string(),
    topic: z.string(),
    lang: z.enum(['en', 'vi']).default('en'),
    // Id of the primary-language note this is a translation of. Unset on the
    // canonical note; the index lists only notes where this is unset.
    translationOf: z.string().optional(),
    ...sharedFields,
  }),
})

export const collections = { blog, snippets, misc }
