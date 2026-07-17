-- 乐生活 v5.249：优惠券适用星期与时段校验
-- 优惠券规则保存在 merchants.coupons JSON 中；核销时以当前商家规则为准。

create or replace function public.redeem_merchant_coupon_claim(p_claim_id bigint)
returns public.merchant_coupon_claims
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  claim_row public.merchant_coupon_claims;
  merchant_coupons jsonb;
  coupon_rule jsonb;
  la_time time;
  la_weekday integer;
  start_time time;
  end_time time;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;

  select * into claim_row
  from public.merchant_coupon_claims
  where id = p_claim_id
  for update;

  if not found then raise exception 'coupon_claim_not_found'; end if;
  if not public.merchant_matrix_has_role(claim_row.merchant_user_id, array['operator','clerk']) then
    raise exception 'not_coupon_merchant';
  end if;
  if claim_row.status <> 'claimed' then raise exception 'coupon_already_redeemed'; end if;

  select coupons into merchant_coupons
  from public.merchants
  where user_id = claim_row.merchant_user_id and verified = true;
  if merchant_coupons is null then raise exception 'merchant_not_verified'; end if;

  select item.value into coupon_rule
  from jsonb_array_elements(merchant_coupons) with ordinality as item(value, ord)
  where coalesce(item.value->>'id', 'legacy-' || (item.ord - 1)::text) = claim_row.coupon_id
    and coalesce(item.value->>'active', 'true') <> 'false'
  limit 1;
  if coupon_rule is null then raise exception 'coupon_not_available'; end if;

  if nullif(coupon_rule->>'expires_at', '') is not null
    and (coupon_rule->>'expires_at')::date < (now() at time zone 'America/Los_Angeles')::date then
    raise exception 'coupon_expired';
  end if;

  la_weekday := extract(dow from (now() at time zone 'America/Los_Angeles'))::integer;
  if jsonb_typeof(coalesce(coupon_rule->'weekdays', '[]'::jsonb)) = 'array'
    and jsonb_array_length(coalesce(coupon_rule->'weekdays', '[]'::jsonb)) > 0
    and not exists (
      select 1 from jsonb_array_elements_text(coupon_rule->'weekdays') as day_value
      where day_value = la_weekday::text
    ) then
    raise exception 'coupon_invalid_weekday';
  end if;

  la_time := (now() at time zone 'America/Los_Angeles')::time;
  start_time := nullif(coupon_rule->>'time_start', '')::time;
  end_time := nullif(coupon_rule->>'time_end', '')::time;
  if start_time is not null and end_time is not null and not (la_time >= start_time and la_time <= end_time) then
    raise exception 'coupon_invalid_time';
  elsif start_time is not null and la_time < start_time then
    raise exception 'coupon_invalid_time';
  elsif end_time is not null and la_time > end_time then
    raise exception 'coupon_invalid_time';
  end if;

  update public.merchant_coupon_claims
  set status = 'redeemed', redeemed_at = now(), redeemed_by = auth.uid()
  where id = claim_row.id
  returning * into claim_row;
  return claim_row;
end;
$$;

revoke all on function public.redeem_merchant_coupon_claim(bigint) from public;
grant execute on function public.redeem_merchant_coupon_claim(bigint) to authenticated;
