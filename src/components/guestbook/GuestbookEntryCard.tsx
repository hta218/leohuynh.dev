import { strokesToPath } from '~/components/guestbook/SignaturePad'
import type { GuestbookEntry } from '~/types/guestbook'

function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function GuestbookEntryCard({
  entry,
  isAdmin,
  busy,
  onModerate,
}: {
  entry: GuestbookEntry
  isAdmin: boolean
  busy: boolean
  onModerate: (id: string, status: 'approved' | 'hidden') => void
}) {
  const isHidden = entry.status === 'hidden'
  const isPending = entry.status === 'pending'

  return (
    <article
      className={[
        'flex flex-col gap-3 rounded-2xl border border-line bg-white p-4',
        isHidden || isPending ? 'opacity-70' : '',
      ].join(' ')}
    >
      <div className="flex items-center gap-3">
        {entry.githubAvatarUrl ? (
          <img
            src={entry.githubAvatarUrl}
            alt={entry.displayName}
            width="36"
            height="36"
            loading="lazy"
            className="h-9 w-9 rounded-full border border-line object-cover"
          />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-[#f8fafc] font-mono text-xs text-slate-500">
            {entry.displayName.slice(0, 1).toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate font-semibold tracking-[-0.01em] text-ink">
              {entry.displayName}
            </span>
            {entry.isOwnEntry && (
              <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-slate-400">
                you
              </span>
            )}
          </div>
          <a
            href={`https://github.com/${entry.githubLogin}`}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[11px] text-muted no-underline hover:text-slate-950 hover:underline"
          >
            @{entry.githubLogin}
          </a>
        </div>
        <time
          dateTime={entry.createdAt}
          className="ml-auto shrink-0 font-mono text-[11px] text-slate-400"
        >
          {formatDate(entry.createdAt)}
        </time>
      </div>

      <p className="m-0 whitespace-pre-wrap break-words text-[15px] leading-snug text-slate-700">
        {entry.message}
      </p>

      {entry.signature && entry.signature.strokes.length > 0 && (
        <svg
          className="h-20 w-full border-t border-line pt-2"
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
      )}

      {(isAdmin || isPending) && (
        <div className="flex items-center gap-3 border-t border-line pt-3 font-mono text-[11px]">
          {isPending && (
            <span className="rounded-md bg-amber-50 px-2 py-0.5 text-amber-700">
              pending review
            </span>
          )}
          {isHidden && (
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-500">
              hidden
            </span>
          )}
          {isAdmin && (
            <div className="ml-auto flex items-center gap-3">
              {entry.status !== 'approved' && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onModerate(entry.id, 'approved')}
                  className="text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-slate-950 disabled:opacity-40"
                >
                  approve
                </button>
              )}
              {entry.status !== 'hidden' ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onModerate(entry.id, 'hidden')}
                  className="text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-slate-950 disabled:opacity-40"
                >
                  hide
                </button>
              ) : (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onModerate(entry.id, 'approved')}
                  className="text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-slate-950 disabled:opacity-40"
                >
                  unhide
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  )
}
