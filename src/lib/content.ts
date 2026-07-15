import { getCollection } from 'astro:content'
import { slug as ghSlug } from 'github-slugger'

/**
 * Shared content helpers for v4 — centralize draft filtering, sorting, slug
 * parity and tag counting so list/detail/RSS/tag routes stay consistent.
 *
 * Parity notes vs legacy:
 * - draft filtering: `draft !== true` (matches contentlayer production filter).
 * - tag slug: `github-slugger` `slug()` (same lib/version as legacy).
 * - tag counts: blog + snippets combined, slugged, published only.
 */

type Draftable = { data: { draft?: boolean } }

export function isPublished<T extends Draftable>(entry: T): boolean {
  return entry.data.draft !== true
}

type Translatable = { data: { translationOf?: string } }

/**
 * Primary-language entries only — lists (index, home, feed, tags) show these;
 * translations are reachable via the language switcher on the detail page.
 */
export function isPrimary<T extends Translatable>(entry: T): boolean {
  return !entry.data.translationOf
}

function byDateDesc(
  a: { data: { date: Date } },
  b: { data: { date: Date } },
): number {
  return b.data.date.valueOf() - a.data.date.valueOf()
}

export async function getPublishedBlog() {
  const posts = await getCollection('blog', isPublished)
  return posts.sort(byDateDesc)
}

export async function getPublishedSnippets() {
  const snippets = await getCollection('snippets', isPublished)
  return snippets.sort(byDateDesc)
}

export async function getPublishedMisc() {
  const notes = await getCollection('misc', isPublished)
  return notes.sort(byDateDesc)
}

/** Slug a human tag string the same way the legacy site does. */
export function tagSlug(tag: string): string {
  return ghSlug(tag)
}

/**
 * Tag → occurrence count across published blog + snippets, keyed by slug.
 * Mirrors legacy `json/tag-data.json` generation.
 */
export async function getTagCounts(): Promise<Record<string, number>> {
  const [posts, snippets] = await Promise.all([
    getPublishedBlog(),
    getPublishedSnippets(),
  ])
  const counts: Record<string, number> = {}
  for (const entry of [...posts.filter(isPrimary), ...snippets]) {
    for (const tag of entry.data.tags) {
      const s = ghSlug(tag)
      counts[s] = (counts[s] ?? 0) + 1
    }
  }
  return counts
}

/** Published blog + snippets that carry a given tag slug, newest first. */
export async function getContentByTag(tag: string) {
  const [posts, snippets] = await Promise.all([
    getPublishedBlog(),
    getPublishedSnippets(),
  ])
  const hasTag = (entry: { data: { tags: string[] } }) =>
    entry.data.tags.map((t) => ghSlug(t)).includes(tag)
  return {
    posts: posts.filter(isPrimary).filter(hasTag),
    snippets: snippets.filter(hasTag),
  }
}
