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
        'border border-gray-200 dark:border-zinc-800',
        className,
      ])}
    >
      <span
        className={clsx([
          'absolute -top-px right-4 h-px w-[40%]',
          'bg-gradient-to-r from-blue-500/0 via-indigo-500/40 to-indigo-500/0',
          'dark:from-indigo-400/0 dark:via-indigo-400/40 dark:to-indigo-400/0',
        ])}
      />
      <span
        className={clsx([
          'absolute -left-px top-4 h-[40%] w-px',
          'bg-gradient-to-b from-indigo-500/0 via-indigo-500/40 to-indigo-500/0',
          'dark:from-indigo-400/0 dark:via-indigo-400/40 dark:to-indigo-400/0',
        ])}
      />
      {children}
    </div>
  )
}
