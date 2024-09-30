'use client'

import { Comments as CommentsComponent, type CommentsConfig } from 'pliny/comments'
import { SITE_METADATA } from '~/data/site-metadata'

export function Comments({ slug }: { slug: string }) {
  if (!SITE_METADATA.comments?.provider) {
    return null
  }
  return <CommentsComponent commentsConfig={SITE_METADATA.comments as CommentsConfig} slug={slug} />
}
