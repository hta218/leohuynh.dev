import type { CoreContent, MDXDocument } from '~/types/data'

let isProduction = process.env.NODE_ENV === 'production'

/**
 * A typesafe omit helper function
 * @example omit(content, ['body', '_raw', '_id'])
 *
 * @param {Obj} obj
 * @param {Keys[]} keys
 * @return {*}  {Omit<Obj, Keys>}
 */
function omit<Obj, Keys extends keyof Obj>(obj: Obj, keys: Keys[]): Omit<Obj, Keys> {
  const result = Object.assign({}, obj)
  keys.forEach((key) => {
    delete result[key]
  })
  return result
}

/**
 * Omit body, _raw, _id from MDX document and return only the core content
 *
 * @param {T} content
 * @return {*}  {CoreContent<T>}
 */
export function coreContent<T extends MDXDocument>(content: T): CoreContent<T> {
  return omit(content, ['body', '_raw', '_id'])
}

/**
 * Omit body, _raw, _id from a list of MDX documents and returns only the core content
 * If `NODE_ENV` === "production", it will also filter out any documents with draft: true.
 *
 * @param {T[]} contents
 * @return {*}  {CoreContent<T>[]}
 */
export function allCoreContent<T extends MDXDocument>(contents: T[]): CoreContent<T>[] {
  if (isProduction)
    return contents.map((c) => coreContent(c)).filter((c) => !('draft' in c && c.draft === true))
  return contents.map((c) => coreContent(c))
}
