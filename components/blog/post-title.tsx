import type { ReactNode } from 'react'

export function PostTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 md:text-5xl md:leading-tight">
      {children}
    </h1>
  )
}
