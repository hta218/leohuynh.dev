import { siteMetadata } from '~/data/siteMetadata'
import { DevIcon } from './DevIcon'
import { Link } from './Link'

export function BuiltWith() {
  return (
    <div className="flex items-center space-x-1">
      <span className="mr-1 text-gray-500 dark:text-gray-400">Built with</span>
      <div className="flex space-x-1.5">
        <Link href="https://nextjs.org/">
          <DevIcon type="NextJS" className="h-5 w-5" />
        </Link>
        <Link href="https://tailwindcss.com/">
          <DevIcon type="TailwindCSS" className="h-5 w-5" />
        </Link>
        <Link href="https://www.prisma.io/">
          <DevIcon type="Prisma" className="h-5 w-5" />
        </Link>
        <Link href="https://www.typescriptlang.org/">
          <DevIcon type="Typescript" className="h-5 w-5" />
        </Link>
        <Link href="https://umami.is/" className="pl-px">
          <DevIcon type="Umami" className="h-5 w-5" />
        </Link>
      </div>
      <span className="px-1 text-gray-400 dark:text-gray-500">-</span>
      <Link
        href={siteMetadata.siteRepo}
        className="text-gray-500 underline underline-offset-4 dark:text-gray-400"
      >
        <span className="umami--click--view-source">View source</span>
      </Link>
    </div>
  )
}
