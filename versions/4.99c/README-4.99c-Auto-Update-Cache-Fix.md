# 乐生活 v4.99c - App 自动更新缓存修复版

本版用于解决封装 App 后总是读取旧网页代码或旧缓存的问题。

## 更新内容

- 新增根目录 `version.json`，作为 App/网页的线上版本清单。
- 页面启动时优先读取 `version.json?t=当前时间`，绕开 WebView 和浏览器缓存。
- 如果发现 `version.json` 的版本号和当前页面版本不同：
  - 启动页显示正在更新。
  - 清理 Service Worker 注册。
  - 清理 Cache Storage。
  - 自动带 `app_v` 和时间戳重新打开当前页面。
- App 可以继续固定同一个线上入口地址，不需要每次更新后重新封装。
- 强化 HTML no-cache meta，降低 WebView 读取旧页面概率。

## 使用方式

App 入口继续使用固定线上地址，例如：

```text
https://你的域名/
```

以后每次网页更新，只要同步更新根目录 `version.json` 的版本号，App 打开时就会自动检测并刷新。

## 数据库

本版不需要执行新的 Supabase SQL。

