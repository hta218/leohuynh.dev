import clsx from 'clsx'
import type { ReactNode } from 'react'

export function Container({
  children,
  as: Component = 'section',
  className,
}: {
  children: ReactNode
  as?: React.ElementType
  className?: string
}) {
  return (
    <Component className={clsx('mx-auto w-full max-w-5xl px-4 sm:px-6', className)}>
      {children}
    </Component>
  )
}
