import Comments from '@/components/Comments'
import Container from '@/components/Container'
import Image from '@/components/Image'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import siteMetadata from '@/data/siteMetadata'
import type { Blog } from 'contentlayer/generated'
import type { CoreContent } from 'pliny/utils/contentlayer'
import type { ReactNode } from 'react'
import { BlogMeta } from '~/components/blog/BlogMeta'
import { BlogTags } from '~/components/blog/BlogTags'
import { BannerInfo } from '~/components/BannerInfo'

interface LayoutProps {
  content: CoreContent<Blog>
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}

export default function PostMinimal({ content, next, prev, children }: LayoutProps) {
  const { slug, title, images, bannerAuthor, bannerUrl, date, readingTime, tags } = content
  const displayImage =
    images && images.length > 0 ? images[0] : 'https://picsum.photos/seed/picsum/800/400'

  return (
    <Container>
      <ScrollTopAndComment />
      <article>
        <div className="space-y-6 py-6 xl:pb-16 xl:pt-16">
          <BlogTags tags={tags} />
          <PageTitle>{title}</PageTitle>
          <dl>
            <div>
              <dt className="sr-only">Published on</dt>
              <BlogMeta date={date} slug={slug} readingTime={readingTime} />
            </div>
          </dl>
        </div>
        <div className="flex w-full flex-col gap-4">
          <div className="-mx-5 md:-mx-10 lg:-mx-32 xl:-mx-40">
            <Image
              src={displayImage}
              alt={title}
              width={2000}
              height={1000}
              className="h-auto w-full rounded-xl object-cover"
            />
          </div>
          <BannerInfo author={bannerAuthor} photoURL={bannerUrl} />
        </div>
        <div className="prose prose-lg max-w-none py-10 text-gray-900 dark:prose-invert">
          {children}
        </div>
        {siteMetadata.comments && (
          <div className="pb-6 pt-6 text-center text-gray-700 dark:text-gray-300" id="comment">
            <Comments slug={slug} />
          </div>
        )}
        <footer>
          <div className="flex flex-col text-sm font-medium sm:flex-row sm:justify-between sm:text-base">
            {prev && prev.path && (
              <div className="pt-4 xl:pt-8">
                <Link
                  href={`/${prev.path}`}
                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  aria-label={`Previous post: ${prev.title}`}
                >
                  &larr; {prev.title}
                </Link>
              </div>
            )}
            {next && next.path && (
              <div className="pt-4 xl:pt-8">
                <Link
                  href={`/${next.path}`}
                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  aria-label={`Next post: ${next.title}`}
                >
                  {next.title} &rarr;
                </Link>
              </div>
            )}
          </div>
        </footer>
      </article>
    </Container>
  )
}
