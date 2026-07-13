# 乐生活公测数据备份与恢复 v5.149

## 备份范围

`Public Data Backup` 会导出 `public` schema 的结构与业务数据，包括笔记、资料、互动、商家、会员、优惠券、审核、举报与反馈。

认证系统的密码哈希、会话及令牌不会导出到 GitHub Artifact。请勿把 `service_role`、数据库密码或完整连接字符串放进代码、日志、截图或普通文本。

## 首次配置

在 GitHub 仓库：`Settings -> Secrets and variables -> Actions -> New repository secret`

- Name: `SUPABASE_DB_URL`
- Secret: Supabase Dashboard `Project Settings -> Database -> Connection string -> URI` 的完整 Postgres URI。

请使用可从 GitHub Actions 访问的连接 URI，并确保密码已正确 URL 编码。该 Secret 只用于备份工作流，绝不写入网页代码。

## 运行与保留

- 在 GitHub `Actions -> Public Data Backup -> Run workflow` 可立即备份。
- 工作流每周日 UTC 16:00 自动运行。
- 备份会以私有 Artifact 保存 14 天；下载位置在该次 Actions run 的 `Artifacts`。

## 恢复原则

1. 先下载最近 Artifact，并在独立测试数据库验证 `public-schema.sql` 与 `public-data.sql`。
2. 确认内容无误后，再安排维护窗口恢复生产数据库。
3. 恢复生产数据库属于破坏性操作，执行前必须再做一份当前备份；不要直接在不确认的情况下覆盖线上数据。
