import { Link } from '~/components/ui/link'
import { Container } from '~/components/ui/container'
import siteMetadata from '~/data/siteMetadata'
import MadeInVietNameIcon from '~/icons/miv.svg'
import { BuiltWith } from './built-with'

export function Footer() {
  return (
    <Container as="footer" className="mt-8">
      <div className="items-center justify-between space-y-4 border-t border-gray-200 py-8 dark:border-gray-700 lg:flex">
        <BuiltWith />
        <div className="my-2 flex flex-wrap items-center gap-1.5 text-gray-500 dark:text-gray-400">
          <span className="hidden md:block">{`© ${new Date().getFullYear()}`}</span>
          <span className="hidden md:block">-</span>
          <span>{siteMetadata.title}</span>
          <Link href={siteMetadata.siteRepo}>
            <span data-umami-event="made-in-vietnam">
              <MadeInVietNameIcon />
            </span>
          </Link>
        </div>
      </div>
    </Container>
  )
}
