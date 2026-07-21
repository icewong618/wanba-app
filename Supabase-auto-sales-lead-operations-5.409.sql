-- 乐生活 v5.409：二手车销售线索的负责人、回访与内部跟进记录。

alter table public.merchant_auto_leads
  add column if not exists assigned_to uuid references auth.users(id) on delete set null,
  add column if not exists follow_up_at timestamptz,
  add column if not exists last_contacted_at timestamptz;

create index if not exists merchant_auto_leads_follow_up_idx
  on public.merchant_auto_leads (merchant_user_id, follow_up_at asc)
  where follow_up_at is not null;

create table if not exists public.merchant_auto_lead_activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.merchant_auto_leads(id) on delete cascade,
  merchant_user_id uuid not null references auth.users(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  activity_type text not null default 'note' check (activity_type in ('note','assignment','follow_up','status')),
  note text,
  next_follow_up_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists merchant_auto_lead_activities_lead_created_idx
  on public.merchant_auto_lead_activities (lead_id, created_at desc);
alter table public.merchant_auto_lead_activities enable row level security;

drop policy if exists "auto lead activities merchant read 5.409" on public.merchant_auto_lead_activities;
create policy "auto lead activities merchant read 5.409"
  on public.merchant_auto_lead_activities for select to authenticated
  using (public.merchant_auto_can_manage(merchant_user_id));

create or replace function public.merchant_auto_update_lead_follow_up(
  p_lead_id uuid,
  p_status text default null,
  p_assigned_to uuid default null,
  p_set_assignee boolean default false,
  p_follow_up_at timestamptz default null,
  p_set_follow_up boolean default false,
  p_note text default null
)
returns public.merchant_auto_leads
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  lead_row public.merchant_auto_leads%rowtype;
  requested_status text := nullif(trim(coalesce(p_status,'')), '');
  before_status text;
  activity_kind text := 'note';
begin
  select * into lead_row from public.merchant_auto_leads where id = p_lead_id for update;
  if not found or not public.merchant_auto_can_manage(lead_row.merchant_user_id) then raise exception 'lead_permission_denied'; end if;
  if requested_status is not null and requested_status not in ('new','contacted','scheduled','arrived','reschedule_requested','cancelled','quoted','quote_accepted','quote_declined','closed','archived') then raise exception 'invalid_lead_status'; end if;
  if p_set_assignee and p_assigned_to is not null and p_assigned_to <> lead_row.merchant_user_id and not exists (select 1 from public.merchant_team_members member where member.merchant_user_id = lead_row.merchant_user_id and member.member_user_id = p_assigned_to and member.status = 'active') then raise exception 'assignee_not_in_team'; end if;
  before_status := lead_row.status;
  update public.merchant_auto_leads set status=coalesce(requested_status,status),assigned_to=case when p_set_assignee then p_assigned_to else assigned_to end,follow_up_at=case when p_set_follow_up then p_follow_up_at else follow_up_at end,last_contacted_at=case when nullif(trim(coalesce(p_note,'')), '') is not null then now() else last_contacted_at end,updated_at=now() where id=lead_row.id returning * into lead_row;
  if nullif(trim(coalesce(p_note,'')), '') is not null or p_set_assignee or p_set_follow_up or before_status is distinct from lead_row.status then
    if p_set_assignee then activity_kind := 'assignment'; elsif p_set_follow_up then activity_kind := 'follow_up'; elsif before_status is distinct from lead_row.status then activity_kind := 'status'; end if;
    insert into public.merchant_auto_lead_activities (lead_id,merchant_user_id,actor_user_id,activity_type,note,next_follow_up_at) values (lead_row.id,lead_row.merchant_user_id,auth.uid(),activity_kind,nullif(left(trim(coalesce(p_note,'')),1000),''),case when p_set_follow_up then p_follow_up_at else null end);
  end if;
  return lead_row;
end;
$$;

create or replace function public.merchant_auto_manager_list(p_merchant_user_id uuid)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if not public.merchant_auto_can_manage(p_merchant_user_id) then raise exception 'merchant_permission_denied'; end if;
  return jsonb_build_object(
    'listings',coalesce((select jsonb_agg(to_jsonb(a) order by a.updated_at desc) from public.merchant_auto_listings a where a.merchant_user_id=p_merchant_user_id),'[]'::jsonb),
    'leads',coalesce((select jsonb_agg(to_jsonb(l) order by case l.status when 'new' then 0 when 'arrived' then 1 when 'scheduled' then 2 else 3 end,l.follow_up_at asc nulls last,l.created_at desc) from public.merchant_auto_leads l where l.merchant_user_id=p_merchant_user_id),'[]'::jsonb),
    'sales',coalesce((select jsonb_agg(to_jsonb(s) order by s.completed_at desc) from public.merchant_auto_sales s where s.merchant_user_id=p_merchant_user_id),'[]'::jsonb),
    'team',coalesce((select jsonb_agg(jsonb_build_object('user_id',team.user_id,'name',team.name,'avatar',team.avatar,'role',team.role) order by case when team.user_id=p_merchant_user_id then 0 else 1 end,team.name) from (select owner.user_id,coalesce(nullif(owner.name,''),'店长') as name,owner.avatar,'店长' as role from public.profiles owner where owner.user_id=p_merchant_user_id union all select profile.user_id,coalesce(nullif(profile.name,''),'商家员工') as name,profile.avatar,case when 'manager'=any(coalesce(member.roles,array[]::text[])) then '经理' else coalesce(nullif(member.role,''),'员工') end as role from public.merchant_team_members member join public.profiles profile on profile.user_id=member.member_user_id where member.merchant_user_id=p_merchant_user_id and member.status='active') team),'[]'::jsonb),
    'activities',coalesce((select jsonb_agg(jsonb_build_object('id',activity.id,'lead_id',activity.lead_id,'activity_type',activity.activity_type,'note',activity.note,'next_follow_up_at',activity.next_follow_up_at,'created_at',activity.created_at,'actor_name',coalesce(nullif(profile.name,''),'商家团队')) order by activity.created_at desc) from public.merchant_auto_lead_activities activity left join public.profiles profile on profile.user_id=activity.actor_user_id where activity.merchant_user_id=p_merchant_user_id),'[]'::jsonb)
  );
end;
$$;

revoke all on function public.merchant_auto_update_lead_follow_up(uuid,text,uuid,boolean,timestamptz,boolean,text) from public;
revoke all on function public.merchant_auto_update_lead_follow_up(uuid,text,uuid,boolean,timestamptz,boolean,text) from anon;
grant execute on function public.merchant_auto_update_lead_follow_up(uuid,text,uuid,boolean,timestamptz,boolean,text) to authenticated;
revoke all on function public.merchant_auto_manager_list(uuid) from public;
grant execute on function public.merchant_auto_manager_list(uuid) to authenticated;
