-- 乐生活 v5.410：二手车商家经营数据。
-- 进货、整备和利润字段仅通过商家管理后台读取，不会出现在公开车辆目录。

alter table public.merchant_auto_listings
  add column if not exists purchase_source text,
  add column if not exists acquisition_price numeric(12,2),
  add column if not exists reconditioning_cost numeric(12,2) not null default 0,
  add column if not exists cost_note text;

alter table public.merchant_auto_listings
  drop constraint if exists merchant_auto_listings_acquisition_price_check;
alter table public.merchant_auto_listings
  add constraint merchant_auto_listings_acquisition_price_check
  check (acquisition_price is null or acquisition_price >= 0);
alter table public.merchant_auto_listings
  drop constraint if exists merchant_auto_listings_reconditioning_cost_check;
alter table public.merchant_auto_listings
  add constraint merchant_auto_listings_reconditioning_cost_check
  check (reconditioning_cost >= 0);

create or replace function public.merchant_auto_save_listing(p_merchant_user_id uuid,p_listing jsonb)
returns public.merchant_auto_listings language plpgsql security definer set search_path=public,pg_temp as $$
declare
  row public.merchant_auto_listings%rowtype;
  listing_id uuid:=nullif(p_listing->>'id','')::uuid;
  owner_count_value integer:=case when trim(coalesce(p_listing->>'owner_count','')) ~ '^[0-9]{1,2}$' then (p_listing->>'owner_count')::integer else null end;
  acquisition_value numeric:=case when trim(coalesce(p_listing->>'acquisition_price','')) ~ '^[0-9]+(\.[0-9]{1,2})?$' then (p_listing->>'acquisition_price')::numeric else null end;
  reconditioning_value numeric:=case when trim(coalesce(p_listing->>'reconditioning_cost','')) ~ '^[0-9]+(\.[0-9]{1,2})?$' then (p_listing->>'reconditioning_cost')::numeric else 0 end;
begin
  if not public.merchant_auto_can_manage(p_merchant_user_id) then raise exception 'merchant_permission_denied'; end if;
  if char_length(trim(coalesce(p_listing->>'title','')))<1 then raise exception 'listing_title_required'; end if;
  if owner_count_value is not null and owner_count_value>99 then raise exception 'owner_count_invalid'; end if;
  if acquisition_value is not null and acquisition_value<0 or reconditioning_value<0 then raise exception 'cost_invalid'; end if;
  if listing_id is not null then
    select * into row from public.merchant_auto_listings where id=listing_id and merchant_user_id=p_merchant_user_id for update;
    if not found then raise exception 'listing_not_found'; end if;
    update public.merchant_auto_listings set
      title=left(trim(p_listing->>'title'),100),make=nullif(left(trim(coalesce(p_listing->>'make','')),50),''),model=nullif(left(trim(coalesce(p_listing->>'model','')),50),''),year=nullif(p_listing->>'year','')::integer,price=greatest(0,coalesce((p_listing->>'price')::numeric,0)),mileage=nullif(p_listing->>'mileage','')::integer,vehicle_type=coalesce(nullif(p_listing->>'vehicle_type',''),'轿车'),fuel_type=coalesce(nullif(p_listing->>'fuel_type',''),'汽油'),transmission=coalesce(nullif(p_listing->>'transmission',''),'自动挡'),drivetrain=nullif(left(trim(coalesce(p_listing->>'drivetrain','')),40),''),exterior_color=nullif(left(trim(coalesce(p_listing->>'exterior_color','')),40),''),vin=nullif(left(trim(coalesce(p_listing->>'vin','')),80),''),features=coalesce(p_listing->'features','[]'::jsonb),photos=coalesce(p_listing->'photos','[]'::jsonb),description=nullif(left(trim(coalesce(p_listing->>'description','')),3000),''),status=coalesce(nullif(p_listing->>'status',''),'available'),is_certified=coalesce((p_listing->>'is_certified')::boolean,false),vehicle_report_url=nullif(left(trim(coalesce(p_listing->>'vehicle_report_url','')),1000),''),accident_history=nullif(left(trim(coalesce(p_listing->>'accident_history','')),120),''),service_history=nullif(left(trim(coalesce(p_listing->>'service_history','')),120),''),owner_count=owner_count_value,warranty_status=nullif(left(trim(coalesce(p_listing->>'warranty_status','')),120),''),title_status=nullif(left(trim(coalesce(p_listing->>'title_status','')),120),''),purchase_source=nullif(left(trim(coalesce(p_listing->>'purchase_source','')),80),''),acquisition_price=acquisition_value,reconditioning_cost=reconditioning_value,cost_note=nullif(left(trim(coalesce(p_listing->>'cost_note','')),1000),''),updated_at=now()
    where id=row.id returning * into row;
  else
    insert into public.merchant_auto_listings(merchant_user_id,title,make,model,year,price,mileage,vehicle_type,fuel_type,transmission,drivetrain,exterior_color,vin,features,photos,description,status,is_certified,vehicle_report_url,accident_history,service_history,owner_count,warranty_status,title_status,purchase_source,acquisition_price,reconditioning_cost,cost_note)
    values(p_merchant_user_id,left(trim(p_listing->>'title'),100),nullif(left(trim(coalesce(p_listing->>'make','')),50),''),nullif(left(trim(coalesce(p_listing->>'model','')),50),''),nullif(p_listing->>'year','')::integer,greatest(0,coalesce((p_listing->>'price')::numeric,0)),nullif(p_listing->>'mileage','')::integer,coalesce(nullif(p_listing->>'vehicle_type',''),'轿车'),coalesce(nullif(p_listing->>'fuel_type',''),'汽油'),coalesce(nullif(p_listing->>'transmission',''),'自动挡'),nullif(left(trim(coalesce(p_listing->>'drivetrain','')),40),''),nullif(left(trim(coalesce(p_listing->>'exterior_color','')),40),''),nullif(left(trim(coalesce(p_listing->>'vin','')),80),''),coalesce(p_listing->'features','[]'::jsonb),coalesce(p_listing->'photos','[]'::jsonb),nullif(left(trim(coalesce(p_listing->>'description','')),3000),''),coalesce(nullif(p_listing->>'status',''),'available'),coalesce((p_listing->>'is_certified')::boolean,false),nullif(left(trim(coalesce(p_listing->>'vehicle_report_url','')),1000),''),nullif(left(trim(coalesce(p_listing->>'accident_history','')),120),''),nullif(left(trim(coalesce(p_listing->>'service_history','')),120),''),owner_count_value,nullif(left(trim(coalesce(p_listing->>'warranty_status','')),120),''),nullif(left(trim(coalesce(p_listing->>'title_status','')),120),''),nullif(left(trim(coalesce(p_listing->>'purchase_source','')),80),''),acquisition_value,reconditioning_value,nullif(left(trim(coalesce(p_listing->>'cost_note','')),1000),'')) returning * into row;
  end if;
  return row;
end;
$$;

revoke all on function public.merchant_auto_save_listing(uuid,jsonb) from public;
revoke all on function public.merchant_auto_save_listing(uuid,jsonb) from anon;
grant execute on function public.merchant_auto_save_listing(uuid,jsonb) to authenticated;
