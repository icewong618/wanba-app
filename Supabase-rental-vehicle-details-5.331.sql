-- 乐生活 5.331：车辆行李数与附加服务

alter table public.merchant_rental_vehicle_addons
  add column if not exists luggage_count integer not null default 2 check (luggage_count between 0 and 20);

create or replace function public.merchant_rental_save_vehicle_addons(p_vehicle_id uuid, p_addons jsonb default '[]'::jsonb, p_luggage_count integer default 2)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare clean jsonb := '[]'::jsonb; luggage integer := greatest(0, least(20, coalesce(p_luggage_count, 2)));
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
  insert into public.merchant_rental_vehicle_addons(vehicle_id, addons, luggage_count, updated_at)
  values (p_vehicle_id, clean, luggage, now())
  on conflict (vehicle_id) do update set addons = excluded.addons, luggage_count = excluded.luggage_count, updated_at = now();
  return jsonb_build_object('addons', clean, 'luggage_count', luggage);
end;
$$;

create or replace function public.merchant_rental_public_catalog(p_slug text)
returns jsonb language sql stable security definer set search_path = public, pg_temp as $$
  select jsonb_build_object(
    'merchant', jsonb_build_object('user_id', merchant.user_id, 'business_name', merchant.business_name, 'logo', merchant.logo, 'cover_image', merchant.cover_image, 'address', merchant.address, 'phone', merchant.phone, 'business_hours', merchant.business_hours),
    'vehicles', coalesce((select jsonb_agg(jsonb_build_object(
      'id', vehicle.id, 'name', vehicle.name, 'make', vehicle.make, 'model', vehicle.model, 'year', vehicle.year, 'vehicle_type', vehicle.vehicle_type, 'seats', vehicle.seats, 'transmission', vehicle.transmission, 'fuel_type', vehicle.fuel_type, 'photos', vehicle.photos, 'description', vehicle.description, 'pickup_address', vehicle.pickup_address, 'pricing_mode', vehicle.pricing_mode, 'daily_rate', vehicle.daily_rate, 'hourly_rate', vehicle.hourly_rate, 'minimum_hours', vehicle.minimum_hours, 'deposit_amount', vehicle.deposit_amount, 'mileage_included_per_day', vehicle.mileage_included_per_day, 'extra_mile_rate', vehicle.extra_mile_rate, 'status', vehicle.status, 'addons', coalesce(extra.addons, '[]'::jsonb), 'luggage_count', coalesce(extra.luggage_count, 2)
    ) order by vehicle.updated_at desc) from public.merchant_rental_vehicles vehicle left join public.merchant_rental_vehicle_addons extra on extra.vehicle_id=vehicle.id where vehicle.merchant_user_id=merchant.user_id and vehicle.is_active=true and vehicle.status='available'), '[]'::jsonb)
  ) from public.merchants merchant where merchant.slug=lower(trim(p_slug)) and coalesce(merchant.verified,false)=true limit 1;
$$;

create or replace function public.merchant_rental_manager_list(p_merchant_user_id uuid)
returns jsonb language sql stable security definer set search_path = public, pg_temp as $$
  select jsonb_build_object(
    'vehicles', coalesce((select jsonb_agg(to_jsonb(vehicle) || jsonb_build_object('addons',coalesce(extra.addons,'[]'::jsonb),'luggage_count',coalesce(extra.luggage_count,2)) order by vehicle.updated_at desc) from public.merchant_rental_vehicles vehicle left join public.merchant_rental_vehicle_addons extra on extra.vehicle_id=vehicle.id where vehicle.merchant_user_id=p_merchant_user_id),'[]'::jsonb),
    'bookings', coalesce((select jsonb_agg(to_jsonb(booking) order by booking.starts_at asc) from public.merchant_rental_bookings booking where booking.merchant_user_id=p_merchant_user_id),'[]'::jsonb)
  ) where public.merchant_rental_can_manage(p_merchant_user_id);
$$;

revoke all on function public.merchant_rental_save_vehicle_addons(uuid,jsonb) from public;
grant execute on function public.merchant_rental_save_vehicle_addons(uuid,jsonb,integer) to authenticated;
