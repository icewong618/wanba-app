# 乐生活 v4.91 整理验收版

## 本版目标

基于 4.90 做一次稳定整理，不新增大功能，作为进入 5.0 前的验收基线。

## 保留能力

- 社区首页、笔记详情、头像跳转、消息页、个人页
- 商家资料和商家主页
- 商家 AI 发文入口
- 管理后台用户、帖子、评论、封禁管理
- 省钱运营后台：
  - 审核
  - 热门
  - 过期
  - 隐藏 / 恢复
  - 手动编辑价格和说明
- GitHub Actions 每日价格缓存刷新

## 数据库

本版不需要新增 SQL。

前提仍是：

- 已执行 `Supabase-admin-center-data-fix-4.59.sql`
- 已执行 `Supabase-deal-price-ops-4.70.sql`

## 验收重点

- 网站显示 `v4.91`
- GitHub Pages 部署成功
- Daily Price Cache Sync 成功
- 管理后台数据正常
- 省钱运营编辑正常
- 控制台没有业务红色报错

## 推送文件

- `index.html`
- `.github/workflows/price-cache-sync.yml`
- `versions/4.91/`
