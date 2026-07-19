-- 乐生活 v5.318：游客浏览器扫码点餐。
-- 游客仅可创建餐桌订单，不能领取或使用会员优惠券。

alter table public.merchant_orders alter column user_id drop not null;

create or replace function public.merchant_dinein_guest_context(
  p_merchant_slug text,
  p_table_code text
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_merchant public.merchants%rowtype;
  v_table public.merchant_order_tables%rowtype;
begin
  select * into v_merchant from public.merchants
  where slug = lower(trim(p_merchant_slug)) and verified = true;
  if not found then raise exception 'merchant_order_merchant_not_found'; end if;
  select * into v_table from public.merchant_order_tables
  where merchant_user_id = v_merchant.user_id and table_code = lower(trim(p_table_code)) and is_active = true;
  if not found then raise exception 'merchant_order_table_not_found'; end if;
  return jsonb_build_object('merchant_user_id',v_merchant.user_id,'table_name',v_table.table_name,'table_code',v_table.table_code);
end;
$$;

create or replace function public.merchant_dinein_guest_order_create(
  p_merchant_user_id uuid,
  p_table_code text,
  p_items jsonb,
  p_note text default ''
)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_user_id uuid := auth.uid();
  v_table public.merchant_order_tables%rowtype;
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
  v_name text := '扫码顾客';
begin
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 or jsonb_array_length(p_items) > 80 then
    raise exception 'merchant_order_empty';
  end if;
  select * into v_table from public.merchant_order_tables
  where merchant_user_id = p_merchant_user_id and table_code = lower(trim(p_table_code)) and is_active = true;
  if not found then raise exception 'merchant_order_table_not_found'; end if;
  select products into v_products from public.merchants where user_id = p_merchant_user_id and verified = true;
  if not found then raise exception 'merchant_order_merchant_not_found'; end if;
  if v_user_id is not null then
    select coalesce(nullif(trim(name),''),'乐生活用户') into v_name from public.profiles where user_id=v_user_id limit 1;
  end if;
  insert into public.merchant_orders(merchant_user_id,table_id,table_name,user_id,user_name,note)
  values(p_merchant_user_id,v_table.id,v_table.table_name,v_user_id,v_name,left(coalesce(trim(p_note),''),240))
  returning * into v_order;
  for v_item in select value from jsonb_array_elements(p_items) loop
    v_product_id:=coalesce(v_item->>'product_id',v_item->>'id','');
    v_quantity:=greatest(1,least(99,coalesce(nullif(v_item->>'quantity','')::integer,1)));
    select value into v_product from jsonb_array_elements(coalesce(v_products,'[]'::jsonb))
    where value->>'id'=v_product_id and coalesce((value->>'active')::boolean,true) and coalesce((value->>'orderable')::boolean,true)
    limit 1;
    if v_product is null then raise exception 'merchant_order_product_unavailable:%',v_product_id; end if;
    v_price_label:=coalesce(v_product->>'price','');
    v_unit_price:=coalesce(nullif(substring(v_price_label from '([0-9]+([.][0-9]{1,2})?)'),'')::numeric,0);
    insert into public.merchant_order_items(order_id,batch_no,product_id,product_name,product_image,product_categories,unit_price,price_label,quantity)
    values(v_order.id,1,v_product_id,coalesce(v_product->>'name','未命名菜品'),nullif(v_product->>'image',''),coalesce(v_product->'categories',jsonb_build_array(coalesce(v_product->>'category','其他'))),v_unit_price,v_price_label,v_quantity);
    v_subtotal:=v_subtotal+v_unit_price*v_quantity; v_count:=v_count+v_quantity;
  end loop;
  update public.merchant_orders set subtotal=v_subtotal,item_count=v_count,updated_at=now() where id=v_order.id;
  return v_order.id;
end;
$$;

revoke all on function public.merchant_dinein_guest_context(text,text) from public, anon, authenticated;
revoke all on function public.merchant_dinein_guest_order_create(uuid,text,jsonb,text) from public, anon, authenticated;
grant execute on function public.merchant_dinein_guest_context(text,text) to anon, authenticated;
grant execute on function public.merchant_dinein_guest_order_create(uuid,text,jsonb,text) to anon, authenticated;
