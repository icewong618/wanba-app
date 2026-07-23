-- v5.540: only allow R2 deletion after the URL is no longer referenced by public data.
-- The browser calls this before asking the media worker to remove an object.

create or replace function public.media_asset_is_releasable(p_url text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_owner_id text;
begin
  if v_user_id is null then
    raise exception 'authentication_required';
  end if;

  if p_url is null or p_url !~ '^https://media\\.escoopcity\\.com/(posts|avatars|covers|merchant-logos|merchant-covers|text-covers|coupons|products)/[0-9a-fA-F-]{36}/' then
    return false;
  end if;

  v_owner_id := split_part(regexp_replace(p_url, '^https://media\\.escoopcity\\.com/', ''), '/', 2);
  if v_owner_id <> v_user_id::text then
    return false;
  end if;

  -- Account and merchant identity.
  if exists (select 1 from public.profiles where avatar = p_url or cover = p_url) then return false; end if;
  if exists (select 1 from public.merchants where logo = p_url or cover_image = p_url or products::text like '%' || p_url || '%' or coupons::text like '%' || p_url || '%') then return false; end if;
  if exists (select 1 from public.personal_shops where cover_image = p_url) then return false; end if;
  if exists (select 1 from public.personal_shop_products where images::text like '%' || p_url || '%') then return false; end if;

  -- Community content and records users may revisit later.
  if exists (select 1 from public.posts where image = p_url or image_thumbnail = p_url or images::text like '%' || p_url || '%' or image_thumbnails::text like '%' || p_url || '%' or repost_snapshot::text like '%' || p_url || '%') then return false; end if;
  if exists (select 1 from public.merchant_memberships where user_avatar = p_url) then return false; end if;
  if exists (select 1 from public.merchant_coupon_claims where coupon_snapshot::text like '%' || p_url || '%') then return false; end if;
  if exists (select 1 from public.merchant_order_items where product_image = p_url) then return false; end if;

  -- Vehicle listings, customer evidence, and handover records.
  if exists (select 1 from public.merchant_auto_listings where photos::text like '%' || p_url || '%') then return false; end if;
  if exists (select 1 from public.merchant_auto_leads where photos::text like '%' || p_url || '%') then return false; end if;
  if exists (select 1 from public.merchant_rental_vehicles where photos::text like '%' || p_url || '%') then return false; end if;
  if exists (select 1 from public.merchant_rental_bookings where pickup_photos::text like '%' || p_url || '%' or return_photos::text like '%' || p_url || '%') then return false; end if;
  if exists (select 1 from public.merchant_rental_handover_records where checkout_photos::text like '%' || p_url || '%' or return_photos::text like '%' || p_url || '%') then return false; end if;

  return true;
end;
$$;

revoke all on function public.media_asset_is_releasable(text) from public, anon;
grant execute on function public.media_asset_is_releasable(text) to authenticated;
