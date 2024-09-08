import headerNavLinks from '@/data/headerNavLinks'
import siteMetadata from '@/data/siteMetadata'
import clsx from 'clsx'
import NextImage from 'next/image'
import Link from './Link'
import MobileNav from './MobileNav'
import SearchButton from './SearchButton'
import ThemeSwitch from './ThemeSwitch'
import Container from './Container'

function Header() {
  return (
    <header
      className={clsx(
        'bg-white/50 py-3 backdrop-blur dark:bg-dark/75',
        siteMetadata.stickyNav && 'sticky top-0 z-50'
      )}
    >
      <Container as="div" className="flex w-full items-center justify-between">
        <Link href="/" aria-label={siteMetadata.headerTitle}>
          <div className="flex items-center justify-between">
            <div className="mr-3">
              <NextImage
                src="/static/images/logo.jpg"
                alt={siteMetadata.headerTitle}
                width={45}
                height={45}
                className="rounded-full"
                priority
              />
            </div>
          </div>
        </Link>
        <div className="flex items-center space-x-4 leading-5 sm:space-x-6">
          <div className="no-scrollbar hidden max-w-40 items-center space-x-4 overflow-x-auto sm:flex sm:space-x-6 md:max-w-72 lg:max-w-96">
            {headerNavLinks
              .filter((link) => link.href !== '/')
              .map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="block font-medium text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
                >
                  {link.title}
                </Link>
              ))}
          </div>
          <SearchButton />
          <ThemeSwitch />
          <MobileNav />
        </div>
      </Container>
    </header>
  )
}

export default Header
