// @ts-nocheck -- Bun's test globals are not part of the Astro app tsconfig.
import { expect, test } from 'bun:test'
import { noStoreJsonHeaders } from './shared'

test('noStoreJsonHeaders prevents browser and shared CDN caching', () => {
  expect(noStoreJsonHeaders()).toEqual({
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'private, no-store, max-age=0',
  })
})
