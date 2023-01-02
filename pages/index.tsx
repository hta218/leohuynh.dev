import { PageSeo } from 'components/SEO'
import { BlogLinks } from '~/components/homepage/BlogLinks'
import { FeaturedPosts } from '~/components/homepage/FeaturedPosts'
import { Greeting } from '~/components/homepage/Greeting'
import { Heading } from '~/components/homepage/Heading'
import { ShortDescription } from '~/components/homepage/ShortDescription'
import { TypedBios } from '~/components/homepage/TypedBios'
import { ProfileCard } from '~/components/ProfileCard'
import { Twemoji } from '~/components/Twemoji'
import { siteMetadata } from '~/data/siteMetadata'
import { getAllFilesFrontMatter } from '~/libs/mdx'
import type { BlogFrontMatter } from '~/types'

export function getStaticProps() {
  let posts = getAllFilesFrontMatter('blog')
  return { props: { posts } }
}

export default function Home({ posts }: { posts: BlogFrontMatter[] }) {
  return (
    <>
      <PageSeo title={siteMetadata.title} description={siteMetadata.description} />
      <div className="divide-y divide-gray-200 dark:divide-gray-700 mt-8 md:mt-16">
        <div className="md:my-4 md:pt-6 md:pb-8 space-y-2 md:space-y-5 xl:grid xl:grid-cols-3">
          <div className="xl:col-span-2 md:pr-8">
            <Greeting />
            <div className="text-lg leading-8 text-gray-600 dark:text-gray-400">
              <Heading />
              <TypedBios />
              <ShortDescription />
              <BlogLinks />
              <p className="my-8">
                Happy reading <Twemoji emoji="clinking-beer-mugs" />
              </p>
            </div>
          </div>
          <div className="hidden xl:block">
            <ProfileCard />
          </div>
        </div>
      </div>
      <FeaturedPosts posts={posts} />
    </>
  )
}
