'use client'

import type { Blog } from 'contentlayer/generated'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { usePathname } from 'next/navigation'
import type { CoreContent } from 'pliny/utils/contentlayer'
import { formatDate } from 'pliny/utils/formatDate'
import { useState } from 'react'
import Container from '~/components/Container'
import Image from '~/components/Image'
import Link from '~/components/Link'
import { SearchInput } from '~/components/search-input'
import siteMetadata from '~/data/siteMetadata'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  let pathname = usePathname()
  let basePath = pathname.split('/')[1]
  let prevPage = currentPage - 1 > 0
  let nextPage = currentPage + 1 <= totalPages

  return (
    <div className="space-y-2 pb-8 pt-6 md:space-y-5">
      <nav className="flex justify-between">
        {prevPage ? (
          <Link
            className="background-underline inline-flex cursor-pointer items-center gap-2"
            href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
            rel="prev"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </Link>
        ) : (
          <button
            className="background-underline inline-flex cursor-auto items-center gap-2 disabled:opacity-50"
            disabled={!prevPage}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>
        )}
        <span>
          {currentPage} / {totalPages}
        </span>
        {nextPage ? (
          <Link
            className="background-underline inline-flex cursor-pointer items-center gap-2"
            href={`/${basePath}/page/${currentPage + 1}`}
            rel="next"
          >
            <span>Next</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <button
            className="background-underline inline-flex cursor-auto items-center gap-2 disabled:opacity-50"
            disabled={!nextPage}
          >
            <span>Next</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </nav>
    </div>
  )
}

export function ListLayout({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  let [searchValue, setSearchValue] = useState('')
  let filteredBlogPosts = posts.filter((post) => {
    let searchContent = post.title + post.summary + post.tags?.join(' ')
    return searchContent.toLowerCase().includes(searchValue.toLowerCase())
  })

  // If initialDisplayPosts exist, display it if no searchValue is specified
  let displayPosts =
    initialDisplayPosts.length > 0 && !searchValue ? initialDisplayPosts : filteredBlogPosts

  return (
    <Container>
      <div className="divide-y divide-gray-200 pt-10 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {title}
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-500 md:text-lg md:leading-7">
            I write about web dev, tech related, and sometime about my personal life. Use the search
            below to filter by title.
          </p>
          <SearchInput label="Search articles" onChange={(e) => setSearchValue(e.target.value)} />
        </div>
        {!filteredBlogPosts.length ? (
          <div className="py-10">No posts found.</div>
        ) : (
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 border-t border-gray-200 py-10 md:gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {displayPosts.map((post) => {
              return <ArticleCard key={post.path} post={post} />
            })}
          </div>
        )}
      </div>
      {pagination && pagination.totalPages > 1 && !searchValue && (
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      )}
    </Container>
  )
}

function ArticleCard({ post }: { post: CoreContent<Blog> }) {
  let { path, date, title, summary, images, readingTime } = post
  return (
    <article>
      <div className="flex flex-col items-start justify-between gap-6">
        <Link href={`/${path}`} className="block shrink-0">
          <Image
            src={images && images.length > 0 ? images[0] : siteMetadata.socialBanner}
            alt={title}
            width={600}
            height={400}
            className="aspect-video h-auto w-full rounded-xl object-cover object-center md:aspect-[3/2]"
          />
        </Link>
        <div className="space-y-2 md:space-y-4">
          <div className="flex items-center gap-x-1.5 text-xs text-gray-600">
            <time dateTime={date}>{formatDate(date)}</time>
            <span>-</span>
            <span>{Math.ceil(readingTime.minutes)} mins read</span>
          </div>
          <div className="group relative">
            <h3 className="mt-3 text-xl font-semibold leading-6">
              <Link href={`/${path}`} className="text-gray-900 dark:text-gray-100">
                <span className="background-underline">{title}</span>
              </Link>
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600 dark:text-gray-500 md:mt-5">
              {summary}
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}
