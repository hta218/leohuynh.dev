import { PageSeo } from 'components/SEO'
import ListLayout from 'layouts/ListLayout'
import { POSTS_PER_PAGE } from '~/constant'
import { siteMetadata } from '~/data'
import { getAllFilesFrontMatter } from '~/libs/mdx'
import type { BlogListProps } from '~/types'

export async function getStaticPaths() {
  let totalPosts = getAllFilesFrontMatter('blog')
  let totalPages = Math.ceil(totalPosts.length / POSTS_PER_PAGE)
  let paths = Array.from({ length: totalPages }, (_, i) => ({
    params: { page: (i + 1).toString() },
  }))

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }: { params: { page: string } }) {
  let { page } = params
  let posts = getAllFilesFrontMatter('blog')
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
    },
  }
}

export default function PostPage(props: BlogListProps) {
  let { posts, initialDisplayPosts, pagination } = props
  return (
    <>
      <PageSeo title={siteMetadata.title} description={siteMetadata.description} />
      <ListLayout
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title="All Posts"
      />
    </>
  )
}
