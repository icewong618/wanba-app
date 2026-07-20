-- 乐生活 v5.397：二手车报价确认闭环。
-- 客户只能接受或拒绝自己仍在有效期内的卖车报价。

alter table public.merchant_auto_leads
  add column if not exists quote_response text,
  add column if not exists quote_responded_at timestamptz;

alter table public.merchant_auto_leads
  drop constraint if exists merchant_auto_leads_quote_response_check;
alter table public.merchant_auto_leads
  add constraint merchant_auto_leads_quote_response_check
  check (quote_response is null or quote_response in ('accepted','declined'));

alter table public.merchant_auto_leads
  drop constraint if exists merchant_auto_leads_status_check;
alter table public.merchant_auto_leads
  add constraint merchant_auto_leads_status_check
  check (status in ('new','contacted','scheduled','reschedule_requested','cancelled','quoted','quote_accepted','quote_declined','closed','archived'));

create or replace function public.merchant_auto_customer_respond_quote(
  p_lead_id uuid,
  p_response text
)
returns public.merchant_auto_leads
language plpgsql
security definer
set search_path=public,pg_temp
as $$
declare
  row public.merchant_auto_leads%rowtype;
begin
  select * into row
  from public.merchant_auto_leads
  where id=p_lead_id
  for update;

  if not found or row.user_id <> auth.uid() or row.lead_type <> 'sell_quote' then
    raise exception 'quote_permission_denied';
  end if;
  if row.status <> 'quoted' or row.quoted_amount is null then
    raise exception 'quote_not_available';
  end if;
  if row.quote_expires_at is not null and row.quote_expires_at < now() then
    raise exception 'quote_expired';
  end if;
  if p_response not in ('accepted','declined') then
    raise exception 'invalid_quote_response';
  end if;

  update public.merchant_auto_leads
  set quote_response=p_response,
      quote_responded_at=now(),
      status=case when p_response='accepted' then 'quote_accepted' else 'quote_declined' end,
      updated_at=now()
  where id=row.id
  returning * into row;

  return row;
end;
$$;

create or replace function public.merchant_auto_customer_leads(p_merchant_user_id uuid)
returns jsonb
language sql
stable
security definer
set search_path=public,pg_temp
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id',l.id,'lead_type',l.lead_type,'status',l.status,'created_at',l.created_at,
    'vehicle_data',l.vehicle_data,'photos',l.photos,'quoted_amount',l.quoted_amount,
    'quote_expires_at',l.quote_expires_at,'quote_response',l.quote_response,
    'quote_responded_at',l.quote_responded_at,'merchant_note',l.merchant_note,
    'listing_title',a.title,'preferred_at',l.preferred_at,'confirmed_at',l.confirmed_at,
    'appointment_location',l.appointment_location,'customer_action',l.customer_action,
    'customer_action_note',l.customer_action_note,'customer_action_at',l.customer_action_at
  ) order by l.created_at desc),'[]'::jsonb)
  from public.merchant_auto_leads l
  left join public.merchant_auto_listings a on a.id=l.listing_id
  where l.merchant_user_id=p_merchant_user_id and l.user_id=(select auth.uid());
$$;

create or replace function public.merchant_auto_update_lead_schedule(
  p_lead_id uuid,
  p_status text,
  p_merchant_note text,
  p_quoted_amount numeric default null,
  p_quote_expires_at timestamptz default null,
  p_confirmed_at timestamptz default null,
  p_appointment_location text default null
)
returns public.merchant_auto_leads
language plpgsql
security definer
set search_path=public,pg_temp
as $$
declare
  row public.merchant_auto_leads%rowtype;
begin
  select * into row from public.merchant_auto_leads where id=p_lead_id for update;
  if not found or not public.merchant_auto_can_manage(row.merchant_user_id) then
    raise exception 'lead_permission_denied';
  end if;
  if p_status not in ('new','contacted','scheduled','reschedule_requested','cancelled','quoted','quote_accepted','quote_declined','closed','archived') then
    raise exception 'invalid_lead_status';
  end if;
  if row.lead_type = 'test_drive' and p_status = 'scheduled' and p_confirmed_at is null then
    raise exception 'test_drive_time_required';
  end if;

  update public.merchant_auto_leads
  set status=p_status,
      merchant_note=nullif(left(trim(coalesce(p_merchant_note,'')),1500),''),
      quoted_amount=p_quoted_amount,
      quote_expires_at=p_quote_expires_at,
      confirmed_at=case when row.lead_type='test_drive' then p_confirmed_at else confirmed_at end,
      appointment_location=case when row.lead_type='test_drive' then nullif(left(trim(coalesce(p_appointment_location,'')),300),'') else appointment_location end,
      customer_action=case when p_status='scheduled' then null else customer_action end,
      customer_action_note=case when p_status='scheduled' then null else customer_action_note end,
      customer_action_at=case when p_status='scheduled' then null else customer_action_at end,
      updated_at=now()
  where id=row.id
  returning * into row;
  return row;
end;
$$;

revoke all on function public.merchant_auto_customer_respond_quote(uuid,text) from anon, public, authenticated;
grant execute on function public.merchant_auto_customer_respond_quote(uuid,text) to authenticated;
revoke all on function public.merchant_auto_customer_leads(uuid) from anon, public, authenticated;
grant execute on function public.merchant_auto_customer_leads(uuid) to authenticated;
revoke all on function public.merchant_auto_update_lead_schedule(uuid,text,text,numeric,timestamptz,timestamptz,text) from anon, public, authenticated;
grant execute on function public.merchant_auto_update_lead_schedule(uuid,text,text,numeric,timestamptz,timestamptz,text) to authenticated;
