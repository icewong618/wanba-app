-- 乐生活 v5.581：商家活动报名模块
-- 公开页面只能查看活动并提交报名；参与者资料仅商家主号、授权员工可读取。

create table if not exists public.merchant_events (
  id uuid primary key default gen_random_uuid(),
  merchant_user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 100),
  description text not null default '' check (char_length(description) <= 2000),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  capacity integer not null check (capacity between 1 and 10000),
  max_per_account integer not null default 1 check (max_per_account between 1 and 20),
  location_text text not null default '' check (char_length(location_text) <= 300),
  contact_required boolean not null default true,
  status text not null default 'published' check (status in ('draft','published','cancelled','completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table if not exists public.merchant_event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.merchant_events(id) on delete cascade,
  merchant_user_id uuid not null references auth.users(id) on delete cascade,
  customer_user_id uuid references auth.users(id) on delete set null,
  customer_name text not null check (char_length(customer_name) between 1 and 80),
  customer_phone text not null check (char_length(customer_phone) between 5 and 40),
  party_size integer not null check (party_size between 1 and 20),
  note text not null default '' check (char_length(note) <= 500),
  status text not null default 'registered' check (status in ('registered','cancelled','checked_in','no_show')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists merchant_events_public_idx on public.merchant_events (merchant_user_id, starts_at) where status = 'published';
create index if not exists merchant_event_registrations_event_idx on public.merchant_event_registrations (event_id, status, created_at);
create index if not exists merchant_event_registrations_customer_idx on public.merchant_event_registrations (customer_user_id, event_id, status);

alter table public.merchant_events enable row level security;
alter table public.merchant_event_registrations enable row level security;
revoke all on public.merchant_events from anon, authenticated;
revoke all on public.merchant_event_registrations from anon, authenticated;

create or replace function public.merchant_events_can_manage(p_merchant_user_id uuid)
returns boolean language sql stable security definer set search_path = public, auth as $$
  select exists (
    select 1 from public.merchants m
    where m.user_id = p_merchant_user_id
      and (m.user_id = auth.uid() or exists (
        select 1 from public.merchant_team_members member
        where member.merchant_user_id = p_merchant_user_id
          and member.member_user_id = auth.uid()
          and member.status = 'active'
          and ('content_publish' = any(coalesce(member.permissions, array[]::text[]))
            or 'order_manage' = any(coalesce(member.permissions, array[]::text[]))
            or 'manager' = any(coalesce(member.roles, array[]::text[])))
      ))
  );
$$;

create or replace function public.merchant_events_public_catalog(p_slug text)
returns jsonb language plpgsql security definer set search_path = public, auth as $$
declare v_merchant public.merchants%rowtype;
begin
  select * into v_merchant from public.merchants
  where slug = lower(trim(coalesce(p_slug,'')))
    and coalesce(verified, false) = true
    and coalesce(enabled_features,'[]'::jsonb) ? 'event_registration'
  limit 1;
  if not found then return null; end if;
  return jsonb_build_object(
    'merchant', jsonb_build_object('user_id',v_merchant.user_id,'business_name',v_merchant.business_name,'address',coalesce(v_merchant.address,''),'phone',coalesce(v_merchant.phone,'')),
    'events', coalesce((select jsonb_agg(to_jsonb(e) - 'merchant_user_id' order by e.starts_at asc)
      from public.merchant_events e
      where e.merchant_user_id = v_merchant.user_id and e.status = 'published' and e.ends_at >= now()), '[]'::jsonb)
  );
end;
$$;

create or replace function public.merchant_event_register(p_event_id uuid, p_customer_name text, p_customer_phone text, p_party_size integer default 1, p_note text default '')
returns jsonb language plpgsql security definer set search_path = public, auth as $$
declare v_event public.merchant_events%rowtype; v_taken integer; v_existing integer; v_id uuid; v_code text;
begin
  select * into v_event from public.merchant_events where id = p_event_id for update;
  if not found or v_event.status <> 'published' or v_event.ends_at < now() then raise exception 'event_unavailable'; end if;
  if char_length(trim(coalesce(p_customer_name,''))) = 0 or char_length(trim(coalesce(p_customer_phone,''))) < 5 then raise exception 'contact_required'; end if;
  if coalesce(p_party_size,0) < 1 or p_party_size > v_event.max_per_account then raise exception 'party_limit'; end if;
  select coalesce(sum(party_size),0) into v_taken from public.merchant_event_registrations where event_id = v_event.id and status in ('registered','checked_in');
  if v_taken + p_party_size > v_event.capacity then raise exception 'event_full'; end if;
  if auth.uid() is not null then
    select coalesce(sum(party_size),0) into v_existing from public.merchant_event_registrations where event_id=v_event.id and customer_user_id=auth.uid() and status in ('registered','checked_in');
  else
    select coalesce(sum(party_size),0) into v_existing from public.merchant_event_registrations where event_id=v_event.id and customer_user_id is null and customer_phone=trim(p_customer_phone) and status in ('registered','checked_in');
  end if;
  if v_existing + p_party_size > v_event.max_per_account then raise exception 'already_registered'; end if;
  v_code := 'EV-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8));
  insert into public.merchant_event_registrations(event_id,merchant_user_id,customer_user_id,customer_name,customer_phone,party_size,note)
  values(v_event.id,v_event.merchant_user_id,auth.uid(),trim(p_customer_name),trim(p_customer_phone),p_party_size,left(coalesce(p_note,''),500)) returning id into v_id;
  return jsonb_build_object('id',v_id,'registration_code',v_code,'event_title',v_event.title,'party_size',p_party_size);
end;
$$;

create or replace function public.merchant_event_manager_snapshot(p_merchant_user_id uuid)
returns jsonb language plpgsql security definer set search_path = public, auth as $$
begin
  if not public.merchant_events_can_manage(p_merchant_user_id) then raise exception 'not_authorized'; end if;
  return jsonb_build_object(
    'events', coalesce((select jsonb_agg(to_jsonb(e) order by e.starts_at desc) from public.merchant_events e where e.merchant_user_id=p_merchant_user_id),'[]'::jsonb),
    'registrations', coalesce((select jsonb_agg(to_jsonb(r) order by r.created_at desc) from public.merchant_event_registrations r where r.merchant_user_id=p_merchant_user_id),'[]'::jsonb)
  );
end;
$$;

create or replace function public.merchant_event_save(p_merchant_user_id uuid, p_event jsonb)
returns jsonb language plpgsql security definer set search_path = public, auth as $$
declare v_id uuid := nullif(p_event->>'id','')::uuid; v_row public.merchant_events%rowtype;
begin
  if not public.merchant_events_can_manage(p_merchant_user_id) then raise exception 'not_authorized'; end if;
  if coalesce(trim(p_event->>'title'),'') = '' then raise exception 'title_required'; end if;
  if v_id is null then
    insert into public.merchant_events(merchant_user_id,title,description,starts_at,ends_at,capacity,max_per_account,location_text,status)
    values(p_merchant_user_id,trim(p_event->>'title'),left(coalesce(p_event->>'description',''),2000),(p_event->>'starts_at')::timestamptz,(p_event->>'ends_at')::timestamptz,coalesce((p_event->>'capacity')::int,1),coalesce((p_event->>'max_per_account')::int,1),left(coalesce(p_event->>'location_text',''),300),coalesce(p_event->>'status','published')) returning * into v_row;
  else
    update public.merchant_events set title=trim(p_event->>'title'),description=left(coalesce(p_event->>'description',''),2000),starts_at=(p_event->>'starts_at')::timestamptz,ends_at=(p_event->>'ends_at')::timestamptz,capacity=coalesce((p_event->>'capacity')::int,1),max_per_account=coalesce((p_event->>'max_per_account')::int,1),location_text=left(coalesce(p_event->>'location_text',''),300),status=coalesce(p_event->>'status','published'),updated_at=now() where id=v_id and merchant_user_id=p_merchant_user_id returning * into v_row;
    if not found then raise exception 'event_not_found'; end if;
  end if;
  return to_jsonb(v_row);
end;
$$;

create or replace function public.merchant_event_set_registration_status(p_registration_id uuid, p_status text)
returns jsonb language plpgsql security definer set search_path = public, auth as $$
declare v_row public.merchant_event_registrations%rowtype;
begin
  select * into v_row from public.merchant_event_registrations where id=p_registration_id for update;
  if not found or not public.merchant_events_can_manage(v_row.merchant_user_id) then raise exception 'not_authorized'; end if;
  if p_status not in ('registered','cancelled','checked_in','no_show') then raise exception 'invalid_status'; end if;
  update public.merchant_event_registrations set status=p_status,updated_at=now() where id=p_registration_id returning * into v_row;
  return to_jsonb(v_row);
end;
$$;

revoke all on function public.merchant_events_can_manage(uuid) from public, anon, authenticated;
revoke all on function public.merchant_events_public_catalog(text) from public;
revoke all on function public.merchant_event_register(uuid,text,text,integer,text) from public;
revoke all on function public.merchant_event_manager_snapshot(uuid) from public, anon;
revoke all on function public.merchant_event_save(uuid,jsonb) from public, anon;
revoke all on function public.merchant_event_set_registration_status(uuid,text) from public, anon;
grant execute on function public.merchant_events_public_catalog(text) to anon, authenticated;
grant execute on function public.merchant_event_register(uuid,text,text,integer,text) to anon, authenticated;
grant execute on function public.merchant_event_manager_snapshot(uuid) to authenticated;
grant execute on function public.merchant_event_save(uuid,jsonb) to authenticated;
grant execute on function public.merchant_event_set_registration_status(uuid,text) to authenticated;
