-- 乐生活 v5.388：卖车估价必须提供完整 17 位 VIN。
-- 标准 VIN 排除 I、O、Q；完整 VIN 仅通过商家管理权限读取，不在公开车辆页展示。

create or replace function public.merchant_auto_create_sell_quote(
  p_merchant_user_id uuid,
  p_customer_name text,
  p_customer_phone text,
  p_customer_email text,
  p_message text,
  p_vehicle_data jsonb,
  p_photos jsonb default '[]'::jsonb
)
returns public.merchant_auto_leads
language plpgsql security definer set search_path=public,pg_temp as $$
declare row public.merchant_auto_leads%rowtype;
declare clean_vin text := upper(trim(coalesce(p_vehicle_data->>'vin','')));
begin
  if auth.uid() is null then raise exception 'login_required'; end if;
  if char_length(trim(coalesce(p_customer_name,''))) < 1 or char_length(trim(coalesce(p_customer_phone,''))) < 4 then
    raise exception 'customer_contact_required';
  end if;
  if clean_vin !~ '^[A-HJ-NPR-Z0-9]{17}$' then
    raise exception 'full_vin_required';
  end if;
  if char_length(trim(coalesce(p_vehicle_data->>'make',''))) < 1
     or char_length(trim(coalesce(p_vehicle_data->>'model',''))) < 1
     or nullif(p_vehicle_data->>'year','') is null
     or nullif(p_vehicle_data->>'mileage','') is null then
    raise exception 'vehicle_details_required';
  end if;
  p_vehicle_data := jsonb_set(p_vehicle_data,'{vin}',to_jsonb(clean_vin),true);
  insert into public.merchant_auto_leads(
    merchant_user_id,user_id,lead_type,customer_name,customer_phone,customer_email,message,vehicle_data,photos
  ) values (
    p_merchant_user_id,auth.uid(),'sell_quote',left(trim(p_customer_name),80),left(trim(p_customer_phone),40),
    nullif(left(trim(coalesce(p_customer_email,'')),120),''),nullif(left(trim(coalesce(p_message,'')),1500),''),
    p_vehicle_data,coalesce(p_photos,'[]'::jsonb)
  ) returning * into row;
  return row;
end;
$$;

revoke all on function public.merchant_auto_create_sell_quote(uuid,text,text,text,text,jsonb,jsonb) from public;
grant execute on function public.merchant_auto_create_sell_quote(uuid,text,text,text,text,jsonb,jsonb) to authenticated;
