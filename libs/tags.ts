import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import type { MdxFrontMatter, TagsCount } from '~/types'
import { kebabCase } from '~/utils'
import { getFiles } from './files'

export function getAllTags(type: string): TagsCount {
  let files = getFiles(type)
  let root = process.cwd()
  let tagsCount: TagsCount = {}

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

  return tagsCount
}
