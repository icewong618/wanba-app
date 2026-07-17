-- 乐生活 v5.247：商家高级功能开通状态
-- 每家商店独立保存已开通的功能，访客与店长读取同一份状态。

alter table public.merchants
  add column if not exists enabled_features jsonb not null default '[]'::jsonb;

create index if not exists merchants_enabled_features_gin
  on public.merchants using gin (enabled_features);
