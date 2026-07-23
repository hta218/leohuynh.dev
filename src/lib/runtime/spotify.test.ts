// @ts-nocheck -- Bun's test globals are not part of the Astro app tsconfig.
import { describe, expect, test } from 'bun:test'
import { spotifyTokenFailureMessage } from './spotify'

describe('spotifyTokenFailureMessage', () => {
  test('reports revoked authorization separately from missing credentials', async () => {
    const response = new Response(
      JSON.stringify({
        error: 'invalid_grant',
        error_description: 'Refresh token revoked',
      }),
      {
        status: 400,
        headers: { 'content-type': 'application/json' },
      },
    )

    await expect(spotifyTokenFailureMessage(response)).resolves.toBe(
      'Spotify authorization needs to be renewed.',
    )
  })

  test('uses a safe generic message for other token endpoint failures', async () => {
    const response = new Response('upstream unavailable', { status: 503 })

    await expect(spotifyTokenFailureMessage(response)).resolves.toBe(
      'Spotify token refresh failed.',
    )
  })
})
