import { useEffect, useState } from 'react'
import type {
  CreateGuestbookResponse,
  GuestbookEntry,
  GuestbookListResponse,
  GuestbookSignature,
  GuestbookUser,
} from '~/types/guestbook'

export const MESSAGE_MAX_LENGTH = 500

export interface GuestbookViewProps {
  currentUser: GuestbookUser | null
  isAdmin: boolean
  initialEntries: GuestbookEntry[]
  initialNextCursor: string | null
  /**
   * When true, the wall renders a loading state and fetches the first page
   * client-side on mount via GET /api/guestbook instead of relying on
   * server-rendered entries. This lets the `/guestbook` document paint without
   * blocking on the Supabase-backed entries query.
   */
  deferInitialLoad?: boolean
}

/**
 * Shared client state + actions for every guestbook UI variant. The visual
 * shells (commit-log, pinboard, file view) are purely presentational and all
 * drive the same submit / load-more / moderate logic through this hook.
 */
export function useGuestbook({
  currentUser,
  initialEntries,
  initialNextCursor,
  isAdmin,
  deferInitialLoad,
}: GuestbookViewProps) {
  const [entries, setEntries] = useState<GuestbookEntry[]>(initialEntries)
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor)
  const [message, setMessage] = useState('')
  const [displayName, setDisplayName] = useState(
    currentUser?.name ?? currentUser?.login ?? '',
  )
  const [website, setWebsite] = useState('')
  const [signature, setSignature] = useState<GuestbookSignature | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingNotice, setPendingNotice] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  // True until the deferred first page resolves, so the wall can show a
  // skeleton instead of prematurely flashing the empty state.
  const [loading, setLoading] = useState(deferInitialLoad ?? false)

  // Fetch the first page client-side when the server chose not to render
  // entries. The API reads the same session cookie, so admins still get their
  // moderation view. On failure we fall back to the empty state, mirroring the
  // previous server-side catch that rendered an empty wall.
  useEffect(() => {
    if (!deferInitialLoad) return
    let cancelled = false

    async function loadInitial() {
      try {
        const response = await fetch('/api/guestbook')
        if (!response.ok) throw new Error(`Load failed: ${response.status}`)
        const data = (await response.json()) as GuestbookListResponse
        if (cancelled) return
        setEntries(data.entries)
        setNextCursor(data.nextCursor)
      } catch (loadError) {
        if (!cancelled) console.error('[guestbook] initial load failed', loadError)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadInitial()
    return () => {
      cancelled = true
    }
  }, [deferInitialLoad])

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

  return {
    entries,
    nextCursor,
    message,
    setMessage,
    displayName,
    setDisplayName,
    website,
    setWebsite,
    signature,
    setSignature,
    submitting,
    loading,
    loadingMore,
    error,
    pendingNotice,
    busyId,
    remaining: MESSAGE_MAX_LENGTH - message.length,
    handleSubmit,
    handleLoadMore,
    handleModerate,
  }
}

/** Short pseudo "commit hash" derived from the entry id, for the log variant. */
export function shortHash(id: string): string {
  return id.replace(/[^a-f0-9]/gi, '').slice(0, 7) || 'init000'
}

export function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}
