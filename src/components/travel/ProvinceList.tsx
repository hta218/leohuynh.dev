import { useState } from 'react'
import type { ProvinceUnit } from '~/lib/places'

/**
 * Server-rendered province cards with a per-card "show more" toggle. Each card
 * lists up to `INITIAL_PLACES` checked-in spots; cards with more collapse the
 * rest behind a button. The `not listed` count are spots gody counted but never
 * exposed publicly — no names to reveal, so it stays an informational note.
 */

const INITIAL_PLACES = 4

interface Props {
  provinces: ProvinceUnit[]
}

export default function ProvinceList({ provinces }: Props) {
  return (
    <ul className="grid grid-cols-1 gap-3 p-0 sm:grid-cols-2">
      {provinces.map((unit) => (
        <ProvinceCard key={unit.code} unit={unit} />
      ))}
    </ul>
  )
}

function ProvinceCard({ unit }: { unit: ProvinceUnit }) {
  const [expanded, setExpanded] = useState(false)
  const canExpand = unit.places.length > INITIAL_PLACES
  const shown = expanded ? unit.places : unit.places.slice(0, INITIAL_PLACES)
  const hiddenKnown = unit.places.length - INITIAL_PLACES
  const notListed = unit.count - unit.places.length

  return (
    <li className="list-none">
      <div className="h-full rounded-2xl border border-line bg-white p-4">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="m-0 text-[17px] tracking-[-0.02em] text-ink">
            {unit.name}
          </h3>
          <span className="flex-none font-mono text-xs text-muted">
            {unit.count > 0 ? `${unit.count} places` : 'visited'}
          </span>
        </div>

        {unit.mergedFrom.length > 0 && (
          <p className="mt-1 mb-0 font-mono text-[11px] text-muted">
            incl. {unit.mergedFrom.join(', ')}
          </p>
        )}

        {unit.places.length > 0 && (
          <ul className="mt-3 grid gap-1.5 p-0">
            {shown.map((place) => (
              <li
                key={place.name}
                className="flex items-baseline gap-2 list-none text-[14px] text-ink"
              >
                <span aria-hidden="true" className="text-muted">
                  —
                </span>
                <span>{place.name}</span>
              </li>
            ))}
          </ul>
        )}

        {(canExpand || notListed > 0) && (
          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            {canExpand && (
              <button
                type="button"
                onClick={() => setExpanded((value) => !value)}
                className="font-mono text-[11px] text-code-blue hover:underline"
                aria-expanded={expanded}
              >
                {expanded ? 'Show less' : `+ ${hiddenKnown} more`}
              </button>
            )}
            {notListed > 0 && (
              <span className="font-mono text-[11px] text-muted">
                {notListed} not listed on gody
              </span>
            )}
          </div>
        )}
      </div>
    </li>
  )
}
