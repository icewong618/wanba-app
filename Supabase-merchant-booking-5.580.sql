-- 乐生活 v5.580：通用预约服务模块。
-- 适用于摄影、维修、宠物、课程、KTV、活动场地等；美容类保留给后续独立排班模块。

create table if not exists public.merchant_booking_services (
  id uuid primary key default gen_random_uuid(),
  merchant_user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (length(trim(name)) between 1 and 80),
  description text,
  duration_minutes integer not null default 60 check (duration_minutes between 15 and 1440),
  capacity integer not null default 1 check (capacity between 1 and 50),
  price numeric(10,2) check (price is null or price >= 0),
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.merchant_booking_settings (
  merchant_user_id uuid primary key references auth.users(id) on delete cascade,
  slot_interval_minutes integer not null default 30 check (slot_interval_minutes in (15, 30, 60)),
  booking_lead_hours integer not null default 1 check (booking_lead_hours between 0 and 720),
  booking_window_days integer not null default 30 check (booking_window_days between 1 and 365),
  updated_at timestamptz not null default now()
);

create table if not exists public.merchant_bookings (
  id uuid primary key default gen_random_uuid(),
  booking_code text not null unique default ('LSB-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  merchant_user_id uuid not null references auth.users(id) on delete cascade,
  service_id uuid references public.merchant_booking_services(id) on delete set null,
  customer_user_id uuid references auth.users(id) on delete set null,
  customer_name text not null check (length(trim(customer_name)) between 1 and 80),
  customer_phone text not null check (length(trim(customer_phone)) between 4 and 40),
  party_size integer not null default 1 check (party_size between 1 and 50),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  customer_note text,
  merchant_note text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'rejected', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create index if not exists merchant_booking_services_owner_idx on public.merchant_booking_services (merchant_user_id, is_active, sort_order, created_at desc);
create index if not exists merchant_bookings_merchant_time_idx on public.merchant_bookings (merchant_user_id, starts_at, status);
create index if not exists merchant_bookings_customer_idx on public.merchant_bookings (customer_user_id, created_at desc) where customer_user_id is not null;

alter table public.merchant_booking_services enable row level security;
alter table public.merchant_booking_settings enable row level security;
alter table public.merchant_bookings enable row level security;
revoke all on table public.merchant_booking_services, public.merchant_booking_settings, public.merchant_bookings from anon, authenticated;

create or replace function public.merchant_booking_can_manage(p_merchant_user_id uuid)
returns boolean language sql stable security definer set search_path = public, pg_temp as $$
  select (select auth.uid()) = p_merchant_user_id
    or exists (
      select 1 from public.merchant_team_members member
      where member.merchant_user_id = p_merchant_user_id
        and member.member_user_id = (select auth.uid())
        and member.status = 'active'
        and ('order_manage' = any(coalesce(member.permissions, array[]::text[]))
          or 'manager' = any(coalesce(member.roles, array[]::text[])))
    );
$$;

create or replace function public.merchant_booking_public_catalog(p_slug text)
returns jsonb language sql stable security definer set search_path = public, pg_temp as $$
  select jsonb_build_object(
    'merchant', jsonb_build_object(
      'user_id', merchant.user_id, 'business_name', merchant.business_name,
      'logo', merchant.logo, 'address', merchant.address, 'phone', merchant.phone,
      'business_hours', merchant.business_hours
    ),
    'settings', coalesce((
      select jsonb_build_object('slot_interval_minutes', settings.slot_interval_minutes,
        'booking_lead_hours', settings.booking_lead_hours, 'booking_window_days', settings.booking_window_days)
      from public.merchant_booking_settings settings where settings.merchant_user_id = merchant.user_id
    ), jsonb_build_object('slot_interval_minutes',30,'booking_lead_hours',1,'booking_window_days',30)),
    'services', coalesce((
      select jsonb_agg(jsonb_build_object('id', service.id, 'name', service.name,
        'description', service.description, 'duration_minutes', service.duration_minutes,
        'capacity', service.capacity, 'price', service.price) order by service.sort_order, service.created_at)
      from public.merchant_booking_services service
      where service.merchant_user_id = merchant.user_id and service.is_active = true
    ), '[]'::jsonb)
  )
  from public.merchants merchant
  where merchant.slug = lower(trim(p_slug))
    and coalesce(merchant.verified, false) = true
    and coalesce(merchant.enabled_features, '[]'::jsonb) ? 'booking'
  limit 1;
$$;

create or replace function public.merchant_booking_create(
  p_merchant_user_id uuid, p_service_id uuid, p_starts_at timestamptz,
  p_customer_name text, p_customer_phone text, p_party_size integer default 1, p_note text default null
)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_service public.merchant_booking_services%rowtype;
  v_settings public.merchant_booking_settings%rowtype;
  v_ends_at timestamptz;
  v_used integer;
  v_booking public.merchant_bookings%rowtype;
begin
  if length(trim(coalesce(p_customer_name,''))) < 1 then raise exception 'booking_name_required'; end if;
  if length(trim(coalesce(p_customer_phone,''))) < 4 then raise exception 'booking_phone_required'; end if;
  if coalesce(p_party_size,0) not between 1 and 50 then raise exception 'booking_party_size_invalid'; end if;
  if not exists (
    select 1 from public.merchants merchant
    where merchant.user_id = p_merchant_user_id and coalesce(merchant.verified,false) = true
      and coalesce(merchant.enabled_features, '[]'::jsonb) ? 'booking'
  ) then raise exception 'booking_merchant_not_available'; end if;
  select * into v_service from public.merchant_booking_services
  where id = p_service_id and merchant_user_id = p_merchant_user_id and is_active = true;
  if not found then raise exception 'booking_service_not_found'; end if;
  select * into v_settings from public.merchant_booking_settings where merchant_user_id = p_merchant_user_id;
  if not found then
    v_settings.slot_interval_minutes := 30; v_settings.booking_lead_hours := 1; v_settings.booking_window_days := 30;
  end if;
  if p_starts_at is null or p_starts_at < now() + make_interval(hours => v_settings.booking_lead_hours)
     or p_starts_at > now() + make_interval(days => v_settings.booking_window_days) then raise exception 'booking_time_invalid'; end if;
  if mod(extract(minute from timezone('America/Los_Angeles', p_starts_at))::integer, v_settings.slot_interval_minutes) <> 0 then raise exception 'booking_slot_invalid'; end if;
  if p_party_size > v_service.capacity then raise exception 'booking_party_size_exceeded'; end if;
  v_ends_at := p_starts_at + make_interval(mins => v_service.duration_minutes);
  perform pg_advisory_xact_lock(hashtext(p_service_id::text || p_starts_at::text));
  select coalesce(sum(booking.party_size), 0) into v_used from public.merchant_bookings booking
  where booking.service_id = p_service_id and booking.status in ('pending','confirmed')
    and booking.starts_at < v_ends_at and booking.ends_at > p_starts_at;
  if v_used + p_party_size > v_service.capacity then raise exception 'booking_slot_full'; end if;
  insert into public.merchant_bookings(
    merchant_user_id, service_id, customer_user_id, customer_name, customer_phone,
    party_size, starts_at, ends_at, customer_note
  ) values (
    p_merchant_user_id, p_service_id, (select auth.uid()), left(trim(p_customer_name),80), left(trim(p_customer_phone),40),
    p_party_size, p_starts_at, v_ends_at, nullif(left(trim(coalesce(p_note,'')),500),'')
  ) returning * into v_booking;
  return jsonb_build_object('id',v_booking.id,'booking_code',v_booking.booking_code,'status',v_booking.status,'starts_at',v_booking.starts_at,'ends_at',v_booking.ends_at);
end;
$$;

create or replace function public.merchant_booking_manager_snapshot(p_merchant_user_id uuid)
returns jsonb language sql stable security definer set search_path = public, pg_temp as $$
  select jsonb_build_object(
    'services', coalesce((select jsonb_agg(to_jsonb(service) order by service.sort_order, service.created_at) from public.merchant_booking_services service where service.merchant_user_id = p_merchant_user_id), '[]'::jsonb),
    'settings', coalesce((select to_jsonb(settings) from public.merchant_booking_settings settings where settings.merchant_user_id = p_merchant_user_id), jsonb_build_object('slot_interval_minutes',30,'booking_lead_hours',1,'booking_window_days',30)),
    'bookings', coalesce((select jsonb_agg(jsonb_build_object('id',booking.id,'booking_code',booking.booking_code,'service_id',booking.service_id,'customer_name',booking.customer_name,'customer_phone',booking.customer_phone,'party_size',booking.party_size,'starts_at',booking.starts_at,'ends_at',booking.ends_at,'customer_note',booking.customer_note,'merchant_note',booking.merchant_note,'status',booking.status,'created_at',booking.created_at) order by booking.starts_at asc) from public.merchant_bookings booking where booking.merchant_user_id=p_merchant_user_id and booking.starts_at >= now() - interval '30 days'), '[]'::jsonb)
  ) where public.merchant_booking_can_manage(p_merchant_user_id);
$$;

create or replace function public.merchant_booking_save_service(p_merchant_user_id uuid, p_service jsonb)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare v_id uuid; v_row public.merchant_booking_services%rowtype;
begin
  if not public.merchant_booking_can_manage(p_merchant_user_id) then raise exception 'booking_not_allowed'; end if;
  if length(trim(coalesce(p_service->>'name',''))) < 1 then raise exception 'booking_service_name_required'; end if;
  v_id := nullif(p_service->>'id','')::uuid;
  if v_id is null then
    insert into public.merchant_booking_services(merchant_user_id,name,description,duration_minutes,capacity,price,is_active,sort_order)
    values(p_merchant_user_id,left(trim(p_service->>'name'),80),nullif(left(trim(coalesce(p_service->>'description','')),300),''),greatest(15,least(1440,coalesce(nullif(p_service->>'duration_minutes','')::integer,60))),greatest(1,least(50,coalesce(nullif(p_service->>'capacity','')::integer,1))),nullif(p_service->>'price','')::numeric,coalesce((p_service->>'is_active')::boolean,true),coalesce(nullif(p_service->>'sort_order','')::integer,0)) returning * into v_row;
  else
    update public.merchant_booking_services set name=left(trim(p_service->>'name'),80),description=nullif(left(trim(coalesce(p_service->>'description','')),300),''),duration_minutes=greatest(15,least(1440,coalesce(nullif(p_service->>'duration_minutes','')::integer,60))),capacity=greatest(1,least(50,coalesce(nullif(p_service->>'capacity','')::integer,1))),price=nullif(p_service->>'price','')::numeric,is_active=coalesce((p_service->>'is_active')::boolean,true),sort_order=coalesce(nullif(p_service->>'sort_order','')::integer,0),updated_at=now() where id=v_id and merchant_user_id=p_merchant_user_id returning * into v_row;
    if not found then raise exception 'booking_service_not_found'; end if;
  end if;
  return to_jsonb(v_row);
end;
$$;

create or replace function public.merchant_booking_save_settings(p_merchant_user_id uuid, p_settings jsonb)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare v_row public.merchant_booking_settings%rowtype;
begin
  if not public.merchant_booking_can_manage(p_merchant_user_id) then raise exception 'booking_not_allowed'; end if;
  insert into public.merchant_booking_settings(merchant_user_id,slot_interval_minutes,booking_lead_hours,booking_window_days)
  values(p_merchant_user_id,case when coalesce(nullif(p_settings->>'slot_interval_minutes','')::integer,30) in (15,30,60) then coalesce(nullif(p_settings->>'slot_interval_minutes','')::integer,30) else 30 end,greatest(0,least(720,coalesce(nullif(p_settings->>'booking_lead_hours','')::integer,1))),greatest(1,least(365,coalesce(nullif(p_settings->>'booking_window_days','')::integer,30))))
  on conflict(merchant_user_id) do update set slot_interval_minutes=excluded.slot_interval_minutes,booking_lead_hours=excluded.booking_lead_hours,booking_window_days=excluded.booking_window_days,updated_at=now()
  returning * into v_row;
  return to_jsonb(v_row);
end;
$$;

create or replace function public.merchant_booking_set_status(p_booking_id uuid, p_status text, p_note text default null)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare v_row public.merchant_bookings%rowtype;
begin
  if p_status not in ('pending','confirmed','cancelled','rejected','completed') then raise exception 'booking_status_invalid'; end if;
  select * into v_row from public.merchant_bookings where id=p_booking_id for update;
  if not found or not public.merchant_booking_can_manage(v_row.merchant_user_id) then raise exception 'booking_not_allowed'; end if;
  update public.merchant_bookings set status=p_status,merchant_note=nullif(left(trim(coalesce(p_note,'')),500),''),updated_at=now() where id=v_row.id returning * into v_row;
  return to_jsonb(v_row);
end;
$$;

revoke all on function public.merchant_booking_can_manage(uuid) from public;
revoke all on function public.merchant_booking_public_catalog(text) from public, anon, authenticated;
revoke all on function public.merchant_booking_create(uuid,uuid,timestamptz,text,text,integer,text) from public, anon, authenticated;
revoke all on function public.merchant_booking_manager_snapshot(uuid) from public, anon, authenticated;
revoke all on function public.merchant_booking_save_service(uuid,jsonb) from public, anon, authenticated;
revoke all on function public.merchant_booking_save_settings(uuid,jsonb) from public, anon, authenticated;
revoke all on function public.merchant_booking_set_status(uuid,text,text) from public, anon, authenticated;
grant execute on function public.merchant_booking_can_manage(uuid) to authenticated;
grant execute on function public.merchant_booking_public_catalog(text) to anon, authenticated;
grant execute on function public.merchant_booking_create(uuid,uuid,timestamptz,text,text,integer,text) to anon, authenticated;
grant execute on function public.merchant_booking_manager_snapshot(uuid) to authenticated;
grant execute on function public.merchant_booking_save_service(uuid,jsonb) to authenticated;
grant execute on function public.merchant_booking_save_settings(uuid,jsonb) to authenticated;
grant execute on function public.merchant_booking_set_status(uuid,text,text) to authenticated;
