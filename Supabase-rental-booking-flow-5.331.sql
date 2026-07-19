-- 乐生活 5.331：租车附加服务、预约确认与支付明细

create table if not exists public.merchant_rental_vehicle_addons (
  vehicle_id uuid primary key references public.merchant_rental_vehicles(id) on delete cascade,
  addons jsonb not null default '[]'::jsonb check (jsonb_typeof(addons) = 'array'),
  updated_at timestamptz not null default now()
);

alter table public.merchant_rental_bookings
  add column if not exists rental_addons jsonb not null default '[]'::jsonb check (jsonb_typeof(rental_addons) = 'array');

alter table public.merchant_rental_vehicle_addons enable row level security;

drop policy if exists "rental vehicle addons manager 5.331" on public.merchant_rental_vehicle_addons;
create policy "rental vehicle addons manager 5.331" on public.merchant_rental_vehicle_addons
  for all to authenticated
  using (exists (
    select 1 from public.merchant_rental_vehicles vehicle
    where vehicle.id = vehicle_id and public.merchant_rental_can_manage(vehicle.merchant_user_id)
  ))
  with check (exists (
    select 1 from public.merchant_rental_vehicles vehicle
    where vehicle.id = vehicle_id and public.merchant_rental_can_manage(vehicle.merchant_user_id)
  ));

create or replace function public.merchant_rental_save_vehicle_addons(p_vehicle_id uuid, p_addons jsonb default '[]'::jsonb)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare clean jsonb := '[]'::jsonb;
begin
  if not exists (
    select 1 from public.merchant_rental_vehicles vehicle
    where vehicle.id = p_vehicle_id and public.merchant_rental_can_manage(vehicle.merchant_user_id)
  ) then raise exception 'rental_not_allowed'; end if;
  if jsonb_typeof(coalesce(p_addons, '[]'::jsonb)) <> 'array' then raise exception 'invalid_addons'; end if;
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', coalesce(nullif(trim(item->>'id'), ''), 'addon-' || substr(md5(item::text), 1, 12)),
    'name', left(trim(coalesce(item->>'name','')), 80),
    'description', left(trim(coalesce(item->>'description','')), 180),
    'price', greatest(0, coalesce(nullif(item->>'price','')::numeric, 0)),
    'unit', case when item->>'unit' = 'day' then 'day' else 'once' end
  )), '[]'::jsonb) into clean
  from jsonb_array_elements(coalesce(p_addons, '[]'::jsonb)) item
  where length(trim(coalesce(item->>'name',''))) > 0;
  insert into public.merchant_rental_vehicle_addons(vehicle_id, addons, updated_at)
  values (p_vehicle_id, clean, now())
  on conflict (vehicle_id) do update set addons = excluded.addons, updated_at = now();
  return clean;
end;
$$;

create or replace function public.merchant_rental_public_catalog(p_slug text)
returns jsonb language sql stable security definer set search_path = public, pg_temp as $$
  select jsonb_build_object(
    'merchant', jsonb_build_object(
      'user_id', merchant.user_id, 'business_name', merchant.business_name,
      'logo', merchant.logo, 'cover_image', merchant.cover_image, 'address', merchant.address,
      'phone', merchant.phone, 'business_hours', merchant.business_hours
    ),
    'vehicles', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', vehicle.id, 'name', vehicle.name, 'make', vehicle.make, 'model', vehicle.model,
        'year', vehicle.year, 'vehicle_type', vehicle.vehicle_type, 'seats', vehicle.seats,
        'transmission', vehicle.transmission, 'fuel_type', vehicle.fuel_type, 'photos', vehicle.photos,
        'description', vehicle.description, 'pickup_address', vehicle.pickup_address,
        'pricing_mode', vehicle.pricing_mode, 'daily_rate', vehicle.daily_rate, 'hourly_rate', vehicle.hourly_rate,
        'minimum_hours', vehicle.minimum_hours, 'deposit_amount', vehicle.deposit_amount,
        'mileage_included_per_day', vehicle.mileage_included_per_day, 'extra_mile_rate', vehicle.extra_mile_rate,
        'status', vehicle.status, 'addons', coalesce(extra.addons, '[]'::jsonb)
      ) order by vehicle.updated_at desc)
      from public.merchant_rental_vehicles vehicle
      left join public.merchant_rental_vehicle_addons extra on extra.vehicle_id = vehicle.id
      where vehicle.merchant_user_id = merchant.user_id and vehicle.is_active = true and vehicle.status = 'available'
    ), '[]'::jsonb)
  ) from public.merchants merchant
  where merchant.slug = lower(trim(p_slug)) and coalesce(merchant.verified, false) = true limit 1;
$$;

create or replace function public.merchant_rental_quote(
  p_vehicle_id uuid, p_starts_at timestamptz, p_ends_at timestamptz, p_addon_ids jsonb
) returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare vehicle public.merchant_rental_vehicles%rowtype; hours numeric; units integer; mode text; amount numeric;
  selected jsonb := '[]'::jsonb; addon_total numeric := 0; stored jsonb := '[]'::jsonb;
