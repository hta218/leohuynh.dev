import { LOCALES } from '~/constant'

export function getLocale(code: string) {
  return LOCALES.find((locale) => locale.code === code)
}
