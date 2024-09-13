import { ListLayoutWithTags } from '~/layouts/list-layout-with-tags'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'

let POSTS_PER_PAGE = 5

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
    <ListLayoutWithTags
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="All Posts"
    />
  )
}
