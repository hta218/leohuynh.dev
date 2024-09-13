import { allBlogs } from 'contentlayer/generated'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { Home } from '~/components/home-page'

export default async function HomePage() {
  let sortedPosts = sortPosts(allBlogs)
  let posts = allCoreContent(sortedPosts)
  return <Home posts={posts} />
}
