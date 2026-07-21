-- 乐生活 v5.401：二手车成交闭环。
-- 成交只可由对应商家完成；成交后车辆自动改为 sold，公开库存不再返回该车辆。

create table if not exists public.merchant_auto_sales (
  id uuid primary key default gen_random_uuid(),
  receipt_number text not null unique,
  merchant_user_id uuid not null references auth.users(id) on delete cascade,
  listing_id uuid not null unique references public.merchant_auto_listings(id) on delete restrict,
  lead_id uuid references public.merchant_auto_leads(id) on delete set null,
  customer_user_id uuid references auth.users(id) on delete set null,
  customer_name text not null check (char_length(customer_name) between 1 and 80),
  customer_phone text,
  sale_amount numeric(12,2) not null check (sale_amount >= 0),
  sale_note text,
  status text not null default 'completed' check (status in ('completed','voided')),
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists merchant_auto_sales_merchant_completed_idx
  on public.merchant_auto_sales (merchant_user_id, completed_at desc);
create index if not exists merchant_auto_sales_customer_completed_idx
  on public.merchant_auto_sales (customer_user_id, completed_at desc)
  where customer_user_id is not null;

alter table public.merchant_auto_sales enable row level security;

drop policy if exists "auto sales merchant or customer read 5.401" on public.merchant_auto_sales;
create policy "auto sales merchant or customer read 5.401"
  on public.merchant_auto_sales for select to authenticated
  using (
    public.merchant_auto_can_manage(merchant_user_id)
    or customer_user_id = (select auth.uid())
  );

alter table public.merchant_auto_leads
  drop constraint if exists merchant_auto_leads_status_check;
alter table public.merchant_auto_leads
  add constraint merchant_auto_leads_status_check
  check (status in (
    'new','contacted','scheduled','arrived','reschedule_requested','cancelled',
    'quoted','quote_accepted','quote_declined','closed','archived'
  ));

create or replace function public.merchant_auto_customer_confirm_test_drive(
  p_lead_id uuid
)
returns public.merchant_auto_leads
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  row public.merchant_auto_leads%rowtype;
begin
  select * into row from public.merchant_auto_leads where id = p_lead_id for update;
  if not found or row.user_id <> auth.uid() or row.lead_type <> 'test_drive' then
    raise exception 'test_drive_permission_denied';
  end if;
  if row.status <> 'scheduled' then
    raise exception 'test_drive_not_confirmable';
  end if;

  update public.merchant_auto_leads
  set status = 'arrived',
      customer_action = 'arrived',
      customer_action_note = null,
      customer_action_at = now(),
      updated_at = now()
  where id = row.id
  returning * into row;
  return row;
end;
$$;

create or replace function public.merchant_auto_complete_sale(
  p_listing_id uuid,
  p_lead_id uuid default null,
  p_customer_name text default null,
  p_customer_phone text default null,
  p_sale_amount numeric default null,
  p_sale_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  listing public.merchant_auto_listings%rowtype;
  lead public.merchant_auto_leads%rowtype;
  sale public.merchant_auto_sales%rowtype;
  buyer_name text;
  buyer_phone text;
  receipt text;
begin
  select * into listing from public.merchant_auto_listings where id = p_listing_id for update;
  if not found or not public.merchant_auto_can_manage(listing.merchant_user_id) then
    raise exception 'listing_permission_denied';
  end if;
  if listing.status not in ('available','reserved') then
    raise exception 'listing_not_saleable';
  end if;

  if p_lead_id is not null then
    select * into lead from public.merchant_auto_leads where id = p_lead_id for update;
    if not found or lead.merchant_user_id <> listing.merchant_user_id or lead.listing_id <> listing.id then
      raise exception 'sale_lead_mismatch';
    end if;
  end if;

  buyer_name := nullif(left(trim(coalesce(p_customer_name, lead.customer_name, '')), 80), '');
  buyer_phone := nullif(left(trim(coalesce(p_customer_phone, lead.customer_phone, '')), 40), '');
  if buyer_name is null then
    raise exception 'sale_customer_required';
  end if;
  if p_sale_amount is null or p_sale_amount < 0 then
    raise exception 'sale_amount_required';
  end if;

  receipt := 'LSA-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
  insert into public.merchant_auto_sales (
    receipt_number, merchant_user_id, listing_id, lead_id, customer_user_id,
    customer_name, customer_phone, sale_amount, sale_note
  ) values (
    receipt, listing.merchant_user_id, listing.id, p_lead_id,
    case when p_lead_id is null then null else lead.user_id end,
    buyer_name, buyer_phone, round(p_sale_amount, 2),
    nullif(left(trim(coalesce(p_sale_note, '')), 1500), '')
  ) returning * into sale;

  update public.merchant_auto_listings
  set status = 'sold', updated_at = now()
  where id = listing.id;

  if p_lead_id is not null then
    update public.merchant_auto_leads
    set status = 'closed', updated_at = now()
    where id = p_lead_id;
  end if;

  return jsonb_build_object(
    'id', sale.id,
    'receipt_number', sale.receipt_number,
    'listing_id', sale.listing_id,
    'customer_name', sale.customer_name,
    'sale_amount', sale.sale_amount,
    'completed_at', sale.completed_at
  );
end;
$$;

create or replace function public.merchant_auto_customer_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'login_required';
  end if;

  return jsonb_build_object(
    'saved', coalesce((
      select jsonb_agg(jsonb_build_object(
        'listing_id', listing.id, 'merchant_user_id', merchant.user_id,
        'merchant_name', merchant.business_name, 'merchant_slug', merchant.slug,
        'title', listing.title, 'make', listing.make, 'model', listing.model,
        'year', listing.year, 'price', listing.price, 'mileage', listing.mileage,
        'vehicle_type', listing.vehicle_type, 'fuel_type', listing.fuel_type,
        'transmission', listing.transmission, 'photos', listing.photos,
        'status', listing.status, 'saved_at', saved.created_at
      ) order by saved.created_at desc)
      from public.merchant_auto_saved_listings saved
      join public.merchant_auto_listings listing on listing.id = saved.listing_id
      join public.merchants merchant on merchant.user_id = saved.merchant_user_id
      where saved.user_id = current_user_id
    ), '[]'::jsonb),
    'leads', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', lead.id, 'merchant_user_id', merchant.user_id,
        'merchant_name', merchant.business_name, 'merchant_slug', merchant.slug,
        'lead_type', lead.lead_type, 'status', lead.status, 'created_at', lead.created_at,
        'vehicle_data', lead.vehicle_data, 'photos', lead.photos,
        'quoted_amount', lead.quoted_amount, 'quote_expires_at', lead.quote_expires_at,
        'quote_response', lead.quote_response, 'quote_responded_at', lead.quote_responded_at,
        'merchant_note', lead.merchant_note, 'listing_id', lead.listing_id,
        'listing_title', listing.title, 'preferred_at', lead.preferred_at,
        'confirmed_at', lead.confirmed_at, 'appointment_location', lead.appointment_location,
        'customer_action', lead.customer_action, 'customer_action_note', lead.customer_action_note
      ) order by lead.created_at desc)
      from public.merchant_auto_leads lead
      join public.merchants merchant on merchant.user_id = lead.merchant_user_id
      left join public.merchant_auto_listings listing on listing.id = lead.listing_id
      where lead.user_id = current_user_id
    ), '[]'::jsonb),
    'sales', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', sale.id, 'receipt_number', sale.receipt_number,
        'merchant_name', merchant.business_name, 'merchant_slug', merchant.slug,
        'listing_title', listing.title, 'sale_amount', sale.sale_amount,
        'status', sale.status, 'completed_at', sale.completed_at
      ) order by sale.completed_at desc)
      from public.merchant_auto_sales sale
      join public.merchants merchant on merchant.user_id = sale.merchant_user_id
      join public.merchant_auto_listings listing on listing.id = sale.listing_id
      where sale.customer_user_id = current_user_id
    ), '[]'::jsonb)
  );
