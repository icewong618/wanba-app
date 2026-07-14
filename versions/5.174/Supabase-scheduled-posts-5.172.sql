-- 乐生活 v5.172：定时发布
-- 发布页按 America/Los_Angeles（洛杉矶）时间换算后写入 scheduled_at。
-- Cron 每分钟把到期的 scheduled 笔记转为公开笔记。

alter table public.posts
  add column if not exists scheduled_at timestamptz;

create index if not exists posts_scheduled_publish_at_idx
  on public.posts (scheduled_at asc, id asc)
  where visibility = 'scheduled' and scheduled_at is not null;

comment on column public.posts.scheduled_at is
  'UTC instant selected as America/Los_Angeles local time in the 乐生活 publisher.';

create extension if not exists pg_cron;

select cron.unschedule('publish-scheduled-posts-every-minute')
where exists (
  select 1
  from cron.job
  where jobname = 'publish-scheduled-posts-every-minute'
);

select cron.schedule(
  'publish-scheduled-posts-every-minute',
  '* * * * *',
  $$
    update public.posts
    set
      visibility = 'public',
      created_at = scheduled_at at time zone 'UTC',
      updated_at = timezone('utc', now())
    where visibility = 'scheduled'
      and scheduled_at is not null
      and scheduled_at <= now();
  $$
);
