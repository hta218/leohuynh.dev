import { Link } from '~/components/ui/link'
import { Brand } from '~/components/ui/brand'
import { SITE_METADATA } from '~/data/site-metadata'

export function BuiltWith() {
  return (
    <div className="flex items-center space-x-1">
      <span className="mr-1 text-gray-500 dark:text-gray-400">Built with</span>
      <div className="flex space-x-1.5">
        <Brand name="NextJS" iconClassName="h-5 w-5" />
        <Brand name="TailwindCSS" iconClassName="h-5 w-5" />
        <Brand name="Prisma" iconClassName="h-5 w-5" />
        <Brand name="Typescript" iconClassName="h-5 w-5" />
        <Brand name="Umami" iconClassName="h-5 w-5" className="pl-px" />
      </div>
      <span className="px-1 text-gray-400 dark:text-gray-500">-</span>
      <Link
        href={SITE_METADATA.siteRepo}
        className="text-gray-500 underline underline-offset-4 dark:text-gray-400"
      >
        <span data-umami-event="view-source">View source</span>
      </Link>
    </div>
  )
}
