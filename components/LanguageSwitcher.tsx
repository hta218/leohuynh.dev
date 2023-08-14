import { clsx } from 'clsx'
import { useLocale } from '~/hooks/useLocale'
import { getLocale } from '~/utils/locale'
import { Image } from './Image'
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from './ui/Popover'

export function LanguageSwitcher() {
  let [locale, localeCodes, updateLocale] = useLocale()

  return (
    <Popover>
      <PopoverTrigger className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded cursor-pointer">
        <Image
          src={locale.flag}
          alt={locale.name}
          width={20}
          height={20}
          shouldOpenLightbox={false}
        />
      </PopoverTrigger>
      <PopoverContent className="bg-white dark:bg-dark w-32" sideOffset={8}>
        <div className="space-y-1">
          {localeCodes.map((code) => {
            let { flag, name } = getLocale(code)
            return (
              <PopoverClose
                key={code}
                onClick={() => updateLocale(code)}
                className={clsx(
                  'inline-flex w-full font-normal items-center gap-3 px-2 py-1 rounded w-fdivl text-left hover:bg-gray-100 dark:hover:bg-gray-700',
                  code === locale.code && 'text-primary-500 dark:text-primary-400'
                )}
              >
                <Image
                  src={flag}
                  alt={name}
                  width={20}
                  height={20}
                  shouldOpenLightbox={false}
                  className="shrink-0"
                />
                <span>{name}</span>
              </PopoverClose>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
