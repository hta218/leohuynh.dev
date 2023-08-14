import { PageSeo } from 'components/SEO'
import ListLayout from 'layouts/ListLayout'
import { POSTS_PER_PAGE } from '~/constant'
import type { GetStaticPathsContext } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { getAllFilesFrontMatter } from '~/libs/mdx.server'
import type { BlogListProps } from '~/types/page'

export async function getStaticPaths(context: GetStaticPathsContext) {
  let locales = context.locales || []
  let paths = []

  for (let locale of locales) {
    let totalPosts = getAllFilesFrontMatter(`${locale}/blog`)
    let totalPages = Math.ceil(totalPosts.length / POSTS_PER_PAGE)
    let localePaths = Array.from({ length: totalPages }, (_, i) => ({
      params: { page: (i + 1).toString() },
      locale,
    }))

    paths.push(...localePaths)
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
  params: { page: string }
  locale: string
}) {
  let { page } = params
  let posts = getAllFilesFrontMatter(`${locale}/blog`)
  let pageNumber = parseInt(page)
  let initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  let pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }

  return {
    props: {
      posts,
      initialDisplayPosts,
      pagination,
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

export default function PostPage(props: BlogListProps) {
  let { posts, initialDisplayPosts, pagination } = props
  let { t } = useTranslation('common')
  return (
    <>
      <PageSeo title={t('site_meta_data.title')} description={t('site_meta_data.description')} />
      <ListLayout
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title={t('blog.all_posts_title')}
      />
    </>
  )
}
