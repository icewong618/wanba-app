alter table public.deal_tracked_products
drop constraint if exists deal_tracked_products_source_type_check;

alter table public.deal_tracked_products
add constraint deal_tracked_products_source_type_check
check (source_type in (
  'manual',
  'manual_json',
  'json_feed',
  'official_api',
  'affiliate_feed',
  'bestbuy_api',
  'public_page',
  'experimental_scraper',
  'community_report'
));

update public.deal_tracked_products
set
  source_type = 'public_page',
  notes = coalesce(notes, '') || ' | 4.50：使用公开商品页结构化数据抓取，失败时保留旧缓存并记录错误。',
  updated_at = now()
where retailer_key in ('aldi', 'target', 'walmart', 'macys', 'costco', 'samsclub')
  and source_type = 'manual';

update public.deal_tracked_products
set
  source_type = case
    when product_key is not null and length(product_key) > 0 and product_key !~ '[^0-9]' then 'bestbuy_api'
    else 'public_page'
  end,
  notes = coalesce(notes, '') || ' | 4.50：Best Buy 有 API Key 时走官方 API，否则可使用公开商品页抓取。',
  updated_at = now()
where retailer_key = 'bestbuy'
  and source_type = 'manual';

update public.deal_daily_price_cache
set
  source_type = p.source_type,
  price_note = '每日缓存价格。4.50 起优先使用外部公开数据源；抓取失败时保留旧缓存并进入可人工修正状态。价格以官网最终显示为准。',
  updated_at = now()
from public.deal_tracked_products p
where public.deal_daily_price_cache.product_id = p.id;

insert into public.deal_price_refresh_runs (
  trigger_type,
  status,
  checked_count,
  success_count,
  failed_count,
  skipped_count,
  error_message,
  finished_at
) values (
  'schema_upgrade',
  'success',
  0,
  0,
  0,
  0,
  '4.50 public_page source type enabled. Existing products switched from manual to public_page where applicable.',
  now()
);
