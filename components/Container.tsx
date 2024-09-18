import type { ReactNode } from 'react'
import clsx from 'clsx'

interface Props {
  children: ReactNode
  as?: React.ElementType
  className?: string
}

export default function Container({ children, as: Component = 'section', className }: Props) {
  return (
    <Component className={clsx('mx-auto w-full max-w-5xl px-4 sm:px-6', className)}>
      {children}
    </Component>
  )
}
