create extension if not exists pgcrypto;

alter table public.deals
add column if not exists updated_at timestamptz not null default now();

create unique index if not exists deals_unique_daily_product_idx
on public.deals (retailer_key, product_name, deal_date);

insert into public.deal_sources (
  retailer_key,
  retailer_name,
  source_type,
  source_url,
  affiliate_network,
  enabled,
  refresh_priority,
  notes
) values
  ('walmart', 'Walmart', 'json_feed', null, '待接入官方或联盟 Feed', false, 10, '拿到 Walmart 数据源后填写 source_url 并启用'),
  ('target', 'Target', 'json_feed', null, '待接入官方或联盟 Feed', false, 20, '拿到 Target 数据源后填写 source_url 并启用'),
  ('bestbuy', 'Best Buy', 'bestbuy_api', null, 'Best Buy Developer API', false, 30, '需要设置 BESTBUY_API_KEY；适合电视、耳机、电脑、小家电'),
  ('macys', 'Macy''s', 'json_feed', null, '待接入联盟 Feed', false, 40, '适合百货 Sale'),
  ('aldi', 'ALDI', 'manual_json', null, 'Weekly Ad / 人工维护', false, 50, '第一阶段可用人工 JSON Feed 或手动录入')
on conflict (retailer_key) do update set
  retailer_name = excluded.retailer_name,
  source_type = excluded.source_type,
  affiliate_network = excluded.affiliate_network,
  refresh_priority = excluded.refresh_priority,
  notes = excluded.notes,
  updated_at = now();
