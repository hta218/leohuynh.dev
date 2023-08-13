export function kebabCase(str: string): string {
  return str
    ?.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map((x) => x.toLowerCase())
    ?.join('-')
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
