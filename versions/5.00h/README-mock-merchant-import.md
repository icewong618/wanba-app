# 5.00h 模拟商家批量导入说明

本版本新增脚本：

```bash
node scripts/import-mock-merchants.js --dry-run
```

真实导入前，需要在项目根目录创建 `.env.local`：

```bash
SUPABASE_URL=https://ptxdxepmggmjcndgukjk.supabase.co
SUPABASE_SERVICE_ROLE_KEY=替换成你的 service_role key
MOCK_MERCHANT_PASSWORD=CS130523
```

真实导入命令：

```bash
node scripts/import-mock-merchants.js
```

脚本会：

- 读取 `商家模拟资料/` 下所有 `store.json`
- 使用每个商家的邮箱创建 Supabase Auth 用户
- 统一初始密码：`CS130523`
- 自动确认邮箱
- 写入 `profiles`
- 写入/更新 `merchants`
- 统一设置为已认证商家
- 导入 logo、商品图片、商品、优惠券、会员权益

注意：`service_role key` 只能放在本地 `.env.local` 或 GitHub Secrets，不能写进 `index.html`。
