-- 乐生活 v5.292：新增“核销后可再次领取”优惠券规则。

create or replace function public.claim_merchant_coupon(p_merchant_user_id uuid, p_coupon_id text)
returns public.merchant_coupon_claims
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  merchant_coupons jsonb;
  coupon_rule jsonb;
  out_row public.merchant_coupon_claims;
  claim_mode text;
  interval_days integer;
  latest_claim timestamptz;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  if p_merchant_user_id is null or nullif(trim(coalesce(p_coupon_id,'')),'') is null then raise exception 'invalid_coupon'; end if;

  select coupons into merchant_coupons
  from public.merchants
  where user_id=p_merchant_user_id and verified=true;
  if merchant_coupons is null then raise exception 'merchant_not_verified'; end if;

  select item.value into coupon_rule
  from jsonb_array_elements(merchant_coupons) with ordinality as item(value,ord)
  where coalesce(item.value->>'id','legacy-'||(item.ord-1)::text)=p_coupon_id
    and coalesce(item.value->>'active','true')<>'false'
  limit 1;
  if coupon_rule is null then raise exception 'coupon_not_available'; end if;
  if nullif(coupon_rule->>'expires_at','') is not null
    and (coupon_rule->>'expires_at')::date < (now() at time zone 'America/Los_Angeles')::date then
    raise exception 'coupon_expired';
  end if;

  claim_mode := lower(coalesce(nullif(coupon_rule->>'claim_mode',''),'once'));
  interval_days := greatest(coalesce(nullif(coupon_rule->>'claim_interval_days','')::integer, 1), 1);
  if claim_mode not in ('unlimited','once','after_redeem','daily','weekly','monthly','interval') then claim_mode := 'once'; end if;

  select max(claimed_at) into latest_claim
  from public.merchant_coupon_claims
  where merchant_user_id=p_merchant_user_id and user_id=auth.uid() and coupon_id=p_coupon_id;

  if claim_mode='once' and latest_claim is not null then raise exception 'coupon_claim_once_limit'; end if;
  if claim_mode='after_redeem' and exists (
    select 1 from public.merchant_coupon_claims
    where merchant_user_id=p_merchant_user_id and user_id=auth.uid() and coupon_id=p_coupon_id and status='claimed'
  ) then raise exception 'coupon_claim_unredeemed_limit'; end if;
  if claim_mode='daily' and latest_claim is not null
    and (latest_claim at time zone 'America/Los_Angeles')::date = (now() at time zone 'America/Los_Angeles')::date then raise exception 'coupon_claim_daily_limit'; end if;
  if claim_mode='weekly' and latest_claim is not null
    and date_trunc('week', latest_claim at time zone 'America/Los_Angeles') = date_trunc('week', now() at time zone 'America/Los_Angeles') then raise exception 'coupon_claim_weekly_limit'; end if;
  if claim_mode='monthly' and latest_claim is not null
    and date_trunc('month', latest_claim at time zone 'America/Los_Angeles') = date_trunc('month', now() at time zone 'America/Los_Angeles') then raise exception 'coupon_claim_monthly_limit'; end if;
  if claim_mode='interval' and latest_claim is not null
    and latest_claim > now() - make_interval(days => interval_days) then raise exception 'coupon_claim_interval_limit'; end if;

  insert into public.merchant_coupon_claims(merchant_user_id,user_id,coupon_id,coupon_snapshot,status)
  values(p_merchant_user_id,auth.uid(),p_coupon_id,coupon_rule,'claimed')
  returning * into out_row;
  return out_row;
end;
$$;

revoke all on function public.claim_merchant_coupon(uuid, text) from public;
grant execute on function public.claim_merchant_coupon(uuid, text) to authenticated;
