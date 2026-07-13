-- 乐生活 v5.154：公测反馈回复闭环
-- 管理员可向反馈提交者写入处理说明；原有 RLS 已限定为提交者本人和管理员可查看。

alter table public.user_feedback
  add column if not exists admin_reply text,
  add column if not exists replied_at timestamptz;

alter table public.user_feedback
  drop constraint if exists user_feedback_admin_reply_length_check;

alter table public.user_feedback
  add constraint user_feedback_admin_reply_length_check
  check (admin_reply is null or char_length(admin_reply) between 1 and 1000);
