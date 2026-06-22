import { GitBranchIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { SignaturePad, strokesToPath } from '~/components/guestbook/SignaturePad'
import {
  formatDate,
  type GuestbookViewProps,
  MESSAGE_MAX_LENGTH,
  shortHash,
  useGuestbook,
} from '~/components/guestbook/use-guestbook'
import type { GuestbookEntry } from '~/types/guestbook'

/** The guestbook wall — entries as a git commit log with a graph rail. */
export default function GuestbookWall(props: GuestbookViewProps) {
  const { currentUser, isAdmin } = props
  const gb = useGuestbook(props)

  return (
    <div className="flex w-full max-w-2xl flex-col gap-10">
      {currentUser ? (
        <Composer gb={gb} />
      ) : (
        <SignedOutPrompt />
      )}

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

/** The graph gutter: a node dot with a connecting rail beneath it. */
function Rail({ head = false, isLast = false }: { head?: boolean; isLast?: boolean }) {
  return (
    <div className="relative flex w-3 shrink-0 flex-col items-center">
      <span
        className={[
          'z-10 mt-1.25 h-2.75 w-2.75 shrink-0 rounded-full border-2 border-ink',
          head ? 'bg-ink' : 'bg-bg',
        ].join(' ')}
      />
      {!isLast && <span className="-mt-px w-px flex-1 bg-line" />}
    </div>
  )
}

function Commit({
  entry,
  isHead,
  isAdmin,
  busy,
  onModerate,
}: {
  entry: GuestbookEntry
  isHead: boolean
  isAdmin: boolean
  busy: boolean
  onModerate: (id: string, status: 'approved' | 'hidden') => void
}) {
  const dimmed = entry.status === 'hidden' || entry.status === 'pending'

  return (
    <div
      className={[
        'min-w-0 flex-1 pb-9',
        dimmed ? 'opacity-60' : '',
      ].join(' ')}
    >
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 leading-5">
        <code className="rounded bg-amber-50 px-1.5 py-0.5 font-mono text-[11px] text-amber-700">
          {shortHash(entry.id)}
        </code>
        <span className="font-semibold tracking-[-0.01em] text-ink">
          {entry.displayName}
        </span>
        {isHead && entry.status === 'approved' && (
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 font-mono text-[10px] text-emerald-700">
            HEAD → wall
          </span>
        )}
        {entry.status === 'pending' && (
          <span className="rounded-full border border-amber-200 bg-amber-50 px-1.5 py-0.5 font-mono text-[10px] text-amber-700">
            pending
          </span>
        )}
        {entry.status === 'hidden' && (
          <span className="rounded-full border border-line bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
            hidden
          </span>
        )}
      </div>

      <div className="mt-1 font-mono text-[11px] text-muted">
        <a
          href={`https://github.com/${entry.githubLogin}`}
          target="_blank"
          rel="noreferrer"
          className="text-muted no-underline hover:text-slate-950 hover:underline"
        >
          @{entry.githubLogin}
        </a>
        <span className="text-slate-300"> · </span>
        {formatDate(entry.createdAt)}
        {entry.isOwnEntry && <span className="text-slate-400"> · you</span>}
      </div>

      <p className="mt-3 mb-0 whitespace-pre-wrap wrap-break-word text-[15px] leading-relaxed text-slate-800">
        {entry.message}
      </p>

      {entry.signature && entry.signature.strokes.length > 0 && (
        <div className="mt-3 inline-block rounded-lg border border-line bg-[#fbfcff] p-3">
          <svg
            className="h-44 w-100 max-w-full"
            viewBox={`0 0 ${entry.signature.width} ${entry.signature.height}`}
            preserveAspectRatio="xMidYMid meet"
            fill="none"
            aria-label={`Signature by ${entry.displayName}`}
          >
            <path
              d={strokesToPath(entry.signature.strokes)}
              stroke="var(--color-ink)"
              strokeWidth={6}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      {isAdmin && (
        <div className="mt-3 flex gap-4 font-mono text-[11px]">
          {entry.status !== 'approved' && (
            <button
              type="button"
              disabled={busy}
              onClick={() => onModerate(entry.id, 'approved')}
              className="text-slate-500 underline decoration-slate-300 underline-offset-2 hover:text-slate-950 disabled:opacity-40"
            >
              approve
            </button>
          )}
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              onModerate(
                entry.id,
                entry.status === 'hidden' ? 'approved' : 'hidden',
              )
            }
            className="text-slate-500 underline decoration-slate-300 underline-offset-2 hover:text-slate-950 disabled:opacity-40"
          >
            {entry.status === 'hidden' ? 'unhide' : 'hide'}
          </button>
        </div>
      )}
    </div>
  )
}

function TerminalChrome({
  title,
  children,
}: {
  title: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white shadow-[4px_4px_0_var(--color-line)]">
      <div className="flex items-center gap-2 border-b border-line bg-[#f8fafc] px-4 py-2.5">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#f87171]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#fbbf24]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#34d399]" />
        </span>
        {title}
      </div>
      {children}
    </div>
  )
}

function Composer({ gb }: { gb: ReturnType<typeof useGuestbook> }) {
  return (
    <TerminalChrome
      title={
        <>
          <span className="ml-1 font-mono text-[11px] text-slate-500">
            sign — guestbook
          </span>
          <a
            href="/api/auth/logout"
            className="ml-auto font-mono text-[11px] text-muted underline decoration-slate-300 underline-offset-2 hover:text-slate-950"
          >
            sign out
          </a>
        </>
      }
    >
      <form onSubmit={gb.handleSubmit} className="px-4 py-4 font-mono text-[13px]">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-emerald-700">leo@guestbook</span>
          <span className="text-slate-400">~</span>
          <span className="text-sky-700">$</span>
          <span className="text-slate-400">sign --as</span>
          <input
            type="text"
            value={gb.displayName}
            onChange={(event) => gb.setDisplayName(event.target.value)}
            maxLength={80}
            aria-label="Display name"
            className="min-w-0 flex-1 border-b border-dashed border-line bg-transparent pb-0.5 text-ink outline-none focus:border-slate-400"
          />
        </div>

        <label htmlFor="cl-message" className="sr-only">
          Your note
        </label>
        <textarea
          id="cl-message"
          value={gb.message}
          onChange={(event) =>
            gb.setMessage(event.target.value.slice(0, MESSAGE_MAX_LENGTH))
          }
          rows={3}
          maxLength={MESSAGE_MAX_LENGTH}
          placeholder="> write your message and commit it to the wall…"
          className="mt-4 min-h-18 w-full resize-y bg-transparent leading-relaxed text-slate-800 outline-none placeholder:text-slate-400"
        />

        {/* Honeypot */}
        <input
          type="text"
          name="website"
          value={gb.website}
          onChange={(event) => gb.setWebsite(event.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />

        <SignaturePad value={gb.signature} onChange={gb.setSignature} />

        {gb.error && <p className="mt-4 text-xs text-code-red">{gb.error}</p>}
        {gb.pendingNotice && (
          <p className="mt-4 text-xs text-amber-700">
            Staged for review — it lands once approved.
          </p>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
          <span className="text-[11px] text-slate-400">
            {gb.remaining} chars left
          </span>
          <button
            type="submit"
            disabled={gb.submitting || gb.message.trim().length === 0}
            className="rounded-lg border border-ink bg-ink px-4 py-2 text-xs text-white shadow-[3px_3px_0_var(--color-line)] transition-transform hover:translate-y-px disabled:cursor-not-allowed disabled:opacity-40"
          >
            {gb.submitting ? 'committing…' : 'git commit'}
          </button>
        </div>
      </form>
    </TerminalChrome>
  )
}

function SignedOutPrompt() {
  return (
    <TerminalChrome
      title={
        <span className="ml-1 font-mono text-[11px] text-slate-500">
          login w GitHub and sign my guestbook
        </span>
      }
    >
      <div className="px-4 py-4 font-mono text-[13px]">
        <p className="m-0 text-slate-500">
          <span className="text-emerald-700">leo@guestbook</span>{' '}
          <span className="text-slate-400">~</span>{' '}
          <span className="text-sky-700">$</span> sign{' '}
          <span className="animate-pulse">▌</span>
        </p>
        <p className="mt-3 mb-5 text-slate-400">
          # only your public profile is used — no repo or email access
        </p>
        <a
          href="/api/auth/github"
          className="inline-flex items-center gap-2 rounded-lg border border-ink bg-ink px-4 py-2 text-xs text-white no-underline shadow-[3px_3px_0_var(--color-line)] transition-transform hover:translate-y-px"
          data-umami-event="guestbook-signin"
        >
          Sign in with GitHub
        </a>
      </div>
    </TerminalChrome>
  )
}
