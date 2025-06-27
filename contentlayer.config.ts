import { execSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import path from 'node:path'
import type { ComputedFields } from 'contentlayer2/source-files'
import { defineDocumentType, makeSource } from 'contentlayer2/source-files'
import { slug } from 'github-slugger'
import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic'
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

// https://lucide.dev/icons/hash
let icon = fromHtmlIsomorphic(
  `
    <span class="heading-anchor -ml-6 inline-flex items-center pr-1 opacity-30 hover:opacity-100 transition-opacity text-gray-800 dark:text-gray-50">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="w-5 h-5 inline-block"><line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/></svg>
    </span>
  `,
  { fragment: true },
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
 * Count the occurrences of all tags across blog posts and snippets and write to json file
 */
function createTagCount(documents) {
  let tagCount: Record<string, number> = {}
  for (let file of documents) {
    if (file.tags && (!isProduction || file.draft !== true)) {
      for (let tag of file.tags) {
        let formattedTag = slug(tag)
        if (formattedTag in tagCount) {
          tagCount[formattedTag] += 1
        } else {
          tagCount[formattedTag] = 1
        }
      }
    }
  }
  writeFileSync('./json/tag-data.json', JSON.stringify(tagCount))
  // Run format on the generated file
  if (!isProduction) {
    execSync('pnpm biome format --write ./json/tag-data.json', {
      stdio: 'ignore',
    })
  }
  console.log('🏷️. Tag list generated.')
}

function createSearchIndex(allBlogs) {
  let searchDocsPath = SITE_METADATA.search.kbarConfigs.searchDocumentsPath
  if (searchDocsPath) {
    writeFileSync(
      `public/${path.basename(searchDocsPath)}`,
      JSON.stringify(allCoreContent(sortPosts(allBlogs))),
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
            className: ['hover:[&_.heading-anchor]:opacity-100'],
          },
          content: icon,
        },
      ],
      [rehypeCitation, { path: path.join(root, 'data') }],
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
