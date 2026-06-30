import type { StudioTab } from './globals'

// IDE-like editor tabs: the open list lives on `window` so it survives SPA
// (view-transition) navigation but resets on a full page reload. README is
// always pinned, the active tab is always kept, and the oldest evictable tab
// is dropped past the cap.
export function initStudioTabs(shell: Element) {
  const bar = shell.querySelector('[data-tab-bar]')
  if (!bar) return

  const MAX = 5
  const HOME = '/'
  const BASE =
    'tab-row shrink-0 border-r border-line px-3.5 py-2.5 font-mono text-xs no-underline'
  const ACTIVE =
    'bg-white text-slate-950 shadow-[inset_0_-2px_0_var(--color-ink)]'
  const INACTIVE = 'text-muted hover:text-slate-950'

  const currentHref = bar.getAttribute('data-current-href') || HOME

  // Capture the markup (icon + label) of the server-rendered seed tabs so the
  // README and the current page always have a fresh descriptor to render.
  const seeds: Record<string, string> = {}
  bar.querySelectorAll('a[data-tab-href]').forEach((a) => {
    const href = a.getAttribute('data-tab-href')
    if (href) seeds[href] = a.innerHTML
  })

  let list: StudioTab[] = Array.isArray(window.__leohuynhTabs)
    ? window.__leohuynhTabs
    : []

  const findIdx = (href: string) => list.findIndex((t) => t && t.href === href)

  // Always keep README pinned at the front.
  if (findIdx(HOME) === -1 && seeds[HOME] != null) {
    list.unshift({ href: HOME, inner: seeds[HOME] })
  }

  // Add (or refresh) the current page tab.
  const curIdx = findIdx(currentHref)
  if (curIdx === -1) {
    list.push({ href: currentHref, inner: seeds[currentHref] || '' })
  } else if (seeds[currentHref] != null) {
    list[curIdx].inner = seeds[currentHref]
  }

  // Drop the oldest evictable tab (never README, never the active one).
  while (list.length > MAX) {
    const victim = list.findIndex(
      (t) => t.href !== HOME && t.href !== currentHref,
    )
    if (victim === -1) break
    list.splice(victim, 1)
  }

  list = list.filter((t) => t && typeof t.inner === 'string' && t.inner)
  window.__leohuynhTabs = list

  bar.innerHTML = ''
  list.forEach((t) => {
    const a = document.createElement('a')
    a.href = t.href
    a.setAttribute('data-tab-href', t.href)
    a.className = `${BASE} ${t.href === currentHref ? ACTIVE : INACTIVE}`
    a.innerHTML = t.inner
    bar.appendChild(a)
  })
}
