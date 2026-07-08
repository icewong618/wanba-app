-- 乐生活 4.10：管理员后台第一版
-- 执行位置：Supabase SQL Editor
-- 依赖：public.deal_admins 已存在，管理员账号已加入 deal_admins

create table if not exists public.admin_user_statuses (
  user_id uuid primary key references auth.users(id) on delete cascade,
  status text not null default 'banned',
  reason text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.admin_user_statuses enable row level security;

drop policy if exists "admin user statuses admins read 4.10" on public.admin_user_statuses;
create policy "admin user statuses admins read 4.10"
on public.admin_user_statuses
for select
to authenticated
using (
  exists (
    select 1 from public.deal_admins a
    where a.user_id = auth.uid()
  )
);

drop policy if exists "admin user statuses admins insert 4.10" on public.admin_user_statuses;
create policy "admin user statuses admins insert 4.10"
on public.admin_user_statuses
for insert
to authenticated
with check (
  exists (
    select 1 from public.deal_admins a
    where a.user_id = auth.uid()
  )
);

drop policy if exists "admin user statuses admins update 4.10" on public.admin_user_statuses;
create policy "admin user statuses admins update 4.10"
on public.admin_user_statuses
for update
to authenticated
using (
  exists (
    select 1 from public.deal_admins a
    where a.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.deal_admins a
    where a.user_id = auth.uid()
  )
);

drop policy if exists "admin user statuses admins delete 4.10" on public.admin_user_statuses;
create policy "admin user statuses admins delete 4.10"
on public.admin_user_statuses
for delete
to authenticated
using (
  exists (
    select 1 from public.deal_admins a
    where a.user_id = auth.uid()
  )
);

drop policy if exists "profiles admins read 4.10" on public.profiles;
create policy "profiles admins read 4.10"
on public.profiles
for select
to authenticated
using (
  exists (
    select 1 from public.deal_admins a
    where a.user_id = auth.uid()
  )
);

drop policy if exists "posts admins read 4.10" on public.posts;
create policy "posts admins read 4.10"
on public.posts
for select
to authenticated
using (
  exists (
    select 1 from public.deal_admins a
    where a.user_id = auth.uid()
  )
);

drop policy if exists "posts admins delete 4.10" on public.posts;
create policy "posts admins delete 4.10"
on public.posts
for delete
to authenticated
using (
  exists (
    select 1 from public.deal_admins a
    where a.user_id = auth.uid()
  )
);

drop policy if exists "comments admins read 4.10" on public.comments;
create policy "comments admins read 4.10"
on public.comments
for select
to authenticated
using (
  exists (
    select 1 from public.deal_admins a
    where a.user_id = auth.uid()
  )
);

drop policy if exists "comments admins delete 4.10" on public.comments;
create policy "comments admins delete 4.10"
on public.comments
for delete
to authenticated
using (
  exists (
    select 1 from public.deal_admins a
    where a.user_id = auth.uid()
  )
);

grant select, insert, update, delete on public.admin_user_statuses to authenticated;
grant select on public.profiles to authenticated;
grant select, delete on public.posts to authenticated;
grant select, delete on public.comments to authenticated;
