import { integer, pgEnum, pgTable, primaryKey, varchar } from 'drizzle-orm/pg-core'

export let typeEnum = pgEnum('type', ['blog', 'snippet'])

export let statsTable = pgTable(
  'stats',
  {
    type: typeEnum().notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    views: integer('views').notNull().default(0),
    loves: integer('loves').notNull().default(0),
    applauses: integer('applauses').notNull().default(0),
    ideas: integer('ideas').notNull().default(0),
    bullseyes: integer('bullseyes').notNull().default(0),
  },
  ({ type, slug }) => {
    return {
      pk: primaryKey({ columns: [type, slug] }),
    }
  }
)

export type StatsType = (typeof typeEnum.enumValues)[number]
export type SelectStats = typeof statsTable.$inferSelect
