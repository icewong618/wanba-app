-- 乐生活 v5.582：独立票务、订单与核销模块
-- 公开页面仅暴露活动与票种；订单、购票人资料、二维码均通过受限 RPC 访问。

create table if not exists public.merchant_ticket_events (
  id uuid primary key default gen_random_uuid(),
  merchant_user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 100),
  description text not null default '' check (char_length(description) <= 2000),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  location_text text not null default '' check (char_length(location_text) <= 300),
  cover_image text not null default '',
  status text not null default 'published' check (status in ('draft','published','cancelled','completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table if not exists public.merchant_ticket_types (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.merchant_ticket_events(id) on delete cascade,
  merchant_user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  description text not null default '' check (char_length(description) <= 500),
  price numeric(10,2) not null default 0 check (price >= 0 and price <= 100000),
  stock integer not null check (stock between 1 and 100000),
  max_per_order integer not null default 6 check (max_per_order between 1 and 20),
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.merchant_ticket_orders (
  id uuid primary key default gen_random_uuid(),
  order_code text not null unique,
  merchant_user_id uuid not null references auth.users(id) on delete cascade,
  event_id uuid not null references public.merchant_ticket_events(id) on delete restrict,
  ticket_type_id uuid not null references public.merchant_ticket_types(id) on delete restrict,
  customer_user_id uuid references auth.users(id) on delete set null,
  customer_name text not null check (char_length(customer_name) between 1 and 80),
  customer_phone text not null check (char_length(customer_phone) between 5 and 40),
  quantity integer not null check (quantity between 1 and 20),
  unit_price numeric(10,2) not null check (unit_price >= 0),
  total_amount numeric(10,2) not null check (total_amount >= 0),
  currency text not null default 'usd',
  payment_status text not null default 'pending_payment' check (payment_status in ('free','pending_payment','processing','paid','failed','cancelled','refunded')),
  payment_provider text,
  payment_provider_reference text,
  payment_method text,
  payment_paid_at timestamptz,
  note text not null default '' check (char_length(note) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.merchant_tickets (
  id uuid primary key default gen_random_uuid(),
  ticket_code text not null unique,
  order_id uuid not null references public.merchant_ticket_orders(id) on delete cascade,
  event_id uuid not null references public.merchant_ticket_events(id) on delete cascade,
  ticket_type_id uuid not null references public.merchant_ticket_types(id) on delete restrict,
  merchant_user_id uuid not null references auth.users(id) on delete cascade,
  customer_user_id uuid references auth.users(id) on delete set null,
  holder_name text not null check (char_length(holder_name) between 1 and 80),
  status text not null default 'issued' check (status in ('issued','redeemed','cancelled','refunded')),
  redeemed_at timestamptz,
  redeemed_by_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.merchant_ticket_payment_attempts (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.merchant_ticket_orders(id) on delete cascade,
  merchant_user_id uuid not null references auth.users(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  provider text not null default 'stripe',
  provider_payment_id text not null unique,
  status text not null default 'requires_action' check (status in ('requires_action','succeeded','failed','cancelled')),
  amount numeric(10,2) not null,
  currency text not null default 'usd',
  failure_message text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists merchant_ticket_events_public_idx on public.merchant_ticket_events(merchant_user_id, starts_at) where status='published';
create index if not exists merchant_ticket_types_event_idx on public.merchant_ticket_types(event_id, is_active, sort_order);
create index if not exists merchant_ticket_orders_merchant_idx on public.merchant_ticket_orders(merchant_user_id, created_at desc);
create index if not exists merchant_ticket_orders_customer_idx on public.merchant_ticket_orders(customer_user_id, created_at desc);
create index if not exists merchant_tickets_code_idx on public.merchant_tickets(ticket_code);
create index if not exists merchant_tickets_event_idx on public.merchant_tickets(event_id, status);

alter table public.merchant_ticket_events enable row level security;
alter table public.merchant_ticket_types enable row level security;
alter table public.merchant_ticket_orders enable row level security;
alter table public.merchant_tickets enable row level security;
alter table public.merchant_ticket_payment_attempts enable row level security;
revoke all on public.merchant_ticket_events, public.merchant_ticket_types, public.merchant_ticket_orders, public.merchant_tickets, public.merchant_ticket_payment_attempts from anon, authenticated;

create or replace function public.merchant_tickets_can_manage(p_merchant_user_id uuid)
returns boolean language sql stable security definer set search_path = public, auth, pg_temp as $$
  select exists (
    select 1 from public.merchants m where m.user_id=p_merchant_user_id and (
      m.user_id=(select auth.uid()) or exists (
        select 1 from public.merchant_team_members member
        where member.merchant_user_id=p_merchant_user_id and member.member_user_id=(select auth.uid())
          and member.status='active'
          and ('order_manage'=any(coalesce(member.permissions,array[]::text[])) or 'manager'=any(coalesce(member.roles,array[]::text[])))
      )
    )
  );
$$;

create or replace function public.merchant_ticket_public_catalog(p_slug text)
returns jsonb language plpgsql security definer set search_path = public, auth, pg_temp as $$
declare v_merchant public.merchants%rowtype;
begin
  select * into v_merchant from public.merchants
  where slug=lower(trim(coalesce(p_slug,''))) and coalesce(verified,false)=true and coalesce(enabled_features,'[]'::jsonb) ? 'ticketing' limit 1;
  if not found then return null; end if;
  return jsonb_build_object(
    'merchant',jsonb_build_object('user_id',v_merchant.user_id,'business_name',v_merchant.business_name,'address',coalesce(v_merchant.address,''),'phone',coalesce(v_merchant.phone,'')),
    'events',coalesce((select jsonb_agg(jsonb_build_object(
      'id',e.id,'title',e.title,'description',e.description,'starts_at',e.starts_at,'ends_at',e.ends_at,'location_text',e.location_text,'cover_image',e.cover_image,
      'ticket_types',coalesce((select jsonb_agg(jsonb_build_object('id',t.id,'name',t.name,'description',t.description,'price',t.price,'stock',t.stock,'max_per_order',t.max_per_order,'remaining',greatest(0,t.stock-coalesce((select count(*) from public.merchant_tickets x where x.ticket_type_id=t.id and x.status in ('issued','redeemed')),0))) order by t.sort_order,t.created_at) from public.merchant_ticket_types t where t.event_id=e.id and t.is_active=true),'[]'::jsonb)
    ) order by e.starts_at) from public.merchant_ticket_events e where e.merchant_user_id=v_merchant.user_id and e.status='published' and e.ends_at>=now()),'[]'::jsonb)
  );
end;
$$;

create or replace function public.merchant_ticket_issue_order(p_order_id uuid, p_payment_status text default 'paid', p_payment_method text default null, p_provider_reference text default null)
returns jsonb language plpgsql security definer set search_path = public, auth, pg_temp as $$
declare o public.merchant_ticket_orders%rowtype; i integer; code text;
begin
  select * into o from public.merchant_ticket_orders where id=p_order_id for update;
  if not found then raise exception 'order_not_found'; end if;
  if o.payment_status in ('cancelled','refunded') then raise exception 'order_unavailable'; end if;
  if o.payment_status not in ('paid','free') then
    update public.merchant_ticket_orders set payment_status=p_payment_status,payment_method=coalesce(p_payment_method,payment_method),payment_provider_reference=coalesce(p_provider_reference,payment_provider_reference),payment_paid_at=now(),updated_at=now() where id=o.id returning * into o;
  end if;
  if not exists(select 1 from public.merchant_tickets where order_id=o.id) then
    for i in 1..o.quantity loop
      code := 'TKT-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,10));
      insert into public.merchant_tickets(ticket_code,order_id,event_id,ticket_type_id,merchant_user_id,customer_user_id,holder_name)
      values(code,o.id,o.event_id,o.ticket_type_id,o.merchant_user_id,o.customer_user_id,o.customer_name);
    end loop;
  end if;
  return jsonb_build_object('order_id',o.id,'order_code',o.order_code,'payment_status',case when o.total_amount=0 then 'free' else 'paid' end,'tickets',coalesce((select jsonb_agg(jsonb_build_object('id',t.id,'ticket_code',t.ticket_code,'status',t.status) order by t.created_at) from public.merchant_tickets t where t.order_id=o.id),'[]'::jsonb));
end;
$$;

create or replace function public.merchant_ticket_create_order(p_ticket_type_id uuid,p_customer_name text,p_customer_phone text,p_quantity integer default 1,p_note text default '')
returns jsonb language plpgsql security definer set search_path = public, auth, pg_temp as $$
declare t public.merchant_ticket_types%rowtype; e public.merchant_ticket_events%rowtype; sold integer; o public.merchant_ticket_orders%rowtype; out jsonb;
begin
  select * into t from public.merchant_ticket_types where id=p_ticket_type_id and is_active=true for update;
  if not found then raise exception 'ticket_unavailable'; end if;
  select * into e from public.merchant_ticket_events where id=t.event_id for update;
  if not found or e.status<>'published' or e.ends_at<now() then raise exception 'event_unavailable'; end if;
  if char_length(trim(coalesce(p_customer_name,'')))=0 or char_length(trim(coalesce(p_customer_phone,'')))<5 then raise exception 'contact_required'; end if;
  if coalesce(p_quantity,0)<1 or p_quantity>t.max_per_order then raise exception 'quantity_limit'; end if;
  select count(*) into sold from public.merchant_tickets where ticket_type_id=t.id and status in ('issued','redeemed');
  if sold+p_quantity>t.stock then raise exception 'sold_out'; end if;
  if t.price>0 and (select auth.uid()) is null then raise exception 'login_required_for_payment'; end if;
  insert into public.merchant_ticket_orders(order_code,merchant_user_id,event_id,ticket_type_id,customer_user_id,customer_name,customer_phone,quantity,unit_price,total_amount,payment_status,note)
  values('TO-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,10)),t.merchant_user_id,e.id,t.id,(select auth.uid()),trim(p_customer_name),trim(p_customer_phone),p_quantity,t.price,t.price*p_quantity,case when t.price=0 then 'free' else 'pending_payment' end,left(coalesce(p_note,''),500)) returning * into o;
  if o.total_amount=0 then select public.merchant_ticket_issue_order(o.id,'free','free',null) into out; else out:=jsonb_build_object('order_id',o.id,'order_code',o.order_code,'payment_status',o.payment_status,'total_amount',o.total_amount,'currency',o.currency); end if;
  return out;
end;
$$;

create or replace function public.merchant_ticket_order_for_customer(p_order_id uuid)
returns jsonb language plpgsql security definer set search_path = public, auth, pg_temp as $$
declare o public.merchant_ticket_orders%rowtype;
begin
  select * into o from public.merchant_ticket_orders where id=p_order_id and customer_user_id=(select auth.uid());
  if not found then raise exception 'order_not_found'; end if;
  return jsonb_build_object('order_id',o.id,'order_code',o.order_code,'payment_status',o.payment_status,'total_amount',o.total_amount,'tickets',coalesce((select jsonb_agg(jsonb_build_object('ticket_code',t.ticket_code,'status',t.status,'holder_name',t.holder_name) order by t.created_at) from public.merchant_tickets t where t.order_id=o.id),'[]'::jsonb));
end;
$$;

create or replace function public.merchant_ticket_manager_snapshot(p_merchant_user_id uuid)
returns jsonb language plpgsql security definer set search_path = public, auth, pg_temp as $$
begin
  if not public.merchant_tickets_can_manage(p_merchant_user_id) then raise exception 'not_authorized'; end if;
  return jsonb_build_object(
    'events',coalesce((select jsonb_agg(to_jsonb(e) order by e.starts_at desc) from public.merchant_ticket_events e where e.merchant_user_id=p_merchant_user_id),'[]'::jsonb),
    'types',coalesce((select jsonb_agg(to_jsonb(t) order by t.sort_order,t.created_at) from public.merchant_ticket_types t where t.merchant_user_id=p_merchant_user_id),'[]'::jsonb),
    'orders',coalesce((select jsonb_agg(to_jsonb(o) order by o.created_at desc) from public.merchant_ticket_orders o where o.merchant_user_id=p_merchant_user_id limit 300),'[]'::jsonb),
    'tickets',coalesce((select jsonb_agg(to_jsonb(t) order by t.created_at desc) from public.merchant_tickets t where t.merchant_user_id=p_merchant_user_id limit 500),'[]'::jsonb)
  );
end;
$$;

create or replace function public.merchant_ticket_save_event(p_merchant_user_id uuid,p_event jsonb)
returns jsonb language plpgsql security definer set search_path = public, auth, pg_temp as $$
declare v_id uuid:=nullif(p_event->>'id','')::uuid; r public.merchant_ticket_events%rowtype;
begin
  if not public.merchant_tickets_can_manage(p_merchant_user_id) then raise exception 'not_authorized'; end if;
  if coalesce(trim(p_event->>'title'),'')='' then raise exception 'title_required'; end if;
  if v_id is null then insert into public.merchant_ticket_events(merchant_user_id,title,description,starts_at,ends_at,location_text,cover_image,status) values(p_merchant_user_id,trim(p_event->>'title'),left(coalesce(p_event->>'description',''),2000),(p_event->>'starts_at')::timestamptz,(p_event->>'ends_at')::timestamptz,left(coalesce(p_event->>'location_text',''),300),left(coalesce(p_event->>'cover_image',''),3000),coalesce(p_event->>'status','published')) returning * into r;
  else update public.merchant_ticket_events set title=trim(p_event->>'title'),description=left(coalesce(p_event->>'description',''),2000),starts_at=(p_event->>'starts_at')::timestamptz,ends_at=(p_event->>'ends_at')::timestamptz,location_text=left(coalesce(p_event->>'location_text',''),300),cover_image=left(coalesce(p_event->>'cover_image',''),3000),status=coalesce(p_event->>'status','published'),updated_at=now() where merchant_ticket_events.id=v_id and merchant_user_id=p_merchant_user_id returning * into r; end if;
  if not found then raise exception 'event_not_found'; end if; return to_jsonb(r);
end;
$$;

create or replace function public.merchant_ticket_save_type(p_merchant_user_id uuid,p_type jsonb)
returns jsonb language plpgsql security definer set search_path = public, auth, pg_temp as $$
declare v_id uuid:=nullif(p_type->>'id','')::uuid; r public.merchant_ticket_types%rowtype; event_owner uuid;
begin
  if not public.merchant_tickets_can_manage(p_merchant_user_id) then raise exception 'not_authorized'; end if;
  if coalesce(trim(p_type->>'name'),'')='' then raise exception 'name_required'; end if;
  select merchant_user_id into event_owner from public.merchant_ticket_events where id=(p_type->>'event_id')::uuid; if event_owner is distinct from p_merchant_user_id then raise exception 'event_not_found'; end if;
  if v_id is null then insert into public.merchant_ticket_types(event_id,merchant_user_id,name,description,price,stock,max_per_order,is_active,sort_order) values((p_type->>'event_id')::uuid,p_merchant_user_id,trim(p_type->>'name'),left(coalesce(p_type->>'description',''),500),coalesce((p_type->>'price')::numeric,0),coalesce((p_type->>'stock')::int,1),coalesce((p_type->>'max_per_order')::int,6),coalesce((p_type->>'is_active')::boolean,true),coalesce((p_type->>'sort_order')::int,0)) returning * into r;
  else update public.merchant_ticket_types set name=trim(p_type->>'name'),description=left(coalesce(p_type->>'description',''),500),price=coalesce((p_type->>'price')::numeric,0),stock=coalesce((p_type->>'stock')::int,1),max_per_order=coalesce((p_type->>'max_per_order')::int,6),is_active=coalesce((p_type->>'is_active')::boolean,true),sort_order=coalesce((p_type->>'sort_order')::int,0),updated_at=now() where merchant_ticket_types.id=v_id and merchant_user_id=p_merchant_user_id returning * into r; end if;
  if not found then raise exception 'ticket_type_not_found'; end if; return to_jsonb(r);
end;
$$;

create or replace function public.merchant_ticket_redeem(p_ticket_code text)
returns jsonb language plpgsql security definer set search_path = public, auth, pg_temp as $$
declare t public.merchant_tickets%rowtype; o public.merchant_ticket_orders%rowtype; e public.merchant_ticket_events%rowtype; typ public.merchant_ticket_types%rowtype;
begin
  select * into t from public.merchant_tickets where ticket_code=upper(trim(p_ticket_code)) for update;
  if not found or not public.merchant_tickets_can_manage(t.merchant_user_id) then raise exception 'ticket_not_found'; end if;
  select * into o from public.merchant_ticket_orders where id=t.order_id; select * into e from public.merchant_ticket_events where id=t.event_id; select * into typ from public.merchant_ticket_types where id=t.ticket_type_id;
  if t.status='redeemed' then return jsonb_build_object('ok',false,'reason','already_redeemed','ticket_code',t.ticket_code,'event_title',e.title,'ticket_type',typ.name,'holder_name',t.holder_name,'redeemed_at',t.redeemed_at); end if;
  if t.status<>'issued' or o.payment_status not in ('paid','free') then raise exception 'ticket_unavailable'; end if;
  update public.merchant_tickets set status='redeemed',redeemed_at=now(),redeemed_by_user_id=(select auth.uid()),updated_at=now() where id=t.id returning * into t;
  return jsonb_build_object('ok',true,'ticket_code',t.ticket_code,'event_title',e.title,'ticket_type',typ.name,'holder_name',t.holder_name,'redeemed_at',t.redeemed_at);
end;
$$;

revoke all on function public.merchant_tickets_can_manage(uuid) from public,anon,authenticated;
revoke all on function public.merchant_ticket_public_catalog(text) from public;
revoke all on function public.merchant_ticket_issue_order(uuid,text,text,text) from public,anon,authenticated;
revoke all on function public.merchant_ticket_create_order(uuid,text,text,integer,text) from public;
revoke all on function public.merchant_ticket_order_for_customer(uuid) from public,anon;
revoke all on function public.merchant_ticket_manager_snapshot(uuid) from public,anon;
revoke all on function public.merchant_ticket_save_event(uuid,jsonb) from public,anon;
revoke all on function public.merchant_ticket_save_type(uuid,jsonb) from public,anon;
revoke all on function public.merchant_ticket_redeem(text) from public,anon;
grant execute on function public.merchant_ticket_public_catalog(text) to anon,authenticated;
grant execute on function public.merchant_ticket_create_order(uuid,text,text,integer,text) to anon,authenticated;
grant execute on function public.merchant_ticket_order_for_customer(uuid) to authenticated;
grant execute on function public.merchant_ticket_manager_snapshot(uuid) to authenticated;
grant execute on function public.merchant_ticket_save_event(uuid,jsonb) to authenticated;
grant execute on function public.merchant_ticket_save_type(uuid,jsonb) to authenticated;
grant execute on function public.merchant_ticket_redeem(text) to authenticated;
grant execute on function public.merchant_ticket_issue_order(uuid,text,text,text) to service_role;

-- Keep all direct table access closed. These policies make that explicit for
-- security tooling; RPC functions above are the only supported API surface.
create policy "ticket events are rpc only" on public.merchant_ticket_events as restrictive for all to anon, authenticated using (false) with check (false);
create policy "ticket types are rpc only" on public.merchant_ticket_types as restrictive for all to anon, authenticated using (false) with check (false);
create policy "ticket orders are rpc only" on public.merchant_ticket_orders as restrictive for all to anon, authenticated using (false) with check (false);
create policy "issued tickets are rpc only" on public.merchant_tickets as restrictive for all to anon, authenticated using (false) with check (false);
create policy "ticket payments are rpc only" on public.merchant_ticket_payment_attempts as restrictive for all to anon, authenticated using (false) with check (false);
