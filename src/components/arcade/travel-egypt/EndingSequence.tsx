import { useEffect, useRef, useState } from 'react'
import { type GameAudio, MUSIC } from '~/lib/arcade/travel-egypt/audio'
import { ASSET_BASE } from '~/lib/arcade/travel-egypt/constants'

const FINALS = Array.from(
  { length: 8 },
  (_, i) => `${ASSET_BASE}/images/victory/final-${i + 1}.jpg`,
)
const SLIDE_INTERVAL = 1700

interface EndingSequenceProps {
  audio: GameAudio
  onFinish: () => void
}

/**
 * The victory slideshow: a cheer cue, then the eight `final` frames over a looping
 * "Heaven" track, then it hands off to the ending card via `onFinish`. `onFinish`
 * is read through a ref so re-renders of the parent don't restart the sequence.
 */
export function EndingSequence({ audio, onFinish }: EndingSequenceProps) {
  const [index, setIndex] = useState(0)
  const onFinishRef = useRef(onFinish)
  onFinishRef.current = onFinish

  useEffect(() => {
    audio.playMusic(MUSIC.cheer, { loop: false, volume: 0.6 })
    const toHeaven = setTimeout(
      () => audio.playMusic(MUSIC.heaven, { loop: true, volume: 0.5 }),
      2600,
    )
    let i = 0
    const tick = setInterval(() => {
      i += 1
      if (i >= FINALS.length) {
        clearInterval(tick)
        return
      }
      setIndex(i)
    }, SLIDE_INTERVAL)
    const done = setTimeout(
      () => onFinishRef.current(),
      FINALS.length * SLIDE_INTERVAL + 1400,
    )
    return () => {
      clearTimeout(toHeaven)
      clearInterval(tick)
      clearTimeout(done)
    }
  }, [audio])

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative aspect-[3/2] w-full max-w-160 overflow-hidden rounded-xl border border-line bg-black shadow-[0_20px_50px_-28px_rgba(15,23,42,0.6)]">
        {FINALS.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
            style={{ opacity: i === index ? 1 : 0 }}
          />
        ))}
      </div>
      <p className="font-mono text-sm text-muted" aria-live="polite">
        You freed the gods of Egypt…
      </p>
      <button
        type="button"
        onClick={() => onFinishRef.current()}
        className="cursor-pointer rounded-lg border border-line bg-white px-4 py-2 font-mono text-xs text-slate-600 transition-colors hover:border-ink hover:text-ink"
      >
        Skip →
      </button>
    </div>
  )
}
