-- 乐生活 5.359：Stripe Connect 租车支付接入准备
-- 本迁移只建立支付记录和安全接口所需数据；不会保存 Stripe 私钥或银行卡资料。

alter table public.merchant_rental_bookings
  add column if not exists payment_provider text not null default 'manual'
    check (payment_provider in ('manual', 'stripe')),
  add column if not exists payment_provider_reference text,
  add column if not exists payment_paid_at timestamptz,
  add column if not exists refund_provider_reference text;

alter table public.merchant_rental_bookings
  drop constraint if exists merchant_rental_bookings_payment_status_check;

alter table public.merchant_rental_bookings
  add constraint merchant_rental_bookings_payment_status_check
  check (payment_status in ('pending', 'processing', 'paid', 'failed', 'refund_pending', 'refunded', 'partial_refund', 'waived'));

create unique index if not exists merchant_rental_bookings_provider_reference_key
  on public.merchant_rental_bookings (payment_provider, payment_provider_reference)
  where payment_provider_reference is not null;

create table if not exists public.merchant_payment_accounts (
  merchant_user_id uuid primary key references auth.users(id) on delete cascade,
  provider text not null default 'stripe' check (provider in ('stripe')),
  stripe_connected_account_id text unique,
  onboarding_status text not null default 'not_started'
    check (onboarding_status in ('not_started', 'pending', 'active', 'restricted', 'disabled')),
  charges_enabled boolean not null default false,
  payouts_enabled boolean not null default false,
  platform_fee_bps integer not null default 0 check (platform_fee_bps between 0 and 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.merchant_rental_payment_attempts (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.merchant_rental_bookings(id) on delete cascade,
  merchant_user_id uuid not null references auth.users(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  provider text not null check (provider in ('stripe', 'manual')),
  provider_payment_id text,
  status text not null default 'created'
    check (status in ('created', 'requires_action', 'processing', 'succeeded', 'failed', 'refund_pending', 'refunded')),
  amount numeric(10,2) not null check (amount >= 0),
  currency text not null default 'usd' check (currency = lower(currency)),
  failure_message text,
  refunded_amount numeric(10,2) not null default 0 check (refunded_amount >= 0),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists merchant_rental_payment_attempts_provider_payment_key
  on public.merchant_rental_payment_attempts(provider, provider_payment_id)
  where provider_payment_id is not null;
create index if not exists merchant_rental_payment_attempts_booking_created_idx
  on public.merchant_rental_payment_attempts(booking_id, created_at desc);

alter table public.merchant_payment_accounts enable row level security;
alter table public.merchant_rental_payment_attempts enable row level security;

drop policy if exists "merchant owns payment account" on public.merchant_payment_accounts;
create policy "merchant owns payment account" on public.merchant_payment_accounts
  for select to authenticated
  using (merchant_user_id = (select auth.uid()));

drop policy if exists "rental payment parties can read attempts" on public.merchant_rental_payment_attempts;
create policy "rental payment parties can read attempts" on public.merchant_rental_payment_attempts
  for select to authenticated
  using (
    user_id = (select auth.uid())
    or public.merchant_rental_can_manage(merchant_user_id)
  );

revoke all on public.merchant_payment_accounts from anon, authenticated;
revoke all on public.merchant_rental_payment_attempts from anon, authenticated;
grant select on public.merchant_payment_accounts to authenticated;
grant select on public.merchant_rental_payment_attempts to authenticated;
