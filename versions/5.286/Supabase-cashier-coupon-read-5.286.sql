-- 乐生活 v5.286：允许具有优惠券核销权限的矩阵员工读取本店优惠券，以扫描旧券和新券。

drop policy if exists "coupon claim owner or merchant read 5.101" on public.merchant_coupon_claims;

create policy "coupon claim owner merchant or cashier read 5.286"
on public.merchant_coupon_claims
for select to authenticated
using (
  (select auth.uid()) = user_id
  or (select auth.uid()) = merchant_user_id
  or public.merchant_matrix_has_permission(merchant_user_id, 'coupon_redeem')
);
