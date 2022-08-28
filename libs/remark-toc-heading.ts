import { visit } from 'unist-util-visit'
import { slug } from 'github-slugger'
import { toString } from 'mdast-util-to-string'
import type { RemarkTocHeadingOptions, UnistNodeType, UnistTreeType } from '~/types'

export function remarkTocHeading(options: RemarkTocHeadingOptions) {
  return (tree: UnistTreeType) =>
    visit(tree, 'heading', (node: UnistNodeType) => {
      let textContent = toString(node)
      options.exportRef.push({
        value: textContent,
        url: '#' + slug(textContent),
        depth: node.depth,
      })
    })
}
