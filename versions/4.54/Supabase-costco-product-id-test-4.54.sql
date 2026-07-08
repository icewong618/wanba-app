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
  '4.54 Costco Product ID retry logic enabled. GitHub path changed to versions/4.54.',
  now()
);

update public.deal_tracked_products
set
  source_config = coalesce(source_config, '{}'::jsonb) || jsonb_build_object(
    'adapter_version', '4.54',
    'costco_product_id_mode', true,
    'github_reference', 'aransaseelan/CostcoPriceTracker Product ID pattern'
  ),
  notes = coalesce(notes, '') || ' | 4.54：Costco 参考 CostcoPriceTracker Product ID 逻辑，启用候选 URL 重试。',
  updated_at = now()
where retailer_key = 'costco';
