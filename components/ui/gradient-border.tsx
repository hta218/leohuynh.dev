import { clsx } from 'clsx'

export function GradientBorder({
  children,
  offset = 16,
  className,
}: {
  children: React.ReactNode
  offset?: number
  className?: string
}) {
  return (
    <div
      className={clsx([
        'relative h-full w-full',
        'border border-gray-200 dark:border-zinc-800',
        className,
      ])}
      style={{ '--offset': offset + 'px' } as React.CSSProperties}
    >
      <span
        className={clsx([
          'absolute -top-px right-[--offset] h-px w-[40%]',
          'bg-gradient-to-r from-blue-500/0 via-indigo-500/40 to-indigo-500/0',
          'dark:from-indigo-400/0 dark:via-indigo-400/40 dark:to-indigo-400/0',
        ])}
      />
      <span
        className={clsx([
          'absolute -left-px top-[--offset] h-[40%] w-px',
          'bg-gradient-to-b from-indigo-500/0 via-indigo-500/40 to-indigo-500/0',
          'dark:from-indigo-400/0 dark:via-indigo-400/40 dark:to-indigo-400/0',
        ])}
      />
      {children}
    </div>
  )
}
