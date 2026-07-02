/**
 * Global Umami click tracker.
 *
 * Fires a single `click` event for every click on an interactive element, so
 * "anything clickable" is captured without wiring each element by hand. The
 * event carries properties for drill-down in the Umami dashboard:
 *   - `region` — nearest `[data-track-region]` (sidebar / topbar / rail /
 *     bottombar / content), else `page`.
 *   - `label`  — aria-label / title / trimmed text / href of the element.
 *   - `href`   — link target, when it's an anchor.
 *   - `page`   — pathname where the click happened.
 *
 * Elements annotated with an explicit `data-umami-event` are tracked by Umami's
 * own handler, so we skip them here to avoid double counting.
 */

const INTERACTIVE =
  'a, button, [role="button"], summary, [role="tab"], [role="menuitem"], [role="link"]'

interface UmamiTracker {
  track: (event: string, data?: Record<string, unknown>) => void
}

function getUmami(): UmamiTracker | undefined {
  return (window as unknown as { umami?: UmamiTracker }).umami
}

function labelFor(el: Element): string {
  const aria = el.getAttribute('aria-label')?.trim()
  if (aria) return aria
  const title = el.getAttribute('title')?.trim()
  if (title) return title
  const text = el.textContent?.replace(/\s+/g, ' ').trim()
  if (text) return text.slice(0, 80)
  const href = el.getAttribute('href')
  if (href) return href
  return '(unlabeled)'
}

function regionFor(el: Element): string {
  return el.closest('[data-track-region]')?.getAttribute('data-track-region') || 'page'
}

function handleClick(event: MouseEvent): void {
  const umami = getUmami()
  if (!umami?.track) return

  const start = event.target as Element | null
  const el = start?.closest?.(INTERACTIVE)
  if (!el) return

  // Umami already tracks elements carrying `data-umami-event` — don't duplicate.
  if (el.closest('[data-umami-event]')) return

  const href = el.getAttribute('href') || undefined
  umami.track('click', {
    region: regionFor(el),
    label: labelFor(el),
    ...(href ? { href } : {}),
    page: location.pathname,
  })
}

// Attach once. The listener lives on `document`, which persists across Astro
// view transitions, so a single capture-phase handler covers every navigation.
const flag = '__clickTrackerAttached'
const w = window as unknown as Record<string, boolean>
if (!w[flag]) {
  w[flag] = true
  document.addEventListener('click', handleClick, { capture: true })
}
