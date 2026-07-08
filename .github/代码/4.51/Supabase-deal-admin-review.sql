create table if not exists public.deal_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  note text,
  created_at timestamptz not null default now()
);

alter table public.deal_admins enable row level security;

drop policy if exists "deal admins self read" on public.deal_admins;
create policy "deal admins self read"
on public.deal_admins
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "deal reports admins read" on public.deal_reports;
create policy "deal reports admins read"
on public.deal_reports
for select
to authenticated
using (
  exists (
    select 1 from public.deal_admins a
    where a.user_id = auth.uid()
  )
);

drop policy if exists "deal reports admins update" on public.deal_reports;
create policy "deal reports admins update"
on public.deal_reports
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

drop policy if exists "deals admins insert" on public.deals;
create policy "deals admins insert"
on public.deals
for insert
to authenticated
with check (
  exists (
    select 1 from public.deal_admins a
    where a.user_id = auth.uid()
  )
);

grant select on public.deal_admins to authenticated;
grant select, update on public.deal_reports to authenticated;
grant insert on public.deals to authenticated;

-- 执行完上面的权限 SQL 后，再把 YOUR_USER_ID 换成你的 Supabase Auth user id 单独执行下面这一句。
-- insert into public.deal_admins (user_id, note)
-- values ('YOUR_USER_ID', '乐生活管理员')
-- on conflict (user_id) do update set note = excluded.note;
