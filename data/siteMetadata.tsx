export let siteMetadata = {
  title: 'IT Dad',
  author: 'Bradley Wright',
  fullName: 'Bradley Wright',
  headerTitle: 'IT Dad',
  footerTitle: 'IT Dad',
  description: 'A site about Information Technolgy and being a dad.',
  language: 'en-us',
  theme: 'system', // system, dark or light
  siteUrl: 'https://itdad.life',
  siteRepo: 'https://https://github.com/wrightbradley/itdad',
  siteLogo: '/static/images/logo.svg',
  image: '/static/images/avatar.jpg',
  socialBanner: '/static/images/twitter-card.png',
  email: 'bradley@itdad.life',
  github: 'https://github.com/wrightbradley',
  twitter: 'https://twitter.com/itdadlife',
  // facebook: 'https://facebook.com',
  // youtube: 'https://youtube.com',
  linkedin: 'https://www.linkedin.com/in/wrightbradley',
  locale: 'en-US',
  analytics: {
    // If you want to use an analytics provider you have to add it to the
    // content security policy in the `next.config.js` file.
    // supports plausible, simpleAnalytics, umami or googleAnalytics
    plausibleDataDomain: 'itdad.life',
    simpleAnalytics: false, // true or false
    umamiWebsiteId: '', // e.g. 123e4567-e89b-12d3-a456-426614174000
    googleAnalyticsId: '', // e.g. UA-000000-2 or G-XXXXXXX
    vercelAnalytics: true,
  },
  socialAccounts: {
    github: 'wrightbradley',
    twitter: 'itdad',
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
