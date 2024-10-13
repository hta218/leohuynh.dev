type TocItem = {
  value: string
  url: string
  depth: number
}

interface TOCInlineProps {
  toc: TocItem[]
  fromHeading?: number
  toHeading?: number
  asDisclosure?: boolean
  exclude?: string | string[]
  collapse?: boolean
  ulClassName?: string
  liClassName?: string
}

interface NestedTocItem extends TocItem {
  children?: NestedTocItem[]
}

function createNestedList(items: TocItem[]): NestedTocItem[] {
  let nestedList: NestedTocItem[] = []
  let stack: NestedTocItem[] = []

  items.forEach((item) => {
    let newItem: NestedTocItem = { ...item }
    while (stack.length > 0 && stack[stack.length - 1].depth >= newItem.depth) {
      stack.pop()
    }

    let parent = stack.length > 0 ? stack[stack.length - 1] : null
    if (parent) {
      parent.children = parent.children || []
      parent.children.push(newItem)
    } else {
      nestedList.push(newItem)
    }
    stack.push(newItem)
  })

  return nestedList
}

/**
 * Generates an inline table of contents
 * Exclude titles matching this string (new RegExp('^(' + string + ')$', 'i')).
 * If an array is passed the array gets joined with a pipe (new RegExp('^(' + array.join('|') + ')$', 'i')).
 *
 * `asDisclosure` will wrap the TOC in a `details` element with a `summary` element.
 * `collapse` will collapse the TOC when `AsDisclosure` is true.
 *
 * If you are using tailwind css and want to revert to the default HTML list style, set `ulClassName="[&_ul]:list-[revert]"`
 * @param {TOCInlineProps} {
 *   toc,
 *   fromHeading = 1,
 *   toHeading = 6,
 *   asDisclosure = false,
 *   exclude = '',
 *   collapse = false,
 *   ulClassName = '',
 *   liClassName = '',
 * }
 *
 */
export function TableOfContents({
  toc,
  fromHeading = 1,
  toHeading = 6,
  asDisclosure = false,
  exclude = '',
  collapse = false,
  ulClassName = '',
  liClassName = '',
}: TOCInlineProps) {
  let re = Array.isArray(exclude)
    ? new RegExp('^(' + exclude.join('|') + ')$', 'i')
    : new RegExp('^(' + exclude + ')$', 'i')

  let filteredToc = toc.filter(
    (heading) =>
      heading.depth >= fromHeading && heading.depth <= toHeading && !re.test(heading.value)
  )

  function createList(items: NestedTocItem[] | undefined) {
    if (!items || items.length === 0) {
      return null
    }

    return (
      <ul className={ulClassName}>
        {items.map((item, index) => (
          <li key={index} className={liClassName}>
            <a href={item.url}>{item.value}</a>
            {createList(item.children)}
          </li>
        ))}
      </ul>
    )
  }

  let nestedList = createNestedList(filteredToc)

  if (asDisclosure) {
    return (
      <details open={!collapse}>
        <summary className="ml-6 pb-2 pt-2 text-xl font-bold">Table of Contents</summary>
        <div className="ml-6">{createList(nestedList)}</div>
      </details>
    )
  }

  return createList(nestedList)
}
