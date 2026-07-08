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
  'fixed_product_page',
  'weekly_ad_page',
  'daily_deals_page',
  'manual_verified',
  'community_report'
));

insert into public.deal_tracked_products (
  retailer_key, retailer_name, product_key, product_name, product_name_cn,
  category, unit, location, source_url, source_type, source_config,
  manual_current_price, manual_original_price, manual_stock_status,
  is_food_low_price, is_hot, enabled, refresh_frequency_hours,
  ai_summary_cn, notes
) values
  (
    'bestbuy',
    'Best Buy',
    'bestbuy-deal-of-the-day',
    'Best Buy Deal of the Day',
    'Best Buy 今日特惠',
    'electronics',
    '官方入口',
    '网购 / 门店自取',
    'https://www.bestbuy.com/site/misc/deal-of-the-day/pcmcat248000050016.c?id=pcmcat248000050016',
    'daily_deals_page',
    jsonb_build_object('adapter_version','4.55','source_role','daily_deals_landing','publish_rule','only_show_price_when_specific_product_is_extracted'),
    null,
    null,
    'unknown',
    false,
    true,
    true,
    24,
    'Best Buy 官方今日特惠入口，适合查看电视、电脑、耳机、家电等电子产品限时折扣。只有抓到具体商品名和价格时才显示价格。',
    '4.55：Best Buy 不再用关键词搜索耳机，改用官方 Deal of the Day。'
  ),
  (
    'walmart',
    'Walmart',
    'walmart-flash-deals',
    'Walmart Flash Deals',
    'Walmart 限时优惠',
    'general',
    '官方入口',
    '网购 / 门店',
    'https://www.walmart.com/shop/deals/flash-deals',
    'daily_deals_page',
    jsonb_build_object('adapter_version','4.55','source_role','daily_deals_landing','publish_rule','only_show_price_when_specific_product_is_extracted'),
    null,
    null,
    'unknown',
    false,
    true,
    true,
    24,
    'Walmart 官方 Flash Deals 入口，适合查看日用品、家居、电子和清仓限时优惠。食品低价另走固定商品页比较。',
    '4.55：Walmart 今日优惠改用官方 Flash Deals 页面，不再用搜索页冒充具体价格。'
  ),
  (
    'aldi',
    'ALDI',
    'aldi-weekly-ads',
    'ALDI Weekly Ads',
    'ALDI 本周优惠',
    'food',
    '周广告',
    '门店 / 周广告',
    'https://info.aldi.us/weekly-specials/weekly-ads',
    'weekly_ad_page',
    jsonb_build_object('adapter_version','4.55','source_role','weekly_ad_landing','weekly_update_day','Wednesday','publish_rule','only_show_price_when_specific_product_is_extracted'),
    null,
    null,
    'unknown',
    false,
    true,
    true,
    168,
    'ALDI 官方 Weekly Ads，本周蔬果、肉类、早餐食品和季节商品优惠入口。每周更新一次，价格以门店广告为准。',
    '4.55：ALDI 只抓官方 Weekly Ads，每周刷新一次。'
  ),
  (
    'target',
    'Target',
    'target-weekly-ad',
    'Target Weekly Ad',
    'Target 本周优惠',
    'general',
    '周广告',
    '网购 / 门店',
    'https://www.target.com/weekly-ad?promo',
    'weekly_ad_page',
    jsonb_build_object('adapter_version','4.55','source_role','weekly_ad_landing','weekly_update_day','Monday','publish_rule','only_show_price_when_specific_product_is_extracted'),
    null,
    null,
    'unknown',
    false,
    true,
    true,
    168,
    'Target 官方 Weekly Ad，每周一更新，适合查看 Target Circle、食品、家居、母婴和日用品周优惠。',
    '4.55：Target 周优惠改用官方 Weekly Ad，每周刷新一次。'
  ),
  (
    'walmart',
    'Walmart',
    '10450114',
    'Great Value Whole Vitamin D Milk Gallon 128 fl oz',
    '牛奶 1加仑',
    'food',
    '1 gallon',
    '网购 / 门店',
    'https://www.walmart.com/ip/Great-Value-Whole-Vitamin-D-Milk-Gallon-Plastic-Jug-128-Fl-Oz/10450114',
    'fixed_product_page',
    jsonb_build_object('adapter_version','4.55','source_role','fixed_food_product','compare_group','milk'),
    null,
    null,
    'unknown',
    true,
    true,
    true,
    24,
    '固定食品价：Walmart 牛奶每日价格，用于和其他商家的牛奶价格比较。',
    '4.55：食品低价使用具体商品页。'
  ),
  (
    'walmart',
    'Walmart',
    '10315883',
    'Great Value Long Grain Enriched Rice 20 lb',
    '大米 20磅',
    'food',
    '20 lb',
    '网购 / 门店',
    'https://www.walmart.com/ip/Great-Value-Long-Grain-Enriched-Rice-20-lb/10315883',
    'fixed_product_page',
    jsonb_build_object('adapter_version','4.55','source_role','fixed_food_product','compare_group','rice'),
    null,
    null,
    'unknown',
    true,
    true,
    true,
    24,
    '固定食品价：Walmart 大米每日价格，用于家庭刚需食品比价。',
    '4.55：食品低价使用具体商品页。'
  ),
  (
    'costco',
    'Costco',
    '100979550',
    'Kansas City Steak Co USDA Choice Ribeye Steaks 18 oz 4 pack',
    'USDA Choice Ribeye Steaks 18 oz 4包',
    'food',
    '4 pack',
    '会员仓储 / 网购',
    'https://www.costco.com/p/-/kansas-city-steak-co-usda-choice-ribeye-steaks-18-oz-each-available-in-4-8-or-12-packs/100979550?sp=grs&langId=-1',
    'fixed_product_page',
    jsonb_build_object('adapter_version','4.55','source_role','fixed_food_product','compare_group','beef','costco_product_id_mode',true),
    null,
    null,
    'unknown',
    true,
    true,
    true,
    24,
    '固定食品价：Costco 牛排商品页每日尝试抓取。Costco 可能拦截自动访问，页面保留官网核对。',
    '4.55：Costco 牛排改为具体商品页，并继续使用 Product ID 候选 URL 重试。'
  )
