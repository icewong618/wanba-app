-- 乐生活 5.323：租车预约第二版运营能力
-- 付款状态为店内人工登记；真实线上扣款和押金预授权需后续接入支付服务。

alter table public.merchant_rental_bookings
  add column if not exists payment_method text,
  add column if not exists payment_reference text,
  add column if not exists damage_amount numeric(10,2) not null default 0 check (damage_amount >= 0),
  add column if not exists violation_amount numeric(10,2) not null default 0 check (violation_amount >= 0),
  add column if not exists financial_note text;

create or replace function public.merchant_rental_update_financials(
  p_booking_id uuid,
  p_member_discount_amount numeric default 0,
  p_coupon_discount_amount numeric default 0,
  p_damage_amount numeric default 0,
  p_violation_amount numeric default 0,
  p_payment_status text default null,
  p_deposit_status text default null,
  p_payment_method text default null,
  p_financial_note text default null
)
returns public.merchant_rental_bookings language plpgsql security definer set search_path = public, pg_temp as $$
declare booking public.merchant_rental_bookings%rowtype; member_discount numeric := greatest(0,coalesce(p_member_discount_amount,0)); coupon_discount numeric := greatest(0,coalesce(p_coupon_discount_amount,0)); damage numeric := greatest(0,coalesce(p_damage_amount,0)); violation numeric := greatest(0,coalesce(p_violation_amount,0)); next_total numeric;
begin
  select * into booking from public.merchant_rental_bookings where id = p_booking_id for update;
  if not found or not public.merchant_rental_can_manage(booking.merchant_user_id) then raise exception 'rental_not_allowed'; end if;
  if p_payment_status is not null and p_payment_status not in ('pending','paid','refunded','partial_refund','waived') then raise exception 'invalid_payment_status'; end if;
  if p_deposit_status is not null and p_deposit_status not in ('not_collected','authorized','collected','released','forfeited','refunded') then raise exception 'invalid_deposit_status'; end if;
  next_total := greatest(0, booking.base_amount - member_discount - coupon_discount + damage + violation);
  update public.merchant_rental_bookings
  set member_discount_amount=member_discount,
      coupon_discount_amount=coupon_discount,
      damage_amount=damage,
      violation_amount=violation,
      total_amount=next_total,
      payment_status=coalesce(nullif(p_payment_status,''),payment_status),
      deposit_status=coalesce(nullif(p_deposit_status,''),deposit_status),
      payment_method=nullif(trim(coalesce(p_payment_method,'')),''),
      financial_note=nullif(trim(coalesce(p_financial_note,'')),''),
      updated_at=now()
  where id=booking.id returning * into booking;
  return booking;
end;
$$;

create or replace function public.merchant_rental_extend_booking(
  p_booking_id uuid, p_ends_at timestamptz, p_note text default null
)
returns public.merchant_rental_bookings language plpgsql security definer set search_path = public, pg_temp as $$
declare booking public.merchant_rental_bookings%rowtype; vehicle public.merchant_rental_vehicles%rowtype; hours numeric; units integer; mode text; base numeric;
begin
  select * into booking from public.merchant_rental_bookings where id=p_booking_id for update;
  if not found or not public.merchant_rental_can_manage(booking.merchant_user_id) then raise exception 'rental_not_allowed'; end if;
  select * into vehicle from public.merchant_rental_vehicles where id=booking.vehicle_id for update;
  if p_ends_at is null or p_ends_at <= booking.starts_at or p_ends_at > now() + interval '370 days' then raise exception 'invalid_rental_time'; end if;
  if exists (select 1 from public.merchant_rental_blackouts blackout where blackout.vehicle_id=vehicle.id and blackout.starts_at < p_ends_at and blackout.ends_at > booking.starts_at) then raise exception 'vehicle_blocked'; end if;
  if exists (select 1 from public.merchant_rental_bookings other_booking where other_booking.vehicle_id=vehicle.id and other_booking.id<>booking.id and other_booking.status in ('pending','confirmed','active','overdue') and (other_booking.status <> 'pending' or other_booking.created_at > now() - interval '30 minutes') and other_booking.starts_at < p_ends_at and other_booking.ends_at > booking.starts_at) then raise exception 'vehicle_booking_conflict'; end if;
  hours := extract(epoch from (p_ends_at-booking.starts_at))/3600.0;
  mode := case when vehicle.pricing_mode='hour' then 'hour' when vehicle.pricing_mode='day' then 'day' when hours<24 then 'hour' else 'day' end;
  if mode='hour' then units:=greatest(vehicle.minimum_hours,ceil(hours)::integer); base:=units*vehicle.hourly_rate; else units:=greatest(1,ceil(hours/24.0)::integer); base:=units*vehicle.daily_rate; end if;
  update public.merchant_rental_bookings
  set ends_at=p_ends_at,pricing_mode=mode,unit_count=units,base_amount=round(base,2),total_amount=greatest(0,round(base,2)-member_discount_amount-coupon_discount_amount+damage_amount+violation_amount),operator_note=coalesce(nullif(trim(coalesce(p_note,'')),''),operator_note),extension_requested_end_at=null,updated_at=now()
  where id=booking.id returning * into booking;
  return booking;
end;
$$;

revoke all on function public.merchant_rental_update_financials(uuid,numeric,numeric,numeric,numeric,text,text,text,text) from public;
revoke all on function public.merchant_rental_extend_booking(uuid,timestamptz,text) from public;
grant execute on function public.merchant_rental_update_financials(uuid,numeric,numeric,numeric,numeric,text,text,text,text) to authenticated;
grant execute on function public.merchant_rental_extend_booking(uuid,timestamptz,text) to authenticated;

analyze public.merchant_rental_bookings;
