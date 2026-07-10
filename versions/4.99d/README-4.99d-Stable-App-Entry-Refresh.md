# 乐生活 v4.99d - App 稳定入口强刷新版

本版用于解决封装 App 长期停留在旧网页代码的问题。

## 更新内容

- 新增根目录 `app.html`，作为 App 封装专用稳定入口。
- App 以后建议固定打开：

```text
https://你的域名/app.html
```

- `app.html` 每次启动都会：
  - 清理 WebView 可访问的 Cache Storage。
  - 注销可能存在的 Service Worker。
  - 使用时间戳强制读取 `version.json`。
  - 自动跳转 `index.html?app_v=最新版本&refresh_t=时间戳`。
- 根目录 `version.json` 更新到 `4.99d`。
- 主页面继续保留版本检测作为第二层保护。

## 重要说明

如果当前 App 仍然打开旧的 `4.99a`，说明它没有打开最新根目录页面。需要把封装 App 的入口改成线上 `app.html`，这一步只需要做一次。以后网页更新不需要重新封装。

## 数据库

本版不需要执行新的 Supabase SQL。
