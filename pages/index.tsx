import { PageSeo } from 'components/SEO'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ProfileCard } from '~/components/ProfileCard'
import { Twemoji } from '~/components/Twemoji'
import { BlogLinks } from '~/components/homepage/BlogLinks'
import { FeaturedPosts } from '~/components/homepage/FeaturedPosts'
import { Greeting } from '~/components/homepage/Greeting'
import { Heading } from '~/components/homepage/Heading'
import { ShortDescription } from '~/components/homepage/ShortDescription'
import { TypedBios } from '~/components/homepage/TypedBios'
import { getAllFilesFrontMatter } from '~/libs/mdx.server'

export async function getStaticProps({ locale }) {
  let posts = getAllFilesFrontMatter(`${locale}/blog`)
  return {
    props: {
      posts,
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

export default function Home({ posts }) {
  let { t } = useTranslation('common')

  return (
    <>
      <PageSeo title={t('site_meta_data.title')} description={t('site_meta_data.description')} />
      <div className="mt-8 divide-y divide-gray-200 dark:divide-gray-700 md:mt-16">
        <div className="space-y-2 md:my-4 md:space-y-5 md:pb-8 md:pt-6 xl:grid xl:grid-cols-3">
          <div className="md:pr-8 xl:col-span-2 space-y-6 md:space-y-8">
            <Greeting />
            <div className="text-base leading-7 md:text-lg md:leading-8 text-gray-600 dark:text-gray-400">
              <Heading />
              <TypedBios />
              <ShortDescription />
              <BlogLinks />
              <p className="my-8 flex">
                <span className="mr-2">{t('happy_reading')}</span>
                <Twemoji emoji="clinking-beer-mugs" />
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
