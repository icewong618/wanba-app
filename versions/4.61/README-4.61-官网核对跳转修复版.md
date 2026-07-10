# 乐生活 v4.61 官网核对跳转修复版

## 本版目标

修复“今日爆款”下方 Best Buy / Walmart / ALDI / Target 点击“去核对”无法跳转，以及省钱列表“官网核对”部分场景无法打开的问题。

## 已修复

- 今日爆款按钮改为直接携带来源链接打开官网，不再依赖当前筛选/搜索状态反查优惠记录。
- 省钱列表的“官网核对”统一走同一个打开函数，先打开官网，再记录点击数据，避免记录接口失败影响跳转体验。
- 对官方优惠入口增加兜底链接：
  - Best Buy：Deal of the Day
  - Walmart：Flash Deals
  - ALDI：Weekly Ads
  - Target：Weekly Ad

## 数据库

本版不需要新增 SQL。

## 推送文件

- `index.html`
- `.github/workflows/price-cache-sync.yml`
- `versions/4.61/`
