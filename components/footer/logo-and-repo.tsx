'use client'

import { CheckCheck, Circle, X } from 'lucide-react'
import useSWR from 'swr'
import { Logo } from '~/components/header/logo'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { Link } from '~/components/ui/link'
import { SITE_METADATA } from '~/data/site-metadata'
import type { CommitState, GithubRepository } from '~/types/data'
import { fetcher } from '~/utils/misc'

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
            className="mr-1 text-indigo-700 dark:text-indigo-400"
            title={repo.lastCommit.message}
          >
            <GrowingUnderline data-umami-event="repo-last-commit" className="flex items-center">
              {repo.lastCommit.abbreviatedOid}
            </GrowingUnderline>
          </Link>
          <CommitStatus status={repo.lastCommit.status.state} />
        </>
      )}
    </div>
  )
}

function CommitStatus({ status }: { status: CommitState }) {
  switch (status) {
    case 'EXPECTED':
    case 'SUCCESS':
      return <CheckCheck size={16} strokeWidth={2} className="text-green-700" />
    case 'PENDING':
      return (
        <Circle size={12} strokeWidth={1.5} fill="green" className="animate-pulse text-[green]" />
      )
    case 'ERROR':
    case 'FAILURE':
      return <X size={16} strokeWidth={2} className="text-red-700" />
    default:
      return null
  }
}
