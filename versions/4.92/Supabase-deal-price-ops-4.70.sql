alter table public.deal_daily_price_cache
  add column if not exists review_status text not null default 'unreviewed',
  add column if not exists display_status text not null default 'visible',
  add column if not exists admin_note text,
  add column if not exists verified_by uuid,
  add column if not exists verified_at timestamptz;

alter table public.deal_daily_price_cache
  drop constraint if exists deal_daily_price_cache_review_status_check;

alter table public.deal_daily_price_cache
  add constraint deal_daily_price_cache_review_status_check
  check (review_status in ('unreviewed','approved','needs_review','rejected'));

alter table public.deal_daily_price_cache
  drop constraint if exists deal_daily_price_cache_display_status_check;

alter table public.deal_daily_price_cache
  add constraint deal_daily_price_cache_display_status_check
  check (display_status in ('visible','hidden'));

create index if not exists deal_daily_price_cache_review_idx
on public.deal_daily_price_cache(review_status);

create index if not exists deal_daily_price_cache_display_idx
on public.deal_daily_price_cache(display_status);

update public.deal_daily_price_cache
set
  review_status = case
    when current_price is not null then 'approved'
    when source_type in ('weekly_ad_page','daily_deals_page') then 'approved'
    else 'needs_review'
  end,
  display_status = 'visible',
  admin_note = coalesce(admin_note, '4.70 初始化：进入省钱运营后台管理。'),
  verified_at = coalesce(verified_at, now())
where review_status = 'unreviewed';

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
  c.review_status,
  c.display_status,
  c.admin_note,
  c.verified_at,
  c.refreshed_at as updated_at,
  c.expires_at
from public.deal_daily_price_cache c
join public.deal_tracked_products p on p.id = c.product_id
where p.enabled = true
  and c.display_status = 'visible'
order by c.product_id, c.price_date desc, c.refreshed_at desc;

grant select on public.deal_current_prices to anon, authenticated;
