create extension if not exists pgcrypto;

create table if not exists public.deal_admins (
  user_id uuid primary key,
  created_at timestamptz not null default now()
);

create table if not exists public.deal_tracked_products (
  id uuid primary key default gen_random_uuid(),
  retailer_key text not null,
  retailer_name text not null,
  product_key text,
  product_name text not null,
  product_name_cn text,
  category text not null default 'general',
  unit text,
  location text,
  source_url text not null,
  source_type text not null default 'manual',
  source_config jsonb not null default '{}'::jsonb,
  manual_current_price numeric,
  manual_original_price numeric,
  manual_stock_status text not null default 'unknown',
  is_food_low_price boolean not null default false,
  is_hot boolean not null default false,
  enabled boolean not null default true,
  refresh_frequency_hours integer not null default 24,
  last_checked_at timestamptz,
  last_success_at timestamptz,
  last_error text,
  ai_summary_cn text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint deal_tracked_products_source_type_check
    check (source_type in ('manual','manual_json','json_feed','official_api','affiliate_feed','bestbuy_api','experimental_scraper','community_report'))
);

create unique index if not exists deal_tracked_products_unique_idx
on public.deal_tracked_products (retailer_key, product_name, (coalesce(product_key, '')));

create index if not exists deal_tracked_products_enabled_idx on public.deal_tracked_products(enabled);
create index if not exists deal_tracked_products_retailer_idx on public.deal_tracked_products(retailer_key);
create index if not exists deal_tracked_products_food_idx on public.deal_tracked_products(is_food_low_price);
create index if not exists deal_tracked_products_name_idx on public.deal_tracked_products using gin (to_tsvector('simple', product_name));

alter table public.deal_tracked_products enable row level security;

drop policy if exists "tracked products public read enabled" on public.deal_tracked_products;
create policy "tracked products public read enabled"
on public.deal_tracked_products
for select
to anon, authenticated
using (enabled = true);

drop policy if exists "tracked products admin write" on public.deal_tracked_products;
create policy "tracked products admin write"
on public.deal_tracked_products
for all
to authenticated
using (exists (select 1 from public.deal_admins a where a.user_id = auth.uid()))
with check (exists (select 1 from public.deal_admins a where a.user_id = auth.uid()));

create table if not exists public.deal_daily_price_cache (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.deal_tracked_products(id) on delete cascade,
  price_date date not null default current_date,
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
  source_type text not null,
  stock_status text not null default 'unknown',
  is_food_low_price boolean not null default false,
  is_hot boolean not null default false,
  price_note text,
  ai_summary_cn text,
  raw_payload jsonb not null default '{}'::jsonb,
  refreshed_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '30 hours'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint deal_daily_price_cache_unique unique (product_id, price_date)
);

create index if not exists deal_daily_price_cache_date_idx on public.deal_daily_price_cache(price_date desc);
create index if not exists deal_daily_price_cache_retailer_idx on public.deal_daily_price_cache(retailer_key);
create index if not exists deal_daily_price_cache_food_idx on public.deal_daily_price_cache(is_food_low_price);
create index if not exists deal_daily_price_cache_hot_idx on public.deal_daily_price_cache(is_hot);
create index if not exists deal_daily_price_cache_name_idx on public.deal_daily_price_cache using gin (to_tsvector('simple', product_name));

alter table public.deal_daily_price_cache enable row level security;

drop policy if exists "daily price cache public read" on public.deal_daily_price_cache;
create policy "daily price cache public read"
on public.deal_daily_price_cache
for select
to anon, authenticated
using (true);

drop policy if exists "daily price cache admin write" on public.deal_daily_price_cache;
create policy "daily price cache admin write"
on public.deal_daily_price_cache
for all
to authenticated
using (exists (select 1 from public.deal_admins a where a.user_id = auth.uid()))
with check (exists (select 1 from public.deal_admins a where a.user_id = auth.uid()));

