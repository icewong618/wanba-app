# 乐生活 4.60 稳定验收版

## 本版目标

4.60 不新增大功能，主要用于稳定验收当前线上关键能力：

- GitHub Pages 部署
- 管理后台数据读取
- 省钱栏目每日刷新
- 首页、发布、消息、我的页面基础流程

## 需要复制到 GitHub 仓库

从当前 Codex 项目复制：

- `versions/4.60/`
- `index.html`
- `.github/workflows/price-cache-sync.yml`
- `.github/workflows/deploy-pages.yml`
- `.gitignore`

复制到：

- `/Users/alan/Documents/GitHub/wanba-app/versions/4.60/`
- `/Users/alan/Documents/GitHub/wanba-app/index.html`
- `/Users/alan/Documents/GitHub/wanba-app/.github/workflows/price-cache-sync.yml`
- `/Users/alan/Documents/GitHub/wanba-app/.github/workflows/deploy-pages.yml`
- `/Users/alan/Documents/GitHub/wanba-app/.gitignore`

不要提交 `.DS_Store`。

## 数据库

4.60 没有新增 SQL。

如果 4.59 的管理后台 SQL 还没有执行，请先执行：

`versions/4.60/Supabase-admin-center-data-fix-4.59.sql`

## GitHub Actions

应有两个 workflow：

- `Deploy to GitHub Pages`
- `Daily Price Cache Sync`

`Daily Price Cache Sync` 的 working-directory 应为：

`versions/4.60`

## 验收重点

1. 网站启动页显示 `v4.60`。
2. GitHub Pages 部署变绿。
3. 价格刷新 workflow 变绿。
4. 管理后台能显示注册用户、近期发帖、评论回复。
5. 首页笔记、详情页、发布页、消息页、我的页面可打开。
6. 省钱页不再显示旧的搜索页假价格。
