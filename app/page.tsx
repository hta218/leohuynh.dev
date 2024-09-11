import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import Main from './Main'

export default async function Page() {
  let sortedPosts = sortPosts(allBlogs)
  let posts = allCoreContent(sortedPosts)
  return <Main posts={posts} />
}
