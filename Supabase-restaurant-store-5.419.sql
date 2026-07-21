-- 乐生活 v5.419：独立餐饮菜单与餐桌管理。

create or replace function public.merchant_restaurant_store_snapshot(p_merchant_user_id uuid)
returns jsonb
language plpgsql security definer set search_path = public, pg_temp
as $$
declare can_menu boolean; can_table boolean; merchant_row public.merchants%rowtype; table_rows jsonb;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  can_menu := public.merchant_matrix_has_permission(p_merchant_user_id, 'menu_manage');
  can_table := public.merchant_matrix_has_permission(p_merchant_user_id, 'table_manage');
  if not can_menu and not can_table then raise exception 'restaurant_store_not_allowed'; end if;
  select * into merchant_row from public.merchants where user_id=p_merchant_user_id and verified=true;
  if not found then raise exception 'merchant_not_found'; end if;
  select coalesce(jsonb_agg(jsonb_build_object('id',t.id,'table_code',t.table_code,'table_name',t.table_name,'is_active',t.is_active,'created_at',t.created_at) order by t.table_name),'[]'::jsonb)
  into table_rows from public.merchant_order_tables t
  where t.merchant_user_id=p_merchant_user_id and t.deleted_at is null;
  return jsonb_build_object('merchant',jsonb_build_object('user_id',merchant_row.user_id,'business_name',merchant_row.business_name),'products',coalesce(merchant_row.products,'[]'::jsonb),'tables',table_rows,'permissions',jsonb_build_object('menu',can_menu,'table',can_table));
end;
$$;

create or replace function public.merchant_restaurant_save_menu(p_merchant_user_id uuid,p_products jsonb)
returns jsonb
language plpgsql security definer set search_path = public, pg_temp
as $$
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  if not public.merchant_matrix_has_permission(p_merchant_user_id,'menu_manage') then raise exception 'menu_manage_not_allowed'; end if;
  if jsonb_typeof(coalesce(p_products,'[]'::jsonb)) <> 'array' or jsonb_array_length(p_products)>500 then raise exception 'invalid_menu_products'; end if;
  update public.merchants set products=p_products,updated_at=now() where user_id=p_merchant_user_id and verified=true;
  if not found then raise exception 'merchant_not_found'; end if;
  return p_products;
end;
$$;

create or replace function public.merchant_restaurant_upsert_table(p_merchant_user_id uuid,p_table_id bigint default null,p_table_name text default '',p_is_active boolean default true)
returns public.merchant_order_tables
language plpgsql security definer set search_path = public, pg_temp
as $$
declare result_row public.merchant_order_tables; table_code_value text;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  if not public.merchant_matrix_has_permission(p_merchant_user_id,'table_manage') then raise exception 'table_manage_not_allowed'; end if;
  if char_length(trim(coalesce(p_table_name,''))) not between 1 and 24 then raise exception 'invalid_table_name'; end if;
  if p_table_id is null then
    table_code_value := 't-'||substr(md5(random()::text||clock_timestamp()::text),1,14);
    insert into public.merchant_order_tables(merchant_user_id,table_code,table_name,is_active) values(p_merchant_user_id,table_code_value,trim(p_table_name),coalesce(p_is_active,true)) returning * into result_row;
  else
    update public.merchant_order_tables set table_name=trim(p_table_name),is_active=coalesce(p_is_active,true),updated_at=now()
    where id=p_table_id and merchant_user_id=p_merchant_user_id and deleted_at is null returning * into result_row;
    if not found then raise exception 'table_not_found'; end if;
  end if;
  return result_row;
end;
$$;

create or replace function public.merchant_restaurant_delete_table(p_table_id bigint)
returns boolean
language plpgsql security definer set search_path = public, pg_temp
as $$
declare merchant_id uuid;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  select merchant_user_id into merchant_id from public.merchant_order_tables where id=p_table_id for update;
  if not found then raise exception 'table_not_found'; end if;
  if not public.merchant_matrix_has_permission(merchant_id,'table_manage') then raise exception 'table_manage_not_allowed'; end if;
  update public.merchant_order_tables set is_active=false,deleted_at=now(),updated_at=now() where id=p_table_id;
  return true;
end;
$$;

revoke all on function public.merchant_restaurant_store_snapshot(uuid) from public, anon;
revoke all on function public.merchant_restaurant_save_menu(uuid,jsonb) from public, anon;
revoke all on function public.merchant_restaurant_upsert_table(uuid,bigint,text,boolean) from public, anon;
revoke all on function public.merchant_restaurant_delete_table(bigint) from public, anon;
grant execute on function public.merchant_restaurant_store_snapshot(uuid) to authenticated;
grant execute on function public.merchant_restaurant_save_menu(uuid,jsonb) to authenticated;
grant execute on function public.merchant_restaurant_upsert_table(uuid,bigint,text,boolean) to authenticated;
grant execute on function public.merchant_restaurant_delete_table(bigint) to authenticated;