create table if not exists public.deal_price_refresh_runs (
  id uuid primary key default gen_random_uuid(),
  run_date date not null default current_date,
  trigger_type text not null default 'scheduled',
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null default 'running',
  checked_count integer not null default 0,
  success_count integer not null default 0,
  failed_count integer not null default 0,
  skipped_count integer not null default 0,
  error_message text,
  created_at timestamptz not null default now()
);

alter table public.deal_price_refresh_runs enable row level security;

drop policy if exists "price refresh runs admin read" on public.deal_price_refresh_runs;
create policy "price refresh runs admin read"
on public.deal_price_refresh_runs
for select
to authenticated
using (exists (select 1 from public.deal_admins a where a.user_id = auth.uid()));

drop view if exists public.deal_current_prices;
create view public.deal_current_prices as
select distinct on (c.product_id)
  c.id,
  c.product_id,
  c.price_date as deal_date,
  c.retailer_key,
  c.retailer_name,
  c.category,
  c.product_name,
  c.product_name_cn,
  c.original_price,
  c.current_price,
  c.unit,
  c.percent_off,
  c.save_amount,
  c.location,
  c.source_url,
  c.is_hot,
  c.is_food_low_price,
  c.stock_status,
  c.price_note,
  c.ai_summary_cn,
  c.source_type,
  c.refreshed_at as updated_at,
  c.expires_at
from public.deal_daily_price_cache c
join public.deal_tracked_products p on p.id = c.product_id
where p.enabled = true
order by c.product_id, c.price_date desc, c.refreshed_at desc;

grant select on public.deal_current_prices to anon, authenticated;

insert into public.deal_tracked_products (
  retailer_key, retailer_name, product_key, product_name, product_name_cn,
  category, unit, location, source_url, source_type,
  manual_current_price, manual_original_price, manual_stock_status,
  is_food_low_price, is_hot, ai_summary_cn, notes
) values
  ('aldi', 'ALDI', 'aldi-eggs-12ct', 'Large Eggs 12 ct', '鸡蛋 12枚', 'food', '12枚', '门店 / 周广告', 'https://www.aldi.us/weekly-specials/our-weekly-ads/', 'manual', 2.99, null, 'unknown', true, true, '适合每周采购，建议按门店库存和当周广告核对。', '人工维护价格，后续可接 Weekly Ad Feed'),
  ('walmart', 'Walmart', 'walmart-milk-1gal', 'Great Value Milk 1 Gallon', '牛奶 1加仑', 'food', '1 gallon', '网购 / 门店', 'https://www.walmart.com/search?q=milk%201%20gallon', 'manual', 3.49, null, 'unknown', true, true, '家庭日常消耗品，适合和 Target、ALDI 比价。', '人工维护价格，后续可接官方或联盟 Feed'),
  ('walmart', 'Walmart', 'walmart-rice-20lb', 'Long Grain Rice 20 lb', '大米 20磅', 'food', '20 lb', '网购 / 门店', 'https://www.walmart.com/search?q=rice%2020%20lb', 'manual', 12.98, null, 'unknown', true, true, '大米适合按每磅单价比较，最终价格以官网和门店为准。', '人工维护价格'),
  ('target', 'Target', 'target-flour-5lb', 'All Purpose Flour 5 lb', '面粉 5磅', 'food', '5 lb', '网购 / 门店', 'https://www.target.com/s?searchTerm=flour%205%20lb', 'manual', 3.29, null, 'unknown', true, false, '烘焙和家用基础食品，可与 Walmart 同类商品比较。', '人工维护价格'),
  ('samsclub', 'Sam''s Club', 'sams-chicken-breast', 'Chicken Breast', '鸡胸肉', 'food', '每磅', '会员仓储 / 门店', 'https://www.samsclub.com/s/chicken%20breast', 'manual', 2.29, null, 'unknown', true, false, '冷冻或大包装通常更划算，需核对会员价和重量。', 'Sam''s Club 先人工维护，自动抓取列为第二阶段'),
  ('costco', 'Costco', 'costco-beef', 'Beef', '牛肉', 'food', '每磅', '会员仓储 / 门店', 'https://www.costco.com/CatalogSearch?dept=All&keyword=beef', 'manual', 5.99, null, 'unknown', true, false, '适合火锅、炖肉或家庭分装，价格受门店和等级影响。', 'Costco 先人工维护，自动抓取列为第二阶段'),
  ('bestbuy', 'Best Buy', 'bestbuy-headphones', 'Noise Canceling Headphones', '降噪耳机', 'electronics', '件', '网购 / 门店自取', 'https://www.bestbuy.com/site/searchpage.jsp?st=noise%20canceling%20headphones', 'manual', 249.99, 399.99, 'unknown', false, true, '适合关注型号、保修和历史低价，最终价格以官网为准。', 'API Key 审批通过后可切换 bestbuy_api'),
  ('macys', 'Macy''s', 'macys-bedding-sale', 'Bedding Sale', '床品 Sale', 'home', '类别优惠', '网购 / 门店', 'https://www.macys.com/shop/sale', 'manual', null, null, 'unknown', false, false, '百货类适合显示折扣区间，不写成单品价格，进入官网核对具体品牌。', '类别优惠可只维护说明，不强制价格')
