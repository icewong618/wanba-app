-- 乐生活 v5.284：员工可兼任多个岗位；后厨 + 服务员可联动完成制作与上桌。

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
  if coalesce(cardinality(roles_clean),0)=0 then raise exception 'role_required'; end if;
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
  if coalesce(cardinality(roles_clean),0)=0 then raise exception 'role_required'; end if;
  perms_clean := public.merchant_staff_role_permissions(roles_clean);
  update public.merchant_team_members
  set role=roles_clean[1],roles=roles_clean,permissions=coalesce(perms_clean,array[]::text[]),updated_at=now()
  where id=p_team_member_id returning * into member_row;
  return member_row;
end;
$$;

create or replace function public.merchant_order_set_item_served(p_item_id bigint, p_is_served boolean)
returns public.merchant_order_items
language plpgsql security definer set search_path = public, pg_temp as $$
declare item_row public.merchant_order_items; merchant_id uuid; v_order_id uuid; remaining_count integer; can_link_kitchen boolean;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  select i.order_id, o.merchant_user_id into v_order_id, merchant_id
  from public.merchant_order_items i join public.merchant_orders o on o.id=i.order_id
  where i.id=p_item_id for update;
  if not found then raise exception 'order_item_not_found'; end if;
  if not public.merchant_matrix_has_permission(merchant_id,'order_serve') then raise exception 'not_runner_staff'; end if;
  select * into item_row from public.merchant_order_items where id=p_item_id;
  can_link_kitchen := auth.uid()=merchant_id or exists(
    select 1 from public.merchant_team_members t
    where t.merchant_user_id=merchant_id and t.member_user_id=auth.uid() and t.status='active'
      and ('manager'=any(coalesce(t.roles,array[t.role])) or coalesce(t.roles,array[t.role]) @> array['kitchen','runner']::text[])
  );
  if coalesce(p_is_served,false) and not coalesce(item_row.kitchen_done,false) then
    if not can_link_kitchen then raise exception 'kitchen_not_done'; end if;
    update public.merchant_order_items
    set kitchen_done=true,kitchen_done_at=now(),kitchen_done_by=auth.uid()
    where id=p_item_id returning * into item_row;
  end if;
  update public.merchant_order_items
  set is_served=coalesce(p_is_served,false),served_at=case when coalesce(p_is_served,false) then now() else null end,
      kitchen_done=case when not coalesce(p_is_served,false) and can_link_kitchen then false else kitchen_done end,
      kitchen_done_at=case when not coalesce(p_is_served,false) and can_link_kitchen then null else kitchen_done_at end,
      kitchen_done_by=case when not coalesce(p_is_served,false) and can_link_kitchen then null else kitchen_done_by end
  where id=p_item_id returning * into item_row;
  select count(*) into remaining_count from public.merchant_order_items where order_id=v_order_id and not coalesce(is_served,false);
  update public.merchant_orders set status=case when remaining_count=0 then 'served' else 'preparing' end,updated_at=now() where id=v_order_id;
  return item_row;
end;
$$;

revoke all on function public.merchant_matrix_invite_member_v2(uuid,text[],text[]) from public, anon;
revoke all on function public.merchant_matrix_update_member_access(bigint,text[],text[]) from public, anon;
revoke all on function public.merchant_order_set_item_served(bigint,boolean) from public, anon;
grant execute on function public.merchant_matrix_invite_member_v2(uuid,text[],text[]) to authenticated;
grant execute on function public.merchant_matrix_update_member_access(bigint,text[],text[]) to authenticated;
grant execute on function public.merchant_order_set_item_served(bigint,boolean) to authenticated;
