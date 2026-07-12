-- 乐生活 5.96：商家门店定位与附近会员卡
-- 用户定位只在设备本地计算距离；数据库仅保存商家主动设置的公开门店坐标。

alter table public.merchants
  add column if not exists latitude numeric(9, 6),
  add column if not exists longitude numeric(9, 6),
  add column if not exists location_updated_at timestamp with time zone;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'merchants_latitude_range_check'
      and conrelid = 'public.merchants'::regclass
  ) then
    alter table public.merchants
      add constraint merchants_latitude_range_check
      check (latitude is null or latitude between -90 and 90);
  end if;
  if not exists (
    select 1 from pg_constraint
    where conname = 'merchants_longitude_range_check'
      and conrelid = 'public.merchants'::regclass
  ) then
    alter table public.merchants
      add constraint merchants_longitude_range_check
      check (longitude is null or longitude between -180 and 180);
  end if;
end $$;

create index if not exists merchants_verified_location_idx
  on public.merchants (verified, latitude, longitude)
  where latitude is not null and longitude is not null;

analyze public.merchants;
