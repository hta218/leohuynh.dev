'use client'

import { CheckCheck } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Twemoji } from '~/components/ui/twemoji'

export function TerminalWindowTitle() {
  const pathname = usePathname()

  const getDisplayPath = () => {
    if (pathname === '/') return '/leohuynh.dev'
    return `/leohuynh.dev${pathname}`
  }

  return (
    <>
      <span>~/the-internet/</span>
      <Twemoji emoji="flag-vietnam" />
      <span className="-ml-0.5">{getDisplayPath()}</span>
      <span className="mx-2 opacity-50">|</span>
      <span>[main]</span>
      <CheckCheck size={16} className="text-green-500 ml-2" />
    </>
  )
}
