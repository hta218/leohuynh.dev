import { useState } from 'react'
import { GuestbookEntryCard } from '~/components/guestbook/GuestbookEntryCard'
import { SignaturePad } from '~/components/guestbook/SignaturePad'
import type {
  CreateGuestbookResponse,
  GuestbookEntry,
  GuestbookListResponse,
  GuestbookSignature,
  GuestbookUser,
} from '~/types/guestbook'

const MESSAGE_MAX_LENGTH = 500

export default function GuestbookApp({
  currentUser,
  isAdmin,
  initialEntries,
  initialNextCursor,
}: {
  currentUser: GuestbookUser | null
  isAdmin: boolean
  initialEntries: GuestbookEntry[]
  initialNextCursor: string | null
}) {
  const [entries, setEntries] = useState<GuestbookEntry[]>(initialEntries)
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor)
  const [message, setMessage] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [website, setWebsite] = useState('')
  const [signature, setSignature] = useState<GuestbookSignature | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingNotice, setPendingNotice] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)

  async function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    if (submitting || message.trim().length === 0) return
    setSubmitting(true)
    setError(null)
    setPendingNotice(false)

    try {
      const response = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          message,
          displayName: displayName.trim() || undefined,
          signature,
          website,
        }),
      })

      if (response.status === 204) {
        // Honeypot tripped — pretend success without rendering anything.
        setMessage('')
        setSignature(null)
        return
      }

      const data = (await response.json()) as
        | CreateGuestbookResponse
        | { message: string }

      if (!response.ok) {
        setError('message' in data ? data.message : 'Could not save your note.')
        return
      }

      const result = data as CreateGuestbookResponse
      setMessage('')
      setSignature(null)
      setDisplayName('')
      if (result.status === 'approved') {
        setEntries((prev) => [result.entry, ...prev])
      } else {
        setPendingNotice(true)
        if (isAdmin) setEntries((prev) => [result.entry, ...prev])
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleLoadMore() {
    if (!nextCursor || loadingMore) return
    setLoadingMore(true)
    try {
      const response = await fetch(
        `/api/guestbook?cursor=${encodeURIComponent(nextCursor)}`,
      )
      if (!response.ok) throw new Error(`Load more failed: ${response.status}`)
      const data = (await response.json()) as GuestbookListResponse
      setEntries((prev) => [...prev, ...data.entries])
      setNextCursor(data.nextCursor)
    } catch {
      setError('Could not load more notes.')
    } finally {
      setLoadingMore(false)
    }
  }

  async function handleModerate(id: string, status: 'approved' | 'hidden') {
    setBusyId(id)
    try {
      const response = await fetch(`/api/guestbook/${id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!response.ok) throw new Error(`Moderation failed: ${response.status}`)
      const data = (await response.json()) as { entry: GuestbookEntry }
      setEntries((prev) =>
        prev.map((entry) => (entry.id === id ? data.entry : entry)),
      )
    } catch {
      setError('Could not update the entry.')
    } finally {
      setBusyId(null)
    }
  }

  const remaining = MESSAGE_MAX_LENGTH - message.length
  const namePlaceholder = currentUser
    ? (currentUser.name ?? currentUser.login)
    : ''

  return (
    <div className="flex flex-col gap-8">
      {currentUser ? (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-line bg-white p-4"
        >
          <div className="mb-3 flex items-center gap-3">
            {currentUser.avatarUrl && (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.login}
                width="32"
                height="32"
                className="h-8 w-8 rounded-full border border-line object-cover"
              />
            )}
            <div className="font-mono text-xs text-muted">
              signed in as{' '}
              <span className="text-slate-900">@{currentUser.login}</span>
            </div>
            <a
              href="/api/auth/logout"
              className="ml-auto font-mono text-[11px] text-muted underline decoration-slate-300 underline-offset-2 hover:text-slate-950"
            >
              sign out
            </a>
          </div>

          <label htmlFor="guestbook-message" className="sr-only">
            Your note
          </label>
          <textarea
            id="guestbook-message"
            value={message}
            onChange={(event) =>
              setMessage(event.target.value.slice(0, MESSAGE_MAX_LENGTH))
            }
            rows={3}
            maxLength={MESSAGE_MAX_LENGTH}
            placeholder="Leave a small trace on the wall…"
            className="w-full resize-y rounded-xl border border-line bg-[#fbfcff] p-3 text-[15px] leading-snug text-slate-800 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="guestbook-name" className="sr-only">
                Display name
              </label>
              <input
                id="guestbook-name"
                type="text"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                maxLength={80}
                placeholder={`Name (default: ${namePlaceholder})`}
                className="w-full rounded-xl border border-line bg-[#fbfcff] px-3 py-2 font-mono text-xs text-slate-800 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </div>
            <div className="flex items-center justify-end font-mono text-[11px] text-slate-400">
              {remaining} characters left
            </div>
          </div>

          {/* Honeypot — hidden from humans, tempting to bots. */}
          <input
            type="text"
            name="website"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />

          <SignaturePad value={signature} onChange={setSignature} />

          {error && (
            <p className="mt-3 font-mono text-xs text-code-red">{error}</p>
          )}
          {pendingNotice && (
            <p className="mt-3 font-mono text-xs text-amber-700">
              Thanks! Your note is pending review and will appear once approved.
            </p>
          )}

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={submitting || message.trim().length === 0}
              className="rounded-xl border border-ink bg-ink px-4 py-2 font-mono text-xs text-white shadow-[3px_3px_0_var(--color-line)] transition-transform hover:translate-y-px disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? 'signing…' : 'sign the guestbook'}
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-line bg-white p-6">
          <p className="m-0 text-[15px] text-muted">
            Sign in with GitHub to leave a note. Only your public profile is
            used — no repo or email access.
          </p>
          <a
            href="/api/auth/github"
            className="inline-flex items-center gap-2 rounded-xl border border-ink bg-ink px-4 py-2 font-mono text-xs text-white no-underline shadow-[3px_3px_0_var(--color-line)] transition-transform hover:translate-y-px"
            data-umami-event="guestbook-signin"
          >
            <GithubMark />
            Sign in with GitHub
          </a>
        </div>
      )}

      <section className="flex flex-col gap-4">
        {entries.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line bg-white p-8 text-center text-muted">
            No notes yet. Be the first to sign.
          </p>
        ) : (
          entries.map((entry) => (
            <GuestbookEntryCard
              key={entry.id}
              entry={entry}
              isAdmin={isAdmin}
              busy={busyId === entry.id}
              onModerate={handleModerate}
            />
          ))
        )}

        {nextCursor && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="rounded-xl border border-line bg-white px-4 py-2 font-mono text-xs text-slate-700 hover:border-slate-400 hover:text-slate-950 disabled:opacity-40"
            >
              {loadingMore ? 'loading…' : 'load more'}
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

function GithubMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.21 3.44 9.63 8.21 11.19.6.11.82-.25.82-.56 0-.28-.01-1.02-.02-2-3.34.71-4.04-1.58-4.04-1.58-.55-1.37-1.34-1.74-1.34-1.74-1.09-.73.08-.72.08-.72 1.21.08 1.84 1.22 1.84 1.22 1.07 1.8 2.81 1.28 3.5.98.11-.76.42-1.28.76-1.58-2.67-.3-5.47-1.31-5.47-5.84 0-1.29.47-2.35 1.24-3.18-.13-.3-.54-1.51.12-3.15 0 0 1.01-.32 3.3 1.21a11.6 11.6 0 0 1 3-.4c1.02 0 2.05.13 3 .4 2.29-1.53 3.3-1.21 3.3-1.21.66 1.64.25 2.85.12 3.15.77.83 1.24 1.89 1.24 3.18 0 4.54-2.81 5.54-5.49 5.83.43.37.81 1.1.81 2.22 0 1.6-.02 2.89-.02 3.28 0 .31.22.68.83.56A12.01 12.01 0 0 0 24 12.29C24 5.78 18.63.5 12 .5Z" />
    </svg>
  )
}
