import { useEffect, useState } from 'react'
import type { GithubTodayPayload } from '~/types/integrations'

const fallback: GithubTodayPayload = {
  ok: false,
  username: 'hta218',
  date: '',
  contributions: null,
  commits: null,
  additions: null,
  deletions: null,
}

function stat(value: number | null) {
  return typeof value === 'number' ? value.toLocaleString() : '—'
}

export default function GithubTodayWidget() {
  const [data, setData] = useState<GithubTodayPayload>(fallback)

  useEffect(() => {
    let cancelled = false
    fetch('/api/github-today.json')
      .then((response) => response.json())
      .then((payload: GithubTodayPayload) => {
        if (!cancelled) setData(payload)
      })
      .catch(() => {
        if (!cancelled) setData(fallback)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="rounded-2xl border border-line bg-white p-3.5">
      <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
        github today
      </h3>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-line bg-[#fbfdff] p-2.5">
          <b className="block text-2xl">{stat(data.contributions)}</b>
          <span className="font-mono text-[10px] text-muted">contribs</span>
        </div>
        <div className="rounded-xl border border-line bg-[#fbfdff] p-2.5">
          <b className="block text-2xl">{stat(data.commits)}</b>
          <span className="font-mono text-[10px] text-muted">commits</span>
        </div>
        <div className="rounded-xl border border-line bg-[#fbfdff] p-2.5">
          <b className="block text-2xl text-code-green">
            +{stat(data.additions)}
          </b>
          <span className="font-mono text-[10px] text-muted">added</span>
        </div>
        <div className="rounded-xl border border-line bg-[#fbfdff] p-2.5">
          <b className="block text-2xl text-code-red">
            -{stat(data.deletions)}
          </b>
          <span className="font-mono text-[10px] text-muted">removed</span>
        </div>
      </div>
      {data.topRepo && (
        <a
          href={data.topRepo.url}
          target="_blank"
          rel="noreferrer"
          className="mt-2 block truncate rounded-lg border border-line bg-white px-2 py-1.5 font-mono text-[11px] text-muted no-underline hover:text-code-blue"
        >
          top repo: {data.topRepo.nameWithOwner}
        </a>
      )}
    </div>
  )
}
