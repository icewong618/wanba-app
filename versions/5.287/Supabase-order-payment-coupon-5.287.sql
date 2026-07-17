-- 乐生活 v5.287：修复在线支付优惠资格，并让收银扫码券可关联到具体订单。

alter table public.merchant_orders
  add column if not exists payment_status text not null default 'unpaid',
  add column if not exists paid_at timestamptz,
  add column if not exists paid_method text;

alter table public.merchant_orders drop constraint if exists merchant_orders_payment_status_check;
alter table public.merchant_orders
  add constraint merchant_orders_payment_status_check check (payment_status in ('unpaid','paid'));

update public.merchant_orders o
set payment_status='paid',
    paid_at=coalesce(o.completed_at, now())
where o.payment_status='unpaid'
  and (o.status='completed' or exists (select 1 from public.merchant_order_bills b where b.order_id=o.id));

create or replace function public.merchant_order_complete_with_bill(
  p_order_id uuid,
  p_payment_method text,
  p_tip_amount numeric default 0,
  p_discount_amount numeric default 0,
  p_coupon_claim_ids jsonb default '[]'::jsonb
)
returns public.merchant_order_bills
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  order_row public.merchant_orders;
  bill_row public.merchant_order_bills;
  claim_row public.merchant_coupon_claims;
  merchant_coupons jsonb;
  checkout_settings jsonb;
  coupon_rule jsonb;
  claim_id bigint;
  claim_count integer := 0;
  remaining_count integer := 0;
  subtotal_value numeric(12,2);
  discount_value numeric(12,2) := 0;
  tip_value numeric(12,2);
  coupon_text text;
  price_match text[];
  la_time time;
  la_weekday integer;
  start_time time;
  end_time time;
  permitted_methods jsonb;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  if p_payment_method not in ('cash','card','online') then raise exception 'invalid_payment_method'; end if;

  select * into order_row from public.merchant_orders where id=p_order_id for update;
  if not found then raise exception 'order_not_found'; end if;
  if order_row.status='cancelled' then raise exception 'order_cancelled'; end if;
  if not public.merchant_matrix_has_permission(order_row.merchant_user_id,'order_complete') then
    raise exception 'not_order_cashier';
  end if;
  select * into bill_row from public.merchant_order_bills where order_id=p_order_id;
  if found then return bill_row; end if;

  select coupons, coalesce(order_checkout_settings, '{}'::jsonb)
  into merchant_coupons, checkout_settings
  from public.merchants where user_id=order_row.merchant_user_id and verified=true;
  if merchant_coupons is null then raise exception 'merchant_not_verified'; end if;

  select count(*) into claim_count from jsonb_array_elements_text(coalesce(p_coupon_claim_ids,'[]'::jsonb));
  if claim_count > 0 and coalesce(checkout_settings->>'coupon_mode','single') <> 'multiple' and claim_count > 1 then
    raise exception 'coupon_limit_one';
  end if;

  subtotal_value := greatest(coalesce(order_row.subtotal,0),0);
  la_weekday := extract(dow from (now() at time zone 'America/Los_Angeles'))::integer;
  la_time := (now() at time zone 'America/Los_Angeles')::time;

  for claim_id in select value::bigint from jsonb_array_elements_text(coalesce(p_coupon_claim_ids,'[]'::jsonb)) value loop
    select * into claim_row
    from public.merchant_coupon_claims
    where id=claim_id and merchant_user_id=order_row.merchant_user_id and user_id=order_row.user_id
    for update;
    if not found then raise exception 'coupon_not_for_this_order'; end if;
    if claim_row.status <> 'claimed' then raise exception 'coupon_already_redeemed'; end if;

    select item.value into coupon_rule
    from jsonb_array_elements(merchant_coupons) with ordinality as item(value,ord)
    where coalesce(item.value->>'id','legacy-'||(item.ord-1)::text)=claim_row.coupon_id
      and coalesce(item.value->>'active','true')<>'false'
    limit 1;
    if coupon_rule is null then raise exception 'coupon_not_available'; end if;
    if nullif(coupon_rule->>'expires_at','') is not null
      and (coupon_rule->>'expires_at')::date < (now() at time zone 'America/Los_Angeles')::date then
      raise exception 'coupon_expired';
    end if;
    if jsonb_typeof(coalesce(coupon_rule->'weekdays','[]'::jsonb))='array'
      and jsonb_array_length(coalesce(coupon_rule->'weekdays','[]'::jsonb))>0
      and not exists(select 1 from jsonb_array_elements_text(coupon_rule->'weekdays') day_value where day_value=la_weekday::text) then
      raise exception 'coupon_invalid_weekday';
    end if;
    start_time := nullif(coupon_rule->>'time_start','')::time;
    end_time := nullif(coupon_rule->>'time_end','')::time;
    if start_time is not null and end_time is not null and not(la_time>=start_time and la_time<=end_time) then raise exception 'coupon_invalid_time';
    elsif start_time is not null and la_time<start_time then raise exception 'coupon_invalid_time';
    elsif end_time is not null and la_time>end_time then raise exception 'coupon_invalid_time'; end if;
    permitted_methods := coalesce(coupon_rule->'payment_methods','[]'::jsonb);
    if jsonb_typeof(permitted_methods)='array' and jsonb_array_length(permitted_methods)>0
      and not exists(
        select 1 from jsonb_array_elements_text(permitted_methods) method_value
        where (p_payment_method='online' and method_value in ('online','card'))
          or (p_payment_method<>'online' and method_value=p_payment_method)
      ) then
      raise exception 'coupon_invalid_payment_method';
    end if;

    -- 描述通常是商家编辑的完整优惠条件，优先按描述计算，标题作为补充。
    coupon_text := coalesce(coupon_rule->>'description','') || ' ' || coalesce(coupon_rule->>'title','');
    price_match := regexp_match(coupon_text, '满[^0-9]*([0-9]+([.][0-9]+)?)[^0-9]*减[^0-9]*([0-9]+([.][0-9]+)?)');
    if price_match is not null then
      if subtotal_value >= price_match[1]::numeric then discount_value := discount_value + price_match[3]::numeric; end if;
    else
      price_match := regexp_match(coupon_text, '([0-9]+([.][0-9]+)?)[[:space:]]*折');
      if price_match is not null and price_match[1]::numeric > 0 and price_match[1]::numeric < 10 then
        discount_value := discount_value + subtotal_value * (1 - price_match[1]::numeric / 10);
      end if;
    end if;
  end loop;

  discount_value := least(greatest(discount_value,0),subtotal_value);
  tip_value := greatest(coalesce(p_tip_amount,0),0);
  if claim_count > 0 then
    update public.merchant_coupon_claims
    set status='redeemed', redeemed_at=now(), redeemed_by=auth.uid()
    where id in (select value::bigint from jsonb_array_elements_text(coalesce(p_coupon_claim_ids,'[]'::jsonb)) value);
  end if;

  select count(*) into remaining_count from public.merchant_order_items
  where order_id=p_order_id and not coalesce(is_served,false);
  update public.merchant_orders
  set payment_status='paid', paid_at=now(), paid_method=p_payment_method,
      status=case when remaining_count=0 then 'completed' else status end,
      completed_at=case when remaining_count=0 then now() else completed_at end,
      updated_at=now()
  where id=p_order_id;

  insert into public.merchant_order_bills(order_id,merchant_user_id,user_id,payment_method,subtotal,discount_amount,tip_amount,total_amount,coupon_claim_ids)
  values(p_order_id,order_row.merchant_user_id,order_row.user_id,p_payment_method,subtotal_value,discount_value,tip_value,subtotal_value-discount_value+tip_value,coalesce(p_coupon_claim_ids,'[]'::jsonb))
  returning * into bill_row;
  return bill_row;
