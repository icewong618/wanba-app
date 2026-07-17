-- 乐生活 v5.270：商家员工岗位、制作完成与传菜上桌分权

alter table public.merchant_team_members
  add column if not exists roles text[] not null default array['clerk']::text[],
  add column if not exists permissions text[] not null default array[]::text[];

alter table public.merchant_team_members
  drop constraint if exists merchant_team_members_role_check;
alter table public.merchant_team_members
  add constraint merchant_team_members_role_check
  check (role in ('operator','clerk','manager','kitchen','runner','cashier','cleaning','other'));

update public.merchant_team_members
set roles = case when role = 'operator' then array['operator']::text[] else array['clerk']::text[] end,
    permissions = case
      when role = 'operator' then array['content_manage','coupon_redeem','member_manage']::text[]
      else array['coupon_redeem','member_manage','order_serve']::text[]
    end
where roles is null or cardinality(roles) = 0;

alter table public.merchant_order_items
  add column if not exists kitchen_done boolean not null default false,
  add column if not exists kitchen_done_at timestamptz,
  add column if not exists kitchen_done_by uuid references auth.users(id);

create or replace function public.merchant_matrix_has_permission(p_merchant_user_id uuid, p_permission text)
returns boolean
language sql stable security definer set search_path = public, pg_temp as $$
  select auth.uid() = p_merchant_user_id
  or exists (
    select 1 from public.merchant_team_members t
    where t.merchant_user_id = p_merchant_user_id
      and t.member_user_id = auth.uid()
      and t.status = 'active'
      and (
        'manager' = any(coalesce(t.roles, array[t.role]))
        or p_permission = any(coalesce(t.permissions, array[]::text[]))
      )
  );
$$;
revoke all on function public.merchant_matrix_has_permission(uuid,text) from public;
grant execute on function public.merchant_matrix_has_permission(uuid,text) to authenticated;

create or replace function public.merchant_matrix_has_role(p_merchant_user_id uuid, p_allowed_roles text[] default array['operator','clerk']::text[])
returns boolean language sql stable security definer set search_path = public, pg_temp as $$
  select auth.uid() = p_merchant_user_id
  or exists (
    select 1 from public.merchant_team_members t
    where t.merchant_user_id = p_merchant_user_id and t.member_user_id = auth.uid() and t.status = 'active'
      and coalesce(t.roles, array[t.role]) && p_allowed_roles
  );
$$;
revoke all on function public.merchant_matrix_has_role(uuid,text[]) from public;
grant execute on function public.merchant_matrix_has_role(uuid,text[]) to authenticated;

create or replace function public.merchant_order_can_manage(p_merchant_user_id uuid)
returns boolean language sql stable security definer set search_path = public, pg_temp as $$
  select public.merchant_matrix_has_permission(p_merchant_user_id, 'order_view')
      or public.merchant_matrix_has_permission(p_merchant_user_id, 'order_manage')
      or public.merchant_matrix_has_permission(p_merchant_user_id, 'kitchen_view')
      or public.merchant_matrix_has_permission(p_merchant_user_id, 'order_serve')
      or public.merchant_matrix_has_permission(p_merchant_user_id, 'order_complete');
$$;
revoke all on function public.merchant_order_can_manage(uuid) from public;
grant execute on function public.merchant_order_can_manage(uuid) to authenticated;

create or replace function public.merchant_order_set_item_kitchen_done(p_item_id bigint, p_done boolean)
returns public.merchant_order_items
language plpgsql security definer set search_path = public, pg_temp as $$
declare item_row public.merchant_order_items; merchant_id uuid;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  select o.merchant_user_id into merchant_id
  from public.merchant_order_items i join public.merchant_orders o on o.id=i.order_id
  where i.id=p_item_id for update;
  if not found then raise exception 'order_item_not_found'; end if;
  select * into item_row from public.merchant_order_items where id=p_item_id;
  if not public.merchant_matrix_has_permission(merchant_id,'kitchen_complete') then raise exception 'not_kitchen_staff'; end if;
  update public.merchant_order_items
  set kitchen_done = coalesce(p_done,false),
      kitchen_done_at = case when coalesce(p_done,false) then now() else null end,
      kitchen_done_by = case when coalesce(p_done,false) then auth.uid() else null end
  where id=p_item_id returning * into item_row;
  return item_row;
end;
$$;
revoke all on function public.merchant_order_set_item_kitchen_done(bigint,boolean) from public;
grant execute on function public.merchant_order_set_item_kitchen_done(bigint,boolean) to authenticated;

create or replace function public.merchant_order_set_item_served(p_item_id bigint, p_is_served boolean)
returns public.merchant_order_items
language plpgsql security definer set search_path = public, pg_temp as $$
declare item_row public.merchant_order_items; merchant_id uuid; v_order_id uuid; remaining_count integer;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  select i.order_id, o.merchant_user_id into v_order_id, merchant_id
  from public.merchant_order_items i join public.merchant_orders o on o.id=i.order_id
  where i.id=p_item_id for update;
  if not found then raise exception 'order_item_not_found'; end if;
  select * into item_row from public.merchant_order_items where id=p_item_id;
  if not public.merchant_matrix_has_permission(merchant_id,'order_serve') then raise exception 'not_runner_staff'; end if;
  if coalesce(p_is_served,false) and not coalesce(item_row.kitchen_done,false) then raise exception 'kitchen_not_done'; end if;
  update public.merchant_order_items set is_served=coalesce(p_is_served,false), served_at=case when coalesce(p_is_served,false) then now() else null end where id=p_item_id returning * into item_row;
  select count(*) into remaining_count from public.merchant_order_items where order_id=v_order_id and not coalesce(is_served,false);
  update public.merchant_orders set status=case when remaining_count=0 then 'served' else 'preparing' end,updated_at=now() where id=v_order_id;
  return item_row;
