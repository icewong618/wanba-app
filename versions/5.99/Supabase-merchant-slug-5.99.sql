-- 乐生活 5.99：商家微网站根路径、唯一链接及 365 天修改限制

alter table public.merchants
  add column if not exists slug_changed_at timestamptz;

alter table public.merchants
  drop constraint if exists merchants_slug_format_5_99;

alter table public.merchants
  add constraint merchants_slug_format_5_99
  check (
    slug is null
    or (
      char_length(slug) between 3 and 48
      and slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    )
  );

create or replace function public.enforce_merchant_slug_change_cooldown()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  reserved_slugs text[] := array[
    'm','app','api','admin','index','index-html','app-html','404','404-html','version-json',
    'versions','assets','favicon','favicon-ico','robots-txt','sitemap-xml','supabase','auth',
    'login','search','home','week','deals','message','profile','merchant','merchants'
  ];
begin
  if tg_op = 'INSERT' then
    -- 新建商家先拥有一次自定义链接机会，不接受客户端伪造的修改时间。
    new.slug_changed_at := null;
    return new;
  end if;

  if new.slug is not distinct from old.slug then
    -- 资料更新不能重置或篡改链接修改时间。
    new.slug_changed_at := old.slug_changed_at;
    return new;
  end if;

  if new.slug is null
    or char_length(new.slug) not between 3 and 48
    or new.slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then
    raise exception 'merchant_slug_invalid' using errcode = '22023';
  end if;

  if new.slug = any(reserved_slugs) then
    raise exception 'merchant_slug_reserved' using errcode = '22023';
  end if;

  if old.slug_changed_at is not null
    and old.slug_changed_at > now() - interval '365 days' then
    raise exception 'merchant_slug_change_cooldown' using errcode = '23514';
  end if;

  new.slug_changed_at := now();
  return new;
end;
$$;

drop trigger if exists merchants_slug_change_cooldown_5_99 on public.merchants;
create trigger merchants_slug_change_cooldown_5_99
before insert or update of slug on public.merchants
for each row
execute function public.enforce_merchant_slug_change_cooldown();

revoke all on function public.enforce_merchant_slug_change_cooldown() from public;
