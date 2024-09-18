import type { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from '~/.contentlayer/generated'
import Link from '~/components/Link'
import { PostCardListView } from '~/components/blog/post-card-list-view'

const MAX_DISPLAY = 5

export function LatestPosts({ posts }: { posts: CoreContent<Blog>[] }) {
  return (
    <div className="space-y-4 divide-y divide-gray-200 dark:divide-gray-700 md:mt-8 md:space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold sm:text-2xl sm:leading-10 md:text-4xl">Latest posts</h2>
        {posts.length > MAX_DISPLAY && (
          <div className="flex justify-end text-base font-medium leading-6">
            <Link href="/blog" className="" aria-label="All posts">
              <span data-umami-event="all-posts" className="background-underline">
                View all posts &rarr;
              </span>
            </Link>
          </div>
        )}
      </div>
      <ul className="space-y-12 divide-gray-200 pt-6 dark:divide-gray-700 md:space-y-20 md:pt-10">
        {!posts.length && 'No posts found.'}
        {posts.slice(0, MAX_DISPLAY).map((post) => (
          <li key={post.slug}>
            <PostCardListView post={post} />
          </li>
        ))}
      </ul>
    </div>
  )
}
