-- 乐生活 v5.583：分区与精确选座。商家在后台创建分区，系统生成可售座位。
alter table public.merchant_ticket_events
  add column if not exists seating_mode text not null default 'general' check (seating_mode in ('general','zone','assigned')),
  add column if not exists seat_map_image text not null default '';

alter table public.merchant_ticket_orders
  alter column ticket_type_id drop not null,
  add column if not exists selected_seat_ids uuid[] not null default '{}';

alter table public.merchant_tickets
  alter column ticket_type_id drop not null,
  add column if not exists seat_id uuid;

create table if not exists public.merchant_ticket_sections (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.merchant_ticket_events(id) on delete cascade,
  merchant_user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  color text not null default '#568566' check (color ~ '^#[0-9A-Fa-f]{6}$'),
  price numeric(10,2) not null default 0 check (price >= 0 and price <= 100000),
  rows_count integer not null default 1 check (rows_count between 1 and 40),
  seats_per_row integer not null default 1 check (seats_per_row between 1 and 60),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.merchant_ticket_seats (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.merchant_ticket_events(id) on delete cascade,
  section_id uuid not null references public.merchant_ticket_sections(id) on delete cascade,
  merchant_user_id uuid not null references auth.users(id) on delete cascade,
  row_label text not null check (char_length(row_label) between 1 and 12),
  seat_number integer not null check (seat_number between 1 and 1000),
  label text not null check (char_length(label) between 1 and 40),
  price_override numeric(10,2) check (price_override is null or price_override >= 0),
  status text not null default 'available' check (status in ('available','held','sold','blocked')),
  hold_order_id uuid references public.merchant_ticket_orders(id) on delete set null,
  hold_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(section_id,row_label,seat_number)
);

alter table public.merchant_tickets
  add constraint merchant_tickets_seat_id_fkey foreign key (seat_id) references public.merchant_ticket_seats(id) on delete set null;

create index if not exists merchant_ticket_sections_event_idx on public.merchant_ticket_sections(event_id,sort_order);
create index if not exists merchant_ticket_seats_event_status_idx on public.merchant_ticket_seats(event_id,status);
create index if not exists merchant_ticket_seats_hold_idx on public.merchant_ticket_seats(hold_order_id,hold_expires_at);
create index if not exists merchant_ticket_orders_seats_idx on public.merchant_ticket_orders using gin(selected_seat_ids);

alter table public.merchant_ticket_sections enable row level security;
alter table public.merchant_ticket_seats enable row level security;
revoke all on public.merchant_ticket_sections, public.merchant_ticket_seats from anon, authenticated;
create policy "ticket sections are rpc only" on public.merchant_ticket_sections as restrictive for all to anon, authenticated using (false) with check (false);
create policy "ticket seats are rpc only" on public.merchant_ticket_seats as restrictive for all to anon, authenticated using (false) with check (false);

create or replace function public.merchant_ticket_public_event_seats(p_event_id uuid)
returns jsonb language plpgsql security definer set search_path = public, auth, pg_temp as $$
declare e public.merchant_ticket_events%rowtype;
begin
  select * into e from public.merchant_ticket_events where id=p_event_id and status='published' and ends_at>=now();
  if not found then return null; end if;
  return jsonb_build_object(
    'event_id',e.id,'seating_mode',e.seating_mode,'seat_map_image',e.seat_map_image,
    'sections',coalesce((select jsonb_agg(jsonb_build_object(
      'id',s.id,'name',s.name,'color',s.color,'price',s.price,'rows_count',s.rows_count,'seats_per_row',s.seats_per_row,'sort_order',s.sort_order,
      'seats',coalesce((select jsonb_agg(jsonb_build_object('id',x.id,'row_label',x.row_label,'seat_number',x.seat_number,'label',x.label,'price',coalesce(x.price_override,s.price),'status',case when x.status='held' and x.hold_expires_at<=now() then 'available' else x.status end) order by x.row_label,x.seat_number) from public.merchant_ticket_seats x where x.section_id=s.id),'[]'::jsonb)
    ) order by s.sort_order,s.created_at) from public.merchant_ticket_sections s where s.event_id=e.id and s.is_active=true),'[]'::jsonb)
  );
end;
$$;

create or replace function public.merchant_ticket_manager_snapshot(p_merchant_user_id uuid)
returns jsonb language plpgsql security definer set search_path = public, auth, pg_temp as $$
begin
  if not public.merchant_tickets_can_manage(p_merchant_user_id) then raise exception 'not_authorized'; end if;
  return jsonb_build_object(
    'events',coalesce((select jsonb_agg(to_jsonb(e) order by e.starts_at desc) from public.merchant_ticket_events e where e.merchant_user_id=p_merchant_user_id),'[]'::jsonb),
    'types',coalesce((select jsonb_agg(to_jsonb(t) order by t.sort_order,t.created_at) from public.merchant_ticket_types t where t.merchant_user_id=p_merchant_user_id),'[]'::jsonb),
    'sections',coalesce((select jsonb_agg(to_jsonb(s) order by s.sort_order,s.created_at) from public.merchant_ticket_sections s where s.merchant_user_id=p_merchant_user_id),'[]'::jsonb),
    'seats',coalesce((select jsonb_agg(to_jsonb(s) order by s.row_label,s.seat_number) from public.merchant_ticket_seats s where s.merchant_user_id=p_merchant_user_id limit 5000),'[]'::jsonb),
    'orders',coalesce((select jsonb_agg(to_jsonb(o) order by o.created_at desc) from public.merchant_ticket_orders o where o.merchant_user_id=p_merchant_user_id limit 300),'[]'::jsonb),
    'tickets',coalesce((select jsonb_agg(to_jsonb(t) order by t.created_at desc) from public.merchant_tickets t where t.merchant_user_id=p_merchant_user_id limit 500),'[]'::jsonb)
  );
end;
$$;

create or replace function public.merchant_ticket_save_event(p_merchant_user_id uuid,p_event jsonb)
returns jsonb language plpgsql security definer set search_path = public, auth, pg_temp as $$
declare v_id uuid:=nullif(p_event->>'id','')::uuid; r public.merchant_ticket_events%rowtype; v_mode text:=coalesce(nullif(p_event->>'seating_mode',''),'general');
begin
  if not public.merchant_tickets_can_manage(p_merchant_user_id) then raise exception 'not_authorized'; end if;
  if coalesce(trim(p_event->>'title'),'')='' then raise exception 'title_required'; end if;
  if v_mode not in ('general','zone','assigned') then raise exception 'invalid_seating_mode'; end if;
  if v_id is null then
    insert into public.merchant_ticket_events(merchant_user_id,title,description,starts_at,ends_at,location_text,cover_image,status,seating_mode,seat_map_image)
    values(p_merchant_user_id,trim(p_event->>'title'),left(coalesce(p_event->>'description',''),2000),(p_event->>'starts_at')::timestamptz,(p_event->>'ends_at')::timestamptz,left(coalesce(p_event->>'location_text',''),300),left(coalesce(p_event->>'cover_image',''),3000),coalesce(p_event->>'status','published'),v_mode,left(coalesce(p_event->>'seat_map_image',''),3000)) returning * into r;
  else
    update public.merchant_ticket_events set title=trim(p_event->>'title'),description=left(coalesce(p_event->>'description',''),2000),starts_at=(p_event->>'starts_at')::timestamptz,ends_at=(p_event->>'ends_at')::timestamptz,location_text=left(coalesce(p_event->>'location_text',''),300),cover_image=left(coalesce(p_event->>'cover_image',''),3000),status=coalesce(p_event->>'status','published'),seating_mode=v_mode,seat_map_image=left(coalesce(p_event->>'seat_map_image',''),3000),updated_at=now() where merchant_ticket_events.id=v_id and merchant_user_id=p_merchant_user_id returning * into r;
  end if;
  if not found then raise exception 'event_not_found'; end if; return to_jsonb(r);
end;
$$;

create or replace function public.merchant_ticket_save_section(p_merchant_user_id uuid,p_section jsonb)
returns jsonb language plpgsql security definer set search_path = public, auth, pg_temp as $$
declare v_id uuid:=nullif(p_section->>'id','')::uuid; r public.merchant_ticket_sections%rowtype; e public.merchant_ticket_events%rowtype; i integer; j integer; row_name text;
begin
  if not public.merchant_tickets_can_manage(p_merchant_user_id) then raise exception 'not_authorized'; end if;
  if coalesce(trim(p_section->>'name'),'')='' then raise exception 'section_name_required'; end if;
  select * into e from public.merchant_ticket_events where id=(p_section->>'event_id')::uuid and merchant_user_id=p_merchant_user_id for update;
  if not found or e.seating_mode<>'assigned' then raise exception 'assigned_seating_required'; end if;
  if v_id is null then
    insert into public.merchant_ticket_sections(event_id,merchant_user_id,name,color,price,rows_count,seats_per_row,sort_order,is_active)
    values(e.id,p_merchant_user_id,trim(p_section->>'name'),coalesce(nullif(p_section->>'color',''),'#568566'),coalesce((p_section->>'price')::numeric,0),coalesce((p_section->>'rows_count')::int,1),coalesce((p_section->>'seats_per_row')::int,1),coalesce((p_section->>'sort_order')::int,0),coalesce((p_section->>'is_active')::boolean,true)) returning * into r;
    for i in 1..r.rows_count loop
      row_name:=chr(64+i);
      for j in 1..r.seats_per_row loop
        insert into public.merchant_ticket_seats(event_id,section_id,merchant_user_id,row_label,seat_number,label) values(e.id,r.id,p_merchant_user_id,row_name,j,row_name||j);
      end loop;
    end loop;
  else
    if exists(select 1 from public.merchant_ticket_seats where section_id=v_id and status in ('sold','held')) then raise exception 'section_has_reserved_seats'; end if;
    update public.merchant_ticket_sections set name=trim(p_section->>'name'),color=coalesce(nullif(p_section->>'color',''),'#568566'),price=coalesce((p_section->>'price')::numeric,0),sort_order=coalesce((p_section->>'sort_order')::int,0),is_active=coalesce((p_section->>'is_active')::boolean,true),updated_at=now() where id=v_id and merchant_user_id=p_merchant_user_id returning * into r;
  end if;
  if not found then raise exception 'section_not_found'; end if; return to_jsonb(r);
end;
$$;

create or replace function public.merchant_ticket_toggle_seat(p_merchant_user_id uuid,p_seat_id uuid,p_blocked boolean)
returns jsonb language plpgsql security definer set search_path = public, auth, pg_temp as $$
declare r public.merchant_ticket_seats%rowtype;
begin
  if not public.merchant_tickets_can_manage(p_merchant_user_id) then raise exception 'not_authorized'; end if;
  update public.merchant_ticket_seats set status=case when p_blocked then 'blocked' else 'available' end,hold_order_id=null,hold_expires_at=null,updated_at=now() where id=p_seat_id and merchant_user_id=p_merchant_user_id and status not in ('sold','held') returning * into r;
  if not found then raise exception 'seat_unavailable'; end if; return to_jsonb(r);
end;
$$;

create or replace function public.merchant_ticket_release_order_seats(p_order_id uuid)
returns void language plpgsql security definer set search_path = public, auth, pg_temp as $$
begin
  update public.merchant_ticket_seats set status='available',hold_order_id=null,hold_expires_at=null,updated_at=now() where hold_order_id=p_order_id and status='held';
end;
$$;

create or replace function public.merchant_ticket_create_seat_order(p_event_id uuid,p_seat_ids uuid[],p_customer_name text,p_customer_phone text,p_note text default '')
returns jsonb language plpgsql security definer set search_path = public, auth, pg_temp as $$
declare e public.merchant_ticket_events%rowtype; o public.merchant_ticket_orders%rowtype; v_count integer; v_total numeric(10,2); out jsonb;
begin
  select * into e from public.merchant_ticket_events where id=p_event_id and status='published' and seating_mode='assigned' and ends_at>=now() for update;
  if not found then raise exception 'event_unavailable'; end if;
  if char_length(trim(coalesce(p_customer_name,'')))=0 or char_length(trim(coalesce(p_customer_phone,'')))<5 then raise exception 'contact_required'; end if;
  if coalesce(cardinality(p_seat_ids),0)<1 or cardinality(p_seat_ids)>20 then raise exception 'seat_quantity_limit'; end if;
  update public.merchant_ticket_seats set status='available',hold_order_id=null,hold_expires_at=null,updated_at=now() where event_id=e.id and status='held' and hold_expires_at<=now();
  perform 1 from public.merchant_ticket_seats x where x.event_id=e.id and x.id=any(p_seat_ids) for update;
  select count(*),coalesce(sum(coalesce(x.price_override,s.price)),0) into v_count,v_total from public.merchant_ticket_seats x join public.merchant_ticket_sections s on s.id=x.section_id where x.event_id=e.id and x.id=any(p_seat_ids) and x.status='available';
  if v_count<>cardinality(p_seat_ids) then raise exception 'seat_unavailable'; end if;
  if v_total>0 and (select auth.uid()) is null then raise exception 'login_required_for_payment'; end if;
  insert into public.merchant_ticket_orders(order_code,merchant_user_id,event_id,customer_user_id,customer_name,customer_phone,quantity,unit_price,total_amount,payment_status,payment_expires_at,note,selected_seat_ids)
  values('TO-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,10)),e.merchant_user_id,e.id,(select auth.uid()),trim(p_customer_name),trim(p_customer_phone),v_count,case when v_count=0 then 0 else v_total/v_count end,v_total,case when v_total=0 then 'free' else 'pending_payment' end,case when v_total=0 then null else now()+interval '20 minutes' end,left(coalesce(p_note,''),500),p_seat_ids) returning * into o;
  update public.merchant_ticket_seats set status=case when o.total_amount=0 then 'available' else 'held' end,hold_order_id=case when o.total_amount=0 then null else o.id end,hold_expires_at=case when o.total_amount=0 then null else o.payment_expires_at end,updated_at=now() where id=any(p_seat_ids);
  if o.total_amount=0 then select public.merchant_ticket_issue_order(o.id,'free','free',null) into out; else out:=jsonb_build_object('order_id',o.id,'order_code',o.order_code,'payment_status',o.payment_status,'total_amount',o.total_amount,'currency',o.currency,'payment_expires_at',o.payment_expires_at); end if;
  return out;
end;
$$;

create or replace function public.merchant_ticket_issue_order(p_order_id uuid,p_payment_status text default 'paid',p_payment_method text default null,p_provider_reference text default null)
returns jsonb language plpgsql security definer set search_path = public, auth, pg_temp as $$
declare o public.merchant_ticket_orders%rowtype; i integer; code text; x public.merchant_ticket_seats%rowtype;
begin
  select * into o from public.merchant_ticket_orders where id=p_order_id for update;
  if not found then raise exception 'order_not_found'; end if;
  if o.payment_status in ('cancelled','refunded') then raise exception 'order_unavailable'; end if;
  if o.payment_status not in ('paid','free') then update public.merchant_ticket_orders set payment_status=p_payment_status,payment_method=coalesce(p_payment_method,payment_method),payment_provider_reference=coalesce(p_provider_reference,payment_provider_reference),payment_paid_at=now(),payment_expires_at=null,updated_at=now() where id=o.id returning * into o; end if;
  if cardinality(o.selected_seat_ids)>0 then
    update public.merchant_ticket_seats set status='sold',hold_order_id=null,hold_expires_at=null,updated_at=now() where id=any(o.selected_seat_ids) and (hold_order_id=o.id or o.total_amount=0);
    if not exists(select 1 from public.merchant_tickets where order_id=o.id) then
      for x in select * from public.merchant_ticket_seats where id=any(o.selected_seat_ids) order by row_label,seat_number loop
        code:='TKT-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,10));
        insert into public.merchant_tickets(ticket_code,order_id,event_id,ticket_type_id,seat_id,merchant_user_id,customer_user_id,holder_name) values(code,o.id,o.event_id,null,x.id,o.merchant_user_id,o.customer_user_id,o.customer_name);
      end loop;
    end if;
  elsif not exists(select 1 from public.merchant_tickets where order_id=o.id) then
    for i in 1..o.quantity loop
      code:='TKT-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,10));
      insert into public.merchant_tickets(ticket_code,order_id,event_id,ticket_type_id,merchant_user_id,customer_user_id,holder_name) values(code,o.id,o.event_id,o.ticket_type_id,o.merchant_user_id,o.customer_user_id,o.customer_name);
    end loop;
  end if;
  return jsonb_build_object('order_id',o.id,'order_code',o.order_code,'payment_status',case when o.total_amount=0 then 'free' else 'paid' end,'tickets',coalesce((select jsonb_agg(jsonb_build_object('id',t.id,'ticket_code',t.ticket_code,'status',t.status,'seat_label',s.label) order by t.created_at) from public.merchant_tickets t left join public.merchant_ticket_seats s on s.id=t.seat_id where t.order_id=o.id),'[]'::jsonb));
end;
$$;

revoke all on function public.merchant_ticket_public_event_seats(uuid) from public;
revoke all on function public.merchant_ticket_save_section(uuid,jsonb) from public,anon;
revoke all on function public.merchant_ticket_toggle_seat(uuid,uuid,boolean) from public,anon;
revoke all on function public.merchant_ticket_release_order_seats(uuid) from public,anon,authenticated;
revoke all on function public.merchant_ticket_create_seat_order(uuid,uuid[],text,text,text) from public;
grant execute on function public.merchant_ticket_public_event_seats(uuid) to anon,authenticated;
grant execute on function public.merchant_ticket_save_section(uuid,jsonb) to authenticated;
grant execute on function public.merchant_ticket_toggle_seat(uuid,uuid,boolean) to authenticated;
grant execute on function public.merchant_ticket_create_seat_order(uuid,uuid[],text,text,text) to anon,authenticated;
grant execute on function public.merchant_ticket_release_order_seats(uuid) to service_role;

-- Purchased selected seats remain identifiable in the customer QR view and at redemption.
create or replace function public.merchant_ticket_order_for_customer(p_order_id uuid)
returns jsonb language plpgsql security definer set search_path = public, auth, pg_temp as $$
declare o public.merchant_ticket_orders%rowtype;
begin
  select * into o from public.merchant_ticket_orders where id=p_order_id and (user_id=auth.uid() or user_id is null);
  if not found then raise exception 'ticket_order_not_found'; end if;
  return jsonb_build_object('id',o.id,'order_no',o.order_no,'status',o.status,'payment_status',o.payment_status,'total_amount',o.total_amount,'currency',o.currency,'payment_expires_at',o.payment_expires_at,'tickets',coalesce((select jsonb_agg(jsonb_build_object('ticket_code',t.ticket_code,'status',t.status,'holder_name',t.holder_name,'seat_label',nullif(concat_ws(' ',sec.name,s.label),'')) order by t.created_at) from public.merchant_tickets t left join public.merchant_ticket_seats s on s.id=t.seat_id left join public.merchant_ticket_sections sec on sec.id=s.section_id where t.order_id=o.id),'[]'::jsonb));
end;
$$;

create or replace function public.merchant_ticket_redeem(p_merchant_user_id uuid,p_ticket_code text)
returns jsonb language plpgsql security definer set search_path = public, auth, pg_temp as $$
declare t public.merchant_tickets%rowtype; e public.merchant_ticket_events%rowtype; typ public.merchant_ticket_types%rowtype; seat_label text;
begin
  if not public.is_merchant_manager(p_merchant_user_id) then raise exception 'merchant_ticket_not_allowed'; end if;
  select * into t from public.merchant_tickets where ticket_code=upper(trim(p_ticket_code)) for update;
  if not found then raise exception 'ticket_not_found'; end if;
  select * into e from public.merchant_ticket_events where id=t.event_id;
  if e.merchant_user_id<>p_merchant_user_id then raise exception 'ticket_not_allowed'; end if;
  select * into typ from public.merchant_ticket_types where id=t.ticket_type_id;
  select nullif(concat_ws(' ',sec.name,s.label),'') into seat_label from public.merchant_ticket_seats s left join public.merchant_ticket_sections sec on sec.id=s.section_id where s.id=t.seat_id;
  if t.status='used' then return jsonb_build_object('ok',false,'reason','already_used','ticket_code',t.ticket_code,'used_at',t.used_at,'holder_name',t.holder_name,'event_title',e.title,'ticket_type',coalesce(typ.name,seat_label,'选座票')); end if;
  if t.status<>'valid' then return jsonb_build_object('ok',false,'reason',t.status,'ticket_code',t.ticket_code,'holder_name',t.holder_name,'event_title',e.title,'ticket_type',coalesce(typ.name,seat_label,'选座票')); end if;
  update public.merchant_tickets set status='used',used_at=now(),redeemed_by=auth.uid() where id=t.id;
  return jsonb_build_object('ok',true,'ticket_code',t.ticket_code,'holder_name',t.holder_name,'event_title',e.title,'ticket_type',coalesce(typ.name,seat_label,'选座票'),'used_at',now());
end;
$$;

revoke all on function public.merchant_ticket_redeem(uuid,text) from public;
grant execute on function public.merchant_ticket_redeem(uuid,text) to authenticated;
