# 乐生活 v5.150

公测数据备份兼容修复版。

- 自动备份改用 PostgreSQL 17 官方客户端，匹配当前 Supabase 数据库版本。
- 保持每周及手动备份 `public` schema 的结构与业务数据。
- 备份仍不包含 Auth 密码、会话、令牌或 Storage 文件。
