-- 乐生活 v5.585：零工与家政服务第一版
-- 本模块为信息撮合。当前不接入平台付款、资金托管或交易担保。

create table if not exists public.service_requests (
  id uuid primary key default gen_random_uuid(),
  requester_user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('gig','homecare')),
  title text not null check (char_length(title) between 2 and 100),
  description text not null check (char_length(description) between 2 and 2000),
  service_type text not null default '其他',
  location_text text,
  requested_at timestamptz,
  budget_min numeric(10,2),
  budget_max numeric(10,2),
  contact_name text not null check (char_length(contact_name) between 1 and 80),
  contact_phone text not null check (char_length(contact_phone) between 5 and 40),
  status text not null default 'open' check (status in ('open','review','assigned','completed','cancelled')),
  review_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint service_requests_budget_check check (budget_min is null or budget_min >= 0),
  constraint service_requests_budget_range_check check (budget_max is null or budget_min is null or budget_max >= budget_min)
);

create table if not exists public.service_offers (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.service_requests(id) on delete cascade,
  provider_user_id uuid not null references auth.users(id) on delete cascade,
  provider_name text not null,
  provider_avatar text,
  quoted_amount numeric(10,2) not null check (quoted_amount >= 0),
  message text not null check (char_length(message) between 1 and 1000),
  status text not null default 'pending' check (status in ('pending','accepted','rejected','withdrawn')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (request_id, provider_user_id)
);

create table if not exists public.homecare_provider_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 80),
  avatar_url text,
  service_types text[] not null default '{}',
  areas text[] not null default '{}',
  bio text not null default '' check (char_length(bio) <= 1000),
  experience_years integer not null default 0 check (experience_years between 0 and 80),
  availability_note text not null default '' check (char_length(availability_note) <= 500),
  id_document_url text,
  id_document_status text not null default 'draft' check (id_document_status in ('draft','submitted','verified','rejected')),
  public_status text not null default 'draft' check (public_status in ('draft','review','active','paused','rejected')),
  review_reason text,
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.homecare_bookings (
  id uuid primary key default gen_random_uuid(),
  provider_user_id uuid not null references public.homecare_provider_profiles(user_id) on delete restrict,
  requester_user_id uuid not null references auth.users(id) on delete cascade,
  customer_name text not null check (char_length(customer_name) between 1 and 80),
  customer_phone text not null check (char_length(customer_phone) between 5 and 40),
  requested_at timestamptz,
  service_type text not null default '家政服务',
  note text not null default '' check (char_length(note) <= 1000),
  status text not null default 'pending' check (status in ('pending','accepted','declined','cancelled','completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists service_requests_public_index on public.service_requests(kind,status,created_at desc);
create index if not exists service_requests_requester_index on public.service_requests(requester_user_id,created_at desc);
create index if not exists service_offers_request_index on public.service_offers(request_id,status,created_at desc);
create index if not exists service_offers_provider_index on public.service_offers(provider_user_id,created_at desc);
create index if not exists homecare_profiles_public_index on public.homecare_provider_profiles(public_status,updated_at desc);
create index if not exists homecare_bookings_provider_index on public.homecare_bookings(provider_user_id,status,created_at desc);

alter table public.service_requests enable row level security;
alter table public.service_offers enable row level security;
alter table public.homecare_provider_profiles enable row level security;
alter table public.homecare_bookings enable row level security;
revoke all on public.service_requests, public.service_offers, public.homecare_provider_profiles, public.homecare_bookings from anon, authenticated;

create or replace function public.service_is_admin()
returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.deal_admins where user_id=auth.uid());
$$;

create or replace function public.service_safe_profile(p_user_id uuid)
returns jsonb language sql stable security definer set search_path=public as $$
  select jsonb_build_object(
    'name', coalesce(nullif(trim(p.name),''),'乐生活用户'),
    'avatar', p.avatar
  ) from public.profiles p where p.user_id=p_user_id;
$$;

create or replace function public.service_public_catalog(p_kind text default 'all')
returns jsonb language sql stable security definer set search_path=public as $$
  select jsonb_build_object(
    'requests', coalesce((
      select jsonb_agg(to_jsonb(x) order by x.created_at desc) from (
        select r.id,r.kind,r.title,r.description,r.service_type,r.location_text,r.requested_at,r.budget_min,r.budget_max,r.status,r.created_at,
          coalesce(public.service_safe_profile(r.requester_user_id),'{}'::jsonb) as requester,
          (select count(*) from public.service_offers o where o.request_id=r.id and o.status='pending') as offer_count
        from public.service_requests r
        where r.status='open' and (coalesce(nullif(trim(p_kind),''),'all')='all' or r.kind=p_kind)
        order by r.created_at desc limit 120
      ) x
    ),'[]'::jsonb),
    'providers', coalesce((
      select jsonb_agg(to_jsonb(x) order by x.updated_at desc) from (
        select user_id,display_name,avatar_url,service_types,areas,bio,experience_years,availability_note,updated_at
        from public.homecare_provider_profiles where public_status='active' and id_document_status='verified'
        order by updated_at desc limit 120
      ) x
    ),'[]'::jsonb)
  );
$$;

create or replace function public.service_create_request(
  p_kind text,p_title text,p_description text,p_service_type text,p_location_text text,p_requested_at timestamptz,
  p_budget_min numeric,p_budget_max numeric,p_contact_name text,p_contact_phone text
)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_user uuid:=auth.uid(); v_check jsonb; v_row public.service_requests%rowtype;
begin
  if v_user is null then raise exception 'login_required'; end if;
  if p_kind not in ('gig','homecare') then raise exception 'invalid_kind'; end if;
  v_check:=public.marketplace_listing_compliance(concat_ws(' ',p_title,p_description,p_service_type),'US-CA');
  if v_check->>'action'='block' then raise exception 'listing_restricted:%',v_check->>'rule_key' using errcode='22023'; end if;
  insert into public.service_requests(requester_user_id,kind,title,description,service_type,location_text,requested_at,budget_min,budget_max,contact_name,contact_phone,status,review_reason)
  values(v_user,trim(p_kind),trim(p_title),trim(p_description),coalesce(nullif(trim(p_service_type),''),'其他'),nullif(trim(p_location_text),''),p_requested_at,p_budget_min,p_budget_max,trim(p_contact_name),trim(p_contact_phone),case when v_check->>'action'='review' then 'review' else 'open' end,case when v_check->>'action'='review' then v_check->>'rule_key' else null end)
  returning * into v_row;
  return jsonb_build_object('id',v_row.id,'status',v_row.status,'review_reason',v_row.review_reason);
end;
$$;

create or replace function public.service_submit_offer(p_request_id uuid,p_quoted_amount numeric,p_message text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_user uuid:=auth.uid(); v_request public.service_requests%rowtype; v_profile jsonb; v_offer public.service_offers%rowtype; v_check jsonb;
begin
  if v_user is null then raise exception 'login_required'; end if;
  select * into v_request from public.service_requests where id=p_request_id for update;
  if not found then raise exception 'request_not_found'; end if;
  if v_request.status<>'open' then raise exception 'request_not_open'; end if;
  if v_request.requester_user_id=v_user then raise exception 'cannot_offer_own_request'; end if;
  v_check:=public.marketplace_listing_compliance(p_message,'US-CA');
  if v_check->>'action'='block' then raise exception 'listing_restricted:%',v_check->>'rule_key' using errcode='22023'; end if;
  v_profile:=coalesce(public.service_safe_profile(v_user),'{}'::jsonb);
  insert into public.service_offers(request_id,provider_user_id,provider_name,provider_avatar,quoted_amount,message,status)
  values(p_request_id,v_user,coalesce(v_profile->>'name','乐生活用户'),v_profile->>'avatar',p_quoted_amount,trim(p_message),case when v_check->>'action'='review' then 'withdrawn' else 'pending' end)
  on conflict(request_id,provider_user_id) do update set quoted_amount=excluded.quoted_amount,message=excluded.message,status=excluded.status,updated_at=now()
  returning * into v_offer;
  return jsonb_build_object('id',v_offer.id,'status',v_offer.status);
end;
$$;

create or replace function public.service_request_offers(p_request_id uuid)
returns jsonb language sql security definer set search_path=public as $$
  select coalesce(jsonb_agg(to_jsonb(x) order by x.created_at desc),'[]'::jsonb)
  from (
    select o.id,o.provider_user_id,o.provider_name,o.provider_avatar,o.quoted_amount,o.message,o.status,o.created_at
    from public.service_offers o join public.service_requests r on r.id=o.request_id
    where o.request_id=p_request_id and r.requester_user_id=auth.uid()
  ) x;
$$;

create or replace function public.service_accept_offer(p_offer_id uuid)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_offer public.service_offers%rowtype; v_request public.service_requests%rowtype;
begin
  select * into v_offer from public.service_offers where id=p_offer_id for update;
  if not found then raise exception 'offer_not_found'; end if;
  select * into v_request from public.service_requests where id=v_offer.request_id for update;
  if v_request.requester_user_id<>auth.uid() then raise exception 'request_owner_required'; end if;
  if v_request.status<>'open' or v_offer.status<>'pending' then raise exception 'offer_no_longer_available'; end if;
  update public.service_offers set status=case when id=p_offer_id then 'accepted' else 'rejected' end,updated_at=now() where request_id=v_request.id and status='pending';
  update public.service_requests set status='assigned',updated_at=now() where id=v_request.id;
  return jsonb_build_object('request_id',v_request.id,'provider_user_id',v_offer.provider_user_id,'status','assigned');
end;
$$;

create or replace function public.service_upsert_homecare_profile(
  p_display_name text,p_service_types text[],p_areas text[],p_bio text,p_experience_years integer,p_availability_note text,p_id_document_url text
)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_user uuid:=auth.uid(); v_check jsonb; v_status text;
begin
  if v_user is null then raise exception 'login_required'; end if;
  if nullif(trim(coalesce(p_id_document_url,'')),'') is null then raise exception 'id_document_required'; end if;
  if split_part(trim(p_id_document_url),'/',1)<>v_user::text then raise exception 'invalid_id_document'; end if;
  v_check:=public.marketplace_listing_compliance(concat_ws(' ',p_display_name,p_bio,array_to_string(p_service_types,' ')),'US-CA');
  if v_check->>'action'='block' then raise exception 'listing_restricted:%',v_check->>'rule_key' using errcode='22023'; end if;
  v_status:=case when v_check->>'action'='review' then 'review' else 'review' end;
  insert into public.homecare_provider_profiles(user_id,display_name,avatar_url,service_types,areas,bio,experience_years,availability_note,id_document_url,id_document_status,public_status,review_reason)
  values(v_user,trim(p_display_name),(public.service_safe_profile(v_user)->>'avatar'),coalesce(p_service_types,'{}'),coalesce(p_areas,'{}'),coalesce(p_bio,''),greatest(0,least(coalesce(p_experience_years,0),80)),coalesce(p_availability_note,''),trim(p_id_document_url),'submitted',v_status,case when v_check->>'action'='review' then v_check->>'rule_key' else null end)
  on conflict(user_id) do update set display_name=excluded.display_name,avatar_url=excluded.avatar_url,service_types=excluded.service_types,areas=excluded.areas,bio=excluded.bio,experience_years=excluded.experience_years,availability_note=excluded.availability_note,id_document_url=excluded.id_document_url,id_document_status='submitted',public_status=v_status,review_reason=excluded.review_reason,updated_at=now();
  return jsonb_build_object('status','review','message','证件已提交，平台审核通过后才会公开展示。');
end;
$$;

create or replace function public.service_book_homecare(p_provider_user_id uuid,p_customer_name text,p_customer_phone text,p_requested_at timestamptz,p_service_type text,p_note text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_user uuid:=auth.uid(); v_provider public.homecare_provider_profiles%rowtype; v_row public.homecare_bookings%rowtype;
begin
  if v_user is null then raise exception 'login_required'; end if;
  select * into v_provider from public.homecare_provider_profiles where user_id=p_provider_user_id;
  if not found or v_provider.public_status<>'active' or v_provider.id_document_status<>'verified' then raise exception 'provider_unavailable'; end if;
  if v_user=p_provider_user_id then raise exception 'cannot_book_self'; end if;
  insert into public.homecare_bookings(provider_user_id,requester_user_id,customer_name,customer_phone,requested_at,service_type,note)
  values(p_provider_user_id,v_user,trim(p_customer_name),trim(p_customer_phone),p_requested_at,coalesce(nullif(trim(p_service_type),''),'家政服务'),coalesce(trim(p_note),'')) returning * into v_row;
  return jsonb_build_object('id',v_row.id,'status',v_row.status);
end;
$$;

create or replace function public.service_my_dashboard()
returns jsonb language sql security definer set search_path=public as $$
  select jsonb_build_object(
    'requests',coalesce((select jsonb_agg(to_jsonb(x) order by x.created_at desc) from (select id,kind,title,service_type,status,created_at,(select count(*) from public.service_offers o where o.request_id=r.id) as offer_count from public.service_requests r where r.requester_user_id=auth.uid()) x),'[]'::jsonb),
    'offers',coalesce((select jsonb_agg(to_jsonb(x) order by x.created_at desc) from (select o.id,o.request_id,o.quoted_amount,o.message,o.status,o.created_at,r.title,r.kind from public.service_offers o join public.service_requests r on r.id=o.request_id where o.provider_user_id=auth.uid()) x),'[]'::jsonb),
    'bookings',coalesce((select jsonb_agg(to_jsonb(x) order by x.created_at desc) from (select id,provider_user_id,customer_name,requested_at,service_type,status,created_at from public.homecare_bookings where requester_user_id=auth.uid() or provider_user_id=auth.uid()) x),'[]'::jsonb),
    'provider_profile',coalesce((select to_jsonb(p) from public.homecare_provider_profiles p where p.user_id=auth.uid()),'null'::jsonb)
  );
$$;

create or replace function public.service_review_homecare_provider(p_user_id uuid,p_status text,p_note text default null)
returns jsonb language plpgsql security definer set search_path=public as $$
begin
  if not public.service_is_admin() then raise exception 'admin_required'; end if;
  if p_status not in ('active','rejected','paused') then raise exception 'invalid_status'; end if;
  update public.homecare_provider_profiles
  set public_status=p_status,id_document_status=case when p_status='active' then 'verified' when p_status='rejected' then 'rejected' else id_document_status end,review_reason=nullif(trim(coalesce(p_note,'')),''),reviewed_at=now(),reviewed_by=auth.uid(),updated_at=now()
  where user_id=p_user_id;
  return jsonb_build_object('status',p_status);
end;
$$;

revoke all on function public.service_is_admin() from public;
revoke all on function public.service_safe_profile(uuid) from public;
revoke all on function public.service_create_request(text,text,text,text,text,timestamptz,numeric,numeric,text,text) from public,anon;
revoke all on function public.service_submit_offer(uuid,numeric,text) from public,anon;
revoke all on function public.service_request_offers(uuid) from public,anon;
revoke all on function public.service_accept_offer(uuid) from public,anon;
revoke all on function public.service_upsert_homecare_profile(text,text[],text[],text,integer,text,text) from public,anon;
revoke all on function public.service_book_homecare(uuid,text,text,timestamptz,text,text) from public,anon;
revoke all on function public.service_my_dashboard() from public,anon;
revoke all on function public.service_review_homecare_provider(uuid,text,text) from public,anon;
grant execute on function public.service_public_catalog(text) to anon,authenticated;
grant execute on function public.service_create_request(text,text,text,text,text,timestamptz,numeric,numeric,text,text) to authenticated;
grant execute on function public.service_submit_offer(uuid,numeric,text) to authenticated;
grant execute on function public.service_request_offers(uuid) to authenticated;
grant execute on function public.service_accept_offer(uuid) to authenticated;
grant execute on function public.service_upsert_homecare_profile(text,text[],text[],text,integer,text,text) to authenticated;
grant execute on function public.service_book_homecare(uuid,text,text,timestamptz,text,text) to authenticated;
grant execute on function public.service_my_dashboard() to authenticated;
grant execute on function public.service_review_homecare_provider(uuid,text,text) to authenticated;
