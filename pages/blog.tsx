import { PageSeo } from '~/components'
import { POSTS_PER_PAGE } from '~/constant'
import { siteMetadata } from '~/data'
import { ListLayout } from '~/layouts'
import { getAllFilesFrontMatter } from '~/libs/mdx'

export async function getStaticProps() {
  let posts = await getAllFilesFrontMatter('blog')
  let initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE)
  let pagination = {
    currentPage: 1,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }

  return { props: { initialDisplayPosts, posts, pagination } }
}

export default function Blog({ posts, initialDisplayPosts, pagination }) {
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
