# 乐生活餐饮扫码深链配置

餐桌二维码和外卖二维码会使用以下网址：

- 餐桌点餐：`https://escoopcity.com/restaurant/order/?merchant=<商家>&table=<餐桌>`
- 外卖点单：`https://escoopcity.com/restaurant/order/?merchant=<商家>&mode=takeout`

网页已监听 Capacitor 的 `App` 深链事件，并同时读取冷启动 URL。封装工程必须安装并同步官方 App 插件：

```bash
npm install @capacitor/app
npx cap sync
```

iOS 继续保留 Associated Domains：`applinks:escoopcity.com`；Android 继续保留已部署的 `assetlinks.json` 与 App Links intent-filter。安装新包后重新构建一次 App。之后二维码唤起 App 时会直接进入对应餐桌点餐或外卖点单页。
