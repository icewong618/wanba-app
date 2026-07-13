create table if not exists public.user_feed_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  muted_categories jsonb not null default '[]'::jsonb,
  updated_at timestamp with time zone not null default timezone('utc'::text, now())
);

alter table public.user_feed_preferences enable row level security;

grant select, insert, update on public.user_feed_preferences to authenticated;

drop policy if exists "feed_preferences_select_own" on public.user_feed_preferences;
create policy "feed_preferences_select_own" on public.user_feed_preferences
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "feed_preferences_insert_own" on public.user_feed_preferences;
create policy "feed_preferences_insert_own" on public.user_feed_preferences
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "feed_preferences_update_own" on public.user_feed_preferences;
create policy "feed_preferences_update_own" on public.user_feed_preferences
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
