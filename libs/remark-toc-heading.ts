import { visit } from 'unist-util-visit'
import Slugger from 'github-slugger'
import { toString } from 'mdast-util-to-string'
import type { RemarkTocHeadingOptions, UnistNodeType, UnistTreeType } from '~/types'

function transformNode(node, output, indexMap, sluggerInstance) {
  let textContent = toString(node)
  let transformedNode = {
    value: textContent,
    depth: node.depth,
    data: node.data,
    children: [],
    url:
      '#' + (node.data.hProperties ? node.data.hProperties.id : sluggerInstance.slug(textContent)),
  }

  if (node.depth === 2) {
    output.push(transformedNode)
    indexMap[node.depth] = transformedNode
  } else {
    let parent = indexMap[node.depth - 1]
    if (parent) {
      parent.children.push(transformedNode)
      indexMap[node.depth] = transformedNode
    }
  }
}

function addID(node, nodes, sluggerInstance) {
  let originalSlug = sluggerInstance.slug(toString(node))

  if (!nodes[originalSlug]) {
    nodes[originalSlug] = 0
  }

  nodes[originalSlug]++

  let id = nodes[originalSlug] > 1 ? `${originalSlug}-${nodes[originalSlug]}` : originalSlug

  node.data = node.data || {}
  node.data.hProperties = node.data.hProperties || {}
  node.data.hProperties.id = id
}

export function remarkTocHeading(options: RemarkTocHeadingOptions) {
  return (tree: UnistTreeType) => {
    let nodes = {}
    let sluggerInstance = new Slugger()

    if (!options.cleaned) {
      options.exportRef.length = 0
      options.cleaned = true
    }

    visit(tree, 'heading', (node: UnistNodeType) => {
      addID(node, nodes, sluggerInstance)
      transformNode(node, options.exportRef, {}, sluggerInstance)
    })
  }
}
