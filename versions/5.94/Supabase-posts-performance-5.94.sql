-- 乐生活 5.94：首页帖子读取性能优化
-- 非破坏性：只新增索引与刷新统计信息，不修改帖子内容。

create index if not exists posts_home_created_at_id_idx
  on public.posts (created_at desc, id desc);

-- 隐私帖子读取规则会检查双方关注关系；此索引避免随着关注数据增长而反复全表扫描。
create index if not exists follows_active_pair_idx
  on public.follows (follower_id, followee_id)
  where active = true;

analyze public.posts;
analyze public.follows;
