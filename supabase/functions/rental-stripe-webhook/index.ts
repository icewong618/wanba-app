import Stripe from "npm:stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

const paymentMethodName = async (stripe: Stripe, intent: Stripe.PaymentIntent) => {
  try {
    const paymentMethodId = typeof intent.payment_method === "string" ? intent.payment_method : intent.payment_method?.id;
    if (!paymentMethodId) return intent.payment_method_types?.[0] || "card";
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
    const wallet = paymentMethod.card?.wallet?.type;
    return wallet || paymentMethod.type || intent.payment_method_types?.[0] || "card";
  } catch (error) {
    console.warn("Unable to identify Stripe payment method", error);
    return intent.payment_method_types?.[0] || "card";
  }
};

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY") || "";
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";
  const url = Deno.env.get("SUPABASE_URL") || "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (!stripeSecret || !webhookSecret || !url || !serviceKey) return json({ error: "Webhook is not configured" }, 503);

  const stripe = new Stripe(stripeSecret, { httpClient: Stripe.createFetchHttpClient() });
  const signature = req.headers.get("stripe-signature") || "";
  let event: Stripe.Event;
  try {
    // Supabase Edge Functions run on Deno/Web Crypto, so use Stripe's async verifier.
    event = await stripe.webhooks.constructEventAsync(await req.text(), signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed", error);
    return json({ error: "Invalid Stripe signature" }, 400);
  }

  const admin = createClient(url, serviceKey);
  const intent = event.data.object as Stripe.PaymentIntent;
  const bookingId = String(intent.metadata?.booking_id || "");
  if (!bookingId) return json({ received: true });

  if (event.type === "payment_intent.succeeded") {
    const method = await paymentMethodName(stripe, intent);
    const isTest = String(intent.metadata?.payment_environment || "") !== "live";
    const storedMethod = `${isTest ? "stripe_test" : "stripe"}_${method}`;
    const paidAt = new Date().toISOString();
    await admin.from("merchant_rental_payment_attempts").update({
      status: "succeeded",
      metadata: { payment_environment: isTest ? "test" : "live", payment_method: method },
      updated_at: paidAt,
    }).eq("provider_payment_id", intent.id);
    await admin.from("merchant_rental_bookings").update({
      payment_status: "paid",
      payment_method: storedMethod,
      payment_paid_at: paidAt,
      updated_at: paidAt,
    }).eq("id", bookingId);
  }
  if (event.type === "payment_intent.payment_failed" || event.type === "payment_intent.canceled") {
    await admin.from("merchant_rental_payment_attempts").update({ status: "failed", failure_message: String(intent.last_payment_error?.message || "Payment failed"), updated_at: new Date().toISOString() }).eq("provider_payment_id", intent.id);
    await admin.from("merchant_rental_bookings").update({ payment_status: "failed", updated_at: new Date().toISOString() }).eq("id", bookingId);
  }
  return json({ received: true });
});
