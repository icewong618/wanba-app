-- 乐生活 v5.526：个人小店。请在 Supabase SQL Editor 运行一次。
create table if not exists public.personal_shops (
  user_id uuid primary key references auth.users(id) on delete cascade,
  slug text not null check (slug ~ '^[a-z0-9][a-z0-9-]{2,39}$'),
  display_name text not null check (char_length(trim(display_name)) between 1 and 60),
  intro text not null default '' check (char_length(intro) <= 240),
  avatar text,
  cover_image text,
  shop_type text not null default 'second_hand' check (shop_type in ('second_hand','mini_store')),
  market_code text not null default 'la' check (market_code in ('la','sgv','oc','ie','sd','sf','nyc','sea','other')),
  status text not null default 'active' check (status in ('active','paused')),
  contact_mode text not null default 'message',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (market_code, slug)
);
alter table public.personal_shops add column if not exists market_code text not null default 'la';
alter table public.personal_shops drop constraint if exists personal_shops_slug_key;
alter table public.personal_shops drop constraint if exists personal_shops_reserved_slug;
drop index if exists public.personal_shops_slug_key;
create unique index if not exists personal_shops_market_slug_unique_idx on public.personal_shops (market_code, slug);

create table if not exists public.personal_shop_products (
  id uuid primary key default gen_random_uuid(),
  shop_user_id uuid not null references public.personal_shops(user_id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 80),
  description text not null default '' check (char_length(description) <= 1000),
  price numeric(10,2) not null check (price >= 0),
  original_price numeric(10,2),
  images jsonb not null default '[]'::jsonb,
  category text not null default '其他',
  item_condition text not null default '二手',
  inventory integer not null default 1 check (inventory >= 0),
  fulfillment text not null default '同城自提',
  status text not null default 'active' check (status in ('active','sold','hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists personal_shop_products_public_idx on public.personal_shop_products (shop_user_id, status, created_at desc);
alter table public.personal_shops enable row level security;
alter table public.personal_shop_products enable row level security;

drop policy if exists "personal shops are publicly readable" on public.personal_shops;
create policy "personal shops are publicly readable" on public.personal_shops for select using (status = 'active');
drop policy if exists "users manage their own personal shop" on public.personal_shops;
create policy "users manage their own personal shop" on public.personal_shops for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "personal products are publicly readable" on public.personal_shop_products;
create policy "personal products are publicly readable" on public.personal_shop_products for select using (status = 'active');
drop policy if exists "owners manage personal shop products" on public.personal_shop_products;
create policy "owners manage personal shop products" on public.personal_shop_products for all to authenticated using (auth.uid() = shop_user_id) with check (auth.uid() = shop_user_id);

drop function if exists public.personal_shop_public_snapshot(text);
create or replace function public.personal_shop_public_snapshot(p_market text, p_slug text)
returns jsonb language sql stable security definer set search_path=public as $$
  select jsonb_build_object(
    'shop', (select to_jsonb(s) from personal_shops s where s.market_code = lower(trim(p_market)) and s.slug = lower(trim(p_slug)) and s.status = 'active'),
    'products', coalesce((select jsonb_agg(to_jsonb(p) order by p.created_at desc) from personal_shop_products p join personal_shops s on s.user_id=p.shop_user_id where s.market_code=lower(trim(p_market)) and s.slug=lower(trim(p_slug)) and s.status='active' and p.status='active'),'[]'::jsonb)
  );
$$;
grant execute on function public.personal_shop_public_snapshot(text, text) to anon, authenticated;
