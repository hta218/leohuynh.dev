import Script from 'next/script'
import { siteMetadata } from '~/data/siteMetadata'

export function UmamiScript() {
  return (
    <Script
      async
      defer
      data-website-id={siteMetadata.analytics.umamiWebsiteId}
      src="https://blog-analytics-3lq49110l-hta218.vercel.app/umami.js"
    />
  )
}
