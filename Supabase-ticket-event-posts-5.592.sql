-- 乐生活 v5.592：票务活动与社区活动笔记一对一关联
-- 运行一次。活动保存后会同步为“玩乐 · 展览演出”笔记，并按活动日期进入本周 / 本月筛选。

alter table public.merchant_ticket_events
  add column if not exists community_post_id bigint references public.posts(id) on delete set null;

create unique index if not exists merchant_ticket_events_community_post_id_key
  on public.merchant_ticket_events (community_post_id)
  where community_post_id is not null;

create index if not exists merchant_ticket_events_community_post_lookup_idx
  on public.merchant_ticket_events (merchant_user_id, community_post_id);

comment on column public.merchant_ticket_events.community_post_id is
  'The community activity post kept in sync with this ticket event.';

create or replace function public.merchant_ticket_link_community_post(
  p_merchant_user_id uuid,
  p_event_id uuid,
  p_post_id bigint
)
returns boolean
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
begin
  if auth.uid() is null or not public.merchant_tickets_can_manage(p_merchant_user_id) then
    raise exception 'not_authorized';
  end if;

  update public.merchant_ticket_events
  set community_post_id = p_post_id,
      updated_at = now()
  where id = p_event_id
    and merchant_user_id = p_merchant_user_id;

  if not found then
    raise exception 'event_not_found';
  end if;
  return true;
end;
$$;

revoke all on function public.merchant_ticket_link_community_post(uuid,uuid,bigint) from public, anon;
grant execute on function public.merchant_ticket_link_community_post(uuid,uuid,bigint) to authenticated;

create or replace function public.merchant_ticket_sync_calendar(
  p_merchant_user_id uuid,
  p_event_id uuid,
  p_merchant_slug text
)
returns boolean
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  v_event public.merchant_ticket_events%rowtype;
  v_slug text := lower(trim(coalesce(p_merchant_slug, '')));
begin
  if auth.uid() is null or not public.merchant_tickets_can_manage(p_merchant_user_id) then
    raise exception 'not_authorized';
  end if;
  select * into v_event
  from public.merchant_ticket_events
  where id = p_event_id and merchant_user_id = p_merchant_user_id;
  if not found then
    raise exception 'event_not_found';
  end if;

  insert into public.activity_calendar_items(
    source_type, source_id, source_url, merchant_user_id, title, summary,
    cover_image, start_date, end_date, all_day, location, status, metadata, updated_at
  ) values (
    'ticket', v_event.id::text,
    case when v_slug <> '' then '/tickets/?merchant=' || v_slug || '&event=' || v_event.id::text else null end,
    p_merchant_user_id, v_event.title, v_event.description, v_event.cover_image,
    (v_event.starts_at at time zone 'America/Los_Angeles')::date,
    (v_event.ends_at at time zone 'America/Los_Angeles')::date,
    false, v_event.location_text,
    case when v_event.status = 'published' then 'published' when v_event.status = 'cancelled' then 'cancelled' else 'draft' end,
    jsonb_build_object('merchant_slug', v_slug, 'ticket_event_id', v_event.id::text), now()
  ) on conflict (source_type, source_id) do update set
    source_url = excluded.source_url,
    title = excluded.title,
    summary = excluded.summary,
    cover_image = excluded.cover_image,
    start_date = excluded.start_date,
    end_date = excluded.end_date,
    all_day = excluded.all_day,
    location = excluded.location,
    status = excluded.status,
    metadata = excluded.metadata,
    updated_at = now();
  return true;
end;
$$;

revoke all on function public.merchant_ticket_sync_calendar(uuid,uuid,text) from public, anon;
grant execute on function public.merchant_ticket_sync_calendar(uuid,uuid,text) to authenticated;
