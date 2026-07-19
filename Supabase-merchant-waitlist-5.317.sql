-- 乐生活 v5.317：餐厅扫码排队与预点菜。
-- 公开排队看板仅返回人数和排队编号，不暴露顾客姓名、电话或预点菜内容。

create table if not exists public.merchant_waitlists (
  id uuid primary key default gen_random_uuid(),
  queue_code text not null unique default ('LSQ-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8))),
  manage_token uuid not null default gen_random_uuid(),
  merchant_user_id uuid not null references auth.users(id) on delete cascade,
  customer_user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  customer_phone text not null,
  party_size integer not null check (party_size between 1 and 20),
  queue_date date not null default (timezone('America/Los_Angeles', now())::date),
  queue_number integer not null,
  status text not null default 'queued' check (status in ('queued','seated','cancelled','expired')),
  estimated_wait_minutes integer not null default 0 check (estimated_wait_minutes >= 0),
  preorder_items jsonb not null default '[]'::jsonb,
  preorder_updated_at timestamptz,
  seated_table_id bigint references public.merchant_order_tables(id) on delete set null,
  seated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint merchant_waitlists_daily_number_unique unique (merchant_user_id, queue_date, queue_number)
);

create index if not exists merchant_waitlists_public_board_idx
  on public.merchant_waitlists (merchant_user_id, queue_date, status, queue_number);
create index if not exists merchant_waitlists_customer_idx
  on public.merchant_waitlists (customer_user_id, merchant_user_id, created_at desc)
  where customer_user_id is not null;

alter table public.merchant_waitlists enable row level security;
revoke all on table public.merchant_waitlists from anon, authenticated;

create or replace function public.merchant_waitlist_public_board(p_merchant_user_id uuid)
returns table(queue_code text, party_size integer, queue_number integer, estimated_wait_minutes integer, status text, created_at timestamptz)
language sql
stable
security definer
set search_path = public, auth
as $$
  select w.queue_code, w.party_size, w.queue_number, w.estimated_wait_minutes, w.status, w.created_at
  from public.merchant_waitlists w
  where w.merchant_user_id = p_merchant_user_id
    and w.queue_date = timezone('America/Los_Angeles', now())::date
    and w.status = 'queued'
  order by w.queue_number asc
  limit 80;
$$;

create or replace function public.merchant_waitlist_join(
  p_merchant_user_id uuid,
  p_customer_name text,
  p_customer_phone text,
  p_party_size integer
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_date date := timezone('America/Los_Angeles', now())::date;
  v_number integer;
  v_ahead integer;
  v_wait public.merchant_waitlists%rowtype;
  v_user_id uuid := auth.uid();
begin
  if coalesce(trim(p_customer_name),'') = '' then raise exception 'waitlist_name_required'; end if;
  if coalesce(trim(p_customer_phone),'') = '' then raise exception 'waitlist_phone_required'; end if;
  if coalesce(p_party_size,0) not between 1 and 20 then raise exception 'waitlist_party_size_invalid'; end if;
  if not exists(select 1 from public.merchants where user_id = p_merchant_user_id and verified = true) then
    raise exception 'waitlist_merchant_not_found';
  end if;

  -- Serialize the per-merchant daily queue number; it avoids duplicate positions under concurrent scans.
  perform pg_advisory_xact_lock(hashtext(p_merchant_user_id::text || v_date::text));
  select coalesce(max(queue_number), 0) + 1 into v_number
  from public.merchant_waitlists
  where merchant_user_id = p_merchant_user_id and queue_date = v_date;
  select count(*) into v_ahead
  from public.merchant_waitlists
  where merchant_user_id = p_merchant_user_id and queue_date = v_date and status = 'queued';

  insert into public.merchant_waitlists(
    merchant_user_id, customer_user_id, customer_name, customer_phone, party_size,
    queue_date, queue_number, estimated_wait_minutes
  ) values (
    p_merchant_user_id, v_user_id, left(trim(p_customer_name), 40), left(trim(p_customer_phone), 32),
    p_party_size, v_date, v_number, v_ahead * 10
  ) returning * into v_wait;

  return jsonb_build_object(
    'id', v_wait.id, 'queue_code', v_wait.queue_code, 'manage_token', v_wait.manage_token,
    'queue_number', v_wait.queue_number, 'people_ahead', v_ahead,
    'estimated_wait_minutes', v_wait.estimated_wait_minutes
  );
end;
$$;

create or replace function public.merchant_waitlist_save_preorder(
  p_waitlist_id uuid,
  p_manage_token uuid,
  p_items jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_wait public.merchant_waitlists%rowtype;
begin
  if jsonb_typeof(coalesce(p_items, '[]'::jsonb)) <> 'array' then raise exception 'waitlist_items_invalid'; end if;
  select * into v_wait from public.merchant_waitlists
  where id = p_waitlist_id and manage_token = p_manage_token
  for update;
  if not found or v_wait.status <> 'queued' then raise exception 'waitlist_not_editable'; end if;
  if jsonb_array_length(p_items) > 80 then raise exception 'waitlist_items_too_many'; end if;
  update public.merchant_waitlists
  set preorder_items = p_items, preorder_updated_at = now(), updated_at = now()
  where id = v_wait.id;
  return jsonb_build_object('id', p_waitlist_id, 'item_count', jsonb_array_length(p_items));
end;
$$;

create or replace function public.merchant_waitlist_manager_list(p_merchant_user_id uuid)
returns table(
  id uuid, queue_code text, customer_name text, customer_phone text, party_size integer,
  queue_number integer, status text, estimated_wait_minutes integer, preorder_items jsonb,
  created_at timestamptz, seated_at timestamptz
)
language sql
stable
security definer
set search_path = public, auth
as $$
  select w.id, w.queue_code, w.customer_name, w.customer_phone, w.party_size,
         w.queue_number, w.status, w.estimated_wait_minutes, w.preorder_items,
         w.created_at, w.seated_at
  from public.merchant_waitlists w
  where w.merchant_user_id = p_merchant_user_id
    and w.queue_date = timezone('America/Los_Angeles', now())::date
    and public.merchant_matrix_has_permission(p_merchant_user_id, 'order_manage')
  order by case when w.status = 'queued' then 0 else 1 end, w.queue_number asc;
$$;

create or replace function public.merchant_waitlist_set_status(
  p_waitlist_id uuid,
  p_status text,
  p_table_id bigint default null
)
returns public.merchant_waitlists
language plpgsql
security definer
set search_path = public, auth
as $$
declare v_wait public.merchant_waitlists%rowtype;
begin
  if p_status not in ('queued','seated','cancelled','expired') then raise exception 'waitlist_status_invalid'; end if;
  select * into v_wait from public.merchant_waitlists where id = p_waitlist_id for update;
  if not found or not public.merchant_matrix_has_permission(v_wait.merchant_user_id, 'order_manage') then raise exception 'waitlist_not_allowed'; end if;
  update public.merchant_waitlists
  set status = p_status,
      seated_table_id = case when p_status = 'seated' then p_table_id else seated_table_id end,
      seated_at = case when p_status = 'seated' then now() else seated_at end,
      updated_at = now()
  where id = p_waitlist_id
  returning * into v_wait;
  return v_wait;
end;
$$;

revoke all on function public.merchant_waitlist_public_board(uuid) from public, anon, authenticated;
revoke all on function public.merchant_waitlist_join(uuid,text,text,integer) from public, anon, authenticated;
revoke all on function public.merchant_waitlist_save_preorder(uuid,uuid,jsonb) from public, anon, authenticated;
revoke all on function public.merchant_waitlist_manager_list(uuid) from public, anon, authenticated;
revoke all on function public.merchant_waitlist_set_status(uuid,text,bigint) from public, anon, authenticated;

grant execute on function public.merchant_waitlist_public_board(uuid) to anon, authenticated;
grant execute on function public.merchant_waitlist_join(uuid,text,text,integer) to anon, authenticated;
grant execute on function public.merchant_waitlist_save_preorder(uuid,uuid,jsonb) to anon, authenticated;
grant execute on function public.merchant_waitlist_manager_list(uuid) to authenticated;
grant execute on function public.merchant_waitlist_set_status(uuid,text,bigint) to authenticated;
