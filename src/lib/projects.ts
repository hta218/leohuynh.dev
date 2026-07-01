/**
 * Projects shown on `/projects`, ported from the legacy `data/projects.ts`.
 * `work` = professional/commercial, `self` = personal/open-source.
 * Image paths resolve against the symlinked `/static` assets.
 */
export interface ProjectLink {
  title: string
  url: string
}

/**
 * Contextual HugeIcon used when a project has no real brand logo, instead of a
 * generic icons8 stock image. Must be a subset of HugeIcon's `IconName`.
 */
export type ProjectIcon =
  | 'analytics'
  | 'bell'
  | 'book'
  | 'code'
  | 'gallery'
  | 'globe'
  | 'keyboard'
  | 'land-plot'
  | 'puzzle'
  | 'refresh'
  | 'robot'
  | 'rocket'
  | 'store'
  | 'tag'

export interface Project {
  type: 'work' | 'self'
  title: string
  description?: string
  /** Real brand logo. Omit when there's no genuine logo — use `icon` instead. */
  imgSrc?: string
  /** Fallback HugeIcon shown when `imgSrc` is absent. */
  icon?: ProjectIcon
  url?: string
  /** `owner/name` GitHub repo, rendered as a github.com link. */
  repo?: string
  builtWith: string[]
  links?: ProjectLink[]
}

