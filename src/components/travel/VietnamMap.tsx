import { useState } from 'react'
import type { ProvinceUnit } from '~/lib/places'
import { VIEWBOX } from './vietnam-provinces'

/**
 * Interactive SVG choropleth of Vietnam's 2025 34 provincial units. Provinces
 * are shaded by how many places were checked in; hovering (desktop) or tapping
 * (touch) a province updates the side detail panel. Monochrome slate ramp to
 * match the site's editor-canvas palette. The page also renders a plain province
 * list server-side, so this island is purely progressive enhancement.
 */

interface Props {
  provinces: ProvinceUnit[]
}

const UNVISITED_FILL = '#eef2f6'
const VISITED_ZERO_FILL = '#cbd5e1'

/** Slate ramp, densest first — `fill` picked by the first bucket the count clears. */
const SHADES = [
  { min: 10, fill: '#0f172a' },
  { min: 6, fill: '#334155' },
  { min: 3, fill: '#64748b' },
  { min: 1, fill: '#94a3b8' },
] as const

const LEGEND = [
  { label: 'Not visited', fill: UNVISITED_FILL },
  { label: 'Visited', fill: VISITED_ZERO_FILL },
  { label: '1–2', fill: '#94a3b8' },
  { label: '3–5', fill: '#64748b' },
  { label: '6–9', fill: '#334155' },
  { label: '10+', fill: '#0f172a' },
] as const

function fillFor(unit: ProvinceUnit): string {
  if (!unit.visited) return UNVISITED_FILL
  if (unit.count === 0) return VISITED_ZERO_FILL
  return (
    SHADES.find((shade) => unit.count >= shade.min)?.fill ?? VISITED_ZERO_FILL
  )
}

export default function VietnamMap({ provinces }: Props) {
  const [activeCode, setActiveCode] = useState<string | null>(null)
  const active =
    provinces.find((province) => province.code === activeCode) ?? null

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,340px)_1fr] md:items-start">
      <figure className="m-0">
        <svg
          viewBox={VIEWBOX}
          role="img"
          aria-label="Map of Vietnam's provinces, shaded by places I've visited"
          className="h-auto w-full max-w-[340px] mx-auto select-none"
          onMouseLeave={() => setActiveCode(null)}
        >
          {provinces.map((province) => {
            const isActive = province.code === activeCode
            return (
              // biome-ignore lint/a11y/noStaticElementInteractions: SVG map regions are interactive by design; a full accessible province list is rendered below the map.
              <path
                key={province.code}
                d={province.d}
                fill={fillFor(province)}
                stroke={isActive ? '#0f172a' : '#ffffff'}
                strokeWidth={isActive ? 2.2 : 0.8}
                strokeLinejoin="round"
                tabIndex={province.visited ? 0 : -1}
                aria-label={`${province.name}, ${
                  province.visited ? `${province.count} places` : 'not visited'
                }`}
                style={{
                  cursor: province.visited ? 'pointer' : 'default',
                  outline: 'none',
                  transition: 'fill 120ms ease',
                }}
                onMouseEnter={() => setActiveCode(province.code)}
                onFocus={() => setActiveCode(province.code)}
                onClick={() =>
                  setActiveCode((current) =>
                    current === province.code ? null : province.code,
                  )
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setActiveCode((current) =>
                      current === province.code ? null : province.code,
                    )
                  }
                }}
              />
            )
          })}
        </svg>

        <ul className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 p-0 font-mono text-[11px] text-muted">
          {LEGEND.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-1.5 list-none"
            >
              <span
                className="inline-block h-3 w-3 rounded-[3px] border border-line"
                style={{ backgroundColor: item.fill }}
              />
              {item.label}
            </li>
          ))}
        </ul>
      </figure>

      <ProvinceDetail active={active} />
    </div>
  )
}

function ProvinceDetail({ active }: { active: ProvinceUnit | null }) {
  if (!active) {
    return (
      <div className="flex min-h-[180px] flex-col justify-center rounded-2xl border border-dashed border-line bg-panel2 p-6 text-center font-mono text-sm text-muted">
        Hover or tap a province to see the places I've been.
      </div>
    )
  }

  const hasPlaces = active.places.length > 0
  const remaining = active.count - active.places.length

  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="flex items-start justify-between gap-3 border-b border-line pb-3">
        <div className="min-w-0">
          <h3 className="m-0 text-[20px] tracking-[-0.03em] text-ink">
            {active.name}
          </h3>
          {active.mergedFrom.length > 0 && (
            <p className="mt-1 mb-0 font-mono text-[11px] text-muted">
              incl. {active.mergedFrom.join(', ')}
            </p>
          )}
        </div>
        <span className="flex-none rounded-md border border-line bg-panel px-2 py-1 font-mono text-[11px] text-ink">
          {active.visited ? `${active.count} places` : 'not visited'}
        </span>
      </div>

      {active.visited && !hasPlaces && (
        <p className="mt-3 mb-0 font-mono text-sm text-muted">
          Been here — no spots logged yet.
        </p>
      )}

      {hasPlaces && (
        <ul className="mt-3 grid gap-2 p-0">
          {active.places.map((place) => (
            <li
              key={place.name}
              className="flex items-baseline gap-2 list-none text-[14px] text-ink"
            >
              <span aria-hidden="true" className="text-muted">
                —
              </span>
              <span className="min-w-0">
                {place.name}
                {place.origProvince && (
                  <span className="ml-1.5 font-mono text-[11px] text-muted">
                    ({place.origProvince})
                  </span>
                )}
              </span>
            </li>
          ))}
          {remaining > 0 && (
            <li className="list-none font-mono text-[11px] text-muted">
              + {remaining} more not listed
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
