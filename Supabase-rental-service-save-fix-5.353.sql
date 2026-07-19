-- v5.353: 修复租车车辆勾选增值服务/保险服务时的保存错误。
-- 已部署至 Supabase，仅保留此文件作版本记录。

create or replace function public.merchant_rental_save_vehicle_services(
  p_vehicle_id uuid,
  p_addon_service_ids jsonb default '[]'::jsonb,
  p_insurance_service_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  merchant_id uuid;
  selected_ids uuid[] := array[]::uuid[];
begin
  select v.merchant_user_id into merchant_id
  from public.merchant_rental_vehicles v
  where v.id = p_vehicle_id;

  if merchant_id is null or not public.merchant_rental_can_manage(merchant_id) then
    raise exception 'rental_not_allowed';
  end if;

  select coalesce(array_agg(source.service_id), array[]::uuid[]) into selected_ids
  from jsonb_array_elements_text(coalesce(p_addon_service_ids, '[]'::jsonb)) as raw(value)
  cross join lateral (select raw.value::uuid as service_id) as source;

  if p_insurance_service_id is not null then
    selected_ids := array_append(selected_ids, p_insurance_service_id);
  end if;

  if exists (
    select 1
    from unnest(selected_ids) as selected(service_id)
    left join public.merchant_rental_services s
      on s.id = selected.service_id
      and s.merchant_user_id = merchant_id
      and s.is_active = true
    where s.id is null
  ) then
    raise exception 'invalid_service';
  end if;

  delete from public.merchant_rental_vehicle_services where vehicle_id = p_vehicle_id;
  insert into public.merchant_rental_vehicle_services(vehicle_id, service_id)
  select p_vehicle_id, selected.service_id
  from unnest(selected_ids) as selected(service_id)
  on conflict do nothing;

  return jsonb_build_object(
    'addon_service_ids', coalesce((
      select jsonb_agg(s.id)
      from public.merchant_rental_services s
      join public.merchant_rental_vehicle_services vs on vs.service_id = s.id
      where vs.vehicle_id = p_vehicle_id and s.service_type = 'addon'
    ), '[]'::jsonb),
    'insurance_service_id', (
      select s.id
      from public.merchant_rental_services s
      join public.merchant_rental_vehicle_services vs on vs.service_id = s.id
      where vs.vehicle_id = p_vehicle_id and s.service_type = 'insurance'
      limit 1
    )
  );
end;
$$;

grant execute on function public.merchant_rental_save_vehicle_services(uuid, jsonb, uuid) to authenticated;
