-- 乐生活 5.355：租车商家第二版运营工作台

create or replace function public.merchant_rental_manager_list(p_merchant_user_id uuid)
returns jsonb language sql stable security definer set search_path=public,pg_temp as $$
  select jsonb_build_object(
    'vehicles', coalesce((
      select jsonb_agg(
        to_jsonb(v) || jsonb_build_object(
          'addons', coalesce((
            select jsonb_agg(to_jsonb(s))
            from public.merchant_rental_vehicle_services vs
            join public.merchant_rental_services s on s.id=vs.service_id
            where vs.vehicle_id=v.id
          ), '[]'::jsonb),
          'luggage_count', coalesce(extra.luggage_count,2)
        ) order by v.updated_at desc
      )
      from public.merchant_rental_vehicles v
      left join public.merchant_rental_vehicle_addons extra on extra.vehicle_id=v.id
      where v.merchant_user_id=p_merchant_user_id
    ), '[]'::jsonb),
    'services', coalesce((select jsonb_agg(to_jsonb(s) order by s.service_type,s.updated_at desc) from public.merchant_rental_services s where s.merchant_user_id=p_merchant_user_id), '[]'::jsonb),
    'bookings', coalesce((
      select jsonb_agg(
        to_jsonb(b) || jsonb_build_object(
          'vehicle', jsonb_build_object('id',v.id,'name',v.name,'make',v.make,'model',v.model,'year',v.year,'photos',v.photos,'pickup_address',v.pickup_address),
          'customer', jsonb_build_object('name',coalesce(p.name,b.customer_name),'avatar',p.avatar)
        ) order by case when b.status='pending' then 0 when b.status='confirmed' then 1 else 2 end, b.starts_at asc
      )
      from public.merchant_rental_bookings b
      join public.merchant_rental_vehicles v on v.id=b.vehicle_id
      left join public.profiles p on p.user_id=b.user_id
      where b.merchant_user_id=p_merchant_user_id
    ), '[]'::jsonb),
    'stats', coalesce((
      select jsonb_build_object(
        'pending_count',count(*) filter(where status='pending'),
        'confirmed_count',count(*) filter(where status='confirmed'),
        'active_count',count(*) filter(where status in ('active','overdue')),
        'completed_count',count(*) filter(where status='returned'),
        'booking_total',coalesce(sum(total_amount) filter(where status not in ('cancelled','rejected')),0),
        'paid_total',coalesce(sum(total_amount) filter(where payment_status='paid'),0),
        'discount_total',coalesce(sum(member_discount_amount+coupon_discount_amount),0),
        'damage_total',coalesce(sum(damage_amount),0),
        'violation_total',coalesce(sum(violation_amount),0)
      ) from public.merchant_rental_bookings where merchant_user_id=p_merchant_user_id
    ), '{}'::jsonb)
  ) where public.merchant_rental_can_manage(p_merchant_user_id);
$$;

create or replace function public.merchant_rental_manager_confirm_booking(p_booking_id uuid, p_note text default null)
returns public.merchant_rental_bookings language plpgsql security definer set search_path=public,pg_temp as $$
declare row public.merchant_rental_bookings%rowtype;
begin
  select * into row from public.merchant_rental_bookings where id=p_booking_id for update;
  if not found or not public.merchant_rental_can_manage(row.merchant_user_id) then raise exception 'rental_not_allowed'; end if;
  if row.status not in ('pending','confirmed') then raise exception 'booking_cannot_be_confirmed'; end if;
  update public.merchant_rental_bookings
  set status='confirmed', confirmed_at=coalesce(confirmed_at,now()), operator_note=coalesce(nullif(trim(coalesce(p_note,'')),''),operator_note), updated_at=now()
  where id=row.id returning * into row;
  return row;
end;
$$;

