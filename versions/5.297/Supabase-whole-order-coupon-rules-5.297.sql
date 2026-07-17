-- 乐生活 v5.297：补充整单固定金额与整单百分比优惠，可继续限定支付方式。

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
  rule_type text;
  minimum_spend numeric(12,2);
  rule_value numeric(12,2);
  repeat_discount boolean;
  gift_product_id text;
  gift_quantity integer;
  gift_remaining integer;
  item_row record;
  item_quantity integer;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  if p_payment_method not in ('cash','card','online') then raise exception 'invalid_payment_method'; end if;

  select * into order_row from public.merchant_orders where id=p_order_id for update;
  if not found then raise exception 'order_not_found'; end if;
  if order_row.status='cancelled' then raise exception 'order_cancelled'; end if;
  if not public.merchant_matrix_has_permission(order_row.merchant_user_id,'order_complete') then raise exception 'not_order_cashier'; end if;
  select * into bill_row from public.merchant_order_bills where order_id=p_order_id;
  if found then return bill_row; end if;

  select coupons, coalesce(order_checkout_settings, '{}'::jsonb)
    into merchant_coupons, checkout_settings
    from public.merchants where user_id=order_row.merchant_user_id and verified=true;
  if merchant_coupons is null then raise exception 'merchant_not_verified'; end if;
  select count(*) into claim_count from jsonb_array_elements_text(coalesce(p_coupon_claim_ids,'[]'::jsonb));
  if claim_count > 0 and coalesce(checkout_settings->>'coupon_mode','single') <> 'multiple' and claim_count > 1 then raise exception 'coupon_limit_one'; end if;

  subtotal_value := greatest(coalesce(order_row.subtotal,0),0);
  la_weekday := extract(dow from (now() at time zone 'America/Los_Angeles'))::integer;
  la_time := (now() at time zone 'America/Los_Angeles')::time;

  for claim_id in select value::bigint from jsonb_array_elements_text(coalesce(p_coupon_claim_ids,'[]'::jsonb)) value loop
    select * into claim_row from public.merchant_coupon_claims
      where id=claim_id and merchant_user_id=order_row.merchant_user_id and user_id=order_row.user_id for update;
    if not found then raise exception 'coupon_not_for_this_order'; end if;
    if claim_row.status <> 'claimed' then raise exception 'coupon_already_redeemed'; end if;

    select item.value into coupon_rule from jsonb_array_elements(merchant_coupons) with ordinality as item(value,ord)
      where coalesce(item.value->>'id','legacy-'||(item.ord-1)::text)=claim_row.coupon_id and coalesce(item.value->>'active','true')<>'false' limit 1;
    if coupon_rule is null then raise exception 'coupon_not_available'; end if;
    if nullif(coupon_rule->>'expires_at','') is not null and (coupon_rule->>'expires_at')::date < (now() at time zone 'America/Los_Angeles')::date then raise exception 'coupon_expired'; end if;
    if jsonb_typeof(coalesce(coupon_rule->'weekdays','[]'::jsonb))='array' and jsonb_array_length(coalesce(coupon_rule->'weekdays','[]'::jsonb))>0 and not exists(select 1 from jsonb_array_elements_text(coupon_rule->'weekdays') day_value where day_value=la_weekday::text) then raise exception 'coupon_invalid_weekday'; end if;
    start_time := nullif(coupon_rule->>'time_start','')::time; end_time := nullif(coupon_rule->>'time_end','')::time;
    if start_time is not null and end_time is not null and not(la_time>=start_time and la_time<=end_time) then raise exception 'coupon_invalid_time'; elsif start_time is not null and la_time<start_time then raise exception 'coupon_invalid_time'; elsif end_time is not null and la_time>end_time then raise exception 'coupon_invalid_time'; end if;
    permitted_methods := coalesce(coupon_rule->'payment_methods','[]'::jsonb);
    if jsonb_typeof(permitted_methods)='array' and jsonb_array_length(permitted_methods)>0 and not exists(select 1 from jsonb_array_elements_text(permitted_methods) method_value where (p_payment_method='online' and method_value in ('online','card')) or (p_payment_method<>'online' and method_value=p_payment_method)) then raise exception 'coupon_invalid_payment_method'; end if;

    rule_type := lower(coalesce(nullif(coupon_rule#>>'{pricing_rule,type}',''),''));
    minimum_spend := greatest(coalesce(nullif(coupon_rule#>>'{pricing_rule,min_spend}','')::numeric,0),0);
    rule_value := greatest(coalesce(nullif(coupon_rule#>>'{pricing_rule,value}','')::numeric,0),0);
    repeat_discount := coalesce(nullif(coupon_rule#>>'{pricing_rule,repeat}','')::boolean,false);
    gift_product_id := coalesce(coupon_rule#>>'{pricing_rule,gift_product_id}','');
    gift_quantity := greatest(coalesce(nullif(coupon_rule#>>'{pricing_rule,gift_quantity}','')::integer,1),1);

    if rule_type='whole_fixed' then
      discount_value := discount_value + rule_value;
    elsif rule_type='whole_percent' then
      discount_value := discount_value + subtotal_value * least(rule_value,100) / 100;
    elsif rule_type='fixed' and subtotal_value >= minimum_spend then
      discount_value := discount_value + rule_value;
    elsif rule_type='percent' and subtotal_value >= minimum_spend then
      discount_value := discount_value + subtotal_value * least(rule_value,100) / 100;
    elsif rule_type='tiered_fixed' and subtotal_value >= minimum_spend and minimum_spend > 0 then
      discount_value := discount_value + rule_value * case when repeat_discount then greatest(1,floor(subtotal_value/minimum_spend)) else 1 end;
    elsif rule_type='gift' and subtotal_value >= minimum_spend and gift_product_id <> '' then
      gift_remaining := gift_quantity;
      for item_row in select product_id, quantity, unit_price from public.merchant_order_items where order_id=p_order_id and product_id=gift_product_id order by id loop
        item_quantity := least(gift_remaining, greatest(coalesce(item_row.quantity,0),0));
        if item_quantity > 0 then
          discount_value := discount_value + item_quantity * greatest(coalesce(item_row.unit_price,0),0);
          gift_remaining := gift_remaining-item_quantity;
        end if;
        exit when gift_remaining <= 0;
      end loop;
    else
      -- 兼容在 v5.296 以前创建的文字规则优惠券。
      coupon_text := coalesce(coupon_rule->>'description','') || ' ' || coalesce(coupon_rule->>'title','');
      price_match := regexp_match(coupon_text, '满[^0-9]*([0-9]+([.][0-9]+)?)[^0-9]*减[^0-9]*([0-9]+([.][0-9]+)?)');
      if price_match is not null and subtotal_value >= price_match[1]::numeric then discount_value := discount_value + price_match[3]::numeric;
      elsif price_match is null then
        price_match := regexp_match(coupon_text, '([0-9]+([.][0-9]+)?)[[:space:]]*折');
        if price_match is not null and price_match[1]::numeric > 0 and price_match[1]::numeric < 10 then discount_value := discount_value + subtotal_value * (1-price_match[1]::numeric/10);
        else price_match := regexp_match(coupon_text, '(优惠|立减|折扣|减免)?[[:space:]]*([0-9]+([.][0-9]+)?)[[:space:]]*%'); if price_match is not null and price_match[2]::numeric > 0 and price_match[2]::numeric <= 100 then discount_value := discount_value + subtotal_value*price_match[2]::numeric/100; end if; end if;
      end if;
    end if;
  end loop;

  discount_value := least(greatest(discount_value,0),subtotal_value);
  tip_value := greatest(coalesce(p_tip_amount,0),0);
  if claim_count > 0 then update public.merchant_coupon_claims set status='redeemed', redeemed_at=now(), redeemed_by=auth.uid() where id in (select value::bigint from jsonb_array_elements_text(coalesce(p_coupon_claim_ids,'[]'::jsonb)) value); end if;
  select count(*) into remaining_count from public.merchant_order_items where order_id=p_order_id and not coalesce(is_served,false);
  update public.merchant_orders set payment_status='paid', paid_at=now(), paid_method=p_payment_method, status=case when remaining_count=0 then 'completed' else status end, completed_at=case when remaining_count=0 then now() else completed_at end, updated_at=now() where id=p_order_id;
  insert into public.merchant_order_bills(order_id,merchant_user_id,user_id,payment_method,subtotal,discount_amount,tip_amount,total_amount,coupon_claim_ids) values(p_order_id,order_row.merchant_user_id,order_row.user_id,p_payment_method,subtotal_value,discount_value,tip_value,subtotal_value-discount_value+tip_value,coalesce(p_coupon_claim_ids,'[]'::jsonb)) returning * into bill_row;
  return bill_row;
end;
$$;

revoke all on function public.merchant_order_complete_with_bill(uuid,text,numeric,numeric,jsonb) from public;
grant execute on function public.merchant_order_complete_with_bill(uuid,text,numeric,numeric,jsonb) to authenticated;
