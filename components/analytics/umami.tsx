import Script from 'next/script.js'

export function UmamiAnalytics({
  umamiWebsiteId,
  src = 'https://analytics.umami.is/script.js',
}: {
  umamiWebsiteId: string
  src?: string
}) {
  return <Script async defer data-website-id={umamiWebsiteId} src={src} />
}
