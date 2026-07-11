#!/usr/bin/env bun
/**
 * Generate the client-loaded Vietnam heatmap map data snapshot.
 *
 * The `/heatmap` route should not inline projected SVG path data into its HTML.
 * This script projects the GeoJSON once into `json/heatmap-map.json`; the React
 * map island imports that JSON in its own client bundle.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { geoMercator, geoPath } from 'd3-geo'
import { getPlaces, type ProvinceUnit } from '../src/lib/places'
import type { Neighbour } from '../src/components/travel/VietnamMap'

interface GeoFeature {
  type: 'Feature'
  properties: { id: string; code: string; name: string; mergedFrom: string[] }
  geometry: { type: 'MultiPolygon'; coordinates: number[][][][] }
}

interface NeighbourFeature {
  type: 'Feature'
  properties: { name: string; iso: string }
  geometry: { type: 'MultiPolygon'; coordinates: number[][][][] }
}

function readGeo<T>(file: string): { features: T[] } {
  return JSON.parse(readFileSync(resolve(process.cwd(), file), 'utf-8')) as {
    features: T[]
  }
}

const FRAME = { west: 98.5, south: 5.5, east: 119.5, north: 24 }
const frameCorners = {
  type: 'MultiPoint',
  coordinates: [
    [FRAME.west, FRAME.south],
    [FRAME.east, FRAME.north],
  ],
}
const mercY = (lat: number) =>
  Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360))
const WIDTH = 1200
const HEIGHT = Math.round(
  (WIDTH * (mercY(FRAME.north) - mercY(FRAME.south))) /
    (((FRAME.east - FRAME.west) * Math.PI) / 180),
)

const projection = geoMercator().fitSize([WIDTH, HEIGHT], frameCorners as never)
const pathGen = geoPath(projection)
const byId = new Map(getPlaces().map((snapshot) => [snapshot.id, snapshot]))

const provincesGeo = readGeo<GeoFeature>('json/vietnam-provinces.geojson')
const neighboursGeo = readGeo<NeighbourFeature>('json/neighbours.geojson')

const provinces: ProvinceUnit[] = provincesGeo.features.map((feature) => {
  const snapshot = byId.get(feature.properties.id)
  const [cx, cy] = pathGen.centroid(feature as never)
  return {
    code: feature.properties.code,
    id: feature.properties.id,
    name: feature.properties.name,
    mergedFrom: feature.properties.mergedFrom,
    cx,
    cy,
    d: pathGen(feature as never) ?? '',
    count: snapshot?.count ?? 0,
    visited: snapshot != null,
    placesPartial: snapshot?.placesPartial ?? false,
    places: snapshot?.places ?? [],
  }
})

const neighbours: Neighbour[] = neighboursGeo.features
  .map((feature) => ({
    name: feature.properties.name,
    d: pathGen(feature as never) ?? '',
  }))
  .filter((neighbour) => neighbour.d)

const out = {
  viewBox: `0 0 ${WIDTH} ${HEIGHT}`,
  provinces,
  neighbours,
}

writeFileSync(
  resolve(process.cwd(), 'json/heatmap-map.json'),
  `${JSON.stringify(out, null, 2)}\n`,
)
console.log(
  `Wrote ${provinces.length} provinces and ${neighbours.length} neighbours to json/heatmap-map.json`,
)
