# v4.99d 验收清单

- 打开网站，确认版本显示 `v4.99d`。
- 浏览器访问 `/version.json?t=123`，确认显示 `4.99d`。
- 浏览器访问 `/app.html`，确认会自动跳转到 `index.html?app_v=4.99d&refresh_t=...`。
- App 封装入口改为 `/app.html` 后，确认不再停留旧版本。
- 后续更新网页时，只更新 `index.html` 和 `version.json`，App 不需要重新封装。
- 首页、我的、商家主页、发布页、管理后台都能正常打开。
