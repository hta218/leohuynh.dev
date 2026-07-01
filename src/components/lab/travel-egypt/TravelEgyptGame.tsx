import {
  ChampionIcon,
  Home01Icon,
  KeyboardIcon,
  PlayIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import {
  ASSET_BASE,
  MODE_LABEL,
  MODES,
  SOURCE_REPO,
  TOTAL_LEVELS,
} from '~/lib/lab/travel-egypt/constants'
import type {
  Mode,
  RunStats,
  SlideDirection,
} from '~/lib/lab/travel-egypt/types'
import { EndingSequence } from './EndingSequence'
import { GameHud, GameStats } from './GameHud'
import { PuzzleBoard } from './PuzzleBoard'
import { useTravelEgypt } from './use-travel-egypt'

const WELCOME_BG = `${ASSET_BASE}/images/bg/welcome.jpg`

const KEY_TO_DIR: Record<string, SlideDirection> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
}

const MODE_HINT: Record<Mode, string> = {
  easy: 'A gentle scramble',
  medium: 'A fair challenge',
  hard: 'A proper tangle',
}

function formatDuration(ms: number): string {
  const total = Math.round(ms / 1000)
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

export default function TravelEgyptGame() {
  const game = useTravelEgypt()
  const [hintOn, setHintOn] = useState(false)

  // A fresh level should start with the peek hidden again. Resetting during render
  // (rather than in an effect) keeps it in lock-step with the level change.
  const [hintLevel, setHintLevel] = useState(game.levelNo)
  if (hintLevel !== game.levelNo) {
    setHintLevel(game.levelNo)
    setHintOn(false)
  }

  // Keep a live handle to the game so the one-time key listener always sees fresh state.
  const gameRef = useRef(game)
  gameRef.current = game

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const current = gameRef.current
      if (current.phase !== 'playing') return
      const dir = KEY_TO_DIR[event.key]
      if (!dir) return
      event.preventDefault()
      current.slideDir(dir)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (game.phase === 'welcome') {
    return (
      <Screen>
        <div className="max-w-md">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-200/90">
            Sliding puzzle
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Travel Egypt
          </h2>
          <p className="mt-3 text-sm text-white/80">
            Slide the tiles back into place to rebuild each scene and meet the
            gods of Egypt across eight levels.
          </p>
          <button
            type="button"
            onClick={game.start}
            className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-ink shadow-lg transition-transform hover:-translate-y-0.5"
          >
            <HugeiconsIcon icon={PlayIcon} size={18} strokeWidth={2} />
            Let&rsquo;s go
          </button>
        </div>
      </Screen>
    )
  }

  if (game.phase === 'mode-select') {
    return (
      <Screen>
        <div className="w-full max-w-lg">
          <h2 className="text-2xl font-bold text-white">
            Choose your difficulty
          </h2>
          <p className="mt-2 text-sm text-white/75">
            Harder modes scramble the tiles further from home.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {MODES.map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => game.selectMode(mode)}
                className="cursor-pointer rounded-xl border border-white/25 bg-white/10 px-4 py-4 text-left backdrop-blur transition-colors hover:border-white hover:bg-white/20"
              >
                <span className="block font-semibold text-white">
                  {MODE_LABEL[mode]}
                </span>
                <span className="mt-1 block text-xs text-white/70">
                  {MODE_HINT[mode]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </Screen>
    )
  }

  if (game.phase === 'ending') {
    return <EndingSequence audio={game.audio} onFinish={game.finishEnding} />
  }

  if (game.phase === 'done' && game.stats) {
    return <EndingCard stats={game.stats} onPlayAgain={game.playAgain} />
  }

  // playing | level-cleared
  return (
    <div className="w-full">
      {/* Control bar on top. */}
      <GameHud
        muted={game.muted}
        hintOn={hintOn}
        canGoPrev={game.canGoPrev}
        canGoNext={game.canGoNext}
        onPrev={game.prevLevel}
        onNext={game.nextLevel}
        onRestart={game.restartLevel}
        onRestartGame={game.quit}
        onToggleHint={() => setHintOn((on) => !on)}
        onToggleMute={game.toggleMute}
      />

      {/* Below: board on the left (fixed size), info column on the right. */}
      <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className="relative w-full max-w-135 shrink-0">
          <PuzzleBoard
            board={game.board}
            size={game.level.size}
            image={game.level.image}
            interactive={game.phase === 'playing'}
            onTile={game.tapTile}
          />

          {game.phase === 'level-cleared' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-xl bg-ink/70 text-center backdrop-blur-sm">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-200">
                Level {game.levelNo} cleared
              </p>
              <p className="max-w-64 text-sm text-white/85">
                The scene is whole again. On to the next god.
              </p>
              <button
                type="button"
                onClick={game.nextLevel}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-5 py-2.5 font-semibold text-ink transition-transform hover:-translate-y-0.5"
              >
                Next level
                <HugeiconsIcon icon={PlayIcon} size={16} strokeWidth={2} />
              </button>
            </div>
          )}
        </div>

        {/* Right column: stats, and the peek preview underneath when toggled on. */}
        <div className="flex w-full flex-col gap-4 lg:flex-1">
          <GameStats
            levelNo={game.levelNo}
            totalLevels={TOTAL_LEVELS}
            moves={game.levelMoves}
            modeLabel={MODE_LABEL[game.mode]}
          />

          {hintOn && (
            <div>
              <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted">
                Preview
              </div>
              <img
                src={game.level.image}
                alt="The finished scene"
                className="w-full rounded-xl border border-line object-cover shadow-[0_18px_40px_-24px_rgba(15,23,42,0.5)]"
              />
            </div>
          )}
        </div>
      </div>

      <p className="mt-4 flex items-center justify-center gap-2 text-center font-mono text-xs text-muted">
        <HugeiconsIcon icon={KeyboardIcon} size={14} strokeWidth={1.8} />
        Tap a tile next to the gap, or use the arrow keys.
      </p>
    </div>
  )
}

/** Full-bleed framed screen backed by the Egyptian welcome art (welcome + mode select). */
function Screen({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-105 w-full items-center overflow-hidden rounded-2xl border border-line px-6 py-10 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.6)] sm:px-10">
      <img
        src={WELCOME_BG}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-r from-ink/85 via-ink/60 to-ink/20" />
      <div className="relative">{children}</div>
    </div>
  )
}

