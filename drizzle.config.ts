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
  casing: 'snake_case',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
})
