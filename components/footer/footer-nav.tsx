import { ExternalLink } from 'lucide-react'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { Link } from '~/components/ui/link'
import { FOOTER_NAV_LINKS, FOOTER_PERSONAL_STUFF } from '~/data/navigation'

export function FooterNav() {
  return (
    <div className="flex gap-24 px-1 md:justify-end md:px-0 md:text-right">
      <div className="space-y-4">
        <div className="flex h-11 items-center font-semibold md:justify-end">
          <span>Sitemap</span>
        </div>
        <ul className="space-y-3">
          {FOOTER_NAV_LINKS.map((link) => (
            <li key={link.title}>
              <FooterLink link={link} />
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-4">
        <div className="flex h-11 items-center font-semibold">
          <span>Personal stuff</span>
        </div>
        <ul className="space-y-3">
          {FOOTER_PERSONAL_STUFF.map((link) => (
            <li key={link.title}>
              <FooterLink link={link} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function FooterLink({ link }: { link: (typeof FOOTER_NAV_LINKS)[0] }) {
  let { href, title } = link
  let isExternal = href.startsWith('http')
  return (
    <Link href={href}>
      <GrowingUnderline
        data-umami-event={`footer-nav-${href.replace('/', '')}`}
        className="inline-flex items-center"
      >
        {title}
        {isExternal && <ExternalLink className="-mt-1 ml-1.5" size={18} strokeWidth={1.5} />}
      </GrowingUnderline>
    </Link>
  )
}
