-- 乐生活 v5.417：餐饮订单工作台。
-- 独立提供后厨、传菜和收银待办数据；实际收款继续由现有结算流程处理。

create or replace function public.merchant_restaurant_operations_snapshot(
  p_merchant_user_id uuid,
  p_order_type text default 'all'
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  can_view boolean;
  can_kitchen boolean;
  can_serve boolean;
  can_cashier boolean;
  order_rows jsonb;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  can_view := public.merchant_matrix_has_permission(p_merchant_user_id, 'order_view')
    or public.merchant_matrix_has_permission(p_merchant_user_id, 'order_manage')
    or public.merchant_matrix_has_permission(p_merchant_user_id, 'kitchen_view')
    or public.merchant_matrix_has_permission(p_merchant_user_id, 'kitchen_complete')
    or public.merchant_matrix_has_permission(p_merchant_user_id, 'order_serve')
    or public.merchant_matrix_has_permission(p_merchant_user_id, 'order_complete');
  if not can_view then
    raise exception 'restaurant_operations_not_allowed';
  end if;

  can_kitchen := public.merchant_matrix_has_permission(p_merchant_user_id, 'kitchen_complete');
  can_serve := public.merchant_matrix_has_permission(p_merchant_user_id, 'order_serve');
  can_cashier := public.merchant_matrix_has_permission(p_merchant_user_id, 'order_complete');

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', o.id,
    'order_code', o.order_code,
    'order_type', coalesce(o.order_type, 'dinein'),
    'fulfillment', o.fulfillment,
    'table_name', o.table_name,
    'customer_name', coalesce(o.customer_name, o.user_name, '扫码顾客'),
    'customer_phone', o.customer_phone,
    'delivery_address', o.delivery_address,
    'note', o.note,
    'status', o.status,
    'subtotal', o.subtotal,
    'item_count', o.item_count,
    'addition_count', o.addition_count,
    'payment_status', coalesce(o.payment_status, 'unpaid'),
    'created_at', o.created_at,
    'updated_at', o.updated_at,
    'items', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', i.id,
        'batch_no', i.batch_no,
        'product_name', i.product_name,
        'quantity', i.quantity,
        'price_label', i.price_label,
        'kitchen_done', coalesce(i.kitchen_done, false),
        'is_served', coalesce(i.is_served, false),
        'created_at', i.created_at
      ) order by i.batch_no asc, i.created_at asc)
      from public.merchant_order_items i
      where i.order_id = o.id
    ), '[]'::jsonb)
  ) order by coalesce(o.updated_at, o.created_at) asc), '[]'::jsonb)
  into order_rows
  from public.merchant_orders o
  where o.merchant_user_id = p_merchant_user_id
    and o.status not in ('completed', 'cancelled')
    and (
      coalesce(p_order_type, 'all') = 'all'
      or coalesce(o.order_type, 'dinein') = p_order_type
    );

  return jsonb_build_object(
    'permissions', jsonb_build_object(
      'view', can_view,
      'kitchen', can_kitchen,
      'serve', can_serve,
      'cashier', can_cashier
    ),
    'orders', order_rows
  );
end;
$$;

revoke all on function public.merchant_restaurant_operations_snapshot(uuid, text) from public, anon;
grant execute on function public.merchant_restaurant_operations_snapshot(uuid, text) to authenticated;

-- 餐饮员工可兼任多个岗位，例如后厨 + 服务员 + 收银。
-- 权限仍由岗位自动计算，前端无需逐项配置。
create or replace function public.merchant_matrix_invite_member_v2(
  p_member_user_id uuid,
  p_roles text[],
  p_permissions text[] default array[]::text[]
)
returns public.merchant_team_members
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  row_out public.merchant_team_members;
  roles_clean text[];
  perms_clean text[];
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  if not exists(select 1 from public.merchants where user_id=auth.uid() and verified=true) then raise exception 'merchant_not_verified'; end if;
  if p_member_user_id is null or p_member_user_id=auth.uid() or not exists(select 1 from public.profiles where user_id=p_member_user_id) then raise exception 'invalid_member'; end if;

  select array_agg(distinct value order by value) into roles_clean
  from unnest(coalesce(p_roles,array[]::text[])) value
  where value in ('manager','cashier','runner','kitchen','operator');
  if coalesce(cardinality(roles_clean),0)=0 then raise exception 'role_required'; end if;

  perms_clean := public.merchant_staff_role_permissions(roles_clean);
  insert into public.merchant_team_members(merchant_user_id,member_user_id,role,roles,permissions,status,invited_by,invited_at,responded_at,revoked_at,updated_at)
  values(auth.uid(),p_member_user_id,roles_clean[1],roles_clean,coalesce(perms_clean,array[]::text[]),'pending',auth.uid(),now(),null,null,now())
  on conflict(merchant_user_id,member_user_id) do update
    set role=excluded.role,roles=excluded.roles,permissions=excluded.permissions,status='pending',invited_by=auth.uid(),invited_at=now(),responded_at=null,revoked_at=null,updated_at=now()
  returning * into row_out;
  return row_out;
end;
$$;

create or replace function public.merchant_matrix_update_member_access(
  p_team_member_id bigint,
  p_roles text[],
  p_permissions text[] default array[]::text[]
)
returns public.merchant_team_members
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  member_row public.merchant_team_members;
  roles_clean text[];
  perms_clean text[];
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  select * into member_row from public.merchant_team_members where id=p_team_member_id for update;
  if not found or member_row.merchant_user_id<>auth.uid() then raise exception 'not_team_owner'; end if;

  select array_agg(distinct value order by value) into roles_clean
  from unnest(coalesce(p_roles,array[]::text[])) value
  where value in ('manager','cashier','runner','kitchen','operator');
  if coalesce(cardinality(roles_clean),0)=0 then raise exception 'role_required'; end if;

  perms_clean := public.merchant_staff_role_permissions(roles_clean);
  update public.merchant_team_members
  set role=roles_clean[1],roles=roles_clean,permissions=coalesce(perms_clean,array[]::text[]),updated_at=now()
  where id=p_team_member_id
  returning * into member_row;
  return member_row;
end;
$$;

revoke all on function public.merchant_matrix_invite_member_v2(uuid,text[],text[]) from public, anon;
revoke all on function public.merchant_matrix_update_member_access(bigint,text[],text[]) from public, anon;
grant execute on function public.merchant_matrix_invite_member_v2(uuid,text[],text[]) to authenticated;
grant execute on function public.merchant_matrix_update_member_access(bigint,text[],text[]) to authenticated;
