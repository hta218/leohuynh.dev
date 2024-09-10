'use client'

import Container from '@/components/Container'
import { BlogLinks } from '@/components/homepage/BlogLinks'
import { Greeting } from '@/components/homepage/Greeting'
import { Heading } from '@/components/homepage/Heading'
import { ShortDescription } from '@/components/homepage/ShortDescription'
import { TypedBios } from '@/components/homepage/TypedBios'
import { ProfileCard } from '@/components/ProfileCard'
import Twemoji from '@/components/Twemoji'
import siteMetadata from '@/data/siteMetadata'
import NewsletterForm from 'pliny/ui/NewsletterForm'
import { LatestPosts } from '~/components/homepage/LatestPosts'

export default function Home({ posts }) {
  return (
    <Container as="div">
      <div className="mt-8 divide-y divide-gray-200 dark:divide-gray-700 md:mt-16">
        <div className="space-y-2 md:my-4 md:space-y-5 md:pb-8 md:pt-6 xl:grid xl:grid-cols-3">
          <div className="space-y-6 md:space-y-8 md:pr-8 xl:col-span-2">
            <Greeting />
            <div className="text-base leading-7 text-gray-600 dark:text-gray-400 md:text-lg md:leading-8">
              <Heading />
              <TypedBios />
              <ShortDescription />
              <BlogLinks />
              <p className="my-8 flex">
                <span className="mr-2">Happy reading</span>
                <Twemoji emoji="clinking-beer-mugs" />
              </p>
            </div>
          </div>
          <div className="hidden xl:block">
            <ProfileCard />
          </div>
        </div>
      </div>
      <LatestPosts posts={posts} />
      {siteMetadata.newsletter?.provider && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )}
    </Container>
  )
}
