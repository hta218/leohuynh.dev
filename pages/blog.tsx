import { PageSeo } from '~/components/SEO'
import { POSTS_PER_PAGE } from '~/constant'
import { ListLayout } from '~/layouts/ListLayout'
import { getAllFilesFrontMatter } from '~/libs/mdx'
import type { BlogListProps } from '~/types'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

export async function getStaticProps({ locale }) {
  let posts = getAllFilesFrontMatter(`${locale}/blog`)

  let initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE)
  let pagination = {
    currentPage: 1,
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

export default function Blog({ posts, initialDisplayPosts, pagination }: BlogListProps) {
  let { t } = useTranslation('common')
  return (
    <>
      <PageSeo
        title={`${t('blog.all_posts_title')} - ${t('site_meta_data.author')}`}
        description={t('site_meta_data.description')}
      />
      <ListLayout
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title={t('blog.all_posts_title')}
      />
    </>
  )
}
