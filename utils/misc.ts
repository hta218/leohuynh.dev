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
