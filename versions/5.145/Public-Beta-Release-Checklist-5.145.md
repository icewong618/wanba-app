# 乐生活公测发布检查清单 v5.145

## 先运行

- [ ] 在 Supabase SQL Editor 运行 `Supabase-feed-preferences-5.144.sql`。
- [ ] 在 Supabase SQL Editor 运行 `Supabase-public-beta-security-5.145.sql`。
- [ ] Supabase Dashboard -> Authentication -> Password Security，开启 Leaked Password Protection。

## 核心用户流程

- [ ] 新注册、邮件验证、登录、退出、忘记密码。
- [ ] 发布图文、YouTube、TikTok 链接；删除、评论、收藏、关注、私信。
- [ ] 首页推荐/最新切换；“减少此类内容”及偏好恢复。
- [ ] 商家资料、商品、优惠券、领取优惠券、二维码核销、会员卡和奖励兑换。
- [ ] 个人、笔记和商家链接转发到微信/Facebook，确认标题、摘要和缩略图。

## 管理与稳定性

- [ ] 用管理员账号处理一条内容举报和一条公测反馈。
- [ ] 省钱页能打开今日价格与实时热榜；匿名和登录用户各点击一次“官网核对”。
- [ ] iPhone、安卓全面屏、折叠屏及封装 App：启动页、顶部/底部安全区、返回手势和发布页均可操作。
- [ ] GitHub Actions 的 Deploy to GitHub Pages、Deploy Share Card Worker、Daily Price Cache Sync 均为绿色。
- [ ] 无痕窗口访问 `https://escoopcity.com/version.json`、首页、商家微网站与笔记链接。

## 公测前保留

- [ ] 导出 Supabase 的 posts、profiles、merchants、merchant_memberships、merchant_member_transactions、content_reports、user_feedback 备份。
- [ ] 确认管理员至少两人可进入管理后台；不要把 service_role key 放入网页、GitHub 文件或截图。
