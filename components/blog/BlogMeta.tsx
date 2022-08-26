import { ViewCounter, Twemoji } from '~/components'
import type { BlogMetaProps } from '~/types'
import { formatDate } from '~/utils'

export function BlogMeta({ date, slug, readingTime }: BlogMetaProps) {
  return (
    <dd className="flex flex-wrap text-sm md:text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
      <time dateTime={date} className="flex items-center justify-center">
        <Twemoji emoji="calendar" size="" />
        <span className="ml-1.5 md:ml-2">{formatDate(date)}</span>
      </time>
      <span className="mx-2">{` • `}</span>
      <div className="flex items-center">
        <Twemoji emoji="hourglass-not-done" size="" />
        <span className="ml-1.5 md:ml-2">{readingTime.text.replace('min', 'mins')}</span>
      </div>
      <span className="mx-2">{` • `}</span>
      <div className="flex items-center">
        <Twemoji emoji="eye" size="" />
        <ViewCounter className="ml-1.5 md:ml-2" slug={slug} />
      </div>
    </dd>
  )
}
