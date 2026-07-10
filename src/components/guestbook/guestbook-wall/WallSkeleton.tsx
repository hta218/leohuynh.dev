import { Rail } from './Rail'

const SKELETON_ROWS = [0, 1, 2]

/** Placeholder commit rows shown while the wall fetches its first page. */
export function WallSkeleton() {
  return (
    <ol className="m-0 list-none p-0" aria-hidden="true">
      {SKELETON_ROWS.map((row) => (
        <li key={row} className="flex gap-4">
          <Rail isLast={row === SKELETON_ROWS.length - 1} />
          <div className="min-w-0 flex-1 animate-pulse pb-9">
            <div className="flex items-center gap-2">
              <div className="h-4 w-14 rounded bg-slate-100" />
              <div className="h-4 w-28 rounded bg-slate-100" />
            </div>
            <div className="mt-2 h-3 w-40 rounded bg-slate-100" />
            <div className="mt-3 h-3.5 w-full rounded bg-slate-100" />
            <div className="mt-2 h-3.5 w-4/5 rounded bg-slate-100" />
          </div>
        </li>
      ))}
    </ol>
  )
}
