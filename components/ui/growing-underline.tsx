import { clsx } from 'clsx'
import type { CSSProperties } from 'react'

export function GrowingUnderline({
  as: Component = 'span',
  children,
  active,
  className,
  duration,
  ...rest
}: {
  children: React.ReactNode
  as?: React.ElementType
  active?: boolean
  className?: string
  duration?: number
} & React.ComponentProps<'span'>) {
  return (
    <Component
      className={clsx([
        'bg-linear-to-r bg-bottom-left bg-no-repeat',
        'transition-[background-size] duration-(--duration,300ms)',
        'from-green-200 to-green-100',
        'dark:from-emerald-800 dark:to-emerald-900',
        active
          ? 'bg-size-[100%_50%] hover:bg-size-[100%_100%]'
          : 'bg-size-[0px_50%] hover:bg-size-[100%_50%]',
        className,
      ])}
      style={{ '--duration': `${duration || 300}ms` } as CSSProperties}
      {...rest}
    >
      {children}
    </Component>
  )
}
