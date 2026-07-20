-- 乐生活 5.362：租车维修 / 清洁任务单与车辆日历排期

create table if not exists public.merchant_rental_vehicle_tasks (
  id uuid primary key default gen_random_uuid(),
  merchant_user_id uuid not null references auth.users(id) on delete cascade,
  vehicle_id uuid not null references public.merchant_rental_vehicles(id) on delete cascade,
  task_type text not null check (task_type in ('cleaning','maintenance')),
  status text not null default 'open' check (status in ('open','in_progress','completed','cancelled')),
  title text not null check (char_length(title) between 1 and 100),
  assignee_name text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  note text,
  blackout_id uuid references public.merchant_rental_blackouts(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create index if not exists merchant_rental_vehicle_tasks_merchant_dates_idx
  on public.merchant_rental_vehicle_tasks (merchant_user_id, starts_at, ends_at);
create index if not exists merchant_rental_vehicle_tasks_vehicle_status_idx
  on public.merchant_rental_vehicle_tasks (vehicle_id, status, starts_at);

alter table public.merchant_rental_vehicle_tasks enable row level security;
revoke all on public.merchant_rental_vehicle_tasks from anon, authenticated;

create or replace function public.merchant_rental_manager_save_vehicle_task(p_task jsonb)
returns public.merchant_rental_vehicle_tasks
language plpgsql security definer set search_path=public,pg_temp as $$
declare
  task_row public.merchant_rental_vehicle_tasks%rowtype;
  vehicle_row public.merchant_rental_vehicles%rowtype;
  task_id uuid := nullif(coalesce(p_task->>'id',''),'')::uuid;
  task_type_value text := coalesce(nullif(trim(coalesce(p_task->>'task_type','')),''),'cleaning');
  task_status text := coalesce(nullif(trim(coalesce(p_task->>'status','')),''),'open');
  starts_value timestamptz := nullif(coalesce(p_task->>'starts_at',''),'')::timestamptz;
  ends_value timestamptz := nullif(coalesce(p_task->>'ends_at',''),'')::timestamptz;
  title_value text := nullif(left(trim(coalesce(p_task->>'title','')),100),'');
  blackout_value uuid;
begin
  if task_type_value not in ('cleaning','maintenance') then raise exception 'invalid_task_type'; end if;
  if task_status not in ('open','in_progress','completed','cancelled') then raise exception 'invalid_task_status'; end if;
  if starts_value is null or ends_value is null or ends_value <= starts_value then raise exception 'invalid_task_time'; end if;
  if title_value is null then title_value := case when task_type_value='cleaning' then '车辆清洁' else '车辆维修' end; end if;

  if task_id is not null then
    select * into task_row from public.merchant_rental_vehicle_tasks where id=task_id for update;
    if not found or not public.merchant_rental_can_manage(task_row.merchant_user_id) then raise exception 'rental_not_allowed'; end if;
    select * into vehicle_row from public.merchant_rental_vehicles where id=task_row.vehicle_id for update;
    if not found then raise exception 'vehicle_not_found'; end if;

    if task_status in ('open','in_progress') then
      if task_row.blackout_id is null then
        insert into public.merchant_rental_blackouts(vehicle_id,starts_at,ends_at,reason)
        values(vehicle_row.id,starts_value,ends_value,left('任务：' || title_value,240)) returning id into blackout_value;
      else
        update public.merchant_rental_blackouts set starts_at=starts_value,ends_at=ends_value,reason=left('任务：' || title_value,240)
        where id=task_row.blackout_id;
        blackout_value := task_row.blackout_id;
      end if;
    else
      if task_row.blackout_id is not null then delete from public.merchant_rental_blackouts where id=task_row.blackout_id; end if;
      blackout_value := null;
    end if;

    update public.merchant_rental_vehicle_tasks set
      task_type=task_type_value,status=task_status,title=title_value,
      assignee_name=nullif(left(trim(coalesce(p_task->>'assignee_name','')),80),''),
      starts_at=starts_value,ends_at=ends_value,note=nullif(left(trim(coalesce(p_task->>'note','')),1000),''),
      blackout_id=blackout_value,completed_at=case when task_status='completed' then coalesce(completed_at,now()) else null end,
      updated_at=now()
    where id=task_row.id returning * into task_row;
  else
    select * into vehicle_row from public.merchant_rental_vehicles
    where id=nullif(coalesce(p_task->>'vehicle_id',''),'')::uuid for update;
    if not found or not public.merchant_rental_can_manage(vehicle_row.merchant_user_id) then raise exception 'rental_not_allowed'; end if;
    if task_status in ('open','in_progress') then
      insert into public.merchant_rental_blackouts(vehicle_id,starts_at,ends_at,reason)
      values(vehicle_row.id,starts_value,ends_value,left('任务：' || title_value,240)) returning id into blackout_value;
    end if;
    insert into public.merchant_rental_vehicle_tasks(
      merchant_user_id,vehicle_id,task_type,status,title,assignee_name,starts_at,ends_at,note,blackout_id,created_by,completed_at
    ) values (
      vehicle_row.merchant_user_id,vehicle_row.id,task_type_value,task_status,title_value,
      nullif(left(trim(coalesce(p_task->>'assignee_name','')),80),''),starts_value,ends_value,
      nullif(left(trim(coalesce(p_task->>'note','')),1000),''),blackout_value,auth.uid(),case when task_status='completed' then now() else null end
    ) returning * into task_row;
  end if;
  return task_row;
end;
$$;

create or replace function public.merchant_rental_manager_set_vehicle_status(p_vehicle_id uuid, p_status text)
returns public.merchant_rental_vehicles language plpgsql security definer set search_path=public,pg_temp as $$
declare row public.merchant_rental_vehicles%rowtype;
begin
  if p_status not in ('available','cleaning','maintenance','inactive') then raise exception 'invalid_vehicle_status'; end if;
  select * into row from public.merchant_rental_vehicles where id=p_vehicle_id for update;
  if not found or not public.merchant_rental_can_manage(row.merchant_user_id) then raise exception 'rental_not_allowed'; end if;
  if exists(select 1 from public.merchant_rental_bookings b where b.vehicle_id=row.id and b.status in ('active','overdue')) then raise exception 'vehicle_currently_rented'; end if;
  if p_status='available' and exists(select 1 from public.merchant_rental_vehicle_tasks t where t.vehicle_id=row.id and t.status in ('open','in_progress')) then raise exception 'vehicle_has_open_tasks'; end if;
  update public.merchant_rental_vehicles set status=p_status,updated_at=now() where id=row.id returning * into row;
  return row;
end;
$$;

create or replace function public.merchant_rental_manager_list(p_merchant_user_id uuid)
returns jsonb language sql stable security definer set search_path=public,pg_temp as $$
  with managed as (select public.merchant_rental_can_manage(p_merchant_user_id) as allowed),
  vehicle_rows as (
    select to_jsonb(v) || jsonb_build_object(
      'addons',coalesce((select jsonb_agg(to_jsonb(s)) from public.merchant_rental_vehicle_services vs join public.merchant_rental_services s on s.id=vs.service_id where vs.vehicle_id=v.id),'[]'::jsonb),
      'luggage_count',coalesce(extra.luggage_count,2),
      'active_booking',coalesce((select jsonb_build_object('id',b.id,'booking_code',b.booking_code,'customer_name',b.customer_name,'starts_at',b.starts_at,'ends_at',b.ends_at,'status',b.status) from public.merchant_rental_bookings b where b.vehicle_id=v.id and b.status in ('active','overdue') order by b.starts_at asc limit 1),'null'::jsonb),
      'next_booking',coalesce((select jsonb_build_object('id',b.id,'booking_code',b.booking_code,'customer_name',b.customer_name,'starts_at',b.starts_at,'ends_at',b.ends_at,'status',b.status) from public.merchant_rental_bookings b where b.vehicle_id=v.id and b.status in ('pending','confirmed') and b.ends_at>=now() order by b.starts_at asc limit 1),'null'::jsonb)
    ) as row from public.merchant_rental_vehicles v left join public.merchant_rental_vehicle_addons extra on extra.vehicle_id=v.id where v.merchant_user_id=p_merchant_user_id
  )
  select jsonb_build_object(
    'vehicles',coalesce((select jsonb_agg(row order by coalesce(row->>'updated_at','') desc) from vehicle_rows),'[]'::jsonb),
    'services',coalesce((select jsonb_agg(to_jsonb(s) order by s.service_type,s.updated_at desc) from public.merchant_rental_services s where s.merchant_user_id=p_merchant_user_id),'[]'::jsonb),
    'bookings',coalesce((select jsonb_agg(to_jsonb(b) || jsonb_build_object('vehicle',jsonb_build_object('id',v.id,'name',v.name,'make',v.make,'model',v.model,'year',v.year,'photos',v.photos,'pickup_address',v.pickup_address),'customer',jsonb_build_object('name',coalesce(p.name,b.customer_name),'avatar',p.avatar),'handover',coalesce(to_jsonb(h),'null'::jsonb)) order by case when b.status='pending' then 0 when b.status='confirmed' then 1 when b.status in ('active','overdue') then 2 else 3 end,b.starts_at asc) from public.merchant_rental_bookings b join public.merchant_rental_vehicles v on v.id=b.vehicle_id left join public.profiles p on p.user_id=b.user_id left join public.merchant_rental_handover_records h on h.booking_id=b.id where b.merchant_user_id=p_merchant_user_id),'[]'::jsonb),
    'tasks',coalesce((select jsonb_agg(to_jsonb(t) || jsonb_build_object('vehicle',jsonb_build_object('id',v.id,'name',v.name,'make',v.make,'model',v.model,'photos',v.photos)) order by case when t.status in ('open','in_progress') then 0 else 1 end,t.starts_at asc) from public.merchant_rental_vehicle_tasks t join public.merchant_rental_vehicles v on v.id=t.vehicle_id where t.merchant_user_id=p_merchant_user_id),'[]'::jsonb),
    'blackouts',coalesce((select jsonb_agg(to_jsonb(x) || jsonb_build_object('vehicle_name',v.name) order by x.starts_at asc) from public.merchant_rental_blackouts x join public.merchant_rental_vehicles v on v.id=x.vehicle_id where v.merchant_user_id=p_merchant_user_id),'[]'::jsonb),
    'stats',coalesce((select jsonb_build_object('pending_count',count(*) filter(where status='pending'),'confirmed_count',count(*) filter(where status='confirmed'),'active_count',count(*) filter(where status in ('active','overdue')),'completed_count',count(*) filter(where status='returned'),'booking_total',coalesce(sum(total_amount) filter(where status not in ('cancelled','rejected')),0),'paid_total',coalesce(sum(total_amount) filter(where payment_status='paid'),0),'discount_total',coalesce(sum(member_discount_amount+coupon_discount_amount),0),'damage_total',coalesce(sum(damage_amount),0),'violation_total',coalesce(sum(violation_amount),0)) from public.merchant_rental_bookings where merchant_user_id=p_merchant_user_id),'{}'::jsonb),
    'fleet_stats',coalesce((select jsonb_build_object('total_count',count(*),'available_count',count(*) filter(where v.status='available' and not exists(select 1 from public.merchant_rental_bookings b where b.vehicle_id=v.id and b.status in ('active','overdue'))),'rented_count',count(*) filter(where exists(select 1 from public.merchant_rental_bookings b where b.vehicle_id=v.id and b.status in ('active','overdue'))),'cleaning_count',count(*) filter(where v.status='cleaning'),'maintenance_count',count(*) filter(where v.status='maintenance'),'inactive_count',count(*) filter(where v.status='inactive')) from public.merchant_rental_vehicles v where v.merchant_user_id=p_merchant_user_id),'{}'::jsonb)
  ) from managed where allowed;
$$;

grant execute on function public.merchant_rental_manager_save_vehicle_task(jsonb) to authenticated;
grant execute on function public.merchant_rental_manager_set_vehicle_status(uuid,text) to authenticated;
grant execute on function public.merchant_rental_manager_list(uuid) to authenticated;
