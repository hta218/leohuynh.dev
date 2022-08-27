import type React from 'react'

export function SectionContainer({ children }: { children: React.ReactNode }) {
  return <div className="max-w-3xl mx-auto sm:px-6 xl:max-w-5xl xl:px-0">{children}</div>
}
