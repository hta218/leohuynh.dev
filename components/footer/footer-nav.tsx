'use client'

import { ExternalLink, MoveUp } from 'lucide-react'
import type { MouseEvent } from 'react'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { Link } from '~/components/ui/link'
import { FOOTER_NAV_LINKS, FOOTER_PERSONAL_STUFF } from '~/data/navigation'

export function FooterNav() {
  return (
    <div className="flex justify-end gap-24 text-right">
      <div className="space-y-4">
        <div className="flex h-11 items-center justify-end font-semibold">
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
  let isBackToTop = href === '#'
  return (
    <Link
      href={href}
      onClick={
        isBackToTop
          ? (e: MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault()
              window.scrollTo({ top: 0 })
            }
          : undefined
      }
    >
      <GrowingUnderline
        data-umami-event={`footer-nav-${href.replace('/', '')}`}
        className="inline-flex items-center"
      >
        {title}
        {isExternal && <ExternalLink className="-mt-1 ml-1.5" size={18} strokeWidth={1.5} />}
        {isBackToTop && <MoveUp className="-mt-0.5 ml-0.5" size={16} strokeWidth={1.5} />}
      </GrowingUnderline>
    </Link>
  )
}