'use client'

import { Comments as CommentsComponent, type CommentsConfig } from 'pliny/comments'
import { SITE_METADATA } from '~/data/site-metadata'

export function Comments({ slug, className }: { slug: string; className?: string }) {
  if (!SITE_METADATA.comments?.provider) {
    return null
  }
  return (
    <div id="comment" className={className}>
      <CommentsComponent commentsConfig={SITE_METADATA.comments as CommentsConfig} slug={slug} />
    </div>
  )
}
