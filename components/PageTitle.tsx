import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function PageTitle({ children }: Props) {
  return (
    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 md:text-5xl md:leading-[1.25]">
      {children}
    </h1>
  )
}
