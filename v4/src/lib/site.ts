/**
 * Non-secret site metadata, ported subset of legacy `data/site-metadata.ts`.
 * Secrets (analytics IDs, tokens) are read from env at runtime — never hardcoded here.
 */
export const SITE = {
  title: `Leo's dev blog – stories, insights, and ideas`,
  author: 'Leo Huynh',
  headerTitle: `Leo's dev blog`,
  description:
    'A personal space on the cloud where I document my programming journey, sharing lessons, insights, and resources for fellow developers.',
  language: 'en-us',
  locale: 'en-US',
  siteUrl: 'https://www.leohuynh.dev',
  siteRepo: 'https://github.com/hta218/leohuynh.dev',
  email: 'contact@leohuynh.dev',
  github: 'https://github.com/hta218',
  x: 'https://x.com/hta218_',
  linkedin: 'https://www.linkedin.com/in/hta218',
  facebook: 'https://facebook.com/hta218',
  youtube: 'https://www.youtube.com/@hta218_',
  threads: 'https://www.threads.net/hta218_',
  instagram: 'https://www.instagram.com/hta218_',
  goodreadsBookshelfUrl:
    'https://www.goodreads.com/review/list/179720035-leo-huynh',
  imdbRatingsList: 'https://www.imdb.com/user/ur154483197/ratings/?view=grid',
  // OG/Twitter fallback banner generated from the current profile photo.
  socialBanner: '/static/images/og.jpg',
  analytics: {
    umamiShareUrl:
      'https://analytics.leohuynh.dev/share/c9ErglxqzY5CQJ8g/leohuynh.dev',
  },
} as const

/** Support/donation links — parity with legacy `site-metadata.support`. */
export const SUPPORT = {
  buyMeACoffee: 'https://www.buymeacoffee.com/leohuynh.dev',
  paypal: 'https://paypal.me/hta218?country.x=VN&locale.x=en_US',
  kofi: 'https://ko-fi.com/hta218',
} as const

/** Career timeline shown on `/about`, ported from `data/authors/default.mdx`. */
export const CAREER = [
  {
    role: 'CTO / Co-Founder / Software Engineer',
    org: 'Weaverse',
    url: 'https://weaverse.io/',
    period: 'Mar 2022 - now',
    notes: [
      'Building a headless eCommerce platform to help creators build high quality, high performance online stores easily.',
    ],
  },
  {
    role: 'Shopify Engineer',
    org: 'FoxEcom',
    url: 'https://foxecom.com/',
    period: 'May 2021 - Feb 2022',
    notes: [
      'Built Minimog — the next-generation Shopify theme (weekly bestseller, top trending in eCommerce).',
      'Built the Fox Kit Shopify app — upsell and conversion tools supporting Minimog.',
    ],
  },
  {
    role: 'Frontend Engineer',
    org: 'Coc Coc',
    url: 'https://coccoc.com/',
    period: 'May 2020 - Apr 2021',
    notes: [
      'Worked on the #1 web browser in Vietnam with 25M+ users.',
      "Built Coc Coc's newsfeed and optimized the new-tab widgets and performance.",
    ],
  },
  {
    role: 'Fullstack Developer',
    org: 'BraveBits',
    url: 'https://bravebits.co/',
    period: 'Aug 2018 - Apr 2020',
    notes: [
      "Built PageFly's analytics APIs and Slider-x.",
      'Helped bring PageFly into the top 3 page builder apps on Shopify.',
    ],
  },
  {
    role: 'Instructor and Developer',
    org: 'MindX - Technology School',
    url: 'https://mindx.edu.vn/',
    period: 'May 2017 - Jul 2018',
    notes: [
      'Built Love of Knowledge, Room Finder, and Travel Egypt (a pygame puzzle).',
      'Mentored Python fundamentals and web development for newcomers.',
    ],
  },
  {
    role: 'Electronics & Telecommunications',
    org: 'Hanoi University of Science and Technology',
    url: 'https://www.hust.edu.vn/',
    period: 'Sep 2013 - Feb 2019',
    notes: ['Graduated with a good degree after 5 years at HUST.'],
  },
] as const

/** Blog list pagination size — parity with legacy `utils/const.ts`. */
export const POSTS_PER_PAGE = 9

export const NAV_LINKS = [
  { href: '/blog', title: 'Blog' },
  { href: '/snippets', title: 'Snippets' },
  { href: '/projects', title: 'Projects' },
  { href: '/about', title: 'About' },
] as const

export const MORE_LINKS = [
  { href: '/books', title: 'Books' },
  { href: '/movies', title: 'Movies' },
  { href: '/tags', title: 'Tags' },
  { href: SITE.analytics.umamiShareUrl, title: 'Analytics' },
] as const
