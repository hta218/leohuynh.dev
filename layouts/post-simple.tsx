import Comments from '@/components/Comments'
import Container from '@/components/Container'
import PageTitle from '@/components/PageTitle'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import siteMetadata from '@/data/siteMetadata'
import type { Blog, Snippet } from 'contentlayer/generated'
import type { CoreContent } from 'pliny/utils/contentlayer'
import type { ReactNode } from 'react'
import { BlogMeta } from '~/components/blog/blog-meta'
import { BlogTags } from '~/components/blog/blog-tags'
import { SocialShareButtons } from '~/components/SocialShareButtons'

interface PostSimpleProps {
  content: CoreContent<Blog | Snippet>
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}

export function PostSimple({ content, children }: PostSimpleProps) {
  let { slug, date, title, type, tags, readingTime, filePath } = content
  let postUrl = `${siteMetadata.siteUrl}/${type.toLowerCase()}/${slug}`

  return (
    <Container className="pt-4 lg:pt-12">
      <ScrollTopAndComment />
      <article className="space-y-6 divide-y divide-gray-200 pt-6 dark:divide-gray-700 lg:space-y-16">
        <div className="space-y-4">
          <BlogTags tags={tags} />
          <PageTitle>{title}</PageTitle>
          <dl>
            <div>
              <dt className="sr-only">Published on</dt>
              <BlogMeta date={date} slug={slug} readingTime={readingTime} />
            </div>
          </dl>
        </div>
        <div className="prose prose-lg max-w-none pt-10 dark:prose-invert">{children}</div>
        <div className="md:pb-10 md:pt-4">
          <SocialShareButtons postUrl={postUrl} title={title} filePath={filePath} />
          <div id="comment">
            <Comments slug={slug} />
          </div>
        </div>
      </article>
    </Container>
  )
}
