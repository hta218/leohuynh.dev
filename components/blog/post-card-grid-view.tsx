import { clsx } from 'clsx'
import type { Blog } from 'contentlayer/generated'
import { GritBackground } from '~/components/ui/grit-background'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { Image } from '~/components/ui/image'
import { Link } from '~/components/ui/link'
import { SITE_METADATA } from '~/data/site-metadata'
import type { CoreContent } from '~/types/data'
import { formatDate } from '~/utils/misc'

export function PostCardGridView({ post }: { post: CoreContent<Blog> }) {
  let { path, date, title, summary, images, readingTime } = post
  return (
    <article>
      <div className="flex flex-col items-start justify-between gap-4 md:gap-6">
        <Link
          href={`/${path}`}
          className={clsx([
            'relative block shrink-0',
            'h-auto w-full md:aspect-[3/2]',
            'pb-3 pl-0 pr-3 pt-0',
            'transition-all ease-in-out hover:pb-2 hover:pl-1 hover:pr-2 hover:pt-1',
          ])}
        >
          <Image
            src={images && images.length > 0 ? images[0] : SITE_METADATA.socialBanner}
            alt={title}
            width={600}
            height={400}
            className="aspect-video h-full w-full rounded-xl shadow-2xl"
          />
          <GritBackground
            className={clsx([
              'bottom-0 left-3 right-0 top-3',
              'rounded-xl border-2 border-gray-800 dark:border-gray-400',
            ])}
          />
        </Link>
        <div className="w-full space-y-3">
          <div className="flex items-center gap-x-1.5 text-sm text-gray-600 dark:text-gray-400">
            <time dateTime={date}>{formatDate(date)}</time>
            <span className="mx-1 text-gray-400">/</span>
            <span>{Math.ceil(readingTime.minutes)} mins read</span>
          </div>
          <div className="group relative">
            <h3 className="text-xl font-semibold leading-6">
              <Link href={`/${path}`}>
                <GrowingUnderline>{title}</GrowingUnderline>
              </Link>
            </h3>
            {/* <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600 dark:text-gray-500 md:mt-3">
              {summary}
            </p> */}
          </div>
        </div>
      </div>
    </article>
  )
}
