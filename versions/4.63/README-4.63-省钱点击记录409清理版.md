# 乐生活 v4.63 省钱点击记录 409 清理版

## 本版目标

清理“去核对 / 官网核对”点击后控制台出现 `deal_interactions 409 Conflict` 的问题。

## 原因

`deal_interactions.deal_id` 当前关联的是 `deals` 表 ID，但今日爆款和每日价格缓存使用的是价格缓存记录 ID。点击官网时把缓存 ID 写入 `deal_interactions`，会被数据库拒绝并返回 409。

## 已修复

- 今日爆款“去核对”不再向 `deal_interactions` 写入缓存 ID。
- 省钱列表“官网核对”不再向 `deal_interactions` 写入缓存 ID。
- 搜索结果“官网核对”不再向 `deal_interactions` 写入缓存 ID。
- 保留正常官网跳转，不影响用户打开商家页面。

## 数据库

本版不需要新增 SQL。后续如果要统计每日价格缓存点击量，建议单独建立 `deal_price_interactions` 或扩展 `deal_interactions` 支持缓存价格 ID。

## 推送文件

- `index.html`
- `.github/workflows/price-cache-sync.yml`
- `versions/4.63/`
