import type { Parent } from 'unist'
import { visit } from 'unist-util-visit'

/**
 * Parses title from code block and inserts it as a sibling title node.
 *
 */
export function remarkCodeTitles() {
  return (tree: Parent & { lang?: string }) =>
    visit(tree, 'code', (node: Parent & { lang?: string }, index: number, parent: Parent) => {
      let nodeLang = node.lang || ''
      let language = ''
      let title = ''

      if (nodeLang.includes(':')) {
        language = nodeLang.slice(0, nodeLang.search(':'))
        title = nodeLang.slice(nodeLang.search(':') + 1, nodeLang.length)
      }

      if (!title) return

      parent.children.splice(index, 0, {
        type: 'mdxJsxFlowElement',
        // @ts-ignore
        name: 'CodeTitle',
        attributes: [
          { type: 'mdxJsxAttribute', name: 'lang', value: language },
          { type: 'mdxJsxAttribute', name: 'title', value: title },
        ],
        data: { _xdmExplicitJsx: true },
      })
      node.lang = language
    })
}
