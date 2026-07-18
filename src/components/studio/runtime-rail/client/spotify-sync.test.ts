// @ts-nocheck -- Bun's test globals are not part of the Astro app tsconfig.
import { describe, expect, test } from 'bun:test'
import {
  createSpotifySync,
  SPOTIFY_REFRESH_INTERVAL,
  type SpotifySyncEnvironment,
} from './spotify-sync'

type Listener = () => void

class FakeEnvironment implements SpotifySyncEnvironment {
  visible = true
  rail: Element | null = {} as Element
  readonly errors: unknown[] = []
  readonly windowListeners = new Map<string, Listener[]>()
  readonly documentListeners = new Map<string, Listener[]>()
  readonly intervals: Array<{ callback: Listener; delay: number }> = []

  getRail = () => this.rail
  isVisible = () => this.visible

  addWindowListener = (type: 'focus' | 'online', listener: Listener) => {
    const listeners = this.windowListeners.get(type) ?? []
    listeners.push(listener)
    this.windowListeners.set(type, listeners)
  }

  addDocumentListener = (type: 'visibilitychange', listener: Listener) => {
    const listeners = this.documentListeners.get(type) ?? []
    listeners.push(listener)
    this.documentListeners.set(type, listeners)
  }

  setInterval = (callback: Listener, delay: number) => {
    this.intervals.push({ callback, delay })
  }

  reportError = (error: unknown) => {
    this.errors.push(error)
  }

  emitWindow(type: 'focus' | 'online') {
    for (const listener of this.windowListeners.get(type) ?? []) listener()
  }

  emitDocument(type: 'visibilitychange') {
    for (const listener of this.documentListeners.get(type) ?? []) listener()
  }

  tick() {
    for (const interval of this.intervals) interval.callback()
  }
}

const flush = () => new Promise<void>((resolve) => queueMicrotask(resolve))

describe('Spotify runtime sync', () => {
  test('refreshes on start, focus, visibility, online, and a 15-second interval', async () => {
    const environment = new FakeEnvironment()
    let calls = 0
    const sync = createSpotifySync(async () => {
      calls += 1
    }, environment)

    sync.start()
    await flush()
    expect(calls).toBe(1)
    expect(environment.intervals).toHaveLength(1)
    expect(environment.intervals[0]?.delay).toBe(SPOTIFY_REFRESH_INTERVAL)

    environment.emitWindow('focus')
    await flush()
    expect(calls).toBe(2)

    environment.emitWindow('online')
    await flush()
    expect(calls).toBe(3)

    environment.visible = false
    environment.emitDocument('visibilitychange')
    environment.tick()
    await flush()
    expect(calls).toBe(3)

    environment.visible = true
    environment.emitDocument('visibilitychange')
    await flush()
    expect(calls).toBe(4)

    environment.tick()
    await flush()
    expect(calls).toBe(5)
  })

  test('deduplicates focus, navigation, and interval refreshes while one is in flight', async () => {
    const environment = new FakeEnvironment()
    let calls = 0
    let resolveRequest: (() => void) | undefined
    const sync = createSpotifySync(
      () => {
        calls += 1
        return new Promise<void>((resolve) => {
          resolveRequest = resolve
        })
      },
      environment,
    )

    sync.start()
    sync.start()
    environment.emitWindow('focus')
    environment.emitWindow('online')
    environment.tick()
    expect(calls).toBe(1)
    expect(environment.windowListeners.get('focus')).toHaveLength(1)
    expect(environment.windowListeners.get('online')).toHaveLength(1)
    expect(environment.documentListeners.get('visibilitychange')).toHaveLength(1)
    expect(environment.intervals).toHaveLength(1)

    resolveRequest?.()
    await flush()
    environment.emitWindow('focus')
    expect(calls).toBe(2)
  })

  test('skips refreshes when the rail is not rendered', async () => {
    const environment = new FakeEnvironment()
    environment.rail = null
    let calls = 0
    const sync = createSpotifySync(async () => {
      calls += 1
    }, environment)

    sync.start()
    environment.emitWindow('focus')
    environment.tick()
    await flush()
    expect(calls).toBe(0)

    environment.rail = {} as Element
    environment.emitWindow('focus')
    await flush()
    expect(calls).toBe(1)
  })

  test('reports refresh failures without blocking the next refresh', async () => {
    const environment = new FakeEnvironment()
    let calls = 0
    const failure = new Error('Spotify failed')
    const sync = createSpotifySync(async () => {
      calls += 1
      if (calls === 1) throw failure
    }, environment)

    sync.start()
    await flush()
    await flush()
    expect(environment.errors).toEqual([failure])

    environment.emitWindow('focus')
    await flush()
    expect(calls).toBe(2)
  })
})
