import { ASSET_BASE } from './constants'

export type SfxName = 'move' | 'nav' | 'select' | 'start' | 'nope'

const SFX_SRC: Record<SfxName, string> = {
  move: `${ASSET_BASE}/audio/sfx/move.mp3`,
  nav: `${ASSET_BASE}/audio/sfx/nav.mp3`,
  select: `${ASSET_BASE}/audio/sfx/select.mp3`,
  start: `${ASSET_BASE}/audio/sfx/start.mp3`,
  nope: `${ASSET_BASE}/audio/sfx/nope.mp3`,
}

export const MUSIC = {
  menu: `${ASSET_BASE}/audio/bg.mp3`,
  levelPass: `${ASSET_BASE}/audio/level-pass.mp3`,
  victory: `${ASSET_BASE}/audio/victory.mp3`,
  cheer: `${ASSET_BASE}/audio/cheer.mp3`,
  heaven: `${ASSET_BASE}/audio/heaven.mp3`,
} as const

/**
 * Imperative audio manager kept outside React state. Browsers block autoplay
 * until a user gesture, so the first `playMusic` call must originate from a click.
 */
export class GameAudio {
  private music: HTMLAudioElement | null = null
  private sfx = new Map<SfxName, HTMLAudioElement>()
  private muted = false

  setMuted(muted: boolean): void {
    this.muted = muted
    if (this.music) this.music.muted = muted
  }

  isMuted(): boolean {
    return this.muted
  }

  /** Start a track, replacing whatever is currently playing. */
  playMusic(
    src: string,
    { loop = true, volume = 0.45 } = {},
  ): HTMLAudioElement {
    this.stopMusic()
    const el = new Audio(src)
    el.loop = loop
    el.volume = volume
    el.muted = this.muted
    this.music = el
    void el.play().catch(() => {})
    return el
  }

  stopMusic(): void {
    if (this.music) {
      this.music.pause()
      this.music = null
    }
  }

  sfxPlay(name: SfxName): void {
    if (this.muted) return
    let el = this.sfx.get(name)
    if (!el) {
      el = new Audio(SFX_SRC[name])
      el.volume = 0.7
      this.sfx.set(name, el)
    }
    try {
      el.currentTime = 0
      void el.play().catch(() => {})
    } catch {
      /* ignore rapid replays */
    }
  }

  dispose(): void {
    this.stopMusic()
    this.sfx.clear()
  }
}
