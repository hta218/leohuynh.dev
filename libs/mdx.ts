import fs from 'fs'
import matter from 'gray-matter'
import { bundleMDX } from 'mdx-bundler'
import path from 'path'
import readingTime from 'reading-time'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePresetMinify from 'rehype-preset-minify'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypeSlug from 'rehype-slug'
import remarkGFM from 'remark-gfm'
import { visit } from 'unist-util-visit'
import { TOKEN_CLASSNAME_MAP } from '~/constant'
import { formatSlug, getAllFilesRecursively } from '~/libs'
import type { BlogFrontMatter, MdxFileData, MdxFrontMatter, TOC, UnistNodeType } from '~/types'
import { dateSortDesc } from '~/utils'
import { remarkCodeBlockTitle } from './remark-code-block-title'
import { remarkImgToJsx } from './remark-img-to-jsx'
import { remarkTocHeading } from './remark-toc-heading'

export async function getFileBySlug(type: string, slug: string): Promise<MdxFileData> {
  let root = process.cwd()
  let mdxPath = path.join(root, 'data', type, `${slug}.mdx`)
  let mdPath = path.join(root, 'data', type, `${slug}.md`)
  let source = fs.existsSync(mdxPath)
    ? fs.readFileSync(mdxPath, 'utf8')
    : fs.readFileSync(mdPath, 'utf8')

  /**
   * Point esbuild directly at the correct executable for the current platform
   * Ref: https://github.com/kentcdodds/mdx-bundler#nextjs-esbuild-enoent
   */
  if (process.platform === 'win32') {
    process.env.ESBUILD_BINARY_PATH = path.join(
      process.cwd(),
      'node_modules',
      'esbuild',
      'esbuild.exe'
    )
  } else {
    process.env.ESBUILD_BINARY_PATH = path.join(
      process.cwd(),
      'node_modules',
      'esbuild',
      'bin',
      'esbuild'
    )
  }

  let toc: TOC[] = []
  let { frontmatter, code } = await bundleMDX<MdxFrontMatter>({
    source,
    cwd: path.join(process.cwd(), 'components'),
    esbuildOptions: (options) => {
      options.loader = {
        ...options.loader,
        '.js': 'jsx',
      }
      return options
    },
    mdxOptions(options) {
      /**
       * This is the recommended way to add custom remark/rehype plugins.
       * The syntax might look weird, but it protects you in case we add/remove plugins in the future.
       * Ref: https://github.com/kentcdodds/mdx-bundler#mdxoptions
       */
      options.remarkPlugins = [
        ...(options.remarkPlugins || []),
        [remarkTocHeading, { exportRef: toc }],
        remarkGFM,
        remarkCodeBlockTitle,
        remarkImgToJsx,
      ]
      options.rehypePlugins = [
        ...(options.rehypePlugins || []),
        rehypeSlug,
        rehypeAutolinkHeadings,
        [rehypePrismPlus, { ignoreMissing: true }],
        rehypePresetMinify,
        () => {
          return (tree) => {
            visit(tree, 'element', (node: UnistNodeType) => {
              let [token, type] = node.properties.className || []
              if (token === 'token') {
                node.properties.className = [TOKEN_CLASSNAME_MAP[type]]
              }
            })
          }
        },
      ]
      return options
    },
  })

  return {
    toc,
    mdxSource: code,
    frontMatter: {
      readingTime: readingTime(code),
      slug: slug || null,
      fileName: fs.existsSync(mdxPath) ? `${slug}.mdx` : `${slug}.md`,
      ...frontmatter,
    },
  }
}

export function getAllFilesFrontMatter(folder: string) {
  let root = process.cwd()
  let prefixPaths = path.join(root, 'data', folder)
  let files = getAllFilesRecursively(prefixPaths)
  let allFrontMatter: BlogFrontMatter[] = []

  files.forEach((file) => {
    // Replace is needed to work on Windows
    let fileName = file.slice(prefixPaths.length + 1).replace(/\\/g, '/')
    // Remove Unexpected File
    if (path.extname(fileName) !== '.md' && path.extname(fileName) !== '.mdx') {
      return
    }
    let source = fs.readFileSync(file, 'utf8')
    let grayMatterData = matter(source)
    let data = grayMatterData.data as BlogFrontMatter
    if (data.draft !== true) {
      allFrontMatter.push({ ...data, slug: formatSlug(fileName) })
    }
  })

  return allFrontMatter.sort((a, b) => dateSortDesc(a.date, b.date))
}
