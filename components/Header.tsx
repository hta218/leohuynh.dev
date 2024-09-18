'use client'

import HEADER_NAV_LINKS from '@/data/headerNavLinks'
import siteMetadata from '@/data/siteMetadata'
import clsx from 'clsx'
import NextImage from 'next/image'
import { usePathname } from 'next/navigation'
import Container from './Container'
import Link from './Link'
import MobileNav from './MobileNav'
import SearchButton from './SearchButton'
import ThemeSwitcher from './ThemeSwitcher'
import { AnalyticsLink } from './AnalyticsLink'

function Header() {
  let pathname = usePathname()

  return (
    <Container
      as="header"
      className={clsx(
        'bg-white/75 py-2 backdrop-blur dark:bg-dark/75',
        'rounded-2xl shadow-sm saturate-100',
        siteMetadata.stickyNav && 'sticky top-2 z-50 lg:top-3'
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/"
          aria-label={siteMetadata.headerTitle}
          className="rounded-xl p-0.5 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:ring-white/10"
        >
          <NextImage
            src="/static/images/logo.jpg"
            alt={siteMetadata.headerTitle}
            width={100}
            height={100}
            className="h-10 w-10 rounded-xl"
            priority
          />
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden space-x-1.5 sm:block">
            {HEADER_NAV_LINKS.filter((link) => link.href !== '/').map(({ title, href }) => {
              return (
                <Link key={title} href={href} className="px-3 py-1 font-medium">
                  <span
                    className={clsx(
                      'background-underline',
                      pathname.startsWith(href) && 'bg-[length:100%_50%]'
                    )}
                    data-umami-event={`nav-${href.replace('/', '')}`}
                  >
                    {title}
                  </span>
                </Link>
              )
            })}
          </div>
          <div className="flex items-center gap-1">
            <AnalyticsLink />
            <SearchButton />
            <ThemeSwitcher />
            <MobileNav />
          </div>
        </div>
      </div>
    </Container>
  )
}

export default Header
