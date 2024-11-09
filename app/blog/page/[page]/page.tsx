import { allBlogs } from 'contentlayer/generated'
import { ListLayout } from '~/layouts/list-layout'
import { POSTS_PER_PAGE } from '~/utils/const'
import { allCoreContent } from '~/utils/contentlayer'
import { sortPosts } from '~/utils/misc'

export let generateStaticParams = async () => {
  let totalPages = Math.ceil(allBlogs.length / POSTS_PER_PAGE)
  let paths = Array.from({ length: totalPages }, (_, i) => ({ page: (i + 1).toString() }))
  return paths
}

export default function Page({ params }: { params: { page: string } }) {
  let posts = allCoreContent(sortPosts(allBlogs))
  let pageNumber = parseInt(params.page as string)
  let initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  let pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }

  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="All posts"
    />
  )
}
