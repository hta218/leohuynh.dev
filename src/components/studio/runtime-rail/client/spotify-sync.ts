import { refreshSpotify } from './spotify'
import { preserveSpotifyWave } from './spotify-wave'

export const SPOTIFY_REFRESH_INTERVAL = 15 * 1000

type Listener = () => void

export interface SpotifySyncEnvironment {
  getRail: () => Element | null
  isVisible: () => boolean
  addWindowListener: (type: 'focus' | 'online', listener: Listener) => void
  addDocumentListener: (
    type: 'visibilitychange',
    listener: Listener,
  ) => void
  setInterval: (callback: Listener, delay: number) => void
  reportError: (error: unknown) => void
}

export function createSpotifySync(
  refresh: (rail: Element) => Promise<void>,
  environment: SpotifySyncEnvironment,
) {
  let started = false
  let inFlight: Promise<void> | null = null

  function refreshCurrent(): Promise<void> {
    if (!environment.isVisible()) return Promise.resolve()
    if (inFlight) return inFlight

    const rail = environment.getRail()
    if (!rail) return Promise.resolve()

    let request: Promise<void>
    try {
      request = Promise.resolve(refresh(rail))
    } catch (error) {
      environment.reportError(error)
      return Promise.resolve()
    }
    const tracked = request
      .catch((error) => environment.reportError(error))
      .finally(() => {
        if (inFlight === tracked) inFlight = null
      })
    inFlight = tracked
    return tracked
  }

  function start() {
    void refreshCurrent()
    if (started) return
    started = true

    environment.addWindowListener('focus', () => void refreshCurrent())
    environment.addWindowListener('online', () => void refreshCurrent())
    environment.addDocumentListener('visibilitychange', () => {
      if (environment.isVisible()) void refreshCurrent()
    })
    environment.setInterval(() => void refreshCurrent(), SPOTIFY_REFRESH_INTERVAL)
  }

  return { start }
}

const browserEnvironment: SpotifySyncEnvironment = {
  getRail: () => {
    const rail = document.querySelector('#runtime-rail')
    return rail && rail.getClientRects().length > 0 ? rail : null
  },
  isVisible: () => document.visibilityState !== 'hidden',
  addWindowListener: (type, listener) => window.addEventListener(type, listener),
  addDocumentListener: (type, listener) =>
    document.addEventListener(type, listener),
  setInterval: (callback, delay) => {
    window.setInterval(callback, delay)
  },
  reportError: (error) => console.warn('[spotify-sync] refresh failed', error),
}

const browserSpotifySync = createSpotifySync(
  refreshSpotify,
  browserEnvironment,
)

export function syncSpotify() {
  preserveSpotifyWave()
  browserSpotifySync.start()
}
