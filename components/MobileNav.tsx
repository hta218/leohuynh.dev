import { headerNavLinks } from '~/data/headerNavLinks'
import { Link } from './Link'
import clsx from 'clsx'
import { useTranslation } from 'next-i18next'

export function MobileNav({ navShow, onToggleNav }) {
  const { t } = useTranslation('common')
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
          ></path>
          <path
            fillRule="evenodd"
            d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          ></path>
          <path
            fillRule="evenodd"
            d="M3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
      <nav className="fixed mt-24 h-full">
        {headerNavLinks.map((link) => (
          <div key={link.titleKey} className="px-8 py-4">
            <Link
              href={link.href}
              className="text-2xl font-semibold tracking-wide text-gray-900 dark:text-gray-100"
              onClick={onToggleNav}
            >
              {t(link.titleKey)}{' '}
            </Link>
          </div>
        ))}
      </nav>
    </div>
  )
}
