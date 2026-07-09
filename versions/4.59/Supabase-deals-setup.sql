-- 乐生活 3.50 省钱板块真实数据库表
-- 用途：让前端“全网找”从 Supabase public.deals 读取真实优惠结果。
-- 执行位置：Supabase Dashboard -> SQL Editor。

create extension if not exists pgcrypto;

create table if not exists public.deals (
  id uuid primary key default gen_random_uuid(),
  deal_date date not null default current_date,
  retailer_key text not null,
  retailer_name text not null,
  category text not null default 'general',
  product_name text not null,
  product_name_cn text,
  original_price numeric,
  current_price numeric,
  unit text,
  percent_off integer,
  save_amount numeric,
  location text,
  source_url text not null,
  image_url text,
  is_hot boolean not null default false,
  is_food_low_price boolean not null default false,
  stock_status text not null default 'unknown',
  price_note text,
  ai_summary_cn text,
  source_type text not null default 'manual',
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists deals_date_idx on public.deals(deal_date desc);
create index if not exists deals_retailer_idx on public.deals(retailer_key);
create index if not exists deals_category_idx on public.deals(category);
create index if not exists deals_food_idx on public.deals(is_food_low_price);
create index if not exists deals_hot_idx on public.deals(is_hot);
create index if not exists deals_product_name_idx on public.deals using gin (to_tsvector('simple', product_name));
create index if not exists deals_product_name_cn_idx on public.deals(product_name_cn);

alter table public.deals enable row level security;

drop policy if exists "deals public read" on public.deals;
create policy "deals public read"
on public.deals
for select
to anon, authenticated
using (true);

create table if not exists public.deal_sources (
  id uuid primary key default gen_random_uuid(),
  retailer_key text not null unique,
  retailer_name text not null,
  source_type text not null,
  source_url text,
  affiliate_network text,
  enabled boolean not null default true,
  refresh_priority integer not null default 100,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.deal_sources enable row level security;

drop policy if exists "deal sources public read" on public.deal_sources;
create policy "deal sources public read"
on public.deal_sources
for select
to anon, authenticated
using (enabled = true);

create table if not exists public.deal_refresh_logs (
  id uuid primary key default gen_random_uuid(),
  run_date date not null default current_date,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null default 'running',
  retailer_key text,
  inserted_count integer default 0,
  updated_count integer default 0,
  error_message text
);

alter table public.deal_refresh_logs enable row level security;

-- 手动维护真实价格时，可按下面格式插入。
-- 注意：价格必须来自官网、周广告、门店实拍或人工核对，不要让 AI 编价格。
/*
insert into public.deals (
  retailer_key, retailer_name, category, product_name, product_name_cn,
  current_price, unit, location, source_url,
  is_food_low_price, stock_status, price_note, ai_summary_cn, source_type
) values (
  'walmart', 'Walmart', 'food', 'Long Grain Rice 20 lb', '长粒米 20 lb',
  12.98, '20 lb', '网购 / 门店自取', 'https://www.walmart.com/search?q=rice%2020%20lb',
  true, 'unknown', '价格以官网最终显示为准', '适合家庭囤货，建议按每磅价格比较。', 'manual'
);
*/