on conflict (retailer_key, product_name, (coalesce(product_key, ''))) do update set
  product_name_cn = excluded.product_name_cn,
  category = excluded.category,
  unit = excluded.unit,
  location = excluded.location,
  source_url = excluded.source_url,
  source_type = excluded.source_type,
  source_config = excluded.source_config,
  manual_current_price = excluded.manual_current_price,
  manual_original_price = excluded.manual_original_price,
  manual_stock_status = excluded.manual_stock_status,
  is_food_low_price = excluded.is_food_low_price,
  is_hot = excluded.is_hot,
  enabled = excluded.enabled,
  refresh_frequency_hours = excluded.refresh_frequency_hours,
  ai_summary_cn = excluded.ai_summary_cn,
  notes = excluded.notes,
  updated_at = now();

update public.deal_tracked_products
set
  enabled = false,
  notes = coalesce(notes, '') || ' | 4.55：旧关键词搜索来源停用，避免把搜索页价格当成具体商品价格。',
  updated_at = now()
where (
  (retailer_key = 'bestbuy' and product_key = 'bestbuy-headphones')
  or (retailer_key = 'target' and product_key = 'target-flour-5lb')
  or (retailer_key = 'aldi' and product_key = 'aldi-eggs-12ct')
  or (retailer_key = 'walmart' and product_key in ('walmart-milk-1gal','walmart-rice-20lb'))
  or (retailer_key = 'costco' and product_key = 'costco-beef')
)
and product_key not in ('10450114','10315883','100979550');

delete from public.deal_daily_price_cache c
using public.deal_tracked_products p
where c.product_id = p.id
  and p.enabled = false
  and c.price_date >= current_date - interval '2 days';

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
  '4.55 official deal source split: Best Buy Deal of the Day, Walmart Flash Deals, ALDI Weekly Ads, Target Weekly Ad, plus fixed Walmart/Costco food product pages.',
  now()
);
