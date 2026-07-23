-- 乐生活 v5.585：家政身份资料使用私有存储，绝不写入公开媒体桶。

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('homecare-verification','homecare-verification',false,5242880,array['image/jpeg','image/png','application/pdf'])
on conflict (id) do update set public=false,file_size_limit=5242880,allowed_mime_types=array['image/jpeg','image/png','application/pdf'];

drop policy if exists homecare_verification_upload_own on storage.objects;
drop policy if exists homecare_verification_read_own on storage.objects;
drop policy if exists homecare_verification_update_own on storage.objects;
drop policy if exists homecare_verification_delete_own on storage.objects;

create policy homecare_verification_upload_own on storage.objects
for insert to authenticated
with check (bucket_id='homecare-verification' and (storage.foldername(name))[1]=(select auth.uid()::text));

create policy homecare_verification_read_own on storage.objects
for select to authenticated
using (bucket_id='homecare-verification' and (storage.foldername(name))[1]=(select auth.uid()::text));

create policy homecare_verification_update_own on storage.objects
for update to authenticated
using (bucket_id='homecare-verification' and (storage.foldername(name))[1]=(select auth.uid()::text))
with check (bucket_id='homecare-verification' and (storage.foldername(name))[1]=(select auth.uid()::text));

create policy homecare_verification_delete_own on storage.objects
for delete to authenticated
using (bucket_id='homecare-verification' and (storage.foldername(name))[1]=(select auth.uid()::text));

create or replace function public.service_admin_homecare_profiles()
returns jsonb language plpgsql security definer set search_path=public as $$
begin
  if not public.service_is_admin() then raise exception 'admin_required'; end if;
  return coalesce((select jsonb_agg(to_jsonb(x) order by x.updated_at desc) from (
    select user_id,display_name,avatar_url,service_types,areas,bio,experience_years,availability_note,id_document_status,public_status,review_reason,created_at,updated_at
    from public.homecare_provider_profiles
    where public_status in ('review','paused','rejected') or id_document_status='submitted'
  ) x),'[]'::jsonb);
end;
$$;

revoke all on function public.service_admin_homecare_profiles() from public,anon;
grant execute on function public.service_admin_homecare_profiles() to authenticated;
