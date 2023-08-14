import { MoveUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import smoothscroll from 'smoothscroll-polyfill'

export function ScrollTopButton() {
  let [show, setShow] = useState(false)

  useEffect(() => {
    smoothscroll.polyfill()
    let handleWindowScroll = () => {
      if (window.scrollY > 200) setShow(true)
      else setShow(false)
    }

    window.addEventListener('scroll', handleWindowScroll)
    return () => window.removeEventListener('scroll', handleWindowScroll)
  }, [])

  let handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      aria-label="Scroll To Top"
      type="button"
      onClick={handleClick}
      style={{ opacity: show ? 1 : 0 }}
      className="fixed bottom-8 right-8 hidden rounded-md bg-gray-600 p-2 text-gray-100 transition-opacity hover:bg-gray-700 dark:hover:bg-gray-600 md:inline-block"
    >
      <MoveUp strokeWidth={1} />
    </button>
  )
}
