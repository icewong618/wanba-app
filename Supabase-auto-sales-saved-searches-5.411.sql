-- 乐生活 v5.411：二手车保存筛选与站内降价提醒。
-- 运行后，客户可以保存车型/能源/预算筛选；商家调整售价时会保留价格变化记录。

create table if not exists public.merchant_auto_saved_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  merchant_user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 50),
  filters jsonb not null default '{}'::jsonb check (jsonb_typeof(filters) = 'object'),
  price_drop_enabled boolean not null default true,
  last_checked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists merchant_auto_saved_searches_user_merchant_idx
  on public.merchant_auto_saved_searches (user_id, merchant_user_id, updated_at desc);

create table if not exists public.merchant_auto_listing_price_history (
  id bigint generated always as identity primary key,
  listing_id uuid not null references public.merchant_auto_listings(id) on delete cascade,
  merchant_user_id uuid not null references auth.users(id) on delete cascade,
  previous_price numeric(12,2),
  current_price numeric(12,2) not null check (current_price >= 0),
  changed_at timestamptz not null default now()
);

create index if not exists merchant_auto_price_history_listing_idx
  on public.merchant_auto_listing_price_history (listing_id, changed_at desc);
create index if not exists merchant_auto_price_history_merchant_idx
  on public.merchant_auto_listing_price_history (merchant_user_id, changed_at desc);

create or replace function public.merchant_auto_record_price_history()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.merchant_auto_listing_price_history(listing_id, merchant_user_id, previous_price, current_price)
    values (new.id, new.merchant_user_id, null, new.price);
  elsif new.price is distinct from old.price then
    insert into public.merchant_auto_listing_price_history(listing_id, merchant_user_id, previous_price, current_price)
    values (new.id, new.merchant_user_id, old.price, new.price);
  end if;
  return new;
end;
$$;

drop trigger if exists merchant_auto_listing_price_history_trigger on public.merchant_auto_listings;
create trigger merchant_auto_listing_price_history_trigger
after insert or update of price on public.merchant_auto_listings
for each row execute function public.merchant_auto_record_price_history();

-- Establish a starting baseline for listings that existed before this version.
insert into public.merchant_auto_listing_price_history(listing_id, merchant_user_id, previous_price, current_price, changed_at)
select listing.id, listing.merchant_user_id, null, listing.price, listing.updated_at
from public.merchant_auto_listings listing
where not exists (
  select 1 from public.merchant_auto_listing_price_history history
  where history.listing_id = listing.id
);

alter table public.merchant_auto_saved_searches enable row level security;
alter table public.merchant_auto_listing_price_history enable row level security;

drop policy if exists "auto saved searches own 5.411" on public.merchant_auto_saved_searches;
create policy "auto saved searches own 5.411"
on public.merchant_auto_saved_searches
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

-- History is intentionally read through a scoped RPC, rather than exposing vehicle pricing history as a table API.
drop policy if exists "auto price history merchant 5.411" on public.merchant_auto_listing_price_history;
create policy "auto price history merchant 5.411"
on public.merchant_auto_listing_price_history
for select to authenticated
using (public.merchant_auto_can_manage(merchant_user_id));

create or replace function public.merchant_auto_save_search_alert(
  p_merchant_user_id uuid,
  p_name text,
  p_filters jsonb default '{}'::jsonb,
  p_price_drop_enabled boolean default true
)
returns public.merchant_auto_saved_searches
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  row public.merchant_auto_saved_searches%rowtype;
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then raise exception 'login_required'; end if;
  if not exists (select 1 from public.merchants where user_id = p_merchant_user_id) then
    raise exception 'merchant_not_found';
  end if;
  if char_length(trim(coalesce(p_name, ''))) < 1 then raise exception 'search_name_required'; end if;
  if (select count(*) from public.merchant_auto_saved_searches where user_id = current_user_id and merchant_user_id = p_merchant_user_id) >= 12 then
    raise exception 'saved_search_limit_reached';
  end if;
  insert into public.merchant_auto_saved_searches(user_id, merchant_user_id, name, filters, price_drop_enabled)
  values (
    current_user_id,
    p_merchant_user_id,
    left(trim(p_name), 50),
    jsonb_build_object(
      'type', nullif(left(trim(coalesce(p_filters->>'type','')), 30), ''),
      'fuel', nullif(left(trim(coalesce(p_filters->>'fuel','')), 30), ''),
      'price', case when coalesce(p_filters->>'price','') ~ '^[0-9]+([.][0-9]{1,2})?$' then (p_filters->>'price')::numeric else null end
    ),
    coalesce(p_price_drop_enabled, true)
  ) returning * into row;
  return row;
end;
$$;

create or replace function public.merchant_auto_list_search_alerts(p_merchant_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  current_user_id uuid := auth.uid();
  earliest_check timestamptz;
begin
  if current_user_id is null then raise exception 'login_required'; end if;
  select min(coalesce(last_checked_at, created_at)) into earliest_check
  from public.merchant_auto_saved_searches
  where user_id = current_user_id and merchant_user_id = p_merchant_user_id and price_drop_enabled;

  return jsonb_build_object(
    'searches', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', search.id,
        'name', search.name,
        'filters', search.filters,
        'price_drop_enabled', search.price_drop_enabled,
        'last_checked_at', search.last_checked_at,
        'created_at', search.created_at
      ) order by search.created_at desc)
      from public.merchant_auto_saved_searches search
      where search.user_id = current_user_id and search.merchant_user_id = p_merchant_user_id
    ), '[]'::jsonb),
    'price_drops', coalesce((
      select jsonb_agg(jsonb_build_object(
        'listing_id', listing.id,
        'title', listing.title,
        'vehicle_type', listing.vehicle_type,
        'fuel_type', listing.fuel_type,
        'current_price', history.current_price,
        'previous_price', history.previous_price,
        'changed_at', history.changed_at
      ) order by history.changed_at desc)
      from public.merchant_auto_listing_price_history history
      join public.merchant_auto_listings listing on listing.id = history.listing_id
      where history.merchant_user_id = p_merchant_user_id
        and listing.status = 'available'
        and history.previous_price is not null
        and history.current_price < history.previous_price
        and history.changed_at >= coalesce(earliest_check, now())
    ), '[]'::jsonb)
  );
end;
$$;

create or replace function public.merchant_auto_mark_search_alerts_checked(p_merchant_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if auth.uid() is null then raise exception 'login_required'; end if;
  update public.merchant_auto_saved_searches
  set last_checked_at = now(), updated_at = now()
  where user_id = auth.uid() and merchant_user_id = p_merchant_user_id and price_drop_enabled;
end;
$$;

create or replace function public.merchant_auto_delete_search_alert(p_search_id uuid)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if auth.uid() is null then raise exception 'login_required'; end if;
  delete from public.merchant_auto_saved_searches
  where id = p_search_id and user_id = auth.uid();
end;
$$;

revoke all on function public.merchant_auto_save_search_alert(uuid,text,jsonb,boolean) from public;
grant execute on function public.merchant_auto_save_search_alert(uuid,text,jsonb,boolean) to authenticated;
revoke all on function public.merchant_auto_list_search_alerts(uuid) from public;
grant execute on function public.merchant_auto_list_search_alerts(uuid) to authenticated;
revoke all on function public.merchant_auto_mark_search_alerts_checked(uuid) from public;
grant execute on function public.merchant_auto_mark_search_alerts_checked(uuid) to authenticated;
revoke all on function public.merchant_auto_delete_search_alert(uuid) from public;
grant execute on function public.merchant_auto_delete_search_alert(uuid) to authenticated;
