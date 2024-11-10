import type { ComputedFields } from 'contentlayer2/source-files'
import { defineDocumentType, makeSource } from 'contentlayer2/source-files'
import { writeFileSync } from 'fs'
import { slug } from 'github-slugger'
import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic'
import path from 'path'
import readingTime from 'reading-time'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeCitation from 'rehype-citation'
import rehypePresetMinify from 'rehype-preset-minify'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { remarkAlert } from 'remark-github-blockquote-alert'
import remarkMath from 'remark-math'
import { SITE_METADATA } from './data/site-metadata'
import { allCoreContent } from './utils/contentlayer'
import { sortPosts } from './utils/misc'
import { remarkCodeTitles } from './utils/remark-code-titles'
import { remarkExtractFrontmatter } from './utils/remark-extract-frontmatter'
import { remarkImgToJsx } from './utils/remark-img-to-jsx'
import { extractTocHeadings } from './utils/remark-toc-headings'

let root = process.cwd()
let isProduction = process.env.NODE_ENV === 'production'

// heroicon mini link
let icon = fromHtmlIsomorphic(
  `
    <span class="content-header-link">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 linkicon">
    <path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z" />
    <path d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z" />
    </svg>
    </span>
  `,
  { fragment: true }
)

let computedFields: ComputedFields = {
  readingTime: { type: 'json', resolve: (doc) => readingTime(doc.body.raw) },
  slug: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath.replace(/^.+?(\/)/, ''),
  },
  path: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath,
  },
  filePath: {
    type: 'string',
    resolve: (doc) => doc._raw.sourceFilePath,
  },
  toc: { type: 'json', resolve: (doc) => extractTocHeadings(doc.body.raw) },
}

/**
 * Count the occurrences of all tags across blog posts and write to json file
 */
function createTagCount(documents) {
  let tagCount: Record<string, number> = {}
  documents.forEach((file) => {
    if (file.tags && (!isProduction || file.draft !== true)) {
      file.tags.forEach((tag: string) => {
        let formattedTag = slug(tag)
        if (formattedTag in tagCount) {
          tagCount[formattedTag] += 1
        } else {
          tagCount[formattedTag] = 1
        }
      })
    }
  })
  writeFileSync('./json/tag-data.json', JSON.stringify(tagCount))
  console.log('🏷️. Tag list generated.')
}

function createSearchIndex(allBlogs) {
  let searchDocsPath = SITE_METADATA.search.kbarConfigs.searchDocumentsPath
  if (searchDocsPath) {
    writeFileSync(
      `public/${path.basename(searchDocsPath)}`,
      JSON.stringify(allCoreContent(sortPosts(allBlogs)))
    )
    console.log('🔍 Local search index generated.')
  }
}

export let Blog = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: 'blog/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    lastmod: { type: 'date' },
    draft: { type: 'boolean' },
    summary: { type: 'string' },
    images: { type: 'json' },
    authors: { type: 'list', of: { type: 'string' } },
    layout: { type: 'string' },
    bibliography: { type: 'string' },
    canonicalUrl: { type: 'string' },
  },
  computedFields: {
    ...computedFields,
    structuredData: {
      type: 'json',
      resolve: (doc) => ({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: doc.title,
        datePublished: doc.date,
        dateModified: doc.lastmod || doc.date,
        description: doc.summary,
        image: doc.images ? doc.images[0] : SITE_METADATA.socialBanner,
        url: `${SITE_METADATA.siteUrl}/${doc._raw.flattenedPath}`,
      }),
    },
  },
}))

export let Snippet = defineDocumentType(() => ({
  name: 'Snippet',
  filePathPattern: 'snippets/**/*.mdx',
  contentType: 'mdx',
  fields: {
    heading: { type: 'string', required: true },
    title: { type: 'string', required: true },
    icon: { type: 'string', required: true },
    date: { type: 'date', required: true },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    lastmod: { type: 'date' },
    draft: { type: 'boolean' },
    summary: { type: 'string' },
    images: { type: 'json' },
    authors: { type: 'list', of: { type: 'string' } },
    layout: { type: 'string' },
    bibliography: { type: 'string' },
    canonicalUrl: { type: 'string' },
  },
  computedFields: {
    ...computedFields,
    structuredData: {
      type: 'json',
      resolve: (doc) => ({
        '@context': 'https://schema.org',
        '@type': 'CodeSnippet',
        headline: doc.title,
        datePublished: doc.date,
        dateModified: doc.lastmod || doc.date,
        description: doc.summary,
        image: doc.images ? doc.images[0] : SITE_METADATA.socialBanner,
        url: `${SITE_METADATA.siteUrl}/${doc._raw.flattenedPath}`,
      }),
    },
  },
}))

export let Author = defineDocumentType(() => ({
  name: 'Author',
  filePathPattern: 'authors/**/*.mdx',
  contentType: 'mdx',
  fields: {
    name: { type: 'string', required: true },
    avatar: { type: 'string' },
    occupation: { type: 'string' },
    company: { type: 'string' },
    email: { type: 'string' },
    twitter: { type: 'string' },
    linkedin: { type: 'string' },
    github: { type: 'string' },
    layout: { type: 'string' },
  },
  computedFields,
}))

export default makeSource({
  contentDirPath: 'data',
  documentTypes: [Blog, Snippet, Author],
  mdx: {
    cwd: process.cwd(),
    remarkPlugins: [
      remarkExtractFrontmatter,
      remarkGfm,
      remarkCodeTitles,
      remarkMath,
      remarkImgToJsx,
      remarkAlert,
    ],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'prepend',
          headingProperties: {
            className: ['content-header'],
          },
          content: icon,
        },
      ],
      // rehypeKatex,
      [rehypeCitation, { path: path.join(root, 'data') }],
      // [rehypePrismPlus, { defaultLanguage: 'js', ignoreMissing: true }],
      [
        rehypePrettyCode,
        {
          theme: {
            dark: 'github-dark-dimmed',
            light: 'solarized-light',
          },
        },
      ],
      rehypePresetMinify,
    ],
  },
  onSuccess: async (importData) => {
    let { allBlogs, allSnippets } = await importData()
    let allPosts = [...allBlogs, ...allSnippets]
    createTagCount(allPosts)
    createSearchIndex(allPosts)
    console.log('✨ Content source generated successfully!')
  },
})