begin
  select * into vehicle from public.merchant_rental_vehicles where id = p_vehicle_id and is_active = true;
  if not found or vehicle.status <> 'available' then raise exception 'vehicle_unavailable'; end if;
  if p_starts_at is null or p_ends_at is null or p_ends_at <= p_starts_at or p_starts_at < now() - interval '5 minutes' or p_ends_at > now() + interval '370 days' then raise exception 'invalid_rental_time'; end if;
  if exists (select 1 from public.merchant_rental_blackouts blackout where blackout.vehicle_id = vehicle.id and blackout.starts_at < p_ends_at and blackout.ends_at > p_starts_at) then raise exception 'vehicle_blocked'; end if;
  if exists (select 1 from public.merchant_rental_bookings booking where booking.vehicle_id = vehicle.id and booking.status in ('pending','confirmed','active','overdue') and (booking.status <> 'pending' or booking.created_at > now() - interval '30 minutes') and booking.starts_at < p_ends_at and booking.ends_at > p_starts_at) then raise exception 'vehicle_unavailable'; end if;
  hours := extract(epoch from (p_ends_at - p_starts_at)) / 3600.0;
  mode := case when vehicle.pricing_mode = 'hour' then 'hour' when vehicle.pricing_mode = 'day' then 'day' when hours < 24 then 'hour' else 'day' end;
  if mode = 'hour' then units := greatest(vehicle.minimum_hours, ceil(hours)::integer); amount := units * vehicle.hourly_rate;
  else units := greatest(1, ceil(hours / 24.0)::integer); amount := units * vehicle.daily_rate; end if;
  select coalesce(addons, '[]'::jsonb) into stored from public.merchant_rental_vehicle_addons where vehicle_id = vehicle.id;
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', item->>'id', 'name', item->>'name', 'description', item->>'description', 'unit', case when item->>'unit'='day' then 'day' else 'once' end,
    'price', round((item->>'price')::numeric,2),
    'amount', round((item->>'price')::numeric * case when item->>'unit'='day' then units else 1 end,2)
  )), '[]'::jsonb), coalesce(sum((item->>'price')::numeric * case when item->>'unit'='day' then units else 1 end),0)
  into selected, addon_total
  from jsonb_array_elements(stored) item
  where coalesce(p_addon_ids, '[]'::jsonb) @> jsonb_build_array(to_jsonb(item->>'id'));
  return jsonb_build_object('vehicle_id', vehicle.id, 'pricing_mode', mode, 'unit_count', units,
    'base_amount', round(amount,2), 'addon_amount', round(addon_total,2), 'addons', selected,
    'deposit_amount', vehicle.deposit_amount, 'total_amount', round(amount + addon_total,2));
end;
$$;

create or replace function public.merchant_rental_create_booking(
  p_vehicle_id uuid, p_starts_at timestamptz, p_ends_at timestamptz,
  p_customer_name text, p_customer_phone text, p_customer_email text, p_note text, p_addon_ids jsonb
) returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare vehicle public.merchant_rental_vehicles%rowtype; quote jsonb; code text; booking public.merchant_rental_bookings%rowtype;
begin
  if length(trim(coalesce(p_customer_name,''))) < 1 or length(trim(coalesce(p_customer_phone,''))) < 4 then raise exception 'customer_contact_required'; end if;
  select * into vehicle from public.merchant_rental_vehicles where id = p_vehicle_id for update;
  if not found then raise exception 'vehicle_not_found'; end if;
  quote := public.merchant_rental_quote(p_vehicle_id, p_starts_at, p_ends_at, coalesce(p_addon_ids, '[]'::jsonb));
  code := 'LSR-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8));
  insert into public.merchant_rental_bookings (
    booking_code, merchant_user_id, vehicle_id, user_id, customer_name, customer_phone, customer_email,
    starts_at, ends_at, pricing_mode, unit_count, base_amount, total_amount, deposit_amount, rental_addons, operator_note
  ) values (
    code, vehicle.merchant_user_id, vehicle.id, auth.uid(), trim(p_customer_name), trim(p_customer_phone), nullif(trim(coalesce(p_customer_email,'')),''),
    p_starts_at, p_ends_at, quote->>'pricing_mode', (quote->>'unit_count')::integer, (quote->>'base_amount')::numeric,
    (quote->>'total_amount')::numeric, (quote->>'deposit_amount')::numeric, quote->'addons', nullif(trim(coalesce(p_note,'')), '')
  ) returning * into booking;
  return jsonb_build_object('id', booking.id, 'booking_code', booking.booking_code, 'status', booking.status,
    'base_amount', booking.base_amount, 'addon_amount', coalesce((quote->>'addon_amount')::numeric,0),
    'deposit_amount', booking.deposit_amount, 'total_amount', booking.total_amount, 'addons', booking.rental_addons);
end;
$$;

create or replace function public.merchant_rental_manager_list(p_merchant_user_id uuid)
returns jsonb language sql stable security definer set search_path = public, pg_temp as $$
  select jsonb_build_object(
    'vehicles', coalesce((select jsonb_agg(to_jsonb(vehicle) || jsonb_build_object('addons', coalesce(extra.addons, '[]'::jsonb)) order by vehicle.updated_at desc)
      from public.merchant_rental_vehicles vehicle left join public.merchant_rental_vehicle_addons extra on extra.vehicle_id = vehicle.id
      where vehicle.merchant_user_id = p_merchant_user_id), '[]'::jsonb),
    'bookings', coalesce((select jsonb_agg(to_jsonb(booking) order by booking.starts_at asc) from public.merchant_rental_bookings booking where booking.merchant_user_id = p_merchant_user_id), '[]'::jsonb)
  ) where public.merchant_rental_can_manage(p_merchant_user_id);
$$;

grant execute on function public.merchant_rental_save_vehicle_addons(uuid,jsonb) to authenticated;
grant execute on function public.merchant_rental_quote(uuid,timestamptz,timestamptz,jsonb) to anon, authenticated;
grant execute on function public.merchant_rental_create_booking(uuid,timestamptz,timestamptz,text,text,text,text,jsonb) to anon, authenticated;
