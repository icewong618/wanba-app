-- 乐生活 v5.403：二手车详情资料、车况报告与贷款估算基础字段。
-- 公开目录只暴露商家主动填写的资料，不公开完整 VIN。

alter table public.merchant_auto_listings
  add column if not exists vehicle_report_url text,
  add column if not exists accident_history text,
  add column if not exists service_history text,
  add column if not exists owner_count integer,
  add column if not exists warranty_status text,
  add column if not exists title_status text;

alter table public.merchant_auto_listings
  drop constraint if exists merchant_auto_listings_owner_count_check;
alter table public.merchant_auto_listings
  add constraint merchant_auto_listings_owner_count_check
  check (owner_count is null or owner_count between 0 and 99);

create or replace function public.merchant_auto_public_catalog(p_slug text)
returns jsonb language sql stable security definer set search_path=public,pg_temp as $$
  select jsonb_build_object(
    'merchant', jsonb_build_object(
      'user_id',m.user_id,'business_name',m.business_name,'logo',m.logo,
      'cover_image',m.cover_image,'address',m.address,'phone',m.phone,'slug',m.slug
    ),
    'listings',coalesce((
      select jsonb_agg(jsonb_build_object(
        'id',a.id,'title',a.title,'make',a.make,'model',a.model,'year',a.year,'price',a.price,
        'mileage',a.mileage,'vehicle_type',a.vehicle_type,'fuel_type',a.fuel_type,'transmission',a.transmission,
        'drivetrain',a.drivetrain,'exterior_color',a.exterior_color,'interior_color',a.interior_color,
        'vin_last6',case when coalesce(a.vin,'')='' then null else right(a.vin,6) end,
        'condition_note',a.condition_note,'features',a.features,'photos',a.photos,'description',a.description,
        'is_certified',a.is_certified,'vehicle_report_url',a.vehicle_report_url,
        'accident_history',a.accident_history,'service_history',a.service_history,
        'owner_count',a.owner_count,'warranty_status',a.warranty_status,'title_status',a.title_status,
        'updated_at',a.updated_at
      ) order by a.updated_at desc)
      from public.merchant_auto_listings a where a.merchant_user_id=m.user_id and a.status='available'
    ),'[]'::jsonb)
  ) from public.merchants m where lower(m.slug)=lower(trim(p_slug)) limit 1;
$$;

create or replace function public.merchant_auto_save_listing(p_merchant_user_id uuid,p_listing jsonb)
returns public.merchant_auto_listings language plpgsql security definer set search_path=public,pg_temp as $$
declare
  row public.merchant_auto_listings%rowtype;
  listing_id uuid:=nullif(p_listing->>'id','')::uuid;
  requested_owner_count integer:=case
    when trim(coalesce(p_listing->>'owner_count','')) ~ '^[0-9]{1,2}$'
      then (p_listing->>'owner_count')::integer
    else null
  end;
