import { clsx } from 'clsx'

export function MusicWaves({ className }: { className?: string }) {
  return (
    <div className={clsx('flex h-5 shrink-0 items-end pt-1 pb-0.5', className)}>
      <div className="animate-music-bar-1 bg-spotify h-full w-0.5" />
      <div className="animate-music-bar-2 bg-spotify mx-0.5 h-1/2 w-0.5" />
      <div className="animate-music-bar-3 bg-spotify h-full w-0.5" />
      <div className="animate-music-bar-4 bg-spotify mx-0.5 h-1/2 w-0.5" />
    </div>
  )
}
