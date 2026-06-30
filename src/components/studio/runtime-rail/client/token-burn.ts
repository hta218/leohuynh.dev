import type {
  TokenBurnModelSlice,
  TokenBurnPayload,
  TokenBurnWindow,
} from './types'

// Price is a secondary, approximate figure — round to whole dollars.
function formatApproxUsd(value: number | null | undefined): string {
  const cost = value ?? 0
  if (cost > 0 && cost < 1) return '~<$1'
  return `~$${Math.round(cost).toLocaleString()}`
}

function formatTokens(value: number | null | undefined): string {
  const tokens = value ?? 0
  if (tokens >= 1e9) return `${(tokens / 1e9).toFixed(2)}B`
  if (tokens >= 1e6) return `${(tokens / 1e6).toFixed(1)}M`
  if (tokens >= 1e3) return `${(tokens / 1e3).toFixed(1)}K`
  return tokens.toLocaleString()
}

// Simple Icons has no OpenAI/ChatGPT mark (removed for trademark reasons), so
// brands it lacks are rendered from this inline SVG map instead of the CDN.
const INLINE_MODEL_ICONS: Record<string, string> = {
  openai:
    '<svg viewBox="0 0 320 320" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="m297.06 130.97c7.26-21.79 4.76-45.66-6.85-65.48-17.46-30.4-52.56-46.04-86.84-38.68-15.25-17.18-37.16-26.95-60.13-26.81-35.04-.08-66.13 22.48-76.91 55.82-22.51 4.61-41.94 18.7-53.31 38.67-17.59 30.32-13.58 68.54 9.92 94.54-7.26 21.79-4.76 45.66 6.85 65.48 17.46 30.4 52.56 46.04 86.84 38.68 15.24 17.18 37.16 26.95 60.13 26.8 35.06.09 66.16-22.49 76.94-55.86 22.51-4.61 41.94-18.7 53.31-38.67 17.57-30.32 13.55-68.51-9.94-94.51zm-120.28 168.11c-14.03.02-27.62-4.89-38.39-13.88.49-.26 1.34-.73 1.89-1.07l63.72-36.8c3.26-1.85 5.26-5.32 5.24-9.07v-89.83l26.93 15.55c.29.14.48.42.52.74v74.39c-.04 33.08-26.83 59.9-59.91 59.97zm-128.84-55.03c-7.03-12.14-9.56-26.37-7.15-40.18.47.28 1.3.79 1.89 1.13l63.72 36.8c3.23 1.89 7.23 1.89 10.47 0l77.79-44.92v31.1c.02.32-.13.63-.38.83l-64.41 37.19c-28.69 16.52-65.33 6.7-81.92-21.95zm-16.77-139.09c7-12.16 18.05-21.46 31.21-26.29 0 .55-.03 1.52-.03 2.2v73.61c-.02 3.74 1.98 7.21 5.23 9.06l77.79 44.91-26.93 15.55c-.27.18-.61.21-.91.08l-64.42-37.22c-28.63-16.58-38.45-53.21-21.95-81.89zm221.26 51.49-77.79-44.92 26.93-15.54c.27-.18.61-.21.91-.08l64.42 37.19c28.68 16.57 38.51 53.26 21.94 81.94-7.01 12.14-18.05 21.44-31.2 26.28v-75.81c.03-3.74-1.96-7.2-5.2-9.06zm26.8-40.34c-.47-.29-1.3-.79-1.89-1.13l-63.72-36.8c-3.23-1.89-7.23-1.89-10.47 0l-77.79 44.92v-31.1c-.02-.32.13-.63.38-.83l64.41-37.16c28.69-16.55 65.37-6.7 81.91 22 6.99 12.12 9.52 26.31 7.15 40.1zm-168.51 55.43-26.94-15.55c-.29-.14-.48-.42-.52-.74v-74.39c.02-33.12 26.89-59.96 60.01-59.94 14.01 0 27.57 4.92 38.34 13.88-.49.26-1.33.73-1.89 1.07l-63.72 36.8c-3.26 1.85-5.26 5.31-5.24 9.06l-.04 89.79zm14.63-31.54 34.65-20.01 34.65 20v40.01l-34.65 20-34.65-20z"/></svg>',
  // Generic AI-brain mark (Hugeicons AiBrain01) for models without a known brand.
  fallback:
    '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4.5C5.34315 4.5 4 5.84315 4 7.5C4 8.06866 4.15822 8.60037 4.43304 9.0535C3.04727 9.31855 2 10.537 2 12C2 13.463 3.04727 14.6814 4.43304 14.9465M7 4.5C7 3.11929 8.11929 2 9.5 2C10.8807 2 12 3.11929 12 4.5V19.5C12 20.8807 10.8807 22 9.5 22C8.11929 22 7 20.8807 7 19.5C5.34315 19.5 4 18.1569 4 16.5C4 15.9313 4.15822 15.3996 4.43304 14.9465M7 4.5C7 5.31791 7.39278 6.04408 8 6.50018M4.43304 14.9465C4.78948 14.3588 5.34207 13.9032 6 13.6707"/><path d="M17 19.4999C18.6569 19.4999 20 18.1567 20 16.4999C20 15.9312 19.8418 15.3995 19.567 14.9464C20.9527 14.6813 22 13.4629 22 11.9999C22 10.5369 20.9527 9.31843 19.567 9.05338M17 19.4999C17 20.8806 15.8807 21.9999 14.5 21.9999C13.1193 21.9999 12 20.8806 12 19.4999L12 4.49988C12 3.11917 13.1193 1.99988 14.5 1.99988C15.8807 1.99988 17 3.11917 17 4.49988C18.6569 4.49988 20 5.84302 20 7.49988C20 8.06854 19.8418 8.60024 19.567 9.05338M17 19.4999C17 18.682 16.6072 17.9558 16 17.4997M19.567 9.05338C19.2105 9.64109 18.6579 10.0966 18 10.3292"/></svg>',
}

