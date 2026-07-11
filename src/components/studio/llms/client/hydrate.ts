import {
  formatApproxUsd,
  formatTokens,
  INLINE_MODEL_ICONS,
  modelBrandIcon,
  shortModelName,
} from '~/lib/runtime/llm-format'
import type {
  TokenBurnFullPayload,
  TokenBurnModelSlice,
  TokenBurnWindow,
} from '~/types/integrations'
import { fetchRuntimeJson } from '../../runtime-rail/client/shared'

const CHART_DAYS = 90
const VISIBLE_MODELS = 8

function text(selector: string, value: string, root: ParentNode = document) {
  const element = root.querySelector<HTMLElement>(selector)
  if (element) element.textContent = value
}

function show(selector: string, visible: boolean, root: ParentNode = document) {
  const element = root.querySelector<HTMLElement>(selector)
  if (element) element.hidden = !visible
}

function costLabel(cost: number): string {
  return cost > 0 ? formatApproxUsd(cost) : '—'
}

function windowMeta(window: TokenBurnWindow): string {
  return `${window.sessions.toLocaleString()} sess · ${costLabel(window.cost)}`
}

function updateHero(root: HTMLElement, tb: TokenBurnFullPayload) {
  text('[data-llms-all-time-tokens]', tb.allTime.tokens.toLocaleString(), root)
  text('[data-llms-hero-meta="spend"]', formatApproxUsd(tb.allTime.cost), root)
  text(
    '[data-llms-hero-meta="sessions"]',
    tb.allTime.sessions.toLocaleString(),
    root,
  )
  text(
    '[data-llms-hero-meta="machines"]',
    `${tb.machines.length || '—'}`,
    root,
  )
}

function updateWindows(root: HTMLElement, tb: TokenBurnFullPayload) {
  const windows = [
    ['today', tb.today],
    ['last7Days', tb.last7Days],
    ['last30Days', tb.last30Days],
  ] as const

  for (const [key, window] of windows) {
    text(`[data-llms-window-value="${key}"]`, formatTokens(window.tokens), root)
    text(`[data-llms-window-meta="${key}"]`, windowMeta(window), root)
  }
}

function buildChartBar(
  day: TokenBurnFullPayload['daily'][number],
  index: number,
  peakIndex: number,
  maxDailyTokens: number,
) {
  const group = document.createElement('div')
  group.className = 'group relative flex h-full flex-1 items-end'

  const bar = document.createElement('div')
  const height = Math.max(1.5, (day.tokens / maxDailyTokens) * 100)
  bar.className = `llms-bar w-full rounded-t-xs transition-colors ${
    index === peakIndex ? 'bg-ink' : 'bg-ink/45 group-hover:bg-ink/80'
  }`
  bar.style.height = `${height}%`
  bar.style.animationDelay = `${200 + index * 9}ms`

  const tooltip = document.createElement('span')
  tooltip.className =
    'pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 rounded-md border border-ink/15 bg-white px-2 py-1 font-mono text-[10px] whitespace-nowrap text-ink shadow-[2px_2px_0_var(--color-line)] group-hover:block'
  tooltip.textContent = `${day.date} · ${formatTokens(day.tokens)} · ${costLabel(
    day.cost,
  )}`

  group.append(bar, tooltip)
  return group
}

function updateChart(root: HTMLElement, tb: TokenBurnFullPayload) {
  const series = tb.daily.slice(-CHART_DAYS)
  show('[data-llms-chart-section]', series.length > 0, root)
  if (series.length === 0) return

  const maxDailyTokens = Math.max(1, ...series.map((day) => day.tokens))
  const peakIndex = series.reduce(
    (best, day, index) => (day.tokens > series[best].tokens ? index : best),
    0,
  )
  const chart = root.querySelector<HTMLElement>('[data-llms-chart-bars]')
  if (!chart) return

  chart.replaceChildren(
    ...series.map((day, index) =>
      buildChartBar(day, index, peakIndex, maxDailyTokens),
    ),
  )

  text('[data-llms-chart-count]', `${series.length}d`, root)
  text('[data-llms-chart-peak]', `peak ${formatTokens(maxDailyTokens)}`, root)
  text('[data-llms-chart-first-day]', series[0]?.date ?? '—', root)
  text('[data-llms-chart-last-day]', series.at(-1)?.date ?? '—', root)
  text('[data-llms-chart-scale-max]', formatTokens(maxDailyTokens), root)
  text('[data-llms-chart-scale-mid]', formatTokens(maxDailyTokens * 0.5), root)
}

