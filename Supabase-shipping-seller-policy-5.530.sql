-- 乐生活 v5.530：物流中心、卖家额度与扫码录入第一版。
-- 本文件只建立记录、额度和风险预检；不购买承运商面单，也不保存银行卡资料。

create table if not exists public.shipping_seller_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  seller_type text not null default 'individual'
    check (seller_type in ('individual', 'professional', 'merchant')),
  seller_stage text not null default 'new'
    check (seller_stage in ('new', 'standard_1', 'standard_2', 'professional_1', 'professional_2', 'professional_3', 'merchant')),
  access_status text not null default 'active'
    check (access_status in ('active', 'restricted', 'suspended')),
  monthly_platform_label_limit integer not null default 3 check (monthly_platform_label_limit >= 0),
  daily_platform_label_limit integer not null default 1 check (daily_platform_label_limit >= 0),
  max_item_value_cents integer not null default 100000 check (max_item_value_cents >= 0),
  shipping_reserve_cents integer not null default 0 check (shipping_reserve_cents >= 0),
  pending_postage_cents integer not null default 0 check (pending_postage_cents >= 0),
  clean_order_count integer not null default 0 check (clean_order_count >= 0),
  stage_clean_order_count integer not null default 0 check (stage_clean_order_count >= 0),
  last_platform_label_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.shipping_label_orders (
  id uuid primary key default gen_random_uuid(),
  seller_user_id uuid not null references auth.users(id) on delete cascade,
  label_source text not null default 'platform'
    check (label_source in ('platform', 'self')),
  external_order_ref text,
  tracking_number text,
  carrier text,
  service_name text,
  status text not null default 'draft'
    check (status in ('draft', 'label_created', 'in_transit', 'delivered', 'dispute_window', 'settled', 'adjustment_due', 'void', 'failed')),
  item_value_cents integer not null default 0 check (item_value_cents >= 0),
  estimated_postage_cents integer not null default 0 check (estimated_postage_cents >= 0),
  final_postage_cents integer,
  postage_adjustment_cents integer not null default 0,
  parcel jsonb not null default '{}'::jsonb check (jsonb_typeof(parcel) = 'object'),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists shipping_label_orders_tracking_unique
  on public.shipping_label_orders (seller_user_id, tracking_number)
  where tracking_number is not null and length(trim(tracking_number)) > 0;
create index if not exists shipping_label_orders_seller_created_idx
  on public.shipping_label_orders (seller_user_id, created_at desc);
create index if not exists shipping_label_orders_seller_status_idx
  on public.shipping_label_orders (seller_user_id, status, created_at desc);

create table if not exists public.shipping_barcode_scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label_order_id uuid references public.shipping_label_orders(id) on delete cascade,
  scan_kind text not null check (scan_kind in ('product', 'tracking')),
  barcode_value text not null check (char_length(trim(barcode_value)) between 3 and 160),
  barcode_format text,
  product_name text,
  created_at timestamptz not null default now()
);
create index if not exists shipping_barcode_scans_user_created_idx
  on public.shipping_barcode_scans (user_id, created_at desc);

create table if not exists public.shipping_postage_ledger (
  id uuid primary key default gen_random_uuid(),
  seller_user_id uuid not null references auth.users(id) on delete cascade,
  label_order_id uuid references public.shipping_label_orders(id) on delete set null,
  entry_type text not null check (entry_type in ('reserve_funding', 'label_charge', 'carrier_adjustment', 'order_proceeds_offset', 'refund', 'manual_adjustment')),
  amount_cents integer not null,
  balance_after_cents integer,
  note text,
  created_at timestamptz not null default now()
);
create index if not exists shipping_postage_ledger_seller_created_idx
  on public.shipping_postage_ledger (seller_user_id, created_at desc);

alter table public.shipping_seller_profiles enable row level security;
alter table public.shipping_label_orders enable row level security;
alter table public.shipping_barcode_scans enable row level security;
alter table public.shipping_postage_ledger enable row level security;

