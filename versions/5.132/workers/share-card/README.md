# 乐生活动态分享卡 Worker

这个 Worker 让 `https://escoopcity.com/商家名` 在服务端返回商家分享信息，同时继续加载现有乐生活网页。

## 它解决的问题

- Facebook、微信等分享抓取器通常不执行网页 JavaScript。
- GitHub Pages 无法按商家链接动态生成 Open Graph 标签。
- Worker 会读取公开认证商家或公开笔记的标题、简介、封面，并在 HTML 的 `<head>` 中加入分享标题、简介、图片和规范链接。

## 部署前条件

1. `escoopcity.com` 的 DNS 必须托管在 Cloudflare。
2. Cloudflare 账户已开通 Workers。
3. GitHub 仓库保持公开；Worker 会从仓库的原始文件读取网页资源。

## 部署步骤

在本文件夹执行：

```bash
npx wrangler@4 deploy
```

首次部署会要求登录 Cloudflare。部署成功后，在 Cloudflare Workers 的“设置 - 域和路由”选择“添加 - 自定义域”，填写：

```text
escoopcity.com
```

不要再添加 `escoopcity.com/*` 路由。这个 Worker 会主动代理 GitHub Pages，因此应作为根域名的自定义域；Cloudflare 会自动创建对应 DNS 记录和证书。若提示根域名已有 CNAME 冲突，先确认 Worker 已部署成功，再在 Cloudflare 的 DNS 记录中删除旧的根域名 GitHub Pages 记录，然后重新添加自定义域。

Worker 会经由 jsDelivr 读取 GitHub 仓库的静态网页文件，避免 GitHub Pages 自定义域自动跳转和 GitHub 原始文件限流；已认证商家的根路径会额外注入动态分享卡。

## 验收

1. 打开一个商家链接，网页内容应与当前乐生活商家微网站一致。
2. 使用 Facebook Sharing Debugger 抓取该链接，确认标题、简介和缩略图来自商家资料。
3. 在微信发送商家链接，确认显示乐生活和商家信息。

## 图片说明

商家封面或 Logo 支持 PNG、JPG/JPEG、WebP 和公开 `https://` 图片。即使当前资料仍以本地 Base64 保存，Worker 也会提供受控的公开图片入口，因此每家商家都能使用自己的分享缩略图。
