# 乐生活租车 Stripe 支付接入（5.359）

本版已部署两个后端接口：

- `rental-stripe-payment`：为已登录客户创建租车 PaymentIntent。
- `rental-stripe-webhook`：只接受 Stripe 签名回调，同步支付成功或失败状态。

## 启用前准备

1. 创建乐生活的 Stripe 平台账户。
2. 在 Stripe 中启用 Connect，并为每家要收款的商家完成 Connected Account 开通。
3. 在 Supabase Edge Functions Secrets 添加：
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_WEBHOOK_SECRET`
4. 在 Stripe Dashboard 添加 Webhook：
   - 地址：`https://ptxdxepmggmjcndgukjk.supabase.co/functions/v1/rental-stripe-webhook`
   - 事件：`payment_intent.succeeded`、`payment_intent.payment_failed`、`payment_intent.canceled`
5. 将商家的 Stripe Connected Account ID 写入 `merchant_payment_accounts`，并确认该账户 `charges_enabled=true`、`payouts_enabled=true`、`onboarding_status='active'`。

## 当前边界

- 本版已具备安全的服务端 PaymentIntent 创建和 Webhook 状态同步基础。
- 浏览器/App 的 Stripe 支付组件、商家 Connect 自助开户和真实退款按钮留在下一版接入。
- 不在网页、App 或数据库中保存银行卡资料与 Stripe 私钥。

## 平台服务费

`merchant_payment_accounts.platform_fee_bps` 预留平台成交服务费。

- `0`：平台不抽成。
- `300`：3%。
- `500`：5%。

Stripe 收款手续费与乐生活平台服务费分别计算。
