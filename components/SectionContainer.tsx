import type React from 'react'

export function SectionContainer({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-3xl sm:px-6 xl:max-w-5xl xl:px-0">{children}</div>
}
