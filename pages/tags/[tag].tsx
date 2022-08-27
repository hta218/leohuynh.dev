import { PageSeo } from 'components/SEO'
import fs from 'fs'
import path from 'path'
import { siteMetadata } from '~/data'
import { ListLayout } from '~/layouts'
import { getAllTags, generateRss } from '~/libs'
import { getAllFilesFrontMatter } from '~/libs/mdx'
import type { BlogFrontMatter } from '~/types'
import { kebabCase } from '~/utils'

export function getStaticPaths() {
  let tags = getAllTags('blog')

  return {
    paths: Object.keys(tags).map((tag) => ({
      params: {
        tag,
      },
    })),
    fallback: false,
  }
}

export async function getStaticProps({ params }: { params: { tag: string } }) {
  let allPosts = getAllFilesFrontMatter('blog')
  let filteredPosts = allPosts.filter(
    (post) => post.draft !== true && post.tags.map((t) => kebabCase(t)).includes(params.tag)
  )

  // rss
  let root = process.cwd()
  let rss = generateRss(filteredPosts, `tags/${params.tag}/feed.xml`)
  let rssPath = path.join(root, 'public', 'tags', params.tag)
  fs.mkdirSync(rssPath, { recursive: true })
  fs.writeFileSync(path.join(rssPath, 'feed.xml'), rss)

  return { props: { posts: filteredPosts, tag: params.tag } }
}

export default function Tag({ posts, tag }: { posts: BlogFrontMatter[]; tag: string }) {
  // Capitalize first letter and convert space to dash
  let title = tag[0] + tag.split(' ').join('-').slice(1)
  return (
    <>
      <PageSeo
        title={`${tag} - ${siteMetadata.title}`}
        description={`${tag} tags - ${siteMetadata.title}`}
      />
      <ListLayout posts={posts} title={`Tag: #${title}`} />
    </>
  )
}