drop policy if exists "shipping seller profile read own 5.530" on public.shipping_seller_profiles;
create policy "shipping seller profile read own 5.530"
on public.shipping_seller_profiles for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "shipping own orders read 5.530" on public.shipping_label_orders;
create policy "shipping own orders read 5.530"
on public.shipping_label_orders for select to authenticated
using ((select auth.uid()) = seller_user_id);

drop policy if exists "shipping own scans read 5.530" on public.shipping_barcode_scans;
create policy "shipping own scans read 5.530"
on public.shipping_barcode_scans for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "shipping own ledger read 5.530" on public.shipping_postage_ledger;
create policy "shipping own ledger read 5.530"
on public.shipping_postage_ledger for select to authenticated
using ((select auth.uid()) = seller_user_id);

revoke all on public.shipping_seller_profiles, public.shipping_label_orders, public.shipping_barcode_scans, public.shipping_postage_ledger from anon, public;
grant select on public.shipping_seller_profiles, public.shipping_label_orders, public.shipping_barcode_scans, public.shipping_postage_ledger to authenticated;

create or replace function public.shipping_ensure_seller_profile()
returns public.shipping_seller_profiles
language plpgsql security definer set search_path = public, pg_temp as $$
declare row public.shipping_seller_profiles%rowtype;
begin
  if auth.uid() is null then raise exception 'authentication_required'; end if;
  insert into public.shipping_seller_profiles(user_id)
  values (auth.uid())
  on conflict (user_id) do nothing;
  select * into row from public.shipping_seller_profiles where user_id = auth.uid();
  return row;
end;
$$;

create or replace function public.shipping_seller_dashboard()
returns jsonb
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  profile public.shipping_seller_profiles%rowtype;
  month_count integer;
  day_count integer;
  unresolved integer;
  can_create boolean;
  reason text := '';
begin
  select * into profile from public.shipping_ensure_seller_profile();
  select count(*) into month_count from public.shipping_label_orders
    where seller_user_id = auth.uid() and label_source = 'platform'
      and status not in ('void','failed')
      and created_at >= date_trunc('month', now());
  select count(*) into day_count from public.shipping_label_orders
    where seller_user_id = auth.uid() and label_source = 'platform'
      and status not in ('void','failed')
      and created_at >= date_trunc('day', now());
  select count(*) into unresolved from public.shipping_label_orders
    where seller_user_id = auth.uid() and label_source = 'platform'
      and status in ('draft','label_created','in_transit','delivered','dispute_window','adjustment_due');
  can_create := profile.access_status = 'active' and profile.pending_postage_cents = 0;
  if profile.access_status <> 'active' then reason := '当前账号的在线发货功能需要审核或已被限制。';
  elsif profile.pending_postage_cents > 0 then reason := '请先补足待结算邮资，才能继续购买乐生活面单。';
  elsif month_count >= profile.monthly_platform_label_limit then reason := '本月乐生活面单额度已用完。'; can_create := false;
  elsif day_count >= profile.daily_platform_label_limit then reason := '今日乐生活面单额度已用完。'; can_create := false;
  elsif profile.seller_stage = 'new' and unresolved > 0 then reason := '首单尚未完成，完成且无争议后才能购买下一张乐生活面单。'; can_create := false;
  end if;
  return jsonb_build_object(
    'profile', to_jsonb(profile),
    'usage', jsonb_build_object('month_count',month_count,'day_count',day_count,'unresolved_platform_orders',unresolved),
    'can_create_platform_label', can_create,
    'restriction_reason', reason,
    'labels', coalesce((select jsonb_agg(to_jsonb(row) order by row.created_at desc) from (
      select * from public.shipping_label_orders where seller_user_id = auth.uid() order by created_at desc limit 30
    ) row), '[]'::jsonb),
    'scans', coalesce((select jsonb_agg(to_jsonb(row) order by row.created_at desc) from (
      select * from public.shipping_barcode_scans where user_id = auth.uid() order by created_at desc limit 30
    ) row), '[]'::jsonb),
    'ledger', coalesce((select jsonb_agg(to_jsonb(row) order by row.created_at desc) from (
      select * from public.shipping_postage_ledger where seller_user_id = auth.uid() order by created_at desc limit 30
    ) row), '[]'::jsonb)
  );
