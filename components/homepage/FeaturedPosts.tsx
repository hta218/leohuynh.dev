import { BlogTags, Link } from '~/components'
import { FEATURED_POSTS } from '~/constant'
import type { BlogFrontMatter } from '~/types'
import { formatDate } from '~/utils'

export function FeaturedPosts({ posts }: { posts: BlogFrontMatter[] }) {
  return (
    <div className="border-t border-gray-200 dark:border-gray-700">
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {!posts.length && 'No posts found.'}
        {posts.slice(0, FEATURED_POSTS).map((frontMatter) => {
          let { slug, date, title, summary, tags } = frontMatter
          return (
            <li key={slug} className="py-12">
              <article>
                <div className="space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline">
                  <dl>
                    <dt className="sr-only">Published on</dt>
                    <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                      <time dateTime={date}>{formatDate(date)}</time>
                    </dd>
                  </dl>
                  <div className="space-y-5 xl:col-span-3">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-3xl font-bold mb-1 tracking-tight">
                          <Link href={`/blog/${slug}`} className="text-gray-900 dark:text-gray-100">
                            {title}
                          </Link>
                        </h2>
                        <BlogTags tags={tags} />
                      </div>
                      <div className="prose text-gray-500 max-w-none dark:text-gray-400">
                        {summary}
                      </div>
                    </div>
                    <div className="text-base font-medium leading-6">
                      <Link
                        href={`/blog/${slug}`}
                        className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                        aria-label={`Read "${title}"`}
                      >
                        Read more &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            </li>
          )
        })}
      </ul>
      {posts.length > FEATURED_POSTS && (
        <div className="flex justify-end text-base font-medium leading-6">
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="all posts"
          >
            All Posts &rarr;
          </Link>
        </div>
      )}
    </div>
  )
}
