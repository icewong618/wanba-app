# 乐生活模块架构 v5.510

## 入口层

- `index.html`：网页入口。
- `app.html`：封装 App 入口，与 `index.html` 保持完全一致。

## 主应用层

- `shared/app-shell.css`：样式入口文件。
- `shared/styles/base.css`：全站基础样式与通用布局。
- `shared/styles/mobile-safe.css`：移动端安全区、底部导航和跨端触控保护。
- `shared/styles/merchant.css`：商家主页、商家后台和商家功能样式。
- `shared/app-main.js`：主界面控制、页面路由、登录状态、帖子流与跨模块协调。

## 业务接口层

- `shared/*.js`：按领域拆开的数据接口，例如帖子、消息、会员、优惠券、商家资料、反馈、举报等。

## 独立业务模块

- `deals/`：省钱。
- `week/`：本周活动。
- `messages/`：消息。
- `restaurant/`：餐饮点餐、外卖、排队和餐饮管理。
- `rental/`：租车预约与管理。
- `autos/`：二手车买卖与管理。
- `merchant/`：商家微网站相关页面。
- `order/`：订单入口和兼容跳转。

## 发布构建

- `scripts/build-pages-site.mjs` 会构建 `_site/`。
- 构建时会复制入口文件和全部独立模块目录，检查入口与 CSS 的本地引用，并压缩 HTML/CSS 静态文件。
- `npm run check:release` 同时验证入口页一致性、版本号、JavaScript 语法、分层样式和重复全局函数。

## 后续原则

后续新功能优先放入对应独立模块或 `shared/` 业务接口，避免再次把新逻辑集中塞入主入口页面。`shared/app-main.js` 仍是主协调器；公测稳定后可按页面继续细分，但不影响当前上线结构。不要重新引入同名全局函数覆盖旧逻辑。
