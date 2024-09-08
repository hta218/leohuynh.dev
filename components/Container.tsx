import type { ReactNode } from 'react'
import clsx from 'clsx'

interface Props {
  children: ReactNode
  as?: React.ElementType
  className?: string
}

export default function Container({ children, as: Component = 'section', className }: Props) {
  return (
    <Component className={clsx('mx-auto max-w-3xl px-3 sm:px-6 xl:max-w-5xl xl:px-0', className)}>
      {children}
    </Component>
  )
}
