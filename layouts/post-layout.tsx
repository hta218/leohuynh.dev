import type { Author, Blog } from 'contentlayer/generated'
import type { ReactNode } from 'react'
import { BackToPosts } from '~/components/blog/back-to-posts'
import { Banner } from '~/components/blog/banner'
import { BlogMeta } from '~/components/blog/blog-meta'
import { Comments } from '~/components/blog/comments'
import { PostNav } from '~/components/blog/post-nav'
import { PostTitle } from '~/components/blog/post-title'
import { Reactions } from '~/components/blog/reactions'
import { ScrollButtons } from '~/components/blog/scroll-buttons'
import { SocialShare } from '~/components/blog/social-share'
import { TagsList } from '~/components/blog/tags'
import { TableOfContents } from '~/components/blog/toc'
import { Container } from '~/components/ui/container'
import { GradientDivider } from '~/components/ui/gradient-divider'
import { SITE_METADATA } from '~/data/site-metadata'
import type { StatsType } from '~/db/schema'
import type { CoreContent } from '~/types/data'

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Author>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

export function PostLayout({ content, next, prev, children }: LayoutProps) {
  let { slug, images, lastmod, readingTime, date, filePath, title, tags, toc, type } = content
  let postUrl = `${SITE_METADATA.siteUrl}/${type.toLowerCase()}/${slug}`

  return (
    <Container className="pt-4 lg:pt-12">
      <ScrollButtons />
      <article className="pt-6">
        <div className="space-y-4">
          <TagsList tags={tags} />
          <PostTitle>{title}</PostTitle>
          <div className="space-y-4 pt-4 md:pt-10">
            <Banner banner={images?.[0] || SITE_METADATA.socialBanner} />
          </div>
          <div className="flex items-center justify-between gap-2 pb-4 lg:pt-2">
            <BlogMeta
              date={date}
              lastmod={lastmod}
              type={type.toLowerCase() as StatsType}
              slug={slug}
              readingTime={readingTime}
            />
            <SocialShare
              postUrl={postUrl}
              filePath={filePath}
              title={title}
              className="hidden md:flex"
            />
          </div>
        </div>
        <GradientDivider className="mb-2 mt-1" />
        <div className="grid grid-cols-1 gap-12 pb-10 pt-8 lg:grid-cols-12 lg:pt-10">
          <div className="divide-y divide-gray-200 dark:divide-gray-700 lg:col-span-8 xl:col-span-9">
            <div className="prose max-w-none dark:prose-invert lg:prose-lg lg:pb-8">{children}</div>
          </div>
          <div className="hidden lg:col-span-4 lg:block xl:col-span-3">
            <div className="space-y-4 divide-y divide-gray-200 dark:divide-gray-700 lg:sticky lg:top-24">
              {/* <BackToPosts label="Back to posts" /> */}
              <TableOfContents toc={toc} />
              <Reactions className="pt-6" type={type.toLowerCase() as StatsType} slug={slug} />
              <div className="hidden">
                {/* <script src="//servedby.eleavers.com/ads/ads.php?t=MzA5NzQ7MjEwNjA7c3F1YXJlLnNxdWFyZV9ib3g=&index=1"></script> */}
                {/* <script
                  type="text/javascript"
                  dangerouslySetInnerHTML={{
                    __html: `
                        atOptions = {
                          'key' : '1a0dbe126a158e715cd3377a597850d8',
                          'format' : 'iframe',
                          'height' : 300,
                          'width' : 160,
                          'params' : {}
                        };`,
                  }}
                />
                <script
                  type="text/javascript"
                  src="//www.topcpmcreativeformat.com/1a0dbe126a158e715cd3377a597850d8/invoke.js"
                /> */}
              </div>
            </div>
          </div>
        </div>
        <GradientDivider />
        <div className="space-y-4">
          <PostNav next={next} nextLabel="Next post" prev={prev} prevLabel="Previous post" />
          <Comments configs={{ reactions: '0' }} />
        </div>
      </article>
    </Container>
  )
}
