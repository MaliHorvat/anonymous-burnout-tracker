-- Anonymous Burnout Tracker — tabela za anonimne oddaje
-- Zaženi v Supabase: SQL Editor → New query → Run

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  workload smallint not null check (workload between 1 and 5),
  feeling_valued smallint not null check (feeling_valued between 1 and 5),
  enough_resources smallint not null check (enough_resources between 1 and 5),
  created_at timestamptz not null default now()
);

-- Indeks za urejanje po času (dashboard)
create index if not exists submissions_created_at_idx on public.submissions (created_at desc);

-- RLS: javnost lahko SAMO vstavi (anonimno), ne bere
alter table public.submissions enable row level security;

drop policy if exists "anon_insert_only" on public.submissions;
create policy "anon_insert_only"
  on public.submissions
  for insert
  to anon, authenticated
  with check (true);

-- Branje samo prek service role (server-side dashboard)
-- (anon ključ nima SELECT pravice)
