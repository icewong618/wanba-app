-- 乐生活 v5.570：零售订单库存闭环
-- 规则：有库存记录的商品在下单和完成交付时均校验库存；仅完成交付时实际扣减。

alter table public.merchant_retail_orders
  add column if not exists stock_deducted_at timestamptz;

create or replace function public.merchant_retail_public_inventory(p_merchant_user_id uuid)
returns table(product_id text, in_stock boolean)
language sql
security definer
set search_path = public
as $$
  select inventory.product_id,
         (inventory.stock_quantity > 0) as in_stock
  from public.merchant_inventory_items inventory
  join public.merchants merchant on merchant.user_id = inventory.merchant_user_id
  where inventory.merchant_user_id = p_merchant_user_id
    and merchant.verified is true;
$$;

create or replace function public.merchant_retail_order_create(
  p_merchant_user_id uuid,
  p_items jsonb,
  p_customer_name text,
  p_customer_phone text,
  p_customer_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid := auth.uid();
  v_merchant public.merchants%rowtype;
  v_input jsonb;
  v_product jsonb;
  v_inventory public.merchant_inventory_items%rowtype;
  v_product_id text;
  v_quantity integer;
  v_unit_price numeric(10,2);
  v_line_total numeric(10,2);
  v_items jsonb := '[]'::jsonb;
  v_subtotal numeric(10,2) := 0;
  v_item_count integer := 0;
  v_order public.merchant_retail_orders%rowtype;
begin
  if v_customer_id is null then raise exception 'login_required'; end if;
  if p_merchant_user_id is null or p_merchant_user_id = v_customer_id then raise exception 'invalid_merchant'; end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 or jsonb_array_length(p_items) > 50 then raise exception 'invalid_items'; end if;
  if exists (
    select 1
    from jsonb_array_elements(p_items) value
    group by nullif(trim(coalesce(value->>'product_id', value->>'id', '')), '')
    having count(*) > 1
  ) then raise exception 'duplicate_product_items'; end if;
  if char_length(trim(coalesce(p_customer_name,''))) = 0 or char_length(trim(coalesce(p_customer_name,''))) > 80 then raise exception 'invalid_customer_name'; end if;
  if char_length(trim(coalesce(p_customer_phone,''))) = 0 or char_length(trim(coalesce(p_customer_phone,''))) > 40 then raise exception 'invalid_customer_phone'; end if;
  if char_length(coalesce(p_customer_note,'')) > 500 then raise exception 'invalid_customer_note'; end if;

  select * into v_merchant from public.merchants
  where user_id = p_merchant_user_id and verified is true limit 1;
  if not found then raise exception 'merchant_not_available'; end if;

  for v_input in select value from jsonb_array_elements(p_items)
  loop
    v_product_id := nullif(trim(coalesce(v_input->>'product_id', v_input->>'id', '')), '');
    if v_product_id is null then raise exception 'invalid_product'; end if;
    v_quantity := case when coalesce(v_input->>'quantity','') ~ '^[0-9]+$'
      then greatest(1, least(20, (v_input->>'quantity')::integer)) else 1 end;
    select product into v_product from jsonb_array_elements(coalesce(v_merchant.products, '[]'::jsonb)) product
    where coalesce(product->>'id','') = v_product_id and coalesce(product->>'active','true') <> 'false' limit 1;
    if v_product is null then raise exception 'product_unavailable'; end if;

    -- 没有建立库存记录的旧商品仍可继续销售；建立库存后必须满足可售数量。
    select * into v_inventory from public.merchant_inventory_items
    where merchant_user_id = p_merchant_user_id and product_id = v_product_id for key share;
    if found and v_inventory.stock_quantity < v_quantity then raise exception 'insufficient_stock'; end if;

    v_unit_price := nullif(regexp_replace(coalesce(v_product->>'price',''), '[^0-9.]', '', 'g'), '')::numeric;
    if v_unit_price is null or v_unit_price < 0 then raise exception 'product_price_unavailable'; end if;
    v_unit_price := round(v_unit_price, 2);
    v_line_total := round(v_unit_price * v_quantity, 2);
    v_items := v_items || jsonb_build_array(jsonb_build_object(
      'product_id', v_product_id, 'name', coalesce(v_product->>'name', v_product->>'title', '商品'),
      'image', coalesce(v_product->>'image', case when jsonb_typeof(v_product->'images') = 'array' then v_product->'images'->>0 else null end),
      'quantity', v_quantity, 'unit_price', v_unit_price, 'line_total', v_line_total
    ));
    v_item_count := v_item_count + v_quantity;
    v_subtotal := v_subtotal + v_line_total;
  end loop;

  insert into public.merchant_retail_orders (
    merchant_user_id, customer_user_id, customer_name, customer_phone, customer_note,
    order_code, items, item_count, subtotal
  ) values (
    p_merchant_user_id, v_customer_id, trim(p_customer_name), trim(p_customer_phone), nullif(trim(coalesce(p_customer_note,'')), ''),
    'LSR-' || to_char(now() at time zone 'America/Los_Angeles', 'YYMMDD') || '-' || upper(substr(md5(gen_random_uuid()::text), 1, 6)),
    v_items, v_item_count, round(v_subtotal, 2)
  ) returning * into v_order;

  insert into public.messages (from_id, from_name, to_id, text) values (
    v_customer_id, trim(p_customer_name), p_merchant_user_id,
    '【零售自取订单 ' || v_order.order_code || '】商品合计 $' || to_char(v_order.subtotal, 'FM999999990.00') ||
    E'\n联系人：' || trim(p_customer_name) || E'\n电话：' || trim(p_customer_phone) ||
    case when v_order.customer_note is not null then E'\n备注：' || v_order.customer_note else '' end ||
    E'\n请确认库存并安排自取时间。'
  );
  return to_jsonb(v_order);
end;
$$;

create or replace function public.merchant_retail_order_update(
  p_order_id uuid,
  p_status text,
  p_pickup_at timestamptz default null,
  p_merchant_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor uuid := auth.uid();
  v_order public.merchant_retail_orders%rowtype;
  v_item jsonb;
  v_inventory public.merchant_inventory_items%rowtype;
  v_product_id text;
  v_quantity integer;
  v_before integer;
  v_name text;
  v_status_text text;
begin
  if v_actor is null then raise exception 'login_required'; end if;
  if p_status not in ('confirmed','preparing','ready_for_pickup','completed','cancelled') then raise exception 'invalid_status'; end if;
  if char_length(coalesce(p_merchant_note,'')) > 500 then raise exception 'invalid_merchant_note'; end if;
  select * into v_order from public.merchant_retail_orders where id = p_order_id for update;
  if not found or v_order.merchant_user_id <> v_actor then raise exception 'order_not_found'; end if;
  if v_order.status in ('completed','cancelled') then raise exception 'order_already_closed'; end if;

  if p_status = 'completed' and v_order.stock_deducted_at is null then
    for v_item in select value from jsonb_array_elements(v_order.items)
    loop
      v_product_id := nullif(v_item->>'product_id','');
      v_quantity := greatest(1, coalesce((v_item->>'quantity')::integer, 1));
      select * into v_inventory from public.merchant_inventory_items
      where merchant_user_id = v_actor and product_id = v_product_id for update;
      if found then
        if v_inventory.stock_quantity < v_quantity then raise exception 'insufficient_stock_at_completion'; end if;
        v_before := v_inventory.stock_quantity;
        update public.merchant_inventory_items set stock_quantity = v_before - v_quantity
        where id = v_inventory.id;
        insert into public.merchant_inventory_movements
          (inventory_item_id, merchant_user_id, product_id, movement_type, quantity_change, quantity_before, quantity_after, note)
        values
          (v_inventory.id, v_actor, v_product_id, 'issue', -v_quantity, v_before, v_before - v_quantity,
           '零售订单 ' || v_order.order_code || ' 完成交付');
      end if;
    end loop;
  end if;

  update public.merchant_retail_orders
  set status = p_status,
      pickup_at = case when p_pickup_at is not null then p_pickup_at else pickup_at end,
      merchant_note = nullif(trim(coalesce(p_merchant_note, merchant_note, '')), ''),
      confirmed_at = case when p_status = 'confirmed' then now() else confirmed_at end,
      completed_at = case when p_status = 'completed' then now() else completed_at end,
      cancelled_at = case when p_status = 'cancelled' then now() else cancelled_at end,
      stock_deducted_at = case when p_status = 'completed' and stock_deducted_at is null then now() else stock_deducted_at end
  where id = p_order_id returning * into v_order;

  select coalesce(nullif(trim(business_name),''),'商家') into v_name from public.merchants where user_id = v_actor limit 1;
  v_status_text := case p_status when 'confirmed' then '已确认订单' when 'preparing' then '正在备货' when 'ready_for_pickup' then '已备好，可到店自取' when 'completed' then '订单已完成' when 'cancelled' then '订单已取消' end;
  insert into public.messages (from_id, from_name, to_id, text) values (
    v_actor, v_name, v_order.customer_user_id,
    '【零售自取订单 ' || v_order.order_code || '】' || v_status_text ||
    case when v_order.pickup_at is not null then E'\n自取时间：' || to_char(v_order.pickup_at at time zone 'America/Los_Angeles', 'YYYY-MM-DD HH24:MI') else '' end ||
    case when v_order.merchant_note is not null then E'\n商家留言：' || v_order.merchant_note else '' end
  );
  return to_jsonb(v_order);
end;
$$;

revoke all on function public.merchant_retail_public_inventory(uuid) from public;
grant execute on function public.merchant_retail_public_inventory(uuid) to anon, authenticated;
revoke all on function public.merchant_retail_order_create(uuid, jsonb, text, text, text) from public, anon;
revoke all on function public.merchant_retail_order_update(uuid, text, timestamptz, text) from public, anon;
grant execute on function public.merchant_retail_order_create(uuid, jsonb, text, text, text) to authenticated;
grant execute on function public.merchant_retail_order_update(uuid, text, timestamptz, text) to authenticated;
