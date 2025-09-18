import { Logo } from '~/components/header/logo'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { Link } from '~/components/ui/link'
import { SITE_METADATA } from '~/data/site-metadata'

export function LogoAndRepo() {
  return (
    <div className="flex items-center">
      <Logo className="mr-4" />
      <Link href={SITE_METADATA.siteRepo} rel="noreferrer">
        <GrowingUnderline
          data-umami-event="footer-view-source"
          className="flex items-center gap-2 font-medium"
        >
          {SITE_METADATA.headerTitle}
        </GrowingUnderline>
      </Link>
    </div>
  )
}
