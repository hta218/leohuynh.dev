import { useTranslation } from 'next-i18next'

export function ShortDescription() {
  let { t } = useTranslation('common')

  return (
    <div className="mb-8 mt-4">
      <p>{t('bio_startCoding')}</p>
      <p>{t('bio_firstJob')}</p>
      <p>{t('bio_passion')}</p>
      <p>{t('bio_blogPurpose')}</p>
    </div>
  )
}
