import fs from 'fs'
import { MDXLayoutRenderer, PageTitle } from '~/components'
import { POSTS_PER_PAGE } from '~/constant'
import { generateRss, getFiles, formatSlug } from '~/libs'
import { getAllFilesFrontMatter, getFileBySlug } from '~/libs/mdx'

let DEFAULT_LAYOUT = 'PostSimple'

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

export async function getStaticProps({ params }) {
  let allPosts = await getAllFilesFrontMatter('blog')
  let postIndex = allPosts.findIndex((post) => formatSlug(post.slug) === params.slug.join('/'))
  let prev = allPosts[postIndex + 1] || null
  let next = allPosts[postIndex - 1] || null
  let page = Math.ceil((postIndex + 1) / POSTS_PER_PAGE)
  let post = await getFileBySlug('blog', params.slug.join('/'))

  // TODO: add frontMatters types
  // @ts-ignore
  let authorList = post.frontMatter.authors || ['default']
  let authorPromise = authorList.map(async (author) => {
    let authorResults = await getFileBySlug('authors', [author])
    return authorResults.frontMatter
  })
  let authorDetails = await Promise.all(authorPromise)

  // rss
  let rss = generateRss(allPosts)
  fs.writeFileSync('./public/feed.xml', rss)

  return { props: { post, authorDetails, prev, next, page } }
}

export default function Blog({ post, authorDetails, prev, next, page }) {
  let { mdxSource, frontMatter } = post

  return (
    <>
      {frontMatter.draft !== true ? (
        <MDXLayoutRenderer
          layout={frontMatter.layout || DEFAULT_LAYOUT}
          mdxSource={mdxSource}
          frontMatter={frontMatter}
          authorDetails={authorDetails}
          type="blog"
          prev={prev}
          next={next}
          page={page}
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
