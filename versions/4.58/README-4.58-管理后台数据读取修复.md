# 乐生活 4.58 管理后台数据读取修复

## 修复内容

修复管理后台进入后“注册用户、近期发帖、评论回复”全部显示 0 的问题。

## 原因

旧管理后台直接从前端读取：

- `profiles`
- `posts`
- `comments`
- `admin_user_statuses`

但真实注册账号在 Supabase 的 `auth.users`，普通前端 REST 不能直接读取。并且如果 RLS 策略不完整，帖子和评论也可能返回空数组。

## 本版方案

新增管理员专用 RPC：

`public.admin_center_snapshot()`

它会在数据库端确认当前用户属于 `deal_admins` 后，一次性返回：

- 真实注册用户：来自 `auth.users`，并合并 `profiles`
- 近期帖子：来自 `posts`
- 评论回复：来自 `comments`
- 封禁记录：来自 `admin_user_statuses`

前端优先调用这个 RPC；如果 RPC 不存在，会回退旧查询并在控制台提示。

## 需要执行 SQL

请在 Supabase SQL Editor 执行：

`Supabase-admin-center-data-fix-4.58.sql`

## 验收

1. 启动页显示 `v4.58`。
2. 管理员账号打开管理后台。
3. 注册用户数量应显示 auth 注册账号数量。
4. 近期发帖和评论回复应显示真实数据。
5. 如果没有执行 SQL，后台可能仍然显示 0 或回退旧查询。
