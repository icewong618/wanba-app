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
  '4.53 source_type routing fixed: playwright_config, target_scraper_config, costco_product_tracker and related GitHub-inspired source types now route to scraper instead of manual cache fallback.',
  now()
);

update public.deal_tracked_products
set
  notes = coalesce(notes, '') || ' | 4.53：修复 source_type 路由，配置化来源不再静默回退 manual_cache。',
  updated_at = now()
where source_type in (
  'github_scraper',
  'walmart_omkar_api',
  'target_scraper_config',
  'costco_product_tracker',
  'playwright_config'
);
