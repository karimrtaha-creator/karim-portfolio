-- Moves project data off the bundled src/data/projects.ts static file and
-- into a real table, so the admin area can publish a new project without a
-- code change + redeploy. Also adds a one-row `site_settings` table for the
-- profile photo, since asset uploads always go to a fresh, never-reused
-- storage path (see src/lib/uploadAsset.ts) and so need a place to record
-- *which* uploaded file is the current one.
--
-- Public read is intentionally broader than the storage buckets in
-- 0001/0002: visitors need to read published projects and the site
-- settings row directly (no admin session), while writes stay
-- authenticated-only — same "exactly one admin user" reasoning as those
-- migrations.

create table public.projects (
  id text primary key,
  slug text not null unique,
  number text not null default '',
  category text not null default '',
  title text not null default '',
  accent text not null default 'accent',
  featured boolean not null default false,
  status_badge text,
  tags jsonb not null default '[]'::jsonb,
  description text not null default '',
  capabilities jsonb not null default '[]'::jsonb,
  tech jsonb not null default '[]'::jsonb,
  case_study jsonb not null default '{}'::jsonb,
  status text not null default 'in-progress',
  visibility text not null default 'draft',
  sort_order integer not null default 0,
  demo_type text not null default 'none',
  demo_path text,
  demo_url text,
  github_url text,
  live_url text,
  thumbnail text,
  screenshots jsonb,
  architecture_image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;

create policy "Public read access for published projects"
on public.projects for select
to anon, authenticated
using (visibility = 'published');

create policy "Authenticated users can read all projects"
on public.projects for select
to authenticated
using (true);

create policy "Authenticated users can insert projects"
on public.projects for insert
to authenticated
with check (true);

create policy "Authenticated users can update projects"
on public.projects for update
to authenticated
using (true)
with check (true);

create policy "Authenticated users can delete projects"
on public.projects for delete
to authenticated
using (true);

-- Single-row settings table (id is always 'main') for site-wide content that
-- isn't tied to a specific project — currently just the profile photo.
create table public.site_settings (
  id text primary key default 'main',
  profile_photo_url text,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id) values ('main')
on conflict (id) do nothing;

alter table public.site_settings enable row level security;

create policy "Public read access for site settings"
on public.site_settings for select
to anon, authenticated
using (true);

create policy "Authenticated users can update site settings"
on public.site_settings for update
to authenticated
using (true)
with check (true);
