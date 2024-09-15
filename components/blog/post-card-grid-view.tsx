import type { Blog } from 'contentlayer/generated'
import type { CoreContent } from 'pliny/utils/contentlayer'
import { formatDate } from 'pliny/utils/formatDate'
import Image from '~/components/Image'
import Link from '~/components/Link'
import siteMetadata from '~/data/siteMetadata'

export function PostCardGridView({ post }: { post: CoreContent<Blog> }) {
  let { path, date, title, summary, images, readingTime } = post
  return (
    <article>
      <div className="flex flex-col items-start justify-between gap-6">
        <Link href={`/${path}`} className="block shrink-0">
          <Image
            src={images && images.length > 0 ? images[0] : siteMetadata.socialBanner}
            alt={title}
            width={600}
            height={400}
            className="aspect-video h-auto w-full rounded-xl object-cover object-center md:aspect-[3/2]"
          />
        </Link>
        <div className="space-y-2 md:space-y-3">
          <div className="flex items-center gap-x-1.5 text-sm text-gray-600">
            <time dateTime={date}>{formatDate(date)}</time>
            <span className="mx-1">{` • `}</span>
            <span>{Math.ceil(readingTime.minutes)} mins read</span>
          </div>
          <div className="group relative">
            <h3 className="mt-3 text-xl font-semibold leading-6">
              <Link href={`/${path}`} className="text-gray-900 dark:text-gray-100">
                <span className="background-underline">{title}</span>
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
