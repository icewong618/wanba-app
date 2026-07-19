-- 乐生活 5.322：商家高级功能 - 租车预约（第一、二版基础）
-- 第三版的远程解锁、车辆定位与驾驶行为数据不在本次范围内。

create table if not exists public.merchant_rental_vehicles (
  id uuid primary key default gen_random_uuid(),
  merchant_user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  make text,
  model text,
  year integer check (year between 1900 and 2100),
  vehicle_type text not null default '轿车',
  seats integer not null default 5 check (seats between 1 and 30),
  transmission text not null default '自动挡',
  fuel_type text not null default '汽油',
  photos jsonb not null default '[]'::jsonb check (jsonb_typeof(photos) = 'array'),
  description text,
  pickup_address text,
  pricing_mode text not null default 'day' check (pricing_mode in ('day','hour','both')),
  daily_rate numeric(10,2) not null default 0 check (daily_rate >= 0),
  hourly_rate numeric(10,2) not null default 0 check (hourly_rate >= 0),
  minimum_hours integer not null default 1 check (minimum_hours between 1 and 168),
  deposit_amount numeric(10,2) not null default 0 check (deposit_amount >= 0),
  mileage_included_per_day integer,
  extra_mile_rate numeric(10,2) not null default 0 check (extra_mile_rate >= 0),
  status text not null default 'available' check (status in ('available','reserved','rented','maintenance','cleaning','inactive')),
  maintenance_note text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists merchant_rental_vehicles_merchant_status_idx
  on public.merchant_rental_vehicles (merchant_user_id, status, is_active, updated_at desc);

create table if not exists public.merchant_rental_blackouts (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.merchant_rental_vehicles(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);
create index if not exists merchant_rental_blackouts_vehicle_dates_idx
  on public.merchant_rental_blackouts (vehicle_id, starts_at, ends_at);

create table if not exists public.merchant_rental_bookings (
  id uuid primary key default gen_random_uuid(),
  booking_code text not null unique,
  merchant_user_id uuid not null references auth.users(id) on delete cascade,
  vehicle_id uuid not null references public.merchant_rental_vehicles(id) on delete restrict,
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null check (char_length(customer_name) between 1 and 80),
  customer_phone text not null check (char_length(customer_phone) between 4 and 40),
  customer_email text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  pricing_mode text not null check (pricing_mode in ('day','hour')),
  unit_count integer not null check (unit_count > 0),
  base_amount numeric(10,2) not null default 0 check (base_amount >= 0),
  member_discount_amount numeric(10,2) not null default 0 check (member_discount_amount >= 0),
  coupon_discount_amount numeric(10,2) not null default 0 check (coupon_discount_amount >= 0),
  total_amount numeric(10,2) not null default 0 check (total_amount >= 0),
  deposit_amount numeric(10,2) not null default 0 check (deposit_amount >= 0),
  status text not null default 'pending' check (status in ('pending','confirmed','rejected','cancelled','active','returned','overdue')),
  payment_status text not null default 'pending' check (payment_status in ('pending','paid','refunded','partial_refund','waived')),
  deposit_status text not null default 'not_collected' check (deposit_status in ('not_collected','authorized','collected','released','forfeited','refunded')),
  pickup_odometer integer,
  return_odometer integer,
  pickup_photos jsonb not null default '[]'::jsonb check (jsonb_typeof(pickup_photos) = 'array'),
  return_photos jsonb not null default '[]'::jsonb check (jsonb_typeof(return_photos) = 'array'),
  handover_note text,
  return_note text,
  extension_requested_end_at timestamptz,
  operator_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  confirmed_at timestamptz,
  check (ends_at > starts_at)
);
create index if not exists merchant_rental_bookings_merchant_status_dates_idx
  on public.merchant_rental_bookings (merchant_user_id, status, starts_at, ends_at);
create index if not exists merchant_rental_bookings_vehicle_dates_idx
  on public.merchant_rental_bookings (vehicle_id, starts_at, ends_at);
create index if not exists merchant_rental_bookings_user_created_idx
  on public.merchant_rental_bookings (user_id, created_at desc);

alter table public.merchant_rental_vehicles enable row level security;
alter table public.merchant_rental_blackouts enable row level security;
alter table public.merchant_rental_bookings enable row level security;

create or replace function public.merchant_rental_can_manage(p_merchant_user_id uuid)
returns boolean language sql stable security definer set search_path = public, pg_temp as $$
  select auth.uid() = p_merchant_user_id
    or exists (
      select 1 from public.merchant_team_members member
      where member.merchant_user_id = p_merchant_user_id
        and member.member_user_id = auth.uid()
        and member.status = 'active'
        and (
          coalesce(member.role, '') = 'operator'
          or 'manager' = any(coalesce(member.roles, array[]::text[]))
          or 'order_manage' = any(coalesce(member.permissions, array[]::text[]))
        )
    );
$$;
revoke all on function public.merchant_rental_can_manage(uuid) from public;
grant execute on function public.merchant_rental_can_manage(uuid) to authenticated;

drop policy if exists "rental vehicles merchant manager 5.322" on public.merchant_rental_vehicles;
create policy "rental vehicles merchant manager 5.322" on public.merchant_rental_vehicles
  for all to authenticated
  using (public.merchant_rental_can_manage(merchant_user_id))
  with check (public.merchant_rental_can_manage(merchant_user_id));
drop policy if exists "rental blackouts merchant manager 5.322" on public.merchant_rental_blackouts;
create policy "rental blackouts merchant manager 5.322" on public.merchant_rental_blackouts
  for all to authenticated
  using (exists (select 1 from public.merchant_rental_vehicles vehicle where vehicle.id = vehicle_id and public.merchant_rental_can_manage(vehicle.merchant_user_id)))
  with check (exists (select 1 from public.merchant_rental_vehicles vehicle where vehicle.id = vehicle_id and public.merchant_rental_can_manage(vehicle.merchant_user_id)));
drop policy if exists "rental booking member read 5.322" on public.merchant_rental_bookings;
create policy "rental booking member read 5.322" on public.merchant_rental_bookings
  for select to authenticated
  using (user_id = auth.uid() or public.merchant_rental_can_manage(merchant_user_id));

create or replace function public.merchant_rental_public_catalog(p_slug text)
returns jsonb language sql stable security definer set search_path = public, pg_temp as $$
  select jsonb_build_object(
    'merchant', jsonb_build_object(
      'user_id', merchant.user_id,
      'business_name', merchant.business_name,
      'logo', merchant.logo,
      'cover_image', merchant.cover_image,
      'address', merchant.address,
      'phone', merchant.phone,
      'business_hours', merchant.business_hours
    ),
    'vehicles', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', vehicle.id,
        'name', vehicle.name,
        'make', vehicle.make,
        'model', vehicle.model,
        'year', vehicle.year,
        'vehicle_type', vehicle.vehicle_type,
        'seats', vehicle.seats,
        'transmission', vehicle.transmission,
        'fuel_type', vehicle.fuel_type,
        'photos', vehicle.photos,
        'description', vehicle.description,
        'pickup_address', vehicle.pickup_address,
        'pricing_mode', vehicle.pricing_mode,
        'daily_rate', vehicle.daily_rate,
        'hourly_rate', vehicle.hourly_rate,
        'minimum_hours', vehicle.minimum_hours,
        'deposit_amount', vehicle.deposit_amount,
        'mileage_included_per_day', vehicle.mileage_included_per_day,
        'extra_mile_rate', vehicle.extra_mile_rate,
        'status', vehicle.status
      ) order by vehicle.updated_at desc)
      from public.merchant_rental_vehicles vehicle
      where vehicle.merchant_user_id = merchant.user_id and vehicle.is_active = true and vehicle.status = 'available'
    ), '[]'::jsonb)
  )
  from public.merchants merchant
  where merchant.slug = lower(trim(p_slug)) and coalesce(merchant.verified, false) = true
  limit 1;
