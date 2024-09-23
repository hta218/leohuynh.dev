'use client'

import { ChevronsUp, MessageSquareText } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SITE_METADATA } from '~/data/site-metadata'

export function ScrollButtons() {
  let [show, setShow] = useState(false)

  useEffect(() => {
    function handleWindowScroll() {
      if (window.scrollY > 50) setShow(true)
      else setShow(false)
    }

    window.addEventListener('scroll', handleWindowScroll)
    return () => window.removeEventListener('scroll', handleWindowScroll)
  }, [])

  return (
    <div
      className={`fixed bottom-8 right-8 hidden flex-col gap-3 ${show ? 'md:flex' : 'md:hidden'}`}
    >
      {SITE_METADATA.comments?.provider && (
        <button
          aria-label="Scroll To Comment"
          onClick={() => {
            document.getElementById('comment')?.scrollIntoView()
          }}
          className="rounded-lg p-2 ring-1 ring-inset ring-zinc-900/10 transition-all hover:bg-gray-100 dark:ring-white/20 dark:hover:bg-gray-800"
        >
          <MessageSquareText className="h-5 w-5" />
        </button>
      )}
      <button
        aria-label="Scroll To Top"
        onClick={() => {
          window.scrollTo({ top: 0 })
        }}
        className="rounded-lg p-2 ring-1 ring-inset ring-zinc-900/10 transition-all hover:bg-gray-100 dark:ring-white/20 dark:hover:bg-gray-800"
      >
        <ChevronsUp className="h-5 w-5" />
      </button>
    </div>
  )
}
