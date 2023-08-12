import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const localeNames = {
  en: 'English',
  es: 'Español',
  ca: 'Català',
  // add other languages as needed
}

function getLocaleName(localeCode) {
  return localeNames[localeCode] || localeCode
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
export function LanguageSwitcher() {
  const router = useRouter()
  const [value, setValue] = useState(router.locale)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    setValue(router.locale)
  }, [router.locale])

  function translate_to(locale) {
    router.push(router.pathname, router.asPath, { locale })
    setDropdownOpen(false) // Tancar el menú desplegable un cop l'usuari hagi seleccionat una opció
  }

  return (
    <div className="relative inline-block text-left">
      <button
        id="dropdownDefaultButton"
        data-dropdown-toggle="dropdown"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className=" font-medium text-gray-700 hover:bg-gray-200 rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center 
        dark:border-gray-600  dark:text-gray-200 dark:hover:bg-gray-700  dark:hover:text-white
        "
        type="button"
      >
        {capitalize(value)}
        <svg
          className="w-2.5 h-2.5 ml-2.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {dropdownOpen && (
        <div
          id="dropdown"
          className="origin-top-right absolute right-0 mt-2 w-44 rounded-lg shadow bg-white ring-1 ring-black ring-opacity-5 z-50 divide-y divide-gray-100  
          dark:divide-gray-600 dark:ring-gray-800 dark:ring-opacity-5 dark:ring-1 dark:bg-gray-700 dark:ring-offset-2 dark:ring-offset-gray-700"
        >
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDefaultButton"
          >
            {router.locales.map((locale) => {
              const label = getLocaleName(locale)
              return (
                <li key={locale}>
                  <button
                    onClick={() => translate_to(locale)}
                    className="block px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    {label}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
