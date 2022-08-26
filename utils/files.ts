import fs from 'fs'
import path from 'path'

function pipe(...fns: any[]) {
  return (x: any) => fns.reduce((v, f) => f(v), x)
}

function flattenArray(input: any[]) {
  return input.reduce((acc, item) => [...acc, ...(Array.isArray(item) ? item : [item])], [])
}

function map(fn: (...args: any) => any) {
  return (input: unknown[]) => input.map(fn)
}

function walkDir(fullPath: string) {
  return fs.statSync(fullPath).isFile() ? fullPath : getAllFilesRecursively(fullPath)
}

function pathJoinPrefix(prefix: string) {
  return (extraPath: string) => path.join(prefix, extraPath)
}

export function getAllFilesRecursively(folder: string) {
  return pipe(fs.readdirSync, map(pipe(pathJoinPrefix(folder), walkDir)), flattenArray)(folder)
}
