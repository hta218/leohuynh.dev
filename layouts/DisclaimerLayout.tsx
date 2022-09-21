import { PageSeo } from 'components/SEO'
import { ScrollTopButton } from '~/components'
import { siteMetadata } from '~/data'
import type { DisclaimerLayoutProps } from '~/types'

export function DisclaimerLayout({ children }: DisclaimerLayoutProps) {
  let description = 'website disclaimer'

  return (
    <>
      <PageSeo
        title={`Disclaimer - ${siteMetadata.title}`}
        description={`Disclaimer - ${siteMetadata.title}`}
      />
      <ScrollTopButton />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="pt-6 pb-8 space-y-2 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Disclaimer
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <div className="items-start space-y-2 xl:space-y-0">
          <div className="pt-8 pb-8 prose prose-lg dark:prose-dark max-w-none">{children}</div>
        </div>
      </div>
    </>
  )
}

export default DisclaimerLayout
