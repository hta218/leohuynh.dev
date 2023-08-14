import { headerNavLinks } from '~/data/headerNavLinks'
import { Link } from './Link'
import clsx from 'clsx'
import { useTranslation } from 'next-i18next'
import { Menu } from 'lucide-react'

export function MobileNav({ navShow, onToggleNav }) {
  let { t } = useTranslation('common')
  let className = clsx(
    `sm:hidden fixed w-full h-screen inset-0 bg-gray-200 dark:bg-gray-800 opacity-95 z-50 transition-transform transform ease-in-out duration-300`,
    navShow ? 'translate-x-0' : 'translate-x-full'
  )
  return (
    <div className={className}>
      <button
        type="button"
        aria-label="toggle modal"
        className="fixed right-4 top-4 h-8 w-8 cursor-auto focus:outline-none"
        onClick={onToggleNav}
      >
        <Menu strokeWidth={1} size={20} />
      </button>
      <nav className="fixed mt-24 h-full">
        {headerNavLinks.map(({ href, label }) => (
          <div key={label} className="px-8 py-4">
            <Link
              href={href}
              className="text-2xl font-semibold tracking-wide text-gray-900 dark:text-gray-100"
              onClick={onToggleNav}
            >
              {t(label)}
            </Link>
          </div>
        ))}
      </nav>
    </div>
  )
}
