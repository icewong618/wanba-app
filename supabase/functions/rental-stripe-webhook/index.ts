import Stripe from "npm:stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

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
    await admin.from("merchant_rental_payment_attempts").update({ status: "succeeded", updated_at: new Date().toISOString() }).eq("provider_payment_id", intent.id);
    await admin.from("merchant_rental_bookings").update({ payment_status: "paid", payment_paid_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", bookingId);
  }
  if (event.type === "payment_intent.payment_failed" || event.type === "payment_intent.canceled") {
    await admin.from("merchant_rental_payment_attempts").update({ status: "failed", failure_message: String(intent.last_payment_error?.message || "Payment failed"), updated_at: new Date().toISOString() }).eq("provider_payment_id", intent.id);
    await admin.from("merchant_rental_bookings").update({ payment_status: "failed", updated_at: new Date().toISOString() }).eq("id", bookingId);
  }
  return json({ received: true });
});
