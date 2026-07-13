# 乐生活 v5.149

公测数据备份准备版。

- 新增 GitHub Actions `Public Data Backup`。
- 可每周或手动导出 `public` 业务数据的结构与数据文件。
- 备份 Artifact 保留 14 天，不包含 Auth 密码、会话或令牌。
- 恢复流程要求先在测试库验证，避免直接覆盖线上数据。
