'use client'

import { CheckCheck, Circle, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import useSWR from 'swr'
import { Twemoji } from '~/components/ui/twemoji'
import { SITE_METADATA } from '~/data/site-metadata'
import type { CommitState, GithubRepository } from '~/types/data'
import { fetcher } from '~/utils/misc'

export function TerminalWindowTitle() {
  const pathname = usePathname()
  let siteRepo = SITE_METADATA.siteRepo.replace('https://github.com/', '')
  let { data: repo } = useSWR<GithubRepository>(
    `/api/github?repo=${siteRepo}`,
    fetcher,
  )

  const getDisplayPath = () => {
    if (pathname === '/') return '/leohuynh.dev'
    return `/leohuynh.dev${pathname}`
  }

  return (
    <>
      <span>~/the-internet/</span>
      <Twemoji emoji="flag-vietnam" />
      <span className="-ml-0.5">{getDisplayPath()}</span>
      <span className="mx-2 opacity-50">|</span>
      {repo?.lastCommit && (
        <>
          <Link
            href={repo.lastCommit.url}
            target="_blank"
            className="mr-2 hover:underline underline-offset-4"
            data-terminal-accent
            title={repo.lastCommit.message}
          >
            <span data-umami-event="repo-last-commit">
              #{repo.lastCommit.abbreviatedOid}
            </span>
          </Link>
          <CommitStatus status={repo.lastCommit.status.state} />
        </>
      )}
    </>
  )
}

function CommitStatus({ status }: { status: CommitState }) {
  switch (status) {
    case 'EXPECTED':
    case 'SUCCESS':
      return <CheckCheck size={16} strokeWidth={2} className="text-green-700" />
    case 'PENDING':
      return (
        <Circle
          size={12}
          strokeWidth={1.5}
          fill="green"
          className="animate-pulse text-[green]"
        />
      )
    case 'ERROR':
    case 'FAILURE':
      return <X size={16} strokeWidth={2} className="text-red-700" />
    default:
      return null
  }
}
