import { Menu, X } from 'lucide-react'

export function MobileNavToggle({
  navShow,
  onToggleNav,
}: {
  onToggleNav: () => void
  navShow: boolean
}) {
  return (
    <button
      className="rounded sm:hidden p-1.5"
      type="button"
      aria-label="Toggle Mobile Menu"
      onClick={onToggleNav}
      data-umami-event="mobile-nav-toggle"
    >
      {navShow ? <X size={22} /> : <Menu size={22} />}
    </button>
  )
}
