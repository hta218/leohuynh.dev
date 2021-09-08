import SimpleAnalytics from './SimpleAnalytics'
import siteMetadata from '@/data/siteMetadata'

const isProduction = process.env.NODE_ENV === 'production'

const Analytics = () => {
  return <>{isProduction && siteMetadata.analytics.simpleAnalytics && <SimpleAnalytics />}</>
}

export default Analytics
