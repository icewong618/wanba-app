-- 乐生活 v5.526：用户与认证商家的所在地和地区化微网站链接。
alter table public.profiles add column if not exists market_code text not null default 'la';
alter table public.merchants add column if not exists market_code text not null default 'la';

alter table public.profiles drop constraint if exists profiles_market_code_check;
alter table public.profiles add constraint profiles_market_code_check check (market_code in ('la','sgv','oc','ie','sd','sf','nyc','sea','other'));
alter table public.merchants drop constraint if exists merchants_market_code_check;
alter table public.merchants add constraint merchants_market_code_check check (market_code in ('la','sgv','oc','ie','sd','sf','nyc','sea','other'));

update public.profiles set market_code='la' where market_code is null or market_code='';
update public.merchants set market_code='la' where market_code is null or market_code='';

-- 同一地区内商家地址唯一；不同地区可使用同名地址。
alter table public.merchants drop constraint if exists merchants_slug_key;
drop index if exists public.merchants_slug_unique_idx;
create unique index if not exists merchants_market_slug_unique_idx on public.merchants (market_code, slug) where slug is not null;
create unique index if not exists merchants_market_business_name_unique_idx on public.merchants (market_code, lower(trim(business_name))) where business_name is not null;