create or replace function public.merchant_rental_manager_save_finance(
  p_booking_id uuid, p_payment_status text, p_deposit_status text, p_payment_method text,
  p_payment_reference text, p_member_discount numeric, p_coupon_discount numeric,
  p_damage_amount numeric, p_violation_amount numeric, p_note text default null
) returns public.merchant_rental_bookings language plpgsql security definer set search_path=public,pg_temp as $$
declare row public.merchant_rental_bookings%rowtype; addon_amount numeric:=0; subtotal numeric:=0;
begin
  select * into row from public.merchant_rental_bookings where id=p_booking_id for update;
  if not found or not public.merchant_rental_can_manage(row.merchant_user_id) then raise exception 'rental_not_allowed'; end if;
  if coalesce(p_payment_status,'pending') not in ('pending','paid','refunded','partial_refund','waived') then raise exception 'invalid_payment_status'; end if;
  if coalesce(p_deposit_status,'not_collected') not in ('not_collected','authorized','collected','released','forfeited','refunded') then raise exception 'invalid_deposit_status'; end if;
  select coalesce(sum(coalesce((item->>'amount')::numeric,(item->>'price')::numeric,0)),0) into addon_amount from jsonb_array_elements(coalesce(row.rental_addons,'[]'::jsonb)) item;
  subtotal:=coalesce(row.base_amount,0)+addon_amount;
  update public.merchant_rental_bookings set
    member_discount_amount=greatest(0,coalesce(p_member_discount,0)),
    coupon_discount_amount=greatest(0,coalesce(p_coupon_discount,0)),
    damage_amount=greatest(0,coalesce(p_damage_amount,0)),
    violation_amount=greatest(0,coalesce(p_violation_amount,0)),
    payment_status=coalesce(p_payment_status,'pending'),
    deposit_status=coalesce(p_deposit_status,'not_collected'),
    payment_method=nullif(left(trim(coalesce(p_payment_method,'')),40),''),
    payment_reference=nullif(left(trim(coalesce(p_payment_reference,'')),120),''),
    financial_note=nullif(left(trim(coalesce(p_note,'')),800),''),
    total_amount=greatest(0,subtotal-greatest(0,coalesce(p_member_discount,0))-greatest(0,coalesce(p_coupon_discount,0))+greatest(0,coalesce(p_damage_amount,0))+greatest(0,coalesce(p_violation_amount,0))),
    updated_at=now()
  where id=row.id returning * into row;
  return row;
end;
$$;

create or replace function public.merchant_rental_manager_reprice_booking(p_booking_id uuid, p_starts_at timestamptz, p_ends_at timestamptz, p_note text default null)
returns public.merchant_rental_bookings language plpgsql security definer set search_path=public,pg_temp as $$
declare row public.merchant_rental_bookings%rowtype; vehicle public.merchant_rental_vehicles%rowtype;
  hours numeric; units integer; mode text; base numeric; addons jsonb; addon_amount numeric; updated_addons jsonb;
begin
  select * into row from public.merchant_rental_bookings where id=p_booking_id for update;
  if not found or not public.merchant_rental_can_manage(row.merchant_user_id) then raise exception 'rental_not_allowed'; end if;
  if row.status in ('cancelled','rejected','returned') then raise exception 'booking_cannot_be_repriced'; end if;
  if p_starts_at is null or p_ends_at is null or p_ends_at<=p_starts_at then raise exception 'invalid_rental_time'; end if;
  select * into vehicle from public.merchant_rental_vehicles where id=row.vehicle_id for update;
  if exists(select 1 from public.merchant_rental_bookings b where b.vehicle_id=row.vehicle_id and b.id<>row.id and b.status in ('pending','confirmed','active','overdue') and b.starts_at<p_ends_at and b.ends_at>p_starts_at) then raise exception 'vehicle_unavailable'; end if;
  hours:=extract(epoch from(p_ends_at-p_starts_at))/3600.0;
  mode:=case when vehicle.pricing_mode='hour' then 'hour' when vehicle.pricing_mode='day' then 'day' when hours<24 then 'hour' else 'day' end;
  if mode='hour' then units:=greatest(vehicle.minimum_hours,ceil(hours)::integer); base:=units*vehicle.hourly_rate; else units:=greatest(1,ceil(hours/24.0)::integer); base:=units*vehicle.daily_rate; end if;
  select coalesce(jsonb_agg(item || jsonb_build_object('amount',round(coalesce((item->>'price')::numeric,0)*case when item->>'unit'='day' then units else 1 end,2))),'[]'::jsonb),coalesce(sum(coalesce((item->>'price')::numeric,0)*case when item->>'unit'='day' then units else 1 end),0)
  into updated_addons,addon_amount from jsonb_array_elements(coalesce(row.rental_addons,'[]'::jsonb)) item;
  update public.merchant_rental_bookings set
    starts_at=p_starts_at,ends_at=p_ends_at,pricing_mode=mode,unit_count=units,base_amount=round(base,2),rental_addons=updated_addons,
    total_amount=greatest(0,round(base+addon_amount-row.member_discount_amount-row.coupon_discount_amount+row.damage_amount+row.violation_amount,2)),
    status=case when row.status='confirmed' then 'pending' else row.status end,
    confirmed_at=case when row.status='confirmed' then null else row.confirmed_at end,
    operator_note=coalesce(nullif(left(trim(coalesce(p_note,'')),800),''),row.operator_note),updated_at=now()
  where id=row.id returning * into row;
  return row;
end;
$$;

grant execute on function public.merchant_rental_manager_list(uuid) to authenticated;
grant execute on function public.merchant_rental_manager_confirm_booking(uuid,text) to authenticated;
grant execute on function public.merchant_rental_manager_save_finance(uuid,text,text,text,text,numeric,numeric,numeric,numeric,text) to authenticated;
grant execute on function public.merchant_rental_manager_reprice_booking(uuid,timestamptz,timestamptz,text) to authenticated;
