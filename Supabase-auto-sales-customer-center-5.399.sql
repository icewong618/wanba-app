-- 乐生活 v5.399：二手车客户中心。
-- 仅返回当前登录用户自己的收藏、卖车估价、试驾与车辆咨询记录。

create or replace function public.merchant_auto_customer_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'login_required';
  end if;

  return jsonb_build_object(
    'saved', coalesce((
      select jsonb_agg(jsonb_build_object(
        'listing_id', listing.id,
        'merchant_user_id', merchant.user_id,
        'merchant_name', merchant.business_name,
        'merchant_slug', merchant.slug,
        'title', listing.title,
        'make', listing.make,
        'model', listing.model,
        'year', listing.year,
        'price', listing.price,
        'mileage', listing.mileage,
        'vehicle_type', listing.vehicle_type,
        'fuel_type', listing.fuel_type,
        'transmission', listing.transmission,
        'photos', listing.photos,
        'status', listing.status,
        'saved_at', saved.created_at
      ) order by saved.created_at desc)
      from public.merchant_auto_saved_listings saved
      join public.merchant_auto_listings listing on listing.id = saved.listing_id
      join public.merchants merchant on merchant.user_id = saved.merchant_user_id
      where saved.user_id = current_user_id
    ), '[]'::jsonb),
    'leads', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', lead.id,
        'merchant_user_id', merchant.user_id,
        'merchant_name', merchant.business_name,
        'merchant_slug', merchant.slug,
        'lead_type', lead.lead_type,
        'status', lead.status,
        'created_at', lead.created_at,
        'vehicle_data', lead.vehicle_data,
        'photos', lead.photos,
        'quoted_amount', lead.quoted_amount,
        'quote_expires_at', lead.quote_expires_at,
        'quote_response', lead.quote_response,
        'quote_responded_at', lead.quote_responded_at,
        'merchant_note', lead.merchant_note,
        'listing_id', lead.listing_id,
        'listing_title', listing.title,
        'preferred_at', lead.preferred_at,
        'confirmed_at', lead.confirmed_at,
        'appointment_location', lead.appointment_location,
        'customer_action', lead.customer_action,
        'customer_action_note', lead.customer_action_note
      ) order by lead.created_at desc)
      from public.merchant_auto_leads lead
      join public.merchants merchant on merchant.user_id = lead.merchant_user_id
      left join public.merchant_auto_listings listing on listing.id = lead.listing_id
      where lead.user_id = current_user_id
    ), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.merchant_auto_customer_center() from anon, public;
grant execute on function public.merchant_auto_customer_center() to authenticated;
