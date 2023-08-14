import { useRouter } from 'next/router'
import { getLocale } from '~/utils/locale'

export function useLocale() {
  let router = useRouter()
  let locale = getLocale(router.locale)
  let localeCodes = router.locales

  function updateLocale(code: string) {
    router.push(router.pathname, router.asPath, { locale: code })
  }

  return [locale, localeCodes, updateLocale] as const
}
