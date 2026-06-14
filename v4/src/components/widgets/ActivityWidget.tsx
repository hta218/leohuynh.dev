import { useEffect, useState } from 'react'
import type { ActivityItem, ActivityPayload } from '~/types/integrations'

const fallback: ActivityPayload = {
  ok: true,
  items: [
    {
      type: 'build',
      title: 'scaffolded v4',
      subtitle: 'astro + bun workspace',
      meta: 'build log',
    },
  ],
}

const colorByType: Record<ActivityItem['type'], string> = {
  book: 'bg-code-amber',
  movie: 'bg-code-red',
  spotify: 'bg-code-green',
  github: 'bg-code-blue',
  build: 'bg-code-blue',
}

export default function ActivityWidget() {
  const [data, setData] = useState<ActivityPayload>(fallback)

  useEffect(() => {
    let cancelled = false
    fetch('/api/activity.json')
      .then((response) => response.json())
      .then((payload: ActivityPayload) => {
        if (!cancelled) setData(payload.items?.length ? payload : fallback)
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
        recent activity
      </h3>
      <div className="grid gap-2.5">
        {data.items.slice(0, 4).map((item) => {
          const body = (
            <>
              <span
                key="dot"
                className={`mt-1.5 h-2 w-2 rounded-full ${colorByType[item.type]}`}
              />
              <span key="body" className="min-w-0">
                <strong className="block truncate">{item.title}</strong>
                <span className="block truncate text-[13px] leading-snug text-muted">
                  {item.subtitle ?? item.meta ?? item.type}
                </span>
              </span>
            </>
          )

          const className =
            'grid grid-cols-[18px_1fr] gap-2.5 rounded-xl border border-line bg-white p-3 no-underline text-ink hover:border-code-blue'

          return item.url ? (
            <a
              key={`${item.type}-${item.title}`}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className={className}
            >
              {body}
            </a>
          ) : (
            <div key={`${item.type}-${item.title}`} className={className}>
              {body}
            </div>
          )
        })}
      </div>
    </div>
  )
}
