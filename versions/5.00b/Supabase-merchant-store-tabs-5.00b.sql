alter table public.merchants add column if not exists slug text;
alter table public.merchants add column if not exists intro text;
alter table public.merchants add column if not exists business_hours text;
alter table public.merchants add column if not exists website_url text;
alter table public.merchants add column if not exists external_links jsonb default '[]'::jsonb;
alter table public.merchants add column if not exists microsite_enabled boolean default true;
alter table public.merchants add column if not exists microsite_title text;
alter table public.merchants add column if not exists seo_description text;
alter table public.merchants add column if not exists products jsonb default '[]'::jsonb;
alter table public.merchants add column if not exists coupons jsonb default '[]'::jsonb;

update public.merchants
set slug = lower(regexp_replace(regexp_replace(coalesce(slug, business_name, 'merchant') || '-' || substr(user_id::text, 1, 8), '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g'))
where slug is null or slug = '';

update public.merchants
set slug = 'merchant-' || substr(user_id::text, 1, 8)
where slug is null or slug = '';

with ranked as (
  select ctid, slug, user_id, row_number() over (partition by slug order by updated_at desc nulls last, created_at desc nulls last, user_id) as rn
  from public.merchants
  where slug is not null and slug <> ''
)
update public.merchants m
set slug = ranked.slug || '-' || substr(ranked.user_id::text, 1, 8)
from ranked
where m.ctid = ranked.ctid and ranked.rn > 1;

create unique index if not exists merchants_slug_unique_idx
on public.merchants (slug)
where slug is not null and slug <> '';

create index if not exists merchants_verified_slug_idx
on public.merchants (verified, slug);

grant select on public.merchants to anon, authenticated;
grant update (
  slug,
  intro,
  business_hours,
  website_url,
  external_links,
  microsite_enabled,
  microsite_title,
  seo_description,
  business_name,
  category,
  subcategory,
  address,
  phone,
  perks,
  loyalty_target,
  loyalty_reward,
  logo,
  cover_image,
  products,
  coupons,
  updated_at
) on public.merchants to authenticated;