interface EndingCardProps {
  stats: RunStats
  onPlayAgain: () => void
}

function EndingCard({ stats, onPlayAgain }: EndingCardProps) {
  return (
    <div className="mx-auto max-w-140 rounded-2xl border border-line bg-white p-8 text-center shadow-[0_20px_50px_-30px_rgba(15,23,42,0.5)]">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700">
        <HugeiconsIcon icon={ChampionIcon} size={28} strokeWidth={1.8} />
      </span>
      <h2 className="mt-5 text-2xl font-bold text-ink">
        You freed all the gods of Egypt 🏺
      </h2>
      <p className="mt-2 text-sm text-muted">
        All {TOTAL_LEVELS} puzzles solved. Here&rsquo;s how the journey went.
      </p>

      <div className="mx-auto mt-6 grid max-w-xs grid-cols-2 gap-3">
        <div className="rounded-xl border border-line bg-panel2 py-4">
          <div className="font-mono text-2xl font-bold text-ink">
            {stats.moves}
          </div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-muted">
            Total moves
          </div>
        </div>
        <div className="rounded-xl border border-line bg-panel2 py-4">
          <div className="font-mono text-2xl font-bold text-ink">
            {formatDuration(stats.elapsedMs)}
          </div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-muted">
            Total time
          </div>
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onPlayAgain}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-ink px-5 py-2.5 font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          <HugeiconsIcon icon={PlayIcon} size={16} strokeWidth={2} />
          Play again
        </button>
        <a
          href="/lab"
          className="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-2.5 font-semibold text-ink no-underline transition-colors hover:border-ink"
        >
          <HugeiconsIcon icon={Home01Icon} size={16} strokeWidth={1.9} />
          Back to lab
        </a>
      </div>

      <a
        href={SOURCE_REPO}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-block font-mono text-xs text-muted underline decoration-dotted underline-offset-4 hover:text-ink"
      >
        Originally a Python + Pygame game — see the source
      </a>
    </div>
  )
}
