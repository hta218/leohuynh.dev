import Head from 'next/head'
import { useRouter } from 'next/router'
import { siteMetadata } from '~/data/siteMetadata'
import type { AuthorSEO, BlogSeoProps, PageSeoProps } from '~/types/seo'

export function PageSeo({ title, description }: PageSeoProps) {
  let router = useRouter()
  return (
    <Head>
      <title>{title}</title>
      <meta name="robots" content="follow, index" />
      <meta name="description" content={description} />
      <meta property="og:url" content={`${siteMetadata.siteUrl}${router.asPath}`} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:image" content={`${siteMetadata.siteUrl}${siteMetadata.socialBanner}`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={siteMetadata.x} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteMetadata.siteUrl}${siteMetadata.socialBanner}`} />
    </Head>
  )
}

export function BlogSeo(props: BlogSeoProps) {
  let router = useRouter()

  let { authorDetails, title, summary, date, lastmod, url, images = [] } = props
  let publishedAt = new Date(date).toISOString()
  let modifiedAt = new Date(lastmod || date).toISOString()
  let imagesArr =
    images.length === 0
      ? [siteMetadata.socialBanner]
      : typeof images === 'string'
      ? [images]
      : images

  let featuredImages = imagesArr.map((img) => {
    return {
      '@type': 'ImageObject',
      url: `${siteMetadata.siteUrl}${img}`,
    }
  })

  let authorList: AuthorSEO | AuthorSEO[] = []
  if (authorDetails) {
    authorList = authorDetails.map((author) => {
      return {
        '@type': 'Person',
        name: author.name,
      }
    })
  } else {
    authorList = {
      '@type': 'Person',
      name: process.env.AUTHOR_NAME,
    }
  }

  let structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline: title,
    image: featuredImages,
    datePublished: publishedAt,
    dateModified: modifiedAt,
    author: authorList,
    publisher: {
      '@type': 'Organization',
      name: process.env.AUTHOR_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${siteMetadata.siteUrl}${siteMetadata.siteLogo}`,
      },
    },
    description: summary,
  }

  return (
    <>
      <Head>
        <title>{`${title}`}</title>
        <meta name="robots" content="follow, index" />
        <meta name="description" content={summary} />
        <meta property="og:url" content={`${siteMetadata.siteUrl}${router.asPath}`} />
        <meta property="og:type" content="article" />
        <meta property="og:description" content={summary} />
        <meta property="og:title" content={`${title}`} />
        {featuredImages.map((img) => (
          <meta property="og:image" content={img.url} key={img.url} />
        ))}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={siteMetadata.x} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={summary} />
        <meta name="twitter:image" content={featuredImages[0].url} />
        {date && <meta property="article:published_time" content={publishedAt} />}
        {lastmod && <meta property="article:modified_time" content={modifiedAt} />}
        <link rel="canonical" href={`${siteMetadata.siteUrl}${router.asPath}`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData, null, 2) }}
        />
      </Head>
    </>
  )
}
