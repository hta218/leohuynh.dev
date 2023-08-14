import { useTranslation } from 'next-i18next'
import { siteMetadata } from '~/data/siteMetadata'
import { BrandIcon } from './BrandIcon'
import { Link } from './Link'

export function BuiltWith() {
  let { t } = useTranslation('common')

  return (
    <div className="flex items-center space-x-1">
      <span className="mr-1 text-gray-500 dark:text-gray-400">{t('build_with.built_with')}</span>
      <div className="flex space-x-1.5">
        <Link href="https://nextjs.org?ref=leohuynh.dev">
          <BrandIcon type="NextJS" className="h-5 w-5" />
        </Link>
        <Link href="https://tailwindcss.com?ref=leohuynh.dev">
          <BrandIcon type="TailwindCSS" className="h-5 w-5" />
        </Link>
        <Link href="https://www.prisma.io?ref=leohuynh.dev">
          <BrandIcon type="Prisma" className="h-5 w-5" />
        </Link>
        <Link href="https://www.typescriptlang.org?ref=leohuynh.dev">
          <BrandIcon type="Typescript" className="h-5 w-5" />
        </Link>
        <Link href="https://umami.is?ref=leohuynh.dev" className="pl-px">
          <BrandIcon type="Umami" className="h-5 w-5" />
        </Link>
      </div>
      <span className="px-1 text-gray-400 dark:text-gray-500">-</span>
      <Link
        href={siteMetadata.siteRepo}
        className="text-gray-500 underline underline-offset-4 dark:text-gray-400"
      >
        <span data-umami-event="view-source">{t('build_with.view_source')}</span>
      </Link>
    </div>
  )
}