end;
$$;

create or replace function public.shipping_create_label_draft(
  p_order_ref text default null,
  p_item_value_cents integer default 0,
  p_estimated_postage_cents integer default 0,
  p_parcel jsonb default '{}'::jsonb,
  p_note text default null
)
returns public.shipping_label_orders
language plpgsql security definer set search_path = public, pg_temp as $$
declare profile public.shipping_seller_profiles%rowtype; row public.shipping_label_orders%rowtype; month_count integer; day_count integer; unresolved integer;
begin
  select * into profile from public.shipping_ensure_seller_profile();
  if profile.access_status <> 'active' then raise exception 'shipping_account_restricted'; end if;
  if profile.pending_postage_cents > 0 then raise exception 'postage_balance_due'; end if;
  if coalesce(p_item_value_cents,0) > profile.max_item_value_cents then raise exception 'item_value_limit'; end if;
  select count(*) into month_count from public.shipping_label_orders where seller_user_id=auth.uid() and label_source='platform' and status not in ('void','failed') and created_at >= date_trunc('month',now());
  select count(*) into day_count from public.shipping_label_orders where seller_user_id=auth.uid() and label_source='platform' and status not in ('void','failed') and created_at >= date_trunc('day',now());
  select count(*) into unresolved from public.shipping_label_orders where seller_user_id=auth.uid() and label_source='platform' and status in ('draft','label_created','in_transit','delivered','dispute_window','adjustment_due');
  if month_count >= profile.monthly_platform_label_limit then raise exception 'monthly_label_limit'; end if;
  if day_count >= profile.daily_platform_label_limit then raise exception 'daily_label_limit'; end if;
  if profile.seller_stage='new' and unresolved > 0 then raise exception 'first_order_not_completed'; end if;
  insert into public.shipping_label_orders(seller_user_id,label_source,external_order_ref,item_value_cents,estimated_postage_cents,parcel,note)
  values(auth.uid(),'platform',nullif(left(trim(coalesce(p_order_ref,'')),80),''),greatest(0,coalesce(p_item_value_cents,0)),greatest(0,coalesce(p_estimated_postage_cents,0)),coalesce(p_parcel,'{}'::jsonb),nullif(left(trim(coalesce(p_note,'')),500),''))
  returning * into row;
  update public.shipping_seller_profiles set last_platform_label_at=now(),updated_at=now() where user_id=auth.uid();
  return row;
end;
$$;

create or replace function public.shipping_record_self_tracking(
  p_order_ref text,
  p_tracking_number text,
  p_carrier text default null,
  p_note text default null
)
returns public.shipping_label_orders
language plpgsql security definer set search_path = public, pg_temp as $$
declare row public.shipping_label_orders%rowtype; tracking text := upper(trim(coalesce(p_tracking_number,'')));
begin
  perform public.shipping_ensure_seller_profile();
  if length(tracking) < 5 then raise exception 'tracking_number_required'; end if;
  insert into public.shipping_label_orders(seller_user_id,label_source,external_order_ref,tracking_number,carrier,status,note)
  values(auth.uid(),'self',nullif(left(trim(coalesce(p_order_ref,'')),80),''),left(tracking,160),nullif(left(trim(coalesce(p_carrier,'')),48),''),'label_created',nullif(left(trim(coalesce(p_note,'')),500),''))
  returning * into row;
  insert into public.shipping_barcode_scans(user_id,label_order_id,scan_kind,barcode_value,barcode_format)
  values(auth.uid(),row.id,'tracking',tracking,'manual_or_camera');
  return row;
end;
$$;

