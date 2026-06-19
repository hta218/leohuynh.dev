-- Convert any json/jsonb columns on `movies` and `books` to text.
--
-- Why: the app reads these tables with `select *` and maps every field through
-- String() (see src/lib/media.ts) — no column is ever consumed as structured
-- JSON. Meanwhile a failed scrape (Goodreads RSS / OMDB) can write raw HTML into
-- a json cell, which makes the postgres driver's JSON.parse() throw and kills the
-- whole query. Storing these as text matches how the app uses them and removes
-- the parse hazard entirely.
--
-- Idempotent: it only touches columns still typed json/jsonb, so re-running it
-- after the conversion is a no-op. Safe to run against Supabase (public schema).

do $$
declare
  col record;
begin
  for col in
    select table_name, column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name in ('movies', 'books')
      and data_type in ('json', 'jsonb')
    order by table_name, column_name
  loop
    execute format(
      'alter table public.%I alter column %I type text using %I::text',
      col.table_name, col.column_name, col.column_name
    );
    raise notice 'Converted %.% (% -> text)',
      col.table_name, col.column_name, 'json/jsonb';
  end loop;
end $$;

-- Verify afterwards (should return no rows once converted):
--   select table_name, column_name, data_type
--   from information_schema.columns
--   where table_schema = 'public'
--     and table_name in ('movies', 'books')
--     and data_type in ('json', 'jsonb');
