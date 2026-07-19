-- 乐生活 5.328：租车车辆保存容错
-- 年份为选填；仅保留 1900 至 2100 的四位年份，异常值按未填写处理。

create or replace function public.merchant_rental_save_vehicle(
  p_merchant_user_id uuid,
  p_vehicle jsonb
)
returns public.merchant_rental_vehicles
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  row public.merchant_rental_vehicles%rowtype;
  vehicle_id uuid := nullif(p_vehicle->>'id','')::uuid;
  vehicle_year integer := case
    when coalesce(p_vehicle->>'year','') ~ '^[0-9]{4}$'
      and (p_vehicle->>'year')::integer between 1900 and 2100
      then (p_vehicle->>'year')::integer
    else null
  end;
begin
  if not public.merchant_rental_can_manage(p_merchant_user_id) then
    raise exception 'rental_not_allowed';
  end if;

  if vehicle_id is null then
    insert into public.merchant_rental_vehicles (
      merchant_user_id, name, make, model, year, vehicle_type, seats,
      transmission, fuel_type, photos, description, pickup_address,
      pricing_mode, daily_rate, hourly_rate, minimum_hours, deposit_amount,
      mileage_included_per_day, extra_mile_rate, status, is_active
    ) values (
      p_merchant_user_id,
      trim(coalesce(p_vehicle->>'name','')),
      nullif(trim(coalesce(p_vehicle->>'make','')),''),
      nullif(trim(coalesce(p_vehicle->>'model','')),''),
      vehicle_year,
      coalesce(nullif(p_vehicle->>'vehicle_type',''),'轿车'),
      greatest(1, least(30, coalesce(nullif(p_vehicle->>'seats','')::integer,5))),
      coalesce(nullif(p_vehicle->>'transmission',''),'自动挡'),
      coalesce(nullif(p_vehicle->>'fuel_type',''),'汽油'),
      coalesce(p_vehicle->'photos','[]'::jsonb),
      nullif(trim(coalesce(p_vehicle->>'description','')),''),
      nullif(trim(coalesce(p_vehicle->>'pickup_address','')),''),
      coalesce(nullif(p_vehicle->>'pricing_mode',''),'day'),
      greatest(0, coalesce(nullif(p_vehicle->>'daily_rate','')::numeric,0)),
      greatest(0, coalesce(nullif(p_vehicle->>'hourly_rate','')::numeric,0)),
      greatest(1, least(168, coalesce(nullif(p_vehicle->>'minimum_hours','')::integer,1))),
      greatest(0, coalesce(nullif(p_vehicle->>'deposit_amount','')::numeric,0)),
      nullif(p_vehicle->>'mileage_included_per_day','')::integer,
      greatest(0, coalesce(nullif(p_vehicle->>'extra_mile_rate','')::numeric,0)),
      coalesce(nullif(p_vehicle->>'status',''),'available'),
      coalesce((p_vehicle->>'is_active')::boolean,true)
    ) returning * into row;
  else
    update public.merchant_rental_vehicles
    set
      name = trim(coalesce(p_vehicle->>'name',name)),
      make = nullif(trim(coalesce(p_vehicle->>'make',make)),''),
      model = nullif(trim(coalesce(p_vehicle->>'model',model)),''),
      year = vehicle_year,
      vehicle_type = coalesce(nullif(p_vehicle->>'vehicle_type',''),vehicle_type),
      seats = greatest(1, least(30, coalesce(nullif(p_vehicle->>'seats','')::integer,seats))),
      transmission = coalesce(nullif(p_vehicle->>'transmission',''),transmission),
      fuel_type = coalesce(nullif(p_vehicle->>'fuel_type',''),fuel_type),
      photos = coalesce(p_vehicle->'photos',photos),
      description = nullif(trim(coalesce(p_vehicle->>'description',description)),''),
      pickup_address = nullif(trim(coalesce(p_vehicle->>'pickup_address',pickup_address)),''),
      pricing_mode = coalesce(nullif(p_vehicle->>'pricing_mode',''),pricing_mode),
      daily_rate = greatest(0,coalesce(nullif(p_vehicle->>'daily_rate','')::numeric,daily_rate)),
      hourly_rate = greatest(0,coalesce(nullif(p_vehicle->>'hourly_rate','')::numeric,hourly_rate)),
      minimum_hours = greatest(1,least(168,coalesce(nullif(p_vehicle->>'minimum_hours','')::integer,minimum_hours))),
      deposit_amount = greatest(0,coalesce(nullif(p_vehicle->>'deposit_amount','')::numeric,deposit_amount)),
      mileage_included_per_day = nullif(p_vehicle->>'mileage_included_per_day','')::integer,
      extra_mile_rate = greatest(0,coalesce(nullif(p_vehicle->>'extra_mile_rate','')::numeric,extra_mile_rate)),
      status = coalesce(nullif(p_vehicle->>'status',''),status),
      is_active = coalesce((p_vehicle->>'is_active')::boolean,is_active),
      updated_at = now()
    where id = vehicle_id and merchant_user_id = p_merchant_user_id
    returning * into row;
    if not found then raise exception 'vehicle_not_found'; end if;
  end if;
  return row;
end;
$$;

revoke all on function public.merchant_rental_save_vehicle(uuid,jsonb) from public;
grant execute on function public.merchant_rental_save_vehicle(uuid,jsonb) to authenticated;
