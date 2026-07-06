import type { ProvinceUnit } from '~/lib/places'

/**
 * Province cards for the heatmap page. Each card lists up to `MAX_PLACES` of the
 * checked-in spots; when a province has more, a plain note points to gody (which
 * lists them all) rather than expanding inline. Fully static — no interactivity,
 * so it renders to HTML with no client JS.
 */

const MAX_PLACES = 5

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
  const shown = unit.places.slice(0, MAX_PLACES)
  const remaining = unit.count - shown.length
  // One representative cover per province — the first checked-in spot with a photo.
  const cover = unit.places.find((place) => place.photo)?.photo

  return (
    <li className="list-none">
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white">
        {cover && (
          <img
            src={cover}
            alt=""
            loading="lazy"
            className="block aspect-video w-full object-cover"
          />
        )}

        <div className="flex flex-1 flex-col p-4">
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

          {shown.length > 0 && (
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

          {remaining > 0 && (
            <p className="mt-auto pt-2.5 mb-0 font-mono text-[11px] text-muted">
              {`${remaining} more listed on gody`}
            </p>
          )}
        </div>
      </div>
    </li>
  )
}
