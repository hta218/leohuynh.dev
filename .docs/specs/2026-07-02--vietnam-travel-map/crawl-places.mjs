// Re-crawl the owner's gody.vn My Travel Map and regenerate json/places.json.
//
// Run from the repo root:  node .docs/specs/2026-07-02--vietnam-travel-map/crawl-places.mjs
//
// Flow: GET the profile loader (grab _token + session cookie) → POST the same
// URL with hash=#ban-do-viet-nam (that hash selects the Vietnam travel-map SSR)
// → parse the province headers + place tiles → map old-63 provinces onto the
// new-34 units via json/vietnam-provinces.geojson's `mergedFrom` → aggregate →
// write json/places.json. gody caps each province's public name list at 5, so
// high-count units come out `placesPartial` (the real total is data-total-place).
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '../../..')
const PROFILE = 'https://gody.vn/blog/huynhtuananh218951440'
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'

async function fetchMapHtml() {
  const loaderRes = await fetch(PROFILE, { headers: { 'User-Agent': UA } })
  const cookie = (loaderRes.headers.getSetCookie?.() ?? [])
    .map((c) => c.split(';')[0])
    .join('; ')
  const loader = await loaderRes.text()
  const token = loader.match(/name="_token" value="([^"]+)"/)?.[1]
  if (!token) throw new Error('no _token in loader page')

  const body = new URLSearchParams({ _token: token, hash: '#ban-do-viet-nam' })
  const res = await fetch(PROFILE, {
    method: 'POST',
    headers: {
      'User-Agent': UA,
      'Content-Type': 'application/x-www-form-urlencoded',
      Referer: PROFILE,
      Cookie: cookie,
    },
    body,
  })
  return res.text()
}

// fold Vietnamese diacritics + drop a leading "tp" for fuzzy name matching
const fold = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/^tp\s+/, '')
    .trim()

function buildPlaces(html) {
  const geo = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'json/vietnam-provinces.geojson'), 'utf8'),
  )
  const nameToUnit = new Map()
  for (const f of geo.features) {
    const u = { id: f.properties.id, name: f.properties.name }
    nameToUnit.set(fold(u.name), u)
    for (const old of f.properties.mergedFrom ?? []) nameToUnit.set(fold(old), u)
  }

  // province headers: slug, display name, true "Đã đến" count
  const oldProv = new Map()
  const headerRe =
    /<h3[^>]*>([^<]+)<\/h3>[\s\S]{0,400}?province\?province=([a-z0-9-]+)&country=viet-nam[\s\S]{0,200}?Đã đến:\s*<span[^>]*>(\d+)<\/span>/g
  for (let m; (m = headerRe.exec(html)); ) {
    const [, name, slug, count] = m
    const cur = oldProv.get(slug)
    if (!cur || +count > cur.count)
      oldProv.set(slug, { slug, name: name.trim(), count: +count, places: [] })
  }

  // up-to-5 shown place titles per province
  const placeRe =
    /data-poi_id="[^"]*"\s+data-province="([^"]+)"[\s\S]{0,600}?data-place-title\s*=\s*"([^"]+)"/g
  const seen = new Set()
  for (let m; (m = placeRe.exec(html)); ) {
    const slug = m[1]
    const title = m[2].replace(/&amp;/g, '&').trim()
    const key = `${slug}::${title}`
    if (seen.has(key)) continue
    seen.add(key)
    oldProv.get(slug)?.places.push(title)
  }

  // aggregate old provinces onto new units
  const units = new Map()
  const unmapped = []
  for (const p of oldProv.values()) {
    const unit = nameToUnit.get(fold(p.name))
    if (!unit) {
      unmapped.push(p.name)
      continue
    }
    let rec = units.get(unit.id)
    if (!rec) {
      rec = { unit: unit.name, id: unit.id, count: 0, mergedFrom: [], places: [] }
      units.set(unit.id, rec)
    }
    rec.count += p.count
    const isBase = fold(p.name) === fold(rec.unit)
    if (!isBase) rec.mergedFrom.push(p.name)
    for (const name of p.places)
      rec.places.push(isBase ? { name } : { name, origProvince: p.name })
  }
  if (unmapped.length) throw new Error(`unmapped provinces: ${unmapped.join(', ')}`)

  return [...units.values()]
    .sort((a, b) => b.count - a.count)
    .map((r) => {
      const rec = {
        unit: r.unit,
        id: r.id,
        count: r.count,
        mergedFrom: r.mergedFrom,
        places: r.places,
      }
      if (r.count > r.places.length) rec.placesPartial = true
      return rec
    })
}

const html = await fetchMapHtml()
const out = buildPlaces(html)
fs.writeFileSync(
  path.join(ROOT, 'json/places.json'),
  `${JSON.stringify(out, null, 2)}\n`,
)
const totalPlaces = out.reduce((s, r) => s + r.count, 0)
console.log(
  `wrote json/places.json — ${out.length}/34 units, ${((out.length / 34) * 100).toFixed(2)}%, ${totalPlaces} places`,
)