on conflict (retailer_key, product_name, (coalesce(product_key, ''))) do update set
  product_name_cn = excluded.product_name_cn,
  category = excluded.category,
  unit = excluded.unit,
  location = excluded.location,
  source_url = excluded.source_url,
  source_type = excluded.source_type,
  manual_current_price = excluded.manual_current_price,
  manual_original_price = excluded.manual_original_price,
  manual_stock_status = excluded.manual_stock_status,
  is_food_low_price = excluded.is_food_low_price,
  is_hot = excluded.is_hot,
  ai_summary_cn = excluded.ai_summary_cn,
  notes = excluded.notes,
  enabled = true,
  updated_at = now();

insert into public.deal_daily_price_cache (
  product_id, price_date, retailer_key, retailer_name, category,
  product_name, product_name_cn, original_price, current_price, unit,
  percent_off, save_amount, location, source_url, source_type,
  stock_status, is_food_low_price, is_hot, price_note, ai_summary_cn,
  raw_payload, refreshed_at, expires_at
)
select
  p.id,
  current_date,
  p.retailer_key,
  p.retailer_name,
  p.category,
  p.product_name,
  p.product_name_cn,
  p.manual_original_price,
  p.manual_current_price,
  p.unit,
  case
    when p.manual_original_price is not null and p.manual_current_price is not null and p.manual_original_price > p.manual_current_price
    then round(((p.manual_original_price - p.manual_current_price) / p.manual_original_price) * 100)::integer
    else null
  end,
  case
    when p.manual_original_price is not null and p.manual_current_price is not null and p.manual_original_price > p.manual_current_price
    then round((p.manual_original_price - p.manual_current_price)::numeric, 2)
    else null
  end,
  p.location,
  p.source_url,
  p.source_type,
  p.manual_stock_status,
  p.is_food_low_price,
  p.is_hot,
  '每日缓存价格。价格来自人工维护、官方 API 或联盟 Feed，AI 不生成价格；请以官网最终显示为准。',
  p.ai_summary_cn,
  jsonb_build_object('seeded_by', 'Supabase-daily-price-cache-4.40.sql'),
  now(),
  now() + interval '30 hours'
from public.deal_tracked_products p
where p.enabled = true
on conflict (product_id, price_date) do update set
  retailer_key = excluded.retailer_key,
  retailer_name = excluded.retailer_name,
  category = excluded.category,
  product_name = excluded.product_name,
  product_name_cn = excluded.product_name_cn,
  original_price = excluded.original_price,
  current_price = excluded.current_price,
  unit = excluded.unit,
  percent_off = excluded.percent_off,
  save_amount = excluded.save_amount,
  location = excluded.location,
  source_url = excluded.source_url,
  source_type = excluded.source_type,
  stock_status = excluded.stock_status,
  is_food_low_price = excluded.is_food_low_price,
  is_hot = excluded.is_hot,
  price_note = excluded.price_note,
  ai_summary_cn = excluded.ai_summary_cn,
  raw_payload = excluded.raw_payload,
  refreshed_at = now(),
  expires_at = now() + interval '30 hours',
  updated_at = now();
