// Statusbar time widgets: the visitor-vs-Hanoi local clock and the relative
// "last commit" timestamp. Both refresh on an interval, guarded per shell.

/** Live Hanoi clock + the visitor's offset from it. */
export function setupClock(shell: HTMLElement) {
  const timeEl = shell.querySelector<HTMLElement>('[data-local-time]')
  const diffEl = shell.querySelector<HTMLElement>('[data-local-time-diff]')
  const updateTime = () => {
    if (!timeEl) return
    const date = new Date()
    const hanoiOffset = -420
    const visitorOffset = date.getTimezoneOffset()
    const hoursDiff = (visitorOffset - hanoiOffset) / 60
    const diff =
      hoursDiff === 0
        ? 'same time'
        : hoursDiff > 0
          ? `${hoursDiff}h ahead`
          : `${Math.abs(hoursDiff)}h behind`
    timeEl.textContent = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short',
    }).format(date)
    if (diffEl) diffEl.textContent = `- ${diff}`
  }
  updateTime()
  if (!shell.dataset.timeBound) {
    shell.dataset.timeBound = 'true'
    setInterval(updateTime, 30_000)
  }
}

/** Relative "· 3 hours ago" suffix on the last-commit statusbar link. */
export function setupCommitAgo(shell: HTMLElement) {
  const commitLink = shell.querySelector<HTMLElement>('[data-commit-time]')
  const commitAgoEl = shell.querySelector<HTMLElement>('[data-commit-ago]')
  const updateCommitAgo = () => {
    if (!commitLink || !commitAgoEl) return
    const date = new Date(commitLink.getAttribute('data-commit-time') || '')
    if (Number.isNaN(date.getTime())) return
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
    let value: number
    let unit: Intl.RelativeTimeFormatUnit
    if (seconds < 60) {
      value = seconds
      unit = 'second'
    } else if (seconds < 3600) {
      value = Math.floor(seconds / 60)
      unit = 'minute'
    } else if (seconds < 86400) {
      value = Math.floor(seconds / 3600)
      unit = 'hour'
    } else {
      value = Math.floor(seconds / 86400)
      unit = 'day'
    }
    commitAgoEl.textContent = `· ${rtf.format(-value, unit)}`
  }
  updateCommitAgo()
  if (!shell.dataset.commitBound) {
    shell.dataset.commitBound = 'true'
    setInterval(updateCommitAgo, 60_000)
  }
}
