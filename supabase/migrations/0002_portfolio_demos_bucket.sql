-- Dedicated bucket for standalone HTML demo files uploaded from the admin
-- project form, kept separate from portfolio-assets (images) since demos are
-- served/opened as pages rather than referenced as <img> sources. Public
-- read (demos are meant to be publicly opened), authenticated-only write —
-- same single-owner model as the assets bucket.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-demos',
  'portfolio-demos',
  true,
  5242880, -- 5 MB
  array['text/html']
)
on conflict (id) do nothing;

create policy "Public read access for portfolio demos"
on storage.objects for select
using (bucket_id = 'portfolio-demos');

create policy "Authenticated users can upload portfolio demos"
on storage.objects for insert
to authenticated
with check (bucket_id = 'portfolio-demos');

create policy "Authenticated users can update portfolio demos"
on storage.objects for update
to authenticated
using (bucket_id = 'portfolio-demos')
with check (bucket_id = 'portfolio-demos');

create policy "Authenticated users can delete portfolio demos"
on storage.objects for delete
to authenticated
using (bucket_id = 'portfolio-demos');
