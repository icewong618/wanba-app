# 乐生活 5.133 - 自动发布稳定版

## 本版内容

- 推送 `main` 后自动部署 Cloudflare 分享卡 Worker，并固定读取该次提交的网页文件。
- 自动清除 jsDelivr 静态文件缓存，避免网页或 App 停留在旧版本。
- `version.json` 不再长期缓存，App 更新判断与网页版本保持一致。
- 帖子读取遇到瞬时网络中断时会重试；连续失败时短暂退避并保留已有内容。

## 部署前设置

在 GitHub 仓库的 Actions Secrets 新建 `CLOUDFLARE_API_TOKEN`，权限为本账户的 `Workers Scripts: Edit`。
