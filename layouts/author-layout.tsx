import type { Author } from 'contentlayer/generated'
import type { ReactNode } from 'react'
import { CareerTimeline } from '~/components/author/career'
import { SocialAccounts } from '~/components/author/social-accounts'
import { Button } from '~/components/ui/button'
import { Container } from '~/components/ui/container'
import { Image } from '~/components/ui/image'
import { PageHeader } from '~/components/ui/page-header'
import { Twemoji } from '~/components/ui/twemoji'
import { SITE_METADATA } from '~/data/site-metadata'

interface Props {
  children?: ReactNode
  content: Omit<Author, '_id' | '_raw' | 'body'>
}

export function AuthorLayout({ children }: Props) {
  return (
    <Container className="pt-4 lg:pt-12">
      <PageHeader
        title="About"
        description="A bit of background on who I am, what I do, and why I started this blog. Nothing too serious, just a little intro to the person typing away behind the scenes."
        className="border-b border-gray-200 dark:border-gray-700"
      />
      <div className="py-8">
        <div className="prose prose-lg max-w-full dark:prose-invert">
          {/* About Me Section */}
          <section>
            <h2 className="mt-0">About Me</h2>
            <div>
              <h3 className="mt-0">
                Hi there <Twemoji emoji="waving-hand" />
              </h3>
              <p>
                I'm <strong>Tuan Anh Huynh</strong> (alias <strong>Leo</strong>{' '}
                at work), a software engineer from <strong>Vietnam</strong>. I
                have a passion for all things <strong>Javascript</strong>. I
                enjoy building eCommerce software and stuff related to web dev.
                I work mainly with <strong>Typescript</strong>,{' '}
                <strong>React</strong>, <strong>NodeJS</strong>,{' '}
                <strong>Remix</strong>, and <strong>TailwindCSS</strong>.
              </p>
              {/* <p>
                I would greatly appreciate any comments and thoughts on my posts{' '}
                <Twemoji emoji="clinking-beer-mugs" />.
              </p> */}
            </div>
            <div>
              <div className="mt-[2em] mb-[1em] flex items-center justify-between [&>h3]:my-0">
                <h3>My career</h3>
                <Button as="a" href="/static/resume.pdf" target="_blank">
                  <span style={{ color: 'white' }}>Resume</span>
                  <Twemoji emoji="page-facing-up" />
                </Button>
              </div>
              <CareerTimeline />
            </div>
            <div>
              <h3>Contact</h3>
              <p>
                Reach out to me at{' '}
                <a href={`mailto:${SITE_METADATA.email}`}>
                  {SITE_METADATA.email}
                </a>{' '}
                or find me on social media:
              </p>
              <SocialAccounts />
            </div>
            <div>
              <h3>Support</h3>
              <p>If you appreciate my work, consider supporting me:</p>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={SITE_METADATA.support.buyMeACoffee}
                  target="_blank"
                  className="[&_.image-container]:mx-0"
                  rel="noreferrer"
                >
                  <Image
                    src="/static/images/bmc-button.png"
                    alt="Buy Me A Coffee"
                    width={213.7}
                    height={60}
                    style={{ height: 60 }}
                  />
                </a>
                <a
                  href={SITE_METADATA.support.kofi}
                  target="_blank"
                  className="[&_.image-container]:mx-0"
                  rel="noreferrer"
                >
                  <Image
                    src="/static/images/kofi.png"
                    alt="Support me on Ko-fi"
                    width={297}
                    height={60}
                    style={{ height: 60, width: 'auto' }}
                  />
                </a>
                <a
                  href={SITE_METADATA.support.paypal}
                  target="_blank"
                  className="flex h-15 w-[214px] items-center rounded-lg bg-[#009cde]/70 p-1"
                  rel="noreferrer"
                >
                  <Image
                    src="/static/images/paypal-logo.png"
                    alt="Donate via PayPal"
                    width={225.88}
                    height={60}
                    style={{ height: 30, width: 'auto' }}
                  />
                </a>
              </div>
            </div>
          </section>

          {/* About This Blog Section */}
          <section className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
            <h2 className="mt-0">About This Blog</h2>
            <div>
              <h3>Motivation</h3>
              <blockquote>
                <p>Sharing is learning!</p>
              </blockquote>
              <p>
                This blog serves as a journal for documenting and sharing the
                insights and knowledge I've gained as a software engineer.
                Building, writing, and sharing things is a great way for me to
                solidify my understanding of new concepts and ideas.
              </p>
            </div>
            <div>
              <h3>Features</h3>
              <ul>
                <li>
                  <Twemoji emoji="atom-symbol" /> <strong>Next.js 15</strong>{' '}
                  (App Router) and <strong>React 19</strong>.
                </li>
                <li>
                  <Twemoji emoji="artist-palette" />{' '}
                  <strong>Tailwind CSS</strong> for styling.
                </li>
                <li>
                  <Twemoji emoji="safety-vest" /> <strong>TypeScript</strong>{' '}
                  for better type safety.
                </li>
                <li>
                  <Twemoji emoji="open-book" />{' '}
                  <a
                    href="https://contentlayer.dev/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Contentlayer
                  </a>{' '}
                  & MDX for blogs and snippets data.
                </li>
                <li>
                  <Twemoji emoji="bar-chart" /> Website analytics with{' '}
                  <a href="https://umami.is/" target="_blank" rel="noreferrer">
                    Umami
                  </a>
                  .
                </li>
                <li>
                  <Twemoji emoji="card-file-box" /> Database hosting on{' '}
                  <a
                    href="https://supabase.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Supabase
                  </a>
                  .
                </li>
                <li>
                  <Twemoji emoji="building-construction" /> Type-safe database
                  operations using{' '}
                  <a
                    href="https://orm.drizzle.team/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Drizzle ORM
                  </a>
                  .
                </li>
                <li>
                  <Twemoji emoji="hammer-and-wrench" /> Code linting and
                  formatting with{' '}
                  <a
                    href="https://biomejs.dev/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Biome
                  </a>
                  .
                </li>
                <li>
                  <Twemoji emoji="first-quarter-moon" /> Dark mode theme colors
                  with{' '}
                  <a
                    href="https://github.blog/changelog/2021-04-14-dark-and-dimmed-themes-are-now-generally-available/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub dark dimmed
                  </a>
                  .
                </li>
              </ul>
            </div>
            <div>
              <h3>Credits</h3>
              <p>
                This blog is hosted on{' '}
                <a href="https://vercel.com/" target="_blank" rel="noreferrer">
                  Vercel
                </a>
                , built with{' '}
                <a href="https://nextjs.org/" target="_blank" rel="noreferrer">
                  Next.js
                </a>{' '}
                and{' '}
                <a
                  href="https://tailwindcss.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Tailwind CSS
                </a>{' '}
                using <strong>Tailwind Nextjs Starter Blog</strong>.
              </p>
              <p>
                A huge thanks to{' '}
                <a
                  href="https://twitter.com/timlrxx"
                  target="_blank"
                  rel="noreferrer"
                >
                  Timothy Lin
                </a>{' '}
                for the minimal, lightweight, and super easy-to-customize blog
                starter.
              </p>
              <p>
                See my{' '}
                <a
                  href="https://github.com/hta218/leohuynh.dev"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub repository
                </a>{' '}
                for this blog.
              </p>
            </div>
            <div>
              <h3>Legacy versions</h3>
              <p>
                I started this blog since 2019 and up until now it has 2 legacy
                versions:
              </p>
              <ul>
                <li>
                  <code>v1</code> built with <strong>NextJS v13</strong> using
                  Page router:{' '}
                  <a
                    href="https://leohuynhdev-git-v1-leo-huynhs-projects.vercel.app/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    https://leohuynhdev-git-v1-leo-huynhs-projects.vercel.app/
                  </a>
                </li>
                <li>
                  <code>v0</code> built with <strong>Gatsby</strong>:{' '}
                  <a
                    href="https://leo-blog-legacy.vercel.app/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    https://leo-blog-legacy.vercel.app/
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3>Assets</h3>
              <p>
                Most of the images in my blog are from{' '}
                <a
                  href="https://unsplash.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Unsplash
                </a>
                , gifs from{' '}
                <a href="https://giphy.com/" target="_blank" rel="noreferrer">
                  GIPHY
                </a>
                , and illustrations are from{' '}
                <a
                  href="https://storyset.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Storyset
                </a>
                .
              </p>
              <p>
                Thanks for the free resources <Twemoji emoji="folded-hands" />.
              </p>
            </div>
          </section>
        </div>
      </div>
    </Container>
  )
}
