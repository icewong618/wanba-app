create or replace function public.admin_center_snapshot()
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  result jsonb;
begin
  if not exists (
    select 1
    from public.deal_admins a
    where a.user_id = auth.uid()
  ) then
    raise exception 'not_admin' using errcode = '42501';
  end if;

  select jsonb_build_object(
    'users',
      coalesce((
        select jsonb_agg(to_jsonb(u) order by u.created_at desc)
        from (
          select
            au.id::text as user_id,
            au.email,
            coalesce(
              nullif(p.name, ''),
              nullif(au.raw_user_meta_data->>'name', ''),
              nullif(au.raw_user_meta_data->>'full_name', ''),
              nullif(split_part(coalesce(au.email, ''), '@', 1), ''),
              '未命名用户'
            ) as name,
            p.avatar,
            au.created_at,
            au.last_sign_in_at,
            coalesce(p.updated_at, au.updated_at, au.created_at) as updated_at
          from auth.users au
          left join public.profiles p on p.user_id = au.id
          order by au.created_at desc
          limit 200
        ) u
      ), '[]'::jsonb),
    'posts',
      coalesce((
        select jsonb_agg(to_jsonb(p) order by p.created_at desc)
        from (
          select
            id,
            user_id,
            author,
            title,
            content,
            category,
            created_at,
            time,
            likes
          from public.posts
          order by created_at desc nulls last
          limit 120
        ) p
      ), '[]'::jsonb),
    'comments',
      coalesce((
        select jsonb_agg(to_jsonb(c) order by c.created_at desc)
        from (
          select
            id,
            post_id,
            user_id,
            name,
            text,
            created_at,
            parent_id,
            reply_to_name
          from public.comments
          order by created_at desc nulls last
          limit 200
        ) c
      ), '[]'::jsonb),
    'banned',
      coalesce((
        select jsonb_agg(to_jsonb(b) order by b.created_at desc)
        from (
          select
            user_id,
            status,
            reason,
            created_at,
            created_by
          from public.admin_user_statuses
          order by created_at desc
          limit 200
        ) b
      ), '[]'::jsonb)
  ) into result;

  return result;
end;
$$;

revoke all on function public.admin_center_snapshot() from public;
grant execute on function public.admin_center_snapshot() to authenticated;

insert into public.deal_price_refresh_runs (
  trigger_type,
  status,
  checked_count,
  success_count,
  failed_count,
  skipped_count,
  error_message,
  finished_at
) values (
  'schema_upgrade',
  'success',
  0,
  0,
  0,
  0,
  '4.58 admin center snapshot RPC enabled. Admin page can read auth.users, posts, comments and ban records through one secure function.',
  now()
);
