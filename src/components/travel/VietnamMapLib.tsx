import { type MouseEvent, useRef, useState } from 'react'
import type { ProvinceUnit } from '~/lib/places'

/**
 * Experimental map-library variant of the heatmap (route `/heatmap-lab`).
 * Province paths are projected at build time with d3-geo's geoMercator straight
 * from a GeoJSON that still carries the real Hoàng Sa / Trường Sa geometry, so
 * the archipelagos land at their true positions. Paths + viewBox come in as
 * props from the page. Hovering shows the province name in a tooltip at the
 * cursor; clicking selects it and fills the detail card, which floats over the
 * empty sea to the right of the mainland. Isolated on purpose; delete to discard.
 */

export interface Neighbour {
  name: string
  d: string
}

interface Props {
  provinces: ProvinceUnit[]
  neighbours: Neighbour[]
  viewBox: string
}

const UNVISITED_FILL = '#eef4f2'
const VISITED_ZERO_FILL = '#dcfce7'
const ACTIVE_STROKE = '#14532d'
const SEA_FILL = '#a8d5f2'
const LAND_FILL = '#e5e8ee'
const LAND_STROKE = '#d8dce3'

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

function fillFor(unit: ProvinceUnit): string {
  if (!unit.visited) return UNVISITED_FILL
  if (unit.count === 0) return VISITED_ZERO_FILL
  return (
    SHADES.find((shade) => unit.count >= shade.min)?.fill ?? VISITED_ZERO_FILL
  )
}

export default function VietnamMapLib({
  provinces,
  neighbours,
  viewBox,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedCode, setSelectedCode] = useState<string | null>(null)
  const [hoverCode, setHoverCode] = useState<string | null>(null)
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null)
  const selected =
    provinces.find((province) => province.code === selectedCode) ?? null
  const hovered =
    provinces.find((province) => province.code === hoverCode) ?? null

  const [, , vbW, vbH] = viewBox.split(' ')

  function toggleSelect(code: string) {
    setSelectedCode((current) => (current === code ? null : code))
  }

  function handlePointerMove(event: MouseEvent<SVGSVGElement>) {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setPointer({ x: event.clientX - rect.left, y: event.clientY - rect.top })
  }

  function clearHover() {
    setHoverCode(null)
    setPointer(null)
  }

  return (
    <figure className="m-0">
      <div ref={containerRef} className="relative mx-auto w-full">
        <div className="overflow-hidden">
          <svg
            viewBox={viewBox}
            role="img"
            aria-label="Map of Vietnam's provinces, shaded by places I've visited"
            className="block h-auto w-full select-none"
            style={{ aspectRatio: `${vbW} / ${vbH}` }}
            onMouseMove={handlePointerMove}
            onMouseLeave={clearHover}
          >
            <defs>
              <filter id="vn-lift" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow
                  dx="0"
                  dy="3"
                  stdDeviation="6"
                  floodColor="#0f172a"
                  floodOpacity="0.22"
                />
              </filter>
            </defs>

            <rect x={0} y={0} width={vbW} height={vbH} fill={SEA_FILL} />

            {neighbours.map((neighbour) => (
              <path
                key={neighbour.name}
                d={neighbour.d}
                fill={LAND_FILL}
                stroke={LAND_STROKE}
                strokeWidth={0.6}
                strokeLinejoin="round"
                style={{ pointerEvents: 'none' }}
              />
            ))}

            <g filter="url(#vn-lift)">
              {provinces.map((province) => (
                // biome-ignore lint/a11y/noStaticElementInteractions: SVG map regions are interactive by design; a full accessible province list is rendered below the map.
                <path
                  key={province.code}
                  d={province.d}
                  fill={fillFor(province)}
                  stroke="#ffffff"
                  strokeWidth={0.6}
                  strokeLinejoin="round"
                  tabIndex={province.visited ? 0 : -1}
                  aria-label={`${province.name}, ${
                    province.visited
                      ? `${province.count} places`
                      : 'not visited'
                  }`}
                  style={{
                    cursor: province.visited ? 'pointer' : 'default',
                    outline: 'none',
                    transition: 'fill 120ms ease',
                  }}
                  onMouseEnter={() => setHoverCode(province.code)}
                  onMouseLeave={() => setHoverCode(null)}
                  onFocus={() => setHoverCode(province.code)}
                  onBlur={() => setHoverCode(null)}
                  onClick={() => toggleSelect(province.code)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      toggleSelect(province.code)
                    }
                  }}
                />
              ))}
            </g>

            {/* Selected province: persistent bold outline, redrawn on top so it
              stays marked even while hovering another province. */}
            {selected && (
              <path
                d={selected.d}
                fill={fillFor(selected)}
                stroke={ACTIVE_STROKE}
                strokeWidth={2}
                strokeLinejoin="round"
                style={{ pointerEvents: 'none' }}
              />
            )}

            {/* Hover preview: lighter outline, only when it isn't the selection. */}
            {hovered && hovered.code !== selectedCode && (
              <path
                d={hovered.d}
                fill={fillFor(hovered)}
                stroke={ACTIVE_STROKE}
                strokeWidth={1.2}
                strokeLinejoin="round"
                style={{ pointerEvents: 'none', opacity: 0.75 }}
              />
            )}
          </svg>
        </div>

        {/* Hover tooltip: province name following the cursor. */}
        {hovered && pointer && (
          <div
            className="pointer-events-none absolute z-20 rounded-md border border-line bg-ink px-2 py-1 font-mono text-[11px] whitespace-nowrap text-white shadow-sm"
            style={{ left: pointer.x + 14, top: pointer.y + 14 }}
          >
            {hovered.name}
          </div>
        )}

        {/* Stacked below the map on mobile; floats over the sea on desktop. */}
        <div className="mt-6 w-full md:pointer-events-none md:absolute md:top-[5%] md:right-[15%] md:mt-0 md:w-[min(300px,42%)]">
          <ProvinceDetail active={selected} />
        </div>
      </div>

      <ul className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 p-0 font-mono text-[11px] text-muted">
        {LEGEND.map((item) => (
          <li key={item.label} className="flex items-center gap-1.5 list-none">
            <span
              className="inline-block h-3 w-3 rounded-[3px] border border-line"
              style={{ backgroundColor: item.fill }}
            />
            {item.label}
          </li>
        ))}
      </ul>
    </figure>
  )
}

function ProvinceDetail({ active }: { active: ProvinceUnit | null }) {
  if (!active) {
    return (
      <div className="flex min-h-45 flex-col justify-center rounded-2xl border border-dashed border-line bg-white/95 p-6 text-center font-mono text-sm text-muted shadow-[4px_4px_0_var(--color-line)] backdrop-blur-sm">
        Click a province to see the places I've been.
      </div>
    )
  }

  const hasPlaces = active.places.length > 0
  const remaining = active.count - active.places.length

  return (
    <div className="max-h-[70vh] overflow-auto rounded-2xl border border-line bg-white/95 p-5 shadow-[4px_4px_0_var(--color-line)] backdrop-blur-sm">
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
              {remaining} more listed on gody
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
