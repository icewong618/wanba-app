-- 乐生活 v5.398：二手车收藏。
-- 每个用户只能读取、创建和删除自己的收藏记录。

create table if not exists public.merchant_auto_saved_listings (
  user_id uuid not null references auth.users(id) on delete cascade,
  listing_id uuid not null references public.merchant_auto_listings(id) on delete cascade,
  merchant_user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

create index if not exists merchant_auto_saved_listings_user_merchant_idx
  on public.merchant_auto_saved_listings (user_id, merchant_user_id, created_at desc);

alter table public.merchant_auto_saved_listings enable row level security;

drop policy if exists "auto saved listings read own 5.398" on public.merchant_auto_saved_listings;
create policy "auto saved listings read own 5.398"
on public.merchant_auto_saved_listings
for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "auto saved listings create own 5.398" on public.merchant_auto_saved_listings;
create policy "auto saved listings create own 5.398"
on public.merchant_auto_saved_listings
for insert to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "auto saved listings delete own 5.398" on public.merchant_auto_saved_listings;
create policy "auto saved listings delete own 5.398"
on public.merchant_auto_saved_listings
for delete to authenticated
using ((select auth.uid()) = user_id);

revoke all on table public.merchant_auto_saved_listings from anon, public;
grant select, insert, delete on table public.merchant_auto_saved_listings to authenticated;
