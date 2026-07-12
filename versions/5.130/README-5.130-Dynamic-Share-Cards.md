# 乐生活 5.130 - 动态分享卡部署准备版

## 本版内容

- 新增 Cloudflare Worker：`workers/share-card/`。
- 首页提供固定乐生活分享标题、简介和品牌图。
- 已认证商家的根路径会读取 Supabase 公开资料，服务端注入动态 Open Graph 分享信息。
- 保持 GitHub Pages 作为实际网页源站，不改变现有网页与 App。

## 当前状态

源码和部署配置已准备完成，但 Worker 尚未部署。需要先将 `escoopcity.com` 的 DNS 接入 Cloudflare，再运行 Worker 部署。

## 公测前验收

部署后使用 Facebook Sharing Debugger 和微信分别验证商家链接的标题、简介、缩略图。
