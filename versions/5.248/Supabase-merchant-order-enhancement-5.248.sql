-- 乐生活 v5.248：扫码点餐增强
-- 菜品可逐项标记上桌；结算设置存于商家资料。

alter table public.merchant_order_items
  add column if not exists is_served boolean not null default false,
  add column if not exists served_at timestamptz;

alter table public.merchants
  add column if not exists order_checkout_settings jsonb not null
  default '{"coupon_mode":"single","tip_options":[15,18,20]}'::jsonb;

create index if not exists merchant_order_items_order_served_idx
  on public.merchant_order_items (order_id, is_served, batch_no, created_at);

create or replace function public.merchant_order_set_item_served(
  p_item_id bigint,
  p_is_served boolean
)
returns public.merchant_order_items
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_item public.merchant_order_items%rowtype;
  v_order public.merchant_orders%rowtype;
  v_all_served boolean;
begin
  select * into v_item
  from public.merchant_order_items
  where id = p_item_id
  for update;

  if not found then
    raise exception 'merchant_order_not_found';
  end if;

  select * into v_order
  from public.merchant_orders
  where id = v_item.order_id
  for update;

  if not found or not public.merchant_order_can_manage(v_order.merchant_user_id) then
    raise exception 'merchant_order_not_allowed';
  end if;

  if v_order.status not in ('confirmed', 'preparing', 'served') then
    raise exception 'merchant_order_not_ready';
  end if;

  update public.merchant_order_items
  set is_served = p_is_served,
      served_at = case when p_is_served then now() else null end
  where id = p_item_id
  returning * into v_item;

  select coalesce(bool_and(is_served), false) into v_all_served
  from public.merchant_order_items
  where order_id = v_order.id;

  update public.merchant_orders
  set status = case
        when v_all_served then 'served'
        when status = 'served' then 'preparing'
        else status
      end,
      updated_at = now()
  where id = v_order.id;

  return v_item;
end;
$$;

revoke all on function public.merchant_order_set_item_served(bigint, boolean) from public;
grant execute on function public.merchant_order_set_item_served(bigint, boolean) to authenticated;
