import clsx from 'clsx'
import { useTranslation } from 'next-i18next'
import NextImage from 'next/image'
import { useRouter } from 'next/router'
import { headerNavLinks } from '~/data/headerNavLinks'
import { AnalyticsLink } from './AnalyticsLink'
import { LanguageSwitcher } from './LanguageSwitcher'
import { Link } from './Link'
import { MobileNavToggle } from './MobileNavToggle'
import { ThemeSwitcher } from './ThemeSwitcher'

export function Header({ navShow, onToggleNav }: { onToggleNav: () => void; navShow: boolean }) {
  let { t } = useTranslation('common')
  let router = useRouter()

  return (
    <nav className="supports-backdrop-blur:bg-white/95 sticky top-0 z-50 overflow-hidden bg-white/75 py-3 backdrop-blur dark:bg-dark/75">
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
            {headerNavLinks.map(({ href, label }) => (
              <Link key={href} href={href}>
                <span
                  className={clsx(
                    'inline-block rounded px-3 py-1 font-medium',
                    router.pathname.startsWith(href)
                      ? 'bg-gray-200 dark:bg-gray-700'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                  )}
                  data-umami-event={`nav-${href.replace('/', '')}`}
                >
                  {t(label)}
                </span>
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <AnalyticsLink />
            <ThemeSwitcher />
            <LanguageSwitcher />
            <MobileNavToggle navShow={navShow} onToggleNav={onToggleNav} />
          </div>
        </div>
      </div>
    </nav>
  )
}
