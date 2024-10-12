import { clsx } from 'clsx'
import { TiltedGridBackground } from './tilted-grid-background'

export function RadiantCard({
  children,
  className,
  radius = '1rem',
}: {
  children: React.ReactNode
  radius?: string
  className?: string
}) {
  return (
    <div
      className="relative mx-auto w-[calc(100vw-2.5rem)] md:w-full"
      style={{ '--radius': radius } as React.CSSProperties}
    >
      <div
        className={clsx([
          'dark:hidden',
          'absolute z-[0] shadow-sm',
          '-inset-1.5 md:-inset-2',
          'rounded-[calc(var(--radius)+8px)]',
          'ring-1 ring-black/5',
        ])}
      />
      <div
        className={clsx([
          'relative z-[1]',
          'rounded-[--radius] shadow-2xl',
          '[background:conic-gradient(at_0%_0%,_snow,_white)]',
          'dark:[background:rgb(255_255_255_/_0.05)]',
          'border border-transparent dark:border-zinc-800',
          className,
        ])}
      >
        <TiltedGridBackground className="inset-0 z-[-1] hidden dark:block" />
        {children}
        <span
          className={clsx([
            'absolute hidden dark:inline-block',
            '-top-px right-4 h-px w-[40%]',
            'bg-gradient-to-r dark:from-indigo-400/0 dark:via-indigo-400/40 dark:to-indigo-400/0',
          ])}
        />
        <span
          className={clsx([
            'absolute hidden dark:inline-block',
            '-left-px top-4 h-[40%] w-px',
            'bg-gradient-to-b dark:from-indigo-400/0 dark:via-indigo-400/40 dark:to-indigo-400/0',
          ])}
        />
      </div>
    </div>
  )
}
