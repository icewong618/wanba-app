-- 乐生活 5.361：租车交车 / 还车记录

create table if not exists public.merchant_rental_handover_records (
  booking_id uuid primary key references public.merchant_rental_bookings(id) on delete cascade,
  merchant_user_id uuid not null references auth.users(id) on delete cascade,
  checkout_at timestamptz,
  checkout_mileage integer check (checkout_mileage is null or checkout_mileage >= 0),
  checkout_fuel_percent integer check (checkout_fuel_percent is null or checkout_fuel_percent between 0 and 100),
  checkout_note text,
  checkout_photos jsonb not null default '[]'::jsonb check (jsonb_typeof(checkout_photos) = 'array'),
  checked_out_by uuid references auth.users(id) on delete set null,
  return_at timestamptz,
  return_mileage integer check (return_mileage is null or return_mileage >= 0),
  return_fuel_percent integer check (return_fuel_percent is null or return_fuel_percent between 0 and 100),
  return_condition text check (return_condition is null or return_condition in ('normal','attention','damage')),
  return_note text,
  return_photos jsonb not null default '[]'::jsonb check (jsonb_typeof(return_photos) = 'array'),
  returned_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.merchant_rental_handover_records enable row level security;
revoke all on public.merchant_rental_handover_records from anon, authenticated;

create or replace function public.merchant_rental_manager_handover(
  p_booking_id uuid,
  p_action text,
  p_mileage integer,
  p_fuel_percent integer,
  p_condition text default null,
  p_note text default null,
  p_photos jsonb default '[]'::jsonb
) returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare booking public.merchant_rental_bookings%rowtype;
  record_row public.merchant_rental_handover_records%rowtype;
  clean_photos jsonb := '[]'::jsonb;
begin
  if p_action not in ('checkout','return') then raise exception 'invalid_handover_action'; end if;
  if p_mileage is null or p_mileage < 0 then raise exception 'mileage_required'; end if;
  if p_fuel_percent is null or p_fuel_percent not in (0,25,50,75,100) then raise exception 'fuel_level_required'; end if;
  if jsonb_typeof(coalesce(p_photos,'[]'::jsonb)) <> 'array' then raise exception 'invalid_photos'; end if;
  select coalesce(jsonb_agg(to_jsonb(left(trim(value),500))), '[]'::jsonb) into clean_photos
  from jsonb_array_elements_text(coalesce(p_photos,'[]'::jsonb)) value
  where length(trim(value)) > 0;

  select * into booking from public.merchant_rental_bookings where id=p_booking_id for update;
  if not found or not public.merchant_rental_can_manage(booking.merchant_user_id) then raise exception 'rental_not_allowed'; end if;

  if p_action='checkout' then
    if booking.status <> 'confirmed' then raise exception 'booking_not_ready_for_checkout'; end if;
    if booking.payment_status <> 'paid' then raise exception 'payment_required'; end if;
    insert into public.merchant_rental_handover_records(
      booking_id,merchant_user_id,checkout_at,checkout_mileage,checkout_fuel_percent,checkout_note,checkout_photos,checked_out_by,updated_at
    ) values(
      booking.id,booking.merchant_user_id,now(),p_mileage,p_fuel_percent,nullif(left(trim(coalesce(p_note,'')),1000),''),clean_photos,auth.uid(),now()
    ) on conflict (booking_id) do update set
      checkout_at=excluded.checkout_at,checkout_mileage=excluded.checkout_mileage,checkout_fuel_percent=excluded.checkout_fuel_percent,
      checkout_note=excluded.checkout_note,checkout_photos=excluded.checkout_photos,checked_out_by=excluded.checked_out_by,updated_at=now()
    returning * into record_row;
    update public.merchant_rental_bookings set status='active',updated_at=now() where id=booking.id returning * into booking;
  else
    if booking.status not in ('active','overdue') then raise exception 'booking_not_ready_for_return'; end if;
    select * into record_row from public.merchant_rental_handover_records where booking_id=booking.id for update;
    if not found or record_row.checkout_at is null then raise exception 'checkout_required'; end if;
    if p_mileage < coalesce(record_row.checkout_mileage,0) then raise exception 'return_mileage_invalid'; end if;
    update public.merchant_rental_handover_records set
      return_at=now(),return_mileage=p_mileage,return_fuel_percent=p_fuel_percent,
      return_condition=case when p_condition in ('attention','damage') then p_condition else 'normal' end,
      return_note=nullif(left(trim(coalesce(p_note,'')),1000),''),return_photos=clean_photos,returned_by=auth.uid(),updated_at=now()
    where booking_id=booking.id returning * into record_row;
    update public.merchant_rental_bookings set status='returned',updated_at=now() where id=booking.id returning * into booking;
    update public.merchant_rental_vehicles set status='cleaning',updated_at=now() where id=booking.vehicle_id;
  end if;

  return jsonb_build_object('booking_id',booking.id,'status',booking.status,'handover',to_jsonb(record_row));
end;
$$;

create or replace function public.merchant_rental_manager_list(p_merchant_user_id uuid)
returns jsonb language sql stable security definer set search_path=public,pg_temp as $$
  with managed as (
    select public.merchant_rental_can_manage(p_merchant_user_id) as allowed
  ), vehicle_rows as (
    select to_jsonb(v) || jsonb_build_object(
      'addons',coalesce((select jsonb_agg(to_jsonb(s)) from public.merchant_rental_vehicle_services vs join public.merchant_rental_services s on s.id=vs.service_id where vs.vehicle_id=v.id),'[]'::jsonb),
      'luggage_count',coalesce(extra.luggage_count,2),
      'active_booking',coalesce((select jsonb_build_object('id',b.id,'booking_code',b.booking_code,'customer_name',b.customer_name,'starts_at',b.starts_at,'ends_at',b.ends_at,'status',b.status) from public.merchant_rental_bookings b where b.vehicle_id=v.id and b.status in ('active','overdue') order by b.starts_at asc limit 1),'null'::jsonb),
      'next_booking',coalesce((select jsonb_build_object('id',b.id,'booking_code',b.booking_code,'customer_name',b.customer_name,'starts_at',b.starts_at,'ends_at',b.ends_at,'status',b.status) from public.merchant_rental_bookings b where b.vehicle_id=v.id and b.status in ('pending','confirmed') and b.ends_at>=now() order by b.starts_at asc limit 1),'null'::jsonb)
    ) as row
    from public.merchant_rental_vehicles v left join public.merchant_rental_vehicle_addons extra on extra.vehicle_id=v.id
    where v.merchant_user_id=p_merchant_user_id
  )
  select jsonb_build_object(
    'vehicles',coalesce((select jsonb_agg(row order by coalesce(row->>'updated_at','') desc) from vehicle_rows),'[]'::jsonb),
    'services',coalesce((select jsonb_agg(to_jsonb(s) order by s.service_type,s.updated_at desc) from public.merchant_rental_services s where s.merchant_user_id=p_merchant_user_id),'[]'::jsonb),
    'bookings',coalesce((select jsonb_agg(to_jsonb(b) || jsonb_build_object(
      'vehicle',jsonb_build_object('id',v.id,'name',v.name,'make',v.make,'model',v.model,'year',v.year,'photos',v.photos,'pickup_address',v.pickup_address),
      'customer',jsonb_build_object('name',coalesce(p.name,b.customer_name),'avatar',p.avatar),
      'handover',coalesce(to_jsonb(h),'null'::jsonb)
    ) order by case when b.status='pending' then 0 when b.status='confirmed' then 1 when b.status in ('active','overdue') then 2 else 3 end,b.starts_at asc)
    from public.merchant_rental_bookings b join public.merchant_rental_vehicles v on v.id=b.vehicle_id left join public.profiles p on p.user_id=b.user_id left join public.merchant_rental_handover_records h on h.booking_id=b.id where b.merchant_user_id=p_merchant_user_id),'[]'::jsonb),
    'stats',coalesce((select jsonb_build_object('pending_count',count(*) filter(where status='pending'),'confirmed_count',count(*) filter(where status='confirmed'),'active_count',count(*) filter(where status in ('active','overdue')),'completed_count',count(*) filter(where status='returned'),'booking_total',coalesce(sum(total_amount) filter(where status not in ('cancelled','rejected')),0),'paid_total',coalesce(sum(total_amount) filter(where payment_status='paid'),0),'discount_total',coalesce(sum(member_discount_amount+coupon_discount_amount),0),'damage_total',coalesce(sum(damage_amount),0),'violation_total',coalesce(sum(violation_amount),0)) from public.merchant_rental_bookings where merchant_user_id=p_merchant_user_id),'{}'::jsonb),
    'fleet_stats',coalesce((select jsonb_build_object('total_count',count(*),'available_count',count(*) filter(where v.status='available' and not exists(select 1 from public.merchant_rental_bookings b where b.vehicle_id=v.id and b.status in ('active','overdue'))),'rented_count',count(*) filter(where exists(select 1 from public.merchant_rental_bookings b where b.vehicle_id=v.id and b.status in ('active','overdue'))),'cleaning_count',count(*) filter(where v.status='cleaning'),'maintenance_count',count(*) filter(where v.status='maintenance'),'inactive_count',count(*) filter(where v.status='inactive')) from public.merchant_rental_vehicles v where v.merchant_user_id=p_merchant_user_id),'{}'::jsonb)
  ) from managed where allowed;
$$;

create or replace function public.merchant_rental_customer_bookings()
returns jsonb language sql stable security definer set search_path=public,pg_temp as $$
  select coalesce(jsonb_agg(to_jsonb(b) || jsonb_build_object(
    'vehicle',jsonb_build_object('id',v.id,'name',v.name,'make',v.make,'model',v.model,'year',v.year,'photos',v.photos,'pickup_address',v.pickup_address,'seats',v.seats,'transmission',v.transmission,'fuel_type',v.fuel_type),
    'merchant',jsonb_build_object('user_id',m.user_id,'business_name',m.business_name,'logo',m.logo,'address',m.address,'phone',m.phone,'slug',m.slug),
    'handover',coalesce(jsonb_build_object('checkout_at',h.checkout_at,'checkout_mileage',h.checkout_mileage,'checkout_fuel_percent',h.checkout_fuel_percent,'return_at',h.return_at,'return_mileage',h.return_mileage,'return_fuel_percent',h.return_fuel_percent,'return_condition',h.return_condition),'null'::jsonb)
  ) order by b.starts_at desc),'[]'::jsonb)
  from public.merchant_rental_bookings b join public.merchant_rental_vehicles v on v.id=b.vehicle_id join public.merchants m on m.user_id=b.merchant_user_id left join public.merchant_rental_handover_records h on h.booking_id=b.id
  where b.user_id=auth.uid();
$$;

grant execute on function public.merchant_rental_manager_handover(uuid,text,integer,integer,text,text,jsonb) to authenticated;
grant execute on function public.merchant_rental_manager_list(uuid) to authenticated;
grant execute on function public.merchant_rental_customer_bookings() to authenticated;
