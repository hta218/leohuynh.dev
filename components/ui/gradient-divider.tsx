import { clsx } from 'clsx'

export function GradientDivider({ className }: { className?: string }) {
  return (
    <div
      className={clsx([
        'h-0.5 w-full rounded-md opacity-75',
        'bg-linear-to-r from-pink-500 via-red-500 to-yellow-500',
        className,
      ])}
    />
  )
}
