-- Storage bucket for portfolio project images (thumbnails, screenshots,
-- architecture diagrams). Public read (these are meant to be visible on the
-- live site), authenticated-only write. There is exactly one admin user for
-- this project, so "authenticated" is an appropriate write scope — no
-- multi-tenant concern since there is no public registration.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-assets',
  'portfolio-assets',
  true,
  5242880, -- 5 MB
  array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif']
)
on conflict (id) do nothing;

create policy "Public read access for portfolio assets"
on storage.objects for select
using (bucket_id = 'portfolio-assets');

create policy "Authenticated users can upload portfolio assets"
on storage.objects for insert
to authenticated
with check (bucket_id = 'portfolio-assets');

create policy "Authenticated users can update portfolio assets"
on storage.objects for update
to authenticated
using (bucket_id = 'portfolio-assets')
with check (bucket_id = 'portfolio-assets');

create policy "Authenticated users can delete portfolio assets"
on storage.objects for delete
to authenticated
using (bucket_id = 'portfolio-assets');
