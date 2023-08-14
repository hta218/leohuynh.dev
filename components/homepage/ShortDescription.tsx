import { useTranslation } from 'next-i18next'

export function ShortDescription() {
  let { t } = useTranslation('common')

  return (
    <div className="mb-8 mt-4">
      <p>{t('bio_start_coding')}</p>
      <p>{t('bio_first_job')}</p>
      <p>{t('bio_passion')}</p>
      <p>{t('bio_blog_purpose')}</p>
    </div>
  )
}
