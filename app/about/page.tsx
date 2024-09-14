import type { Authors } from 'contentlayer/generated'
import { allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { AuthorLayout } from '~/layouts/author-layout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'

export let metadata = genPageMetadata({ title: 'About' })

export default function Page() {
  let author = allAuthors.find((p) => p.slug === 'default') as Authors
  let mainContent = coreContent(author)

  return (
    <AuthorLayout content={mainContent}>
      <MDXLayoutRenderer code={author.body.code} />
    </AuthorLayout>
  )
}
