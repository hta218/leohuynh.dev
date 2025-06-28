import { ExternalLink, GitCommitHorizontal } from 'lucide-react'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { Image } from '~/components/ui/image'
import { Link } from '~/components/ui/link'
import type { GithubCommitActivity, GithubUserActivity } from '~/types/data'
import { getTimeAgo } from '~/utils/misc'

export function CommitHistory({
  commit,
}: {
  commit: GithubCommitActivity
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0">
        <Image
          alt={commit.message.split('\n')[0]}
          loading="lazy"
          width="400"
          height="400"
          className="h-auto w-16 md:w-20 rounded-lg object-cover"
          src={commit.repository.owner.avatarUrl}
        />
        <div className="absolute -right-1 -bottom-1 flex items-center justify-center rounded-full bg-white p-1.5 shadow-md">
          <GitCommitHorizontal className="h-4 w-4 text-gray-600" />
        </div>
      </div>
      <div className="flex grow items-center justify-between gap-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <p className="mb-1 font-medium">
              <span className="font-medium text-[#71717a] dark:text-gray-400">
                Committed:
              </span>{' '}
              <Link href={commit.url} className="font-semibold">
                <GrowingUnderline>
                  {commit.message.split('\n')[0]}
                </GrowingUnderline>
              </Link>
            </p>
            <p className="line-clamp-1 text-sm text-[#71717a] italic dark:text-gray-400">
              {commit.repository.nameWithOwner}
            </p>
          </div>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <span className="ml-4 flex-shrink-0 rounded-full bg-neutral-200 px-2.5 py-0.5 text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300">
            {getTimeAgo(commit.createdAt)}
          </span>
          <Link
            href={commit.url}
            className="rounded p-2 text-gray-700 transition-colors hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
