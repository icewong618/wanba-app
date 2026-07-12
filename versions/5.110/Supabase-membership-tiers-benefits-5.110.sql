-- 乐生活 5.110：商家会员积分、等级与生日权益配置

alter table public.merchants
  add column if not exists points_per_visit integer not null default 1
    check (points_per_visit >= 0 and points_per_visit <= 1000),
  add column if not exists membership_tiers jsonb not null default '{"silver":100,"gold":300,"black":600}'::jsonb,
  add column if not exists birthday_reward text;
