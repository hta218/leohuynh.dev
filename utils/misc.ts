export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en', {
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
