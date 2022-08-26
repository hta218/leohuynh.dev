import { siteMetadata } from '~/data'

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString(siteMetadata.locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
