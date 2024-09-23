import type { Blog } from 'contentlayer/generated'
import type { CoreContent } from 'pliny/utils/contentlayer'
import { Image } from '~/components/ui/image'
import { Link } from '~/components/ui/link'
import { TagsList } from '~/components/blog/tags'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import siteMetadata from '~/data/siteMetadata'
import { formatDate } from '~/utils/date'

export function PostCardListView({ post }: { post: CoreContent<Blog> }) {
  let { slug, date, title, summary, tags, images, readingTime } = post
  return (
    <article>
      <div className="flex flex-col gap-2 space-y-3 md:flex-row md:gap-8">
        <Link href={`/blog/${slug}`} className="block shrink-0">
          <Image
            src={images && images.length > 0 ? images[0] : siteMetadata.socialBanner}
            alt={title}
            width={500}
            height={500}
            className="aspect-video h-auto w-full rounded-xl object-cover object-center md:aspect-auto md:h-80 md:w-72"
          />
        </Link>
        <div className="space-y-5">
          <div className="space-y-4 md:space-y-6">
            <div className="space-y-3">
              <dl className="text-sm">
                <dt className="sr-only">Published on</dt>
                <dd className="font-medium leading-6 text-gray-500 dark:text-gray-400">
                  <time dateTime={date}>{formatDate(date)}</time>
                  <span className="mx-2">{` • `}</span>
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
