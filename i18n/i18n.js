(() => {
  const STORAGE_KEY = 'leshenghuo_language';
  const languageNames = { 'zh-CN':'简体中文', 'zh-TW':'繁體中文', en:'English' };
  const packs = {
    'zh-CN': {
      language:'语言', home:'首页', week:'本周', deals:'省钱', messages:'消息', me:'我', publish:'发布', search:'搜索', back:'返回', close:'关闭', save:'保存', cancel:'取消', confirm:'确认', refresh:'刷新', loading:'正在读取内容...',
      '今日省钱':'今日省钱','扫码点餐':'扫码点餐','外卖点单':'外卖点单','扫码排队':'扫码排队','购物车':'购物车','订单详情':'订单详情','派送':'派送','到店自取':'到店自取','在线支付方式':'在线支付方式','加入购物车':'加入购物车','继续点菜':'继续点菜','优惠券':'优惠券','小费':'小费','应付合计':'应付合计','提交订单':'提交订单','排队成功':'排队成功','提前点菜':'提前点菜','租车预约':'租车预约','车辆日历':'车辆日历','租车管理':'租车管理','预约管理':'预约管理','车队看板':'车队看板','任务与排期':'任务与排期','服务库':'服务库','添加车辆':'添加车辆','编辑车辆':'编辑车辆','管理后台':'管理后台','商家管理':'商家管理','我的页面':'我的页面','成为商家':'成为商家','切换账号':'切换账号','分享我的主页':'分享我的主页','App 权限与提醒':'App 权限与提醒','关于本次公测':'关于本次公测','隐私与社区规则':'隐私与社区规则','导出我的数据':'导出我的数据','我的反馈':'我的反馈','公测反馈':'公测反馈','全部':'全部','推荐':'推荐','最新':'最新','美食':'美食','玩乐':'玩乐','好物':'好物','生活':'生活','社区':'社区','免费活动':'免费活动','本月活动':'本月活动','本周末活动':'本周末活动','遛娃':'遛娃','视频':'视频','登录':'登录','注册':'注册','退出':'退出','设置':'设置','删除':'删除','编辑':'编辑','查看详情':'查看详情','未登录':'未登录','已完成':'已完成','处理中':'处理中','等待确认':'等待确认','已确认':'已确认','可预约':'可预约','清洁中':'清洁中','维修中':'维修中','优惠券核销':'优惠券核销'
    },
    'zh-TW': {
      language:'語言', home:'首頁', week:'本週', deals:'省錢', messages:'消息', me:'我', publish:'發布', search:'搜尋', back:'返回', close:'關閉', save:'儲存', cancel:'取消', confirm:'確認', refresh:'重新整理', loading:'正在讀取內容...',
      '今日省钱':'今日省錢','扫码点餐':'掃碼點餐','外卖点单':'外賣點餐','扫码排队':'掃碼排隊','购物车':'購物車','订单详情':'訂單詳情','派送':'派送','到店自取':'到店自取','在线支付方式':'線上付款方式','加入购物车':'加入購物車','继续点菜':'繼續點餐','优惠券':'優惠券','小费':'小費','应付合计':'應付合計','提交订单':'提交訂單','排队成功':'排隊成功','提前点菜':'提前點餐','租车预约':'租車預約','车辆日历':'車輛日曆','租车管理':'租車管理','预约管理':'預約管理','车队看板':'車隊看板','任务与排期':'任務與排期','服务库':'服務庫','添加车辆':'新增車輛','编辑车辆':'編輯車輛','管理后台':'管理後台','商家管理':'商家管理','我的页面':'我的頁面','成为商家':'成為商家','切换账号':'切換帳號','分享我的主页':'分享我的主頁','App 权限与提醒':'App 權限與提醒','关于本次公测':'關於本次公測','隐私与社区规则':'隱私與社群規則','导出我的数据':'匯出我的資料','我的反馈':'我的回饋','公测反馈':'公測回饋','全部':'全部','推荐':'推薦','最新':'最新','美食':'美食','玩乐':'玩樂','好物':'好物','生活':'生活','社区':'社群','免费活动':'免費活動','本月活动':'本月活動','本周末活动':'本週末活動','遛娃':'遛娃','视频':'影片','登录':'登入','注册':'註冊','退出':'登出','设置':'設定','删除':'刪除','编辑':'編輯','查看详情':'查看詳情','未登录':'未登入','已完成':'已完成','处理中':'處理中','等待确认':'等待確認','已确认':'已確認','可预约':'可預約','清洁中':'清潔中','维修中':'維修中','优惠券核销':'優惠券核銷'
    },
    en: {
      language:'Language', home:'Home', week:'Week', deals:'Deals', messages:'Messages', me:'Me', publish:'Post', search:'Search', back:'Back', close:'Close', save:'Save', cancel:'Cancel', confirm:'Confirm', refresh:'Refresh', loading:'Loading...',
      '今日省钱':'Today\'s Deals','扫码点餐':'Table Ordering','外卖点单':'Takeout Order','扫码排队':'Join Waitlist','购物车':'Cart','订单详情':'Order Details','派送':'Delivery','到店自取':'Pickup','在线支付方式':'Online Payment','加入购物车':'Add to Cart','继续点菜':'Continue Ordering','优惠券':'Coupons','小费':'Tip','应付合计':'Total Due','提交订单':'Place Order','排队成功':'You\'re in Line','提前点菜':'Pre-order','租车预约':'Car Rental','车辆日历':'Vehicle Calendar','租车管理':'Rental Management','预约管理':'Reservations','车队看板':'Fleet Dashboard','任务与排期':'Tasks & Schedule','服务库':'Service Library','添加车辆':'Add Vehicle','编辑车辆':'Edit Vehicle','管理后台':'Admin Center','商家管理':'Merchant Management','我的页面':'My Profile','成为商家':'Become a Merchant','切换账号':'Switch Account','分享我的主页':'Share My Profile','App 权限与提醒':'App Permissions & Reminders','关于本次公测':'About This Beta','隐私与社区规则':'Privacy & Community Rules','导出我的数据':'Export My Data','我的反馈':'My Feedback','公测反馈':'Beta Feedback','全部':'All','推荐':'For You','最新':'Latest','美食':'Food','玩乐':'Fun','好物':'Finds','生活':'Lifestyle','社区':'Community','免费活动':'Free Events','本月活动':'This Month','本周末活动':'This Weekend','遛娃':'Kids','视频':'Video','登录':'Sign In','注册':'Sign Up','退出':'Sign Out','设置':'Settings','删除':'Delete','编辑':'Edit','查看详情':'View Details','未登录':'Guest','已完成':'Completed','处理中':'In Progress','等待确认':'Awaiting Confirmation','已确认':'Confirmed','可预约':'Available','清洁中':'Cleaning','维修中':'Maintenance','优惠券核销':'Coupon Redemption'
    }
  };

  const normalized = value => String(value || '').replace(/\s+/g, ' ').trim();
  const reverse = value => {
    const input = normalized(value);
    for (const [zh, translated] of Object.entries(packs['zh-TW'])) if (input === translated) return zh;
    for (const [zh, translated] of Object.entries(packs.en)) if (input === translated) return zh;
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
    root.querySelectorAll?.('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    root.querySelectorAll?.('[placeholder],[title],[aria-label]').forEach(el => {
      if (skip(el)) return;
      ['placeholder','title','aria-label'].forEach(attr => { if (el.hasAttribute(attr)) el.setAttribute(attr, applyText(el.getAttribute(attr))); });
    });
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes=[]; let node;
    while ((node=walker.nextNode())) nodes.push(node);
    nodes.forEach(textNode => { if (!skip(textNode.parentElement)) textNode.nodeValue = applyText(textNode.nodeValue); });
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
  style.textContent='.lsh-lang-backdrop{position:fixed;inset:0;z-index:9998;background:rgba(24,27,22,.38)}.lsh-lang-sheet{position:fixed;z-index:9999;left:0;right:0;bottom:0;padding:18px 16px calc(22px + env(safe-area-inset-bottom));border-radius:18px 18px 0 0;background:#fffffc;color:#292b27;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;box-shadow:0 -12px 40px rgba(0,0,0,.16)}.lsh-lang-sheet header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;font-size:17px}.lsh-lang-sheet header button{width:34px;height:34px;border:0;border-radius:50%;background:#efebe0;font-size:23px}.lsh-lang-choice{display:flex;width:100%;align-items:center;justify-content:space-between;padding:15px 12px;margin-top:8px;border:1px solid #e2ded3;border-radius:10px;background:#fff;font:700 15px inherit;color:#292b27}.lsh-lang-choice.on{border-color:#315f43;background:#e1ecdf;color:#244c35}.lsh-lang-choice i{font-style:normal;font-size:18px}';
  document.head.appendChild(style);
  window.LeshenghuoI18n = { getLanguage, setLanguage, openPicker, closePicker, translate:apply, t };
  let pending=false;
  const observe = () => new MutationObserver(() => { if(pending) return; pending=true; setTimeout(() => { pending=false; translateTree(); }, 30); }).observe(document.body, { childList:true, subtree:true });
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => { apply(); observe(); });
  else { apply(); observe(); }
})();
