-- 乐生活 v5.270：员工岗位初始化与订单/核销权限强制校验

-- 旧版账号新增数组字段时会拿到默认值；这里按原岗位补回其实际权限。
update public.merchant_team_members
set roles = case when role = 'operator' then array['operator']::text[] else array['clerk']::text[] end,
    permissions = case
      when role = 'operator' then array['content_manage','coupon_redeem','member_manage']::text[]
      else array['coupon_redeem','member_manage','order_serve']::text[]
    end
where cardinality(coalesce(permissions, array[]::text[])) = 0;

create or replace function public.merchant_order_set_status(p_order_id uuid, p_status text)
returns public.merchant_orders
language plpgsql security definer set search_path = public, pg_temp as $$
declare v_order public.merchant_orders%rowtype;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  if p_status not in ('pending','confirmed','preparing','reminded','served','completed','cancelled') then
    raise exception 'merchant_order_invalid_status';
  end if;
  select * into v_order from public.merchant_orders where id=p_order_id for update;
  if not found or not public.merchant_matrix_has_permission(v_order.merchant_user_id,'order_manage') then
    raise exception 'merchant_order_not_allowed';
  end if;
  update public.merchant_orders
  set status=p_status, updated_at=now(),
      confirmed_at=case when p_status='confirmed' then now() else confirmed_at end,
      completed_at=case when p_status='completed' then now() else completed_at end,
      cancelled_at=case when p_status='cancelled' then now() else cancelled_at end
  where id=p_order_id returning * into v_order;
  return v_order;
end;
$$;

create or replace function public.merchant_order_complete_with_bill(
  p_order_id uuid,
  p_payment_method text,
  p_tip_amount numeric default 0,
  p_discount_amount numeric default 0,
  p_coupon_claim_ids jsonb default '[]'::jsonb
)
returns public.merchant_order_bills
language plpgsql security definer set search_path = public, pg_temp as $$
declare order_row public.merchant_orders; bill_row public.merchant_order_bills;
        subtotal_value numeric(12,2); discount_value numeric(12,2); tip_value numeric(12,2);
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  if p_payment_method not in ('cash','card','online') then raise exception 'invalid_payment_method'; end if;
  select * into order_row from public.merchant_orders where id=p_order_id for update;
  if not found then raise exception 'order_not_found'; end if;
  if not public.merchant_matrix_has_permission(order_row.merchant_user_id,'order_complete') then
    raise exception 'not_order_cashier';
  end if;
  select * into bill_row from public.merchant_order_bills where order_id=p_order_id;
  if found then return bill_row; end if;
  subtotal_value:=greatest(coalesce(order_row.subtotal,0),0);
  discount_value:=least(greatest(coalesce(p_discount_amount,0),0),subtotal_value);
  tip_value:=greatest(coalesce(p_tip_amount,0),0);
  update public.merchant_orders set status='completed',updated_at=now(),completed_at=now() where id=p_order_id;
  insert into public.merchant_order_bills(order_id,merchant_user_id,user_id,payment_method,subtotal,discount_amount,tip_amount,total_amount,coupon_claim_ids)
  values(p_order_id,order_row.merchant_user_id,order_row.user_id,p_payment_method,subtotal_value,discount_value,tip_value,subtotal_value-discount_value+tip_value,coalesce(p_coupon_claim_ids,'[]'::jsonb))
  returning * into bill_row;
  return bill_row;
end;
$$;

create or replace function public.redeem_merchant_coupon_claim(p_claim_id bigint)
returns public.merchant_coupon_claims
language plpgsql security definer set search_path = public, pg_temp as $$
declare claim_row public.merchant_coupon_claims; merchant_coupons jsonb; coupon_rule jsonb;
        la_time time; la_weekday integer; start_time time; end_time time;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  select * into claim_row from public.merchant_coupon_claims where id=p_claim_id for update;
  if not found then raise exception 'coupon_claim_not_found'; end if;
  if not public.merchant_matrix_has_permission(claim_row.merchant_user_id,'coupon_redeem') then raise exception 'not_coupon_cashier'; end if;
  if claim_row.status <> 'claimed' then raise exception 'coupon_already_redeemed'; end if;
  select coupons into merchant_coupons from public.merchants where user_id=claim_row.merchant_user_id and verified=true;
  if merchant_coupons is null then raise exception 'merchant_not_verified'; end if;
  select item.value into coupon_rule from jsonb_array_elements(merchant_coupons) with ordinality as item(value,ord)
  where coalesce(item.value->>'id','legacy-'||(item.ord-1)::text)=claim_row.coupon_id
    and coalesce(item.value->>'active','true')<>'false' limit 1;
  if coupon_rule is null then raise exception 'coupon_not_available'; end if;
  if nullif(coupon_rule->>'expires_at','') is not null and (coupon_rule->>'expires_at')::date < (now() at time zone 'America/Los_Angeles')::date then raise exception 'coupon_expired'; end if;
  la_weekday:=extract(dow from (now() at time zone 'America/Los_Angeles'))::integer;
  if jsonb_typeof(coalesce(coupon_rule->'weekdays','[]'::jsonb))='array' and jsonb_array_length(coalesce(coupon_rule->'weekdays','[]'::jsonb))>0
    and not exists(select 1 from jsonb_array_elements_text(coupon_rule->'weekdays') as day_value where day_value=la_weekday::text) then raise exception 'coupon_invalid_weekday'; end if;
  la_time:=(now() at time zone 'America/Los_Angeles')::time;
  start_time:=nullif(coupon_rule->>'time_start','')::time; end_time:=nullif(coupon_rule->>'time_end','')::time;
  if start_time is not null and end_time is not null and not(la_time>=start_time and la_time<=end_time) then raise exception 'coupon_invalid_time';
  elsif start_time is not null and la_time<start_time then raise exception 'coupon_invalid_time';
  elsif end_time is not null and la_time>end_time then raise exception 'coupon_invalid_time'; end if;
  update public.merchant_coupon_claims set status='redeemed',redeemed_at=now(),redeemed_by=auth.uid() where id=claim_row.id returning * into claim_row;
  return claim_row;
end;
$$;

revoke all on function public.merchant_order_set_status(uuid,text) from public;
revoke all on function public.merchant_order_complete_with_bill(uuid,text,numeric,numeric,jsonb) from public;
revoke all on function public.redeem_merchant_coupon_claim(bigint) from public;
grant execute on function public.merchant_order_set_status(uuid,text) to authenticated;
grant execute on function public.merchant_order_complete_with_bill(uuid,text,numeric,numeric,jsonb) to authenticated;
grant execute on function public.redeem_merchant_coupon_claim(bigint) to authenticated;
