import type { APIRoute } from 'astro'
import { getPublishedBlog, getPublishedSnippets } from '~/lib/content'
import { SITE } from '~/lib/site'

export const prerender = true

export const GET: APIRoute = async () => {
  const [posts, snippets] = await Promise.all([
    getPublishedBlog(),
    getPublishedSnippets(),
  ])

  const documents = [...posts, ...snippets]
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .map((entry) => {
      const kind = entry.collection === 'blog' ? 'blog' : 'snippet'
      const url = `/${kind === 'blog' ? 'blog' : 'snippets'}/${entry.id}`
      return {
        id: `${kind}:${entry.id}`,
        kind,
        title: entry.data.title,
        summary: entry.data.summary ?? '',
        tags: entry.data.tags ?? [],
        date: entry.data.date.toISOString(),
        url,
      }
    })

  return new Response(
    JSON.stringify(
      {
        site: SITE.siteUrl,
        generatedAt: new Date().toISOString(),
        documents,
      },
      null,
      2,
    ),
    {
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'public, max-age=3600',
      },
    },
  )
}
