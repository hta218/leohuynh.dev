// Shell-wide "route swap in progress" indicator, driven by Astro's client
// transition lifecycle events. See `.nav-progress` in styles/studio.css.

const SHOW_DELAY_MS = 120
const FALLBACK_TIMEOUT_MS = 12000

let showTimer: ReturnType<typeof setTimeout> | undefined
let fallbackTimer: ReturnType<typeof setTimeout> | undefined

function clearTimers() {
  if (showTimer) {
    clearTimeout(showTimer)
    showTimer = undefined
  }
  if (fallbackTimer) {
    clearTimeout(fallbackTimer)
    fallbackTimer = undefined
  }
}

function clearPending() {
  clearTimers()
  delete document.documentElement.dataset.navPending
}

function markPending() {
  clearTimers()
  // Delay the visible state so fast/warm-cached swaps never flash it.
  showTimer = setTimeout(() => {
    document.documentElement.dataset.navPending = 'true'
  }, SHOW_DELAY_MS)
  // Safety net: clear on its own if a navigation errors or hangs.
  fallbackTimer = setTimeout(clearPending, FALLBACK_TIMEOUT_MS)
}

/**
 * Binds once. The transition events fire on `document` regardless of which
 * shell instance is currently mounted, so this does not need to re-bind
 * after each swap.
 */
export function setupNavPending() {
  if (window.__leohuynhNavPendingBound) return
  window.__leohuynhNavPendingBound = true

  document.addEventListener('astro:before-preparation', markPending)
  document.addEventListener('astro:after-swap', clearPending)
  document.addEventListener('astro:page-load', clearPending)
}
