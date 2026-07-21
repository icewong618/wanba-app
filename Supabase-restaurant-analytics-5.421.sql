-- 乐生活 v5.421：餐饮经营统计工作台。
-- 账单统计只读取已生成的 merchant_order_bills，不会制造或模拟支付数据。

create or replace function public.merchant_restaurant_analytics_snapshot(
  p_merchant_user_id uuid,
  p_days integer default 7
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  days_value integer := greatest(1, least(coalesce(p_days,7), 90));
  since_at timestamptz;
  can_view boolean;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  can_view := public.merchant_matrix_has_permission(p_merchant_user_id,'bill_view')
    or public.merchant_matrix_has_permission(p_merchant_user_id,'order_complete')
    or public.merchant_matrix_has_permission(p_merchant_user_id,'order_manage');
  if not can_view then raise exception 'restaurant_analytics_not_allowed'; end if;
  since_at := date_trunc('day', now() at time zone 'America/Los_Angeles') at time zone 'America/Los_Angeles' - make_interval(days => days_value - 1);

  return jsonb_build_object(
    'merchant',(select jsonb_build_object('user_id',user_id,'business_name',business_name) from public.merchants where user_id=p_merchant_user_id limit 1),
    'summary',jsonb_build_object(
      'sales',coalesce((select sum(total_amount) from public.merchant_order_bills where merchant_user_id=p_merchant_user_id and created_at>=since_at),0),
      'order_count',coalesce((select count(*) from public.merchant_order_bills where merchant_user_id=p_merchant_user_id and created_at>=since_at),0),
      'discount',coalesce((select sum(discount_amount) from public.merchant_order_bills where merchant_user_id=p_merchant_user_id and created_at>=since_at),0),
      'tip',coalesce((select sum(tip_amount) from public.merchant_order_bills where merchant_user_id=p_merchant_user_id and created_at>=since_at),0),
      'average_order',coalesce((select avg(total_amount) from public.merchant_order_bills where merchant_user_id=p_merchant_user_id and created_at>=since_at),0),
      'new_members',coalesce((select count(*) from public.merchant_memberships where merchant_user_id=p_merchant_user_id and joined_at>=since_at),0),
      'redeemed_claims',coalesce((select count(*) from public.merchant_coupon_claims where merchant_user_id=p_merchant_user_id and redeemed_at>=since_at and status='redeemed'),0),
      'pending_claims',coalesce((select count(*) from public.merchant_coupon_claims where merchant_user_id=p_merchant_user_id and status='claimed'),0),
      'member_transactions',coalesce((select count(*) from public.merchant_member_transactions where merchant_user_id=p_merchant_user_id and created_at>=since_at),0),
      'pending_orders',coalesce((select count(*) from public.merchant_orders where merchant_user_id=p_merchant_user_id and status not in ('completed','cancelled')),0),
      'dinein_bills',coalesce((select count(*) from public.merchant_order_bills b join public.merchant_orders o on o.id=b.order_id where b.merchant_user_id=p_merchant_user_id and b.created_at>=since_at and coalesce(o.order_type,'dinein')<>'takeout'),0),
      'takeout_bills',coalesce((select count(*) from public.merchant_order_bills b join public.merchant_orders o on o.id=b.order_id where b.merchant_user_id=p_merchant_user_id and b.created_at>=since_at and o.order_type='takeout'),0)
    ),
    'trend',coalesce((select jsonb_agg(jsonb_build_object('label',to_char(day_value,'MM/DD'),'sales',coalesce(day_sales,0)) order by day_value) from (select d::date as day_value,(select sum(b.total_amount) from public.merchant_order_bills b where b.merchant_user_id=p_merchant_user_id and (b.created_at at time zone 'America/Los_Angeles')::date=d::date) as day_sales from generate_series((now() at time zone 'America/Los_Angeles')::date-(days_value-1),(now() at time zone 'America/Los_Angeles')::date,interval '1 day') d) trend_rows),'[]'::jsonb)
  );
end;
$$;

revoke all on function public.merchant_restaurant_analytics_snapshot(uuid,integer) from public, anon;
grant execute on function public.merchant_restaurant_analytics_snapshot(uuid,integer) to authenticated;
create index if not exists merchant_order_bills_merchant_created_idx on public.merchant_order_bills(merchant_user_id,created_at desc);
analyze public.merchant_order_bills;
