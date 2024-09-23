import Container from '@/components/Container'
import { BlogLinks } from '~/components/home-page/BlogLinks'
import { Greeting } from '~/components/home-page/Greeting'
import { Heading } from '~/components/home-page/Heading'
import { ShortDescription } from '~/components/home-page/ShortDescription'
import { TypedBios } from '~/components/home-page/TypedBios'
import { ProfileCard } from '~/components/cards/profile'
import Twemoji from '@/components/Twemoji'
import NewsletterForm from 'pliny/ui/NewsletterForm'
import { LatestPosts } from '~/components/home-page/LatestPosts'
import type { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from '~/.contentlayer/generated'

export function Home({ posts }: { posts: CoreContent<Blog>[] }) {
  return (
    <Container as="div" className="pt-4 lg:pt-12">
      <div className="py-6 md:pb-8 xl:grid xl:grid-cols-3">
        <div className="space-y-4 md:space-y-6 md:pr-8 xl:col-span-2">
          <Greeting />
          <div className="text-base leading-7 text-gray-600 dark:text-gray-400 md:text-lg md:leading-8">
            <Heading />
            <TypedBios />
            <ShortDescription />
            <BlogLinks />
            <p className="my-6 flex md:my-8">
              <span className="mr-2">Happy reading</span>
              <Twemoji emoji="clinking-beer-mugs" />
            </p>
          </div>
        </div>
        <div className="hidden pt-4 xl:block">
          <ProfileCard />
        </div>
      </div>
      <LatestPosts posts={posts} />
      {/* {siteMetadata.newsletter?.provider && (
        <div className="flex items-center justify-center py-4 lg:py-10">
          <NewsletterForm />
        </div>
      )} */}
    </Container>
  )
}
