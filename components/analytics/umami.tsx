import Script from 'next/script.js'

export function UmamiAnalytics({
  umamiWebsiteId,
  src = '/static/umami.js',
}: {
  umamiWebsiteId: string
  src?: string
}) {
  return <Script async defer data-website-id={umamiWebsiteId} src={src} />
}
