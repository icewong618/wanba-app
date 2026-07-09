# 乐生活 4.55 官方优惠来源分层

## 本版目标

4.55 将省钱栏目拆成三类来源，避免把搜索页或分类页里的价格误当成具体商品价格。

## 来源规则

1. 固定食品 / 日用品价格
   - 使用具体商品页。
   - 每天刷新一次。
   - 适合牛奶、大米、牛排、鸡蛋等刚需比价。

2. 官方周优惠
   - Target 使用 `https://www.target.com/weekly-ad?promo`。
   - ALDI 使用 `https://info.aldi.us/weekly-specials/weekly-ads`。
   - 每周刷新一次。
   - 没抓到具体商品名和价格时，只展示官方周广告入口。

3. 官方限时优惠
   - Walmart 使用 `https://www.walmart.com/shop/deals/flash-deals`。
   - Best Buy 使用 `https://www.bestbuy.com/site/misc/deal-of-the-day/pcmcat248000050016.c?id=pcmcat248000050016`。
   - 每天刷新一次。
   - 用于发现优惠入口，不再把关键词搜索结果当成具体商品价。

## 数据库升级

请在 Supabase SQL Editor 执行：

`Supabase-official-deal-sources-4.55.sql`

该 SQL 会：

- 新增 `weekly_ad_page`、`daily_deals_page`、`fixed_product_page` 来源类型。
- 新增 Best Buy 今日特惠、Walmart 限时优惠、ALDI 周广告、Target 周广告。
- 新增 Walmart 牛奶、Walmart 大米、Costco 牛排三个固定商品页。
- 停用旧关键词搜索来源，避免旧缓存继续显示不可靠价格。

## GitHub Actions

本版工作流目录：

`versions/4.55`

根目录 `.github/workflows/price-cache-sync.yml` 需要使用本目录下的：

`github-workflows/price-cache-sync.yml`

## 验收重点

1. 网站启动页显示 `v4.55`。
2. 省钱页 Best Buy 显示“今日特惠/官网核对”，不是“降噪耳机 $25”。
3. Walmart 显示“限时优惠/官网核对”，不是中文搜索结果。
4. ALDI 和 Target 显示“本周优惠/周广告”。
5. Walmart 牛奶、大米、Costco 牛排进入固定商品页每日刷新。
