import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import type { MdxFrontMatter } from '~/types/mdx'
import type { TagsCount } from '~/types/server'
import { kebabCase } from '~/utils/string'
import { getFiles } from './files.server'

export function getAllTags(...types: string[]): TagsCount {
  let root = process.cwd()
  let tagsCount: TagsCount = {}

  for (const type of types) {
    let files = getFiles(type)

    // Iterate through each post, putting all found tags into `tags`
    files.forEach((file, i) => {
      let source = fs.readFileSync(path.join(root, 'data', type, file), 'utf8')
      let grayMatterData = matter(source)
      let data = grayMatterData.data as MdxFrontMatter
      if (data.tags && data.draft !== true) {
        data.tags.forEach((tag: string) => {
          let formattedTag = kebabCase(tag)
          if (formattedTag in tagsCount) {
            tagsCount[formattedTag] += 1
          } else {
            tagsCount[formattedTag] = 1
          }
        })
      }
    })
  }
  return tagsCount
}
