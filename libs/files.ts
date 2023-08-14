import fs from 'fs'
import path from 'path'
import { siteMetadata } from '~/data/siteMetadata'
import type { SiteMetaData } from '~/types/data'

function pipe(...fns: Function[]) {
  return (x: any) => fns.reduce((v, f) => f(v), x)
}

function flattenArray(input: any[]) {
  return input.reduce((acc, item) => [...acc, ...(Array.isArray(item) ? item : [item])], [])
}

function map(fn: any) {
  return (input: any[]) => input.map(fn)
}

function walkDir(fullPath: string) {
  return fs.statSync(fullPath).isFile() ? fullPath : getAllFilesRecursively(fullPath)
}

function pathJoinPrefix(prefix: string) {
  return (extraPath: string) => path.join(prefix, extraPath)
}

export function getAllFilesRecursively(folder: string): string[] {
  return pipe(fs.readdirSync, map(pipe(pathJoinPrefix(folder), walkDir)), flattenArray)(folder)
}

export function formatSlug(slug: string) {
  return slug.replace(/\.(mdx|md)/, '')
}

export function getMetaData(locale: string): SiteMetaData {
  let filePath = path.join(process.cwd(), 'public', 'locales', locale, 'common.json')
  let rawData = fs.readFileSync(filePath, 'utf8')
  let data = { site_meta_data: {} }
  try {
    data = JSON.parse(rawData)
  } catch (err) {
    console.log(`Missing common.json file for ${locale} locale`, err)
  }
  // @ts-ignore
  return {
    ...data.site_meta_data,
    ...siteMetadata,
  }
}

export function getFiles(type: string): string[] {
  let root = process.cwd()
  let prefixPaths = path.join(root, 'data', type)
  let files: string[]
  try {
    files = getAllFilesRecursively(prefixPaths)
  } catch (error) {
    return []
  }
  // Only want to return blog/path and ignore root, replace is needed to work on Windows
  return files.map((file) => file.slice(prefixPaths.length + 1).replace(/\\/g, '/'))
}
