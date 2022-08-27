import fs from 'fs'
import { MDXLayoutRenderer, PageTitle } from '~/components'
import { POSTS_PER_PAGE } from '~/constant'
import { formatSlug, generateRss, getCommentConfigs, getFiles } from '~/libs'
import { getAllFilesFrontMatter, getFileBySlug } from '~/libs/mdx'
import type { AuthorFrontMatter, BlogProps, MdxPageLayout } from '~/types'

let DEFAULT_LAYOUT: MdxPageLayout = 'PostSimple'

export async function getStaticPaths() {
  let posts = getFiles('blog')
  return {
    paths: posts.map((p: string) => ({
      params: {
        slug: formatSlug(p).split('/'),
      },
    })),
    fallback: false,
  }
}

export async function getStaticProps({ params }: { params: { slug: string[] } }) {
  let allPosts = getAllFilesFrontMatter('blog')
  let postIndex = allPosts.findIndex((post) => formatSlug(post.slug) === params.slug.join('/'))
  let prev = allPosts[postIndex + 1] || null
  let next = allPosts[postIndex - 1] || null
  let page = Math.ceil((postIndex + 1) / POSTS_PER_PAGE)
  let post = await getFileBySlug('blog', params.slug.join('/'))

  let authors = post.frontMatter.authors || ['default']
  let authorDetails = await Promise.all(
    authors.map(async (author) => {
      let authorData = await getFileBySlug('authors', author)
      // eslint-disable-next-line
      return authorData.frontMatter as unknown as AuthorFrontMatter
    })
  )

  // rss
  let rss = generateRss(allPosts)
  fs.writeFileSync('./public/feed.xml', rss)
  let commentConfig = getCommentConfigs()

  return { props: { post, authorDetails, prev, next, page, commentConfig } }
}

export default function Blog(props: BlogProps) {
  let { post, ...rest } = props
  let { mdxSource, frontMatter } = post

  return (
    <>
      {frontMatter.draft !== true ? (
        <MDXLayoutRenderer
          layout={frontMatter.layout || DEFAULT_LAYOUT}
          mdxSource={mdxSource}
          frontMatter={frontMatter}
          type="blog"
          {...rest}
        />
      ) : (
        <div className="mt-24 text-center">
          <PageTitle>
            Under letruction{' '}
            <span role="img" aria-label="roadwork sign">
              🚧
            </span>
          </PageTitle>
        </div>
      )}
    </>
  )
}
