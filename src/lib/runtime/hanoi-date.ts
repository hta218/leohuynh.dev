const HANOI_UTC_OFFSET_MS = 7 * 60 * 60 * 1000

export function todayInHanoi(): {
  date: string
  from: string
  to: string
  startMs: number
} {
  const now = new Date()
  const hanoiNow = new Date(now.getTime() + HANOI_UTC_OFFSET_MS)
  return hanoiDateRange(
    hanoiNow.getUTCFullYear(),
    hanoiNow.getUTCMonth(),
    hanoiNow.getUTCDate(),
  )
}

function hanoiDateRange(
  year: number,
  zeroBasedMonth: number,
  day: number,
): { date: string; from: string; to: string; startMs: number } {
  const startMs = Date.UTC(year, zeroBasedMonth, day) - HANOI_UTC_OFFSET_MS
  const startUtc = new Date(startMs)
  const endUtc = new Date(startMs + 24 * 60 * 60 * 1000 - 1)
  return {
    date: `${year}-${String(zeroBasedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    from: startUtc.toISOString(),
    to: endUtc.toISOString(),
    startMs,
  }
}

export function hanoiDateRangeFromDate(date: string): {
  date: string
  from: string
  to: string
  startMs: number
} {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
  if (!match) throw new Error('Expected date in YYYY-MM-DD format.')

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const normalized = new Date(Date.UTC(year, month - 1, day))
  if (
    normalized.getUTCFullYear() !== year ||
    normalized.getUTCMonth() !== month - 1 ||
    normalized.getUTCDate() !== day
  ) {
    throw new Error('Invalid calendar date.')
  }

  return hanoiDateRange(year, month - 1, day)
}

export function hanoiDateRangeOffset(
  baseStartMs: number,
  offsetDays: number,
): {
  date: string
  from: string
  to: string
  startMs: number
} {
  const hanoiDate = new Date(
    baseStartMs + offsetDays * 24 * 60 * 60 * 1000 + HANOI_UTC_OFFSET_MS,
  )
  return hanoiDateRange(
    hanoiDate.getUTCFullYear(),
    hanoiDate.getUTCMonth(),
    hanoiDate.getUTCDate(),
  )
}

export function githubHeatmapDateWindow(): {
  fromDate: string
  toDate: string
  from: string
  to: string
} {
  const today = todayInHanoi()
  const yesterday = hanoiDateRangeOffset(today.startMs, -1)
  const start = hanoiDateRangeOffset(yesterday.startMs, -27)
  return {
    fromDate: start.date,
    toDate: yesterday.date,
    from: start.from,
    to: yesterday.to,
  }
}
