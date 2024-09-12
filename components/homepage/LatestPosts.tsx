import clsx from 'clsx'
import { MoveRight } from 'lucide-react'
import type { CSSProperties } from 'react'
import Image from '~/components/Image'
import Link from '~/components/Link'
import { BlogTags } from '~/components/blog/BlogTags'
import siteMetadata from '~/data/siteMetadata'
import type { BlogFrontMatter } from '~/types/mdx'
import { formatDate } from '~/utils/date'

const MAX_DISPLAY = 5

export function LatestPosts({ posts }: { posts: BlogFrontMatter[] }) {
  return (
    <div className="mt-8 space-y-8 divide-y divide-gray-200 dark:divide-gray-700">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold sm:text-2xl sm:leading-10 md:text-4xl">
          Latest posts
        </h2>
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
      <ul className="divide-gray-200 dark:divide-gray-700">
        {!posts.length && 'No posts found.'}
        {posts.slice(0, MAX_DISPLAY).map((frontMatter) => {
          let { slug, date, title, summary, tags, images, readingTime } = frontMatter
          return (
            <li key={slug} className="py-10">
              <article>
                <div className="flex flex-col gap-8 space-y-3 md:flex-row">
                  <Image
                    src={images && images.length > 0 ? images[0] : siteMetadata.socialBanner}
                    alt={title}
                    width={500}
                    height={500}
                    className="h-80 w-72 rounded-xl object-cover object-center"
                  />
                  <div className="space-y-5">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <dl>
                          <dt className="sr-only">Published on</dt>
                          <dd className="font-medium leading-6 text-gray-500 dark:text-gray-400">
                            <time dateTime={date}>{formatDate(date)}</time>
                            <span className="mx-2">{` • `}</span>
                            <span>{Math.ceil(readingTime.minutes)} mins read</span>
                          </dd>
                        </dl>
                        <h2 className="mb-1 text-xl font-bold tracking-tight md:text-3xl">
                          <Link href={`/blog/${slug}`} className="text-gray-900 dark:text-gray-100">
                            <span
                              data-umami-event="latest-post-title"
                              className="background-underline"
                              style={{ '--duration': '500ms' } as CSSProperties}
                            >
                              {title}
                            </span>
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
                        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400"
                        aria-label={`Read "${title}"`}
                      >
                        <span
                          className="background-underline"
                          data-umami-event="latest-post-read-more"
                        >
                          Read article →
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            </li>
          )
        })}
      </ul>
      <div className="h-10" />
    </div>
  )
}
