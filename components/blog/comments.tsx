'use client'

import { useTheme } from 'next-themes'
import GiscusComponent from '@giscus/react'
import type { Mapping, BooleanString, InputPosition } from '@giscus/react'
import { SITE_METADATA } from '~/data/site-metadata'

interface GiscusConfig {
  themeURL: string
  theme: string
  darkTheme: string
  mapping: Mapping
  repo: `${string}/${string}`
  repositoryId: string
  category: string
  categoryId: string
  reactions: BooleanString
  metadata: BooleanString
  inputPosition: InputPosition
  lang: string
}

interface CommentsProps {
  configs?: Partial<GiscusConfig>
  className?: string
}

export function Comments({ configs, className }: CommentsProps) {
  let defaultConfigs = SITE_METADATA.comments.giscusConfig as GiscusConfig
  let {
    themeURL,
    theme,
    darkTheme,
    repo,
    repositoryId,
    category,
    categoryId,
    reactions,
    metadata,
    inputPosition,
    lang,
    mapping,
  } = { ...defaultConfigs, ...configs }

  let { theme: siteTheme, resolvedTheme } = useTheme()
  let commentsTheme =
    themeURL === ''
      ? siteTheme === 'dark' || resolvedTheme === 'dark'
        ? darkTheme
        : theme
      : themeURL

  return (
    <div id="comment" className={className}>
      <GiscusComponent
        id="comments-container"
        repo={repo}
        repoId={repositoryId}
        category={category}
        categoryId={categoryId}
        mapping={mapping}
        reactionsEnabled={reactions}
        emitMetadata={metadata}
        inputPosition={inputPosition}
        theme={commentsTheme}
        lang={lang}
        loading="lazy"
      />
    </div>
  )
}
