export let siteMetadata = {
  title: "Leo's blog - Leo's coding journey",
  author: 'Leo Huynh',
  fullName: 'Tuan Anh Huynh',
  headerTitle: "Leo's blog - Leo's coding journey",
  footerTitle: "Leo's blog - Leo's coding journey",
  description:
    "Leo's coding journey - work and life stories through the keyboard of an open-minded Software Engineer",
  language: 'en-us',
  siteUrl: 'https://www.leohuynh.dev',
  siteRepo: 'https://github.com/hta218/leohuynh.dev',
  siteLogo: '/static/images/logo.jpg',
  image: '/static/images/logo.jpg',
  socialBanner: '/static/images/logo.jpg',
  email: 'leohuynh@pm.me',
  github: 'https://github.com/hta218',
  twitter: 'https://twitter.com/hta218_',
  facebook: 'https://facebook.com/hta218',
  youtube: 'https://www.youtube.com/channel/UCHXjj6ewfDIjx_Op3hqijlg',
  linkedin: 'https://www.linkedin.com/in/hta218/',
  locale: 'en-US',
  /** Choose one of these Analytics providers */
  analytics: {
    plausibleDataDomain: '', // e.g. tailwind-nextjs-starter-blog.vercel.app
    simpleAnalytics: false, // true or false
    umamiWebsiteId: false, // e.g. 123e4567-e89b-12d3-a456-426614174000
    googleAnalyticsId: 'UA-164140501-1', // e.g. UA-000000-2 or G-XXXXXXX
  },
  socialAccounts: {
    github: 'hta218',
    twitter: 'hta218_',
  },
}

/**
 * Select a provider and use the environment variables associated to it
 * https://vercel.com/docs/environment-variables
 * --
 *
 * Visit each provider's documentation link and follow the instructions, then add the environment variable to your project.
 */
export let commentConfig = {
  provider: 'giscus', // 'giscus' | 'utterances' | 'disqus',
  giscusConfig: {
    // Ref: https://giscus.app/
    repo: '', // `process.env.GISCUS_REPO=`
    repositoryId: '', // `process.env.GISCUS_REPOSITORY_ID=`
    category: '', // `process.env.GISCUS_CATEGORY=`
    categoryId: '', // `process.env.GISCUS_CATEGORY_ID=`
    mapping: 'title',
    reactions: '1',
    metadata: '0',
    lightTheme: 'light',
    darkTheme: 'transparent_dark',
    themeURL: '',
  },
  utterancesConfig: {
    // Ref: https://utteranc.es/
    repo: '', // `process.env.UTTERANCES_REPO=`
    issueTerm: '',
    label: '',
    lightTheme: '',
    darkTheme: '',
  },
  disqus: {
    // https://help.disqus.com/en/articles/1717111-what-s-a-shortname
    shortname: '', // `process.env.DISQUS_SHORTNAME=`
  },
}
