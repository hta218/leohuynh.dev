import type { Blog } from 'contentlayer/generated'
import { allBlogs } from '../.contentlayer/generated/index.mjs'
import { mkdirSync, writeFileSync } from 'fs'
import { slug } from 'github-slugger'
import path from 'path'
import type { PlinyConfig } from 'pliny/config'
import { sortPosts } from 'pliny/utils/contentlayer'
import { escape } from 'pliny/utils/htmlEscaper'
import tagData from '~/app/tag-data.json' assert { type: 'json' }
import siteMetadata from '~/data/siteMetadata'

function generateRssItem(config: PlinyConfig, post: Blog) {
  return `
		<item>
			<guid>${config.siteUrl}/blog/${post.slug}</guid>
			<title>${escape(post.title)}</title>
			<link>${config.siteUrl}/blog/${post.slug}</link>
			${post.summary && `<description>${escape(post.summary)}</description>`}
			<pubDate>${new Date(post.date).toUTCString()}</pubDate>
			<author>${config.email} (${config.author})</author>
			${post.tags && post.tags.map((t) => `<category>${t}</category>`).join('')}
		</item>
	`
}

function generateRss(config: PlinyConfig, posts: Blog[], page = 'feed.xml') {
  return `
		<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
			<channel>
				<title>${escape(config.title)}</title>
				<link>${config.siteUrl}/blog</link>
				<description>${escape(config.description)}</description>
				<language>${config.language}</language>
				<managingEditor>${config.email} (${config.author})</managingEditor>
				<webMaster>${config.email} (${config.author})</webMaster>
				<lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>
				<atom:link href="${config.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
				${posts.map((post) => generateRssItem(config, post)).join('')}
			</channel>
		</rss>
	`
}

async function generateRSS(config: PlinyConfig, allBlogs: Blog[], page = 'feed.xml') {
  let publishPosts = allBlogs.filter((post) => post.draft !== true)
  // RSS for blog post
  if (publishPosts.length > 0) {
    let rss = generateRss(config, sortPosts(publishPosts))
    writeFileSync(`./public/${page}`, rss)
  }

  if (publishPosts.length > 0) {
    for (let tag of Object.keys(tagData)) {
      let filteredPosts = allBlogs.filter((post) => post.tags.map((t) => slug(t)).includes(tag))
      let rss = generateRss(config, filteredPosts, `tags/${tag}/${page}`)
      let rssPath = path.join('public', 'tags', tag)
      mkdirSync(rssPath, { recursive: true })
      writeFileSync(path.join(rssPath, page), rss)
    }
  }
}

export function rss() {
  generateRSS(siteMetadata, allBlogs as unknown as Blog[])
  console.log('🗒️. RSS feed generated...')
}
