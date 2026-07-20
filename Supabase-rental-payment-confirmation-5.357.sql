-- 乐生活 5.357：租车先付款后确认、取消退款与商家取消说明

alter table public.merchant_rental_bookings
  add column if not exists refund_amount numeric(10,2) not null default 0 check (refund_amount >= 0),
  add column if not exists refund_reason text,
  add column if not exists cancelled_at timestamptz,
  add column if not exists cancelled_by text check (cancelled_by in ('customer','merchant'));

create or replace function public.merchant_rental_customer_mark_paid(p_booking_id uuid, p_payment_method text)
returns public.merchant_rental_bookings language plpgsql security definer set search_path=public,pg_temp as $$
declare row public.merchant_rental_bookings%rowtype;
begin
  select * into row from public.merchant_rental_bookings where id=p_booking_id for update;
  if not found or row.user_id is distinct from auth.uid() then raise exception 'booking_not_found'; end if;
  if row.status <> 'pending' then raise exception 'booking_payment_unavailable'; end if;
  update public.merchant_rental_bookings
  set payment_status='paid', payment_method=nullif(left(trim(coalesce(p_payment_method,'')),40),''), payment_reference=coalesce(payment_reference,'LSH-PENDING-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,8))), updated_at=now()
  where id=row.id returning * into row;
  return row;
end;
$$;

create or replace function public.merchant_rental_manager_confirm_booking(p_booking_id uuid, p_note text default null)
returns public.merchant_rental_bookings language plpgsql security definer set search_path=public,pg_temp as $$
declare row public.merchant_rental_bookings%rowtype;
begin
  select * into row from public.merchant_rental_bookings where id=p_booking_id for update;
  if not found or not public.merchant_rental_can_manage(row.merchant_user_id) then raise exception 'rental_not_allowed'; end if;
  if row.status not in ('pending','confirmed') then raise exception 'booking_cannot_be_confirmed'; end if;
  if row.payment_status <> 'paid' then raise exception 'payment_required'; end if;
  update public.merchant_rental_bookings set status='confirmed',confirmed_at=coalesce(confirmed_at,now()),operator_note=coalesce(nullif(trim(coalesce(p_note,'')),''),operator_note),updated_at=now() where id=row.id returning * into row;
  return row;
end;
$$;

create or replace function public.merchant_rental_customer_cancel_booking(p_booking_id uuid)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare row public.merchant_rental_bookings%rowtype; eligible boolean;
begin
  select * into row from public.merchant_rental_bookings where id=p_booking_id for update;
  if not found or row.user_id is distinct from auth.uid() then raise exception 'booking_not_found'; end if;
  if row.status not in ('pending','confirmed') then raise exception 'booking_cannot_be_cancelled'; end if;
  eligible:=row.starts_at >= now()+interval '48 hours';
  update public.merchant_rental_bookings set
    status='cancelled',cancelled_at=now(),cancelled_by='customer',
    refund_amount=case when eligible and payment_status='paid' then total_amount else 0 end,
    refund_reason=case when eligible and payment_status='paid' then '客户在取车前 48 小时以上取消，符合退款条件。' else '客户取消预约；取车前不足 48 小时或尚未完成支付，不自动退款。' end,
    payment_status=case when eligible and payment_status='paid' then 'refunded' else payment_status end,
    operator_note=coalesce(operator_note,'客户已取消预约'),updated_at=now()
  where id=row.id returning * into row;
  return jsonb_build_object('id',row.id,'booking_code',row.booking_code,'status',row.status,'payment_status',row.payment_status,'refund_amount',row.refund_amount,'refund_reason',row.refund_reason);
end;
$$;

create or replace function public.merchant_rental_manager_cancel_booking(p_booking_id uuid, p_reason text)
returns public.merchant_rental_bookings language plpgsql security definer set search_path=public,pg_temp as $$
declare row public.merchant_rental_bookings%rowtype; reason text:=left(trim(coalesce(p_reason,'')),800);
begin
  select * into row from public.merchant_rental_bookings where id=p_booking_id for update;
  if not found or not public.merchant_rental_can_manage(row.merchant_user_id) then raise exception 'rental_not_allowed'; end if;
  if row.status not in ('pending','confirmed') then raise exception 'booking_cannot_be_cancelled'; end if;
  if length(reason)=0 then raise exception 'cancel_reason_required'; end if;
  update public.merchant_rental_bookings set
    status='cancelled',cancelled_at=now(),cancelled_by='merchant',
    refund_amount=case when payment_status='paid' then total_amount else 0 end,
    refund_reason=case when payment_status='paid' then reason else reason || '（尚未完成支付，无需退款）' end,
    payment_status=case when payment_status='paid' then 'refunded' else payment_status end,
    operator_note=reason,updated_at=now()
  where id=row.id returning * into row;
  return row;
end;
$$;

grant execute on function public.merchant_rental_customer_mark_paid(uuid,text) to authenticated;
grant execute on function public.merchant_rental_customer_cancel_booking(uuid) to authenticated;
grant execute on function public.merchant_rental_manager_confirm_booking(uuid,text) to authenticated;
grant execute on function public.merchant_rental_manager_cancel_booking(uuid,text) to authenticated;
