// @ts-nocheck -- Bun's test globals are not part of the Astro app tsconfig.
import { describe, expect, test } from 'bun:test'
import {
  createSpotifyWavePersistence,
  type SpotifyWaveEnvironment,
} from './spotify-wave'

type Listener = () => void

class FakeWaveEnvironment implements SpotifyWaveEnvironment {
  nowValue = 0
  animations: Animation[] = []
  readonly listeners = new Map<string, Listener[]>()
  readonly scheduled: Listener[] = []

  getAnimations = () => this.animations
  now = () => this.nowValue
  schedule = (listener: Listener) => {
    this.scheduled.push(listener)
  }
  addDocumentListener = (type: string, listener: Listener) => {
    const listeners = this.listeners.get(type) ?? []
    listeners.push(listener)
    this.listeners.set(type, listeners)
  }

  emit(type: 'astro:before-swap' | 'astro:after-swap') {
    for (const listener of this.listeners.get(type) ?? []) listener()
  }

  flushScheduled() {
    for (const listener of this.scheduled.splice(0)) listener()
  }
}

function fakeAnimation(currentTime: number, playState = 'running') {
  return { currentTime, playState } as Animation
}

describe('Spotify wave persistence', () => {
  test('restores a recreated running animation at its continuous timeline', () => {
    const environment = new FakeWaveEnvironment()
    const original = fakeAnimation(420)
    environment.animations = [original]
    environment.nowValue = 1000
    const persistence = createSpotifyWavePersistence(environment)

    persistence.start()
    environment.emit('astro:before-swap')

    const recreated = fakeAnimation(0)
    environment.animations = [recreated]
    environment.nowValue = 1060
    environment.emit('astro:after-swap')
    environment.flushScheduled()

    expect(recreated.currentTime).toBe(480)
  })

  test('does not overwrite an animation object that survived the route swap', () => {
    const environment = new FakeWaveEnvironment()
    const animation = fakeAnimation(420)
    environment.animations = [animation]
    const persistence = createSpotifyWavePersistence(environment)

    persistence.start()
    environment.emit('astro:before-swap')
    animation.currentTime = 500
    environment.emit('astro:after-swap')
    environment.flushScheduled()

    expect(animation.currentTime).toBe(500)
  })

  test('restores a paused animation without advancing it', () => {
    const environment = new FakeWaveEnvironment()
    environment.animations = [fakeAnimation(420, 'paused')]
    environment.nowValue = 1000
    const persistence = createSpotifyWavePersistence(environment)

    persistence.start()
    environment.emit('astro:before-swap')

    const recreated = fakeAnimation(0, 'paused')
    environment.animations = [recreated]
    environment.nowValue = 1200
    environment.emit('astro:after-swap')
    environment.flushScheduled()

    expect(recreated.currentTime).toBe(420)
  })

  test('registers route listeners only once', () => {
    const environment = new FakeWaveEnvironment()
    const persistence = createSpotifyWavePersistence(environment)

    persistence.start()
    persistence.start()

    expect(environment.listeners.get('astro:before-swap')).toHaveLength(1)
    expect(environment.listeners.get('astro:after-swap')).toHaveLength(1)
  })
})
