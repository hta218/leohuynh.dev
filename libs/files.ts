import fs from 'fs'
import path from 'path'

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

export function getFiles(type: string): string[] {
  let root = process.cwd()
  let prefixPaths = path.join(root, 'data', type)
  let files = getAllFilesRecursively(prefixPaths)
  // Only want to return blog/path and ignore root, replace is needed to work on Windows
  return files.map((file) => file.slice(prefixPaths.length + 1).replace(/\\/g, '/'))
}
