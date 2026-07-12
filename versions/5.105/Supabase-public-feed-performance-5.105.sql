-- 乐生活 5.105：公开首页信息流性能索引
-- 与前端的 visibility=public / null 查询对应，避免公开首页读取时扫描非公开帖子。

create index if not exists posts_public_feed_created_at_id_idx
  on public.posts (created_at desc, id desc)
  where visibility = 'public' or visibility is null;

analyze public.posts;
