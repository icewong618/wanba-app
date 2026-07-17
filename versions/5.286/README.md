# v5.286 Cashier Coupon Access Fix

- 修复矩阵收银员扫描优惠券时显示“找不到”的问题。
- 旧优惠券与新优惠券均可由本店拥有 `coupon_redeem` 权限的收银员读取并核销。

## Database

`Supabase-cashier-coupon-read-5.286.sql` has already been applied to the production Supabase project.
