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
  'github_scraper',
  'walmart_omkar_api',
  'target_scraper_config',
  'costco_product_tracker',
  'playwright_config',
  'manual_verified',
  'community_report'
));

update public.deal_tracked_products
set
  source_type = case
    when retailer_key = 'walmart' then 'playwright_config'
    when retailer_key = 'target' then 'target_scraper_config'
    when retailer_key = 'costco' then 'costco_product_tracker'
    else source_type
  end,
  source_config = coalesce(source_config, '{}'::jsonb) || jsonb_build_object(
    'adapter_version', '4.52',
    'needs_exact_product_url', true,
    'github_reference', case
      when retailer_key = 'walmart' then 'omkarcloud/walmart-scraper pattern'
      when retailer_key = 'target' then 'scraper-bank/Target.com-Scrapers pattern'
      when retailer_key = 'costco' then 'aransaseelan/CostcoPriceTracker pattern'
      else 'generic Playwright + JSON-LD pattern'
    end
  ),
  notes = coalesce(notes, '') || ' | 4.52：配置化抓取适配器启用，搜索页结果会按商品名匹配；可疑价格写入 raw_payload.review_flags。',
  updated_at = now()
where source_type in ('public_page', 'experimental_scraper');

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
  '4.52 configurable GitHub-inspired scraper adapters enabled. No new table required.',
  now()
);
