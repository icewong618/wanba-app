-- 乐生活 5.356：租车保险可选、税率与固定服务

alter table public.merchant_rental_services
  drop constraint if exists merchant_rental_services_service_type_check;
alter table public.merchant_rental_services
  add constraint merchant_rental_services_service_type_check check (service_type in ('addon','insurance','fixed'));
alter table public.merchant_rental_services
  add column if not exists charge_kind text not null default 'fee' check (charge_kind in ('fee','tax')),
  add column if not exists calculation_type text not null default 'fixed' check (calculation_type in ('fixed','percent'));

create or replace function public.merchant_rental_save_shared_service(p_service jsonb)
returns public.merchant_rental_services language plpgsql security definer set search_path=public,pg_temp as $$
declare row public.merchant_rental_services%rowtype; service_id uuid:=nullif(p_service->>'id','')::uuid; merchant_id uuid:=nullif(p_service->>'merchant_user_id','')::uuid;
begin
  if merchant_id is null or not public.merchant_rental_can_manage(merchant_id) then raise exception 'rental_not_allowed'; end if;
  if length(trim(coalesce(p_service->>'name',''))) = 0 then raise exception 'service_name_required'; end if;
  if coalesce(p_service->>'service_type','') not in ('addon','insurance','fixed') then raise exception 'invalid_service_type'; end if;
  if service_id is null then
    insert into public.merchant_rental_services(merchant_user_id,service_type,name,description,price,unit,is_active,charge_kind,calculation_type)
    values(merchant_id,p_service->>'service_type',left(trim(p_service->>'name'),80),nullif(left(trim(coalesce(p_service->>'description','')),180),''),greatest(0,coalesce(nullif(p_service->>'price','')::numeric,0)),case when p_service->>'unit'='day' then 'day' else 'once' end,coalesce((p_service->>'is_active')::boolean,true),case when p_service->>'charge_kind'='tax' then 'tax' else 'fee' end,case when p_service->>'calculation_type'='percent' then 'percent' else 'fixed' end)
    returning * into row;
  else
    update public.merchant_rental_services set name=left(trim(coalesce(p_service->>'name',name)),80),description=nullif(left(trim(coalesce(p_service->>'description',description)),180),''),price=greatest(0,coalesce(nullif(p_service->>'price','')::numeric,price)),unit=case when p_service->>'unit'='day' then 'day' else 'once' end,is_active=coalesce((p_service->>'is_active')::boolean,is_active),charge_kind=case when p_service->>'charge_kind'='tax' then 'tax' else 'fee' end,calculation_type=case when p_service->>'calculation_type'='percent' then 'percent' else 'fixed' end,updated_at=now() where id=service_id and merchant_user_id=merchant_id returning * into row;
    if not found then raise exception 'service_not_found'; end if;
  end if;
  return row;
end;
$$;

create or replace function public.merchant_rental_save_vehicle_services(p_vehicle_id uuid, p_addon_service_ids jsonb default '[]'::jsonb, p_insurance_service_id uuid default null)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare merchant_id uuid; selected_ids uuid[]:=array[]::uuid[];
begin
  select merchant_user_id into merchant_id from public.merchant_rental_vehicles where id=p_vehicle_id;
  if merchant_id is null or not public.merchant_rental_can_manage(merchant_id) then raise exception 'rental_not_allowed'; end if;
  select coalesce(array_agg(value::text::uuid),array[]::uuid[]) into selected_ids from jsonb_array_elements_text(coalesce(p_addon_service_ids,'[]'::jsonb));
  if p_insurance_service_id is not null then selected_ids:=array_append(selected_ids,p_insurance_service_id); end if;
  if exists(select 1 from unnest(selected_ids) selected_id left join public.merchant_rental_services s on s.id=selected_id and s.merchant_user_id=merchant_id and s.is_active=true where s.id is null) then raise exception 'invalid_service'; end if;
  delete from public.merchant_rental_vehicle_services where vehicle_id=p_vehicle_id;
  insert into public.merchant_rental_vehicle_services(vehicle_id,service_id) select p_vehicle_id,selected_id from unnest(selected_ids) selected_id on conflict do nothing;
  return jsonb_build_object('service_ids',coalesce((select jsonb_agg(s.id) from public.merchant_rental_services s join public.merchant_rental_vehicle_services vs on vs.service_id=s.id where vs.vehicle_id=p_vehicle_id),'[]'::jsonb));
end;
$$;

create or replace function public.merchant_rental_quote(p_vehicle_id uuid,p_starts_at timestamptz,p_ends_at timestamptz,p_addon_ids jsonb)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare v public.merchant_rental_vehicles%rowtype; hrs numeric; units integer; mode text; base numeric;
  optional_rows jsonb:='[]'::jsonb; required_rows jsonb:='[]'::jsonb; optional_amount numeric:=0; required_amount numeric:=0;
