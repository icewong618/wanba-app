# v5.287 Coupon Order Linking & Online Payment Fix

- 收银员扫描优惠券后，可选择顾客待收款的餐桌订单与支付方式。
- 选择后立即显示该订单可用优惠和结算金额，并将优惠券与账单绑定。
- 修复“在线支付”优惠券不参与资格判断和金额预览的问题。
- 优惠规则优先使用描述中的金额条件，避免标题与描述不一致时计算错误。

## Database

`Supabase-order-payment-coupon-5.287.sql` will be applied to the production Supabase project.
