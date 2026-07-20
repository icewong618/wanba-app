-- 乐生活 v5.387：二手车商家报价与线索跟进
-- 为卖车估价和试驾线索增加正式报价、有效期；客户只能读取自己的线索。

alter table public.merchant_auto_leads
  add column if not exists quoted_amount numeric(12,2) check (quoted_amount is null or quoted_amount >= 0),
  add column if not exists quote_expires_at timestamptz;

create or replace function public.merchant_auto_update_lead_quote(
  p_lead_id uuid,
  p_status text,
  p_merchant_note text,
  p_quoted_amount numeric default null,
  p_quote_expires_at timestamptz default null
)
returns public.merchant_auto_leads
language plpgsql security definer set search_path=public,pg_temp as $$
declare row public.merchant_auto_leads%rowtype;
begin
  select * into row from public.merchant_auto_leads where id=p_lead_id for update;
  if not found or not public.merchant_auto_can_manage(row.merchant_user_id) then
    raise exception 'lead_permission_denied';
  end if;
  if p_status not in ('new','contacted','scheduled','quoted','closed','archived') then
    raise exception 'invalid_lead_status';
  end if;
  update public.merchant_auto_leads
  set status=p_status,
      merchant_note=nullif(left(trim(coalesce(p_merchant_note,'')),1500),''),
      quoted_amount=p_quoted_amount,
      quote_expires_at=p_quote_expires_at,
      updated_at=now()
  where id=row.id
  returning * into row;
  return row;
end;
$$;

create or replace function public.merchant_auto_customer_leads(p_merchant_user_id uuid)
returns jsonb
language sql stable security definer set search_path=public,pg_temp as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id',l.id,'lead_type',l.lead_type,'status',l.status,'created_at',l.created_at,
    'vehicle_data',l.vehicle_data,'photos',l.photos,'quoted_amount',l.quoted_amount,
    'quote_expires_at',l.quote_expires_at,'merchant_note',l.merchant_note,
    'listing_title',a.title,'preferred_at',l.preferred_at
  ) order by l.created_at desc),'[]'::jsonb)
  from public.merchant_auto_leads l
  left join public.merchant_auto_listings a on a.id=l.listing_id
  where l.merchant_user_id=p_merchant_user_id and l.user_id=(select auth.uid());
$$;

revoke all on function public.merchant_auto_update_lead_quote(uuid,text,text,numeric,timestamptz) from public;
grant execute on function public.merchant_auto_update_lead_quote(uuid,text,text,numeric,timestamptz) to authenticated;
revoke all on function public.merchant_auto_customer_leads(uuid) from public;
grant execute on function public.merchant_auto_customer_leads(uuid) to authenticated;
