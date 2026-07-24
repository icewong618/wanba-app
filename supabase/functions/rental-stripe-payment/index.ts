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
  if (!authorization.startsWith("Bearer ")) return json({ error: "Login required" }, 401);

  const url = Deno.env.get("SUPABASE_URL") || "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY") || "";
  const publishableKey = Deno.env.get("STRIPE_PUBLISHABLE_KEY") || "";
  if (!url || !anonKey || !serviceKey) return json({ error: "Payment service is not configured" }, 503);
  if (!stripeSecret) return json({ error: "Stripe payment is not enabled yet" }, 503);

  // Never allow a test secret key to be paired with a live publishable key,
  // or the reverse. This makes a pre-launch configuration mistake fail closed.
  const paymentEnvironment = stripeSecret.startsWith("sk_live_") ? "live" : "test";
  const expectedPublishablePrefix = paymentEnvironment === "live" ? "pk_live_" : "pk_test_";
  if (!publishableKey.startsWith(expectedPublishablePrefix)) {
    return json({ error: "Stripe key mode mismatch. Please verify the test/live key pair." }, 503);
  }

  const userClient = createClient(url, anonKey, { global: { headers: { Authorization: authorization } } });
  const token = authorization.slice("Bearer ".length);
  const { data: authData, error: authError } = await userClient.auth.getUser(token);
  const user = authData.user;
  if (authError || !user) return json({ error: "Login expired, please sign in again" }, 401);

  try {
    const body = await req.json();
    const bookingId = String(body?.booking_id || "").trim();
    if (!bookingId) return json({ error: "Missing booking" }, 400);

    const admin = createClient(url, serviceKey);
    const { data: booking, error: bookingError } = await admin
      .from("merchant_rental_bookings")
      .select("id,booking_code,merchant_user_id,user_id,total_amount,status,payment_status")
      .eq("id", bookingId)
      .maybeSingle();
    if (bookingError || !booking || booking.user_id !== user.id) return json({ error: "Booking not found" }, 404);
    if (booking.status !== "pending") return json({ error: "This booking can no longer be paid" }, 409);
    if (booking.payment_status === "paid") return json({ error: "This booking is already paid" }, 409);

    const { data: account } = await admin
      .from("merchant_payment_accounts")
      .select("stripe_connected_account_id,onboarding_status,charges_enabled,platform_fee_bps")
      .eq("merchant_user_id", booking.merchant_user_id)
      .eq("provider", "stripe")
      .maybeSingle();
    const amount = Math.round(Number(booking.total_amount || 0) * 100);
    if (!Number.isSafeInteger(amount) || amount < 50) return json({ error: "Invalid payment amount" }, 400);

    const stripe = new Stripe(stripeSecret, { httpClient: Stripe.createFetchHttpClient() });
    // Test mode starts with platform charges. Connected merchant accounts are
    // only used after Stripe Connect onboarding is explicitly enabled.
    const connectedAccount = account?.stripe_connected_account_id
      && account.onboarding_status === "active"
      && account.charges_enabled
      ? account.stripe_connected_account_id
      : null;
    const fee = connectedAccount ? Math.floor(amount * Number(account?.platform_fee_bps || 0) / 10000) : 0;
    // A saved payment method is scoped to its Stripe Customer. Platform customers
    // cannot be reused inside a merchant's Connect direct charge, so only attach
    // the platform customer when this payment is processed on the platform.
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
        booking_id: booking.id,
        booking_code: booking.booking_code,
        merchant_user_id: booking.merchant_user_id,
        payment_environment: paymentEnvironment,
        payment_mode: connectedAccount ? "connected_account" : `platform_${paymentEnvironment}`,
      },
    }, {
      ...(connectedAccount ? { stripeAccount: connectedAccount } : {}),
      idempotencyKey: `rental-booking-${booking.id}`,
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

    await admin.from("merchant_rental_payment_attempts").insert({
      booking_id: booking.id,
      merchant_user_id: booking.merchant_user_id,
      user_id: user.id,
      provider: "stripe",
      provider_payment_id: intent.id,
      status: intent.status === "succeeded" ? "succeeded" : "requires_action",
      amount: Number(booking.total_amount),
      currency: "usd",
      metadata: { stripe_account_id: connectedAccount, payment_environment: paymentEnvironment },
    });
    await admin.from("merchant_rental_bookings").update({
      payment_provider: "stripe",
      payment_provider_reference: intent.id,
      payment_status: intent.status === "succeeded" ? "paid" : "processing",
      payment_method: paymentEnvironment === "test" ? "stripe_test" : "stripe",
      payment_paid_at: intent.status === "succeeded" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }).eq("id", booking.id);

    return json({
      client_secret: intent.client_secret,
      payment_intent_id: intent.id,
      publishable_key: publishableKey,
      payment_environment: paymentEnvironment,
      customer_session_client_secret: customerSession?.client_secret || null,
    });
  } catch (error) {
    console.error("rental-stripe-payment", error);
    return json({ error: "Unable to create payment" }, 500);
  }
});
