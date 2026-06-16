import Giscus from '@giscus/react'
import type { GiscusConfig } from '~/lib/comments'

export default function Comments({ config }: { config: GiscusConfig }) {
  return (
    <div id="comment" className="not-prose mt-10 border-t border-line pt-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
          comments
        </span>
      </div>
      <Giscus
        id="comments-container"
        repo={config.repo}
        repoId={config.repoId}
        category={config.category}
        categoryId={config.categoryId}
        mapping={config.mapping}
        reactionsEnabled={config.reactionsEnabled}
        emitMetadata={config.emitMetadata}
        inputPosition={config.inputPosition}
        theme={config.theme}
        lang={config.lang}
        loading="lazy"
      />
    </div>
  )
}
