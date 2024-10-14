import Script from 'next/script.js'

interface UmamiAnalyticsProps {
  websiteId?: string
  src?: string
}

export function UmamiAnalytics({ websiteId, src = '/stats/script.js' }: UmamiAnalyticsProps) {
  if (websiteId) {
    return <Script async defer data-website-id={websiteId} src={src} />
  }
  return null
}