begin
  if not public.merchant_auto_can_manage(p_merchant_user_id) then raise exception 'merchant_permission_denied'; end if;
  if char_length(trim(coalesce(p_listing->>'title','')))<1 then raise exception 'listing_title_required'; end if;
  if requested_owner_count is not null and requested_owner_count > 99 then raise exception 'owner_count_invalid'; end if;
  if listing_id is not null then
    select * into row from public.merchant_auto_listings where id=listing_id and merchant_user_id=p_merchant_user_id for update;
    if not found then raise exception 'listing_not_found'; end if;
    update public.merchant_auto_listings set
      title=left(trim(p_listing->>'title'),100),make=nullif(left(trim(coalesce(p_listing->>'make','')),50),''),model=nullif(left(trim(coalesce(p_listing->>'model','')),50),''),
      year=nullif(p_listing->>'year','')::integer,price=greatest(0,coalesce((p_listing->>'price')::numeric,0)),mileage=nullif(p_listing->>'mileage','')::integer,
      vehicle_type=coalesce(nullif(p_listing->>'vehicle_type',''),'轿车'),fuel_type=coalesce(nullif(p_listing->>'fuel_type',''),'汽油'),transmission=coalesce(nullif(p_listing->>'transmission',''),'自动挡'),
      drivetrain=nullif(left(trim(coalesce(p_listing->>'drivetrain','')),40),''),exterior_color=nullif(left(trim(coalesce(p_listing->>'exterior_color','')),40),''),interior_color=nullif(left(trim(coalesce(p_listing->>'interior_color','')),40),''),
      vin=nullif(left(trim(coalesce(p_listing->>'vin','')),80),''),condition_note=nullif(left(trim(coalesce(p_listing->>'condition_note','')),300),''),features=coalesce(p_listing->'features','[]'::jsonb),photos=coalesce(p_listing->'photos','[]'::jsonb),description=nullif(left(trim(coalesce(p_listing->>'description','')),3000),''),status=coalesce(nullif(p_listing->>'status',''),'available'),is_certified=coalesce((p_listing->>'is_certified')::boolean,false),
      vehicle_report_url=nullif(left(trim(coalesce(p_listing->>'vehicle_report_url','')),1000),''),
      accident_history=nullif(left(trim(coalesce(p_listing->>'accident_history','')),120),''),service_history=nullif(left(trim(coalesce(p_listing->>'service_history','')),120),''),
      owner_count=requested_owner_count,warranty_status=nullif(left(trim(coalesce(p_listing->>'warranty_status','')),120),''),title_status=nullif(left(trim(coalesce(p_listing->>'title_status','')),120),''),
      updated_at=now()
    where id=row.id returning * into row;
  else
    insert into public.merchant_auto_listings(merchant_user_id,title,make,model,year,price,mileage,vehicle_type,fuel_type,transmission,drivetrain,exterior_color,interior_color,vin,condition_note,features,photos,description,status,is_certified,vehicle_report_url,accident_history,service_history,owner_count,warranty_status,title_status)
    values(p_merchant_user_id,left(trim(p_listing->>'title'),100),nullif(left(trim(coalesce(p_listing->>'make','')),50),''),nullif(left(trim(coalesce(p_listing->>'model','')),50),''),nullif(p_listing->>'year','')::integer,greatest(0,coalesce((p_listing->>'price')::numeric,0)),nullif(p_listing->>'mileage','')::integer,coalesce(nullif(p_listing->>'vehicle_type',''),'轿车'),coalesce(nullif(p_listing->>'fuel_type',''),'汽油'),coalesce(nullif(p_listing->>'transmission',''),'自动挡'),nullif(left(trim(coalesce(p_listing->>'drivetrain','')),40),''),nullif(left(trim(coalesce(p_listing->>'exterior_color','')),40),''),nullif(left(trim(coalesce(p_listing->>'interior_color','')),40),''),nullif(left(trim(coalesce(p_listing->>'vin','')),80),''),nullif(left(trim(coalesce(p_listing->>'condition_note','')),300),''),coalesce(p_listing->'features','[]'::jsonb),coalesce(p_listing->'photos','[]'::jsonb),nullif(left(trim(coalesce(p_listing->>'description','')),3000),''),coalesce(nullif(p_listing->>'status',''),'available'),coalesce((p_listing->>'is_certified')::boolean,false),nullif(left(trim(coalesce(p_listing->>'vehicle_report_url','')),1000),''),nullif(left(trim(coalesce(p_listing->>'accident_history','')),120),''),nullif(left(trim(coalesce(p_listing->>'service_history','')),120),''),requested_owner_count,nullif(left(trim(coalesce(p_listing->>'warranty_status','')),120),''),nullif(left(trim(coalesce(p_listing->>'title_status','')),120),'')) returning * into row;
  end if;
  return row;
end;
$$;

revoke all on function public.merchant_auto_public_catalog(text) from public;
grant execute on function public.merchant_auto_public_catalog(text) to anon, authenticated;
revoke all on function public.merchant_auto_save_listing(uuid,jsonb) from public;
revoke all on function public.merchant_auto_save_listing(uuid,jsonb) from anon;
grant execute on function public.merchant_auto_save_listing(uuid,jsonb) to authenticated;
