import type { Author } from 'contentlayer/generated'
import type { ReactNode } from 'react'
import Button from '~/components/button'
import CareerTimeline from '~/components/career'
import Container from '~/components/Container'
import { PageHeader } from '~/components/page-header'
import { ProfileCard } from '~/components/ProfileCard'
import SocialAccounts from '~/components/social-accounts'
import Twemoji from '~/components/Twemoji'

interface Props {
  children?: ReactNode
  content: Omit<Author, '_id' | '_raw' | 'body'>
}

export function AuthorLayout({ children }: Props) {
  return (
    <Container className="pt-4 lg:pt-12">
      <PageHeader
        title="About"
        description="More about me and this blog."
        className="border-b border-gray-200 dark:border-gray-700"
      />
      <div className="py-8 md:grid md:grid-cols-3">
        <div>
          <ProfileCard />
        </div>
        <div className="md:col-span-2 md:pl-12 xl:pl-24">
          <div className="prose prose-lg dark:prose-invert">
            <div>
              <h2 className="mt-0">
                Hi there <Twemoji emoji="waving hand" />
              </h2>
              <p>
                I'm <strong>Tuan Anh Huynh</strong> (alias Leo at work), a software engineer from{' '}
                <strong>Vietnam</strong>. I have a passion for all things{' '}
                <strong>Javascript</strong>. I enjoy building eCommerce software and stuff related
                to web dev. I work mainly with <strong>Typescript</strong>, <strong>React</strong>,{' '}
                <strong>NodeJS</strong>, <strong>Remix</strong>, and <strong>TailwindCSS</strong>.
              </p>
              <p>
                I started this blog as a way to document and share stuff I have learned and found
                useful as a software engineer. Building and writing things down is a great way for
                me to solidify my understanding of new concepts and ideas. I hope my blog could be a
                helpful resource for fellow devs who interested in web dev, eCommerce, and related
                technologies.
              </p>
              <p>
                I would be highly appreciated if you could leave your comments and thoughts on what
                I have written <Twemoji emoji="clinking-beer-mugs" />.
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
                  components, adding <code>/snippets</code>, <code>/resume</code> page, etc.
                </li>
                <li>
                  <Twemoji emoji="inbox-tray" /> Bumping up <code>mdx-bundler</code>,{' '}
                  <code>rehype</code>/<code>remark</code> plugins and dependencies to the latest
                  version
                </li>
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
                    <a href="https://leo-blog-v1.vercel.app/" target="_blank">
                      https://leo-blog-v1.vercel.app/
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
              <SocialAccounts />
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
