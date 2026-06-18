import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { getContentByTag, getTagCounts } from '~/lib/content'
import { SITE } from '~/lib/site'

// One feed per tag slug (parity with legacy `/tags/<tag>/feed.xml`).
export async function getStaticPaths() {
  const counts = await getTagCounts()
  return Object.keys(counts).map((tag) => ({ params: { tag } }))
}

export async function GET(context: APIContext) {
  const tag = context.params.tag as string
  const { posts, snippets } = await getContentByTag(tag)

  const items = [
    ...posts.map((p) => ({ entry: p, link: `/log/${p.id}` })),
    ...snippets.map((s) => ({ entry: s, link: `/gists/${s.id}` })),
  ].sort((a, b) => b.entry.data.date.valueOf() - a.entry.data.date.valueOf())

  return rss({
    title: `${SITE.title} — #${tag}`,
    description: `${SITE.title} ${tag} tagged content`,
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
