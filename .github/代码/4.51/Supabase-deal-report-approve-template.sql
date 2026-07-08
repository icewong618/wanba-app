-- 用途：管理员核对某条爆料/商家提交后，把它发布到 public.deals。
-- 使用方法：把 YOUR_REPORT_ID 替换成 deal_reports.id。

insert into public.deals (
  deal_date,
  retailer_key,
  retailer_name,
  category,
  product_name,
  product_name_cn,
  original_price,
  current_price,
  unit,
  percent_off,
  save_amount,
  location,
  source_url,
  image_url,
  is_hot,
  is_food_low_price,
  stock_status,
  price_note,
  ai_summary_cn,
  source_type,
  raw_payload
)
select
  current_date,
  coalesce(retailer_key, lower(regexp_replace(retailer_name, '[^a-zA-Z0-9]+', '', 'g'))),
  retailer_name,
  category,
  product_name,
  product_name_cn,
  original_price,
  current_price,
  unit,
  case
    when original_price is not null and current_price is not null and original_price > 0
      then round(((original_price - current_price) / original_price) * 100)::integer
    else null
  end,
  case
    when original_price is not null and current_price is not null
      then greatest(original_price - current_price, 0)
    else null
  end,
  location,
  source_url,
  image_url,
  false,
  category = 'food',
  'unknown',
  coalesce(price_note, '价格来自爆料/商家提交，已由乐生活核对'),
  ai_summary_cn,
  report_type,
  jsonb_build_object('deal_report_id', id, 'submit_note', submit_note)
from public.deal_reports
where id = 'YOUR_REPORT_ID'
  and status = 'pending';

update public.deal_reports
set status = 'approved',
    reviewed_at = now()
where id = 'YOUR_REPORT_ID'
  and status = 'pending';
