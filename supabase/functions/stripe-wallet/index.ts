import Stripe from "npm:stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, prefer",
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
  if (!url || !anonKey || !serviceKey || !stripeSecret || !publishableKey) return json({ error: "Wallet service is not configured" }, 503);
  const environment = stripeSecret.startsWith("sk_live_") ? "live" : "test";
  if (!publishableKey.startsWith(environment === "live" ? "pk_live_" : "pk_test_")) return json({ error: "Stripe key mode mismatch" }, 503);

  const token = authorization.slice(7);
  const userClient = createClient(url, anonKey, { global: { headers: { Authorization: authorization } } });
  const { data: auth, error: authError } = await userClient.auth.getUser(token);
  const user = auth.user;
  if (authError || !user) return json({ error: "Login expired" }, 401);

  const admin = createClient(url, serviceKey);
  const stripe = new Stripe(stripeSecret, { httpClient: Stripe.createFetchHttpClient() });
  try {
    const body = await req.json();
    const action = String(body?.action || "list");
    let { data: stored } = await admin.from("user_payment_customers").select("provider_customer_id").eq("user_id", user.id).maybeSingle();
    let customerId = stored?.provider_customer_id || "";
    const ensureCustomer = async () => {
      if (customerId) return customerId;
      const customer = await stripe.customers.create({ email: user.email || undefined, metadata: { supabase_user_id: user.id } });
      const { error } = await admin.from("user_payment_customers").upsert({ user_id: user.id, provider: "stripe", provider_customer_id: customer.id, updated_at: new Date().toISOString() });
      if (error) throw error;
      customerId = customer.id;
      return customerId;
    };
    if (action === "list") {
      if (!customerId) return json({ methods: [], payment_environment: environment, publishable_key: publishableKey });
      const methods = await stripe.paymentMethods.list({ customer: customerId, type: "card" });
      return json({ methods: methods.data.map(method => ({ id: method.id, brand: method.card?.brand || "card", last4: method.card?.last4 || "", exp_month: method.card?.exp_month || null, exp_year: method.card?.exp_year || null })), payment_environment: environment, publishable_key: publishableKey });
    }
    if (action === "setup") {
      const customer = await ensureCustomer();
      const intent = await stripe.setupIntents.create({ customer, usage: "off_session", automatic_payment_methods: { enabled: true }, metadata: { supabase_user_id: user.id, payment_environment: environment } });
      return json({ client_secret: intent.client_secret, publishable_key: publishableKey, payment_environment: environment });
    }
    if (action === "detach") {
      const methodId = String(body?.payment_method_id || "");
      if (!customerId || !methodId) return json({ error: "Payment method not found" }, 404);
      const method = await stripe.paymentMethods.retrieve(methodId);
      if (method.customer !== customerId) return json({ error: "Payment method not found" }, 404);
      await stripe.paymentMethods.detach(methodId);
      return json({ ok: true });
    }
    return json({ error: "Unknown action" }, 400);
  } catch (error) {
    console.error("stripe-wallet", error);
    return json({ error: "Wallet request failed" }, 500);
  }
});
