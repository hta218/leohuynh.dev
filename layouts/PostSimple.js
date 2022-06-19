import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import { BlogSeo } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import formatDate from '@/lib/utils/formatDate'
import Comments from '@/components/comments'
import SocialButtons from '@/components/SocialButtons'
import Twemoji from '@/components/Twemoji'

export default function PostLayout({ frontMatter, children }) {
  const {
    date,
    title,
    slug,
    fileName,
    readingTime: { text: readingTimeText },
  } = frontMatter
  const postUrl = `${siteMetadata.siteUrl}/snippets/${slug}`

  return (
    <SectionContainer>
      <BlogSeo url={`${siteMetadata.siteUrl}/snippets/${frontMatter.slug}`} {...frontMatter} />
      <article>
        <div>
          <header className="py-6 xl:py-16">
            <div className="space-y-4 text-center">
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
              <dl>
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd className="flex justify-center text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                    <time dateTime={date} className="flex items-center justify-center">
                      <Twemoji emoji="calendar" size="" />
                      <span className="ml-1.5">{formatDate(date)}</span>
                    </time>
                    <span className="mx-2">-</span>
                    <div className="flex items-center">
                      <Twemoji emoji="hourglass-not-done" size="" />
                      <span className="ml-1.5">{readingTimeText.replace('min', 'mins')}</span>
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </header>
          <div className="pb-8" style={{ gridTemplateRows: 'auto 1fr' }}>
            <div className="xl:pb-0 xl:col-span-3 xl:row-span-2">
              <div className="pb-8 prose prose-lg dark:prose-dark max-w-none">{children}</div>
              <div className="border-t border-gray-200 dark:border-gray-700">
                <SocialButtons postUrl={postUrl} title={title} fileName={fileName} />
                <Comments frontMatter={frontMatter} />
              </div>
            </div>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
