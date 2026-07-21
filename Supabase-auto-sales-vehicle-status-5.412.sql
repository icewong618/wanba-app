-- 乐生活 v5.412：二手车库存状态闭环。
-- 商家可为预留、已售、下架填写说明；收藏或预约过车辆的客户可在“我的提醒”查看近期状态变化。

alter table public.merchant_auto_listings
  add column if not exists status_note text;

create table if not exists public.merchant_auto_listing_status_history (
  id bigint generated always as identity primary key,
  listing_id uuid not null references public.merchant_auto_listings(id) on delete cascade,
  merchant_user_id uuid not null references auth.users(id) on delete cascade,
  previous_status text,
  current_status text not null check (current_status in ('available','reserved','sold','hidden')),
  note text,
  changed_at timestamptz not null default now()
);

create index if not exists merchant_auto_status_history_listing_idx
  on public.merchant_auto_listing_status_history (listing_id, changed_at desc);
create index if not exists merchant_auto_status_history_merchant_idx
  on public.merchant_auto_listing_status_history (merchant_user_id, changed_at desc);

create or replace function public.merchant_auto_record_status_history()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if tg_op = 'UPDATE' and new.status is distinct from old.status then
    insert into public.merchant_auto_listing_status_history(listing_id, merchant_user_id, previous_status, current_status, note)
    values (new.id, new.merchant_user_id, old.status, new.status, nullif(left(trim(coalesce(new.status_note, '')), 1000), ''));
  end if;
  return new;
end;
$$;

drop trigger if exists merchant_auto_listing_status_history_trigger on public.merchant_auto_listings;
create trigger merchant_auto_listing_status_history_trigger
after update of status on public.merchant_auto_listings
for each row execute function public.merchant_auto_record_status_history();

alter table public.merchant_auto_listing_status_history enable row level security;

drop policy if exists "auto status history merchant 5.412" on public.merchant_auto_listing_status_history;
create policy "auto status history merchant 5.412"
on public.merchant_auto_listing_status_history for select to authenticated
using (public.merchant_auto_can_manage(merchant_user_id));

create or replace function public.merchant_auto_change_listing_status(p_listing_id uuid, p_status text, p_note text default null)
returns public.merchant_auto_listings
language plpgsql security definer set search_path = public, pg_temp as $$
declare row public.merchant_auto_listings%rowtype;
begin
  select * into row from public.merchant_auto_listings where id = p_listing_id for update;
  if not found or not public.merchant_auto_can_manage(row.merchant_user_id) then raise exception 'listing_permission_denied'; end if;
  if p_status not in ('available','reserved','sold','hidden') then raise exception 'invalid_listing_status'; end if;
  if row.status = 'sold' and p_status <> 'sold' then raise exception 'sold_listing_locked'; end if;
  update public.merchant_auto_listings
  set status = p_status, status_note = nullif(left(trim(coalesce(p_note, '')), 1000), ''), updated_at = now()
  where id = row.id returning * into row;
  return row;
end;
$$;

-- Extend v5.411 reminder data with status changes relevant to a customer's saved or requested vehicles.
create or replace function public.merchant_auto_list_search_alerts(p_merchant_user_id uuid)
returns jsonb
language plpgsql security definer set search_path = public, pg_temp as $$
declare current_user_id uuid := auth.uid(); earliest_check timestamptz;
begin
  if current_user_id is null then raise exception 'login_required'; end if;
  select min(coalesce(last_checked_at, created_at)) into earliest_check
  from public.merchant_auto_saved_searches
  where user_id = current_user_id and merchant_user_id = p_merchant_user_id and price_drop_enabled;
  return jsonb_build_object(
    'searches', coalesce((
      select jsonb_agg(jsonb_build_object('id', search.id, 'name', search.name, 'filters', search.filters, 'price_drop_enabled', search.price_drop_enabled, 'last_checked_at', search.last_checked_at, 'created_at', search.created_at) order by search.created_at desc)
      from public.merchant_auto_saved_searches search
      where search.user_id = current_user_id and search.merchant_user_id = p_merchant_user_id
    ), '[]'::jsonb),
    'price_drops', coalesce((
      select jsonb_agg(jsonb_build_object('listing_id', listing.id, 'title', listing.title, 'vehicle_type', listing.vehicle_type, 'fuel_type', listing.fuel_type, 'current_price', history.current_price, 'previous_price', history.previous_price, 'changed_at', history.changed_at) order by history.changed_at desc)
      from public.merchant_auto_listing_price_history history
      join public.merchant_auto_listings listing on listing.id = history.listing_id
      where history.merchant_user_id = p_merchant_user_id and listing.status = 'available'
        and history.previous_price is not null and history.current_price < history.previous_price
        and history.changed_at >= coalesce(earliest_check, now())
    ), '[]'::jsonb),
    'vehicle_updates', coalesce((
      select jsonb_agg(to_jsonb(update_row) order by update_row.changed_at desc)
      from (
        select distinct on (history.listing_id)
          history.listing_id, listing.title, history.previous_status, history.current_status, history.note, history.changed_at
        from public.merchant_auto_listing_status_history history
        join public.merchant_auto_listings listing on listing.id = history.listing_id
        where history.merchant_user_id = p_merchant_user_id
          and history.changed_at >= now() - interval '30 days'
          and (exists (select 1 from public.merchant_auto_saved_listings saved where saved.user_id = current_user_id and saved.listing_id = history.listing_id)
            or exists (select 1 from public.merchant_auto_leads lead where lead.user_id = current_user_id and lead.listing_id = history.listing_id))
        order by history.listing_id, history.changed_at desc
      ) update_row
    ), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.merchant_auto_change_listing_status(uuid,text,text) from public;
grant execute on function public.merchant_auto_change_listing_status(uuid,text,text) to authenticated;
revoke all on function public.merchant_auto_list_search_alerts(uuid) from public;
grant execute on function public.merchant_auto_list_search_alerts(uuid) to authenticated;