$$;

create or replace function public.merchant_rental_quote(p_vehicle_id uuid, p_starts_at timestamptz, p_ends_at timestamptz)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare vehicle public.merchant_rental_vehicles%rowtype; hours numeric; units integer; mode text; amount numeric;
begin
  select * into vehicle from public.merchant_rental_vehicles where id = p_vehicle_id and is_active = true;
  if not found or vehicle.status <> 'available' then raise exception 'vehicle_unavailable'; end if;
  if p_starts_at is null or p_ends_at is null or p_ends_at <= p_starts_at or p_starts_at < now() - interval '5 minutes' or p_ends_at > now() + interval '370 days' then raise exception 'invalid_rental_time'; end if;
  if exists (select 1 from public.merchant_rental_blackouts blackout where blackout.vehicle_id = vehicle.id and blackout.starts_at < p_ends_at and blackout.ends_at > p_starts_at) then raise exception 'vehicle_blocked'; end if;
  if exists (select 1 from public.merchant_rental_bookings booking where booking.vehicle_id = vehicle.id and booking.status in ('pending','confirmed','active','overdue') and (booking.status <> 'pending' or booking.created_at > now() - interval '30 minutes') and booking.starts_at < p_ends_at and booking.ends_at > p_starts_at) then raise exception 'vehicle_unavailable'; end if;
  hours := extract(epoch from (p_ends_at - p_starts_at)) / 3600.0;
  mode := case when vehicle.pricing_mode = 'hour' then 'hour' when vehicle.pricing_mode = 'day' then 'day' when hours < 24 then 'hour' else 'day' end;
  if mode = 'hour' then
    units := greatest(vehicle.minimum_hours, ceil(hours)::integer);
    amount := units * vehicle.hourly_rate;
  else
    units := greatest(1, ceil(hours / 24.0)::integer);
    amount := units * vehicle.daily_rate;
  end if;
  return jsonb_build_object('vehicle_id', vehicle.id, 'pricing_mode', mode, 'unit_count', units, 'base_amount', round(amount,2), 'deposit_amount', vehicle.deposit_amount, 'total_amount', round(amount,2));
