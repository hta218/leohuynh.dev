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
    <header
      className={clsx(
        'bg-white/50 py-3 backdrop-blur dark:bg-dark/75',
        siteMetadata.stickyNav && 'sticky top-0 z-50'
      )}
    >
      <Container as="div" className="flex w-full items-center justify-between gap-3">
        <Link href="/" aria-label={siteMetadata.headerTitle}>
          <NextImage
            src="/static/images/logo.jpg"
            alt={siteMetadata.headerTitle}
            width={45}
            height={45}
            className="rounded-full"
            priority
          />
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden space-x-1.5 sm:block">
            {HEADER_NAV_LINKS.filter((link) => link.href !== '/').map(({ title, href }) => {
              return (
                <Link key={title} href={href}>
                  <span
                    className={clsx(
                      'inline-block rounded px-3 py-1 font-medium',
                      pathname.startsWith(href)
                        ? 'bg-gray-200 dark:bg-gray-700'
                        : 'hover:bg-gray-200 dark:hover:bg-gray-700'
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
      </Container>
    </header>
  )
}

export default Header
