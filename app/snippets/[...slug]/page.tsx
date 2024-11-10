import type { Author, Snippet } from 'contentlayer/generated'
import { allAuthors, allSnippets } from 'contentlayer/generated'
// import 'css/prism.css'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDX_COMPONENTS } from '~/components/mdx'
import { SITE_METADATA } from '~/data/site-metadata'
import { PostBanner } from '~/layouts/post-banner'
import { PostLayout } from '~/layouts/post-layout'
import { PostSimple } from '~/layouts/post-simple'
import { allCoreContent, coreContent } from '~/utils/contentlayer'
import { MDXLayoutRenderer } from '~/components/mdx/layout-renderer'
import { sortPosts } from '~/utils/misc'

const DEFAULT_LAYOUT = 'PostSimple'
const LAYOUTS = {
  PostSimple,
  PostLayout,
  PostBanner,
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] }
}): Promise<Metadata | undefined> {
  let slug = decodeURI(params.slug.join('/'))
  let snippet = allSnippets.find((s) => s.slug === slug)
  let authorList = snippet?.authors || ['default']
  let authorDetails = authorList.map((author) => {
    let authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Author)
  })
  if (!snippet) {
    return
  }

  let publishedAt = new Date(snippet.date).toISOString()
  let modifiedAt = new Date(snippet.lastmod || snippet.date).toISOString()
  let authors = authorDetails.map((author) => author.name)
  let imageList = [SITE_METADATA.socialBanner]
  if (snippet.images) {
    imageList = typeof snippet.images === 'string' ? [snippet.images] : snippet.images
  }
  let ogImages = imageList.map((img) => {
    return {
      url: img.includes('http') ? img : SITE_METADATA.siteUrl + img,
    }
  })

  return {
    title: snippet.title,
    description: snippet.summary,
    openGraph: {
      title: snippet.title,
      description: snippet.summary,
      siteName: SITE_METADATA.title,
      locale: 'en_US',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: './',
      images: ogImages,
      authors: authors.length > 0 ? authors : [SITE_METADATA.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: snippet.title,
      description: snippet.summary,
      images: imageList,
    },
  }
}

export let generateStaticParams = async () => {
  return allSnippets.map((s) => ({ slug: s.slug.split('/').map((name) => decodeURI(name)) }))
}

export default async function Page({ params }: { params: { slug: string[] } }) {
  let slug = decodeURI(params.slug.join('/'))
  // Filter out drafts in production
  let sortedCoreContents = allCoreContent(sortPosts(allSnippets))
  let snippetIndex = sortedCoreContents.findIndex((p) => p.slug === slug)
  if (snippetIndex === -1) {
    return notFound()
  }

  let prev = sortedCoreContents[snippetIndex + 1]
  let next = sortedCoreContents[snippetIndex - 1]
  let snippet = allSnippets.find((p) => p.slug === slug) as Snippet
  let authorList = snippet?.authors || ['default']
  let authorDetails = authorList.map((author) => {
    let authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Author)
  })
  let mainContent = coreContent(snippet)
  let jsonLd = snippet.structuredData
  jsonLd['author'] = authorDetails.map((author) => {
    return {
      '@type': 'Person',
      name: author.name,
    }
  })

  let Layout = LAYOUTS[snippet.layout || DEFAULT_LAYOUT]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout content={mainContent} authorDetails={authorDetails} next={next} prev={prev}>
        <MDXLayoutRenderer code={snippet.body.code} components={MDX_COMPONENTS} toc={snippet.toc} />
      </Layout>
    </>
  )
}
