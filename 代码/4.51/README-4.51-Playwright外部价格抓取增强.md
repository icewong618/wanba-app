# 乐生活 4.51 Playwright 外部价格抓取增强

本版本在 4.50 的 `public_page` 基础上，加入 Playwright 浏览器抓取。

## 已改变

- 普通 `fetch` 会先尝试读取 JSON-LD / meta 价格。
- 如果遇到 403、fetch failed、验证码、无结构化价格，会自动切换到 Playwright Chromium。
- Playwright 会等待页面 JS 渲染，再读取常见价格区域。
- Walmart、Target、Best Buy、Macy's、ALDI、Costco、Sam's Club 都有初始价格选择器。
- 抓不到价格时继续保留旧缓存，并写入 `deal_tracked_products.last_error`。

## 安全规则

- 价格为空、不合理或页面疑似验证码时，不覆盖旧价格。
- Costco、Sam's Club 仍属于实验抓取，会员、邮编、门店会影响最终价格。
- 前端继续显示“官网核对”。

## GitHub Actions

版本文件夹内的 workflow 使用：

```yaml
working-directory: 代码/4.51
```

如果你像当前线上仓库一样，把 `package.json` 和 `scripts/` 放在仓库根目录，那么正式推送到 GitHub 的 `.github/workflows/price-cache-sync.yml` 需要删除 `working-directory` 三行。

同时 workflow 需要：

```yaml
- name: Install Playwright Chromium
  run: npx playwright install chromium --with-deps
```

## 必须更新的文件

- `index.html`
- `package.json`
- `scripts/sync-daily-prices.js`
- `.github/workflows/price-cache-sync.yml`

## Supabase

执行 `Supabase-playwright-upgrade-4.51.sql` 记录版本升级即可。本版不需要新增数据表。
