import { PageSeo } from 'components/SEO'
import { ScrollTopButton } from '~/components/ScrollTopButton'
import ToC from '~/components/ToC'
import stylesResume from './ResumeLayout.module.css'
import { useTranslation } from 'next-i18next'

export function ResumeLayout({ children, toc }) {
  let { t } = useTranslation('common')

  let description = t('resume_description')

  return (
    <>
      <PageSeo
        title={`${t('menu_curriculum')} - ${t('siteMetadata.fullName')} - ${description}`}
        description={`${t('menu_curriculum')} - ${t('siteMetadata.fullName')} - ${description}`}
      />
      <ScrollTopButton />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <header className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {t('menu_curriculum')}
          </h1>
        </header>
        <main className="grid grid-cols-1 md:grid-cols-main gap-4 max-w-screen-xl mx-auto p-3  md:p-8  bg-gray-100 m-5 rounded-md">
          <ToC toc={toc} />
          <div
            className={`font-arial text-gray-900 leading-6 space-y-5 prose prose-slate
            md:p-5 md:border-l md:border-gray-300
            table-auto border-collapse
            bg-gray-100  ${stylesResume.customTable}`}
          >
            {children}
          </div>
        </main>
      </div>
    </>
  )
}

export default ResumeLayout
