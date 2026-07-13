# 乐生活公测发布检查清单 v5.151

## 已完成的发布基础

- [x] 首页、个人主页、商家微网站、笔记详情、分享卡及封装 App 已上线。
- [x] 用户反馈、内容举报、管理员处理、个人数据导出已可用。
- [x] 公测 Smoke Check、价格刷新、网页部署、分享卡部署、每周数据备份均已配置。
- [x] 注册和重设密码已启用至少 10 位、同时含字母和数字的规则。

> Supabase Free 计划不支持 Leaked Password Protection。本次公测采用现有密码规则，不将此项作为阻塞条件。

## 发布前必须人工验收

- [ ] 新注册、邮箱验证、登录、退出、忘记密码与错误提示。
- [ ] 图文、YouTube、TikTok 发布；删除、评论、收藏、关注、私信。
- [ ] 首页推荐/最新切换；“减少此类内容”与偏好恢复。
- [ ] 商家资料、商品、优惠券领取、二维码核销、会员卡和奖励兑换。
- [ ] 个人、笔记和商家链接转发到微信/Facebook，确认标题、摘要和缩略图。
- [ ] 管理员处理一条内容举报和一条公测反馈。
- [ ] 省钱页能打开今日价格与热榜；匿名和登录用户各核对一次外链。
- [ ] iPhone、安卓全面屏、折叠屏和封装 App 的启动页、安全区、返回手势、发布页均可操作。
- [ ] 我的页面“导出我的数据”能成功下载 JSON 文件。

## 发布前运行检查

- [ ] GitHub Actions：Deploy to GitHub Pages 为绿色。
- [ ] GitHub Actions：Deploy Share Card Worker 为绿色。
- [ ] GitHub Actions：Daily Price Cache Sync 为绿色。
- [ ] GitHub Actions：Public Beta Smoke Check 为绿色，并确认线上版本等于本次版本。
- [ ] GitHub Actions：Public Data Backup 为绿色，Artifact 内含 `public-schema.sql`、`public-data.sql`、`metadata.txt`。
- [ ] 无痕窗口访问 `https://escoopcity.com/`、`/app.html`、一篇笔记和一个商家微网站。

## 管理与应急准备

- [ ] 至少两位管理员能进入管理后台。
- [ ] 仅管理员和仓库协作者可以下载备份 Artifact；备份保留 14 天。
- [ ] 不在网页代码、截图、GitHub 文件或聊天中暴露数据库 URI、service role、OpenAI 或 Cloudflare 密钥。
- [ ] 恢复操作仅在独立测试库先验证；不直接覆盖线上数据库。

## 暂缓到公测后

- 账户注销与数据删除流程。
- 本地对象存储的图片/视频处理。
- 更多真实价格来源与自动审核。
- 复杂 CRM、推送通知、自动投流及多城市扩张。
