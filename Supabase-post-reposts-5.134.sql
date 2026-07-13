-- 乐生活 5.134：站内转发笔记
-- 在 Supabase Dashboard -> SQL Editor 中完整运行一次。

alter table public.posts
  add column if not exists repost_post_id bigint references public.posts(id) on delete set null;

alter table public.posts
  add column if not exists repost_snapshot jsonb;

create index if not exists posts_repost_post_id_idx
  on public.posts (repost_post_id)
  where repost_post_id is not null;

comment on column public.posts.repost_post_id is '被转发的原笔记 ID；原帖删除后保留转发内容快照';
comment on column public.posts.repost_snapshot is '转发时保存的原帖标题、作者、封面与摘要，用于稳定展示引用卡片';
