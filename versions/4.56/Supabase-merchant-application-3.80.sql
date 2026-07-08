-- 乐生活 3.80：商家自助认证申请 / 管理审核
-- 执行位置：Supabase SQL Editor
-- 依赖：已存在 auth.users；管理员沿用 public.deal_admins 表

create table if not exists public.merchants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  business_name text,
  category text,
  subcategory text,
  address text,
  phone text,
  perks jsonb default '[]'::jsonb,
  loyalty_target integer default 8,
  loyalty_reward text default '免费一杯',
  logo text,
  cover_image text,
  verified boolean default false,
  verified_at timestamptz,
  verification_status text default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.merchants add column if not exists user_id uuid;
alter table public.merchants add column if not exists business_name text;
alter table public.merchants add column if not exists category text;
alter table public.merchants add column if not exists subcategory text;
alter table public.merchants add column if not exists address text;
alter table public.merchants add column if not exists phone text;
alter table public.merchants add column if not exists perks jsonb default '[]'::jsonb;
alter table public.merchants add column if not exists loyalty_target integer default 8;
alter table public.merchants add column if not exists loyalty_reward text default '免费一杯';
alter table public.merchants add column if not exists logo text;
alter table public.merchants add column if not exists cover_image text;
alter table public.merchants add column if not exists verified boolean default false;
alter table public.merchants add column if not exists verified_at timestamptz;
alter table public.merchants add column if not exists verification_status text default 'draft';
alter table public.merchants add column if not exists created_at timestamptz default now();
alter table public.merchants add column if not exists updated_at timestamptz default now();

create table if not exists public.merchant_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_email text,
  status text not null default 'pending',
  business_name text not null,
  category text,
  subcategory text,
  address text not null,
  phone text not null,
  contact_name text not null,
  contact_email text not null,
  license_note text,
  review_note text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.merchant_applications add column if not exists user_email text;
alter table public.merchant_applications add column if not exists status text not null default 'pending';
alter table public.merchant_applications add column if not exists business_name text;
alter table public.merchant_applications add column if not exists category text;
alter table public.merchant_applications add column if not exists subcategory text;
alter table public.merchant_applications add column if not exists address text;
alter table public.merchant_applications add column if not exists phone text;
alter table public.merchant_applications add column if not exists contact_name text;
alter table public.merchant_applications add column if not exists contact_email text;
alter table public.merchant_applications add column if not exists license_note text;
alter table public.merchant_applications add column if not exists review_note text;
alter table public.merchant_applications add column if not exists reviewed_by uuid;
alter table public.merchant_applications add column if not exists reviewed_at timestamptz;
alter table public.merchant_applications add column if not exists created_at timestamptz default now();
alter table public.merchant_applications add column if not exists updated_at timestamptz default now();

alter table public.merchant_applications
  drop constraint if exists merchant_applications_status_check;

alter table public.merchant_applications
  add constraint merchant_applications_status_check
  check (status in ('pending', 'approved', 'rejected'));

create index if not exists merchant_applications_user_idx
on public.merchant_applications (user_id, created_at desc);

create index if not exists merchant_applications_status_idx
on public.merchant_applications (status, created_at asc);

alter table public.merchants enable row level security;
alter table public.merchant_applications enable row level security;

drop policy if exists "merchants public verified read 3.80" on public.merchants;
create policy "merchants public verified read 3.80"
on public.merchants
for select
to anon, authenticated
using (verified = true);

drop policy if exists "merchants owner read 3.80" on public.merchants;
create policy "merchants owner read 3.80"
on public.merchants
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "merchants owner insert 3.80" on public.merchants;
create policy "merchants owner insert 3.80"
on public.merchants
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "merchants owner update 3.80" on public.merchants;
create policy "merchants owner update 3.80"
on public.merchants
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "merchants admins select 3.80" on public.merchants;
create policy "merchants admins select 3.80"
on public.merchants
for select
to authenticated
using (
  exists (
    select 1 from public.deal_admins a
    where a.user_id = auth.uid()
  )
);

drop policy if exists "merchants admins insert 3.80" on public.merchants;
create policy "merchants admins insert 3.80"
on public.merchants
for insert
to authenticated
with check (
  exists (
    select 1 from public.deal_admins a
    where a.user_id = auth.uid()
  )
);

drop policy if exists "merchants admins update 3.80" on public.merchants;
create policy "merchants admins update 3.80"
on public.merchants
for update
to authenticated
using (
  exists (
    select 1 from public.deal_admins a
    where a.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.deal_admins a
    where a.user_id = auth.uid()
  )
);

drop policy if exists "merchant applications owner insert 3.80" on public.merchant_applications;
create policy "merchant applications owner insert 3.80"
on public.merchant_applications
for insert
to authenticated
with check (auth.uid() = user_id and status = 'pending');

drop policy if exists "merchant applications owner read 3.80" on public.merchant_applications;
create policy "merchant applications owner read 3.80"
on public.merchant_applications
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "merchant applications admins read 3.80" on public.merchant_applications;
create policy "merchant applications admins read 3.80"
on public.merchant_applications
for select
to authenticated
using (
  exists (
    select 1 from public.deal_admins a
    where a.user_id = auth.uid()
  )
);

drop policy if exists "merchant applications admins update 3.80" on public.merchant_applications;
create policy "merchant applications admins update 3.80"
on public.merchant_applications
for update
to authenticated
using (
  exists (
    select 1 from public.deal_admins a
    where a.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.deal_admins a
    where a.user_id = auth.uid()
  )
);

grant select, insert, update on public.merchants to authenticated;
grant select on public.merchants to anon;
grant select, insert, update on public.merchant_applications to authenticated;
