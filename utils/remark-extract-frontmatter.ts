import type { Parent } from 'unist'
import { visit } from 'unist-util-visit'
import yaml from 'js-yaml'

/**
 * Extracts frontmatter from markdown file and adds it to the file's data object.
 *
 */
export function remarkExtractFrontmatter() {
  return (tree: Parent, file) => {
    visit(tree, 'yaml', (node: Parent) => {
      //@ts-ignore
      file.data.frontmatter = yaml.load(node.value)
    })
  }
}
