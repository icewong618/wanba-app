# 乐生活 v4.99e - App 入口超时兜底修复版

本版修复封装 App 打开 `app.html` 后一直停留在欢迎页的问题。

## 更新内容

- `app.html` 新增硬超时兜底。
- 如果 App WebView 的 `fetch(version.json)` 或缓存清理 API 卡住，最多等待约 2 秒。
- 超时后直接进入 `index.html?app_v=4.99e&refresh_t=时间戳`。
- 缓存清理改为后台执行，不再阻塞进入首页。
- `version.json` 更新到 `4.99e`。

## App 入口

继续使用：

```text
https://escoopcity.com/app.html
```

## 数据库

本版不需要执行新的 Supabase SQL。

