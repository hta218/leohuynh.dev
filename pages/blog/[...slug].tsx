import fs from 'fs'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { MDXLayoutRenderer } from '~/components/MDXComponents'
import { PageTitle } from '~/components/PageTitle'
import { POSTS_PER_PAGE } from '~/constant'
import { getCommentConfigs } from '~/libs/comment.server'
import { formatSlug, getMetaData, getFiles } from '~/libs/files.server'
import { generateRss } from '~/libs/rss.server'
import { getAllFilesFrontMatter, getFileBySlug } from '~/libs/mdx.server'
import type { AuthorFrontMatter, MdxPageLayout } from '~/types/mdx'
import type { BlogProps } from '~/types/page'

let DEFAULT_LAYOUT: MdxPageLayout = 'PostSimple'

export async function getStaticPaths({ locales }: { locales: string[] }) {
  let paths = []
  for (let locale of locales) {
    let posts = getFiles(`${locale}/blog`)
    for (let post of posts) {
      paths.push({
        params: {
          slug: formatSlug(post).split('/'),
        },
        locale: locale,
      })
    }
  }
  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({
  params,
  locale,
}: {
  params: { slug: string[] }
  locale: string
}) {
  let allPosts = getAllFilesFrontMatter(`${locale}/blog`)

  let postIndex = allPosts.findIndex((post) => formatSlug(post.slug) === params.slug.join('/'))
  let prev = allPosts[postIndex + 1] || null
  let next = allPosts[postIndex - 1] || null
  let page = Math.ceil((postIndex + 1) / POSTS_PER_PAGE)

  let post = await getFileBySlug(locale, 'blog', params.slug.join('/'))
  let authors = post.frontMatter.authors || ['default']
  let authorDetails = await Promise.all(
    authors.map(async (author) => {
      let authorData = await getFileBySlug(locale, 'authors', author)
      // eslint-disable-next-line
      return authorData.frontMatter as unknown as AuthorFrontMatter
    })
  )

  let rss = generateRss(getMetaData(locale), allPosts)
  fs.writeFileSync('./public/feed.xml', rss)
  let commentConfig = getCommentConfigs()

  return {
    props: {
      post,
      authorDetails,
      prev,
      next,
      page,
      commentConfig,
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

export default function Blog(props: BlogProps) {
  let { post, ...rest } = props
  let { mdxSource, frontMatter } = post
  let { t } = useTranslation('common')

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
            {t('blog.under_construction')}{' '}
            <span role="img" aria-label="roadwork sign">
              🚧
            </span>
          </PageTitle>
        </div>
      )}
    </>
  )
}