// Map a raw model id to a brand icon: either a Simple Icons CDN slug
// (cdn.simpleicons.org/<slug>) or an inline SVG key for brands the CDN lacks.
function modelBrandIcon(
  model: string,
): { type: 'cdn'; slug: string } | { type: 'inline'; key: string } | null {
  const id = model.toLowerCase()
  if (/claude|opus|sonnet|haiku|anthropic/.test(id))
    return { type: 'cdn', slug: 'claude' }
  if (/gpt|codex|chatgpt|openai|^o\d/.test(id))
    return { type: 'inline', key: 'openai' }
  if (/gemini|bard/.test(id)) return { type: 'cdn', slug: 'googlegemini' }
  if (/copilot/.test(id)) return { type: 'cdn', slug: 'githubcopilot' }
  if (/llama|meta/.test(id)) return { type: 'cdn', slug: 'meta' }
  if (/mistral/.test(id)) return { type: 'cdn', slug: 'mistralai' }
  if (/qwen/.test(id)) return { type: 'cdn', slug: 'qwen' }
  if (/deepseek/.test(id)) return { type: 'cdn', slug: 'deepseek' }
  if (/kimi|moonshot/.test(id)) return { type: 'cdn', slug: 'moonshotai' }
  // Unknown vendor — fall back to a generic AI mark instead of no icon.
  return { type: 'inline', key: 'fallback' }
}

function tokenBurnWindowLabel(
  window: TokenBurnWindow | null | undefined,
): string {
  const sessions = window?.sessions ?? 0
  return `${formatTokens(window?.tokens)} · ${sessions.toLocaleString()} sess · ${formatApproxUsd(window?.cost)}`
}

