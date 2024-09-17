import siteMetadata from '~/data/siteMetadata'
import { Brand } from './Brands'
import Link from './Link'

export function BuiltWith() {
  return (
    <div className="flex items-center space-x-1">
      <span className="mr-1 text-gray-500 dark:text-gray-400">Built with</span>
      <div className="flex space-x-1.5">
        <Brand type="NextJS" iconClassName="h-5 w-5" />
        <Brand type="TailwindCSS" iconClassName="h-5 w-5" />
        <Brand type="Prisma" iconClassName="h-5 w-5" />
        <Brand type="Typescript" iconClassName="h-5 w-5" />
        <Brand type="Umami" iconClassName="h-5 w-5" className="pl-px" />
      </div>
      <span className="px-1 text-gray-400 dark:text-gray-500">-</span>
      <Link
        href={siteMetadata.siteRepo}
        className="text-gray-500 underline underline-offset-4 dark:text-gray-400"
      >
        <span data-umami-event="view-source">View source</span>
      </Link>
    </div>
  )
}