end;
$$;

create or replace function public.merchant_auto_manager_list(p_merchant_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.merchant_auto_can_manage(p_merchant_user_id) then
    raise exception 'merchant_permission_denied';
  end if;
  return jsonb_build_object(
    'listings', coalesce((select jsonb_agg(to_jsonb(a) order by a.updated_at desc) from public.merchant_auto_listings a where a.merchant_user_id = p_merchant_user_id), '[]'::jsonb),
    'leads', coalesce((select jsonb_agg(to_jsonb(l) order by case l.status when 'new' then 0 when 'arrived' then 1 when 'scheduled' then 2 else 3 end, l.created_at desc) from public.merchant_auto_leads l where l.merchant_user_id = p_merchant_user_id), '[]'::jsonb),
    'sales', coalesce((select jsonb_agg(to_jsonb(s) order by s.completed_at desc) from public.merchant_auto_sales s where s.merchant_user_id = p_merchant_user_id), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.merchant_auto_customer_confirm_test_drive(uuid) from public;
revoke all on function public.merchant_auto_customer_confirm_test_drive(uuid) from anon;
grant execute on function public.merchant_auto_customer_confirm_test_drive(uuid) to authenticated;
revoke all on function public.merchant_auto_complete_sale(uuid,uuid,text,text,numeric,text) from public;
revoke all on function public.merchant_auto_complete_sale(uuid,uuid,text,text,numeric,text) from anon;
grant execute on function public.merchant_auto_complete_sale(uuid,uuid,text,text,numeric,text) to authenticated;
revoke all on function public.merchant_auto_customer_center() from anon, public;
grant execute on function public.merchant_auto_customer_center() to authenticated;
revoke all on function public.merchant_auto_manager_list(uuid) from public;
revoke all on function public.merchant_auto_manager_list(uuid) from anon;
grant execute on function public.merchant_auto_manager_list(uuid) to authenticated;
