import { clsx } from 'clsx'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { LOCALES } from '~/constant'
import { Image } from './Image'
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from './ui/Popover'

function getLocale(code: string) {
  return LOCALES.find((locale) => locale.code === code)
}

export function LanguageSwitcher() {
  let router = useRouter()
  let [localeCode, setLocaleCode] = useState(router.locale)
  let currentLocale = getLocale(localeCode)

  useEffect(() => {
    setLocaleCode(router.locale)
  }, [router.locale])

  function handleChange(newLocale: string) {
    router.push(router.pathname, router.asPath, { locale: newLocale })
  }

  return (
    <Popover>
      <PopoverTrigger className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded cursor-pointer">
        <Image
          src={currentLocale.flag}
          alt={currentLocale.name}
          width={20}
          height={20}
          shouldOpenLightbox={false}
        />
      </PopoverTrigger>
      <PopoverContent className="bg-white dark:bg-dark w-32" sideOffset={8}>
        <div className="space-y-1">
          {router.locales.map((code) => {
            let locale = getLocale(code)
            return (
              <PopoverClose
                key={code}
                onClick={() => handleChange(code)}
                className={clsx(
                  'inline-flex w-full font-normal items-center gap-3 px-2 py-1 rounded w-fdivl text-left hover:bg-gray-100 dark:hover:bg-gray-700',
                  code === localeCode && 'text-primary-500 dark:text-primary-400'
                )}
              >
                <Image
                  src={locale.flag}
                  alt={locale.name}
                  width={20}
                  height={20}
                  shouldOpenLightbox={false}
                  className="shrink-0"
                />
                <span>{locale.name}</span>
              </PopoverClose>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
