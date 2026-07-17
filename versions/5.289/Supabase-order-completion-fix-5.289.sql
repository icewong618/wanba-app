-- 乐生活 v5.289：已收款订单在全部菜品上桌后必须进入已完成。

-- 校正旧版本留下的状态：已付款、全部上桌但仍停在“已上桌”的订单。
update public.merchant_orders o
set status = 'completed',
    completed_at = coalesce(o.completed_at, now()),
    updated_at = now()
where o.payment_status = 'paid'
  and o.status <> 'cancelled'
  and exists (
    select 1 from public.merchant_order_items i
    where i.order_id = o.id
  )
  and not exists (
    select 1 from public.merchant_order_items i
    where i.order_id = o.id
      and not coalesce(i.is_served, false)
  );

-- 防止旧界面或并发操作把已收款、已全部上桌的订单重新写回“已上桌”。
create or replace function public.merchant_order_set_status(p_order_id uuid, p_status text)
returns public.merchant_orders
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_order public.merchant_orders%rowtype;
  v_remaining_count integer;
  v_target_status text;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  if p_status not in ('pending','confirmed','preparing','reminded','served','completed','cancelled') then
    raise exception 'merchant_order_invalid_status';
  end if;

  select * into v_order
  from public.merchant_orders
  where id = p_order_id
  for update;

  if not found or not public.merchant_matrix_has_permission(v_order.merchant_user_id, 'order_manage') then
    raise exception 'merchant_order_not_allowed';
  end if;

  select count(*) into v_remaining_count
  from public.merchant_order_items
  where order_id = p_order_id
    and not coalesce(is_served, false);

  v_target_status := case
    when p_status <> 'cancelled'
      and v_order.payment_status = 'paid'
      and v_remaining_count = 0
    then 'completed'
    else p_status
  end;

  update public.merchant_orders
  set status = v_target_status,
      updated_at = now(),
      confirmed_at = case when v_target_status = 'confirmed' then now() else confirmed_at end,
      completed_at = case when v_target_status = 'completed' then coalesce(completed_at, now()) else completed_at end,
      cancelled_at = case when v_target_status = 'cancelled' then now() else cancelled_at end
  where id = p_order_id
  returning * into v_order;

  return v_order;
end;
$$;

revoke all on function public.merchant_order_set_status(uuid, text) from public;
grant execute on function public.merchant_order_set_status(uuid, text) to authenticated;
