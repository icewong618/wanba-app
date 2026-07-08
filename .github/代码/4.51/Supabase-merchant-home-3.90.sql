-- 乐生活 3.90：商家主页真实内容支持
-- 用途：让通过审核的商家优惠可以归属到商家主页。

alter table public.deals
add column if not exists merchant_id uuid;

create index if not exists deals_merchant_id_idx
on public.deals (merchant_id, updated_at desc);

-- 如果你的 deals 表已经开启 RLS，确保公开页面可以读取优惠。
-- 已有同类 select policy 时，这段可重复执行。
drop policy if exists "deals public read 3.90" on public.deals;
create policy "deals public read 3.90"
on public.deals
for select
to anon, authenticated
using (true);
