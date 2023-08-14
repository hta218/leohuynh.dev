import type { BlogHeaderProps } from '~/types/components'
import { formatDate } from '~/utils/date'
import { PageTitle } from '../PageTitle'
import { Twemoji } from '../Twemoji'
import { useTranslation } from 'next-i18next'

export function BlogHeader({ title, date, readingTime }: BlogHeaderProps) {
  let { i18n } = useTranslation()
  let lang = i18n.language

  let createdAt = formatDate(date, lang)
  let readingTimeText = readingTime.text

  return (
    <header className="pt-6 xl:py-16">
      <div className="space-y-4 text-center md:space-y-2">
        <PageTitle>{title}</PageTitle>
        <dl className="space-y-10">
          <div>
            <dt className="sr-only">Published on</dt>
            <dd className="flex items-center justify-center text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
              <time dateTime={date} className="flex items-center">
                <Twemoji emoji="calendar" size="" />
                <span className="ml-1.5">{createdAt}</span>
              </time>
              <span className="mx-2">-</span>
              <div className="flex items-center">
                <Twemoji emoji="hourglass-not-done" size="" />
                <span className="ml-1.5">{readingTimeText.replace('min', 'mins')}</span>
              </div>
            </dd>
          </div>
        </dl>
      </div>
    </header>
  )
}
