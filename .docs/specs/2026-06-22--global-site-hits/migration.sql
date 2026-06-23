-- Global site hits counter — run once in the Supabase SQL editor.
-- Idempotent: re-running never resets a live count.

create table if not exists site_counters (
  key   text primary key,
  value bigint not null default 0
);

-- Seed the global hits counter from existing accumulated post + snippet views.
insert into site_counters (key, value)
values ('hits', (select coalesce(sum(views), 0) from stats))
on conflict (key) do nothing;

-- Sanity check
-- select * from site_counters where key = 'hits';
