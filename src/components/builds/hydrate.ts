type ProjectMeta = {
  description?: string | null
  language?: string | null
  nameWithOwner?: string | null
  pushedAt?: string | null
  stargazerCount?: number | null
  url?: string | null
}

type ProjectMetaMap = Record<string, ProjectMeta>

const PROJECTS_CACHE_KEY = 'leohuynh:github-projects:v1'
const PROJECTS_CACHE_TTL = 10 * 60 * 1000

function readLanguageIcons(): Record<string, string> {
  try {
    const raw = document.getElementById('project-language-icons')?.textContent
    return raw ? (JSON.parse(raw) as Record<string, string>) : {}
  } catch {
    return {}
  }
}

const LANGUAGE_ICONS = readLanguageIcons()

function renderLanguageCell(cell: Element, language: string) {
  const icon = LANGUAGE_ICONS[language]
  if (icon) {
    cell.innerHTML = `<span class="tech-icon" title="${language}">${icon}</span><span>${language}</span>`
  } else {
    cell.textContent = language
  }
}

function readProjectsCache(): ProjectMetaMap | null {
  try {
    const raw = localStorage.getItem(PROJECTS_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as {
      items?: ProjectMetaMap
      timestamp?: number
    }
    if (
      !parsed.timestamp ||
      !parsed.items ||
      Date.now() - parsed.timestamp > PROJECTS_CACHE_TTL
    ) {
      return null
    }
    return parsed.items
  } catch {
    return null
  }
}

function writeProjectsCache(items: ProjectMetaMap) {
  try {
    localStorage.setItem(
      PROJECTS_CACHE_KEY,
      JSON.stringify({ timestamp: Date.now(), items }),
    )
  } catch {
    // Ignore storage failures; live fetch is best-effort UI enhancement.
  }
}

function formatDate(value: string | null | undefined): string | null {
  if (!value) return null
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(value))
}

function applyProjectMeta(items: ProjectMetaMap) {
  document.querySelectorAll('[data-project-repo]').forEach((card) => {
    const repo = card.getAttribute('data-project-repo')
    if (!repo) return
    const meta = items[repo]
    if (!meta) return

    if (card instanceof HTMLAnchorElement && meta.url) card.href = meta.url
    const owner = card.querySelector('[data-project-owner]')
    const description = card.querySelector('[data-project-description]')
    const stars = card.querySelector('[data-project-stars]')
    const metaLabel = card.querySelector('[data-project-meta-label]')
    const metaValue = card.querySelector('[data-project-meta]')

    if (owner && meta.nameWithOwner) owner.textContent = meta.nameWithOwner
    if (description && meta.description)
      description.textContent = meta.description
    if (stars)
      stars.textContent = Number(meta.stargazerCount || 0).toLocaleString()
    if (metaLabel && metaValue) {
      if (meta.language) {
        metaLabel.textContent = 'Language'
        renderLanguageCell(metaValue, meta.language)
      } else if (meta.pushedAt) {
        metaLabel.textContent = 'Updated'
        metaValue.textContent = formatDate(meta.pushedAt) || '—'
      } else {
        metaLabel.textContent = 'Type'
        metaValue.textContent = 'repo'
      }
    }
  })
}

async function fetchProjectMetaMap(): Promise<ProjectMetaMap> {
  const response = await fetch('/api/projects-github.json')
  if (!response.ok) throw new Error(`Project GitHub API ${response.status}`)
  return (await response.json()) as ProjectMetaMap
}

async function hydrateProjectCards() {
  const cards = Array.from(document.querySelectorAll('[data-project-repo]'))
  const repos = [
    ...new Set(
      cards
        .map((card) => card.getAttribute('data-project-repo'))
        .filter((repo): repo is string => Boolean(repo)),
    ),
  ]
  if (!repos.length) return

  const cached = readProjectsCache()
  if (cached) applyProjectMeta(cached)

  try {
    const live = await fetchProjectMetaMap()
    writeProjectsCache(live)
    applyProjectMeta(live)
  } catch (error) {
    console.warn('[projects] failed to hydrate GitHub metadata', error)
  }
}

hydrateProjectCards()
document.addEventListener('astro:page-load', hydrateProjectCards)
