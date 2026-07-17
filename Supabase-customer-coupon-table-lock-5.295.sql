-- 乐生活 v5.295：客户可删除未核销优惠券。
-- 已核销优惠券需要保留，确保账单和核销记录可追溯。

create or replace function public.delete_merchant_coupon_claim(p_claim_id bigint)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  claim_row public.merchant_coupon_claims;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  select * into claim_row
  from public.merchant_coupon_claims
  where id = p_claim_id
  for update;

  if not found then
    raise exception 'coupon_claim_not_found';
  end if;
  if claim_row.user_id <> auth.uid() then
    raise exception 'not_coupon_owner';
  end if;
  if claim_row.status <> 'claimed' then
    raise exception 'coupon_claim_not_deletable';
  end if;

  delete from public.merchant_coupon_claims
  where id = claim_row.id;
end;
$$;

revoke all on function public.delete_merchant_coupon_claim(bigint) from public;
grant execute on function public.delete_merchant_coupon_claim(bigint) to authenticated;
