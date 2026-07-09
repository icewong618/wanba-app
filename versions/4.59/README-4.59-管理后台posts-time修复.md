# 乐生活 4.59 管理后台 posts.time 修复

## 修复内容

修复管理后台 RPC 和回退查询报错：

`column "time" does not exist`

## 原因

当前 Supabase `posts` 表没有 `time` 字段，只有 `created_at`。4.58 的管理后台数据读取 SQL 和前端回退查询请求了 `posts.time`，导致：

- `admin_center_snapshot` RPC 返回 400
- 回退查询 `posts?select=...,time,...` 也返回 400
- 管理后台继续显示 0

## 本版方案

- SQL 中不再读取 `posts.time`
- 前端回退查询不再请求 `time`
- 管理后台显示时间统一使用 `created_at`

## 需要执行 SQL

请在 Supabase SQL Editor 执行：

`Supabase-admin-center-data-fix-4.59.sql`

## 验收

1. 启动页显示 `v4.59`
2. 管理后台不再出现 `column posts.time does not exist`
3. 注册用户、近期发帖、评论回复能显示真实数据
