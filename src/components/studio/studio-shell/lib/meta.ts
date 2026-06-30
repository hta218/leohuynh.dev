import { execSync } from 'node:child_process'
import { SITE } from '~/lib/site'

export const SITE_VERSIONS = [
  {
    value: 'latest',
    branch: 'main',
    label: 'Astro × bun',
    href: '/',
    current: true,
  },
  {
    value: 'v3',
    branch: 'v3',
    label: 'Next.js 15 × pnpm',
    href: 'https://v3.leohuynh.dev/',
  },
  {
    value: 'v2',
    branch: 'v2',
    label: 'Next.js 14 × npm',
    href: 'https://v2.leohuynh.dev/',
  },
  {
    value: 'v1',
    branch: 'v1',
    label: 'Gatsby × yarn',
    href: 'https://v1.leohuynh.dev/',
  },
]

export const CURRENT_BRANCH =
  SITE_VERSIONS.find((v) => v.current)?.branch ?? 'main'

export const GIT_BRANCH_ICON =
  '<svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" aria-hidden="true"><path d="M9.5 3.25a2.25 2.25 0 1 1 3 2.122V6A2.5 2.5 0 0 1 10 8.5H6a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.5 0v1.836A2.493 2.493 0 0 1 6 7h4a1 1 0 0 0 1-1v-.628A2.25 2.25 0 0 1 9.5 3.25Zm-6 0a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Zm8.25-.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM4.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z"></path></svg>'

function renderCommit(): string {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7)
  if (sha) return sha
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim()
  } catch {
    return 'local'
  }
}

function renderCommitDate(): string {
  const envDate = process.env.VERCEL_GIT_COMMIT_AUTHOR_DATE
  if (envDate) return envDate
  try {
    return execSync('git log -1 --format=%cI', { encoding: 'utf8' }).trim()
  } catch {
    return new Date().toISOString()
  }
}

/** Last-commit footer info, sourced from Vercel env vars or local git. */
export function getCommitInfo(): {
  lastCommit: string
  lastCommitDate: string
  lastCommitUrl: string
} {
  const lastCommit = renderCommit()
  const lastCommitDate = renderCommitDate()
  const lastCommitUrl =
    lastCommit && lastCommit !== 'local'
      ? `${SITE.siteRepo}/commit/${lastCommit}`
      : SITE.siteRepo
  return { lastCommit, lastCommitDate, lastCommitUrl }
}
