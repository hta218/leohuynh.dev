import { strokesToPath } from '~/components/guestbook/SignaturePad'
import { formatDate, shortHash } from '~/components/guestbook/use-guestbook'
import type { GuestbookEntry } from '~/types/guestbook'

export function Commit({
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
      className={['min-w-0 flex-1 pb-9', dimmed ? 'opacity-60' : ''].join(' ')}
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
