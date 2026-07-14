alter table public.user_feed_preferences
  add column if not exists feed_interests jsonb not null default '[]'::jsonb,
  add column if not exists onboarding_completed_at timestamp with time zone;

comment on column public.user_feed_preferences.feed_interests is 'User-selected feed interest keys, synchronized across devices.';
comment on column public.user_feed_preferences.onboarding_completed_at is 'First feed-interest onboarding completion time.';
