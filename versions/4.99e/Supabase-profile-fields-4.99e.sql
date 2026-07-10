alter table public.profiles
  add column if not exists bio text,
  add column if not exists tags text[] not null default '{}',
  add column if not exists gender text,
  add column if not exists birth text,
  add column if not exists cover text;

update public.profiles
set tags = '{}'
where tags is null;
