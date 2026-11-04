-- Run this once in Supabase: SQL Editor -> New query -> paste -> Run.

-- 1) Content table (one row holds the whole portfolio as JSON)
create table if not exists public.portfolio (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.portfolio enable row level security;

-- everyone can READ (visitors)
drop policy if exists "portfolio public read" on public.portfolio;
create policy "portfolio public read" on public.portfolio
  for select using (true);

-- only logged-in users can WRITE (that's you — see README: disable public sign-ups!)
drop policy if exists "portfolio owner write" on public.portfolio;
create policy "portfolio owner write" on public.portfolio
  for all to authenticated using (true) with check (true);

-- 2) Image storage bucket (public so visitors can see images)
insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do nothing;

drop policy if exists "images public read" on storage.objects;
create policy "images public read" on storage.objects
  for select using (bucket_id = 'portfolio-images');

drop policy if exists "images owner insert" on storage.objects;
create policy "images owner insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'portfolio-images');

drop policy if exists "images owner update" on storage.objects;
create policy "images owner update" on storage.objects
  for update to authenticated using (bucket_id = 'portfolio-images');

drop policy if exists "images owner delete" on storage.objects;
create policy "images owner delete" on storage.objects
  for delete to authenticated using (bucket_id = 'portfolio-images');
