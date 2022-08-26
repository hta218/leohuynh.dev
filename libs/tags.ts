import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import { kebabCase } from '~/utils'
import { getFiles } from './mdx'

let root = process.cwd()

export async function getAllTags(type: string) {
  let files: string[] = await getFiles(type)

  let tagCount = {}
  // Iterate through each post, putting all found tags into `tags`
  files.forEach((file) => {
    let source = fs.readFileSync(path.join(root, 'data', type, file), 'utf8')
    let { data } = matter(source)
    if (data.tags && data.draft !== true) {
      data.tags.forEach((tag: string) => {
        let formattedTag = kebabCase(tag)
        if (formattedTag in tagCount) {
          tagCount[formattedTag] += 1
        } else {
          tagCount[formattedTag] = 1
        }
      })
    }
  })

  return tagCount
}
