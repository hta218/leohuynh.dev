import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import { BlogSeo } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import formatDate from '@/lib/utils/formatDate'
import Comments from '@/components/comments'
import SocialButtons from '@/components/SocialButtons'
import Twemoji from '@/components/Twemoji'

export default function PostLayout({ frontMatter, children }) {
  const { date, title, slug, fileName } = frontMatter
  const postUrl = `${siteMetadata.siteUrl}/snippets/${slug}`

  return (
    <SectionContainer>
      <BlogSeo url={`${siteMetadata.siteUrl}/snippets/${frontMatter.slug}`} {...frontMatter} />
      <article>
        <div>
          <header className="py-6 xl:py-16 border-b border-gray-200 dark:border-gray-700">
            <div className="space-y-1 text-center">
              <dl>
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                    <time dateTime={date} className="flex items-center justify-center">
                      <Twemoji emoji="calendar" size="" />
                      <span className="ml-1.5">{formatDate(date)}</span>
                    </time>
                  </dd>
                </div>
              </dl>
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
            </div>
          </header>
          <div
            className="pb-8 divide-y divide-gray-200 xl:divide-y-0 dark:divide-gray-700 "
            style={{ gridTemplateRows: 'auto 1fr' }}
          >
            <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:pb-0 xl:col-span-3 xl:row-span-2">
              <div className="pt-10 pb-8 prose prose-lg dark:prose-dark max-w-none">{children}</div>
              <SocialButtons postUrl={postUrl} title={title} fileName={fileName} />
              <Comments frontMatter={frontMatter} />
            </div>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
