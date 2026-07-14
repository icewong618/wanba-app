-- v5.165: 纯文字笔记封面统一保存为公开图片资产，不再写入 Base64。
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'post-assets',
  'post-assets',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = true,
    file_size_limit = 5242880,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

drop policy if exists "post assets public read" on storage.objects;
create policy "post assets public read"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'post-assets');

drop policy if exists "post assets upload own text covers" on storage.objects;
create policy "post assets upload own text covers"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'post-assets'
  and (storage.foldername(name))[1] = 'text-covers'
  and (storage.foldername(name))[2] = (select auth.uid()::text)
);

drop policy if exists "post assets delete own text covers" on storage.objects;
create policy "post assets delete own text covers"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'post-assets'
  and (storage.foldername(name))[1] = 'text-covers'
  and (storage.foldername(name))[2] = (select auth.uid()::text)
);
