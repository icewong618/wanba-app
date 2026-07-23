-- 乐生活 v5.581：活动报名表的显式直接访问拒绝策略。
-- 页面只通过受控 RPC 读取和写入，避免把参与者电话资料暴露给 Data API。

create policy "merchant_events_no_direct_access"
on public.merchant_events as restrictive for all to anon, authenticated
using (false) with check (false);

create policy "merchant_event_registrations_no_direct_access"
on public.merchant_event_registrations as restrictive for all to anon, authenticated
using (false) with check (false);
