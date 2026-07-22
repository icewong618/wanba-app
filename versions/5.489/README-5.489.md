# 乐生活 v5.489

## Merchant Profile API Batch

本版继续将主程序内的商家资料请求收口到 `shared/merchant-public-api.js`。

- 新增商家资料批量读取、链接重复检查与已认证商家搜索接口。
- 商家资料加载、扫码点餐结算设置、商家微网站链接检查、地点搜索改用统一接口。
- 不改变现有页面功能与用户界面，仅降低后续维护时的重复请求代码。

## Verification

- `index.html` 与 `app.html` 已同步。
- 发布检查、JavaScript 语法检查和商家接口契约检查均已通过。
