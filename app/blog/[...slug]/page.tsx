import type { Author, Blog } from 'contentlayer/generated'
import { allAuthors, allBlogs } from 'contentlayer/generated'
// import 'css/prism.css'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDX_COMPONENTS } from '~/components/mdx'
import { MDXLayoutRenderer } from '~/components/mdx/layout-renderer'
import { SITE_METADATA } from '~/data/site-metadata'
import { PostBanner } from '~/layouts/post-banner'
import { PostLayout } from '~/layouts/post-layout'
import { PostSimple } from '~/layouts/post-simple'
import { allCoreContent, coreContent } from '~/utils/contentlayer'
import { sortPosts } from '~/utils/misc'

const DEFAULT_LAYOUT = 'PostLayout'
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
  let post = allBlogs.find((p) => p.slug === slug)
  let authorList = post?.authors || ['default']
  let authorDetails = authorList.map((author) => {
    let authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Author)
  })
  if (!post) {
    return
  }

  let publishedAt = new Date(post.date).toISOString()
  let modifiedAt = new Date(post.lastmod || post.date).toISOString()
  let authors = authorDetails.map((author) => author.name)
  let imageList = [SITE_METADATA.socialBanner]
  if (post.images) {
    imageList = typeof post.images === 'string' ? [post.images] : post.images
  }
  let ogImages = imageList.map((img) => {
    return {
      url: img.includes('http') ? img : SITE_METADATA.siteUrl + img,
    }
  })

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
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
      title: post.title,
      description: post.summary,
      images: imageList,
    },
  }
}

export let generateStaticParams = async () => {
  return allBlogs.map((p) => ({ slug: p.slug.split('/').map((name) => decodeURI(name)) }))
}

export default async function Page({ params }: { params: { slug: string[] } }) {
  let slug = decodeURI(params.slug.join('/'))
  // Filter out drafts in production
  let sortedCoreContents = allCoreContent(sortPosts(allBlogs))
  let postIndex = sortedCoreContents.findIndex((p) => p.slug === slug)
  if (postIndex === -1) {
    return notFound()
  }

  let prev = sortedCoreContents[postIndex + 1]
  let next = sortedCoreContents[postIndex - 1]
  let post = allBlogs.find((p) => p.slug === slug) as Blog
  let authorList = post?.authors || ['default']
  let authorDetails = authorList.map((author) => {
    let authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Author)
  })
  let mainContent = coreContent(post)
  let jsonLd = post.structuredData
  jsonLd['author'] = authorDetails.map((author) => {
    return {
      '@type': 'Person',
      name: author.name,
    }
  })
  let Layout = LAYOUTS[post.layout || DEFAULT_LAYOUT]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout content={mainContent} authorDetails={authorDetails} next={next} prev={prev}>
        <MDXLayoutRenderer code={post.body.code} components={MDX_COMPONENTS} toc={post.toc} />
      </Layout>
    </>
  )
}
