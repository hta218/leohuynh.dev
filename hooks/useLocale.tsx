import { useRouter } from 'next/router'

const useLocale = () => {
  const { locale, defaultLocale } = useRouter()

  return locale || defaultLocale
}

export default useLocale
