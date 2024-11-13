import type { Author } from 'contentlayer/generated'
import type { ReactNode } from 'react'
import { CareerTimeline } from '~/components/author/career'
import { SocialAccounts } from '~/components/author/social-accounts'
import { ProfileCard } from '~/components/cards/profile'
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
      <div className="py-8 md:grid md:grid-cols-3">
        <div className="pr-4">
          <ProfileCard />
        </div>
        <div className="md:col-span-2 md:pl-12 xl:pl-16">
          <div className="prose prose-lg dark:prose-invert">
            <div>
              <h2 className="mt-0">
                Hi there <Twemoji emoji="waving-hand" />
              </h2>
              <p>
                I'm <strong>Tuan Anh Huynh</strong> (alias <strong>Leo</strong> at work), a software
                engineer from <strong>Vietnam</strong>. I have a passion for all things{' '}
                <strong>Javascript</strong>. I enjoy building eCommerce software and stuff related
                to web dev. I work mainly with <strong>Typescript</strong>, <strong>React</strong>,{' '}
                <strong>NodeJS</strong>, <strong>Remix</strong>, and <strong>TailwindCSS</strong>.
              </p>
              <p>
                This blog serves as a journal for documenting and sharing the insights and knowledge
                I've gained as a software engineer. Building, writing, and sharing things is a great
                way for me to solidify my understanding of new concepts and ideas.
              </p>
              <p>
                I would greatly appreciate any comments and thoughts on my posts{' '}
                <Twemoji emoji="clinking-beer-mugs" />.
              </p>
            </div>
            <div>
              <div className="mb-[1em] mt-[2em] flex items-center justify-between [&>h2]:my-0">
                <h2>My career</h2>
                <Button as="a" href="/static/resume.pdf" target="_blank">
                  <span>Resume</span>
                  <Twemoji emoji="page-facing-up" />
                </Button>
              </div>
              <CareerTimeline />
            </div>
            <div>
              <h2>Tech stack</h2>
              <p>
                This blog is hosted on{' '}
                <a href="https://vercel.com/" target="_blank">
                  Vercel
                </a>
                , built with{' '}
                <a href="https://nextjs.org/" target="_blank">
                  Next.js
                </a>{' '}
                and{' '}
                <a href="https://tailwindcss.com/" target="_blank">
                  Tailwind CSS
                </a>{' '}
                using <strong>Tailwind Nextjs Starter Blog</strong>.
              </p>
              <p>
                A huge thanks to{' '}
                <a href="https://twitter.com/timlrxx" target="_blank">
                  Timothy Lin
                </a>{' '}
                for the minimal, lightweight, and super easy-to-customize blog starter.
              </p>
              <p>A few major over-engineering-changes from the original repo:</p>
              <ul>
                <li>
                  <Twemoji emoji="atom-symbol" /> Upgrading to <strong>React v18</strong>,{' '}
                  <strong>Next v14</strong>
                  (Using App router)
                </li>
                <li>
                  <Twemoji emoji="party-popper" /> Adopting <strong>Typescript</strong>, committing
                  with{' '}
                  <a href="https://www.conventionalcommits.org/" target="_blank">
                    Conventional Commits
                  </a>
                </li>
                <li>
                  <Twemoji emoji="bar-chart" /> Monitoring site with{' '}
                  <a href="https://umami.is/" target="_blank">
                    Umami
                  </a>{' '}
                  website analytics
                </li>
                <li>
                  <Twemoji emoji="eyes" /> Theming in dark mode with{' '}
                  <a
                    href="https://github.blog/changelog/2021-04-14-dark-and-dimmed-themes-are-now-generally-available/"
                    target="_blank"
                  >
                    Github dark dimmed
                  </a>{' '}
                  colors for better contrast
                </li>
                <li>
                  <Twemoji emoji="man-technologist" /> Making a lot of changes to the UI, new
                  homepage design, adding <code>ProfileCard</code>, <code>CareerTimeline</code>{' '}
                  components, adding <code>/snippets</code>, <code>/books</code>,{' '}
                  <code>/movies</code> page, etc.
                </li>
                {/* <li>
                  <Twemoji emoji="inbox-tray" /> Bumping up <code>mdx-bundler</code>,{' '}
                  <code>rehype</code>/<code>remark</code> plugins and dependencies to the latest
                  version
                </li> */}
              </ul>
              <p>
                See my{' '}
                <a href="https://github.com/hta218/leohuynh.dev" target="_blank">
                  Github repository
                </a>{' '}
                for this blog.
              </p>
              <div>
                <h3>Legacy versions</h3>
                <p>I started this blog since 2019 and up until now it has 2 legacy versions:</p>
                <ul>
                  <li>
                    <code>v1</code> built with <strong>NextJS v13</strong> using Page router:{' '}
                    <a
                      href="https://leohuynhdev-git-v1-leo-huynhs-projects.vercel.app/"
                      target="_blank"
                    >
                      https://leohuynhdev-git-v1-leo-huynhs-projects.vercel.app/
                    </a>
                  </li>
                  <li>
                    <code>v0</code> built with <strong>Gatsby</strong>:{' '}
                    <a href="https://leo-blog-legacy.vercel.app/" target="_blank">
                      https://leo-blog-legacy.vercel.app/
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <h2>Assets</h2>
              <p>
                Most of the images in my blog are from{' '}
                <a href="https://unsplash.com/" target="_blank">
                  Unsplash
                </a>
                , gifs from{' '}
                <a href="https://giphy.com/" target="_blank">
                  GIPHY
                </a>
                , and illustrations are from{' '}
                <a href="https://storyset.com/" target="_blank">
                  Storyset
                </a>
                .
              </p>
              <p>
                Thanks for the free resources <Twemoji emoji="folded-hands" />.
              </p>
            </div>
            <div>
              <h2>Contact</h2>
              <p>
                Reach out to me at{' '}
                <a href={`mailto:${SITE_METADATA.email}`}>{SITE_METADATA.email}</a> or find me on
                social media:
              </p>
              <SocialAccounts />
            </div>
            <div>
              <h2>Support</h2>
              <p>If you appreciate my work, consider supporting me:</p>
              <div className="flex flex-col gap-4">
                <a
                  href={SITE_METADATA.support.buyMeACoffee}
                  target="_blank"
                  className="[&_.image-container]:mx-0"
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
                  href={SITE_METADATA.support.paypal}
                  target="_blank"
                  className="flex h-15 w-[214px] items-center rounded-lg bg-[#009cde]/70 p-1"
                >
                  <Image
                    src="/static/images/paypal-logo.png"
                    alt="Donate via PayPal"
                    width={225.88}
                    height={60}
                    style={{ height: 30, width: 'auto' }}
                  />
                </a>
                <a
                  href={SITE_METADATA.support.kofi}
                  target="_blank"
                  className="[&_.image-container]:mx-0"
                >
                  <Image
                    src="/static/images/kofi.png"
                    alt="Support me on Ko-fi"
                    width={297}
                    height={60}
                    style={{ height: 60, width: 'auto' }}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
