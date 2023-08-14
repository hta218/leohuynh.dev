import { useTranslation } from 'next-i18next'
import { Link } from '~/components/Link'
import { BlogTags } from '~/components/blog/BlogTags'
import { FEATURED_POSTS } from '~/constant'
import type { BlogFrontMatter } from '~/types/mdx'
import { formatDate } from '~/utils/date'

export function FeaturedPosts({ posts }: { posts: BlogFrontMatter[] }) {
  let { t, i18n } = useTranslation()
  let lang = i18n.language
  return (
    <div className="border-t border-gray-200 dark:border-gray-700">
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {!posts.length && 'No posts found.'}
        {posts.slice(0, FEATURED_POSTS).map((frontMatter) => {
          let { slug, date, title, summary, tags } = frontMatter
          return (
            <li key={slug} className="py-12">
              <article>
                <div className="space-y-3 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                  <dl>
                    <dt className="sr-only">Published on</dt>
                    <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                      <time dateTime={date}>{formatDate(date, lang)}</time>
                    </dd>
                  </dl>
                  <div className="space-y-5 xl:col-span-3">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h2 className="mb-1 text-2xl md:text-3xl font-bold tracking-tight">
                          <Link href={`/blog/${slug}`} className="text-gray-900 dark:text-gray-100">
                            <span data-umami-event="featured-title">{title}</span>
                          </Link>
                        </h2>
                        <BlogTags tags={tags} />
                      </div>
                      <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                        {summary}
                      </div>
                    </div>
                    <div className="text-base font-medium leading-6">
                      <Link
                        href={`/blog/${slug}`}
                        className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                        aria-label={`Read "${title}"`}
                      >
                        <span data-umami-event="featured-read-more">Read more &rarr;</span>
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
            <span data-umami-event="all-posts"> {t('blog.all_posts_title')} &rarr;</span>
          </Link>
        </div>
      )}
    </div>
  )
}
