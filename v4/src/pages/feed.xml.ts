import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { getPublishedBlog, getPublishedSnippets } from '~/lib/content'
import { SITE } from '~/lib/site'

/**
 * Main RSS feed — combined blog + snippets, newest first (legacy `/feed.xml`).
 * Note: legacy linked every item under `/blog/<slug>`; v4 links each item to
 * its real collection URL so snippet links resolve correctly.
 */
export async function GET(context: APIContext) {
  const [posts, snippets] = await Promise.all([
    getPublishedBlog(),
    getPublishedSnippets(),
  ])

  const items = [
    ...posts.map((p) => ({ entry: p, link: `/blog/${p.id}` })),
    ...snippets.map((s) => ({ entry: s, link: `/snippets/${s.id}` })),
  ].sort((a, b) => b.entry.data.date.valueOf() - a.entry.data.date.valueOf())

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site ?? SITE.siteUrl,
    trailingSlash: false,
    items: items.map(({ entry, link }) => ({
      title: entry.data.title,
      pubDate: entry.data.date,
      description: entry.data.summary,
      link,
      categories: entry.data.tags,
    })),
    customData: `<language>${SITE.language}</language>`,
  })
}
