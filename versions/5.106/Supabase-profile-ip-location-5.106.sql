-- 乐生活 5.106：公开用户主页展示 IP 属地（只保存城市／国家级文本，不保存 IP 地址）

alter table public.profiles
  add column if not exists ip_location text;
