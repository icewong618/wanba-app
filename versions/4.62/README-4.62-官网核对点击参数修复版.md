# 乐生活 v4.62 官网核对点击参数修复版

## 本版目标

修复 v4.61 中“去核对 / 官网核对”点击仍无反应，并在控制台出现 `Unexpected end of input` 的问题。

## 原因

v4.61 为了安全传递 URL，使用了 JSON 双引号参数。但这些参数被放在 `onclick="..."` 这种双引号 HTML 属性内，浏览器会提前截断点击代码，导致按钮执行失败。

## 已修复

- 新增 `dealInlineArg()`，专门生成适合 `onclick="..."` 的单引号安全参数。
- `dealActionArg()` 和 `dealUrlArg()` 改用该安全参数。
- 保留 v4.61 的官网兜底链接逻辑。

## 数据库

本版不需要新增 SQL。

## 推送文件

- `index.html`
- `.github/workflows/price-cache-sync.yml`
- `versions/4.62/`
