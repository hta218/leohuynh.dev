'use client'

import type { Action } from 'kbar'
import { KBarProvider } from 'kbar'
import { useRouter } from 'next/navigation.js'
import { useEffect, useState, type ReactNode } from 'react'
import type { CoreContent, MDXDocument } from '~/types/data'
import { formatDate } from '~/utils/misc'
import { KBarModal } from './kbar-modal'

export interface KBarSearchProps {
  searchDocumentsPath: string | false
  defaultActions?: Action[]
  onSearchDocumentsLoad?: (json: any) => Action[]
}

export interface KBarConfig {
  provider: 'kbar'
  kbarConfig: KBarSearchProps
}

export function KBarSearchProvider({
  configs,
  children,
}: {
  configs: KBarSearchProps
  children: ReactNode
}) {
  let { searchDocumentsPath, defaultActions, onSearchDocumentsLoad } = configs
  let router = useRouter()
  let [searchActions, setSearchActions] = useState<Action[]>([])
  let [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    function mapPosts(posts: CoreContent<MDXDocument>[]) {
      let actions: Action[] = []
      for (let post of posts) {
        actions.push({
          id: post.path,
          name: post.title,
          keywords: post?.summary || '',
          section: 'Content',
          subtitle: formatDate(post.date),
          perform: () => router.push('/' + post.path),
        })
      }
      return actions
    }
    async function fetchData() {
      if (searchDocumentsPath) {
        let url =
          searchDocumentsPath.indexOf('://') > 0 || searchDocumentsPath.indexOf('//') === 0
            ? searchDocumentsPath
            : new URL(searchDocumentsPath, window.location.origin)
        let res = await fetch(url)
        let json = await res.json()
        let actions = onSearchDocumentsLoad ? onSearchDocumentsLoad(json) : mapPosts(json)
        setSearchActions(actions)
        setDataLoaded(true)
      }
    }
    if (!dataLoaded && searchDocumentsPath) {
      fetchData()
    } else {
      setDataLoaded(true)
    }
  }, [defaultActions, dataLoaded, router, searchDocumentsPath, onSearchDocumentsLoad])

  return (
    <KBarProvider actions={defaultActions}>
      <KBarModal actions={searchActions} isLoading={!dataLoaded} />
      {children}
    </KBarProvider>
  )
}
