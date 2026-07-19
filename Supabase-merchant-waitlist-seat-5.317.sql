-- 乐生活 v5.317：已登录顾客将排队预点菜转为餐桌正式订单。

create or replace function public.merchant_waitlist_submit_preorder(
  p_waitlist_id uuid,
  p_manage_token uuid,
  p_table_code text
)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_user_id uuid := auth.uid();
  v_wait public.merchant_waitlists%rowtype;
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
begin
  if v_user_id is null then raise exception 'merchant_order_login_required'; end if;
  select * into v_wait from public.merchant_waitlists
  where id = p_waitlist_id and manage_token = p_manage_token
  for update;
  if not found or v_wait.status <> 'queued' or v_wait.customer_user_id is distinct from v_user_id then
    raise exception 'waitlist_not_allowed';
  end if;
  if jsonb_typeof(v_wait.preorder_items) <> 'array' or jsonb_array_length(v_wait.preorder_items) = 0 then
    raise exception 'waitlist_preorder_empty';
  end if;
  select * into v_table from public.merchant_order_tables
  where merchant_user_id = v_wait.merchant_user_id and table_code = lower(trim(p_table_code)) and is_active = true;
  if not found then raise exception 'merchant_order_table_not_found'; end if;
  select products into v_products from public.merchants where user_id = v_wait.merchant_user_id and verified = true;
  if not found then raise exception 'merchant_order_merchant_not_found'; end if;

  insert into public.merchant_orders(merchant_user_id,table_id,table_name,user_id,user_name,note)
  values(v_wait.merchant_user_id,v_table.id,v_table.table_name,v_user_id,v_wait.customer_name,'排队预点菜')
  returning * into v_order;
  for v_item in select value from jsonb_array_elements(v_wait.preorder_items) loop
    v_product_id := coalesce(v_item->>'product_id',v_item->>'id','');
    v_quantity := greatest(1,least(99,coalesce(nullif(v_item->>'quantity','')::integer,1)));
    select value into v_product from jsonb_array_elements(coalesce(v_products,'[]'::jsonb))
    where value->>'id' = v_product_id and coalesce((value->>'active')::boolean,true) and coalesce((value->>'orderable')::boolean,true)
    limit 1;
    if v_product is null then raise exception 'merchant_order_product_unavailable:%',v_product_id; end if;
    v_price_label := coalesce(v_product->>'price','');
    v_unit_price := coalesce(nullif(substring(v_price_label from '([0-9]+([.][0-9]{1,2})?)'),'')::numeric,0);
    insert into public.merchant_order_items(order_id,batch_no,product_id,product_name,product_image,product_categories,unit_price,price_label,quantity)
    values(v_order.id,1,v_product_id,coalesce(v_product->>'name','未命名菜品'),nullif(v_product->>'image',''),coalesce(v_product->'categories',jsonb_build_array(coalesce(v_product->>'category','其他'))),v_unit_price,v_price_label,v_quantity);
    v_subtotal := v_subtotal + v_unit_price*v_quantity; v_count := v_count+v_quantity;
  end loop;
  update public.merchant_orders set subtotal=v_subtotal,item_count=v_count,updated_at=now() where id=v_order.id;
  update public.merchant_waitlists set status='seated',seated_table_id=v_table.id,seated_at=now(),updated_at=now() where id=v_wait.id;
  return v_order.id;
end;
$$;

revoke all on function public.merchant_waitlist_submit_preorder(uuid,uuid,text) from public, anon, authenticated;
grant execute on function public.merchant_waitlist_submit_preorder(uuid,uuid,text) to authenticated;
