import siteMetadata from '~/data/siteMetadata'
import MadeInVietNameIcon from '~/icons/miv.svg'
import PoweredByVercelIcon from '~/icons/powered-by-vercel.svg'
import { BuiltWith } from './BuiltWith'
import Container from './Container'
import Link from './Link'

export function Footer() {
  return (
    <Container as="footer">
      <div className="mb-8 mt-16 items-center justify-between space-y-4 md:mb-10 md:flex md:space-y-0">
        <BuiltWith />
        <div className="my-2 flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <span>
            {`© ${new Date().getFullYear()}`}
            {` • `}
            {siteMetadata.title}
          </span>
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
