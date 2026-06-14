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
  // OG/Twitter fallback banner, parity with legacy `socialBanner`.
  socialBanner: '/static/images/twitter-card.jpeg',
} as const

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
] as const
