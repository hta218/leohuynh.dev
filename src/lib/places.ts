import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Travel data for the `/heatmap` page. Province geometry is projected at build
 * time in the page (d3-geo over `json/vietnam-provinces.geojson`); this loader
 * only carries the hand-editable visit snapshot (`json/places.json`), keyed by
 * `id` so the page can merge it onto the projected units. Mirrors the shelf/media
 * pattern: a local JSON snapshot is the source of truth, no database.
 */

export const TOTAL_UNITS = 34

export interface Place {
  name: string
  photo?: string
  /** Pre-2025 province this spot was checked in under, if merged. */
  origProvince?: string
}

/** A projected provincial unit: geometry (from the page) + visit snapshot. */
export interface ProvinceUnit {
  /** Official GSO province code (unique). */
  code: string
  /** kebab-case slug — matches `id` in the GeoJSON and `json/places.json`. */
  id: string
  name: string
  /** Old (pre-2025) provinces merged into this unit. */
  mergedFrom: string[]
  /** SVG-space centroid, set when the page projects the geometry. */
  cx: number
  cy: number
  /** SVG path data, set when the page projects the geometry. */
  d: string
  /** Number of places checked in (0 when visited with no logged spots). */
  count: number
  /** Present in the snapshot at all (a visited unit). */
  visited: boolean
  /** `count` exceeds the listed `places` (gody truncated the public list). */
  placesPartial: boolean
  places: Place[]
}

/** One visited unit's snapshot, keyed by `id` for lookup against the GeoJSON. */
export interface PlacesSnapshot {
  id: string
  count: number
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

/** Visited-unit snapshots from `json/places.json` (only the units I've been to). */
export function getPlaces(): PlacesSnapshot[] {
  try {
    const file = resolve(process.cwd(), 'json/places.json')
    const records = JSON.parse(readFileSync(file, 'utf-8')) as PlacesRecord[]
    return records.map((record) => ({
      id: record.id,
      count: record.count ?? 0,
      placesPartial: record.placesPartial ?? false,
      places: record.places ?? [],
    }))
  } catch (error) {
    console.error('[lib/places] failed to read json/places.json', error)
    return []
  }
}

export interface TravelStats {
  visited: number
  total: number
  percent: number
  totalPlaces: number
}

export function getTravelStats(
  units: { visited: boolean; count: number }[],
): TravelStats {
  const visited = units.filter((unit) => unit.visited).length
  const totalPlaces = units.reduce((sum, unit) => sum + unit.count, 0)
  return {
    visited,
    total: TOTAL_UNITS,
    percent: Math.round((visited / TOTAL_UNITS) * 1000) / 10,
    totalPlaces,
  }
}
