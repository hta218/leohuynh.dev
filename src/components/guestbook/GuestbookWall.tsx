import { GitBranchIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  type GuestbookViewProps,
  useGuestbook,
} from '~/components/guestbook/use-guestbook'
import { Commit } from './guestbook-wall/Commit'
import { Composer } from './guestbook-wall/Composer'
import { Rail } from './guestbook-wall/Rail'
import { SignedOutPrompt } from './guestbook-wall/SignedOutPrompt'

/** The guestbook wall — entries as a git commit log with a graph rail. */
export default function GuestbookWall(props: GuestbookViewProps) {
  const { currentUser, isAdmin } = props
  const gb = useGuestbook(props)

  return (
    <div className="flex w-full max-w-2xl flex-col gap-10">
      {currentUser ? <Composer gb={gb} /> : <SignedOutPrompt />}

      <section>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
            <HugeiconsIcon icon={GitBranchIcon} size={15} strokeWidth={1.8} />
            <span>git log</span>
            <span className="rounded-full border border-line bg-white px-2 py-0.5 text-slate-600">
              wall
            </span>
          </div>
          <span className="font-mono text-[11px] text-slate-400">
            {gb.entries.length}
            {gb.nextCursor ? '+' : ''} commits
          </span>
        </div>

        {gb.entries.length === 0 ? (
          <div className="flex gap-4">
            <Rail isLast />
            <p className="m-0 pt-px font-mono text-sm text-muted">
              no commits yet — be the first to sign.
            </p>
          </div>
        ) : (
          <ol className="m-0 list-none p-0">
            {gb.entries.map((entry, index) => (
              <li key={entry.id} className="flex gap-4">
                <Rail
                  head={index === 0 && entry.status === 'approved'}
                  isLast={index === gb.entries.length - 1}
                />
                <Commit
                  entry={entry}
                  isHead={index === 0}
                  isAdmin={isAdmin}
                  busy={gb.busyId === entry.id}
                  onModerate={gb.handleModerate}
                />
              </li>
            ))}
          </ol>
        )}

        {gb.nextCursor && (
          <div className="pl-7">
            <button
              type="button"
              onClick={gb.handleLoadMore}
              disabled={gb.loadingMore}
              className="font-mono text-xs text-slate-500 underline decoration-slate-300 underline-offset-2 hover:text-slate-950 disabled:opacity-40"
            >
              {gb.loadingMore ? 'loading…' : 'git log --older'}
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
