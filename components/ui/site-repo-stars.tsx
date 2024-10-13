'use client'

import { clsx } from 'clsx'
import { Star } from 'lucide-react'
import useSWR from 'swr'
import { Link } from '~/components/ui/link'
import { SITE_METADATA } from '~/data/site-metadata'
import type { GithubRepository } from '~/types/data'
import { fetcher } from '~/utils/misc'

export function SiteRepoStars() {
  let siteRepo = SITE_METADATA.siteRepo.replace('https://github.com/', '')
  let { data: repo } = useSWR<GithubRepository>(`/api/github?repo=${siteRepo}`, fetcher)

  return (
    <Link
      href={SITE_METADATA.siteRepo}
      className={clsx([
        'group flex items-center justify-center',
        'overflow-hidden rounded-md',
        'border',
        'border-gray-200 hover:border-gray-300',
        'dark:border-gray-700 dark:hover:border-gray-600',
      ])}
    >
      <div
        className={clsx([
          'flex h-7 items-center gap-2 px-2 text-sm',
          'bg-neutral-100 dark:bg-neutral-800',
          // 'border-r',
          // 'border-gray-200 group-hover:border-gray-300',
          // 'dark:border-gray-700 dark:group-hover:border-gray-600',
        ])}
      >
        <Star className="h-4 w-4" />
        <span className="font-medium">{repo ? repo.stargazerCount : '---'}</span>
      </div>
      {/* <div className="flex h-8 items-center bg-white px-3 dark:bg-dark">
        {repo ? repo.stargazerCount : '---'}
      </div> */}
    </Link>
  )
}
