-- 乐生活 v5.590：票务活动删除
-- 无有效订单的活动会彻底删除；已有已付款、免费或已出票记录的活动仅停止售票，保留订单和核销凭据。

create or replace function public.merchant_ticket_delete_event(
  p_merchant_user_id uuid,
  p_event_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  v_event public.merchant_ticket_events%rowtype;
  v_has_protected_records boolean := false;
begin
  if not public.merchant_tickets_can_manage(p_merchant_user_id) then
    raise exception 'not_authorized';
  end if;

  select * into v_event
  from public.merchant_ticket_events
  where id = p_event_id
    and merchant_user_id = p_merchant_user_id
  for update;

  if not found then
    raise exception 'event_not_found';
  end if;

  select exists (
    select 1
    from public.merchant_ticket_orders o
    where o.event_id = v_event.id
      and o.payment_status in ('free', 'processing', 'paid', 'refunded')
    union all
    select 1
    from public.merchant_tickets t
    where t.event_id = v_event.id
      and t.status in ('issued', 'redeemed', 'refunded')
  ) into v_has_protected_records;

  if v_has_protected_records then
    update public.merchant_ticket_events
    set status = 'cancelled', updated_at = now()
    where id = v_event.id;

    update public.merchant_ticket_types
    set is_active = false, updated_at = now()
    where event_id = v_event.id;

    update public.merchant_ticket_seats
    set status = 'available', hold_order_id = null, hold_expires_at = null, updated_at = now()
    where event_id = v_event.id
      and status = 'held';

    update public.merchant_ticket_orders
    set payment_status = 'cancelled', updated_at = now()
    where event_id = v_event.id
      and payment_status in ('pending_payment', 'failed');

    return jsonb_build_object('ok', true, 'mode', 'cancelled', 'id', v_event.id);
  end if;

  delete from public.merchant_ticket_orders
  where event_id = v_event.id
    and payment_status in ('pending_payment', 'failed', 'cancelled');

  delete from public.merchant_ticket_events
  where id = v_event.id
    and merchant_user_id = p_merchant_user_id;

  return jsonb_build_object('ok', true, 'mode', 'deleted', 'id', v_event.id);
end;
$$;

revoke all on function public.merchant_ticket_delete_event(uuid, uuid) from public, anon, authenticated;
grant execute on function public.merchant_ticket_delete_event(uuid, uuid) to authenticated;