function buildModelRow(
  model: TokenBurnModelSlice,
  rank: number,
  maxTokens: number,
  totalTokens: number,
) {
  const row = document.createElement('div')
  row.className =
    'flex items-center gap-3 border-b border-line px-4 py-2.5 font-mono text-[12px] tabular-nums transition-colors last:border-b-0 hover:bg-panel2'

  const rankElement = document.createElement('span')
  rankElement.className = 'w-5 shrink-0 text-[11px] text-muted'
  rankElement.textContent = String(rank).padStart(2, '0')

  const brand = modelBrandIcon(model.model)
  const icon = document.createElement(brand.type === 'cdn' ? 'img' : 'span')
  if (brand.type === 'cdn') {
    icon.setAttribute('src', `https://cdn.simpleicons.org/${brand.slug}`)
    icon.setAttribute('alt', '')
    icon.setAttribute('loading', 'lazy')
    icon.className = 'h-4 w-4 shrink-0'
  } else {
    icon.className =
      'inline-flex h-4 w-4 shrink-0 items-center justify-center text-ink'
    icon.innerHTML = INLINE_MODEL_ICONS[brand.key] ?? ''
  }

  const name = document.createElement('span')
  name.className = 'min-w-0 flex-1 truncate text-[13px] text-ink sm:flex-none sm:w-60'
  name.textContent = shortModelName(model.model)

  const barWrap = document.createElement('span')
  barWrap.className = 'hidden h-1.5 flex-1 overflow-hidden rounded-full bg-line/60 sm:block'
  const bar = document.createElement('span')
  const barWidth = Math.max(2, (model.tokens / maxTokens) * 100)
  bar.className = `block h-full rounded-full ${rank === 1 ? 'bg-ink' : 'bg-ink/55'}`
  bar.style.width = `${barWidth}%`
  barWrap.append(bar)

  const tokens = document.createElement('span')
  tokens.className = 'w-18 shrink-0 text-right text-ink'
  tokens.textContent = formatTokens(model.tokens)

  const share = document.createElement('span')
  share.className = 'w-10 shrink-0 text-right text-muted'
  const pct = (model.tokens / totalTokens) * 100
  share.textContent = pct >= 1 ? `${Math.round(pct)}%` : '<1%'

  const cost = document.createElement('span')
  cost.className = 'w-20 shrink-0 text-right text-muted'
  cost.textContent = model.cost > 0 ? formatApproxUsd(model.cost) : '—'

  row.append(rankElement, icon, name, barWrap, tokens, share, cost)
  return row
}

function buildMoreRows(
  models: TokenBurnModelSlice[],
  startRank: number,
  maxTokens: number,
  totalTokens: number,
) {
  const details = document.createElement('details')
  details.className = 'group/details'

  const summary = document.createElement('summary')
  summary.className =
    'flex cursor-pointer list-none items-center gap-2 border-t border-line px-4 py-2.5 font-mono text-[11px] tracking-[0.06em] text-muted uppercase transition-colors hover:text-ink'
  summary.innerHTML = `<span class="transition-transform group-open/details:rotate-90">▸</span><span class="group-open/details:hidden">show ${models.length} more</span><span class="hidden group-open/details:inline">show less</span>`

  details.append(summary)
  for (const [index, model] of models.entries()) {
    details.append(buildModelRow(model, startRank + index, maxTokens, totalTokens))
  }
  return details
}

function updateModels(root: HTMLElement, tb: TokenBurnFullPayload) {
  const models = tb.allTimeModels
  show('[data-llms-models-section]', models.length > 0, root)
  if (models.length === 0) return

  const container = root.querySelector<HTMLElement>('[data-llms-models]')
  if (!container) return

  const maxModelTokens = Math.max(1, ...models.map((model) => model.tokens))
  const totalModelTokens = models.reduce((sum, model) => sum + model.tokens, 0) || 1
  const topModels = models.slice(0, VISIBLE_MODELS)
  const restModels = models.slice(VISIBLE_MODELS)
  const rows: HTMLElement[] = topModels.map((model, index) =>
    buildModelRow(model, index + 1, maxModelTokens, totalModelTokens),
  )

  if (restModels.length > 0) {
    rows.push(
      buildMoreRows(
        restModels,
        VISIBLE_MODELS + 1,
        maxModelTokens,
        totalModelTokens,
      ),
    )
  }

  container.replaceChildren(...rows)
  text('[data-llms-model-count]', `${models.length} models`, root)
}

function updateProvenance(root: HTMLElement, tb: TokenBurnFullPayload) {
  const machinesLabel = tb.machines.length ? tb.machines.join(', ') : '—'
  text('[data-llms-machines]', machinesLabel, root)
  const lastActivity = tb.lastActivity?.slice(0, 10)
  show('[data-llms-last-activity-wrap]', Boolean(lastActivity), root)
  if (lastActivity) text('[data-llms-last-activity]', lastActivity, root)
}

function renderUnavailable(root: HTMLElement, error?: string) {
  show('[data-llms-error]', true, root)
  const message = error ? `telemetry is unavailable right now: ${error}` : 'telemetry is unavailable right now.'
  text('[data-llms-error]', message, root)
}

export async function hydrateLlmsPage() {
  const root = document.querySelector<HTMLElement>('[data-llms-page]')
  if (!root || root.dataset.llmsHydrated === 'true') return
  root.dataset.llmsHydrated = 'true'

  try {
    const tb = await fetchRuntimeJson<TokenBurnFullPayload>(
      '/api/token-burn.json?view=full',
    )
    if (!tb || tb.ok === false) {
      renderUnavailable(root, tb?.error)
      return
    }

    show('[data-llms-error]', false, root)
    updateHero(root, tb)
    updateWindows(root, tb)
    updateChart(root, tb)
    updateModels(root, tb)
    updateProvenance(root, tb)
  } catch (error) {
    console.warn('[llms] failed to hydrate token-burn page', error)
    renderUnavailable(root)
  }
}

document.addEventListener('astro:page-load', hydrateLlmsPage)
