import clsx from 'clsx'
import { useTranslation } from 'next-i18next'
import NextImage from 'next/image'
import { useRouter } from 'next/router'
import { headerNavLinks } from '~/data/headerNavLinks'
import { AnalyticsLink } from './AnalyticsLink'
import { LanguageSwitcher } from './LanguageSwitcher'
import { Link } from './Link'
import { ThemeSwitcher } from './ThemeSwitcher'

export function Header({ onToggleNav }: { onToggleNav: () => void }) {
  let { t } = useTranslation('common')
  let router = useRouter()

  return (
    <header className="supports-backdrop-blur:bg-white/95 sticky top-0 z-50 overflow-hidden bg-white/75 py-3 backdrop-blur dark:bg-dark/75">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-3 xl:max-w-5xl xl:px-0">
        <Link href="/" aria-label="Leo's Blog">
          <div className="flex items-center justify-between" data-umami-event="logo">
            <div className="mr-3 flex items-center justify-center">
              <NextImage
                src="/static/images/logo.jpg"
                alt="Leo's Blog logo"
                width={45}
                height={45}
                className="rounded-full"
              />
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden space-x-1.5 sm:block">
            {headerNavLinks.map((link) => (
              <Link key={link.titleKey} href={link.href}>
                <span
                  className={clsx(
                    'inline-block rounded px-3 py-1 font-medium',
                    router.pathname.startsWith(link.href)
                      ? 'bg-gray-200 dark:bg-gray-700'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                  )}
                  data-umami-event={`nav-${link.href.replace('/', '')}`}
                >
                  {t(link.titleKey)}{' '}
                </span>
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <AnalyticsLink />
            <ThemeSwitcher />
            <LanguageSwitcher />
            <MobileNavToggle onToggleNav={onToggleNav} />
          </div>
        </div>
      </div>
    </header>
  )
}

function MobileNavToggle({ onToggleNav }: { onToggleNav: () => void }) {
  return (
    <button
      className="ml-2 mr-1 h-8 w-8 rounded sm:hidden"
      type="button"
      aria-label="Toggle Menu"
      onClick={onToggleNav}
      data-umami-event="mobile-nav-toggle"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="text-gray-900 dark:text-gray-100"
      >
        <path
          fillRule="evenodd"
          d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
          clipRule="evenodd"
        />
        <path
          fillRule="evenodd"
          d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
          clipRule="evenodd"
        />
        <path
          fillRule="evenodd"
          d="M3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  )
}
