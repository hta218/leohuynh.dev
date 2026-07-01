import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  GalleryThumbnailsIcon,
  Home01Icon,
  RefreshIcon,
  VolumeLowIcon,
  VolumeOffIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { ReactNode } from 'react'
import { cx } from '~/lib/arcade/travel-egypt/cx'

interface HudButtonProps {
  label: string
  icon: typeof RefreshIcon
  onClick: () => void
  disabled?: boolean
  active?: boolean
}

function HudButton({ label, icon, onClick, disabled, active }: HudButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={cx(
        'inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors',
        disabled
          ? 'cursor-not-allowed border-line/70 text-slate-300'
          : active
            ? 'cursor-pointer border-ink bg-ink text-white'
            : 'cursor-pointer border-line bg-white text-slate-600 hover:border-ink hover:text-ink',
      )}
    >
      <HugeiconsIcon icon={icon} size={17} strokeWidth={1.9} />
    </button>
  )
}

function Stat({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col leading-tight">
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
        {label}
      </span>
      <span className="font-mono text-sm font-semibold text-ink">
        {children}
      </span>
    </div>
  )
}

interface GameStatsProps {
  levelNo: number
  totalLevels: number
  moves: number
  modeLabel: string
}

/** Level / moves / mode, shown in the side column beside the board. */
export function GameStats({
  levelNo,
  totalLevels,
  moves,
  modeLabel,
}: GameStatsProps) {
  return (
    <div className="flex flex-row gap-6 rounded-xl border border-line bg-panel2 px-4 py-3 sm:flex-col sm:gap-3.5">
      <Stat label="Level">
        {levelNo}
        <span className="text-muted">/{totalLevels}</span>
      </Stat>
      <Stat label="Mode">{modeLabel}</Stat>
      <Stat label="Moves">{moves}</Stat>
    </div>
  )
}

interface GameHudProps {
  muted: boolean
  hintOn: boolean
  canGoPrev: boolean
  canGoNext: boolean
  onPrev: () => void
  onNext: () => void
  onRestart: () => void
  onRestartGame: () => void
  onToggleHint: () => void
  onToggleMute: () => void
}

/** The control bar below the board: level navigation on the left, tools on the right. */
export function GameHud({
  muted,
  hintOn,
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
  onRestart,
  onRestartGame,
  onToggleHint,
  onToggleMute,
}: GameHudProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-panel2 px-4 py-3">
      <div className="flex items-center gap-1.5">
        <HudButton
          label="Restart game (back to start)"
          icon={Home01Icon}
          onClick={onRestartGame}
        />
        <HudButton
          label="Previous level"
          icon={ArrowLeft01Icon}
          onClick={onPrev}
          disabled={!canGoPrev}
        />
        <HudButton
          label="Next level"
          icon={ArrowRight01Icon}
          onClick={onNext}
          disabled={!canGoNext}
        />
      </div>

      <div className="flex items-center gap-1.5">
        <HudButton
          label="Restart level"
          icon={RefreshIcon}
          onClick={onRestart}
        />
        <HudButton
          label="Peek at the picture"
          icon={GalleryThumbnailsIcon}
          onClick={onToggleHint}
          active={hintOn}
        />
        <HudButton
          label={muted ? 'Unmute' : 'Mute'}
          icon={muted ? VolumeOffIcon : VolumeLowIcon}
          onClick={onToggleMute}
          active={muted}
        />
      </div>
    </div>
  )
}
