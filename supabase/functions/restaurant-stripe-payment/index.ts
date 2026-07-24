import Stripe from "npm:stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, "Content-Type": "application/json" },
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const authorization = req.headers.get("Authorization") || "";
  if (!authorization.startsWith("Bearer ")) return json({ error: "请先登录后付款" }, 401);

  const url = Deno.env.get("SUPABASE_URL") || "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY") || "";
  const publishableKey = Deno.env.get("STRIPE_PUBLISHABLE_KEY") || "";
  if (!url || !anonKey || !serviceKey) return json({ error: "支付服务尚未完成配置" }, 503);
  if (!stripeSecret) return json({ error: "Stripe 支付尚未启用" }, 503);

  const paymentEnvironment = stripeSecret.startsWith("sk_live_") ? "live" : "test";
  const expectedPublishablePrefix = paymentEnvironment === "live" ? "pk_live_" : "pk_test_";
  if (!publishableKey.startsWith(expectedPublishablePrefix)) {
    return json({ error: "Stripe 测试与正式密钥不匹配" }, 503);
  }

  const token = authorization.slice("Bearer ".length);
  const userClient = createClient(url, anonKey, {
    global: { headers: { Authorization: authorization } },
  });
  const { data: authData, error: authError } = await userClient.auth.getUser(token);
  const user = authData.user;
  if (authError || !user) return json({ error: "登录已过期，请重新登录" }, 401);

  try {
    const body = await req.json();
    const orderId = String(body?.order_id || "").trim();
    if (!orderId) return json({ error: "缺少外卖订单" }, 400);

    const admin = createClient(url, serviceKey);
    const { data: order, error: orderError } = await admin
      .from("merchant_orders")
      .select("id,order_code,merchant_user_id,user_id,order_type,status,payment_status,subtotal,delivery_fee,tip_amount,quoted_discount_amount,coupon_claim_ids")
      .eq("id", orderId)
      .maybeSingle();
    if (orderError || !order || order.user_id !== user.id || order.order_type !== "takeout") {
      return json({ error: "未找到可付款的外卖订单" }, 404);
    }
    if (order.status === "cancelled") return json({ error: "该订单已取消" }, 409);
    if (order.payment_status === "paid") return json({ error: "该订单已经付款" }, 409);

    const claimIds = Array.isArray(order.coupon_claim_ids) ? order.coupon_claim_ids : [];
    const { data: quote, error: quoteError } = await userClient.rpc("merchant_order_checkout_quote", {
      p_merchant_user_id: order.merchant_user_id,
      p_subtotal: Number(order.subtotal || 0),
      p_payment_method: "online",
      p_coupon_claim_ids: claimIds,
    });
    if (quoteError) return json({ error: "优惠券复核失败，请返回订单重试" }, 409);
    const couponResults = Array.isArray(quote?.coupon_results) ? quote.coupon_results : [];
    const invalidCoupon = couponResults.find((item: Record<string, unknown>) => !item.valid);
    if (invalidCoupon) return json({ error: String(invalidCoupon.reason || "优惠券当前不可用") }, 409);

    const discount = Math.max(0, Number(quote?.discount_amount || 0));
    const total = Math.max(
      0,
      Number(order.subtotal || 0)
        + Number(order.delivery_fee || 0)
        + Number(order.tip_amount || 0)
        - discount,
    );
    const amount = Math.round(total * 100);
    if (!Number.isSafeInteger(amount) || amount < 50) {
      return json({ error: "订单金额过低或无效，暂时无法在线付款" }, 400);
    }

    const { error: orderUpdateError } = await admin.from("merchant_orders").update({
      quoted_discount_amount: Number(discount.toFixed(2)),
      payment_status: "processing",
      payment_provider: "stripe",
      requested_payment_method: "online",
      updated_at: new Date().toISOString(),
    }).eq("id", order.id);
    if (orderUpdateError) throw orderUpdateError;

    const { data: account } = await admin
      .from("merchant_payment_accounts")
      .select("stripe_connected_account_id,onboarding_status,charges_enabled,platform_fee_bps")
      .eq("merchant_user_id", order.merchant_user_id)
      .eq("provider", "stripe")
      .maybeSingle();

    const stripe = new Stripe(stripeSecret, {
      httpClient: Stripe.createFetchHttpClient(),
    });
    const connectedAccount = account?.stripe_connected_account_id
      && account.onboarding_status === "active"
      && account.charges_enabled
      ? account.stripe_connected_account_id
      : null;
    const fee = connectedAccount
      ? Math.floor(amount * Number(account?.platform_fee_bps || 0) / 10000)
      : 0;

    let customerId = "";
    if (!connectedAccount) {
      const { data: storedCustomer } = await admin
        .from("user_payment_customers")
        .select("provider_customer_id")
        .eq("user_id", user.id)
        .maybeSingle();
      customerId = storedCustomer?.provider_customer_id || "";
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email || undefined,
          metadata: { supabase_user_id: user.id },
        });
        const { error: customerError } = await admin.from("user_payment_customers").upsert({
          user_id: user.id,
          provider: "stripe",
          provider_customer_id: customer.id,
          updated_at: new Date().toISOString(),
        });
        if (customerError) throw customerError;
        customerId = customer.id;
      }
    }

    const intent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      customer: customerId || undefined,
      application_fee_amount: fee || undefined,
      metadata: {
        restaurant_order_id: order.id,
        restaurant_order_code: order.order_code,
        merchant_user_id: order.merchant_user_id,
        payment_environment: paymentEnvironment,
        payment_mode: connectedAccount ? "connected_account" : `platform_${paymentEnvironment}`,
      },
    }, {
      ...(connectedAccount ? { stripeAccount: connectedAccount } : {}),
      idempotencyKey: `restaurant-order-${order.id}`,
    });

    const customerSession = customerId ? await stripe.customerSessions.create({
      customer: customerId,
      components: {
        payment_element: {
          enabled: true,
          features: {
            payment_method_redisplay: "enabled",
            payment_method_save: "enabled",
            payment_method_save_usage: "off_session",
            payment_method_remove: "enabled",
          },
        },
      },
    }) : null;

    const { error: attemptError } = await admin.from("merchant_order_payment_attempts").upsert({
      order_id: order.id,
      merchant_user_id: order.merchant_user_id,
      user_id: user.id,
      provider: "stripe",
      provider_payment_id: intent.id,
      status: intent.status === "succeeded" ? "succeeded" : "requires_action",
      amount: Number(total.toFixed(2)),
      currency: "usd",
      metadata: {
        stripe_account_id: connectedAccount,
        payment_environment: paymentEnvironment,
        discount_amount: Number(discount.toFixed(2)),
      },
      updated_at: new Date().toISOString(),
    }, { onConflict: "provider_payment_id" });
    if (attemptError) throw attemptError;

    await admin.from("merchant_orders").update({
      payment_provider_reference: intent.id,
      // The webhook is the only authority allowed to mark an order paid and
      // create its bill. The client response alone is not a settlement record.
      payment_status: "processing",
      updated_at: new Date().toISOString(),
    }).eq("id", order.id);

    return json({
      client_secret: intent.client_secret,
      payment_intent_id: intent.id,
      publishable_key: publishableKey,
      payment_environment: paymentEnvironment,
      customer_session_client_secret: customerSession?.client_secret || null,
      amount: Number(total.toFixed(2)),
      discount_amount: Number(discount.toFixed(2)),
    });
  } catch (error) {
    console.error("restaurant-stripe-payment", error);
    return json({ error: "暂时无法创建外卖付款，请稍后重试" }, 500);
  }
});
