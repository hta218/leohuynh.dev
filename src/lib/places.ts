import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  PROVINCE_GEOMETRY,
  type ProvinceGeometry,
  VIEWBOX,
} from '~/components/travel/vietnam-provinces'

/**
 * Loader for `/travel`. Merges the static 2025 34-unit province geometry
 * (`vietnam-provinces.ts`) with the owner's visited snapshot (`json/places.json`,
 * seeded from the gody.vn My Travel Map profile). Mirrors the `lib/media`
 * shelf pattern: a local JSON snapshot is the source of truth, hand-editable,
 * no database. Provinces absent from the snapshot render as "not visited".
 */

export const TOTAL_UNITS = 34
export { VIEWBOX }

export interface Place {
  name: string
  photo?: string
  /** Pre-2025 province this spot was checked in under, if merged. */
  origProvince?: string
}

export interface ProvinceUnit extends ProvinceGeometry {
  /** Number of places checked in (0 when visited with no logged spots). */
  count: number
  /** Present in the snapshot at all (a visited unit). */
  visited: boolean
  /** `count` exceeds the listed `places` (gody truncated the public list). */
  placesPartial: boolean
  places: Place[]
}

interface PlacesRecord {
  unit: string
  id: string
  count?: number
  mergedFrom?: string[]
  placesPartial?: boolean
  places?: Place[]
}

function readPlaces(): PlacesRecord[] {
  try {
    const file = resolve(process.cwd(), 'json/places.json')
    return JSON.parse(readFileSync(file, 'utf-8')) as PlacesRecord[]
  } catch (error) {
    console.error('[lib/places] failed to read json/places.json', error)
    return []
  }
}

/** All 34 units with visited state merged in, sorted by visit count desc. */
export function getPlaces(): ProvinceUnit[] {
  const records = new Map(readPlaces().map((record) => [record.id, record]))
  return PROVINCE_GEOMETRY.map((geo) => {
    const record = records.get(geo.id)
    return {
      ...geo,
      count: record?.count ?? 0,
      visited: record != null,
      placesPartial: record?.placesPartial ?? false,
      places: record?.places ?? [],
    }
  }).sort((a, b) => b.count - a.count)
}

export interface TravelStats {
  visited: number
  total: number
  percent: number
  totalPlaces: number
}

export function getTravelStats(units: ProvinceUnit[]): TravelStats {
  const visited = units.filter((unit) => unit.visited).length
  const totalPlaces = units.reduce((sum, unit) => sum + unit.count, 0)
  return {
    visited,
    total: TOTAL_UNITS,
    percent: Math.round((visited / TOTAL_UNITS) * 1000) / 10,
    totalPlaces,
  }
}
