import type { Blog, Snippet } from '~/.contentlayer/generated'
import { ProfileCard } from '~/components/cards/profile'
import { Container } from '~/components/ui/container'
import { Twemoji } from '~/components/ui/twemoji'
import type { CoreContent } from '~/types/data'
import { ActivitiesFeed } from './activities/feed'
import { Greeting } from './greeting'
import { Intro } from './intro'
import { LatestPosts } from './latest-posts'
import { BlogLinks } from './links'
import { TypedBios } from './typed-bios'

export function Home({
  posts,
  snippets,
}: {
  posts: CoreContent<Blog>[]
  snippets: CoreContent<Snippet>[]
}) {
  return (
    <Container as="div" className="space-y-6 pt-4 md:space-y-24 lg:pt-12">
      <div className="pt-6 xl:grid xl:grid-cols-3">
        <div className="space-y-4 md:space-y-6 md:pr-8 xl:col-span-2">
          <Greeting />
          <div className="text-base leading-7 text-gray-600 md:text-lg md:leading-8 dark:text-gray-400">
            <Intro />
            <TypedBios />
            <div className="mt-4 mb-6 md:mb-8">
              <p>
                I started learning to code in 2016 and have been hooked ever
                since.
              </p>
              <p>I landed my first job as a Python coding mentor in 2017.</p>
              <p>I have a passion for JS/TS, web dev, and eCommerce.</p>
              <p>
                I started this blog to document and share my knowledge &
                experience.
              </p>
            </div>
            <BlogLinks />
            <p className="my-6 flex md:my-8">
              <span className="mr-2">Happy reading</span>
              <Twemoji emoji="clinking-beer-mugs" />
            </p>
          </div>
        </div>
        <div className="hidden pt-8 pl-4 xl:block">
          <ProfileCard />
        </div>
      </div>
      <LatestPosts posts={posts} snippets={snippets} />
      <ActivitiesFeed />
      {/* {SITE_METADATA.newsletter?.provider && (
        <div className="flex items-center justify-center py-4 lg:py-10">
          <NewsletterForm />
        </div>
      )} */}
    </Container>
  )
}
