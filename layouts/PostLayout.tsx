import { BackToPosts } from '~/components/blog/BackToPosts'
import { AuthorDetails } from '~/components/blog/BlogAuthor'
import { BlogHeader } from '~/components/blog/BlogHeader'
import { BlogTags } from '~/components/blog/BlogTags'
import { Comments } from '~/components/comments'
import { ScrollTopButton } from '~/components/ScrollTopButton'
import { SectionContainer } from '~/components/SectionContainer'
import { BlogSeo } from '~/components/SEO'
import { SocialShareButtons } from '~/components/SocialShareButtons'
import { siteMetadata } from '~/data/siteMetadata'
import type { PostLayoutProps } from '~/types/layout'

export function PostLayout(props: PostLayoutProps) {
  let { frontMatter, authorDetails, page, children, commentConfig } = props
  let { slug, fileName, date, title, tags, readingTime } = frontMatter
  let postUrl = `${siteMetadata.siteUrl}/blog/${slug}`

  return (
    <SectionContainer>
      <BlogSeo url={postUrl} authorDetails={authorDetails} {...frontMatter} />
      <ScrollTopButton />
      <article>
        <div>
          <BlogHeader title={title} date={date} readingTime={readingTime} />
          <div
            className="divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0"
            style={{ gridTemplateRows: 'auto 1fr' }}
          >
            <div>
              <div className="hidden border-b border-gray-200 py-4 dark:border-gray-700 xl:block xl:py-8">
                <BackToPosts page={page} />
              </div>
              <dl className="pb-10 pt-6 xl:pt-11">
                <dt className="sr-only">Authors</dt>
                <dd>
                  <AuthorDetails authorDetails={authorDetails} />
                </dd>
              </dl>
            </div>
            <div className="divide-y divide-gray-200 !border-t-0 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="prose prose-base md:prose-lg max-w-none pb-8 pt-10 dark:prose-dark">
                {children}
              </div>
              <SocialShareButtons postUrl={postUrl} title={title} fileName={fileName} />
              <Comments frontMatter={frontMatter} config={commentConfig} />
            </div>
            <footer>
              <div className="text-sm font-medium leading-5 xl:col-start-1 xl:row-start-2">
                <div className="py-4">
                  <BlogTags tags={tags} />
                </div>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}

export default PostLayout
