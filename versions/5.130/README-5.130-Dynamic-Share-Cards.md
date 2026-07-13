# 乐生活 5.130 - 动态分享卡部署准备版

## 本版内容

- 新增 Cloudflare Worker：`workers/share-card/`。
- 首页提供固定乐生活分享标题、简介和品牌图。
- 已认证商家的根路径会读取 Supabase 公开资料，服务端注入动态 Open Graph 分享信息。
- Worker 从 GitHub 仓库原始文件读取网页资源，不改变现有网页与 App。

## 当前状态

源码和部署配置已准备完成。部署时需要将 `escoopcity.com` 添加为 Worker 的“自定义域”。

## 公测前验收

部署后使用 Facebook Sharing Debugger 和微信分别验证商家链接的标题、简介、缩略图。