end;
$$;

create or replace function public.merchant_order_set_item_served(p_item_id bigint, p_is_served boolean)
returns public.merchant_order_items
language plpgsql security definer set search_path = public, pg_temp as $$
declare item_row public.merchant_order_items; merchant_id uuid; v_order_id uuid; remaining_count integer; can_link_kitchen boolean; paid boolean;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  select i.order_id, o.merchant_user_id into v_order_id, merchant_id
  from public.merchant_order_items i join public.merchant_orders o on o.id=i.order_id where i.id=p_item_id for update;
  if not found then raise exception 'order_item_not_found'; end if;
  if not public.merchant_matrix_has_permission(merchant_id,'order_serve') then raise exception 'not_runner_staff'; end if;
  select * into item_row from public.merchant_order_items where id=p_item_id;
  can_link_kitchen := auth.uid()=merchant_id or exists(
    select 1 from public.merchant_team_members t where t.merchant_user_id=merchant_id and t.member_user_id=auth.uid() and t.status='active'
      and ('manager'=any(coalesce(t.roles,array[t.role])) or coalesce(t.roles,array[t.role]) @> array['kitchen','runner']::text[])
  );
  if coalesce(p_is_served,false) and not coalesce(item_row.kitchen_done,false) then
    if not can_link_kitchen then raise exception 'kitchen_not_done'; end if;
    update public.merchant_order_items set kitchen_done=true,kitchen_done_at=now(),kitchen_done_by=auth.uid() where id=p_item_id returning * into item_row;
  end if;
  update public.merchant_order_items
  set is_served=coalesce(p_is_served,false),served_at=case when coalesce(p_is_served,false) then now() else null end,
      kitchen_done=case when not coalesce(p_is_served,false) and can_link_kitchen then false else kitchen_done end,
      kitchen_done_at=case when not coalesce(p_is_served,false) and can_link_kitchen then null else kitchen_done_at end,
      kitchen_done_by=case when not coalesce(p_is_served,false) and can_link_kitchen then null else kitchen_done_by end
  where id=p_item_id returning * into item_row;
  select count(*) into remaining_count from public.merchant_order_items where order_id=v_order_id and not coalesce(is_served,false);
  select payment_status='paid' into paid from public.merchant_orders where id=v_order_id;
  update public.merchant_orders
  set status=case when remaining_count=0 and paid then 'completed' when remaining_count=0 then 'served' else 'preparing' end,
      completed_at=case when remaining_count=0 and paid then now() else completed_at end, updated_at=now()
  where id=v_order_id;
  return item_row;
end;
$$;

revoke all on function public.merchant_order_complete_with_bill(uuid,text,numeric,numeric,jsonb) from public, anon;
revoke all on function public.merchant_order_set_item_served(bigint,boolean) from public, anon;
grant execute on function public.merchant_order_complete_with_bill(uuid,text,numeric,numeric,jsonb) to authenticated;
grant execute on function public.merchant_order_set_item_served(bigint,boolean) to authenticated;
