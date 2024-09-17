import { clsx } from 'clsx'

export function GradientBorder({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={clsx([
        'relative h-full w-full',
        'border-grey-200 border dark:border-zinc-800',
        className,
      ])}
    >
      <span
        className={clsx([
          'absolute -top-px right-4 h-px w-[40%]',
          'bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0',
          'dark:from-blue-400/0 dark:via-blue-400/40 dark:to-blue-400/0',
        ])}
      />
      <span
        className={clsx([
          'absolute -left-px top-4 h-[40%] w-px',
          'bg-gradient-to-b from-blue-500/0 via-blue-500/40 to-blue-500/0',
          'dark:from-blue-400/0 dark:via-blue-400/40 dark:to-blue-400/0',
        ])}
      />
      {children}
    </div>
  )
}
