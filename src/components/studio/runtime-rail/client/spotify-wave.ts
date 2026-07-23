type Listener = () => void

type RouteSwapEvent = 'astro:before-swap' | 'astro:after-swap'

interface AnimationSnapshot {
  animation: Animation
  currentTime: number
  capturedAt: number
  playState: AnimationPlayState
}

export interface SpotifyWaveEnvironment {
  getAnimations: () => Animation[]
  now: () => number
  schedule: (listener: Listener) => void
  addDocumentListener: (type: RouteSwapEvent, listener: Listener) => void
}

export function createSpotifyWavePersistence(
  environment: SpotifyWaveEnvironment,
) {
  let started = false
  let snapshots: AnimationSnapshot[] = []

  function capture() {
    const capturedAt = environment.now()
    snapshots = environment
      .getAnimations()
      .flatMap((animation) =>
        typeof animation.currentTime === 'number'
          ? [
              {
                animation,
                currentTime: animation.currentTime,
                capturedAt,
                playState: animation.playState,
              },
            ]
          : [],
      )
  }

  function restore() {
    environment.schedule(() => {
      const animations = environment.getAnimations()
      const restoredAt = environment.now()

      for (const [index, animation] of animations.entries()) {
        const snapshot = snapshots[index]
        if (!snapshot || animation === snapshot.animation) continue

        const elapsed =
          snapshot.playState === 'running'
            ? restoredAt - snapshot.capturedAt
            : 0
        animation.currentTime = snapshot.currentTime + elapsed
      }

      snapshots = []
    })
  }

  function start() {
    if (started) return
    started = true
    environment.addDocumentListener('astro:before-swap', capture)
    environment.addDocumentListener('astro:after-swap', restore)
  }

  return { start }
}

const browserSpotifyWavePersistence = createSpotifyWavePersistence({
  getAnimations: () =>
    Array.from(document.querySelectorAll<HTMLElement>('[data-spotify-eq] span'))
      .map((bar) => bar.getAnimations()[0])
      .filter((animation): animation is Animation => Boolean(animation)),
  now: () => performance.now(),
  schedule: (listener) => requestAnimationFrame(() => listener()),
  addDocumentListener: (type, listener) =>
    document.addEventListener(type, listener),
})

export function preserveSpotifyWave() {
  browserSpotifyWavePersistence.start()
}
