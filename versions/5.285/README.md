# v5.285 Flexible Checkout & Coupon Payment

- 顾客可在菜品尚未全部上桌时打开结算页面。
- 订单付款与后厨制作、传菜上桌分开记录；已付款订单会继续留在后厨与传菜流程中。
- 收银可从订单卡片扫描顾客的 `LSHC-` 优惠券二维码。
- 数据库会验证优惠券归属、有效期、适用日期、时段、支付方式及每单单张/多张规则，再计算优惠金额并写入账单。
- 已付款且全部上桌的订单才会进入“已完成”。
- 本版不包含注册/忘记密码修复，该问题留在下一版本单独排查。

## Database

`Supabase-order-payment-coupon-5.285.sql` has already been applied to the production Supabase project.
