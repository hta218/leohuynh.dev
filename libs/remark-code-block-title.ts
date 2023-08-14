import { visit } from 'unist-util-visit'
import type { UnistNodeType, UnistTreeType } from '~/types/server'

export function remarkCodeBlockTitle() {
  return (tree: UnistTreeType) => {
    return visit(tree, 'code', (node: UnistNodeType, index) => {
      let nodeLang = node.lang || ''
      let language = ''
      let title = ''

      if (nodeLang.includes(':')) {
        language = nodeLang.slice(0, nodeLang.search(':'))
        title = nodeLang.slice(nodeLang.search(':') + 1, nodeLang.length)
      }
      if (!title) return

      let className = 'remark-code-title'
      let titleNode = {
        type: 'mdxJsxFlowElement',
        name: 'div',
        attributes: [{ type: 'mdxJsxAttribute', name: 'className', value: className }],
        children: [{ type: 'text', value: title }],
        data: { _xdmExplicitJsx: true },
      }

      tree.children.splice(index, 0, titleNode)
      // @ts-ignore
      node.lang = language
    })
  }
}
