import { and, eq } from 'drizzle-orm'
import { db } from './index'
import { type SelectStats, type StatsType, statsTable } from './schema'

export async function getBlogStats(type: StatsType, slug: string) {
  let stats = await db
    .select()
    .from(statsTable)
    .where(and(eq(statsTable.type, type), eq(statsTable.slug, slug)))
  if (stats.length) {
    return stats[0]
  }
  let newStats = await db.insert(statsTable).values({ type, slug }).returning()
  return newStats[0]
}

export async function updateBlogStats(
  type: StatsType,
  slug: string,
  updates: Omit<SelectStats, 'type' | 'slug'>
) {
  let currentStats = await getBlogStats(type, slug)

  // Safeguard against negative updates
  for (let key in updates) {
    if (typeof updates[key] === 'number' && updates[key] < currentStats[key]) {
      updates[key] = currentStats[key]
    }
  }

  let updatedStats = await db
    .update(statsTable)
    .set(updates)
    .where(and(eq(statsTable.type, type), eq(statsTable.slug, slug)))
    .returning()
  return updatedStats[0]
}