function renderTokenBurnModels(
  rail: Element,
  models: TokenBurnModelSlice[] | undefined,
) {
  const list = rail.querySelector<HTMLElement>('[data-tb-models]')
  if (!list) return
  list.textContent = ''

  if (!models?.length) {
    const empty = document.createElement('span')
    empty.className = 'font-mono text-[12px] text-muted'
    empty.textContent = '—'
    list.append(empty)
    return
  }

  const buildRow = (model: TokenBurnModelSlice) => {
    const row = document.createElement('div')
    row.className = 'flex items-center justify-between gap-2 py-0.5'

    const left = document.createElement('span')
    left.className = 'flex min-w-0 items-center gap-1.5'
    const brand = modelBrandIcon(model.model)
    if (brand?.type === 'cdn') {
      const icon = document.createElement('img')
      icon.src = `https://cdn.simpleicons.org/${brand.slug}`
      icon.alt = ''
      icon.loading = 'lazy'
      icon.className = 'h-3.5 w-3.5 shrink-0'
      // Hide gracefully if the slug 404s.
      icon.addEventListener('error', () => icon.remove())
      left.append(icon)
    } else if (brand?.type === 'inline') {
      const icon = document.createElement('span')
      icon.className =
        'inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center text-ink'
      icon.innerHTML = INLINE_MODEL_ICONS[brand.key] ?? ''
      left.append(icon)
    }
    const name = document.createElement('span')
    name.className = 'truncate font-mono text-[12px] text-ink'
    // The brand icon already conveys the vendor — drop the "claude-" prefix
    // so "claude-opus-4-8" reads as "opus-4-8".
    name.textContent = model.model.replace(/^claude-/, '')
    left.append(name)

    const value = document.createElement('strong')
    value.className = 'shrink-0 font-mono text-[11px] text-muted'
    value.textContent = `${formatTokens(model.tokens)} · ${formatApproxUsd(model.cost)}`

    row.append(left, value)
    return row
  }

  const VISIBLE_MODELS = 2
  models.slice(0, VISIBLE_MODELS).forEach((model) => {
    list.append(buildRow(model))
  })

  const rest = models.slice(VISIBLE_MODELS)
  if (!rest.length) return

  const toggle = document.createElement('button')
  toggle.type = 'button'
  toggle.className =
    'mt-0.5 self-start font-mono text-[10px] uppercase tracking-[0.06em] text-muted transition-colors hover:text-ink'

  let expanded = false
  const restRows: HTMLElement[] = []
  const syncToggle = () => {
    toggle.textContent = expanded ? 'show less' : `+${rest.length} more`
  }
  toggle.addEventListener('click', () => {
    expanded = !expanded
    if (expanded) {
      rest.forEach((model) => {
        const row = buildRow(model)
        restRows.push(row)
        list.insertBefore(row, toggle)
      })
    } else {
      restRows.forEach((row) => {
        row.remove()
      })
      restRows.length = 0
    }
    syncToggle()
  })
  syncToggle()
  list.append(toggle)
}

export function updateTokenBurn(rail: Element, tb: TokenBurnPayload | null) {
  const set = (selector: string, text: string) => {
    const el = rail.querySelector<HTMLElement>(selector)
    if (el) el.textContent = text
  }

  if (!tb || tb.ok === false) {
    set('[data-tb-alltime-tokens]', '—')
    set('[data-tb-alltime-sub]', 'unavailable')
    set('[data-tb-today]', '—')
    renderTokenBurnModels(rail, [])
    return
  }

  set(
    '[data-tb-alltime-tokens]',
    `${(tb.allTime?.tokens ?? 0).toLocaleString()}`,
  )
  set(
    '[data-tb-alltime-sub]',
    `${(tb.allTime?.sessions ?? 0).toLocaleString()} sessions · ${formatApproxUsd(tb.allTime?.cost)}`,
  )
  set('[data-tb-today]', tokenBurnWindowLabel(tb.today))
  renderTokenBurnModels(rail, tb.topModels)
}