create or replace function public.shipping_record_barcode_scan(
  p_scan_kind text,
  p_barcode_value text,
  p_barcode_format text default null,
  p_product_name text default null,
  p_label_order_id uuid default null
)
returns public.shipping_barcode_scans
language plpgsql security definer set search_path = public, pg_temp as $$
declare row public.shipping_barcode_scans%rowtype; code text := trim(coalesce(p_barcode_value,''));
begin
  perform public.shipping_ensure_seller_profile();
  if p_scan_kind not in ('product','tracking') then raise exception 'invalid_scan_kind'; end if;
  if length(code) < 3 then raise exception 'barcode_required'; end if;
  if p_label_order_id is not null and not exists(select 1 from public.shipping_label_orders where id=p_label_order_id and seller_user_id=auth.uid()) then raise exception 'label_not_found'; end if;
  insert into public.shipping_barcode_scans(user_id,label_order_id,scan_kind,barcode_value,barcode_format,product_name)
  values(auth.uid(),p_label_order_id,p_scan_kind,left(code,160),nullif(left(trim(coalesce(p_barcode_format,'')),40),''),nullif(left(trim(coalesce(p_product_name,'')),120),''))
  returning * into row;
  return row;
end;
$$;

-- Carrier webhook or a future trusted shipping service changes a label to settled.
-- Only then does a clean completed order advance a seller's platform-label stage.
create or replace function public.shipping_apply_clean_order_stage()
returns trigger
language plpgsql security definer set search_path = public, pg_temp as $$
declare profile public.shipping_seller_profiles%rowtype;
begin
  if new.label_source <> 'platform' or new.status <> 'settled' or old.status = 'settled' then return new; end if;
  insert into public.shipping_seller_profiles(user_id) values(new.seller_user_id) on conflict(user_id) do nothing;
  select * into profile from public.shipping_seller_profiles where user_id=new.seller_user_id for update;
  update public.shipping_seller_profiles
  set clean_order_count = clean_order_count + 1,
      seller_stage = case
        when profile.seller_stage = 'new' and profile.clean_order_count + 1 >= 3 then 'standard_1'
        when profile.seller_stage = 'standard_1' and profile.stage_clean_order_count + 1 >= 5 then 'standard_2'
        else profile.seller_stage
      end,
      monthly_platform_label_limit = case
        when profile.seller_stage = 'new' and profile.clean_order_count + 1 >= 3 then 5
        when profile.seller_stage = 'standard_1' and profile.stage_clean_order_count + 1 >= 5 then 10
        else monthly_platform_label_limit
      end,
      daily_platform_label_limit = case
        when profile.seller_stage = 'new' and profile.clean_order_count + 1 >= 3 then 1
        when profile.seller_stage = 'standard_1' and profile.stage_clean_order_count + 1 >= 5 then 2
        else daily_platform_label_limit
      end,
      stage_clean_order_count = case
        when (profile.seller_stage = 'new' and profile.clean_order_count + 1 >= 3)
          or (profile.seller_stage = 'standard_1' and profile.stage_clean_order_count + 1 >= 5) then 0
        else stage_clean_order_count + 1
      end,
      updated_at = now()
  where user_id = new.seller_user_id;
  return new;
end;
$$;

drop trigger if exists shipping_clean_order_stage_5_530 on public.shipping_label_orders;
create trigger shipping_clean_order_stage_5_530
after update of status on public.shipping_label_orders
for each row execute function public.shipping_apply_clean_order_stage();

revoke all on function public.shipping_ensure_seller_profile() from public;
revoke all on function public.shipping_seller_dashboard() from public;
revoke all on function public.shipping_create_label_draft(text,integer,integer,jsonb,text) from public;
revoke all on function public.shipping_record_self_tracking(text,text,text,text) from public;
revoke all on function public.shipping_record_barcode_scan(text,text,text,text,uuid) from public;
revoke all on function public.shipping_apply_clean_order_stage() from public;
revoke execute on function public.shipping_apply_clean_order_stage() from anon, authenticated;
revoke execute on function public.shipping_ensure_seller_profile() from anon, authenticated;
grant execute on function public.shipping_seller_dashboard() to authenticated;
grant execute on function public.shipping_create_label_draft(text,integer,integer,jsonb,text) to authenticated;
grant execute on function public.shipping_record_self_tracking(text,text,text,text) to authenticated;
grant execute on function public.shipping_record_barcode_scan(text,text,text,text,uuid) to authenticated;