end;
$$;

create or replace function public.merchant_rental_create_booking(
  p_vehicle_id uuid, p_starts_at timestamptz, p_ends_at timestamptz,
  p_customer_name text, p_customer_phone text, p_customer_email text default null, p_note text default null
)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare vehicle public.merchant_rental_vehicles%rowtype; quote jsonb; code text; booking public.merchant_rental_bookings%rowtype;
begin
  if length(trim(coalesce(p_customer_name,''))) < 1 or length(trim(coalesce(p_customer_phone,''))) < 4 then raise exception 'customer_contact_required'; end if;
  select * into vehicle from public.merchant_rental_vehicles where id = p_vehicle_id for update;
  if not found then raise exception 'vehicle_not_found'; end if;
  quote := public.merchant_rental_quote(p_vehicle_id, p_starts_at, p_ends_at);
  code := 'LSR-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8));
  insert into public.merchant_rental_bookings (
    booking_code, merchant_user_id, vehicle_id, user_id, customer_name, customer_phone, customer_email,
    starts_at, ends_at, pricing_mode, unit_count, base_amount, total_amount, deposit_amount, operator_note
  ) values (
    code, vehicle.merchant_user_id, vehicle.id, auth.uid(), trim(p_customer_name), trim(p_customer_phone), nullif(trim(coalesce(p_customer_email,'')),''),
    p_starts_at, p_ends_at, quote->>'pricing_mode', (quote->>'unit_count')::integer, (quote->>'base_amount')::numeric,
    (quote->>'total_amount')::numeric, (quote->>'deposit_amount')::numeric, nullif(trim(coalesce(p_note,'')), '')
  ) returning * into booking;
  return jsonb_build_object('id', booking.id, 'booking_code', booking.booking_code, 'status', booking.status, 'base_amount', booking.base_amount, 'deposit_amount', booking.deposit_amount, 'total_amount', booking.total_amount);
end;
$$;

