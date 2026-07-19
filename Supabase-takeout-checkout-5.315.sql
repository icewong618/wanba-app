-- 乐生活 v5.315：外卖订单详情、预计时间、小费和优惠报价。
-- 正式支付接入后仍需在收款时再次核算优惠券与金额。

alter table public.merchant_orders
  add column if not exists customer_note text not null default '',
  add column if not exists estimated_at timestamptz,
  add column if not exists requested_payment_method text,
  add column if not exists tip_amount numeric(10,2) not null default 0 check (tip_amount >= 0),
  add column if not exists quoted_discount_amount numeric(10,2) not null default 0 check (quoted_discount_amount >= 0),
  add column if not exists coupon_claim_ids jsonb not null default '[]'::jsonb;

create index if not exists merchant_orders_user_takeout_created_idx
  on public.merchant_orders (user_id, merchant_user_id, order_type, created_at desc)
  where order_type = 'takeout';

create or replace function public.merchant_takeout_order_submit(
  p_merchant_user_id uuid,
  p_items jsonb,
  p_customer_name text,
  p_customer_phone text,
  p_fulfillment text,
  p_delivery_address text default '',
  p_delivery_at timestamptz default null,
  p_customer_note text default '',
  p_estimated_at timestamptz default null,
  p_requested_payment_method text default 'card',
  p_tip_amount numeric default 0,
  p_quoted_discount_amount numeric default 0,
  p_coupon_claim_ids jsonb default '[]'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_user_id uuid := auth.uid();
  v_order public.merchant_orders%rowtype;
  v_products jsonb;
  v_item jsonb;
  v_product jsonb;
  v_product_id text;
  v_quantity integer;
  v_unit_price numeric(10,2);
  v_price_label text;
  v_subtotal numeric(10,2) := 0;
  v_count integer := 0;
  v_claim_id bigint;
begin
  if v_user_id is null then raise exception 'merchant_order_login_required'; end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then raise exception 'merchant_order_empty'; end if;
  if coalesce(trim(p_customer_name),'') = '' or coalesce(trim(p_customer_phone),'') = '' then raise exception 'merchant_order_contact_required'; end if;
  if p_fulfillment not in ('pickup','delivery') then raise exception 'merchant_order_invalid_fulfillment'; end if;
  if p_fulfillment = 'delivery' and coalesce(trim(p_delivery_address),'') = '' then raise exception 'merchant_order_delivery_address_required'; end if;
  if coalesce(p_requested_payment_method,'') not in ('apple_pay','google_pay','card','gift_card') then raise exception 'merchant_order_invalid_payment_method'; end if;
  if coalesce(p_tip_amount,0) < 0 or coalesce(p_tip_amount,0) > 10000 then raise exception 'merchant_order_invalid_tip'; end if;
  if jsonb_typeof(coalesce(p_coupon_claim_ids,'[]'::jsonb)) <> 'array' then raise exception 'merchant_order_invalid_coupon'; end if;

  select products into v_products
  from public.merchants
  where user_id = p_merchant_user_id and verified = true;
  if not found then raise exception 'merchant_order_merchant_not_found'; end if;

  for v_claim_id in select value::bigint from jsonb_array_elements_text(coalesce(p_coupon_claim_ids,'[]'::jsonb)) value loop
    if not exists (
      select 1 from public.merchant_coupon_claims
      where id = v_claim_id
        and merchant_user_id = p_merchant_user_id
        and user_id = v_user_id
        and status = 'claimed'
    ) then raise exception 'merchant_order_coupon_invalid'; end if;
  end loop;

  insert into public.merchant_orders (
    merchant_user_id, table_id, table_name, user_id, user_name, order_type, fulfillment,
    customer_name, customer_phone, delivery_address, delivery_at, customer_note, estimated_at,
    requested_payment_method, tip_amount, quoted_discount_amount, coupon_claim_ids, note
  ) values (
    p_merchant_user_id, null,
    case when p_fulfillment = 'delivery' then '送餐上门' else '到店自取' end,
    v_user_id, left(trim(p_customer_name),40), 'takeout', p_fulfillment,
    left(trim(p_customer_name),40), left(trim(p_customer_phone),32),
    case when p_fulfillment = 'delivery' then left(trim(p_delivery_address),240) else null end,
    p_delivery_at, left(coalesce(trim(p_customer_note),''),240), p_estimated_at,
    p_requested_payment_method, greatest(coalesce(p_tip_amount,0),0), 0,
    coalesce(p_coupon_claim_ids,'[]'::jsonb), ''
  ) returning * into v_order;

  for v_item in select value from jsonb_array_elements(p_items) loop
    v_product_id := coalesce(v_item->>'product_id',v_item->>'id','');
    v_quantity := greatest(1,least(99,coalesce(nullif(v_item->>'quantity','')::integer,1)));
    select value into v_product
    from jsonb_array_elements(coalesce(v_products,'[]'::jsonb))
    where value->>'id' = v_product_id
      and coalesce((value->>'active')::boolean,true) = true
      and coalesce((value->>'orderable')::boolean,true) = true
    limit 1;
    if v_product is null then raise exception 'merchant_order_product_unavailable:%', v_product_id; end if;
    v_price_label := coalesce(v_product->>'price','');
    v_unit_price := coalesce(nullif(substring(v_price_label from '([0-9]+([.][0-9]{1,2})?)'),'')::numeric,0);
    insert into public.merchant_order_items (order_id,batch_no,product_id,product_name,product_image,product_categories,unit_price,price_label,quantity)
    values (v_order.id,1,v_product_id,coalesce(v_product->>'name','未命名商品'),nullif(v_product->>'image',''),coalesce(v_product->'categories',jsonb_build_array(coalesce(v_product->>'category','其他'))),v_unit_price,v_price_label,v_quantity);
    v_subtotal := v_subtotal + v_unit_price * v_quantity;
    v_count := v_count + v_quantity;
  end loop;

  update public.merchant_orders
  set subtotal = v_subtotal,
      item_count = v_count,
      quoted_discount_amount = least(greatest(coalesce(p_quoted_discount_amount,0),0), v_subtotal),
      updated_at = now()
  where id = v_order.id;
  return v_order.id;
end;
$$;

revoke all on function public.merchant_takeout_order_submit(uuid,jsonb,text,text,text,text,timestamptz,text,timestamptz,text,numeric,numeric,jsonb) from public;
grant execute on function public.merchant_takeout_order_submit(uuid,jsonb,text,text,text,text,timestamptz,text,timestamptz,text,numeric,numeric,jsonb) to authenticated;

create or replace function public.merchant_takeout_qr_settings_update(
  p_merchant_user_id uuid,
  p_qr_note text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_settings jsonb;
begin
  if auth.uid() is null or not public.merchant_matrix_has_permission(p_merchant_user_id, 'order_manage') then
    raise exception 'not_order_manager';
  end if;
  update public.merchants
  set order_checkout_settings = jsonb_set(coalesce(order_checkout_settings, '{}'::jsonb), '{takeout_qr_note}', to_jsonb(left(coalesce(trim(p_qr_note),''),80)), true),
      updated_at = now()
  where user_id = p_merchant_user_id
  returning order_checkout_settings into v_settings;
  if v_settings is null then raise exception 'merchant_not_found'; end if;
  return v_settings;
end;
$$;

revoke all on function public.merchant_takeout_qr_settings_update(uuid,text) from public;
grant execute on function public.merchant_takeout_qr_settings_update(uuid,text) to authenticated;
