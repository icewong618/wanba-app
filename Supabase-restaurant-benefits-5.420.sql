-- 乐生活 v5.420：餐饮会员、优惠券核销与账单独立工作台。
-- 真实支付尚未接入；本脚本仅提供核对、权限隔离与账单查看。

create or replace function public.merchant_restaurant_benefits_snapshot(
  p_merchant_user_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  can_member boolean;
  can_coupon boolean;
  can_bill boolean;
  can_view boolean;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  can_member := public.merchant_matrix_has_permission(p_merchant_user_id, 'member_manage');
  can_coupon := public.merchant_matrix_has_permission(p_merchant_user_id, 'coupon_redeem');
  can_bill := public.merchant_matrix_has_permission(p_merchant_user_id, 'bill_view')
    or public.merchant_matrix_has_permission(p_merchant_user_id, 'order_complete');
  can_view := can_member or can_coupon or can_bill;
  if not can_view then raise exception 'restaurant_benefits_not_allowed'; end if;

  return jsonb_build_object(
    'merchant', (select jsonb_build_object('user_id',user_id,'business_name',business_name) from public.merchants where user_id=p_merchant_user_id limit 1),
    'permissions', jsonb_build_object('member_manage',can_member,'coupon_redeem',can_coupon,'bill_view',can_bill),
    'members', case when can_member then coalesce((select jsonb_agg(jsonb_build_object('id',m.id,'user_id',m.user_id,'user_name',m.user_name,'user_avatar',m.user_avatar,'status',m.status,'points',m.points,'stamp_count',m.stamp_count,'joined_at',m.joined_at) order by m.updated_at desc) from (select * from public.merchant_memberships where merchant_user_id=p_merchant_user_id order by updated_at desc limit 100) m),'[]'::jsonb) else '[]'::jsonb end,
    'claims', case when can_coupon then coalesce((select jsonb_agg(jsonb_build_object('id',c.id,'user_id',c.user_id,'user_name',coalesce(m.user_name,'乐生活用户'),'coupon_snapshot',c.coupon_snapshot,'status',c.status,'claimed_at',c.claimed_at,'redeemed_at',c.redeemed_at) order by c.claimed_at desc) from (select * from public.merchant_coupon_claims where merchant_user_id=p_merchant_user_id order by claimed_at desc limit 100) c left join public.merchant_memberships m on m.merchant_user_id=c.merchant_user_id and m.user_id=c.user_id),'[]'::jsonb) else '[]'::jsonb end,
    'transactions', case when can_member then coalesce((select jsonb_agg(jsonb_build_object('id',t.id,'user_id',t.user_id,'user_name',coalesce(m.user_name,'乐生活用户'),'action',t.action,'delta',t.delta,'note',t.note,'created_at',t.created_at) order by t.created_at desc) from (select * from public.merchant_member_transactions where merchant_user_id=p_merchant_user_id order by created_at desc limit 100) t left join public.merchant_memberships m on m.id=t.membership_id),'[]'::jsonb) else '[]'::jsonb end,
    'bills', case when can_bill then coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'order_id',b.order_id,'order_code',coalesce(o.order_code,'订单'),'payment_method',b.payment_method,'discount_amount',b.discount_amount,'total_amount',b.total_amount,'created_at',b.created_at) order by b.created_at desc) from (select * from public.merchant_order_bills where merchant_user_id=p_merchant_user_id order by created_at desc limit 100) b left join public.merchant_orders o on o.id=b.order_id),'[]'::jsonb) else '[]'::jsonb end
  );
end;
$$;

create or replace function public.merchant_restaurant_benefit_lookup(
  p_merchant_user_id uuid,
  p_code text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  clean_code text := upper(regexp_replace(coalesce(p_code,''), '[[:space:]]+', '', 'g'));
  code_id bigint;
  member_row public.merchant_memberships%rowtype;
  claim_row public.merchant_coupon_claims%rowtype;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  if not (public.merchant_matrix_has_permission(p_merchant_user_id,'member_manage') or public.merchant_matrix_has_permission(p_merchant_user_id,'coupon_redeem')) then raise exception 'restaurant_benefits_not_allowed'; end if;
  if regexp_replace(clean_code, '^LSHC?-?', '') !~ '^[0-9]+$' then
    return '{}'::jsonb;
  end if;
  code_id := nullif(regexp_replace(clean_code, '^LSHC?-?', ''), '')::bigint;
  if clean_code like 'LSHC%' then
    select * into claim_row from public.merchant_coupon_claims where id=code_id and merchant_user_id=p_merchant_user_id;
    if found then return jsonb_build_object('kind','coupon','code','LSHC-'||lpad(claim_row.id::text,6,'0'),'claim',jsonb_build_object('id',claim_row.id,'user_id',claim_row.user_id,'user_name',coalesce((select user_name from public.merchant_memberships where merchant_user_id=p_merchant_user_id and user_id=claim_row.user_id limit 1),'乐生活用户'),'coupon_snapshot',claim_row.coupon_snapshot,'status',claim_row.status)); end if;
  else
    select * into member_row from public.merchant_memberships where id=code_id and merchant_user_id=p_merchant_user_id;
    if found then return jsonb_build_object('kind','member','code','LSH-'||lpad(member_row.id::text,6,'0'),'member',jsonb_build_object('id',member_row.id,'user_id',member_row.user_id,'user_name',member_row.user_name,'user_avatar',member_row.user_avatar,'points',member_row.points,'stamp_count',member_row.stamp_count,'status',member_row.status)); end if;
  end if;
  return '{}'::jsonb;
end;
$$;

revoke all on function public.merchant_restaurant_benefits_snapshot(uuid) from public, anon;
revoke all on function public.merchant_restaurant_benefit_lookup(uuid,text) from public, anon;
grant execute on function public.merchant_restaurant_benefits_snapshot(uuid) to authenticated;
grant execute on function public.merchant_restaurant_benefit_lookup(uuid,text) to authenticated;

analyze public.merchant_memberships;
analyze public.merchant_coupon_claims;
analyze public.merchant_member_transactions;
analyze public.merchant_order_bills;
