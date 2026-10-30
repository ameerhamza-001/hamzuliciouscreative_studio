-- Run this entire script in Supabase Dashboard > SQL Editor.
-- It creates the service and project tables, public read access,
-- authenticated-admin write access, and a public portfolio storage bucket.
-- IMPORTANT: create your own admin user in Authentication > Users.
-- Do not enable public sign-ups for this single-owner studio dashboard.

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text default '',
  price text default '',
  sort_order integer default 10,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Other',
  description text default '',
  media_url text not null,
  media_type text not null default 'image',
  storage_path text not null,
  created_at timestamptz not null default now()
);

alter table public.services enable row level security;
alter table public.projects enable row level security;

drop policy if exists "Public can read services" on public.services;
create policy "Public can read services" on public.services
for select using (true);

drop policy if exists "Authenticated admins manage services" on public.services;
create policy "Authenticated admins manage services" on public.services
for all to authenticated using (true) with check (true);

drop policy if exists "Public can read projects" on public.projects;
create policy "Public can read projects" on public.projects
for select using (true);

drop policy if exists "Authenticated admins manage projects" on public.projects;
create policy "Authenticated admins manage projects" on public.projects
for all to authenticated using (true) with check (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio', 'portfolio', true, 52428800,
  array['image/jpeg','image/png','image/webp','image/gif','image/avif','video/mp4','video/webm','video/quicktime'])
on conflict (id) do update set public = true, file_size_limit = 52428800;

drop policy if exists "Public can view portfolio files" on storage.objects;
create policy "Public can view portfolio files" on storage.objects
for select using (bucket_id = 'portfolio');

drop policy if exists "Authenticated admins upload portfolio files" on storage.objects;
create policy "Authenticated admins upload portfolio files" on storage.objects
for insert to authenticated with check (bucket_id = 'portfolio');

drop policy if exists "Authenticated admins update portfolio files" on storage.objects;
create policy "Authenticated admins update portfolio files" on storage.objects
for update to authenticated using (bucket_id = 'portfolio') with check (bucket_id = 'portfolio');

drop policy if exists "Authenticated admins delete portfolio files" on storage.objects;
create policy "Authenticated admins delete portfolio files" on storage.objects
for delete to authenticated using (bucket_id = 'portfolio');

-- Optional starter services. Run once; skip if you prefer to add them in the dashboard.
insert into public.services (name, description, price, sort_order)
select v.name, v.description, '', v.sort_order
from (values
 ('Branding & Identity','Logo design, brand identity systems, stationery and brand refreshes.',1),
 ('Packaging Design','Product packaging, labels, boxes and product visuals.',2),
 ('Marketing & Print','Posters, promotional creatives, banners and event graphics.',3),
 ('Video & Motion','Reels, promotional edits and digital video invitations.',4),
 ('Wedding Invitations','Luxury invitation suites, e-invites and bespoke wedding designs.',5),
 ('Custom Creative Work','Photo editing, personalised designs and custom creative requests.',6)
) as v(name,description,sort_order)
where not exists (select 1 from public.services s where s.name = v.name);
