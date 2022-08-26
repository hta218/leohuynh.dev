export async function fetcher(...args: unknown[]) {
  // @ts-ignore
  const res = await fetch(...args)

  return res.json()
}
