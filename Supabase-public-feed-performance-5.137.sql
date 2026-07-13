-- 5.137：公开信息流读取稳定性优化。
-- 不删除或修改任何帖子数据。

create index if not exists follows_active_followee_follower_idx
  on public.follows (followee_id, follower_id)
  where active = true;

alter policy "visibility read" on public.posts
using (
  visibility = 'public'
  or visibility is null
  or user_id = (select auth.uid())
  or (
    visibility = 'mutual'
    and exists (
      select 1 from public.follows f1
      where f1.follower_id = (select auth.uid())
        and f1.followee_id = posts.user_id
        and f1.active = true
    )
    and exists (
      select 1 from public.follows f2
      where f2.follower_id = posts.user_id
        and f2.followee_id = (select auth.uid())
        and f2.active = true
    )
  )
);
