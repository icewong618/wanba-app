-- 乐生活 5.332：租车公用附加服务与保险服务库

create table if not exists public.merchant_rental_services (
  id uuid primary key default gen_random_uuid(),
  merchant_user_id uuid not null references auth.users(id) on delete cascade,
  service_type text not null check (service_type in ('addon','insurance')),
  name text not null check (char_length(name) between 1 and 80),
  description text,
  price numeric(10,2) not null default 0 check (price >= 0),
  unit text not null default 'once' check (unit in ('once','day')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists merchant_rental_services_merchant_type_idx on public.merchant_rental_services(merchant_user_id, service_type, is_active, updated_at desc);

create table if not exists public.merchant_rental_vehicle_services (
  vehicle_id uuid not null references public.merchant_rental_vehicles(id) on delete cascade,
  service_id uuid not null references public.merchant_rental_services(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(vehicle_id, service_id)
);

alter table public.merchant_rental_services enable row level security;
alter table public.merchant_rental_vehicle_services enable row level security;
drop policy if exists "rental shared services manager 5.332" on public.merchant_rental_services;
create policy "rental shared services manager 5.332" on public.merchant_rental_services for all to authenticated
  using (public.merchant_rental_can_manage(merchant_user_id)) with check (public.merchant_rental_can_manage(merchant_user_id));
drop policy if exists "rental vehicle shared services manager 5.332" on public.merchant_rental_vehicle_services;
create policy "rental vehicle shared services manager 5.332" on public.merchant_rental_vehicle_services for all to authenticated
  using (exists(select 1 from public.merchant_rental_vehicles v where v.id=vehicle_id and public.merchant_rental_can_manage(v.merchant_user_id)))
  with check (exists(select 1 from public.merchant_rental_vehicles v join public.merchant_rental_services s on s.id=service_id where v.id=vehicle_id and v.merchant_user_id=s.merchant_user_id and public.merchant_rental_can_manage(v.merchant_user_id)));

create or replace function public.merchant_rental_save_shared_service(p_service jsonb)
returns public.merchant_rental_services language plpgsql security definer set search_path=public,pg_temp as $$
declare row public.merchant_rental_services%rowtype; service_id uuid := nullif(p_service->>'id','')::uuid; merchant_id uuid := nullif(p_service->>'merchant_user_id','')::uuid;
begin
  if merchant_id is null or not public.merchant_rental_can_manage(merchant_id) then raise exception 'rental_not_allowed'; end if;
  if length(trim(coalesce(p_service->>'name',''))) = 0 then raise exception 'service_name_required'; end if;
  if coalesce(p_service->>'service_type','') not in ('addon','insurance') then raise exception 'invalid_service_type'; end if;
  if service_id is null then
    insert into public.merchant_rental_services(merchant_user_id,service_type,name,description,price,unit,is_active)
    values(merchant_id,p_service->>'service_type',left(trim(p_service->>'name'),80),nullif(left(trim(coalesce(p_service->>'description','')),180),''),greatest(0,coalesce(nullif(p_service->>'price','')::numeric,0)),case when p_service->>'unit'='day' then 'day' else 'once' end,coalesce((p_service->>'is_active')::boolean,true)) returning * into row;
  else
    update public.merchant_rental_services set name=left(trim(coalesce(p_service->>'name',name)),80),description=nullif(left(trim(coalesce(p_service->>'description',description)),180),''),price=greatest(0,coalesce(nullif(p_service->>'price','')::numeric,price)),unit=case when p_service->>'unit'='day' then 'day' else 'once' end,is_active=coalesce((p_service->>'is_active')::boolean,is_active),updated_at=now() where id=service_id and merchant_user_id=merchant_id returning * into row;
    if not found then raise exception 'service_not_found'; end if;
  end if;
  return row;
end;
$$;

create or replace function public.merchant_rental_save_vehicle_services(p_vehicle_id uuid, p_addon_service_ids jsonb default '[]'::jsonb, p_insurance_service_id uuid default null)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare merchant_id uuid; selected_ids uuid[] := array[]::uuid[];
begin
  select merchant_user_id into merchant_id from public.merchant_rental_vehicles where id=p_vehicle_id;
  if merchant_id is null or not public.merchant_rental_can_manage(merchant_id) then raise exception 'rental_not_allowed'; end if;
  select coalesce(array_agg(value::text::uuid),array[]::uuid[]) into selected_ids from jsonb_array_elements_text(coalesce(p_addon_service_ids,'[]'::jsonb));
  if p_insurance_service_id is not null then selected_ids := array_append(selected_ids,p_insurance_service_id); end if;
  if exists(select 1 from unnest(selected_ids) id left join public.merchant_rental_services s on s.id=id and s.merchant_user_id=merchant_id and s.is_active=true where s.id is null) then raise exception 'invalid_service'; end if;
  delete from public.merchant_rental_vehicle_services where vehicle_id=p_vehicle_id;
  insert into public.merchant_rental_vehicle_services(vehicle_id,service_id)
  select p_vehicle_id,id from unnest(selected_ids) id on conflict do nothing;
  return jsonb_build_object('addon_service_ids',coalesce((select jsonb_agg(s.id) from public.merchant_rental_services s join public.merchant_rental_vehicle_services vs on vs.service_id=s.id where vs.vehicle_id=p_vehicle_id and s.service_type='addon'),'[]'::jsonb),'insurance_service_id',(select s.id from public.merchant_rental_services s join public.merchant_rental_vehicle_services vs on vs.service_id=s.id where vs.vehicle_id=p_vehicle_id and s.service_type='insurance' limit 1));
end;
$$;

create or replace function public.merchant_rental_public_catalog(p_slug text)
returns jsonb language sql stable security definer set search_path=public,pg_temp as $$
  select jsonb_build_object(
    'merchant', jsonb_build_object('user_id',m.user_id,'business_name',m.business_name,'logo',m.logo,'cover_image',m.cover_image,'address',m.address,'phone',m.phone,'business_hours',m.business_hours),
    'vehicles', coalesce((
      select jsonb_agg(
        to_jsonb(v) || jsonb_build_object(
          'addons', coalesce((
            select jsonb_agg(jsonb_build_object('id',s.id,'name',s.name,'description',s.description,'price',s.price,'unit',s.unit,'service_type',s.service_type) order by s.service_type,s.name)
            from public.merchant_rental_vehicle_services vs join public.merchant_rental_services s on s.id=vs.service_id
            where vs.vehicle_id=v.id and s.is_active=true
          ), '[]'::jsonb),
          'luggage_count', coalesce(legacy.luggage_count,2)
        ) order by v.updated_at desc
      )
      from public.merchant_rental_vehicles v
      left join public.merchant_rental_vehicle_addons legacy on legacy.vehicle_id=v.id
      where v.merchant_user_id=m.user_id and v.is_active=true and v.status='available'
    ), '[]'::jsonb)
  ) from public.merchants m
  where m.slug=lower(trim(p_slug)) and coalesce(m.verified,false)=true limit 1;
$$;

create or replace function public.merchant_rental_quote(p_vehicle_id uuid,p_starts_at timestamptz,p_ends_at timestamptz,p_addon_ids jsonb)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare v public.merchant_rental_vehicles%rowtype; hrs numeric; units integer; mode text; base numeric; selected jsonb; extra numeric;
begin
 select * into v from public.merchant_rental_vehicles where id=p_vehicle_id and is_active=true;
 if not found or v.status<>'available' then raise exception 'vehicle_unavailable'; end if;
 if p_starts_at is null or p_ends_at is null or p_ends_at<=p_starts_at or p_starts_at<now()-interval '5 minutes' or p_ends_at>now()+interval '370 days' then raise exception 'invalid_rental_time'; end if;
 if exists(select 1 from public.merchant_rental_blackouts b where b.vehicle_id=v.id and b.starts_at<p_ends_at and b.ends_at>p_starts_at) then raise exception 'vehicle_blocked'; end if;
 if exists(select 1 from public.merchant_rental_bookings b where b.vehicle_id=v.id and b.status in ('pending','confirmed','active','overdue') and (b.status<>'pending' or b.created_at>now()-interval '30 minutes') and b.starts_at<p_ends_at and b.ends_at>p_starts_at) then raise exception 'vehicle_unavailable'; end if;
 hrs:=extract(epoch from(p_ends_at-p_starts_at))/3600; mode:=case when v.pricing_mode='hour' then 'hour' when v.pricing_mode='day' then 'day' when hrs<24 then 'hour' else 'day' end;
 if mode='hour' then units:=greatest(v.minimum_hours,ceil(hrs)::integer);base:=units*v.hourly_rate; else units:=greatest(1,ceil(hrs/24)::integer);base:=units*v.daily_rate; end if;
 select coalesce(jsonb_agg(jsonb_build_object('id',s.id,'name',s.name,'description',s.description,'unit',s.unit,'service_type',s.service_type,'price',round(s.price,2),'amount',round(s.price*case when s.unit='day' then units else 1 end,2))),'[]'::jsonb),coalesce(sum(s.price*case when s.unit='day' then units else 1 end),0) into selected,extra from public.merchant_rental_services s join public.merchant_rental_vehicle_services vs on vs.service_id=s.id where vs.vehicle_id=v.id and s.is_active=true and coalesce(p_addon_ids,'[]'::jsonb) @> jsonb_build_array(to_jsonb(s.id::text));
 return jsonb_build_object('vehicle_id',v.id,'pricing_mode',mode,'unit_count',units,'base_amount',round(base,2),'addon_amount',round(extra,2),'addons',selected,'deposit_amount',v.deposit_amount,'total_amount',round(base+extra,2));
end;
$$;

create or replace function public.merchant_rental_manager_list(p_merchant_user_id uuid)
returns jsonb language sql stable security definer set search_path=public,pg_temp as $$
 select jsonb_build_object(
   'vehicles', coalesce((
     select jsonb_agg(
       to_jsonb(v) || jsonb_build_object(
         'addons', coalesce((select jsonb_agg(to_jsonb(s)) from public.merchant_rental_vehicle_services vs join public.merchant_rental_services s on s.id=vs.service_id where vs.vehicle_id=v.id),'[]'::jsonb),
         'luggage_count',coalesce(legacy.luggage_count,2)
       ) order by v.updated_at desc
     ) from public.merchant_rental_vehicles v left join public.merchant_rental_vehicle_addons legacy on legacy.vehicle_id=v.id where v.merchant_user_id=p_merchant_user_id
   ),'[]'::jsonb),
   'services',coalesce((select jsonb_agg(to_jsonb(s) order by s.service_type,s.updated_at desc) from public.merchant_rental_services s where s.merchant_user_id=p_merchant_user_id),'[]'::jsonb),
   'bookings',coalesce((select jsonb_agg(to_jsonb(b) order by b.starts_at asc) from public.merchant_rental_bookings b where b.merchant_user_id=p_merchant_user_id),'[]'::jsonb)
 ) where public.merchant_rental_can_manage(p_merchant_user_id);
$$;

grant execute on function public.merchant_rental_save_shared_service(jsonb) to authenticated;
grant execute on function public.merchant_rental_save_vehicle_services(uuid,jsonb,uuid) to authenticated;
