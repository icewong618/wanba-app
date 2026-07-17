# v5.288 Coupon Claim Frequency & Checkout Fix

- 商家可设置：不限次数、仅一次、每天一次、每周一次、每月一次、每 N 天一次。
- 领取次数由数据库统一限制，无法绕过页面重复领取。
- 收银扫码后必须选择顾客的具体待付款订单与支付方式；结账账单会保存实际优惠金额。
- 已核对最近一笔账单：$127.70 已正确优惠 $15.00，最终为 $112.70。

## Database

`Supabase-coupon-claim-frequency-5.288.sql` has already been applied to the production Supabase project.
