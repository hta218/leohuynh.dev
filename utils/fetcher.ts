export async function fetcher(...args: unknown[]) {
  // @ts-ignore
  let res = await fetch(...args)
  return res.json()
}
