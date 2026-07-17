-- 乐生活 v5.282：商家员工岗位收口
-- 可选岗位：管理、收银、服务员、厨房、宣传。
-- 前端不再提供逐项勾选权限；数据库按岗位自动生成最小必要权限。

create or replace function public.merchant_staff_role_permissions(p_roles text[])
returns text[]
language sql
immutable
set search_path = public, pg_temp
as $$
  select case
    when 'manager' = any(coalesce(p_roles, array[]::text[])) then
      array['order_view','order_manage','kitchen_view','kitchen_complete','order_serve','order_complete','coupon_redeem','member_manage','menu_manage','table_manage','content_manage','team_manage','bill_view']::text[]
    else array(
      select distinct permission
      from unnest(
        case when 'kitchen' = any(coalesce(p_roles, array[]::text[])) then array['kitchen_view','kitchen_complete']::text[] else array[]::text[] end ||
        case when 'runner' = any(coalesce(p_roles, array[]::text[])) then array['order_view','order_serve']::text[] else array[]::text[] end ||
        case when 'cashier' = any(coalesce(p_roles, array[]::text[])) then array['order_view','order_complete','coupon_redeem','member_manage','bill_view']::text[] else array[]::text[] end ||
        case when 'operator' = any(coalesce(p_roles, array[]::text[])) then array['content_manage']::text[] else array[]::text[] end ||
        -- 旧“店员”账号保持原来的点餐、核销能力，避免历史员工突然失去权限。
        case when 'clerk' = any(coalesce(p_roles, array[]::text[])) then array['order_view','order_serve','coupon_redeem','member_manage']::text[] else array[]::text[] end
      ) as permission
      order by permission
    )
  end;
$$;

create or replace function public.merchant_matrix_has_permission(p_merchant_user_id uuid, p_permission text)
returns boolean
language sql stable security definer set search_path = public, pg_temp as $$
  select auth.uid() = p_merchant_user_id
  or exists (
    select 1
    from public.merchant_team_members t
    where t.merchant_user_id = p_merchant_user_id
      and t.member_user_id = auth.uid()
      and t.status = 'active'
      and p_permission = any(public.merchant_staff_role_permissions(coalesce(t.roles, array[t.role])))
  );
$$;

create or replace function public.merchant_matrix_invite_member_v2(p_member_user_id uuid, p_roles text[], p_permissions text[] default array[]::text[])
returns public.merchant_team_members
language plpgsql security definer set search_path = public, pg_temp as $$
declare row_out public.merchant_team_members; roles_clean text[]; perms_clean text[];
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  if not exists(select 1 from public.merchants where user_id=auth.uid() and verified=true) then raise exception 'merchant_not_verified'; end if;
  if p_member_user_id is null or p_member_user_id=auth.uid() or not exists(select 1 from public.profiles where user_id=p_member_user_id) then raise exception 'invalid_member'; end if;
  select array_agg(distinct value order by value) into roles_clean
  from unnest(coalesce(p_roles,array[]::text[])) value
  where value in ('manager','cashier','runner','kitchen','operator');
  if coalesce(cardinality(roles_clean),0)<>1 then raise exception 'one_role_required'; end if;
  perms_clean := public.merchant_staff_role_permissions(roles_clean);
  insert into public.merchant_team_members(merchant_user_id,member_user_id,role,roles,permissions,status,invited_by,invited_at,responded_at,revoked_at,updated_at)
  values(auth.uid(),p_member_user_id,roles_clean[1],roles_clean,coalesce(perms_clean,array[]::text[]),'pending',auth.uid(),now(),null,null,now())
  on conflict(merchant_user_id,member_user_id) do update set role=excluded.role,roles=excluded.roles,permissions=excluded.permissions,status='pending',invited_by=auth.uid(),invited_at=now(),responded_at=null,revoked_at=null,updated_at=now()
  returning * into row_out;
  return row_out;
end;
$$;

create or replace function public.merchant_matrix_update_member_access(p_team_member_id bigint,p_roles text[],p_permissions text[] default array[]::text[])
returns public.merchant_team_members
language plpgsql security definer set search_path = public, pg_temp as $$
declare member_row public.merchant_team_members; roles_clean text[]; perms_clean text[];
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  select * into member_row from public.merchant_team_members where id=p_team_member_id for update;
  if not found or member_row.merchant_user_id<>auth.uid() then raise exception 'not_team_owner'; end if;
  select array_agg(distinct value order by value) into roles_clean
  from unnest(coalesce(p_roles,array[]::text[])) value
  where value in ('manager','cashier','runner','kitchen','operator');
  if coalesce(cardinality(roles_clean),0)<>1 then raise exception 'one_role_required'; end if;
  perms_clean := public.merchant_staff_role_permissions(roles_clean);
  update public.merchant_team_members
  set role=roles_clean[1],roles=roles_clean,permissions=coalesce(perms_clean,array[]::text[]),updated_at=now()
  where id=p_team_member_id returning * into member_row;
  return member_row;
end;
$$;

revoke all on function public.merchant_staff_role_permissions(text[]) from public, anon;
revoke all on function public.merchant_matrix_has_permission(uuid,text) from public, anon;
revoke all on function public.merchant_matrix_invite_member_v2(uuid,text[],text[]) from public, anon;
revoke all on function public.merchant_matrix_update_member_access(bigint,text[],text[]) from public, anon;
grant execute on function public.merchant_matrix_has_permission(uuid,text) to authenticated;
grant execute on function public.merchant_matrix_invite_member_v2(uuid,text[],text[]) to authenticated;
grant execute on function public.merchant_matrix_update_member_access(bigint,text[],text[]) to authenticated;