create or replace function public.merchant_rental_manager_list(p_merchant_user_id uuid)
returns jsonb language sql stable security definer set search_path = public, pg_temp as $$
  select jsonb_build_object(
    'vehicles', coalesce((select jsonb_agg(to_jsonb(vehicle) order by vehicle.updated_at desc) from public.merchant_rental_vehicles vehicle where vehicle.merchant_user_id = p_merchant_user_id), '[]'::jsonb),
    'bookings', coalesce((select jsonb_agg(to_jsonb(booking) order by booking.starts_at asc) from public.merchant_rental_bookings booking where booking.merchant_user_id = p_merchant_user_id), '[]'::jsonb)
  ) where public.merchant_rental_can_manage(p_merchant_user_id);
$$;

create or replace function public.merchant_rental_set_booking_status(
  p_booking_id uuid, p_status text, p_note text default null, p_payment_status text default null, p_deposit_status text default null
)
returns public.merchant_rental_bookings language plpgsql security definer set search_path = public, pg_temp as $$
declare booking public.merchant_rental_bookings%rowtype;
begin
  select * into booking from public.merchant_rental_bookings where id = p_booking_id for update;
  if not found or not public.merchant_rental_can_manage(booking.merchant_user_id) then raise exception 'rental_not_allowed'; end if;
  if p_status not in ('pending','confirmed','rejected','cancelled','active','returned','overdue') then raise exception 'invalid_booking_status'; end if;
  if p_status in ('confirmed','active') and exists (select 1 from public.merchant_rental_bookings other_booking where other_booking.vehicle_id = booking.vehicle_id and other_booking.id <> booking.id and other_booking.status in ('confirmed','active','overdue') and other_booking.starts_at < booking.ends_at and other_booking.ends_at > booking.starts_at) then raise exception 'vehicle_booking_conflict'; end if;
  update public.merchant_rental_bookings
  set status = p_status,
      operator_note = coalesce(nullif(trim(coalesce(p_note,'')),''), operator_note),
      payment_status = coalesce(nullif(p_payment_status,''), payment_status),
      deposit_status = coalesce(nullif(p_deposit_status,''), deposit_status),
      confirmed_at = case when p_status = 'confirmed' then now() else confirmed_at end,
      updated_at = now()
  where id = booking.id returning * into booking;
  update public.merchant_rental_vehicles set status = case when p_status = 'active' then 'rented' when p_status in ('returned','rejected','cancelled') then 'available' else status end, updated_at = now() where id = booking.vehicle_id;
  return booking;
end;
$$;

