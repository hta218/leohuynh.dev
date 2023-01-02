import { siteMetadata } from '~/data/siteMetadata'
import { GAScript } from './GoogleAnalytics'
import { SimpleAnalyticsScript } from './SimpleAnalytics'
import { UmamiScript } from './Umami'

let isProduction = process.env.NODE_ENV === 'production'

export function Analytics() {
  if (isProduction) {
    let { analytics } = siteMetadata
    let { simpleAnalytics, umamiWebsiteId, googleAnalyticsId } = analytics
    return (
      <>
        {simpleAnalytics && <SimpleAnalyticsScript />}
        {umamiWebsiteId && <UmamiScript />}
        {googleAnalyticsId && <GAScript />}
      </>
    )
  }
  return null
}
