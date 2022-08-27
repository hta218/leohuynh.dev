import { PageSeo } from '~/components'
import { POSTS_PER_PAGE } from '~/constant'
import { siteMetadata } from '~/data'
import { ListLayout } from '~/layouts'
import { getAllFilesFrontMatter } from '~/libs/mdx'
import type { BlogListProps } from '~/types'

export function getStaticProps() {
  let posts = getAllFilesFrontMatter('blog')
  let initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE)
  let pagination = {
    currentPage: 1,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }

  return { props: { posts, initialDisplayPosts, pagination } }
}

export default function Blog({ posts, initialDisplayPosts, pagination }: BlogListProps) {
  return (
    <>
      <PageSeo
        title={`All posts - ${siteMetadata.author}`}
        description={siteMetadata.description}
      />
      <ListLayout
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title="All Posts"
      />
    </>
  )
}
