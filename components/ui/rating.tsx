import { clsx } from 'clsx'
import { Star } from 'lucide-react'

export function Rating({ rating, className }: { rating: string; className?: string }) {
  if (rating !== '0') {
    return (
      <span
        className={clsx([
          'text-base',
          'shrink-0 items-center gap-1',
          'rounded-full px-3 py-0.5',
          'font-medium text-gray-700 dark:text-gray-900',
          'bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-yellow-200 via-emerald-200 to-yellow-200',
          'dark:bg-gradient-to-l dark:from-emerald-500 dark:to-lime-600',
          className,
        ])}
      >
        <Star size={18} strokeWidth={1.5} />
        <span>{rating}</span>
      </span>
    )
  }
  return null
}
