import {
  AuthorDetails,
  BackToPosts,
  BlogHeader,
  BlogSeo,
  BlogTags,
  Comments,
  ScrollTopButton,
  SectionContainer,
  SocialButtons,
} from '~/components'
import { siteMetadata } from '~/data'
import type { PostLayoutProps } from '~/types'

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
            className="pb-8 divide-y divide-gray-200 dark:divide-gray-700 xl:divide-y-0 xl:grid xl:grid-cols-4 xl:gap-x-6"
            style={{ gridTemplateRows: 'auto 1fr' }}
          >
            <div>
              <div className="hidden xl:block py-4 xl:py-8 border-b border-gray-200 dark:border-gray-700">
                <BackToPosts page={page} />
              </div>
              <dl className="pt-6 pb-10 xl:pt-11">
                <dt className="sr-only">Authors</dt>
                <dd>
                  <AuthorDetails authorDetails={authorDetails} />
                </dd>
              </dl>
            </div>
            <div className="!border-t-0 divide-y divide-gray-200 dark:divide-gray-700 xl:pb-0 xl:col-span-3 xl:row-span-2">
              <div className="pt-10 pb-8 prose prose-lg dark:prose-dark max-w-none">{children}</div>
              <SocialButtons postUrl={postUrl} title={title} fileName={fileName} />
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
