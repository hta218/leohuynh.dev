import { useTranslation } from 'next-i18next'
import { Twemoji } from '~/components/Twemoji'

export function Heading() {
  let { t } = useTranslation('common')

  return (
    <h1 className="text-neutral-900 dark:text-neutral-200">
      {t('introduction')} <span className="font-medium">{t('name')}</span> - {t('description')}
      <span className="hidden font-medium">{t('location')}</span>
      <span className="absolute ml-1.5 inline-flex pt-[3px]">
        <Twemoji emoji="flag-vietnam" />
      </span>
    </h1>
  )
}
