-- 乐生活 v5.597：账户与交易中心
-- Stripe Customer 映射只供 Edge Function 使用；前端永远不读取卡号或完整支付方式。

create table if not exists public.user_payment_customers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  provider text not null default 'stripe' check (provider = 'stripe'),
  provider_customer_id text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_payment_customers enable row level security;
revoke all on public.user_payment_customers from anon, authenticated;

create or replace function public.customer_order_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public, auth, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'login_required';
  end if;

  return jsonb_build_object(
    'tickets', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', o.id,
        'order_code', o.order_code,
        'merchant_user_id', o.merchant_user_id,
        'merchant_name', m.business_name,
        'merchant_logo', m.logo,
        'event_title', e.title,
        'event_starts_at', e.starts_at,
        'location_text', e.location_text,
        'quantity', o.quantity,
        'total_amount', o.total_amount,
        'currency', o.currency,
        'payment_status', o.payment_status,
        'created_at', o.created_at,
        'tickets', coalesce((
          select jsonb_agg(jsonb_build_object(
            'ticket_code', t.ticket_code,
            'status', t.status,
            'holder_name', t.holder_name,
            'redeemed_at', t.redeemed_at
          ) order by t.created_at)
          from public.merchant_tickets t where t.order_id = o.id
        ), '[]'::jsonb)
      ) order by o.created_at desc)
      from public.merchant_ticket_orders o
      join public.merchant_ticket_events e on e.id = o.event_id
      left join public.merchants m on m.user_id = o.merchant_user_id
      where o.customer_user_id = v_user_id
    ), '[]'::jsonb),
    'auto_leads', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', lead.id,
        'merchant_user_id', lead.merchant_user_id,
        'merchant_name', m.business_name,
        'merchant_logo', m.logo,
        'lead_type', lead.lead_type,
        'status', lead.status,
        'listing_id', lead.listing_id,
        'listing_title', listing.title,
        'vehicle_data', lead.vehicle_data,
        'quoted_amount', lead.quoted_amount,
        'quote_expires_at', lead.quote_expires_at,
        'preferred_at', lead.preferred_at,
        'confirmed_at', lead.confirmed_at,
        'appointment_location', lead.appointment_location,
        'created_at', lead.created_at
      ) order by lead.created_at desc)
      from public.merchant_auto_leads lead
      left join public.merchants m on m.user_id = lead.merchant_user_id
      left join public.merchant_auto_listings listing on listing.id = lead.listing_id
      where lead.user_id = v_user_id
    ), '[]'::jsonb),
    'auto_sales', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', sale.id,
        'receipt_number', sale.receipt_number,
        'merchant_user_id', sale.merchant_user_id,
        'merchant_name', m.business_name,
        'merchant_logo', m.logo,
        'listing_id', sale.listing_id,
        'listing_title', listing.title,
        'sale_amount', sale.sale_amount,
        'sale_note', sale.sale_note,
        'status', sale.status,
        'completed_at', sale.completed_at,
        'created_at', sale.created_at
      ) order by sale.created_at desc)
      from public.merchant_auto_sales sale
      left join public.merchants m on m.user_id = sale.merchant_user_id
      left join public.merchant_auto_listings listing on listing.id = sale.listing_id
      where sale.customer_user_id = v_user_id
    ), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.customer_order_center() from public, anon;
grant execute on function public.customer_order_center() to authenticated;
