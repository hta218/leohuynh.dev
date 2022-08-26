import { bundleMDX } from 'mdx-bundler'
import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import readingTime from 'reading-time'
import visit from 'unist-util-visit'
import codeTitles from './remark-code-title'
import imgToJsx from './img-to-jsx'
import { getAllFilesRecursively, formatSlug } from '~/libs'
import { dateSortDesc } from '~/utils'
import { TOKEN_CLASSNAME_MAP } from '~/constant'

export async function getFileBySlug(type, slug) {
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

  let { frontmatter, code } = await bundleMDX({
    source,
    cwd: path.join(process.cwd(), 'components'),
    esbuildOptions: (options) => {
      options.loader = {
        ...options.loader,
        '.js': 'jsx',
        '.ts': 'tsx',
      }
      return options
    },
    mdxOptions(options) {
      // This is the recommended way to add custom remark/rehype plugins:
      // The syntax might look weird, but it protects you in case we add/remove plugins in the future.
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        require('remark-slug'),
        require('remark-autolink-headings'),
        require('remark-gfm'),
        codeTitles,
        [require('remark-footnotes'), { inlineNotes: true }],
        require('remark-math'),
        imgToJsx,
      ]
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        // require('rehype-katex'),
        [require('rehype-prism-plus'), { ignoreMissing: true }],
        () => {
          return (tree) => {
            visit(tree, 'element', (node, index, parent) => {
              // @ts-ignore
              let [token, type] = node.properties.className || []
              if (token === 'token') {
                // @ts-ignore
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
    frontMatter: {
      readingTime: readingTime(code),
      slug: slug || null,
      fileName: fs.existsSync(mdxPath) ? `${slug}.mdx` : `${slug}.md`,
      ...frontmatter,
    },
  }
}

export async function getAllFilesFrontMatter(folder) {
  let root = process.cwd()
  let prefixPaths = path.join(root, 'data', folder)
  let files = getAllFilesRecursively(prefixPaths)
  let allFrontMatter = []

  files.forEach((file) => {
    // Replace is needed to work on Windows
    let fileName = file.slice(prefixPaths.length + 1).replace(/\\/g, '/')
    // Remove Unexpected File
    if (path.extname(fileName) !== '.md' && path.extname(fileName) !== '.mdx') {
      return
    }
    let source = fs.readFileSync(file, 'utf8')
    let { data } = matter(source)
    if (data.draft !== true) {
      allFrontMatter.push({ ...data, slug: formatSlug(fileName) })
    }
  })

  return allFrontMatter.sort((a, b) => dateSortDesc(a.date, b.date))
}
