-- 乐生活 5.145：公测前权限与性能收口
-- 本脚本不删除业务数据；运行后请按照 README 的验收步骤检查省钱页、管理员和商家会员功能。

-- 1. 公开优惠视图按访问者权限执行，避免以视图创建者身份绕过 RLS。
create or replace view public.deal_current_prices
with (security_invoker = true)
as
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

-- 热榜公开视图不再读取用户互动明细；互动数据继续保留在私有表内供后续聚合任务使用。
create or replace view public.deal_rankings
with (security_invoker = true)
as
select
  d.id,
  d.deal_date,
  d.retailer_key,
  d.retailer_name,
  d.category,
  d.product_name,
  d.product_name_cn,
  d.original_price,
  d.current_price,
  d.unit,
  d.percent_off,
  d.save_amount,
  d.location,
  d.source_url,
  d.image_url,
  d.is_hot,
  d.is_food_low_price,
  d.stock_status,
  d.price_note,
  d.ai_summary_cn,
  d.source_type,
  d.raw_payload,
  d.created_at,
  d.updated_at,
  0::integer as click_count,
  0::integer as favorite_count,
  0::integer as copy_count,
  ((case when d.is_hot then 10 else 0 end) + (case when d.is_food_low_price then 6 else 0 end))::integer as hot_score
from public.deals d;

grant select on public.deal_current_prices, public.deal_rankings to anon, authenticated;

-- 2. 游客可记录匿名互动/爆料；登录用户只能写入自己的 user_id，不能伪造别人身份。
drop policy if exists "deal interactions public insert" on public.deal_interactions;
create policy "deal interactions insert own or guest" on public.deal_interactions
  for insert to anon, authenticated
  with check (
    (auth.uid() is null and user_id is null)
    or (auth.uid() = user_id)
  );

drop policy if exists "deal reports public insert" on public.deal_reports;
create policy "deal reports insert own or guest" on public.deal_reports
  for insert to anon, authenticated
  with check (
    (auth.uid() is null and user_id is null)
    or (auth.uid() = user_id)
  );

-- 3. 地点库仅允许用户创建自己的新地点；客户端不再改写已有地点计数。
drop policy if exists "insert locations" on public.locations;
create policy "locations insert own" on public.locations
  for insert to authenticated
  with check ((select auth.uid()) = created_by);

drop policy if exists "update locations" on public.locations;
create policy "locations update own" on public.locations
  for update to authenticated
  using ((select auth.uid()) = created_by)
  with check ((select auth.uid()) = created_by);

-- 4. 刷新日志只允许后端服务写入，前端角色无任何表权限。
revoke all on table public.deal_refresh_logs from anon, authenticated;

-- 5. 高权限函数只开放给已登录用户；函数内部仍会继续校验管理员或商家身份。
revoke all on function public.admin_center_snapshot() from public;
grant execute on function public.admin_center_snapshot() to authenticated;

revoke all on function public.redeem_merchant_coupon_claim(bigint) from public;
grant execute on function public.redeem_merchant_coupon_claim(bigint) to authenticated;

revoke all on function public.redeem_merchant_reward(bigint, integer) from public;
grant execute on function public.redeem_merchant_reward(bigint, integer) to authenticated;

revoke all on function public.revert_merchant_reward_redemption(bigint) from public;
grant execute on function public.revert_merchant_reward_redemption(bigint) to authenticated;

-- 6. 首页评论、举报与管理员读取使用的索引，减少数据增长后的等待时间。
create index if not exists comments_post_created_at_idx on public.comments (post_id, created_at desc);
create index if not exists comments_user_created_at_idx on public.comments (user_id, created_at desc);
create index if not exists comments_parent_id_idx on public.comments (parent_id);
create index if not exists content_reports_status_created_at_idx on public.content_reports (status, created_at desc);
create index if not exists admin_user_statuses_created_by_idx on public.admin_user_statuses (created_by);
