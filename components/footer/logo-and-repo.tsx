'use client'

import { Star } from 'lucide-react'
import useSWR from 'swr'
import { Logo } from '~/components/header/logo'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { Link } from '~/components/ui/link'
import { SITE_METADATA } from '~/data/site-metadata'
import type { GithubRepository, GithubRepositoryCommit } from '~/types/data'
import { fetcher, getTimeAgo } from '~/utils/misc'

export function LogoAndRepo() {
  let siteRepo = SITE_METADATA.siteRepo.replace('https://github.com/', '')
  let { data: repo } = useSWR<GithubRepository>(`/api/github?repo=${siteRepo}`, fetcher)

  return (
    <div className="flex items-center">
      <Logo className="mr-4" />
      <Link href={SITE_METADATA.siteRepo} rel="noreferrer">
        <GrowingUnderline
          data-umami-event="footer-view-source"
          className="flex items-center gap-2 font-medium"
        >
          {SITE_METADATA.headerTitle}
        </GrowingUnderline>
      </Link>
      {repo?.lastCommit && (
        <>
          <span className="mx-2">-</span>
          <Link
            href={repo.lastCommit.url}
            className="text-indigo-700 dark:text-indigo-400"
            title={repo.lastCommit.message}
          >
            <GrowingUnderline data-umami-event="repo-last-commit">
              #{repo.lastCommit.abbreviatedOid}
            </GrowingUnderline>
          </Link>
        </>
      )}
    </div>
  )
}
