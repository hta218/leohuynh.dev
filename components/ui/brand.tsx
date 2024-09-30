import { Link } from '~/components/ui/link'
import Bash from '~/icons/bash.svg'
import CSS from '~/icons/css.svg'
import Exercism from '~/icons/exercism.svg'
import Git from '~/icons/git.svg'
import GitHub from '~/icons/github.svg'
import Goodreads from '~/icons/goodreads.svg'
import HeadlessUI from '~/icons/headlessui.svg'
import Hydrogen from '~/icons/hydrogen.svg'
import IMBb from '~/icons/imdb.svg'
import Java from '~/icons/java.svg'
import Javascript from '~/icons/javascript.svg'
import JWT from '~/icons/jsonwebtokens.svg'
import Koa from '~/icons/koa.svg'
import Liquid from '~/icons/liquid.svg'
import Markdown from '~/icons/markdown.svg'
import MongoDB from '~/icons/mongodb.svg'
import MySQL from '~/icons/mysql.svg'
import NextJS from '~/icons/nextjs.svg'
import Node from '~/icons/nodejs.svg'
import Npm from '~/icons/npm.svg'
import OpenAI from '~/icons/openai.svg'
import Picsum from '~/icons/picsum.svg'
import Prisma from '~/icons/prisma.svg'
import Pygame from '~/icons/pygame.svg'
import Python from '~/icons/python.svg'
import Railway from '~/icons/railway.svg'
import React from '~/icons/react.svg'
import Remix from '~/icons/remix.svg'
import RottenTomatoes from '~/icons/rottentomatoes.svg'
import SemanticUI from '~/icons/semanticui.svg'
import Shopify from '~/icons/shopify.svg'
import Spotify from '~/icons/spotify.svg'
import TailwindCSS from '~/icons/tailwind.svg'
import Turborepo from '~/icons/turborepo.svg'
import Typescript from '~/icons/typescript.svg'
import Umami from '~/icons/umami.svg'
import Vercel from '~/icons/vercel.svg'
import Webpack from '~/icons/webpack.svg'

export let BrandsMap = {
  React: {
    Icon: React,
    url: 'https://reactjs.org',
  },
  Goodreads: {
    Icon: Goodreads,
    url: 'https://www.goodreads.com/',
  },
  Remix: {
    Icon: Remix,
    url: 'https://remix.run',
  },
  Git: {
    Icon: Git,
    url: 'https://git-scm.com',
  },
  GitHub: {
    Icon: GitHub,
    url: 'https://github.com',
  },
  Javascript: {
    Icon: Javascript,
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
  },
  Typescript: {
    Icon: Typescript,
    url: 'https://www.typescriptlang.org',
  },
  Node: {
    Icon: Node,
    url: 'https://nodejs.org',
  },
  Npm: {
    Icon: Npm,
    url: 'https://www.npmjs.com',
  },
  Bash: {
    Icon: Bash,
    url: 'https://www.gnu.org/software/bash',
  },
  Liquid: {
    Icon: Liquid,
    url: 'https://shopify.dev/docs/api/liquid',
  },
  Markdown: {
    Icon: Markdown,
    url: 'https://www.markdownguide.org',
  },
  NextJS: {
    Icon: NextJS,
    url: 'https://nextjs.org',
  },
  TailwindCSS: {
    Icon: TailwindCSS,
    url: 'https://tailwindcss.com',
  },
  Prisma: {
    Icon: Prisma,
    url: 'https://www.prisma.io',
  },
  Umami: {
    Icon: Umami,
    url: 'https://umami.is',
  },
  Vercel: {
    Icon: Vercel,
    url: 'https://vercel.com',
  },
  Railway: {
    Icon: Railway,
    url: 'https://railway.app',
  },
  Spotify: {
    Icon: Spotify,
    url: 'https://spotify.com',
  },
  OpenAI: {
    Icon: OpenAI,
    url: 'https://openai.com',
  },
  Turborepo: {
    Icon: Turborepo,
    url: 'https://turborepo.org',
  },
  Hydrogen: {
    Icon: Hydrogen,
    url: 'https://hydrogen.shopify.dev/',
  },
  Shopify: {
    Icon: Shopify,
    url: 'https://shopify.dev',
  },
  Polaris: {
    Icon: Shopify,
    url: 'https://polaris.shopify.com/',
  },
  ThemeKit: {
    Icon: Shopify,
    url: 'https://shopify.dev/docs/storefronts/themes/tools/theme-kit',
  },
  HeadlessUI: {
    Icon: HeadlessUI,
    url: 'https://headlessui.dev',
  },
  Webpack: {
    Icon: Webpack,
    url: 'https://webpack.js.org',
  },
  KoaJS: {
    Icon: Koa,
    url: 'https://koajs.com',
  },
  JWT: {
    Icon: JWT,
    url: 'https://jwt.io',
  },
  MongoDB: {
    Icon: MongoDB,
    url: 'https://www.mongodb.com',
  },
  CSS: {
    Icon: CSS,
    url: 'https://www.w3.org/Style/CSS/',
  },
  Python: {
    Icon: Python,
    url: 'https://www.python.org',
  },
  Pygame: {
    Icon: Pygame,
    url: 'https://www.pygame.org',
  },
  Exercism: {
    Icon: Exercism,
    url: 'https://exercism.org',
  },
  SemanticUI: {
    Icon: SemanticUI,
    url: 'https://semantic-ui.com',
  },
  Picsum: {
    Icon: Picsum,
    url: 'https://picsum.photos',
  },
  Java: {
    Icon: Java,
    url: 'https://java.com',
  },
  MySQL: {
    Icon: MySQL,
    url: 'https://mysql.com',
  },
  RottenTomatoes: {
    Icon: RottenTomatoes,
    url: 'https://www.rottentomatoes.com/',
  },
  IMBb: {
    Icon: IMBb,
    url: 'https://www.imdb.com/',
  },
}

export function Brand(props: {
  name: keyof typeof BrandsMap
  as?: 'link' | 'icon'
  className?: string
  iconClassName?: string
}) {
  let { name, as = 'link', className, iconClassName } = props
  let { Icon, url } = BrandsMap[name] || {}

  if (!Icon) return <span>Missing brand icon for {name}</span>

  if (as === 'icon') {
    return <Icon className={className} fill="currentColor" />
  }

  return (
    <Link href={`${url}?ref=leohuynh.dev`} className={className}>
      <Icon className={iconClassName} fill="currentColor" />
    </Link>
  )
}
