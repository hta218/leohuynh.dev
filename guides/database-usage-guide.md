# Database Usage Guide

This guide explains how to set up, define, and use the database in this project.

## 1. Database Setup

- This project uses **PostgreSQL** as the database and **Drizzle ORM** for schema and queries.
- The database connection URL is managed via the `DATABASE_URL` environment variable in a `.env` file at the project root.
- Example `.env`:

  ```env
  DATABASE_URL=postgres://user:password@localhost:5432/dbname
  ```

- To initialize and migrate the database, use the following commands:

  ```sh
  pnpm db:init
  # or
  npx drizzle-kit generate && npx drizzle-kit push
  ```

- To open Drizzle Studio for visual management:

  ```sh
  pnpm db:studio
  # or
  npx drizzle-kit studio --port 8088
  ```

## 2. Defining the Schema

- All database schema definitions are in `db/schema.ts`.
- Use Drizzle ORM's schema builder to define tables, enums, and types.
- Example (from `db/schema.ts`):

  ```typescript
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
    ({ type, slug }) => [primaryKey({ columns: [type, slug] })]
  )
  ```

- After editing the schema, run the migration command again to update the database.

## 3. Writing and Using Queries

- All database queries are in `db/queries.ts`.
- Use Drizzle ORM's query builder for type-safe queries.
- Example usage:

  ```typescript
  import { getBlogStats, updateBlogStats } from '../db/queries'

  // Get stats for a blog post
  let stats = await getBlogStats('blog', 'my-post-slug')

  // Update stats
  let updated = await updateBlogStats('blog', 'my-post-slug', { views: stats.views + 1 })
  ```

- Always use async/await and handle errors with try/catch.

## 4. Configuration

- The Drizzle config is in `drizzle.config.ts`.
- It specifies the schema location, migrations output, dialect, and credentials.
- Example:

  ```typescript
  import { config } from 'dotenv'
  import { defineConfig } from 'drizzle-kit'

  config({ path: '.env' })

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required')
  }

  export default defineConfig({
    schema: './db/schema.ts',
    out: './supabase/migrations',
    dialect: 'postgresql',
    dbCredentials: {
      url: process.env.DATABASE_URL,
    },
  })
  ```

## 5. References

- [Drizzle ORM Documentation](https://orm.drizzle.team/docs)
