import fs from 'fs'
import sizeOf from 'image-size'
import { visit } from 'unist-util-visit'
import type { UnistImageNode, UnistNodeType, UnistTreeType } from '~/types/server'

export function remarkImgToJsx() {
  return (tree: UnistTreeType) => {
    return visit(tree, 'paragraph', (node: UnistNodeType) => {
      // Only visit `p` tags that contain an `img` element
      let hasImage = node.children.some((n) => n.type === 'image')
      if (!hasImage) return

      let imageNode = node.children.find((n) => n.type === 'image') as UnistImageNode

      // Convert original `image` to `next/image` for local files only
      let imageLocalPath = `${process.cwd()}/public${imageNode.url}`
      if (fs.existsSync(imageLocalPath)) {
        let dimensions = sizeOf(imageLocalPath)
        imageNode.type = 'mdxJsxFlowElement'
        imageNode.name = 'Image'
        imageNode.attributes = [
          { type: 'mdxJsxAttribute', name: 'alt', value: imageNode.alt },
          { type: 'mdxJsxAttribute', name: 'src', value: imageNode.url },
          { type: 'mdxJsxAttribute', name: 'width', value: dimensions.width },
          { type: 'mdxJsxAttribute', name: 'height', value: dimensions.height },
        ]
        let isThumbnail = imageNode.alt === 'thumbnail-image'
        if (isThumbnail) {
          imageNode.attributes = [
            ...imageNode.attributes,
            {
              type: 'mdxJsxAttribute',
              name: 'id',
              value: 'thumbnail-image',
            },
            { type: 'mdxJsxAttribute', name: 'priority', value: true },
          ]
        }

        // Change node type from p to div to avoid nesting error
        node.type = 'div'
        node.children = [imageNode]
      }
    })
  }
}
