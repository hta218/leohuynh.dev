import { useRouter } from 'next/router'

let useLocale = () => {
  let { locale, defaultLocale } = useRouter()

  return locale || defaultLocale
}

export default useLocale
