import type { MDXDocumentDate } from '~/types/data'

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
}

export async function fetcher(url: string) {
  return fetch(url).then((res) => res.json())
}

export function kebabCaseToPlainText(str: string): string {
  return str.replace(/-/g, ' ')
}

export function capitalize(str: string): string {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`
}

function is(interval: number, cycle: number) {
  return cycle >= interval ? Math.floor(cycle / interval) : 0
}

export function getTimeAgo(time: string | number | Date, now = Date.now()): string {
  if (typeof time === 'string' || time instanceof Date) {
    time = new Date(time).getTime()
  }

  let secs = (now - time) / 1000
  let mins = is(60, secs)
  let hours = is(60, mins)
  let days = is(24, hours)
  let weeks = is(7, days)
  let months = is(30, days)
  let years = is(12, months)

  let amt = years
  let cycle = 'year'

  if (secs <= 1) {
    return 'just now'
  }
  if (years > 0) {
    amt = years
    cycle = 'year'
  } else if (months > 0) {
    amt = months
    cycle = 'month'
  } else if (weeks > 0) {
    amt = weeks
    cycle = 'week'
  } else if (days > 0) {
    amt = days
    cycle = 'day'
  } else if (hours > 0) {
    amt = hours
    cycle = 'hour'
  } else if (mins > 0) {
    amt = mins
    cycle = 'minute'
  } else if (secs > 0) {
    amt = secs
    cycle = 'second'
  }

  let v = Math.floor(amt)

  return `${v === 1 ? (amt === hours ? 'an' : 'a') : v} ${cycle}${v > 1 ? 's' : ''} ago`
}

/**
 * Sorts a list of MDX documents by date in descending order
 */
export function sortPosts<T extends MDXDocumentDate>(allBlogs: T[], dateKey: string = 'date'): T[] {
  return allBlogs.sort((a, b) => dateSortDesc(a[dateKey], b[dateKey]))
}

function dateSortDesc(a: string, b: string) {
  if (a > b) return -1
  if (a < b) return 1
  return 0
}
