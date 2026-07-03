import { useState } from 'react'
import type { ProvinceUnit } from '~/lib/places'
import { VIEWBOX } from './vietnam-provinces'

/**
 * Interactive SVG choropleth of Vietnam's 2025 34 provincial units. Provinces
 * are shaded by how many places were checked in on a sequential green ramp.
 * Hovering (desktop) previews a province in the side panel; clicking (or
 * tapping) pins it so the detail sticks after the pointer leaves. The page also
 * renders a plain province list server-side, so this island is progressive
 * enhancement only.
 */

interface Props {
  provinces: ProvinceUnit[]
}

const UNVISITED_FILL = '#eef2f6'
const VISITED_ZERO_FILL = '#dcfce7'
const ACTIVE_STROKE = '#14532d'

/** Sequential green ramp, densest first — `fill` picked by the first bucket cleared. */
const SHADES = [
  { min: 10, fill: '#14532d' },
  { min: 6, fill: '#15803d' },
  { min: 3, fill: '#22c55e' },
  { min: 1, fill: '#86efac' },
] as const

const LEGEND = [
  { label: 'Not visited', fill: UNVISITED_FILL },
  { label: 'Visited', fill: VISITED_ZERO_FILL },
  { label: '1–2', fill: '#86efac' },
  { label: '3–5', fill: '#22c55e' },
  { label: '6–9', fill: '#15803d' },
  { label: '10+', fill: '#14532d' },
] as const

/**
 * Hoàng Sa & Trường Sa archipelagos, drawn as labelled inset markers in the
 * East Sea (the source geometry clips far-offshore features). Positions are
 * cartographic convention, not exact projection.
 */
const ARCHIPELAGOS = [
  {
    name: 'Hoàng Sa',
    box: { x: 715, y: 690, w: 220, h: 150 },
    label: { x: 825, y: 825 },
    dots: [
      [770, 738],
      [810, 728],
      [850, 742],
      [798, 762],
      [840, 766],
      [878, 750],
    ],
  },
  {
    name: 'Trường Sa',
    box: { x: 820, y: 900, w: 170, h: 148 },
    label: { x: 905, y: 1033 },
    dots: [
      [858, 930],
      [898, 922],
      [938, 934],
      [876, 956],
      [916, 962],
      [956, 948],
      [902, 988],
    ],
  },
] as const

function fillFor(unit: ProvinceUnit): string {
  if (!unit.visited) return UNVISITED_FILL
  if (unit.count === 0) return VISITED_ZERO_FILL
  return (
    SHADES.find((shade) => unit.count >= shade.min)?.fill ?? VISITED_ZERO_FILL
  )
}

export default function VietnamMap({ provinces }: Props) {
  const [pinnedCode, setPinnedCode] = useState<string | null>(null)
  const [hoverCode, setHoverCode] = useState<string | null>(null)
  const activeCode = hoverCode ?? pinnedCode
  const active =
    provinces.find((province) => province.code === activeCode) ?? null

  function togglePin(code: string) {
    setPinnedCode((current) => (current === code ? null : code))
  }

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,300px)] md:items-start">
      <figure className="m-0 flex flex-col items-center">
        <svg
          viewBox={VIEWBOX}
          role="img"
          aria-label="Map of Vietnam's provinces, shaded by places I've visited"
          className="mx-auto block h-auto w-auto max-h-[78vh] max-w-full select-none"
          style={{ aspectRatio: '1000 / 1925' }}
          onMouseLeave={() => setHoverCode(null)}
        >
          {provinces.map((province) => (
            // biome-ignore lint/a11y/noStaticElementInteractions: SVG map regions are interactive by design; a full accessible province list is rendered below the map.
            <path
              key={province.code}
              d={province.d}
              fill={fillFor(province)}
              stroke="#ffffff"
              strokeWidth={0.8}
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
              onMouseEnter={() => setHoverCode(province.code)}
              onFocus={() => setHoverCode(province.code)}
              onBlur={() => setHoverCode(null)}
              onClick={() => togglePin(province.code)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  togglePin(province.code)
                }
              }}
            />
          ))}

          {/* Active province redrawn on top so its thick outline is never
              overpainted by a later-drawn neighbour (consistent on all edges). */}
          {active && (
            <path
              d={active.d}
              fill={fillFor(active)}
              stroke={ACTIVE_STROKE}
              strokeWidth={2.4}
              strokeLinejoin="round"
              style={{ pointerEvents: 'none' }}
            />
          )}

          {ARCHIPELAGOS.map((group) => (
            <g key={group.name}>
              <rect
                x={group.box.x}
                y={group.box.y}
                width={group.box.w}
                height={group.box.h}
                rx={14}
                fill="none"
                stroke="#cbd5e1"
                strokeWidth={1.6}
                strokeDasharray="7 7"
              />
              {group.dots.map(([cx, cy]) => (
                <circle
                  key={`${cx}-${cy}`}
                  cx={cx}
                  cy={cy}
                  r={5.5}
                  fill="#94a3b8"
                />
              ))}
              <text
                x={group.label.x}
                y={group.label.y}
                textAnchor="middle"
                fontSize={30}
                fill="#475569"
                style={{ fontFamily: 'monospace' }}
              >
                {group.name}
              </text>
            </g>
          ))}
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
        Hover or click a province to see the places I've been.
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
              + {remaining} not listed on gody
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
