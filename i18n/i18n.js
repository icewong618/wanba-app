(() => {
  const STORAGE_KEY = 'leshenghuo_language';
  const languageNames = { 'zh-CN':'简体中文', 'zh-TW':'繁體中文', en:'English' };
  const packs = {
    'zh-CN': {
      language:'语言', home:'首页', week:'本周', deals:'省钱', messages:'消息', me:'我', publish:'发布', search:'搜索', back:'返回', close:'关闭', save:'保存', cancel:'取消', confirm:'确认', refresh:'刷新', loading:'正在读取内容...',
      '今日省钱':'今日省钱','扫码点餐':'扫码点餐','外卖点单':'外卖点单','扫码排队':'扫码排队','购物车':'购物车','订单详情':'订单详情','派送':'派送','到店自取':'到店自取','在线支付方式':'在线支付方式','加入购物车':'加入购物车','继续点菜':'继续点菜','优惠券':'优惠券','小费':'小费','应付合计':'应付合计','提交订单':'提交订单','排队成功':'排队成功','提前点菜':'提前点菜','租车预约':'租车预约','车辆日历':'车辆日历','租车管理':'租车管理','预约管理':'预约管理','车队看板':'车队看板','任务与排期':'任务与排期','服务库':'服务库','添加车辆':'添加车辆','编辑车辆':'编辑车辆','管理后台':'管理后台','商家管理':'商家管理','我的页面':'我的页面','成为商家':'成为商家','切换账号':'切换账号','分享我的主页':'分享我的主页','App 权限与提醒':'App 权限与提醒','关于本次公测':'关于本次公测','隐私与社区规则':'隐私与社区规则','导出我的数据':'导出我的数据','我的反馈':'我的反馈','公测反馈':'公测反馈','全部':'全部','推荐':'推荐','最新':'最新','美食':'美食','玩乐':'玩乐','好物':'好物','生活':'生活','社区':'社区','免费活动':'免费活动','本月活动':'本月活动','本周末活动':'本周末活动','遛娃':'遛娃','视频':'视频','登录':'登录','注册':'注册','退出':'退出','设置':'设置','删除':'删除','编辑':'编辑','查看详情':'查看详情','未登录':'未登录','已完成':'已完成','处理中':'处理中','等待确认':'等待确认','已确认':'已确认','可预约':'可预约','清洁中':'清洁中','维修中':'维修中','优惠券核销':'优惠券核销','商家':'商家','店铺':'店铺','会员卡':'会员卡','附近':'附近','收藏':'收藏','活动报名':'活动报名','在线预约':'在线预约','查看店铺':'查看店铺','菜单':'菜单','订单':'订单','支付':'支付','个人资料':'个人资料','关注':'关注','粉丝':'粉丝','评论':'评论','点赞':'点赞','分享':'分享','私信':'私信','草稿':'草稿','预览':'预览','标签':'标签','分类':'分类','营业时间':'营业时间','地址':'地址','电话':'电话','联系商家':'联系商家','商家主页':'商家主页','商家后台':'商家后台','功能中心':'功能中心','点餐后台':'点餐后台','运营后台':'运营后台','会员管理':'会员管理','会员优惠':'会员优惠','领取优惠券':'领取优惠券','优惠券核销':'优惠券核销','可用优惠券':'可用优惠券','我的优惠券':'我的优惠券','订单状态':'订单状态','待付款':'待付款','已付款':'已付款','已取消':'已取消','退款':'退款','配送':'配送','取餐':'取餐','预约时间':'预约时间','取车时间':'取车时间','还车时间':'还车时间','车辆详情':'车辆详情','我的预约':'我的预约','确认预约':'确认预约','取消预约':'取消预约','修改预约':'修改预约','增值服务':'增值服务','保险服务':'保险服务','税费与服务费':'税费与服务费'
    },
    'zh-TW': {
      language:'語言', home:'首頁', week:'本週', deals:'省錢', messages:'消息', me:'我', publish:'發布', search:'搜尋', back:'返回', close:'關閉', save:'儲存', cancel:'取消', confirm:'確認', refresh:'重新整理', loading:'正在讀取內容...',
      '今日省钱':'今日省錢','扫码点餐':'掃碼點餐','外卖点单':'外賣點餐','扫码排队':'掃碼排隊','购物车':'購物車','订单详情':'訂單詳情','派送':'派送','到店自取':'到店自取','在线支付方式':'線上付款方式','加入购物车':'加入購物車','继续点菜':'繼續點餐','优惠券':'優惠券','小费':'小費','应付合计':'應付合計','提交订单':'提交訂單','排队成功':'排隊成功','提前点菜':'提前點餐','租车预约':'租車預約','车辆日历':'車輛日曆','租车管理':'租車管理','预约管理':'預約管理','车队看板':'車隊看板','任务与排期':'任務與排期','服务库':'服務庫','添加车辆':'新增車輛','编辑车辆':'編輯車輛','管理后台':'管理後台','商家管理':'商家管理','我的页面':'我的頁面','成为商家':'成為商家','切换账号':'切換帳號','分享我的主页':'分享我的主頁','App 权限与提醒':'App 權限與提醒','关于本次公测':'關於本次公測','隐私与社区规则':'隱私與社群規則','导出我的数据':'匯出我的資料','我的反馈':'我的回饋','公测反馈':'公測回饋','全部':'全部','推荐':'推薦','最新':'最新','美食':'美食','玩乐':'玩樂','好物':'好物','生活':'生活','社区':'社群','免费活动':'免費活動','本月活动':'本月活動','本周末活动':'本週末活動','遛娃':'遛娃','视频':'影片','登录':'登入','注册':'註冊','退出':'登出','设置':'設定','删除':'刪除','编辑':'編輯','查看详情':'查看詳情','未登录':'未登入','已完成':'已完成','处理中':'處理中','等待确认':'等待確認','已确认':'已確認','可预约':'可預約','清洁中':'清潔中','维修中':'維修中','优惠券核销':'優惠券核銷','商家':'商家','店铺':'商店','会员卡':'會員卡','附近':'附近','收藏':'收藏','活动报名':'活動報名','在线预约':'線上預約','查看店铺':'查看商店','菜单':'菜單','订单':'訂單','支付':'付款','个人资料':'個人資料','关注':'追蹤','粉丝':'粉絲','评论':'留言','点赞':'按讚','分享':'分享','私信':'私訊','草稿':'草稿','预览':'預覽','标签':'標籤','分类':'分類','营业时间':'營業時間','地址':'地址','电话':'電話','联系商家':'聯絡商家','商家主页':'商家主頁','商家后台':'商家後台','功能中心':'功能中心','点餐后台':'點餐後台','运营后台':'營運後台','会员管理':'會員管理','会员优惠':'會員優惠','领取优惠券':'領取優惠券','优惠券核销':'優惠券核銷','可用优惠券':'可用優惠券','我的优惠券':'我的優惠券','订单状态':'訂單狀態','待付款':'待付款','已付款':'已付款','已取消':'已取消','退款':'退款','配送':'配送','取餐':'取餐','预约时间':'預約時間','取车时间':'取車時間','还车时间':'還車時間','车辆详情':'車輛詳情','我的预约':'我的預約','确认预约':'確認預約','取消预约':'取消預約','修改预约':'修改預約','增值服务':'加值服務','保险服务':'保險服務','税费与服务费':'稅費與服務費'
    },
    en: {
      language:'Language', home:'Home', week:'This Week', deals:'Deals', messages:'Messages', me:'Me', publish:'Post', search:'Search', back:'Back', close:'Close', save:'Save', cancel:'Cancel', confirm:'Confirm', refresh:'Refresh', loading:'Loading...',
      '今日省钱':'Today\'s Deals','扫码点餐':'Table Ordering','外卖点单':'Takeout Order','扫码排队':'Join Waitlist','购物车':'Cart','订单详情':'Order Details','派送':'Delivery','到店自取':'Pickup','在线支付方式':'Online Payment','加入购物车':'Add to Cart','继续点菜':'Continue Ordering','优惠券':'Coupons','小费':'Tip','应付合计':'Total Due','提交订单':'Place Order','排队成功':'You\'re in Line','提前点菜':'Pre-order','租车预约':'Car Rental','车辆日历':'Vehicle Calendar','租车管理':'Rental Management','预约管理':'Reservations','车队看板':'Fleet Dashboard','任务与排期':'Tasks & Schedule','服务库':'Service Library','添加车辆':'Add Vehicle','编辑车辆':'Edit Vehicle','管理后台':'Admin Center','商家管理':'Merchant Tools','我的页面':'My Profile','成为商家':'Become a Merchant','切换账号':'Switch Account','分享我的主页':'Share My Profile','App 权限与提醒':'App Permissions & Reminders','关于本次公测':'About This Beta','隐私与社区规则':'Privacy & Community Rules','导出我的数据':'Export My Data','我的反馈':'My Feedback','公测反馈':'Beta Feedback','全部':'All','推荐':'For You','最新':'Latest','美食':'Food & Drink','玩乐':'Things to Do','好物':'Good Finds','生活':'Lifestyle','社区':'Community','免费活动':'Free Events','本月活动':'This Month','本周末活动':'This Weekend','遛娃':'Family & Kids','视频':'Videos','登录':'Sign In','注册':'Sign Up','退出':'Sign Out','设置':'Settings','删除':'Delete','编辑':'Edit','查看详情':'View Details','未登录':'Guest','已完成':'Completed','处理中':'In Progress','等待确认':'Awaiting Confirmation','已确认':'Confirmed','可预约':'Available','清洁中':'Cleaning','维修中':'Maintenance','优惠券核销':'Coupon Redemption','商家':'Merchant','店铺':'Shop','会员卡':'Membership Card','附近':'Nearby','收藏':'Saved','活动报名':'Event Registration','在线预约':'Book Online','查看店铺':'View Shop','菜单':'Menu','订单':'Orders','支付':'Payment','个人资料':'Profile','关注':'Follow','粉丝':'Followers','评论':'Comments','点赞':'Likes','分享':'Share','私信':'Direct Message','草稿':'Drafts','预览':'Preview','标签':'Tags','分类':'Category','营业时间':'Hours','地址':'Address','电话':'Phone','联系商家':'Contact Merchant','商家主页':'Merchant Profile','商家后台':'Merchant Dashboard','功能中心':'Feature Center','点餐后台':'Order Dashboard','运营后台':'Content Dashboard','会员管理':'Member Management','会员优惠':'Member Offers','领取优惠券':'Claim Coupon','优惠券核销':'Redeem Coupon','可用优惠券':'Available Coupons','我的优惠券':'My Coupons','订单状态':'Order Status','待付款':'Payment Pending','已付款':'Paid','已取消':'Cancelled','退款':'Refund','配送':'Delivery','取餐':'Pickup','预约时间':'Reservation Time','取车时间':'Pick-up Time','还车时间':'Return Time','车辆详情':'Vehicle Details','我的预约':'My Bookings','确认预约':'Confirm Booking','取消预约':'Cancel Booking','修改预约':'Modify Booking','增值服务':'Add-ons','保险服务':'Insurance','税费与服务费':'Taxes & Fees'
    }
  };

  // Product-wide terminology. Keep future modules on the same vocabulary instead of
  // introducing one-off literal translations in each independent feature.
  Object.assign(packs['zh-CN'], {
    '隐私设置':'隐私设置','账号与安全':'账号与安全','通知设置':'通知设置','语言与地区':'语言与地区','清除缓存':'清除缓存','存储空间':'存储空间','收藏夹':'收藏夹','新建收藏夹':'新建收藏夹','添加到收藏夹':'添加到收藏夹','浏览记录':'浏览记录','屏蔽用户':'屏蔽用户','举报':'举报','社区规则':'社区规则','内容偏好':'内容偏好','偏好':'偏好','发现身边的精彩生活':'发现身边的精彩生活','搜一搜身边的新鲜事':'搜一搜身边的新鲜事','＋ 发布':'＋ 发布','按发布时间排列':'按发布时间排列','根据你的关注和互动排序':'根据你的关注和互动排序','结合新鲜内容与大家的互动排序':'结合新鲜内容与大家的互动排序','选几个你关心的生活方式':'选几个你关心的生活方式','可多选。乐生活会优先推荐相关笔记，之后可随时在首页“偏好”中修改。':'可多选。乐生活会优先推荐相关笔记，之后可随时在首页“偏好”中修改。','开始浏览':'开始浏览','暂时跳过':'暂时跳过','成为第一个分享的人吧':'成为第一个分享的人吧','暂时没有符合条件的内容,换个分类看看':'暂时没有符合条件的内容,换个分类看看','还没有发布笔记':'还没有发布笔记','正在加载附近的新鲜事…':'正在加载附近的新鲜事…','正在发布笔记…':'正在发布笔记…','推送通知':'推送通知','本地提醒':'本地提醒','未读消息':'未读消息','系统通知':'系统通知','允许通知':'允许通知','定位服务':'定位服务','附近商家':'附近商家','地图导航':'地图导航','联系商家':'联系商家','客服与帮助':'客服与帮助','常见问题':'常见问题','反馈与建议':'反馈与建议','订单历史':'订单历史','交易记录':'交易记录','账单详情':'账单详情','支付方式':'支付方式','添加支付方式':'添加支付方式','信用卡':'信用卡','礼品卡':'礼品卡','退款政策':'退款政策','订阅':'订阅','会员权益':'会员权益','续费':'续费','取消订阅':'取消订阅','评价':'评价','写评价':'写评价','评分':'评分','照片与视频':'照片与视频','上传':'上传','相机':'相机','相册':'相册','权限':'权限','订单追踪':'订单追踪','配送地址':'配送地址','配送时间':'配送时间','预约':'预约','可预约时段':'可预约时段','排队取号':'排队取号','取号记录':'取号记录','活动日历':'活动日历','售票':'售票','我的票券':'我的票券','核销':'核销','团队成员':'团队成员','员工账号':'员工账号','角色与权限':'角色与权限','店长':'店长','员工':'员工','运营':'运营','收银':'收银','后厨':'后厨','服务员':'服务员','库存':'库存','商品':'商品','服务项目':'服务项目','限时优惠':'限时优惠','配送订单':'配送订单','预约订单':'预约订单','租赁订单':'租赁订单','数据与隐私':'数据与隐私'
  });
  Object.assign(packs['zh-TW'], {
    '隐私设置':'隱私設定','账号与安全':'帳號與安全','通知设置':'通知設定','语言与地区':'語言與地區','清除缓存':'清除快取','存储空间':'儲存空間','收藏夹':'收藏資料夾','新建收藏夹':'新增收藏資料夾','添加到收藏夹':'加入收藏資料夾','浏览记录':'瀏覽記錄','屏蔽用户':'封鎖使用者','举报':'檢舉','社区规则':'社群規則','内容偏好':'內容偏好','偏好':'偏好','发现身边的精彩生活':'發現身邊的精彩生活','搜一搜身边的新鲜事':'搜尋身邊的新鮮事','＋ 发布':'＋ 發布','按发布时间排列':'依發布時間排序','根据你的关注和互动排序':'依你的追蹤與互動排序','结合新鲜内容与大家的互动排序':'綜合新鮮內容與社群互動排序','选几个你关心的生活方式':'選幾個你關心的生活方式','可多选。乐生活会优先推荐相关笔记，之后可随时在首页“偏好”中修改。':'可多選。樂生活會優先推薦相關筆記，之後可隨時在首頁「偏好」中修改。','开始浏览':'開始瀏覽','暂时跳过':'暫時跳過','成为第一个分享的人吧':'成為第一位分享的人吧','暂时没有符合条件的内容,换个分类看看':'暫時沒有符合條件的內容，換個分類看看','还没有发布笔记':'還沒有發布筆記','正在加载附近的新鲜事…':'正在載入附近的新鮮事…','正在发布笔记…':'正在發布筆記…','推送通知':'推播通知','本地提醒':'本機提醒','未读消息':'未讀訊息','系统通知':'系統通知','允许通知':'允許通知','定位服务':'定位服務','附近商家':'附近商家','地图导航':'地圖導航','联系商家':'聯絡商家','客服与帮助':'客服與協助','常见问题':'常見問題','反馈与建议':'回饋與建議','订单历史':'訂單紀錄','交易记录':'交易紀錄','账单详情':'帳單詳情','支付方式':'付款方式','添加支付方式':'新增付款方式','信用卡':'信用卡','礼品卡':'禮品卡','退款政策':'退款政策','订阅':'訂閱','会员权益':'會員權益','续费':'續費','取消订阅':'取消訂閱','评价':'評價','写评价':'撰寫評價','评分':'評分','照片与视频':'相片與影片','上传':'上傳','相机':'相機','相册':'相簿','权限':'權限','订单追踪':'訂單追蹤','配送地址':'配送地址','配送时间':'配送時間','预约':'預約','可预约时段':'可預約時段','排队取号':'排隊取號','取号记录':'取號記錄','活动日历':'活動日曆','售票':'售票','我的票券':'我的票券','核销':'核銷','团队成员':'團隊成員','员工账号':'員工帳號','角色与权限':'角色與權限','店长':'店長','员工':'員工','运营':'營運','收银':'收銀','后厨':'後廚','服务员':'服務人員','库存':'庫存','商品':'商品','服务项目':'服務項目','限时优惠':'限時優惠','配送订单':'配送訂單','预约订单':'預約訂單','租赁订单':'租賃訂單','数据与隐私':'資料與隱私'
  });
  Object.assign(packs.en, {
    '隐私设置':'Privacy Settings','账号与安全':'Account & Security','通知设置':'Notification Settings','语言与地区':'Language & Region','清除缓存':'Clear Cache','存储空间':'Storage','收藏夹':'Collections','新建收藏夹':'New Collection','添加到收藏夹':'Add to Collection','浏览记录':'Viewing History','屏蔽用户':'Block User','举报':'Report','社区规则':'Community Guidelines','内容偏好':'Content Preferences','偏好':'Preferences','发现身边的精彩生活':'Discover Life Around You','搜一搜身边的新鲜事':'Search what’s new nearby','＋ 发布':'＋ Post','按发布时间排列':'Sorted by newest','根据你的关注和互动排序':'Based on your follows and interactions','结合新鲜内容与大家的互动排序':'Fresh picks based on community activity','选几个你关心的生活方式':'Pick a few interests','可多选。乐生活会优先推荐相关笔记，之后可随时在首页“偏好”中修改。':'Choose as many as you like. We’ll prioritize related posts, and you can update them anytime from Preferences.','开始浏览':'Start Exploring','暂时跳过':'Not Now','成为第一个分享的人吧':'Be the first to share','暂时没有符合条件的内容,换个分类看看':'Nothing matches yet. Try another category.','还没有发布笔记':'No posts yet','正在加载附近的新鲜事…':'Loading fresh posts nearby…','正在发布笔记…':'Publishing your post…','推送通知':'Push Notifications','本地提醒':'Local Reminders','未读消息':'Unread Messages','系统通知':'System Notifications','允许通知':'Allow Notifications','定位服务':'Location Services','附近商家':'Nearby Merchants','地图导航':'Directions','联系商家':'Contact Merchant','客服与帮助':'Help & Support','常见问题':'Frequently Asked Questions','反馈与建议':'Feedback','订单历史':'Order History','交易记录':'Transaction History','账单详情':'Bill Details','支付方式':'Payment Methods','添加支付方式':'Add Payment Method','信用卡':'Credit Card','礼品卡':'Gift Card','退款政策':'Refund Policy','订阅':'Subscription','会员权益':'Member Benefits','续费':'Renew','取消订阅':'Cancel Subscription','评价':'Reviews','写评价':'Write a Review','评分':'Rating','照片与视频':'Photos & Videos','上传':'Upload','相机':'Camera','相册':'Photo Library','权限':'Permissions','订单追踪':'Order Tracking','配送地址':'Delivery Address','配送时间':'Delivery Time','预约':'Bookings','可预约时段':'Available Times','排队取号':'Join the Waitlist','取号记录':'Waitlist History','活动日历':'Event Calendar','售票':'Tickets','我的票券':'My Tickets','核销':'Redemption','团队成员':'Team Members','员工账号':'Staff Accounts','角色与权限':'Roles & Permissions','店长':'Manager','员工':'Staff','运营':'Content Manager','收银':'Cashier','后厨':'Kitchen','服务员':'Server','库存':'Inventory','商品':'Products','服务项目':'Services','限时优惠':'Limited-time Offer','配送订单':'Delivery Orders','预约订单':'Booking Orders','租赁订单':'Rental Orders','数据与隐私':'Data & Privacy'
  });

  Object.assign(packs['zh-CN'], {
    '语言':'语言','消息':'消息','评论和@':'评论和@','新增粉丝':'新增粉丝','赞和收藏':'赞和收藏','私信':'私信','登录后查看消息':'登录后查看消息','暂无私信 · 在帖子页可私信作者':'暂无私信 · 在帖子页可私信作者','还没有评论或@':'还没有评论或@','还没有新粉丝':'还没有新粉丝','还没有赞和收藏':'还没有赞和收藏','查看笔记':'查看笔记','回关':'回关','已关注':'已关注','互相关注':'互相关注','关注':'关注','请先登录':'请先登录','返回':'返回','关闭':'关闭','刷新':'刷新','正在读取今日优惠...':'正在读取今日优惠...','正在读取菜单...':'正在读取菜单...','正在读取排队信息...':'正在读取排队信息...','正在打开商家管理后台...':'正在打开商家管理后台...','正在打开租车管理...':'正在打开租车管理...'
  });
  Object.assign(packs['zh-TW'], {
    '语言':'語言','消息':'訊息','评论和@':'留言和@','新增粉丝':'新增粉絲','赞和收藏':'讚和收藏','私信':'私訊','登录后查看消息':'登入後查看訊息','暂无私信 · 在帖子页可私信作者':'暫無私訊 · 可在筆記頁私訊作者','还没有评论或@':'還沒有留言或@','还没有新粉丝':'還沒有新粉絲','还没有赞和收藏':'還沒有讚和收藏','查看笔记':'查看筆記','回关':'回追','已关注':'已追蹤','互相关注':'互相追蹤','关注':'追蹤','请先登录':'請先登入','返回':'返回','关闭':'關閉','刷新':'重新整理','正在读取今日优惠...':'正在讀取今日優惠...','正在读取菜单...':'正在讀取菜單...','正在读取排队信息...':'正在讀取排隊資訊...','正在打开商家管理后台...':'正在開啟商家管理後台...','正在打开租车管理...':'正在開啟租車管理...'
  });
  Object.assign(packs.en, {
    '语言':'Language','消息':'Messages','评论和@':'Comments & @','新增粉丝':'New Followers','新增关注':'New Followers','赞和收藏':'Likes & Saves','私信':'Direct Messages','登录后查看消息':'Sign in to view messages','暂无私信 · 在帖子页可私信作者':'No messages yet. You can message an author from a post.','还没有评论或@':'No comments or mentions yet','还没有新粉丝':'No new followers yet','还没有赞和收藏':'No likes or saves yet','查看笔记':'View Post','回关':'Follow Back','已关注':'Following','互相关注':'Mutual Follows','关注':'Follow','请先登录':'Please sign in first','返回':'Back','关闭':'Close','刷新':'Refresh','正在读取今日优惠...':'Loading today’s deals...','正在读取菜单...':'Loading menu...','正在读取排队信息...':'Loading waitlist...','正在打开商家管理后台...':'Opening merchant dashboard...','正在打开租车管理...':'Opening rental management...','会员卡':'Membership','浏览记录':'History','编辑资料':'Profile','编辑主页':'Profile','笔记':'Note','出示会员卡':'Membership Card','查看商店':'Visit Store','查看店铺':'Visit Store','会员奖励进度':'Rewards','积分':'Points','更换背景':'Wallpaper','消费记录':'Purchase'
  });

  Object.assign(packs['zh-CN'], {
    '已申请改期':'已申请改期','已取消':'已取消','申请改期':'申请改期','取消试驾':'取消试驾','确认试驾':'确认试驾','试驾地点':'试驾地点','试驾安排':'试驾安排','客户申请改期':'客户申请改期','客户申请取消试驾':'客户申请取消试驾','保存试驾安排':'保存试驾安排','客户未填写说明。':'客户未填写说明。','等待商家安排试驾时间。':'等待商家安排试驾时间。','希望试驾时间：':'希望试驾时间：','将状态设为“已安排”时，必须填写确认试驾时间。客户可在自己的试驾记录中查看。':'将状态设为“已安排”时，必须填写确认试驾时间。客户可在自己的试驾记录中查看。','重新确认试驾时间并保存“已安排”后，该请求会自动清除。':'重新确认试驾时间并保存“已安排”后，该请求会自动清除。','确定要取消这次试驾吗？商家会收到通知。':'确定要取消这次试驾吗？商家会收到通知。','可填写取消原因（可选）':'可填写取消原因（可选）','请填写希望改期的时间或说明（可选）':'请填写希望改期的时间或说明（可选）','操作失败。请确认该试驾仍为已安排状态，并已运行 v5.391 数据库更新。':'操作失败。请确认该试驾仍为已安排状态，并已运行 v5.391 数据库更新。'
  });
  Object.assign(packs['zh-TW'], {
    '已申请改期':'已申請改期','已取消':'已取消','申请改期':'申請改期','取消试驾':'取消試駕','确认试驾':'確認試駕','试驾地点':'試駕地點','试驾安排':'試駕安排','客户申请改期':'客戶申請改期','客户申请取消试驾':'客戶申請取消試駕','保存试驾安排':'儲存試駕安排','客户未填写说明。':'客戶未填寫說明。','等待商家安排试驾时间。':'等待商家安排試駕時間。','希望试驾时间：':'希望試駕時間：','将状态设为“已安排”时，必须填写确认试驾时间。客户可在自己的试驾记录中查看。':'狀態設為「已安排」時，必須填寫確認試駕時間。客戶可在自己的試駕紀錄查看。','重新确认试驾时间并保存“已安排”后，该请求会自动清除。':'重新確認試駕時間並儲存「已安排」後，該請求會自動清除。','确定要取消这次试驾吗？商家会收到通知。':'確定要取消這次試駕嗎？商家會收到通知。','可填写取消原因（可选）':'可填寫取消原因（選填）','请填写希望改期的时间或说明（可选）':'請填寫希望改期的時間或說明（選填）','操作失败。请确认该试驾仍为已安排状态，并已运行 v5.391 数据库更新。':'操作失敗。請確認該試駕仍為已安排狀態，並已執行 v5.391 資料庫更新。'
  });
  Object.assign(packs.en, {
    '已申请改期':'Reschedule Requested','已取消':'Cancelled','申请改期':'Request Reschedule','取消试驾':'Cancel Test Drive','确认试驾':'Confirmed Test Drive','试驾地点':'Test Drive Location','试驾安排':'Test Drive Schedule','客户申请改期':'Customer Requested Reschedule','客户申请取消试驾':'Customer Requested Cancellation','保存试驾安排':'Save Test Drive Schedule','客户未填写说明。':'No note provided by the customer.','等待商家安排试驾时间。':'Waiting for the merchant to schedule a test drive.','希望试驾时间：':'Preferred time: ','将状态设为“已安排”时，必须填写确认试驾时间。客户可在自己的试驾记录中查看。':'To mark this as scheduled, set a confirmed time. The customer will see it in their records.','重新确认试驾时间并保存“已安排”后，该请求会自动清除。':'Confirm a new time and save as Scheduled to clear this request.','确定要取消这次试驾吗？商家会收到通知。':'Cancel this test drive? The merchant will be notified.','可填写取消原因（可选）':'Optional cancellation note','请填写希望改期的时间或说明（可选）':'Preferred new time or note (optional)','操作失败。请确认该试驾仍为已安排状态，并已运行 v5.391 数据库更新。':'Unable to update. Confirm the test drive is still scheduled and the v5.391 database update has been run.'
  });

  Object.assign(packs['zh-CN'], {
    '试驾日历':'试驾日历','今日试驾':'今日试驾','改期请求':'改期请求','待处理试驾':'待处理试驾','返回车辆库存':'返回车辆库存','查看客户线索':'查看客户线索','等待确认时间':'等待确认时间','暂无需要处理的试驾。':'暂无需要处理的试驾。','客户申请改期':'客户申请改期'
  });
  Object.assign(packs['zh-TW'], {
    '试驾日历':'試駕日曆','今日试驾':'今日試駕','改期请求':'改期請求','待处理试驾':'待處理試駕','返回车辆库存':'返回車輛庫存','查看客户线索':'查看客戶線索','等待确认时间':'等待確認時間','暂无需要处理的试驾。':'暫無需要處理的試駕。','客户申请改期':'客戶申請改期'
  });
  Object.assign(packs.en, {
    '试驾日历':'Test Drive Calendar','今日试驾':'Today’s Test Drives','改期请求':'Reschedule Requests','待处理试驾':'Open Test Drives','返回车辆库存':'Back to Inventory','查看客户线索':'View Customer Leads','等待确认时间':'Awaiting Confirmation','暂无需要处理的试驾。':'No test drives need attention.','客户申请改期':'Customer Requested Reschedule'
  });

  const normalized = value => String(value || '').replace(/\s+/g, ' ').trim();
  const reverse = value => {
    const input = normalized(value);
    for (const [key, chinese] of Object.entries(packs['zh-CN'])) if (input === chinese) return key;
    for (const [key, translated] of Object.entries(packs['zh-TW'])) if (input === translated) return key;
    for (const [key, translated] of Object.entries(packs.en)) if (input === translated) return key;
    return input;
  };
  const getLanguage = () => localStorage.getItem(STORAGE_KEY) || 'zh-CN';
  const t = key => packs[getLanguage()]?.[key] || packs['zh-CN'][key] || key;
  const applyText = text => {
    const source = reverse(text);
    return packs[getLanguage()]?.[source] || text;
  };
  const skip = node => node?.closest?.('[data-i18n-skip],script,style,code,pre,textarea');
  const translateTree = (root=document.body) => {
    if (!root) return;
    root.querySelectorAll?.('[data-i18n]').forEach(el => {
      const translated = t(el.dataset.i18n);
      // Avoid replacing an identical text node. Replacing it retriggers the
      // MutationObserver and can otherwise starve the startup render loop.
      if(el.textContent !== translated) el.textContent = translated;
    });
    root.querySelectorAll?.('[placeholder],[title],[aria-label]').forEach(el => {
      if (skip(el)) return;
      ['placeholder','title','aria-label'].forEach(attr => {
        if(!el.hasAttribute(attr)) return;
        const translated = applyText(el.getAttribute(attr));
        if(el.getAttribute(attr) !== translated) el.setAttribute(attr, translated);
      });
    });
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes=[]; let node;
    while ((node=walker.nextNode())) nodes.push(node);
    nodes.forEach(textNode => {
      if(skip(textNode.parentElement)) return;
      const translated = applyText(textNode.nodeValue);
      if(textNode.nodeValue !== translated) textNode.nodeValue = translated;
    });
  };
  const apply = () => {
    const language = getLanguage();
    document.documentElement.lang = language;
    document.documentElement.dataset.locale = language;
    translateTree();
    document.dispatchEvent(new CustomEvent('leshenghuo:languagechange', { detail:{ language } }));
  };
  const closePicker = () => document.getElementById('leshenghuoLanguagePicker')?.remove();
  const openPicker = () => {
    closePicker();
    const active = getLanguage();
    const sheet=document.createElement('div');
    sheet.id='leshenghuoLanguagePicker';
    sheet.innerHTML=`<div class="lsh-lang-backdrop" onclick="window.LeshenghuoI18n.closePicker()"></div><section class="lsh-lang-sheet" role="dialog" aria-modal="true"><header><b>${t('language')}</b><button onclick="window.LeshenghuoI18n.closePicker()" aria-label="${t('close')}">×</button></header>${Object.entries(languageNames).map(([id,label])=>`<button class="lsh-lang-choice ${id===active?'on':''}" onclick="window.LeshenghuoI18n.setLanguage('${id}')"><span>${label}</span><i>${id===active?'✓':''}</i></button>`).join('')}</section>`;
    document.body.appendChild(sheet);
  };
  const setLanguage = language => {
    if (!packs[language]) return;
    localStorage.setItem(STORAGE_KEY, language);
    closePicker();
    apply();
  };
  const style=document.createElement('style');
  style.textContent='.lsh-lang-backdrop{position:fixed;inset:0;z-index:9998;background:rgba(24,27,22,.38);backdrop-filter:blur(2px)}.lsh-lang-sheet{position:fixed;z-index:9999;left:50%;top:50%;width:min(360px,calc(100vw - 36px));transform:translate(-50%,-50%);padding:18px 16px;border-radius:18px;background:#fffffc;color:#292b27;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;box-shadow:0 16px 48px rgba(0,0,0,.24)}.lsh-lang-sheet header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;font-size:17px}.lsh-lang-sheet header button{width:34px;height:34px;border:0;border-radius:50%;background:#efebe0;font-size:23px}.lsh-lang-choice{display:flex;width:100%;align-items:center;justify-content:space-between;padding:15px 12px;margin-top:8px;border:1px solid #e2ded3;border-radius:10px;background:#fff;font:700 15px inherit;color:#292b27}.lsh-lang-choice.on{border-color:#315f43;background:#e1ecdf;color:#244c35}.lsh-lang-choice i{font-style:normal;font-size:18px}';
  document.head.appendChild(style);
  window.LeshenghuoI18n = { getLanguage, setLanguage, openPicker, closePicker, translate:apply, t };
  let pending=false;
  // Translate newly rendered module content before the browser paints it. The old
  // timer briefly exposed Chinese templates in English and Traditional Chinese.
  const observe = () => new MutationObserver(() => { if(pending) return; pending=true; queueMicrotask(() => { pending=false; translateTree(); }); }).observe(document.body, { childList:true, subtree:true });
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => { apply(); observe(); });
  else { apply(); observe(); }
})();
