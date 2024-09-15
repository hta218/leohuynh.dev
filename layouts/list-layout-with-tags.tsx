/* eslint-disable jsx-a11y/anchor-is-valid */
'use client'

import Link from '@/components/Link'
import tagData from 'app/tag-data.json'
import type { Blog } from 'contentlayer/generated'
import { slug } from 'github-slugger'
import { usePathname } from 'next/navigation'
import type { CoreContent } from 'pliny/utils/contentlayer'
import Container from '~/components/Container'
import { PostCardGridView } from '~/components/blog/post-card-grid-view'

interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
}

export function ListLayoutWithTags({ posts, title }: ListLayoutProps) {
  let pathname = usePathname()
  let tagCounts = tagData as Record<string, number>
  let tagKeys = Object.keys(tagCounts)
  let sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])

  return (
    <Container>
      <div className="pb-6 pt-6">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:hidden sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          {title}
        </h1>
      </div>
      <div className="flex sm:space-x-24">
        <div className="hidden h-full max-h-screen min-w-[280px] max-w-[280px] flex-wrap overflow-auto rounded bg-gray-50 pt-5 shadow-md dark:bg-gray-900/70 dark:shadow-gray-800/40 sm:flex">
          <div className="px-6 py-4">
            {pathname.startsWith('/blog') ? (
              <h3 className="font-bold uppercase text-primary-500">All Posts</h3>
            ) : (
              <Link
                href={`/blog`}
                className="font-bold uppercase text-gray-700 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
              >
                All Posts
              </Link>
            )}
            <ul>
              {sortedTags.map((t) => {
                return (
                  <li key={t} className="my-3">
                    {pathname.split('/tags/')[1] === slug(t) ? (
                      <h3 className="inline px-3 py-2 text-sm font-bold uppercase text-primary-500">
                        {`${t} (${tagCounts[t]})`}
                      </h3>
                    ) : (
                      <Link
                        href={`/tags/${slug(t)}`}
                        className="px-3 py-2 text-sm font-medium uppercase text-gray-500 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
                        aria-label={`View posts tagged ${t}`}
                      >
                        {`${t} (${tagCounts[t]})`}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
        <div>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-2">
            {posts.map((post) => (
              <li key={post.path}>
                <PostCardGridView post={post} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Container>
  )
}
