-- 乐生活 v5.582：付费票务库存占位，避免并发付款超卖。
alter table public.merchant_ticket_orders
  add column if not exists payment_expires_at timestamptz;

create index if not exists merchant_ticket_orders_reservation_idx
  on public.merchant_ticket_orders(ticket_type_id, payment_status, payment_expires_at);

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
      'ticket_types',coalesce((select jsonb_agg(jsonb_build_object(
        'id',t.id,'name',t.name,'description',t.description,'price',t.price,'stock',t.stock,'max_per_order',t.max_per_order,
        'remaining',greatest(0,t.stock-coalesce((select sum(o.quantity) from public.merchant_ticket_orders o where o.ticket_type_id=t.id and (o.payment_status in ('paid','free') or (o.payment_status in ('pending_payment','processing') and o.payment_expires_at>now()))),0)))
      order by t.sort_order,t.created_at) from public.merchant_ticket_types t where t.event_id=e.id and t.is_active=true),'[]'::jsonb)
    ) order by e.starts_at) from public.merchant_ticket_events e where e.merchant_user_id=v_merchant.user_id and e.status='published' and e.ends_at>=now()),'[]'::jsonb)
  );
end;
$$;

create or replace function public.merchant_ticket_create_order(p_ticket_type_id uuid,p_customer_name text,p_customer_phone text,p_quantity integer default 1,p_note text default '')
returns jsonb language plpgsql security definer set search_path = public, auth, pg_temp as $$
declare t public.merchant_ticket_types%rowtype; e public.merchant_ticket_events%rowtype; reserved integer; o public.merchant_ticket_orders%rowtype; out jsonb;
begin
  select * into t from public.merchant_ticket_types where id=p_ticket_type_id and is_active=true for update;
  if not found then raise exception 'ticket_unavailable'; end if;
  select * into e from public.merchant_ticket_events where id=t.event_id for update;
  if not found or e.status<>'published' or e.ends_at<now() then raise exception 'event_unavailable'; end if;
  if char_length(trim(coalesce(p_customer_name,'')))=0 or char_length(trim(coalesce(p_customer_phone,'')))<5 then raise exception 'contact_required'; end if;
  if coalesce(p_quantity,0)<1 or p_quantity>t.max_per_order then raise exception 'quantity_limit'; end if;
  select coalesce(sum(quantity),0) into reserved from public.merchant_ticket_orders
  where ticket_type_id=t.id and (payment_status in ('paid','free') or (payment_status in ('pending_payment','processing') and payment_expires_at>now()));
  if reserved+p_quantity>t.stock then raise exception 'sold_out'; end if;
  if t.price>0 and (select auth.uid()) is null then raise exception 'login_required_for_payment'; end if;
  insert into public.merchant_ticket_orders(order_code,merchant_user_id,event_id,ticket_type_id,customer_user_id,customer_name,customer_phone,quantity,unit_price,total_amount,payment_status,payment_expires_at,note)
  values('TO-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,10)),t.merchant_user_id,e.id,t.id,(select auth.uid()),trim(p_customer_name),trim(p_customer_phone),p_quantity,t.price,t.price*p_quantity,case when t.price=0 then 'free' else 'pending_payment' end,case when t.price=0 then null else now()+interval '20 minutes' end,left(coalesce(p_note,''),500)) returning * into o;
  if o.total_amount=0 then select public.merchant_ticket_issue_order(o.id,'free','free',null) into out; else out:=jsonb_build_object('order_id',o.id,'order_code',o.order_code,'payment_status',o.payment_status,'total_amount',o.total_amount,'currency',o.currency,'payment_expires_at',o.payment_expires_at); end if;
  return out;
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
    update public.merchant_ticket_orders set payment_status=p_payment_status,payment_method=coalesce(p_payment_method,payment_method),payment_provider_reference=coalesce(p_provider_reference,payment_provider_reference),payment_paid_at=now(),payment_expires_at=null,updated_at=now() where id=o.id returning * into o;
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
