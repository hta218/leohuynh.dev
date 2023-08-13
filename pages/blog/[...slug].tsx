import fs from 'fs'
import { MDXLayoutRenderer } from '~/components/MDXComponents'
import { PageTitle } from '~/components/PageTitle'
import { POSTS_PER_PAGE } from '~/constant'
import { getCommentConfigs } from '~/libs/comment'
import { formatSlug, getCommon, getFiles } from '~/libs/files'
import { generateRss } from '~/libs/generate-rss'
import { getAllFilesFrontMatter, getFileBySlug } from '~/libs/mdx'
import type { AuthorFrontMatter, BlogProps, MdxPageLayout } from '~/types'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

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

/// getStaticProps
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

  // obté l'entrada de blog individual per a l'idioma correcte
  let post = await getFileBySlug('blog', params.slug.join('/'), locale)
  let authors = post.frontMatter.authors || ['default']
  let authorDetails = await Promise.all(
    authors.map(async (author) => {
      let authorData = await getFileBySlug('authors', author, locale)
      // eslint-disable-next-line
      return authorData.frontMatter as unknown as AuthorFrontMatter
    })
  )

  // Resol la ruta al fitxer .json basat en l'idioma
  let lang_siteMetadata = getCommon(locale).siteMetadata

  // rss
  let rss = generateRss(lang_siteMetadata, allPosts)
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
