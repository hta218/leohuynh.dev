import type readingTime from 'reading-time'
import { Twemoji } from '~/components/ui/twemoji'
import { formatDate } from '~/utils/misc'

type BlogMetaProps = {
  date: string
  lastmod?: string
  slug: string
  readingTime: ReturnType<typeof readingTime>
}

export function BlogMeta({ date, lastmod, slug, readingTime }: BlogMetaProps) {
  return (
    <dl>
      <dt className="sr-only">Published on</dt>
      <dd className="flex flex-wrap items-center gap-3 text-sm font-medium leading-6 text-gray-500 dark:text-gray-400 md:text-base">
        <time dateTime={date} className="flex items-center justify-center">
          <Twemoji emoji="calendar" size="base" />
          <span className="ml-1.5 md:ml-2">{formatDate(date)}</span>
        </time>
        {lastmod && (
          <>
            <span className="text-gray-400">/</span>
            <time dateTime={date} className="flex items-center justify-center">
              <span>Updated</span>
              <span className="ml-1.5 md:ml-2">{formatDate(lastmod)}</span>
            </time>
          </>
        )}
        <span className="text-gray-400">/</span>
        <div className="flex items-center">
          <Twemoji emoji="three-o-clock" size="base" />
          <span className="ml-1.5 md:ml-2">{Math.ceil(readingTime.minutes)} mins read</span>
        </div>
        {/* <span className="mx-2 text-gray-500">|</span>
      <div className="flex items-center">
        <Twemoji emoji="eye" size="base" />
        <ViewCounter className="ml-1.5 md:ml-2" slug={slug} />
      </div> */}
      </dd>
    </dl>
  )
}
