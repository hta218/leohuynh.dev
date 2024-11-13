'use client'

import { clsx } from 'clsx'
import { ChevronsUp, MessageSquareText } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ScrollButtons() {
  let [show, setShow] = useState(false)

  useEffect(() => {
    function handleWindowScroll() {
      setShow(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleWindowScroll)
    return () => window.removeEventListener('scroll', handleWindowScroll)
  }, [])

  return (
    <div className={clsx('fixed bottom-8 right-8 hidden flex-col gap-3', show && 'lg:flex')}>
      <ScrollButton
        ariaLabel="Scroll To Comment"
        onClick={() => document.getElementById('comment')?.scrollIntoView()}
        icon={MessageSquareText}
      />
      <ScrollButton
        ariaLabel="Scroll To Top"
        onClick={() => window.scrollTo({ top: 0 })}
        icon={ChevronsUp}
      />
    </div>
  )
}

function ScrollButton({
  onClick,
  ariaLabel,
  icon: Icon,
}: {
  onClick: () => void
  ariaLabel: string
  icon: React.FC<React.SVGProps<SVGSVGElement>>
}) {
  return (
    <button
      aria-label={ariaLabel}
      onClick={onClick}
      className={clsx([
        'rounded-lg p-2 transition-all',
        'hover:bg-gray-100 dark:hover:bg-gray-800',
        'ring-1 ring-inset ring-zinc-900/20 dark:ring-white/20',
      ])}
    >
      <Icon className="h-5 w-5" />
    </button>
  )
}
