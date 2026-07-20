-- 乐生活 5.360：租车车队运营看板
-- 车辆状态仍由商家管理；租用中状态由有效预约实时计算，不可手动覆盖。

create or replace function public.merchant_rental_manager_list(p_merchant_user_id uuid)
returns jsonb language sql stable security definer set search_path=public,pg_temp as $$
  with managed as (
    select public.merchant_rental_can_manage(p_merchant_user_id) as allowed
  ), vehicle_rows as (
    select
      to_jsonb(v)
      || jsonb_build_object(
        'addons', coalesce((
          select jsonb_agg(to_jsonb(s))
          from public.merchant_rental_vehicle_services vs
          join public.merchant_rental_services s on s.id=vs.service_id
          where vs.vehicle_id=v.id
        ), '[]'::jsonb),
        'luggage_count', coalesce(extra.luggage_count,2),
        'active_booking', coalesce((
          select jsonb_build_object('id',b.id,'booking_code',b.booking_code,'customer_name',b.customer_name,'starts_at',b.starts_at,'ends_at',b.ends_at,'status',b.status)
          from public.merchant_rental_bookings b
          where b.vehicle_id=v.id and b.status in ('active','overdue')
          order by b.starts_at asc limit 1
        ), 'null'::jsonb),
        'next_booking', coalesce((
          select jsonb_build_object('id',b.id,'booking_code',b.booking_code,'customer_name',b.customer_name,'starts_at',b.starts_at,'ends_at',b.ends_at,'status',b.status)
          from public.merchant_rental_bookings b
          where b.vehicle_id=v.id and b.status in ('pending','confirmed') and b.ends_at >= now()
          order by b.starts_at asc limit 1
        ), 'null'::jsonb)
      ) as row
    from public.merchant_rental_vehicles v
    left join public.merchant_rental_vehicle_addons extra on extra.vehicle_id=v.id
    where v.merchant_user_id=p_merchant_user_id
  )
  select jsonb_build_object(
    'vehicles', coalesce((select jsonb_agg(row order by coalesce(row->>'updated_at','') desc) from vehicle_rows), '[]'::jsonb),
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
    ), '{}'::jsonb),
    'fleet_stats', coalesce((
      select jsonb_build_object(
        'total_count',count(*),
        'available_count',count(*) filter(where v.status='available' and not exists(select 1 from public.merchant_rental_bookings b where b.vehicle_id=v.id and b.status in ('active','overdue'))),
        'rented_count',count(*) filter(where exists(select 1 from public.merchant_rental_bookings b where b.vehicle_id=v.id and b.status in ('active','overdue'))),
        'cleaning_count',count(*) filter(where v.status='cleaning'),
        'maintenance_count',count(*) filter(where v.status='maintenance'),
        'inactive_count',count(*) filter(where v.status='inactive')
      ) from public.merchant_rental_vehicles v where v.merchant_user_id=p_merchant_user_id
    ), '{}'::jsonb)
  )
  from managed where allowed;
$$;

create or replace function public.merchant_rental_manager_set_vehicle_status(p_vehicle_id uuid, p_status text)
returns public.merchant_rental_vehicles language plpgsql security definer set search_path=public,pg_temp as $$
declare row public.merchant_rental_vehicles%rowtype;
begin
  if p_status not in ('available','cleaning','maintenance','inactive') then
    raise exception 'invalid_vehicle_status';
  end if;
  select * into row from public.merchant_rental_vehicles where id=p_vehicle_id for update;
  if not found or not public.merchant_rental_can_manage(row.merchant_user_id) then
    raise exception 'rental_not_allowed';
  end if;
  if exists(select 1 from public.merchant_rental_bookings b where b.vehicle_id=row.id and b.status in ('active','overdue')) then
    raise exception 'vehicle_currently_rented';
  end if;
  update public.merchant_rental_vehicles
  set status=p_status, updated_at=now()
  where id=row.id
  returning * into row;
  return row;
end;
$$;

grant execute on function public.merchant_rental_manager_list(uuid) to authenticated;
grant execute on function public.merchant_rental_manager_set_vehicle_status(uuid,text) to authenticated;
