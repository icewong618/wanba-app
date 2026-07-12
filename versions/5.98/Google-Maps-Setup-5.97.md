# Google Maps 地址定位配置（5.97）

## 需要创建的密钥

1. 打开 Google Cloud Console，选择或新建一个项目。
2. 启用 Billing，然后在 API Library 启用 **Geocoding API**。
3. 在 Credentials 创建 API key。
4. 在 API restrictions 中只允许 **Geocoding API**。
5. 在 Quotas 中给 Geocoding 设置每日上限，建议先设为 **100 requests/day**。

## 写入 Supabase 密钥

在已链接此 Supabase 项目的终端运行：

```bash
supabase secrets set GOOGLE_MAPS_API_KEY=你的_Google_Maps_API_Key
```

密钥不会写入网页、GitHub 或数据库，只由 `merchant-geocode` Edge Function 使用。

## 测试

使用已认证商家账号：编辑商家资料 -> 输入完整美国地址 -> 查找位置 -> 选择候选地址 -> 保存。
