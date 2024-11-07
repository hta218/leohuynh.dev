import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import type { SelectStats, StatsType } from '~/db/schema'
import { fetcher } from '~/utils/misc'

export function useBlogStats(type: StatsType, slug: string) {
  let { data, isLoading } = useSWR<SelectStats>(`/api/stats?slug=${slug}&type=${type}`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })
  let { views, loves, applauses, ideas, bullseyes } = data || {}
  let stats: SelectStats = {
    type,
    slug,
    views: views || 0,
    loves: loves || 0,
    applauses: applauses || 0,
    ideas: ideas || 0,
    bullseyes: bullseyes || 0,
  }
  return [stats, isLoading] as const
}

export function useUpdateBlogStats() {
  let { trigger } = useSWRMutation(
    '/api/stats',
    async (url: string, { arg }: { arg: Partial<SelectStats> }) => {
      return fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg),
      }).catch(console.error)
    }
  )
  return trigger
}
