-- 乐生活 5.220：R2 原图与首页缩略图
-- 新字段仅保存 URL，不保存 Base64；执行后旧内容不受影响。

alter table public.posts
  add column if not exists image_thumbnail text,
  add column if not exists image_thumbnails jsonb;

comment on column public.posts.image_thumbnail is '480px 首页封面缩略图 URL';
comment on column public.posts.image_thumbnails is '与 images 对应的缩略图 URL 数组';