end;
$$;
revoke all on function public.merchant_order_set_item_served(bigint,boolean) from public;
grant execute on function public.merchant_order_set_item_served(bigint,boolean) to authenticated;

create or replace function public.merchant_matrix_invite_member_v2(p_member_user_id uuid, p_roles text[], p_permissions text[] default array[]::text[])
returns public.merchant_team_members
language plpgsql security definer set search_path = public, pg_temp as $$
declare row_out public.merchant_team_members; roles_clean text[]; perms_clean text[];
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  if not exists(select 1 from public.merchants where user_id=auth.uid() and verified=true) then raise exception 'merchant_not_verified'; end if;
  if p_member_user_id is null or p_member_user_id=auth.uid() or not exists(select 1 from public.profiles where user_id=p_member_user_id) then raise exception 'invalid_member'; end if;
  select array_agg(distinct value order by value) into roles_clean from unnest(coalesce(p_roles,array[]::text[])) value where value in ('manager','kitchen','runner','cashier','cleaning','other','operator');
  if coalesce(cardinality(roles_clean),0)=0 then raise exception 'role_required'; end if;
  select array_agg(distinct value order by value) into perms_clean from unnest(coalesce(p_permissions,array[]::text[]) || case when 'manager'=any(roles_clean) then array['order_view','order_manage','kitchen_view','kitchen_complete','order_serve','order_complete','coupon_redeem','member_manage','menu_manage','table_manage','content_manage','team_manage','bill_view'] when 'kitchen'=any(roles_clean) then array['kitchen_view','kitchen_complete'] else array[]::text[] end || case when 'runner'=any(roles_clean) then array['order_view','order_serve'] else array[]::text[] end || case when 'cashier'=any(roles_clean) then array['order_view','order_complete','coupon_redeem','member_manage','bill_view'] else array[]::text[] end || case when 'operator'=any(roles_clean) then array['content_manage'] else array[]::text[] end) value where value in ('order_view','order_manage','kitchen_view','kitchen_complete','order_serve','order_complete','coupon_redeem','member_manage','menu_manage','table_manage','content_manage','team_manage','bill_view');
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
  select array_agg(distinct value order by value) into roles_clean from unnest(coalesce(p_roles,array[]::text[])) value where value in ('manager','kitchen','runner','cashier','cleaning','other','operator');
  if coalesce(cardinality(roles_clean),0)=0 then raise exception 'role_required'; end if;
  select array_agg(distinct value order by value) into perms_clean from unnest(coalesce(p_permissions,array[]::text[]) || case when 'manager'=any(roles_clean) then array['order_view','order_manage','kitchen_view','kitchen_complete','order_serve','order_complete','coupon_redeem','member_manage','menu_manage','table_manage','content_manage','team_manage','bill_view'] when 'kitchen'=any(roles_clean) then array['kitchen_view','kitchen_complete'] else array[]::text[] end || case when 'runner'=any(roles_clean) then array['order_view','order_serve'] else array[]::text[] end || case when 'cashier'=any(roles_clean) then array['order_view','order_complete','coupon_redeem','member_manage','bill_view'] else array[]::text[] end || case when 'operator'=any(roles_clean) then array['content_manage'] else array[]::text[] end) value where value in ('order_view','order_manage','kitchen_view','kitchen_complete','order_serve','order_complete','coupon_redeem','member_manage','menu_manage','table_manage','content_manage','team_manage','bill_view');
  update public.merchant_team_members set role=roles_clean[1],roles=roles_clean,permissions=coalesce(perms_clean,array[]::text[]),updated_at=now() where id=p_team_member_id returning * into member_row;
  return member_row;
end;
$$;

drop function if exists public.merchant_matrix_my_access();
create function public.merchant_matrix_my_access()
returns table (team_member_id bigint, merchant_user_id uuid, role text, roles text[], permissions text[], merchant jsonb)
language sql stable security definer set search_path = public, pg_temp as $$
  select t.id,t.merchant_user_id,t.role,coalesce(t.roles,array[t.role]),coalesce(t.permissions,array[]::text[]),jsonb_build_object('user_id',m.user_id,'business_name',m.business_name,'logo',m.logo,'cover_image',m.cover_image,'address',m.address,'verified',m.verified,'loyalty_target',m.loyalty_target,'loyalty_reward',m.loyalty_reward,'points_per_visit',m.points_per_visit,'membership_tiers',m.membership_tiers,'birthday_reward',m.birthday_reward)
  from public.merchant_team_members t join public.merchants m on m.user_id=t.merchant_user_id
  where t.member_user_id=auth.uid() and t.status='active' and coalesce(m.verified,false)=true order by t.updated_at desc;
$$;

revoke all on function public.merchant_matrix_invite_member_v2(uuid,text[],text[]) from public;
revoke all on function public.merchant_matrix_update_member_access(bigint,text[],text[]) from public;
revoke all on function public.merchant_matrix_my_access() from public;
grant execute on function public.merchant_matrix_invite_member_v2(uuid,text[],text[]) to authenticated;
grant execute on function public.merchant_matrix_update_member_access(bigint,text[],text[]) to authenticated;
grant execute on function public.merchant_matrix_my_access() to authenticated;
