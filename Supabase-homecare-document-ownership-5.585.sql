-- 乐生活 v5.585：服务端再次校验证件路径归属，防止提交他人的私有文件路径。

create or replace function public.service_upsert_homecare_profile(
  p_display_name text,p_service_types text[],p_areas text[],p_bio text,p_experience_years integer,p_availability_note text,p_id_document_url text
)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_user uuid:=auth.uid(); v_check jsonb; v_status text;
begin
  if v_user is null then raise exception 'login_required'; end if;
  if nullif(trim(coalesce(p_id_document_url,'')),'') is null then raise exception 'id_document_required'; end if;
  if split_part(trim(p_id_document_url),'/',1)<>v_user::text then raise exception 'invalid_id_document'; end if;
  v_check:=public.marketplace_listing_compliance(concat_ws(' ',p_display_name,p_bio,array_to_string(p_service_types,' ')),'US-CA');
  if v_check->>'action'='block' then raise exception 'listing_restricted:%',v_check->>'rule_key' using errcode='22023'; end if;
  v_status:='review';
  insert into public.homecare_provider_profiles(user_id,display_name,avatar_url,service_types,areas,bio,experience_years,availability_note,id_document_url,id_document_status,public_status,review_reason)
  values(v_user,trim(p_display_name),(public.service_safe_profile(v_user)->>'avatar'),coalesce(p_service_types,'{}'),coalesce(p_areas,'{}'),coalesce(p_bio,''),greatest(0,least(coalesce(p_experience_years,0),80)),coalesce(p_availability_note,''),trim(p_id_document_url),'submitted',v_status,case when v_check->>'action'='review' then v_check->>'rule_key' else null end)
  on conflict(user_id) do update set display_name=excluded.display_name,avatar_url=excluded.avatar_url,service_types=excluded.service_types,areas=excluded.areas,bio=excluded.bio,experience_years=excluded.experience_years,availability_note=excluded.availability_note,id_document_url=excluded.id_document_url,id_document_status='submitted',public_status=v_status,review_reason=excluded.review_reason,updated_at=now();
  return jsonb_build_object('status','review','message','证件已提交，平台审核通过后才会公开展示。');
end;
$$;

revoke all on function public.service_upsert_homecare_profile(text,text[],text[],text,integer,text,text) from public,anon;
grant execute on function public.service_upsert_homecare_profile(text,text[],text[],text,integer,text,text) to authenticated;
