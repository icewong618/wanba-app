import Stripe from "npm:stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if(req.method === "OPTIONS") return new Response("ok", { headers:corsHeaders });
  if(req.method !== "POST") return json({ error:"Method not allowed" },405);
  const authorization=req.headers.get("Authorization")||"";
  if(!authorization.startsWith("Bearer ")) return json({ error:"Login required" },401);
  const url=Deno.env.get("SUPABASE_URL")||"", anonKey=Deno.env.get("SUPABASE_ANON_KEY")||"", serviceKey=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")||"", stripeSecret=Deno.env.get("STRIPE_SECRET_KEY")||"", publishableKey=Deno.env.get("STRIPE_PUBLISHABLE_KEY")||"";
  if(!url||!anonKey||!serviceKey||!stripeSecret) return json({ error:"Payment service is not configured" },503);
  const environment=stripeSecret.startsWith("sk_live_")?"live":"test";
  if(!publishableKey.startsWith(environment==="live"?"pk_live_":"pk_test_")) return json({ error:"Stripe key mode mismatch" },503);
  const userClient=createClient(url,anonKey,{global:{headers:{Authorization:authorization}}});
  const {data:auth,error:authError}=await userClient.auth.getUser(authorization.slice(7));
  if(authError||!auth.user) return json({ error:"Login expired, please sign in again" },401);
  try{
    const body=await req.json(), orderId=String(body?.order_id||"").trim();
    if(!orderId) return json({ error:"Missing order" },400);
    const admin=createClient(url,serviceKey);
    const {data:order,error:orderError}=await admin.from("merchant_ticket_orders").select("id,order_code,merchant_user_id,user_id:customer_user_id,total_amount,currency,payment_status,payment_provider_reference,payment_expires_at").eq("id",orderId).maybeSingle();
    if(orderError||!order||order.user_id!==auth.user.id) return json({ error:"Order not found" },404);
    if(order.payment_status==="paid"||order.payment_status==="free") return json({ error:"This order has already been paid" },409);
    if(order.payment_status==="cancelled"||order.payment_status==="refunded") return json({ error:"This order can no longer be paid" },409);
    if(order.payment_expires_at && new Date(order.payment_expires_at).getTime()<=Date.now()) {
      await admin.from("merchant_ticket_orders").update({payment_status:"cancelled",updated_at:new Date().toISOString()}).eq("id",order.id);
      await admin.rpc("merchant_ticket_release_order_seats",{p_order_id:order.id});
      return json({ error:"This payment reservation has expired. Please create a new order." },409);
    }
    const amount=Math.round(Number(order.total_amount||0)*100);
    if(!Number.isSafeInteger(amount)||amount<50) return json({ error:"Invalid payment amount" },400);
    const {data:account}=await admin.from("merchant_payment_accounts").select("stripe_connected_account_id,onboarding_status,charges_enabled,platform_fee_bps").eq("merchant_user_id",order.merchant_user_id).eq("provider","stripe").maybeSingle();
    const connected=account?.stripe_connected_account_id&&account.onboarding_status==="active"&&account.charges_enabled?account.stripe_connected_account_id:null;
    if(environment==="live"&&!connected) return json({ error:"This merchant must complete Stripe Connect before accepting live ticket payments." },409);
    const fee=connected?Math.floor(amount*Math.max(0,Number(account?.platform_fee_bps||0))/10000):0;
    const stripe=new Stripe(stripeSecret,{httpClient:Stripe.createFetchHttpClient()});
    // Saved payment methods belong to the platform Customer. Do not attach that
    // customer to a Connect direct charge because connected accounts are isolated.
    let customerId="";
    if(!connected){
      const {data:storedCustomer}=await admin.from("user_payment_customers").select("provider_customer_id").eq("user_id",auth.user.id).maybeSingle();
      customerId=storedCustomer?.provider_customer_id||"";
      if(!customerId){
        const customer=await stripe.customers.create({email:auth.user.email||undefined,metadata:{supabase_user_id:auth.user.id}});
        const {error:customerError}=await admin.from("user_payment_customers").upsert({user_id:auth.user.id,provider:"stripe",provider_customer_id:customer.id,updated_at:new Date().toISOString()});
        if(customerError)throw customerError;
        customerId=customer.id;
      }
    }
    const intent=await stripe.paymentIntents.create({amount,currency:String(order.currency||"usd").toLowerCase(),automatic_payment_methods:{enabled:true},customer:customerId||undefined,application_fee_amount:fee||undefined,metadata:{ticket_order_id:order.id,ticket_order_code:order.order_code,merchant_user_id:order.merchant_user_id,payment_environment:environment,payment_mode:connected?"connected_account":`platform_${environment}`}}, {...(connected?{stripeAccount:connected}:{}),idempotencyKey:`ticket-order-${order.id}`});
    const customerSession=customerId?await stripe.customerSessions.create({customer:customerId,components:{payment_element:{enabled:true,features:{payment_method_redisplay:"enabled",payment_method_save:"enabled",payment_method_save_usage:"off_session",payment_method_remove:"enabled"}}}}):null;
    await admin.from("merchant_ticket_payment_attempts").upsert({order_id:order.id,merchant_user_id:order.merchant_user_id,user_id:auth.user.id,provider:"stripe",provider_payment_id:intent.id,status:intent.status==="succeeded"?"succeeded":"requires_action",amount:Number(order.total_amount),currency:String(order.currency||"usd"),metadata:{stripe_account_id:connected,payment_environment:environment}}, {onConflict:"provider_payment_id"});
    await admin.from("merchant_ticket_orders").update({payment_provider:"stripe",payment_provider_reference:intent.id,payment_status:intent.status==="succeeded"?"processing":"processing",updated_at:new Date().toISOString()}).eq("id",order.id);
    return json({client_secret:intent.client_secret,payment_intent_id:intent.id,publishable_key:publishableKey,payment_environment:environment,customer_session_client_secret:customerSession?.client_secret||null});
  }catch(error){console.error("ticket-stripe-payment",error);return json({ error:"Unable to create payment" },500)}
});
