-- 乐生活 v5.291：优惠券可按商家设置再次领取。
-- v5.288 已由 claim_merchant_coupon 负责每日、每周、每月、间隔和不限次数判断；
-- 此旧唯一约束会阻止任何第二次领取，必须移除。

alter table public.merchant_coupon_claims
  drop constraint if exists merchant_coupon_claims_merchant_user_id_user_id_coupon_id_key;

create index if not exists merchant_coupon_claims_frequency_lookup_idx
  on public.merchant_coupon_claims (merchant_user_id, user_id, coupon_id, claimed_at desc);
