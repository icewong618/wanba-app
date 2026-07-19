-- v5.354：客户租车预约中心。已部署至 Supabase，此文件用于版本记录。

create or replace function public.merchant_rental_customer_bookings()
returns jsonb language sql stable security definer set search_path=public,pg_temp as $$
  select coalesce(jsonb_agg(to_jsonb(b) || jsonb_build_object(
    'vehicle',jsonb_build_object('id',v.id,'name',v.name,'make',v.make,'model',v.model,'year',v.year,'photos',v.photos,'pickup_address',v.pickup_address,'seats',v.seats,'transmission',v.transmission,'fuel_type',v.fuel_type),
    'merchant',jsonb_build_object('user_id',m.user_id,'business_name',m.business_name,'logo',m.logo,'address',m.address,'phone',m.phone,'slug',m.slug)
  ) order by b.starts_at desc),'[]'::jsonb)
  from public.merchant_rental_bookings b
  join public.merchant_rental_vehicles v on v.id=b.vehicle_id
  join public.merchants m on m.user_id=b.merchant_user_id
  where b.user_id=auth.uid();
$$;

create or replace function public.merchant_rental_customer_cancel_booking(p_booking_id uuid)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare booking public.merchant_rental_bookings%rowtype;
begin
  select * into booking from public.merchant_rental_bookings where id=p_booking_id for update;
  if not found or booking.user_id is distinct from auth.uid() then raise exception 'booking_not_found'; end if;
  if booking.status not in ('pending','confirmed') or booking.starts_at<=now() then raise exception 'booking_cannot_cancel'; end if;
  update public.merchant_rental_bookings set status='cancelled',updated_at=now(),operator_note=coalesce(operator_note,'客户已取消预约') where id=booking.id returning * into booking;
  return jsonb_build_object('id',booking.id,'booking_code',booking.booking_code,'status',booking.status);
end;
$$;

create or replace function public.merchant_rental_customer_update_booking(p_booking_id uuid,p_starts_at timestamptz,p_ends_at timestamptz,p_addon_ids jsonb,p_customer_name text,p_customer_phone text,p_customer_email text,p_note text)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare booking public.merchant_rental_bookings%rowtype; quote jsonb;
begin
  if length(trim(coalesce(p_customer_name,'')))<1 or length(trim(coalesce(p_customer_phone,'')))<4 then raise exception 'customer_contact_required'; end if;
  select * into booking from public.merchant_rental_bookings where id=p_booking_id for update;
  if not found or booking.user_id is distinct from auth.uid() then raise exception 'booking_not_found'; end if;
  if booking.status not in ('pending','confirmed') or booking.starts_at<=now() then raise exception 'booking_cannot_modify'; end if;
  update public.merchant_rental_bookings set status='cancelled' where id=booking.id;
  quote:=public.merchant_rental_quote(booking.vehicle_id,p_starts_at,p_ends_at,coalesce(p_addon_ids,'[]'::jsonb));
  update public.merchant_rental_bookings set customer_name=trim(p_customer_name),customer_phone=trim(p_customer_phone),customer_email=nullif(trim(coalesce(p_customer_email,'')),''),starts_at=p_starts_at,ends_at=p_ends_at,pricing_mode=quote->>'pricing_mode',unit_count=(quote->>'unit_count')::integer,base_amount=(quote->>'base_amount')::numeric,total_amount=(quote->>'total_amount')::numeric,deposit_amount=(quote->>'deposit_amount')::numeric,rental_addons=quote->'addons',status='pending',confirmed_at=null,operator_note=nullif(trim(coalesce(p_note,'')),''),updated_at=now() where id=booking.id returning * into booking;
  return jsonb_build_object('id',booking.id,'booking_code',booking.booking_code,'status',booking.status,'base_amount',booking.base_amount,'addon_amount',coalesce((quote->>'addon_amount')::numeric,0),'deposit_amount',booking.deposit_amount,'total_amount',booking.total_amount,'addons',booking.rental_addons);
end;
$$;

grant execute on function public.merchant_rental_customer_bookings() to authenticated;
grant execute on function public.merchant_rental_customer_cancel_booking(uuid) to authenticated;
grant execute on function public.merchant_rental_customer_update_booking(uuid,timestamptz,timestamptz,jsonb,text,text,text,text) to authenticated;