create or replace function public.merchant_rental_save_vehicle(p_merchant_user_id uuid, p_vehicle jsonb)
returns public.merchant_rental_vehicles language plpgsql security definer set search_path = public, pg_temp as $$
declare row public.merchant_rental_vehicles%rowtype; vehicle_id uuid := nullif(p_vehicle->>'id','')::uuid;
begin
  if not public.merchant_rental_can_manage(p_merchant_user_id) then raise exception 'rental_not_allowed'; end if;
  if vehicle_id is null then
    insert into public.merchant_rental_vehicles (merchant_user_id,name,make,model,year,vehicle_type,seats,transmission,fuel_type,photos,description,pickup_address,pricing_mode,daily_rate,hourly_rate,minimum_hours,deposit_amount,mileage_included_per_day,extra_mile_rate,status,is_active)
    values (p_merchant_user_id,trim(coalesce(p_vehicle->>'name','')),nullif(trim(coalesce(p_vehicle->>'make','')),''),nullif(trim(coalesce(p_vehicle->>'model','')),''),nullif(p_vehicle->>'year','')::integer,coalesce(nullif(p_vehicle->>'vehicle_type',''),'轿车'),greatest(1,coalesce(nullif(p_vehicle->>'seats','')::integer,5)),coalesce(nullif(p_vehicle->>'transmission',''),'自动挡'),coalesce(nullif(p_vehicle->>'fuel_type',''),'汽油'),coalesce(p_vehicle->'photos','[]'::jsonb),nullif(trim(coalesce(p_vehicle->>'description','')),''),nullif(trim(coalesce(p_vehicle->>'pickup_address','')),''),coalesce(nullif(p_vehicle->>'pricing_mode',''),'day'),greatest(0,coalesce(nullif(p_vehicle->>'daily_rate','')::numeric,0)),greatest(0,coalesce(nullif(p_vehicle->>'hourly_rate','')::numeric,0)),greatest(1,coalesce(nullif(p_vehicle->>'minimum_hours','')::integer,1)),greatest(0,coalesce(nullif(p_vehicle->>'deposit_amount','')::numeric,0)),nullif(p_vehicle->>'mileage_included_per_day','')::integer,greatest(0,coalesce(nullif(p_vehicle->>'extra_mile_rate','')::numeric,0)),coalesce(nullif(p_vehicle->>'status',''),'available'),coalesce((p_vehicle->>'is_active')::boolean,true)) returning * into row;
  else
    update public.merchant_rental_vehicles set name=trim(coalesce(p_vehicle->>'name',name)),make=nullif(trim(coalesce(p_vehicle->>'make',make)),''),model=nullif(trim(coalesce(p_vehicle->>'model',model)),''),year=coalesce(nullif(p_vehicle->>'year','')::integer,year),vehicle_type=coalesce(nullif(p_vehicle->>'vehicle_type',''),vehicle_type),seats=greatest(1,coalesce(nullif(p_vehicle->>'seats','')::integer,seats)),transmission=coalesce(nullif(p_vehicle->>'transmission',''),transmission),fuel_type=coalesce(nullif(p_vehicle->>'fuel_type',''),fuel_type),photos=coalesce(p_vehicle->'photos',photos),description=nullif(trim(coalesce(p_vehicle->>'description',description)),''),pickup_address=nullif(trim(coalesce(p_vehicle->>'pickup_address',pickup_address)),''),pricing_mode=coalesce(nullif(p_vehicle->>'pricing_mode',''),pricing_mode),daily_rate=greatest(0,coalesce(nullif(p_vehicle->>'daily_rate','')::numeric,daily_rate)),hourly_rate=greatest(0,coalesce(nullif(p_vehicle->>'hourly_rate','')::numeric,hourly_rate)),minimum_hours=greatest(1,coalesce(nullif(p_vehicle->>'minimum_hours','')::integer,minimum_hours)),deposit_amount=greatest(0,coalesce(nullif(p_vehicle->>'deposit_amount','')::numeric,deposit_amount)),mileage_included_per_day=nullif(p_vehicle->>'mileage_included_per_day','')::integer,extra_mile_rate=greatest(0,coalesce(nullif(p_vehicle->>'extra_mile_rate','')::numeric,extra_mile_rate)),status=coalesce(nullif(p_vehicle->>'status',''),status),is_active=coalesce((p_vehicle->>'is_active')::boolean,is_active),updated_at=now() where id=vehicle_id and merchant_user_id=p_merchant_user_id returning * into row;
    if not found then raise exception 'vehicle_not_found'; end if;
  end if;
  return row;
end;
$$;

revoke all on function public.merchant_rental_public_catalog(text) from public;
revoke all on function public.merchant_rental_quote(uuid,timestamptz,timestamptz) from public;
revoke all on function public.merchant_rental_create_booking(uuid,timestamptz,timestamptz,text,text,text,text) from public;
revoke all on function public.merchant_rental_manager_list(uuid) from public;
revoke all on function public.merchant_rental_set_booking_status(uuid,text,text,text,text) from public;
revoke all on function public.merchant_rental_save_vehicle(uuid,jsonb) from public;
grant execute on function public.merchant_rental_public_catalog(text) to anon, authenticated;
grant execute on function public.merchant_rental_quote(uuid,timestamptz,timestamptz) to anon, authenticated;
grant execute on function public.merchant_rental_create_booking(uuid,timestamptz,timestamptz,text,text,text,text) to anon, authenticated;
grant execute on function public.merchant_rental_manager_list(uuid) to authenticated;
grant execute on function public.merchant_rental_set_booking_status(uuid,text,text,text,text) to authenticated;
grant execute on function public.merchant_rental_save_vehicle(uuid,jsonb) to authenticated;

analyze public.merchant_rental_vehicles;
analyze public.merchant_rental_bookings;
