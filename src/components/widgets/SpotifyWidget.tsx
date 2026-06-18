import { useEffect, useState } from 'react'
import type { SpotifyPayload } from '~/types/integrations'

const fallback: SpotifyPayload = {
  ok: false,
  status: 'unavailable',
  isPlaying: false,
  error: 'not playing',
}

export default function SpotifyWidget() {
  const [data, setData] = useState<SpotifyPayload>(fallback)

  useEffect(() => {
    let cancelled = false
    fetch('/api/spotify.json')
      .then((response) => response.json())
      .then((payload: SpotifyPayload) => {
        if (!cancelled) setData(payload)
      })
      .catch(() => {
        if (!cancelled) setData(fallback)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const song = data.song
  const status =
    data.status === 'playing'
      ? 'playing now'
      : data.status === 'recently-played'
        ? 'last played'
        : 'not playing'

  return (
    <div className="rounded-2xl border border-line bg-white p-3.5">
      <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
        spotify now playing
      </h3>
      <div className="grid grid-cols-[48px_1fr] items-center gap-3">
        {song?.albumImageUrl ? (
          <img
            src={song.albumImageUrl}
            alt={song.album}
            className="h-12 w-12 rounded-xl border border-line object-cover"
          />
        ) : (
          <div className="h-12 w-12 rounded-xl border border-line bg-[linear-gradient(135deg,#bbf7d0,#bfdbfe)]" />
        )}
        <div className="min-w-0">
          {song?.songUrl ? (
            <a
              href={song.songUrl}
              target="_blank"
              rel="noreferrer"
              className="block truncate font-semibold text-ink no-underline hover:text-code-blue"
            >
              {song.title}
            </a>
          ) : (
            <b>—</b>
          )}
          <span className="block truncate font-mono text-xs text-muted">
            {song ? song.artist : status}
          </span>
          <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.08em] text-code-green">
            {status}
          </span>
        </div>
      </div>
    </div>
  )
}
