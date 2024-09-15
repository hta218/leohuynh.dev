import { slug } from 'github-slugger'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import siteMetadata from '~/data/siteMetadata'
import { ListLayoutWithTags } from '~/layouts/list-layout-with-tags'
import { allBlogs } from 'contentlayer/generated'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: { tag: string } }): Promise<Metadata> {
  let tag = decodeURI(params.tag)
  return genPageMetadata({
    title: tag,
    description: `${siteMetadata.title} ${tag} tagged content`,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/tags/${tag}/feed.xml`,
      },
    },
  })
}

export let generateStaticParams = async () => {
  let tagCounts = tagData as Record<string, number>
  let tagKeys = Object.keys(tagCounts)
  let paths = tagKeys.map((tag) => ({
    tag: encodeURI(tag),
  }))
  return paths
}

export default function TagPage({ params }: { params: { tag: string } }) {
  let tag = decodeURI(params.tag)
  // Capitalize first letter and convert space to dash
  let title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)
  let filteredPosts = allCoreContent(
    sortPosts(allBlogs.filter((post) => post.tags && post.tags.map((t) => slug(t)).includes(tag)))
  )
  if (filteredPosts.length === 0) {
    return notFound()
  }
  return <ListLayoutWithTags posts={filteredPosts} title={title} />
}
