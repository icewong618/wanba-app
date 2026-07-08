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
  '4.51 Playwright browser scraper enabled in GitHub Actions. No schema change required.',
  now()
);

update public.deal_tracked_products
set
  notes = coalesce(notes, '') || ' | 4.51：普通公开页面解析失败后，会尝试 Playwright 浏览器抓取；仍失败则保留旧缓存。',
  updated_at = now()
where source_type in ('public_page', 'experimental_scraper');
