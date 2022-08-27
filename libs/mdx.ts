import fs from 'fs'
import matter from 'gray-matter'
import { bundleMDX } from 'mdx-bundler'
import path from 'path'
import readingTime from 'reading-time'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePresetMinify from 'rehype-preset-minify'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { visit } from 'unist-util-visit'
import { TOKEN_CLASSNAME_MAP } from '~/constant'
import { formatSlug, getAllFilesRecursively } from '~/libs'
import type { BlogFrontMatter, MdxFileData, MdxFrontMatter, UnistNodeType } from '~/types'
import { dateSortDesc } from '~/utils'
import { remarkCodeBlockTitles } from './remark-code-block-titles'
import { remarkImgToJsx } from './remark-img-to-jsx'
import { remarkTocHeadings } from './remark-toc-headings'

export async function getFileBySlug(type: string, slug: string): Promise<MdxFileData> {
  let root = process.cwd()
  let mdxPath = path.join(root, 'data', type, `${slug}.mdx`)
  let mdPath = path.join(root, 'data', type, `${slug}.md`)
  let source = fs.existsSync(mdxPath)
    ? fs.readFileSync(mdxPath, 'utf8')
    : fs.readFileSync(mdPath, 'utf8')

  // https://github.com/kentcdodds/mdx-bundler#nextjs-esbuild-enoent
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

  let toc = []
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
      options.remarkPlugins = [
        ...(options.remarkPlugins || []),
        [remarkTocHeadings, { exportRef: toc }],
        remarkGfm,
        remarkCodeBlockTitles,
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
    mdxSource: code,
    toc,
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
