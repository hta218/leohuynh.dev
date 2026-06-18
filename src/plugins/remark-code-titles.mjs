import { visit } from 'unist-util-visit'

/**
 * Normalizes legacy code-fence titles into a form Expressive Code understands.
 *
 * Legacy MDX (contentlayer/rehype-prism style) writes the filename as part of the
 * language token: ```ts:file.ts```, ```bash:.env```, ```js:index.js```. Shiki treats
 * `ts:file.ts` as an unknown language and emits "language doesn't exist" warnings.
 *
 * This runs BEFORE remark-expressive-code, splitting `lang:title` into a real `lang`
 * plus an Expressive Code `title="..."` meta string, so the filename renders as a
 * frame tab and Shiki gets a known language.
 */
export function remarkCodeTitles() {
  return (tree) => {
    visit(tree, 'code', (node) => {
      if (!node.lang) return
      const match = /^([\w+#-]+):(.+)$/.exec(node.lang)
      if (!match) return
      const [, lang, rawTitle] = match
      node.lang = lang
      const title = rawTitle.replace(/"/g, '&quot;')
      const existing = node.meta ? ` ${node.meta}` : ''
      node.meta = `title="${title}"${existing}`
    })
  }
}
