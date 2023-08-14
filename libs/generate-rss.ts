import { escape } from '~/utils/html-escaper'
import type { BlogFrontMatter } from '~/types/mdx'

function generateRssItem(lang_siteMetadata, post: BlogFrontMatter) {
  return `
  <item>
    <guid>${lang_siteMetadata.siteUrl}/blog/${post.slug}</guid>
    <title>${escape(post.title)}</title>
    <link>${lang_siteMetadata.siteUrl}/blog/${post.slug}</link>
    ${post.summary && `<description>${escape(post.summary)}</description>`}
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <author>${lang_siteMetadata.email} (${lang_siteMetadata.author})</author>
    ${post.tags && post.tags.map((t) => `<category>${t}</category>`).join('')}
  </item>
`
}

export function generateRss(lang_siteMetadata, posts: BlogFrontMatter[], page = 'feed.xml') {
  return `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escape(lang_siteMetadata.title)}</title>
      <link>${lang_siteMetadata.siteUrl}/blog</link>
      <description>${escape(lang_siteMetadata.description)}</description>
      <language>${lang_siteMetadata.language}</language>
      <managingEditor>${lang_siteMetadata.email} (${lang_siteMetadata.author})</managingEditor>
      <webMaster>${lang_siteMetadata.email} (${lang_siteMetadata.author})</webMaster>
      <lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>
      <atom:link href="${lang_siteMetadata.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
      ${posts.map((post) => generateRssItem(lang_siteMetadata, post)).join('')}
    </channel>
  </rss>
`
}