begin
  select * into v from public.merchant_rental_vehicles where id=p_vehicle_id and is_active=true;
  if not found or v.status<>'available' then raise exception 'vehicle_unavailable'; end if;
  if p_starts_at is null or p_ends_at is null or p_ends_at<=p_starts_at or p_starts_at<now()-interval '5 minutes' or p_ends_at>now()+interval '370 days' then raise exception 'invalid_rental_time'; end if;
  if exists(select 1 from public.merchant_rental_blackouts b where b.vehicle_id=v.id and b.starts_at<p_ends_at and b.ends_at>p_starts_at) then raise exception 'vehicle_blocked'; end if;
  if exists(select 1 from public.merchant_rental_bookings b where b.vehicle_id=v.id and b.status in ('pending','confirmed','active','overdue') and (b.status<>'pending' or b.created_at>now()-interval '30 minutes') and b.starts_at<p_ends_at and b.ends_at>p_starts_at) then raise exception 'vehicle_unavailable'; end if;
  hrs:=extract(epoch from(p_ends_at-p_starts_at))/3600; mode:=case when v.pricing_mode='hour' then 'hour' when v.pricing_mode='day' then 'day' when hrs<24 then 'hour' else 'day' end;
  if mode='hour' then units:=greatest(v.minimum_hours,ceil(hrs)::integer);base:=units*v.hourly_rate; else units:=greatest(1,ceil(hrs/24)::integer);base:=units*v.daily_rate; end if;
  select coalesce(jsonb_agg(jsonb_build_object('id',s.id,'name',s.name,'description',s.description,'unit',s.unit,'service_type',s.service_type,'price',round(s.price,2),'amount',round(s.price*case when s.unit='day' then units else 1 end,2),'required',false)),'[]'::jsonb),coalesce(sum(s.price*case when s.unit='day' then units else 1 end),0)
  into optional_rows,optional_amount
  from public.merchant_rental_services s join public.merchant_rental_vehicle_services vs on vs.service_id=s.id
  where vs.vehicle_id=v.id and s.is_active=true and s.service_type in ('addon','insurance') and coalesce(p_addon_ids,'[]'::jsonb) @> jsonb_build_array(to_jsonb(s.id::text));
  select coalesce(jsonb_agg(jsonb_build_object('id',s.id,'name',s.name,'description',s.description,'unit',s.unit,'service_type',s.service_type,'price',round(s.price,2),'amount',round(case when s.calculation_type='percent' then (base+optional_amount)*s.price/100 else s.price*case when s.unit='day' then units else 1 end end,2),'required',true,'charge_kind',s.charge_kind,'calculation_type',s.calculation_type)),'[]'::jsonb),coalesce(sum(case when s.calculation_type='percent' then (base+optional_amount)*s.price/100 else s.price*case when s.unit='day' then units else 1 end end),0)
  into required_rows,required_amount
  from public.merchant_rental_services s join public.merchant_rental_vehicle_services vs on vs.service_id=s.id
  where vs.vehicle_id=v.id and s.is_active=true and s.service_type='fixed';
  return jsonb_build_object('vehicle_id',v.id,'pricing_mode',mode,'unit_count',units,'base_amount',round(base,2),'addon_amount',round(optional_amount,2),'required_amount',round(required_amount,2),'addons',optional_rows || required_rows,'deposit_amount',v.deposit_amount,'total_amount',round(base+optional_amount+required_amount,2));
end;
$$;

create or replace function public.merchant_rental_manager_reprice_booking(p_booking_id uuid,p_starts_at timestamptz,p_ends_at timestamptz,p_note text default null)
returns public.merchant_rental_bookings language plpgsql security definer set search_path=public,pg_temp as $$
declare row public.merchant_rental_bookings%rowtype; quote jsonb; selected_ids jsonb;
begin
  select * into row from public.merchant_rental_bookings where id=p_booking_id for update;
  if not found or not public.merchant_rental_can_manage(row.merchant_user_id) then raise exception 'rental_not_allowed'; end if;
  if row.status in ('cancelled','rejected','returned') then raise exception 'booking_cannot_be_repriced'; end if;
  if p_starts_at is null or p_ends_at is null or p_ends_at<=p_starts_at then raise exception 'invalid_rental_time'; end if;
  select coalesce(jsonb_agg(to_jsonb(item->>'id')),'[]'::jsonb) into selected_ids from jsonb_array_elements(coalesce(row.rental_addons,'[]'::jsonb)) item where coalesce((item->>'required')::boolean,false)=false;
  update public.merchant_rental_bookings set status='cancelled' where id=row.id;
  quote:=public.merchant_rental_quote(row.vehicle_id,p_starts_at,p_ends_at,selected_ids);
  update public.merchant_rental_bookings set starts_at=p_starts_at,ends_at=p_ends_at,pricing_mode=quote->>'pricing_mode',unit_count=(quote->>'unit_count')::integer,base_amount=(quote->>'base_amount')::numeric,rental_addons=quote->'addons',total_amount=greatest(0,(quote->>'total_amount')::numeric-row.member_discount_amount-row.coupon_discount_amount+row.damage_amount+row.violation_amount),status='pending',confirmed_at=null,operator_note=coalesce(nullif(left(trim(coalesce(p_note,'')),800),''),row.operator_note),updated_at=now() where id=row.id returning * into row;
  return row;
end;
$$;

grant execute on function public.merchant_rental_save_shared_service(jsonb) to authenticated;
grant execute on function public.merchant_rental_save_vehicle_services(uuid,jsonb,uuid) to authenticated;
grant execute on function public.merchant_rental_quote(uuid,timestamptz,timestamptz,jsonb) to anon,authenticated;
grant execute on function public.merchant_rental_manager_reprice_booking(uuid,timestamptz,timestamptz,text) to authenticated;
