import { PageSeo } from 'components/SEO'
import { ScrollTopButton } from '~/components/ScrollTopButton'
import { ToC } from '~/components/ToC'
import { useTranslation } from 'next-i18next'

export function ResumeLayout({ children, toc }) {
  let { t } = useTranslation('common')
  let description = t('resume_description')

  return (
    <>
      <PageSeo
        title={`${t('menu_resume')} - ${t('site_meta_data.author')} - ${t('site_meta_data.title')}`}
        description={`${t('menu_resume')} - ${t('site_meta_data.full_name')} - ${description}`}
      />
      <ScrollTopButton />
      <div className="resume">
        <header className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {t('menu_resume')}
          </h1>
          <p className="text-base md:text-lg md:leading-7 text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </header>
        <div className="border border-t border-gray-200 dark:border-gray-700" />
        <main className="gap-12 max-w-screen-xl mx-auto p-3 md:p-8 bg-gray-100 my-12 rounded-md md:flex space-y-12 md:space-y-0">
          <ToC toc={toc} />
          <div className="border-l border-gray-300 hidden md:block" />
          <div className="text-gray-900 leading-6 space-y-5 prose prose-slate grow table-auto border-collapse">
            {children}
          </div>
        </main>
      </div>
    </>
  )
}

export default ResumeLayout
