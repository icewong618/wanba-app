# 乐生活 4.54 Costco Product ID 抓取试验

本版本从 `versions/4.54` 开始使用英文版本路径，后续 GitHub Actions 推荐指向：

```yaml
working-directory: versions/4.54
```

## 本版目标

尝试吸收 `aransaseelan/CostcoPriceTracker` 的 Costco Product ID 思路：

- Costco 商品优先使用 `product_key` / URL 中的商品 ID。
- 自动生成 Costco 候选 URL。
- 一个 URL 失败后尝试下一个 URL。
- Chromium 启动参数增加 `--disable-http2`，尝试规避 Costco 的 HTTP2 协议错误。

## Walmart 说明

`github.com/topics/walmart-sales-forecasting` 是 Walmart 销量预测/机器学习话题页，不是价格抓取项目。它不适合作为实时价格数据源。Walmart 仍沿用 4.53 的 Playwright 配置化抓取，后续可继续尝试具体的 Walmart scraper 项目。

## 上线文件

如果使用英文版本目录结构，推送：

- `versions/4.54`
- 根目录 `index.html`，用 `versions/4.54/index.html` 覆盖
- `.github/workflows/price-cache-sync.yml`，其中 `working-directory` 指向 `versions/4.54`

如果继续使用根目录脚本结构，则 workflow 不要写 `working-directory`。
