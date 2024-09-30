import { allBlogs, allSnippets } from 'contentlayer/generated'
import type { MetadataRoute } from 'next'
import { SITE_METADATA } from '~/data/site-metadata'

export default function sitemap(): MetadataRoute.Sitemap {
  let siteUrl = SITE_METADATA.siteUrl
  let blogRoutes = allBlogs
    .filter((p) => !p.draft)
    .map(({ path, lastmod, date }) => ({
      url: `${siteUrl}/${path}`,
      lastModified: lastmod || date,
    }))
  let snippetRoutes = allSnippets
    .filter((s) => !s.draft)
    .map(({ path, lastmod, date }) => ({
      url: `${siteUrl}/snippets/${path}`,
      lastModified: lastmod || date,
    }))

  let routes = ['', 'blog', 'snippets', 'projects', 'about', 'books', 'movies', 'tags'].map(
    (route) => ({
      url: `${siteUrl}/${route}`,
      lastModified: new Date().toISOString().split('T')[0],
    })
  )

  return [...routes, ...blogRoutes, ...snippetRoutes]
}
