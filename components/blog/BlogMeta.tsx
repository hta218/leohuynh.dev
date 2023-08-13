import { useTranslation } from 'next-i18next'
import type { BlogMetaProps } from '~/types'
import { formatDate } from '~/utils/date'
import { Twemoji } from '../Twemoji'
import { ViewCounter } from '../ViewCounter'

export function BlogMeta({ date, slug, readingTime }: BlogMetaProps) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  return (
    <dd className="flex flex-wrap text-sm font-medium leading-6 text-gray-500 dark:text-gray-400 md:text-base">
      <time dateTime={date} className="flex items-center justify-center">
        <Twemoji emoji="calendar" size="" />
        <span className="ml-1.5 md:ml-2">{formatDate(date, lang)}</span>
      </time>
      <span className="mx-2">{` • `}</span>
      <div className="flex items-center">
        <Twemoji emoji="hourglass-not-done" size="" />
        <span className="ml-1.5 md:ml-2">
          {t('blog.readingTime', { time: readingTime.text.replace('min read', t('blog.mins')) })}
        </span>
      </div>
      <span className="mx-2">{` • `}</span>
      <div className="flex items-center">
        <Twemoji emoji="eye" size="" />
        <ViewCounter className="ml-1.5 md:ml-2" slug={slug} />
      </div>
    </dd>
  )
}
