import clsx from 'clsx'
import type { Blog } from 'contentlayer/generated'
import { TagsList } from '~/components/blog/tags'
import { GritBackground } from '~/components/ui/grit-background'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { Image } from '~/components/ui/image'
import { Link } from '~/components/ui/link'
import { SITE_METADATA } from '~/data/site-metadata'
import type { CoreContent } from '~/types/data'
import { formatDate } from '~/utils/misc'

export function PostCardListView({
  post,
  loading,
}: {
  post: CoreContent<Blog>
  loading?: 'lazy' | 'eager'
}) {
  let { slug, date, title, summary, tags, images, readingTime } = post
  return (
    <article>
      <div className="flex flex-col gap-2 space-y-3 md:flex-row md:gap-8">
        <Link
          href={`/blog/${slug}`}
          className={clsx([
            'relative block shrink-0',
            'h-auto w-full md:h-80 md:w-72',
            'pb-3 pl-0 pr-3 pt-0',
            'transition-all ease-in-out hover:pb-2 hover:pl-1 hover:pr-2 hover:pt-1',
          ])}
        >
          <Image
            src={images && images.length > 0 ? images[0] : SITE_METADATA.socialBanner}
            alt={title}
            width={500}
            height={500}
            className="aspect-video h-full w-full rounded-xl shadow-2xl"
            loading={loading}
          />
          <GritBackground
            className={clsx([
              'bottom-0 left-3 right-0 top-3',
              'rounded-xl border-2 border-gray-800 dark:border-gray-400',
            ])}
          />
        </Link>
        <div className="space-y-4 md:space-y-5">
          <div className="space-y-4 md:space-y-6">
            <div className="space-y-3">
              <dl className="text-sm">
                <dt className="sr-only">Published on</dt>
                <dd className="font-medium leading-6 text-gray-500 dark:text-gray-400">
                  <time dateTime={date}>{formatDate(date)}</time>
                  <span className="mx-2 text-gray-400">/</span>
                  <span>{Math.ceil(readingTime.minutes)} mins read</span>
                </dd>
              </dl>
              <h2 className="pb-1 text-xl font-bold tracking-tight md:text-2xl">
                <Link href={`/blog/${slug}`} className="text-gray-900 dark:text-gray-100">
                  <GrowingUnderline data-umami-event="latest-post-title" duration={500}>
                    {title}
                  </GrowingUnderline>
                </Link>
              </h2>
              <TagsList tags={tags} />
            </div>
            <div className="line-clamp-2 text-gray-500 dark:text-gray-400 md:line-clamp-3">
              {summary}
            </div>
          </div>
          <div className="text-base font-medium leading-6">
            <Link
              href={`/blog/${slug}`}
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300"
              aria-label={`Read "${title}"`}
            >
              <GrowingUnderline data-umami-event="latest-post-read-more">
                Read article →
              </GrowingUnderline>
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