export const PROJECTS: Project[] = [
  {
    type: 'work',
    title: 'Weaverse Hydrogen Studio',
    description:
      'The visual page builder & headless CMS dedicated for Shopify Hydrogen. Weaverse lets you design and ship enterprise-grade storefronts in minutes.',
    imgSrc: '/static/images/weaverse-logo.png',
    url: 'https://www.weaverse.io?ref=leohuynh.dev',
    builtWith: ['Shopify', 'Hydrogen', 'Remix', 'TailwindCSS', 'OpenAI'],
    links: [
      { title: 'Website', url: 'https://www.weaverse.io?ref=leohuynh.dev' },
      { title: 'GitHub Org', url: 'https://github.com/Weaverse' },
    ],
  },
  {
    type: 'work',
    title: 'Weaverse SDKs',
    description:
      'Open-source SDKs / toolkit for seamless integration and development of Shopify Hydrogen themes and headless commerce solutions.',
    imgSrc: '/static/images/weaverse-logo.png',
    repo: 'Weaverse/weaverse',
    builtWith: ['Turborepo', 'Hydrogen', 'React', 'Typescript'],
  },
  {
    type: 'work',
    title: 'Pilot - Shopify Hydrogen theme',
    description:
      'A fully-featured Shopify Hydrogen theme crafted to help you launch modern, high-performing headless storefronts in minutes.',
    icon: 'land-plot',
    repo: 'Weaverse/pilot',
    url: 'https://pilot.weaverse.io/',
    builtWith: ['Hydrogen', 'Remix', 'TailwindCSS', 'HeadlessUI'],
  },
  {
    type: 'work',
    title: 'Weaverse Agents Toolkit',
    description:
      'Agents, skills, commands, and rules for AI-powered coding tools — used daily to supercharge development productivity.',
    icon: 'robot',
    repo: 'Weaverse/.agents',
    builtWith: ['Claude', 'Markdown', 'Bash'],
  },
  {
    type: 'work',
    title: 'Shopify Hydrogen Skills',
    description:
      'Dedicated agent skills for building, upgrading, and maintaining Shopify Hydrogen storefronts — works with Claude, Cursor, Copilot, and more.',
    icon: 'book',
    repo: 'Weaverse/shopify-hydrogen-skills',
    builtWith: ['Claude', 'Hydrogen', 'Markdown', 'Typescript'],
  },
  {
    type: 'work',
    title: 'Minimog - Next-gen Shopify theme',
    description:
      'The Next Generation of highest-converting and extensible Shopify theme (Weekly bestseller & Top trending in Themeforest eCommerce category).',
    icon: 'store',
    url: 'https://themeforest.net/item/minimog-the-high-converting-shopify-theme/33380968?ref=leohuynh.dev',
    builtWith: ['ThemeKit', 'Liquid', 'Webpack', 'TailwindCSS'],
    links: [
      { title: 'Demo site', url: 'https://demo.minimog.co' },
      {
        title: 'Envato item',
        url: 'https://themeforest.net/item/minimog-the-high-converting-shopify-theme/33380968',
      },
    ],
  },
  {
    type: 'work',
    title: 'FoxKit AIO Upsell Cross‑sell',
    description:
      'The upsells and boost conversion tools that is built to support Minimog theme.',
    icon: 'tag',
    url: 'https://apps.shopify.com/foxkit?ref=leohuynh.dev',
    builtWith: ['KoaJS', 'JWT', 'MongoDB', 'Polaris'],
    links: [
      { title: 'App store', url: 'https://apps.shopify.com/foxkit' },
      {
        title: 'Product site',
        url: 'https://foxecom.com/products/foxkit-shopify-app',
      },
    ],
  },
  {
    type: 'self',
    title: 'leohuynh.dev',
    icon: 'globe',
    repo: 'hta218/leohuynh.dev',
    builtWith: ['NextJS', 'TailwindCSS', 'Typescript', 'Drizzle', 'Umami'],
  },
  {
    type: 'self',
    title: 'AI Agents Notifier',
    description:
      'Send system notifications when your CLI-based AI coding agents request permissions or complete tasks.',
    icon: 'bell',
    repo: 'hta218/ai-agents-notifier',
    builtWith: ['Shell', 'Claude', 'Bash'],
  },
  {
    type: 'self',
    title: 'Shopify theme starter',
    icon: 'code',
    repo: 'hta218/shopify-theme-starter',
    builtWith: ['ThemeKit', 'Liquid', 'Webpack', 'TailwindCSS'],
  },
  {
    type: 'self',
    title: 'Exercism solutions',
    icon: 'analytics',
    repo: 'hta218/exercism-solutions',
    builtWith: ['Exercism', 'Javascript', 'Bash'],
  },
  {
    type: 'self',
    title: 'Animate loading bar',
    description:
      '1kb loading bar like Shopify, Github, JSFiddle… that just works.',
    icon: 'refresh',
    repo: 'Weaverse/animate-loading',
    builtWith: ['Typescript', 'CSS'],
  },
  {
    type: 'self',
    title: 'Shopify KoaJS React boilerplate',
    icon: 'code',
    repo: 'hta218/shopify-koajs-react-boilerplate',
    builtWith: ['KoaJS', 'JWT', 'MongoDB', 'Polaris'],
  },
  {
    type: 'self',
    title: 'Travel Egypt',
    description:
      'A sliding-picture puzzle — rebuild each scene and meet the gods of Egypt. Ported from my old Python + Pygame game to a browser game you can play right here.',
    icon: 'puzzle',
    url: '/arcade/travel-egypt',
    builtWith: ['Typescript', 'React', 'Astro'],
    links: [
      { title: 'Play', url: '/arcade/travel-egypt' },
      { title: 'Source', url: 'https://github.com/hta218/Travel_Egypt' },
    ],
  },
  {
    type: 'self',
    title: 'Infinite Loading Gallery',
    icon: 'gallery',
    repo: 'hta218/infinite-gallery',
    builtWith: ['React', 'SemanticUI', 'Picsum'],
  },
  {
    type: 'self',
    title: 'Store Manager',
    icon: 'store',
    repo: 'hta218/StoreManager',
    builtWith: ['Java', 'MySQL'],
  },
  {
    type: 'self',
    title: 'Dotfiles',
    description: 'My personal macOS development configuration files.',
    icon: 'keyboard',
    repo: 'hta218/dotfiles',
    builtWith: ['Shell', 'Bash'],
  },
]
