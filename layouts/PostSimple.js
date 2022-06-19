import Comments from '@/components/comments'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import { BlogSeo } from '@/components/SEO'
import SocialButtons from '@/components/SocialButtons'
import Twemoji from '@/components/Twemoji'
import siteMetadata from '@/data/siteMetadata'
import formatDate from '@/lib/utils/formatDate'
import Tag from '@/components/Tag'

export default function PostLayout({ frontMatter, children, authorDetails }) {
  const {
    date,
    title,
    slug,
    fileName,
    tags,
    readingTime: { text: readingTimeText },
  } = frontMatter
  const postUrl = `${siteMetadata.siteUrl}/snippets/${slug}`

  return (
    <SectionContainer>
      <BlogSeo
        url={`${siteMetadata.siteUrl}/snippets/${frontMatter.slug}`}
        {...frontMatter}
        authorDetails={authorDetails}
      />
      <article>
        <div>
          <header className="py-6 xl:pb-16 xl:pt-16">
            <div className="space-y-4">
              {tags && (
                <div className="flex flex-wrap">
                  {tags.map((tag) => (
                    <Tag key={tag} text={tag} />
                  ))}
                </div>
              )}
              <div className="">
                <PageTitle>{title}</PageTitle>
              </div>
              <dl>
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd className="flex flex-wrap text-base font-medium leading-7 text-gray-500 dark:text-gray-400">
                    <time dateTime={date} className="flex items-center justify-center">
                      <Twemoji emoji="calendar" size="" />
                      <span className="ml-2">{formatDate(date)}</span>
                    </time>
                    <span className="mx-2">{` • `}</span>
                    <div className="flex items-center">
                      <Twemoji emoji="hourglass-not-done" size="" />
                      <span className="ml-2">{readingTimeText.replace('min', 'mins')}</span>
                    </div>
                    <span className="mx-2">{` • `}</span>
                    <div className="flex items-center">
                      <Twemoji emoji="eye" size="" />
                      <span className="ml-2">10234 views</span>
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
