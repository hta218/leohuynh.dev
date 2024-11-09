import { slug } from 'github-slugger'
import { toString } from 'mdast-util-to-string'
import { remark } from 'remark'
import type { Parent } from 'unist'
import { visit } from 'unist-util-visit'

export type TocItem = {
  value: string
  url: string
  depth: number
}

export type Toc = TocItem[]

/**
 * Extracts TOC headings from markdown file and adds it to the file's data object.
 */
function remarkTocHeadings() {
  return (tree: Parent, file) => {
    let toc: Toc = []
    visit(tree, 'heading', (node) => {
      let textContent = toString(node).replace(/<[^>]*(>|$)/g, '')
      if (textContent) {
        toc.push({
          value: textContent,
          url: '#' + slug(textContent),
          // @ts-ignore
          depth: node.depth,
        })
      }
    })
    file.data.toc = toc
  }
}

/**
 * Passes markdown file through remark to extract TOC headings
 *
 * @param {string} markdown
 * @return {*}  {Promise<Toc>}
 */
export async function extractTocHeadings(markdown: string): Promise<Toc> {
  let vfile = await remark().use(remarkTocHeadings).process(markdown)
  // @ts-ignore
  return vfile.data.toc
}
