import { PageSeo } from 'components/SEO'
import ListLayout from 'layouts/ListLayout'
import { POSTS_PER_PAGE } from '~/constant'
import { siteMetadata } from '~/data'
import { getAllFilesFrontMatter } from '~/libs/mdx'

export async function getStaticPaths() {
  let totalPosts = await getAllFilesFrontMatter('blog')
  let totalPages = Math.ceil(totalPosts.length / POSTS_PER_PAGE)
  let paths = Array.from({ length: totalPages }, (_, i) => ({
    params: { page: (i + 1).toString() },
  }))

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps(context) {
  let {
    params: { page },
  } = context
  let posts = await getAllFilesFrontMatter('blog')
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

export default function PostPage({ posts, initialDisplayPosts, pagination }) {
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
