create extension if not exists pgcrypto;

create table if not exists public.deal_reports (
  id uuid primary key default gen_random_uuid(),
  report_type text not null default 'user_report',
  status text not null default 'pending',
  user_id uuid,
  user_name text,
  merchant_id uuid,
  retailer_key text,
  retailer_name text not null,
  category text not null default 'general',
  product_name text not null,
  product_name_cn text,
  original_price numeric,
  current_price numeric,
  unit text,
  location text,
  source_url text not null,
  image_url text,
  price_note text,
  submit_note text,
  ai_summary_cn text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid
);

create index if not exists deal_reports_status_idx on public.deal_reports(status);
create index if not exists deal_reports_created_idx on public.deal_reports(created_at desc);
create index if not exists deal_reports_retailer_idx on public.deal_reports(retailer_key);

alter table public.deal_reports enable row level security;

drop policy if exists "deal reports public insert" on public.deal_reports;
create policy "deal reports public insert"
on public.deal_reports
for insert
to anon, authenticated
with check (true);

drop policy if exists "deal reports owner read" on public.deal_reports;
create policy "deal reports owner read"
on public.deal_reports
for select
to authenticated
using (auth.uid() = user_id);

create table if not exists public.deal_interactions (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid references public.deals(id) on delete cascade,
  event_type text not null,
  user_id uuid,
  session_key text,
  created_at timestamptz not null default now()
);

create index if not exists deal_interactions_deal_idx on public.deal_interactions(deal_id);
create index if not exists deal_interactions_event_idx on public.deal_interactions(event_type);
create index if not exists deal_interactions_created_idx on public.deal_interactions(created_at desc);

alter table public.deal_interactions enable row level security;

drop policy if exists "deal interactions public insert" on public.deal_interactions;
create policy "deal interactions public insert"
on public.deal_interactions
for insert
to anon, authenticated
with check (true);

drop view if exists public.deal_rankings;
create view public.deal_rankings as
with recent_interactions as (
  select
    deal_id,
    coalesce(sum(case when event_type = 'click' then 1 else 0 end), 0)::integer as click_count,
    coalesce(sum(case when event_type = 'favorite' then 1 else 0 end), 0)::integer as favorite_count,
    coalesce(sum(case when event_type = 'copy' then 1 else 0 end), 0)::integer as copy_count
  from public.deal_interactions
  where created_at >= now() - interval '7 days'
  group by deal_id
)
select
  d.*,
  coalesce(i.click_count, 0)::integer as click_count,
  coalesce(i.favorite_count, 0)::integer as favorite_count,
  coalesce(i.copy_count, 0)::integer as copy_count,
  (
    coalesce(i.click_count, 0) * 1
    + coalesce(i.copy_count, 0) * 2
    + coalesce(i.favorite_count, 0) * 4
    + case when d.is_hot then 10 else 0 end
    + case when d.is_food_low_price then 6 else 0 end
  )::integer as hot_score
from public.deals d
left join recent_interactions i on i.deal_id = d.id;

grant select on public.deal_rankings to anon, authenticated;
