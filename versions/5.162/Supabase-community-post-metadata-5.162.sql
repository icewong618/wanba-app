-- 乐生活 v5.162：社区二级分类的可选结构化信息
-- 二手交易、房屋出租、求职招聘使用；其余帖子保持为空。
alter table public.posts
  add column if not exists community_meta jsonb;

comment on column public.posts.community_meta is
  'Optional structured public fields for secondhand, rental, and job posts.';
