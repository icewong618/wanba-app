/* ---------------- state ---------------- */
let currentTab = 'home';
const CATS = [
  {key:'全部'},
  {key:'美食', icon:'food', label:'吃喝'},
  {key:'玩乐', icon:'calendar'},
  {key:'好物', icon:'bag'},
  {key:'生活', icon:'home'},
  {key:'社区', icon:'message'},
];
const MERCHANT_CATEGORY_CONFIG = [
  {key:'餐饮饮品', subcategories:['餐厅','奶茶','咖啡','烘焙','甜品'], features:'菜单、桌号点餐、加菜、会员积分、优惠券'},
  {key:'零售好物', subcategories:['超市','服装','美妆','礼品','母婴','数码'], features:'商品目录、库存状态、线上购买、限时折扣、会员积分'},
  {key:'服务预约', subcategories:['美发','美甲','美容','摄影','维修','家政','宠物'], features:'服务项目、预约时段、技师或员工、次数卡与会员权益'},
  {key:'亲子教育', subcategories:['托班','培训','画室','夏令营','儿童活动'], features:'课程报名、年龄范围、活动日期、家长通知、签到核销'},
  {key:'休闲娱乐', subcategories:['KTV','桌游','电玩','密室','酒吧','影院'], features:'场次、预订、人数、套餐、活动报名、优惠券'},
  {key:'住宿旅游', subcategories:['酒店','民宿','旅行社','景点','租车'], features:'房型或产品、日期库存、预订咨询、路线地图、套餐'},
  {key:'交通出行', subcategories:['车辆销售','汽车租赁','汽车维修','汽车美容','驾校','停车服务','物流配送'], features:'车辆展示、试驾或预约、报价咨询、路线地图与出行服务'},
  {key:'房产生活服务', subcategories:['房屋出租','地产经纪','搬家','保险','汽车服务'], features:'房源或服务列表、筛选、预约看房、报价咨询、地图定位'},
  {key:'专业服务', subcategories:['律师','会计','留学','设计','翻译','保险'], features:'服务方案、案例展示、咨询预约、联系入口'},
  {key:'社区公益与组织', subcategories:['社团','教会','非营利机构','社区中心'], features:'公告、活动日历、报名、志愿者、捐赠链接'}
];
const POST_SUBCATEGORIES = {
  '美食':['探店','家常菜','饮品咖啡','烘焙甜品','优惠套餐','外卖推荐'],
  '玩乐':['亲子遛娃','周末活动','户外运动','展览演出','旅行攻略','影视追剧'],
  '好物':['日用好物','美妆穿搭','数码家电','家居用品','母婴宠物','优惠折扣'],
  '生活':['本地服务','健康运动','学习成长','办事指南','邻里求助','生活分享'],
  '社区':['二手交易','房屋出租','求职招聘','拼车搭子','失物招领','邻里互助']
};
const FEED_INTEREST_OPTIONS = [
  {key:'food',label:'美食探店',icon:'food',categories:['美食'],subcategories:['探店','家常菜','烘焙甜品'],keywords:['餐厅','美食','探店','吃饭']},
  {key:'coffee',label:'咖啡饮品',icon:'food',categories:['美食'],subcategories:['饮品咖啡'],keywords:['咖啡','奶茶','饮品','茶饮']},
  {key:'parenting',label:'遛娃亲子',icon:'user',categories:['玩乐','好物'],subcategories:['亲子遛娃','母婴宠物'],keywords:['遛娃','亲子','宝宝','儿童']},
  {key:'weekend',label:'周末活动',icon:'calendar',categories:['玩乐'],subcategories:['周末活动','展览演出'],keywords:['活动','展览','演出','市集']},
  {key:'outdoor',label:'户外运动',icon:'map',categories:['玩乐','生活'],subcategories:['户外运动','健康运动'],keywords:['徒步','露营','运动','滑雪']},
  {key:'travel',label:'旅行攻略',icon:'map',categories:['玩乐'],subcategories:['旅行攻略'],keywords:['旅行','旅游','自驾','攻略']},
  {key:'photography',label:'摄影记录',icon:'edit',categories:['生活','玩乐'],keywords:['摄影','拍照','相机','照片']},
  {key:'screen',label:'影视追剧',icon:'video',categories:['玩乐'],subcategories:['影视追剧'],keywords:['电影','电视剧','影视','综艺','追剧','剧集']},
  {key:'anime',label:'漫画二次元',icon:'spark',categories:['玩乐'],subcategories:['影视追剧'],keywords:['漫画','二次元','动漫','cosplay']},
  {key:'secondhand',label:'二手好物',icon:'bag',categories:['社区','好物'],subcategories:['二手交易','日用好物'],keywords:['二手','转让','闲置','出闲置']},
  {key:'rental',label:'租房找室友',icon:'home',categories:['社区'],subcategories:['房屋出租'],keywords:['租房','房屋','室友','转租']},
  {key:'friends',label:'交友搭子',icon:'message',categories:['社区','玩乐'],subcategories:['拼车搭子'],keywords:['交友','搭子','拼车','同城']},
  {key:'jobs',label:'求职招聘',icon:'store',categories:['社区'],subcategories:['求职招聘'],keywords:['招聘','求职','工作','兼职']},
  {key:'deals',label:'省钱优惠',icon:'bag',categories:['好物','美食'],subcategories:['优惠折扣','优惠套餐'],keywords:['折扣','优惠','省钱','deal']},
  {key:'tech',label:'数码家电',icon:'bag',categories:['好物'],subcategories:['数码家电'],keywords:['数码','手机','电脑','家电']},
  {key:'home',label:'家居生活',icon:'home',categories:['好物','生活'],subcategories:['家居用品','生活分享'],keywords:['家居','收纳','装修','日常']},
  {key:'wellness',label:'健康运动',icon:'heart',categories:['生活','玩乐'],subcategories:['健康运动','户外运动'],keywords:['健康','健身','瑜伽','跑步']}
];
const COMMUNITY_POST_CONFIG = {
  '二手交易': { title:'交易信息', hint:'请如实填写价格与成色；不要在公开内容中留下银行卡、证件等敏感信息。', fields:[['price','价格','如 $20'],['condition','成色','如 九成新'],['area','交易区域','如 Alhambra']] },
  '房屋出租': { title:'房源信息', hint:'请勿公开精确门牌号或身份证明；看房、签约和付款请自行核实。', fields:[['rent','月租','如 $1,800'],['layout','户型','如 2B1B'],['area','区域','如 Pasadena']] },
  '求职招聘': { title:'招聘信息', hint:'请如实说明岗位与薪资；乐生活不支持向求职者收取任何费用。', fields:[['role','岗位','如 前台兼职'],['company','公司/店铺','如 乐生活咖啡'],['pay','薪资范围','如 $18-22/小时'],['area','工作区域','如 洛杉矶市中心']] }
};
const CAT_ALIASES = {
  '吃喝':'美食',
  '喝喝':'美食',
  '吃吃':'美食',
  '餐饮':'美食',
  '美食餐饮':'美食',
  'food':'美食',
  'restaurant':'美食',
  '玩玩':'玩乐',
  '看看':'玩乐',
  '活动':'玩乐',
  '娱乐':'玩乐',
  'event':'玩乐',
  'events':'玩乐',
  'fun':'玩乐',
  '买买':'好物',
  '购物':'好物',
  '省钱':'好物',
  '折扣':'好物',
  'deal':'好物',
  'deals':'好物',
  'shop':'好物',
  'shopping':'好物',
  '日常':'生活',
  '本地':'生活',
  'local':'生活',
  '邻里':'社区',
  '公告':'社区',
  'community':'社区'
};
const POST_SUBCATEGORY_ALIASES = {
  '兴趣社群':'影视追剧',
  '影视':'影视追剧',
  '电影':'影视追剧',
  '电视剧':'影视追剧',
  '追剧':'影视追剧'
};
const ICONS = {
  search:'<circle cx="11" cy="11" r="7"></circle><path d="M20 20l-3.5-3.5"></path>',
  home:'<path d="M3 11l9-7 9 7"></path><path d="M5 10v10h14V10"></path><path d="M10 20v-6h4v6"></path>',
  calendar:'<rect x="4" y="5" width="16" height="15" rx="2"></rect><path d="M8 3v4M16 3v4M4 10h16"></path>',
  bag:'<path d="M6 8h12l-1 12H7z"></path><path d="M9 8a3 3 0 0 1 6 0"></path>',
  card:'<rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 10h18"></path><path d="M7 15h3"></path>',
  link:'<path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1"></path><path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1"></path>',
  message:'<path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-4 3v-3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"></path>',
  food:'<path d="M6 3v18M10 3v18M6 8h4"></path><path d="M16 3v18"></path><path d="M16 3c3 2 4 5 2 8"></path>',
  user:'<circle cx="12" cy="8" r="4"></circle><path d="M4 21a8 8 0 0 1 16 0"></path>',
  store:'<path d="M4 10h16"></path><path d="M5 10l1-5h12l1 5"></path><path d="M6 10v10h12V10"></path><path d="M9 20v-6h6v6"></path>',
  bot:'<rect x="5" y="7" width="14" height="11" rx="3"></rect><path d="M12 3v4M8 12h.01M16 12h.01"></path>',
  edit:'<path d="M4 20h4l11-11a2.5 2.5 0 0 0-4-4L4 16z"></path><path d="M13.5 6.5l4 4"></path>',
  spark:'<path d="M12 3l1.5 5L18 10l-4.5 2L12 17l-1.5-5L6 10l4.5-2z"></path>',
  eye:'<path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z"></path><circle cx="12" cy="12" r="3"></circle>',
  heart:'<path d="M20.5 8.5c0 5-8.5 10.5-8.5 10.5S3.5 13.5 3.5 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 8.5 2.5z"></path>',
  phone:'<path d="M22 16.5v3a2 2 0 0 1-2.2 2 19 19 0 0 1-8.3-3A18.7 18.7 0 0 1 5.5 12 19 19 0 0 1 2.5 3.7 2 2 0 0 1 4.5 1.5h3a2 2 0 0 1 2 1.7l.5 3a2 2 0 0 1-.6 1.8L8.2 9.2a15 15 0 0 0 6.6 6.6l1.2-1.2a2 2 0 0 1 1.8-.6l3 .5a2 2 0 0 1 1.7 2z"></path>',
  map:'<path d="M12 21s7-5.5 7-12a7 7 0 0 0-14 0c0 6.5 7 12 7 12z"></path><circle cx="12" cy="9" r="2.5"></circle>',
  car:'<path d="M3 16v-4l2-5h14l2 5v4"></path><path d="M5 16h14"></path><path d="M7 12h10"></path><circle cx="7" cy="17" r="2"></circle><circle cx="17" cy="17" r="2"></circle>',
  upload:'<path d="M12 16V4"></path><path d="M7 9l5-5 5 5"></path><path d="M5 20h14"></path>',
  video:'<rect x="3" y="6" width="13" height="12" rx="2"></rect><path d="M16 10l5-3v10l-5-3z"></path>',
  alert:'<path d="M12 3l10 18H2z"></path><path d="M12 9v5M12 17h.01"></path>',
  trash:'<path d="M4 7h16"></path><path d="M10 11v6M14 11v6"></path><path d="M6 7l1 14h10l1-14"></path><path d="M9 7V4h6v3"></path>',
  share:'<path d="M4 12v7h16v-7"></path><path d="M12 15V3"></path><path d="M7 8l5-5 5 5"></path>',
  lock:'<rect x="5" y="10" width="14" height="10" rx="2"></rect><path d="M8 10V7a4 4 0 0 1 8 0v3"></path>',
  inbox:'<path d="M4 4h16v16H4z"></path><path d="M4 13h5l2 3h2l2-3h5"></path>',
  star:'<path d="M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9z"></path>',
  menu:'<path d="M4 7h16"></path><path d="M4 12h16"></path><path d="M4 17h16"></path>',
  settings:'<path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5z"></path><path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.05.05a2 2 0 0 1-2.83 2.83l-.05-.05A1.8 1.8 0 0 0 15 19.4a1.8 1.8 0 0 0-1 .6V20a2 2 0 0 1-4 0v-.08a1.8 1.8 0 0 0-1-.6 1.8 1.8 0 0 0-1.98.36l-.05.05a2 2 0 0 1-2.83-2.83l.05-.05A1.8 1.8 0 0 0 4.6 15a1.8 1.8 0 0 0-.6-1H4a2 2 0 0 1 0-4h.08a1.8 1.8 0 0 0 .6-1 1.8 1.8 0 0 0-.36-1.98l-.05-.05a2 2 0 0 1 2.83-2.83l.05.05A1.8 1.8 0 0 0 9 4.6a1.8 1.8 0 0 0 1-.6V4a2 2 0 0 1 4 0v.08a1.8 1.8 0 0 0 1 .6 1.8 1.8 0 0 0 1.98-.36l.05-.05a2 2 0 0 1 2.83 2.83l-.05.05A1.8 1.8 0 0 0 19.4 9c.2.34.4.66.6 1H20a2 2 0 0 1 0 4h-.08a1.8 1.8 0 0 0-.52 1z"></path>',
  logout:'<path d="M10 17l5-5-5-5"></path><path d="M15 12H3"></path><path d="M14 5h5v14h-5"></path>'
};
function uiIcon(name, size=18, extra=''){
  const body = ICONS[name] || ICONS.spark;
  return `<span class="ui-icon ${extra}" style="width:${size}px;height:${size}px;"><svg viewBox="0 0 24 24">${body}</svg></span>`;
}
function normalizeCategory(cat){
  const raw = String(cat || '').trim();
  if(!raw) return '生活';
  if(CATS.some(x => x.key === raw)) return raw;
  return CAT_ALIASES[raw] || '生活';
}
function catIcon(cat, size){
  const c = CATS.find(x => x.key === normalizeCategory(cat));
  if(!c || !c.icon) return uiIcon('home', size);
  return uiIcon(c.icon, size);
}
function catLabel(cat){
  const c = CATS.find(x => x.key === normalizeCategory(cat));
  return (c && c.label) || c?.key || '生活';
}
function merchantCategoryConfig(category){
  return MERCHANT_CATEGORY_CONFIG.find(item => item.key === String(category || '').trim()) || null;
}
function merchantCategoryLabel(category){
  const raw = String(category || '').trim();
  return merchantCategoryConfig(raw)?.key || (CATS.some(item => item.key === raw) ? catLabel(raw) : raw || '未分类');
}
function merchantCategoryIcon(category, size=14){
  const key = String(category || '').trim();
  const icons = {
    '餐饮饮品':'food', '零售好物':'bag', '服务预约':'settings', '亲子教育':'user',
    '休闲娱乐':'calendar', '住宿旅游':'map', '交通出行':'car', '房产生活服务':'home',
    '专业服务':'store', '社区公益与组织':'message'
  };
  return icons[key] ? uiIcon(icons[key], size) : catIcon(key, size);
}
function merchantCategorySelectOptions(selected){
  const current = String(selected || '').trim();
  const options = MERCHANT_CATEGORY_CONFIG.map(item => `<option value="${escAttr(item.key)}" ${current === item.key ? 'selected' : ''}>${escHtml(item.key)}</option>`);
  if(current && !merchantCategoryConfig(current)) options.unshift(`<option value="${escAttr(current)}" selected>${escHtml(current)}</option>`);
  return `<option value="">请选择主营类型</option>${options.join('')}`;
}
function merchantApplicationFeatureText(category){
  const config = merchantCategoryConfig(category);
  return config ? `审核通过后可开启：${config.features}` : '请先选择主营类型。';
}
function renderMerchantApplicationSubcategories(selected=''){
  const category = document.getElementById('maCategory')?.value || '';
  const select = document.getElementById('maSubcategory');
  const feature = document.getElementById('maCategoryFeature');
  const config = merchantCategoryConfig(category);
  if(select){
    const options = config ? config.subcategories : [];
    const current = String(selected || select.value || '').trim();
    select.innerHTML = `<option value="">请选择细分业态</option>${options.map(item => `<option value="${escAttr(item)}" ${current === item ? 'selected' : ''}>${escHtml(item)}</option>`).join('')}${current && !options.includes(current) ? `<option value="${escAttr(current)}" selected>${escHtml(current)}</option>` : ''}`;
  }
  if(feature) feature.textContent = merchantApplicationFeatureText(category);
}
function postSubcategoryOptions(category){ return POST_SUBCATEGORIES[normalizeCategory(category)] || []; }
function normalizePostSubcategory(category, subcategory){
  const raw = String(subcategory || '').trim();
  if(!raw) return null;
  const normalized = POST_SUBCATEGORY_ALIASES[raw] || raw;
  return postSubcategoryOptions(category).includes(normalized) ? normalized : null;
}
function isValidPostSubcategory(category, subcategory){ return !!normalizePostSubcategory(category, subcategory); }
function postCategoryPath(category, subcategory){
  const main = catLabel(category);
  const normalized = normalizePostSubcategory(category, subcategory);
  return normalized ? `${main} · ${normalized}` : main;
}
function cardCategoryTag(cat, subcategory=''){
  const normalized = normalizePostSubcategory(cat, subcategory);
  const label = normalized || catLabel(cat);
  const icon = normalized === '影视追剧' ? uiIcon('video', 13) : catIcon(cat, 13);
  return `<span class="cat-tag">${icon}<span>${escHtml(label)}</span></span>`;
}
const QUICKLINKS = [
  {key:'遛娃', icon:'home'},
  {key:'免费活动', icon:'bag'},
  {key:'本月活动', icon:'calendar'},
  {key:'本周末活动', icon:'calendar'},
  {key:'视频', icon:'video', action:'youtube'},
  {key:'零工家政', icon:'user', action:'services'},
];
const AVATAR_COLORS = ['#5F8567','#C2603B','#4C87A6','#C2416B','#8A6FB0','#B08B3C'];
function avatarColor(name){
  let h=0; for(const c of name) h=(h*31+c.charCodeAt(0))%AVATAR_COLORS.length;
  return AVATAR_COLORS[h];
}
function initials(name){ return name.slice(0,1); }

/* ====== 真实头像缓存（评论等处按 user_id 显示真实头像）（2.94修复） ====== */
window._avatarCache = window._avatarCache || {};
window._profileCache = window._profileCache || {};
window._merchantLogoCache = window._merchantLogoCache || {};
window._merchantVerifiedCache = window._merchantVerifiedCache || {};
window._merchantNameCache = window._merchantNameCache || {};
window._merchantIdentityCache = window._merchantIdentityCache || {};
const identityCache = window.LeshenghuoIdentityCache?.create({
  getSession: () => session,
  getCurrentUser: () => currentUser,
  getCurrentMerchant: () => currentMerchant
});
function setMerchantLogoCache(userId, logo){
  identityCache?.setMerchantLogo(userId, logo);
}
function setMerchantIdentityCache(userId, merchant){
  identityCache?.setMerchantIdentity(userId, merchant);
}
function isVerifiedMerchantUser(userId){
  return identityCache?.isVerifiedMerchant(userId) || false;
}
function refreshAvatarDisplays(userId){
  if(!userId) return;
  renderFeed();
  const weekPage = document.getElementById('page-week');
  if(weekPage && weekPage.classList.contains('active')) renderWeekFeed();
  if(activePostId) renderPostModal();
  if(currentTab === 'profile') initProfilePage();
  if(document.getElementById('followDirectoryOverlay')?.classList.contains('open')) renderFollowDirectory();
}
function cacheUserAvatar(userId, avatar){
  identityCache?.cacheAvatar(userId, avatar);
}
function syncCurrentUserAuthorName(name){
  if(!(session && session.user) || !name) return;
  let changed = false;
  posts.forEach(p => {
    if(p.user_id === session.user.id && p.author !== name){
      p.author = name;
      changed = true;
    }
  });
  if(changed){
    savePosts();
    renderFeed();
    const weekPage = document.getElementById('page-week');
    if(weekPage && weekPage.classList.contains('active')) renderWeekFeed();
    if(activePostId) renderPostModal();
  }
}
function resolveAvatarUrl(user_id){
  return identityCache?.resolveAvatar(user_id) || null;
}
function avatarImageSrc(userId, url){
  return identityCache?.avatarImageSrc(userId, url) || String(url || '');
}
function setProfileCache(profile){
  identityCache?.setProfile(profile);
}
function cachedProfile(userId, fallbackName){
  return identityCache?.cachedProfile(userId, fallbackName) || { user_id:userId, name:fallbackName || '乐生活用户', avatar:null, bio:'', tags:[], gender:'', birth:'', cover:'' };
}
// 依赖 Supabase 配置，配置声明后再创建，避免启动时访问暂未初始化的常量。
let identityLoader = null;
async function loadProfilesForIds(userIds){
  return identityLoader?.loadProfiles(userIds) || [];
}
/* 批量拉取一批 user_id 的头像并写入缓存，已认证商家优先使用店铺Logo */
async function ensureAvatarsFor(userIds, forceRefresh=false){
  return identityLoader?.ensureAvatars(userIds, forceRefresh) || false;
}
/* 头像圆圈：有真实头像显示图片，否则回退成色块+首字（class="avatar" 走已有CSS尺寸） */
function avatarCircleHtml(name, user_id){
  const url = resolveAvatarUrl(user_id);
  const merchantRing = isVerifiedMerchantUser(user_id) ? 'box-shadow:0 0 0 2px var(--sage-light);' : '';
  if(url) return `<span class="avatar" style="overflow:hidden;padding:0;${merchantRing}"><img src="${escAttr(avatarImageSrc(user_id, url))}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block;"></span>`;
  return `<span class="avatar" style="background:${avatarColor(name||'友')};${merchantRing}">${initials(name||'友')}</span>`;
}
function avatarCircleSizedHtml(name, userId, size){
  const url = resolveAvatarUrl(userId);
  const merchantRing = isVerifiedMerchantUser(userId) ? 'box-shadow:0 0 0 2px var(--sage-light);' : '';
  if(url) return `<span class="avatar" style="overflow:hidden;padding:0;width:${size}px;height:${size}px;${merchantRing}"><img src="${escAttr(avatarImageSrc(userId, url))}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block;"></span>`;
  return `<span class="avatar" style="background:${avatarColor(name||'友')};width:${size}px;height:${size}px;font-size:${Math.max(10, Math.round(size * 0.38))}px;${merchantRing}">${initials(name||'友')}</span>`;
}
function avatarHomeLinkHtml(userId, name, size){
  if(!userId) return avatarCircleSizedHtml(name, userId, size);
  const uid = String(userId).replace(/'/g, '');
  const safeName = String(name || '乐生活用户').replace(/'/g, '');
  return `<span onclick="event.stopPropagation();openUserPublicPage('${uid}','${safeName}')" style="cursor:pointer;display:inline-flex;align-items:center;flex-shrink:0;" title="查看主页">${avatarCircleSizedHtml(name, userId, size)}</span>`;
}
function identityBadgeHtml(userId){
  return isVerifiedMerchantUser(userId)
    ? `<span style="display:inline-flex;align-items:center;gap:3px;background:var(--sage-light);color:var(--sage-dark);font-size:10px;font-weight:800;padding:1px 6px;border-radius:999px;white-space:nowrap;">✓ 商家</span>`
    : '';
}
function authorNameHtml(name, userId){
  return `<span style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escHtml(name || '乐生活用户')}</span>${identityBadgeHtml(userId)}`;
}

// ====== 用户信息管理 ======
const APP_VERSION = '5.613';
const APP_CACHE_VERSION_KEY = 'leshenghuo_app_cache_version';
const APP_RELOAD_VERSION_KEY = 'leshenghuo_reload_version_key';
const APP_VERSION_MANIFEST = 'version.json';
// Keep runtime configuration ahead of every shared API module initialization.
const SUPABASE_URL = 'https://ptxdxepmggmjcndgukjk.supabase.co';
const SUPABASE_KEY = 'sb_publishable_h3x-jnCW-N8Nx3P6t_D8rA_CS9dgkP-';
console.info(`乐生活 当前版本：v${APP_VERSION}`);

function syncBrandLogoLanguage(){
  const language = window.LeshenghuoI18n?.getLanguage?.()
    || localStorage.getItem('leshenghuo_language')
    || 'zh-CN';
  const english = String(language).toLowerCase().startsWith('en');
  document.querySelectorAll('.brand-logo').forEach(logo => {
    logo.src = english ? './assets/brand/lockup-en.png' : './assets/brand/lockup-cn.png';
    logo.alt = english ? 'Scoop City' : '乐生活';
  });
}
document.addEventListener('leshenghuo:languagechange', syncBrandLogoLanguage);
document.addEventListener('DOMContentLoaded', syncBrandLogoLanguage, { once:true });

const appUpdateManager = window.LeshenghuoAppUpdateManager?.create({
  version: APP_VERSION,
  cacheVersionKey: APP_CACHE_VERSION_KEY,
  reloadVersionKey: APP_RELOAD_VERSION_KEY,
  manifestPath: APP_VERSION_MANIFEST,
  isEmbedded: isEmbeddedAppEntry
});
function updateNetworkOfflineOverlay(){ return appUpdateManager?.updateOfflineOverlay(); }
function retryNetworkConnection(){ return appUpdateManager?.retryNetwork(); }
window.retryNetworkConnection = retryNetworkConnection;
appUpdateManager?.bindNetwork();

function syncVisibleAppVersion(){ return appUpdateManager?.syncVisibleVersion(); }

function isEmbeddedAppEntry(){
  try {
    const params = new URLSearchParams(window.location.search || '');
    const ua = navigator.userAgent || '';
    const capacitor = window.Capacitor;
    const nativeCapacitor = !!(capacitor && (
      (typeof capacitor.isNativePlatform === 'function' && capacitor.isNativePlatform())
      || (typeof capacitor.getPlatform === 'function' && capacitor.getPlatform() !== 'web')
    ));
    const nativeBridge = !!window.webkit?.messageHandlers?.capacitor
      || !!window.webkit?.messageHandlers?.bridge
      || !!window.androidBridge;
    return params.get('embedded_app') === '1'
      || !!params.get('app_v')
      || sessionStorage.getItem('leshenghuo_embedded_app_entry') === '1'
      || nativeCapacitor
      || nativeBridge
      || window.parent !== window
      || navigator.standalone === true
      || (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches)
      || /\bwv\b|WebView|; wv\)/i.test(ua);
  } catch(e){
    return false;
  }
}

// Native QR links can wake the App at its default home URL. Keep routing in a
// shared module so restaurant, week, deals and messages links behave alike.
const nativeDeepLinks = window.LeshenghuoNativeDeepLinks?.create({
  getAppVersion: () => APP_VERSION,
  isEmbedded: isEmbeddedAppEntry
});
function nativeRestaurantOrderUrl(rawUrl){ return nativeDeepLinks?.targetFor(rawUrl); }
function openNativeRestaurantOrder(payload){ return nativeDeepLinks?.open(payload); }
function bindNativeRestaurantDeepLinks(){ return nativeDeepLinks?.bind(); }
bindNativeRestaurantDeepLinks();

function clearOldVersionCache(){ return appUpdateManager?.clearOldVersionCache(); }
function setLaunchStatus(text){ return appUpdateManager?.setLaunchStatus(text); }
async function clearWebRuntimeCaches(){ return appUpdateManager?.clearRuntimeCaches(); }
function versionManifestUrl(){ return appUpdateManager?.manifestUrl(); }
async function replaceDocumentWithFreshIndex(version){ return appUpdateManager?.replaceDocument(version); }
async function checkRemoteAppVersion(){ return appUpdateManager?.checkRemoteVersion(); }
function hideLaunchScreen(){ return appUpdateManager?.hideLaunch(); }
function notifyAppReady(){ return appUpdateManager?.notifyReady(); }

function appOverlayOpen(id){ return !!document.getElementById(id)?.classList.contains('open'); }
function clearStaleAppScrollLocks(){
  const root = document.documentElement;
  const body = document.body;
  if(!appOverlayOpen('commentComposerOverlay')){
    root.classList.remove('reply-composer-open');
    body.classList.remove('reply-composer-open');
  }
  if(!appOverlayOpen('searchOverlay')) body.classList.remove('search-page-open');
  if(!document.getElementById('homeMenuOverlay')?.classList.contains('open')) body.classList.remove('home-menu-open');
}
function closeTransientNavigationLayer(){
  if(appOverlayOpen('commentComposerOverlay')){ closeCommentComposer(); return true; }
  if(appOverlayOpen('shareOverlay')){ closeShareSheet(); return true; }
  if(appOverlayOpen('contentReportOverlay')){ closeContentReport(); return true; }
  if(appOverlayOpen('homeFeatureOverlay')){ closeHomeFeature(); return true; }
  if(appOverlayOpen('ownerSheet')){ closeOwnerSheet(); return true; }
  const menu = document.getElementById('homeMenuOverlay');
  if(menu?.classList.contains('settings-open')){ closeHomeSettings(); return true; }
  if(menu?.classList.contains('open')){ closeHomeMenu(); return true; }
  return false;
}
function appCurrentRoute(){
  if(appOverlayOpen('searchOverlay')) return { type:'search' };
  if(appOverlayOpen('postOverlay') && activePostId != null) return { type:'post', id:activePostId };
  if(appOverlayOpen('merchantPublicOverlay')){
    const overlay = document.getElementById('merchantPublicOverlay');
    return { type:'merchant', userId:overlay?.dataset.userId || '', slug:overlay?.dataset.slug || '' };
  }
  if(appOverlayOpen('userPublicOverlay')) return { type:'user', userId:document.getElementById('userPublicOverlay')?.dataset.userId || '', name:document.getElementById('userPublicOverlay')?.dataset.name || '' };
  return { type:'tab', tab:currentTab || 'home' };
}
function renderAppRoute(route){
  clearStaleAppScrollLocks();
  closeSearchPage();
  closePost();
  closeMerchantPublicPage();
  closeUserPublicPage();
  if(route.type === 'tab') switchTab(route.tab || 'home');
  else if(route.type === 'search') openSearchPage();
  else if(route.type === 'post') openPost(route.id);
  else if(route.type === 'merchant'){
    if(route.userId) openMerchantPublicPage(route.userId);
    else if(route.slug) openMerchantPublicPageBySlug(route.slug);
  }
  else if(route.type === 'user') openUserPublicPage(route.userId, route.name || '');
}
const appNavigation = window.LeshenghuoAppNavigation?.create({
  getCurrentRoute:appCurrentRoute,
  renderRoute:renderAppRoute,
  closeTransient:closeTransientNavigationLayer,
  isGestureEnabled:() => isEmbeddedAppEntry() || document.documentElement.classList.contains('app-webview-entry'),
  onRouteChange:route => {
    const tab = route?.type === 'tab' ? route.tab : currentTab;
    if(tab) setBottomNavActive(tab);
  }
});
window.LeshenghuoNavigation = appNavigation;
window.appNavigateBack = () => appNavigation?.back() || false;
function routeTabFromLocation(){ return appNavigation?.rootTabFromLocation() || ''; }
function appGestureBack(){ return appNavigation?.back(); }
function appGestureForward(){ return appNavigation?.forward(); }
function bindAppEdgeGestures(){ return appNavigation?.bind(); }

let currentUser = {
  name: '未登录用户',
  bio: '登录后可编辑个人资料',
  gender: '',
  birth: '',          // 出生年月，如 '1999-06'
  age: null,
  location: '',
  tags: [],
  id: ''
};
let isDealAdmin = false;
let dealReviewRows = [];
let dealReviewBusy = {};
let currentMerchantApplication = null;
let merchantApplicationRows = [];
let merchantApplicationBusy = {};

/* ====== 用户注册/登录（Supabase Auth）====== */
let authMode = 'login';
let session = null; // {access_token, user}
let sessionRefreshInFlight = null;
const authSessionStore = window.LeshenghuoAuthSession?.create({ supabaseUrl: SUPABASE_URL, supabaseKey: SUPABASE_KEY });
const authApi = window.LeshenghuoAuthApi?.create({ supabaseUrl: SUPABASE_URL, supabaseKey: SUPABASE_KEY });
const engagementLoader = window.LeshenghuoEngagementLoader?.create({
  supabaseUrl: SUPABASE_URL,
  supabaseKey: SUPABASE_KEY,
  getCurrentUserId: () => session?.user?.id || null
});
const messageDataLoader = window.LeshenghuoMessageData?.create({
  supabaseUrl: SUPABASE_URL,
  getCurrentUserId: () => session?.user?.id || null,
  request: (url, options) => authedFetch(url, options)
});
const messageApi = window.LeshenghuoMessageApi?.create({
  supabaseUrl: SUPABASE_URL,
  request: (url, options) => authedFetch(url, options)
});
const merchantMembershipApi = window.LeshenghuoMerchantMembershipApi?.create({
  supabaseUrl: SUPABASE_URL,
  request: (url, options) => authedFetch(url, options)
});
const merchantPublicApi = window.LeshenghuoMerchantPublicApi?.create({
  supabaseUrl: SUPABASE_URL,
  request: (url, options) => authedFetch(url, options)
});
const profileStorage = window.LeshenghuoProfileStorage?.create({ getSession: () => session });
const profileApi = window.LeshenghuoProfileApi?.create({
  supabaseUrl: SUPABASE_URL,
  getCurrentUserId: () => session?.user?.id || null,
  request: (url, options) => authedFetch(url, options)
});
const engagementApi = window.LeshenghuoEngagementApi?.create({
  supabaseUrl: SUPABASE_URL,
  request: (url, options) => authedFetch(url, options)
});
const followApi = window.LeshenghuoFollowApi?.create({
  supabaseUrl: SUPABASE_URL,
  request: (url, options) => authedFetch(url, options)
});
const postDetailApi = window.LeshenghuoPostDetailApi?.create({
  supabaseUrl: SUPABASE_URL,
  publicHeaders: () => ({ apikey:SUPABASE_KEY, Authorization:`Bearer ${SUPABASE_KEY}` }),
  publicRequest: (url, options, timeout) => fetchPostFeed(url, options, timeout),
  authRequest: (url, options) => authedFetch(url, options)
});
const postApi = window.LeshenghuoPostApi?.create({
  supabaseUrl: SUPABASE_URL,
  authRequest: (url, options) => authedFetch(url, options)
});
const composeDraftStoreApi = window.LeshenghuoComposeDraftStore?.create();
const locationApi = window.LeshenghuoLocationApi?.create({
  supabaseUrl: SUPABASE_URL,
  request: (url, options) => authedFetch(url, options)
});
const feedbackApi = window.LeshenghuoFeedbackApi?.create({
  supabaseUrl: SUPABASE_URL,
  request: (url, options) => authedFetch(url, options)
});
const feedbackAttachmentsApi = window.LeshenghuoFeedbackAttachmentsApi?.create({
  supabaseUrl: SUPABASE_URL,
  request: (url, options) => authedFetch(url, options)
});
const contentReportApi = window.LeshenghuoContentReportApi?.create({
  supabaseUrl: SUPABASE_URL,
  request: (url, options) => authedFetch(url, options)
});
const adminFeedbackApi = window.LeshenghuoAdminFeedbackApi?.create({
  supabaseUrl: SUPABASE_URL,
  request: (url, options) => authedFetch(url, options)
});
const adminCenterApi = window.LeshenghuoAdminCenterApi?.create({
  supabaseUrl: SUPABASE_URL,
  request: (url, options) => authedFetch(url, options)
});
const adminAccessApi = window.LeshenghuoAdminAccessApi?.create({
  supabaseUrl: SUPABASE_URL,
  request: (url, options) => authedFetch(url, options)
});
const merchantApplicationApi = window.LeshenghuoMerchantApplicationApi?.create({
  supabaseUrl: SUPABASE_URL,
  request: (url, options) => authedFetch(url, options)
});
const merchantTeamApi = window.LeshenghuoMerchantTeamApi?.create({
  supabaseUrl: SUPABASE_URL,
  request: (url, options) => authedFetch(url, options)
});
const restaurantOrderApi = window.LeshenghuoRestaurantOrderApi?.create({
  supabaseUrl: SUPABASE_URL,
  request: (url, options) => authedFetch(url, options)
});
const restaurantDataApi = window.LeshenghuoRestaurantDataApi?.create({
  supabaseUrl: SUPABASE_URL,
  request: (url, options) => authedFetch(url, options)
});
const merchantCouponApi = window.LeshenghuoMerchantCouponApi?.create({
  supabaseUrl: SUPABASE_URL,
  request: (url, options) => authedFetch(url, options)
});
const rentalApi = window.LeshenghuoRentalApi?.create({
  supabaseUrl: SUPABASE_URL,
  request: (url, options) => authedFetch(url, options)
});
const merchantAnalyticsApi = window.LeshenghuoMerchantAnalyticsApi?.create({
  supabaseUrl: SUPABASE_URL,
  request: (url, options) => authedFetch(url, options)
});

function accessTokenExpiresSoon(token){
  return authSessionStore?.accessTokenExpiresSoon(token) ?? true;
}

function loadSession(){
  session = authSessionStore?.read() || null;
  // 启动先续期，再显示已登录 UI。否则资料、反馈和管理员请求会抢在旧令牌前面发出 401。
  if(session && session.refresh_token){
    return refreshSession().then(ok => {
      if(ok){
        console.log('✓ 登录令牌已续期');
        updateAuthUI();
        loadEngagement && loadEngagement();
        // 令牌确认续期成功后再拉取头像/昵称。
        fetchProfileFromDb();
        fetchMerchantProfile();
      }
      else {
        // 网络刚恢复、App 冷启动时偶发的续期失败不能直接把用户登出。
        // 先保留已存会话与本地资料，稍后在后台再试一次。
        console.warn('令牌续期暂时失败，保留本地登录状态并稍后重试');
        updateAuthUI();
        setTimeout(async () => {
          if(!(session && session.refresh_token)) return;
          const retried = await refreshSession();
          if(retried){ updateAuthUI(); fetchProfileFromDb(); fetchMerchantProfile(); }
        }, 8000);
      }
    });
  }
  updateAuthUI();
  return Promise.resolve(false);
}
function updateAuthUI(){
  const status = document.getElementById('authStatus');
  const inBtn = document.getElementById('authLoginBtn');
  const regBtn = document.getElementById('authRegBtn');
  const outBtn = document.getElementById('authOutBtn');
  if(session && session.user){
    const nick = (session.user.user_metadata && session.user.user_metadata.name) || session.user.email.split('@')[0];
    if(status) status.textContent = nick;
    if(inBtn) inBtn.style.display = 'none';
    if(regBtn) regBtn.style.display = 'none';
    if(outBtn) outBtn.style.display = 'flex';
    // 关键：切换到该账号自己的资料档案
    loadUserProfile();
    // Hydrate saved display and privacy preferences once the session is usable.
    // A failure here must never block the signed-in home screen.
    loadHomeAccountSettings?.(true).then(applyHomeAccountDisplayPreferences).catch(() => {});
    checkDealAdmin();
    checkFeedbackReplyNotices();
  } else {
    if(status) status.textContent = '未登录（游客模式）';
    if(inBtn) inBtn.style.display = 'flex';
    if(regBtn) regBtn.style.display = 'none';
    if(outBtn) outBtn.style.display = 'none';
    currentMerchant = null;
    currentMerchantApplication = null;
    isDealAdmin = false;
    updateMyFeedbackReplyBadge(0);
    updateDealReviewButton();
    loadUserProfile(); // 回到干净游客档案
  }
}
function openAuth(mode){
  authMode = mode === 'reset' ? 'reset' : 'login';
  document.getElementById('authModal').style.display = 'flex';
  document.getElementById('authMsg').textContent = '';
  renderAuthMode();
}
function closeAuth(){ document.getElementById('authModal').style.display = 'none'; }
function renderAuthMode(){
  const reset = authMode === 'reset';
  const title = document.getElementById('authTitle');
  const emailBlock = document.getElementById('authEmailBlock');
  const label = document.getElementById('authPassLabel');
  const confirmBlock = document.getElementById('authPassConfirmBlock');
  const submit = document.getElementById('authSubmit');
  const links = document.getElementById('authLinks');
  const hint = document.getElementById('authHint');
  if(title) title.textContent = reset ? '设置新密码' : '登录或注册 乐生活';
  if(emailBlock) emailBlock.style.display = reset ? 'none' : '';
  if(label) label.textContent = reset ? '新密码（至少10位，含字母和数字）' : '密码';
  if(confirmBlock) confirmBlock.style.display = reset ? '' : 'none';
  if(submit) submit.textContent = reset ? '保存新密码' : '继续';
  if(links){
    links.innerHTML = reset
      ? '<button onclick="openAuth(\'login\')" style="color:var(--sage-dark);">返回登入</button>'
      : '<button onclick="requestPasswordReset()" style="color:var(--berry);">忘记密码</button><button onclick="resendVerificationFromAuth()" style="color:var(--sage-dark);">重新发送验证邮件</button>';
  }
  if(hint) hint.textContent = reset ? '请设置新的登录密码。' : '首次使用该邮箱会自动创建乐生活账号。';
}
function toggleAuthPasswordVisibility(show){
  const input = document.getElementById('authPass');
  if(input) input.type = show ? 'text' : 'password';
  const confirm = document.getElementById('authPassConfirm');
  if(confirm) confirm.type = show ? 'text' : 'password';
}
function passwordSafetyMessage(pass){
  if(String(pass || '').length < 10) return '密码至少需要 10 位';
  if(!/[A-Za-z]/.test(pass)) return '密码需要包含英文字母';
  if(!/\d/.test(pass)) return '密码需要包含数字';
  return '';
}
function showAuthValidation(message){
  const msg = document.getElementById('authMsg');
  if(msg){ msg.style.color = 'var(--berry)'; msg.textContent = message; }
  document.getElementById('authPass')?.focus();
  showToast(message);
}
function openProfileLogin(){
  closeProfileMenu();
  setTimeout(() => openAuth(), 0);
}
function currentAccountLabel(){
  if(!(session && session.user)) return '未登录';
  return (session.user.user_metadata && session.user.user_metadata.name) || session.user.email || '当前账号';
}
function switchAccount(){
  logoutUser(true);
  showToast('已退出，请登录要切换的账号');
  openAuth();
}
function toggleProfileMenu(e){
  if(e) e.stopPropagation();
  const menu = document.getElementById('profileMenu');
  if(menu && !menu.classList.contains('open')) checkFeedbackReplyNotices();
  menu?.classList.toggle('open');
}
function closeProfileMenu(){
  document.getElementById('profileMenu')?.classList.remove('open');
  document.getElementById('merchantOwnerMenu')?.classList.remove('open');
}
function toggleMerchantOwnerMenu(e){
  if(e) e.stopPropagation();
  document.getElementById('merchantOwnerMenu')?.classList.toggle('open');
}
document.addEventListener('click', e => {
  const menu = document.getElementById('profileMenu');
  const merchantMenu = document.getElementById('merchantOwnerMenu');
  const publicMenu = document.getElementById('publicProfileMenu');
  if(menu && !e.target.closest('.profile-menu') && !e.target.closest('.profile-cover-menu-btn')) menu.classList.remove('open');
  if(merchantMenu && !e.target.closest('#merchantOwnerMenu') && !e.target.closest('.profile-cover-menu-btn')) merchantMenu.classList.remove('open');
  if(publicMenu && !e.target.closest('#publicProfileMenu') && !e.target.closest('#userPublicBody .profile-cover-menu-btn')) publicMenu.classList.remove('open');
});
// 全局菜单规则：任一三条杠菜单打开后，触摸或点击菜单外任意位置都立即关闭。
// Capture 阶段可覆盖 App WebView 内部分浮层对普通 click 的拦截。
document.addEventListener('pointerdown', e => {
  const target = e.target;
  if(target?.closest?.('.profile-menu,.profile-cover-menu-btn')) return;
  document.querySelectorAll('.profile-menu.open').forEach(menu => menu.classList.remove('open'));
}, true);
function openProfileCoverPicker(){
  if(!(session && session.user)){
    showToast('请先登录后再更换背景');
    openAuth();
    return;
  }
  document.getElementById('profileCoverFileInput')?.click();
}
function onProfileCoverSelected(event){
  const file = event.target.files && event.target.files[0];
  event.target.value = '';
  if(!file) return;
  if(!file.type || !file.type.startsWith('image/')){
    showToast('请选择图片文件');
    return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => openCoverCropper(img, e.target.result);
    img.onerror = () => showToast('图片读取失败，请换一张试试');
    img.src = e.target.result;
  };
  reader.onerror = () => showToast('图片读取失败，请换一张试试');
  reader.readAsDataURL(file);
}

/* ---- 验证邮件频率限制：每邮箱1分钟1次，30分钟内最多5次 ---- */
const authVerificationLimits = window.LeshenghuoAuthVerificationLimits?.create();
function getVerifyLog(email){ return authVerificationLimits?.get(email) || []; }
function pushVerifyLog(email){ return authVerificationLimits?.record(email) || 0; }
function canSendVerify(email){ return authVerificationLimits?.canSend(email) || { ok:true }; }
async function resendVerifyEmail(email){
  const {res} = await authApi.resendSignupVerification(email);
  return res.ok;
}
async function resendVerificationFromAuth(){
  const email = document.getElementById('authEmail')?.value.trim().toLowerCase();
  const msg = document.getElementById('authMsg');
  if(!email || !email.includes('@')){ if(msg) msg.textContent = '请先输入注册邮箱。'; return; }
  const gate = canSendVerify(email);
  if(!gate.ok){
    if(msg) msg.textContent = gate.reason === 'limit' ? '发送次数已达上限，请稍后再试。' : `请${gate.wait}秒后再试。`;
    return;
  }
  if(msg){ msg.style.color = 'var(--ink-soft)'; msg.textContent = '正在发送验证邮件…'; }
  try{
    const ok = await resendVerifyEmail(email);
    if(!ok) throw new Error('邮件服务暂时不可用');
    pushVerifyLog(email);
    if(msg){ msg.style.color = 'var(--sage-dark)'; msg.textContent = '验证邮件已发送。请只打开最新一封邮件中的链接。'; }
  }catch(error){
    if(msg){ msg.style.color = 'var(--berry)'; msg.textContent = `验证邮件发送失败：${error.message || '请稍后重试'}`; }
  }
}

/* 认证邮件通过外部 SMTP 发送时可能需要数十秒。统一解析响应，避免网关返回纯文本时让界面永远停在“处理中”。 */
async function authRequest(url, options, timeoutMs=45000){
  return authApi.request(url, options, timeoutMs);
}

/* ---- 一体化登入：自动判断 注册/登录/补发验证 ---- */
async function createAccountFromAuth(email, pass, name, msg){
  msg.textContent = '首次使用该邮箱，正在创建账号…';
  let reg, rd;
  try {
    ({res:reg, data:rd} = await authRequest(`${SUPABASE_URL}/auth/v1/signup`, {
      method:'POST', headers:{'Content-Type':'application/json','apikey':SUPABASE_KEY},
      body: JSON.stringify({ email, password:pass, data:{ name } })
    }));
  } catch(e) {
    msg.textContent = `账号创建暂时失败：${e.message || '请稍后再试'}`;
    return 'failed';
  }
  if(!reg.ok){
    const reason = String(rd.msg || rd.error_description || rd.message || '').toLowerCase();
    const passwordIssue = passwordSafetyMessage(pass);
    // 登录失败后无法从公开接口安全判断邮箱是否已存在。旧账号密码不匹配时，
    // 不能把新账号的规则误提示为旧账号的密码要求。
    if(passwordIssue && (reason.includes('password') || reason.includes('weak') || reason.includes('least'))){
      msg.textContent = `无法登录。若这是首次注册，${passwordIssue}；已注册用户请检查原密码或使用“忘记密码”。`;
      return 'login_or_password_rule';
    }
    msg.textContent = '无法登录。请检查邮箱和原密码；忘记密码可点击下方“忘记密码”。';
    return 'failed';
  }
  const identities = rd && rd.user && Array.isArray(rd.user.identities) ? rd.user.identities : null;
  if(!rd.access_token && (!identities || identities.length === 0)){
    msg.textContent = '邮箱或密码错误。忘记密码可点击下方“忘记密码”。';
    return 'existing_account';
  }
  if(rd.access_token){
    session = { access_token:rd.access_token, refresh_token:rd.refresh_token, user:rd.user };
    authSessionStore?.write(session);
    updateAuthUI(); closeAuth(); fetchProfileFromDb(); fetchMerchantProfile();
    setTimeout(maybeOpenFeedOnboarding, 350);
    showToast('注册成功，已登录');
  } else if(identities && identities.length > 0) {
    pushVerifyLog(email);
    msg.style.color = 'var(--sage-dark)';
    msg.textContent = '验证邮件已发送，请点击邮件中的链接完成注册。';
  } else {
    msg.textContent = '无法确认账号状态。请检查原密码；忘记密码可点击下方“忘记密码”。';
    return 'existing_account';
  }
  return 'created';
}
async function submitAuth(){
  const email = document.getElementById('authEmail').value.trim().toLowerCase();
  const pass = document.getElementById('authPass').value;
  const passConfirm = document.getElementById('authPassConfirm')?.value || '';
  const name = email.split('@')[0];
  const msg = document.getElementById('authMsg');
  msg.style.color = 'var(--berry)';
  if(!pass){ msg.textContent = '请输入密码'; return; }
  if(authMode === 'reset'){
    const passwordIssue = passwordSafetyMessage(pass);
    if(passwordIssue){ showAuthValidation(passwordIssue); return; }
    if(pass !== passConfirm){ showAuthValidation('两次输入的密码不一致'); return; }
  }
  if(authMode !== 'reset' && (!email || !email.includes('@'))){ msg.textContent = '请输入有效邮箱'; return; }
  msg.textContent = '处理中…';

  if(authMode === 'reset'){
    if(!(session && session.access_token)){ msg.textContent = '重置链接已失效，请重新申请。'; return; }
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        method:'PUT',
        headers:{ 'Content-Type':'application/json', 'apikey':SUPABASE_KEY, 'Authorization':`Bearer ${session.access_token}` },
        body: JSON.stringify({ password:pass })
      });
      if(!res.ok) throw new Error((await res.json()).message || 'reset failed');
      closeAuth();
      showToast('✓ 密码已更新，请使用新密码登录');
      return;
    } catch(e){ msg.textContent = '密码更新失败，请重新申请重置链接。'; return; }
  }

  try {
    /* 先登录；仅当该邮箱不是现有账号时才自动创建账号。 */
    const {res, data} = await authRequest(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method:'POST',
      headers:{'Content-Type':'application/json','apikey':SUPABASE_KEY},
      body: JSON.stringify({ email, password: pass })
    });

    if(res.ok){
      session = { access_token: data.access_token, refresh_token: data.refresh_token, user: data.user };
      authSessionStore?.write(session);
      updateAuthUI(); closeAuth(); initProfilePage();
      fetchProfileFromDb();
      fetchMerchantProfile();
      checkDealAdmin();
      setTimeout(maybeOpenFeedOnboarding, 350);
      showToast('✓ 登入成功');
      return;
    }

    const em = (data.msg || data.error_description || data.message || '').toLowerCase();

    /* 情况A：邮箱未验证。不得自动补发：每次补发都会使旧邮件链接失效。 */
    if(em.includes('email not confirmed')){
      msg.style.color = 'var(--sage-dark)';
      msg.textContent = '该账号尚未完成邮箱验证。请打开最新确认邮件；未收到时可点下方“重新发送验证邮件”。';
      return;
    }

    /* 无法登录时尝试注册。Supabase 对已存在邮箱返回无 identities 的保护响应。 */
    if(em.includes('invalid login')){
      await createAccountFromAuth(email, pass, name, msg);
      return;
    }

    msg.textContent = '登入失败：' + (data.msg || data.error_description || res.status);
  } catch(e){
    msg.textContent = '网络错误：' + e.message;
  }
}
async function requestPasswordReset(){
  const email = document.getElementById('authEmail').value.trim().toLowerCase();
  const msg = document.getElementById('authMsg');
  if(!email || !email.includes('@')){ msg.textContent = '请先输入注册邮箱。'; return; }
  const resetLimitKey = 'leshenghuo_password_reset_attempts_v1';
  const now = Date.now();
  let resetAttempts = {};
  try { resetAttempts = JSON.parse(localStorage.getItem(resetLimitKey) || '{}'); } catch(e) {}
  const attempts = Array.isArray(resetAttempts[email]) ? resetAttempts[email].filter(at => now - Number(at) < 15 * 60 * 1000) : [];
  const sinceLatest = now - Number(attempts.at(-1) || 0);
  if(attempts.length >= 3){ msg.textContent = '15 分钟内最多发送 3 次重置邮件，请稍后再试。'; return; }
  if(attempts.length && sinceLatest < 60 * 1000){ msg.textContent = `请在 ${Math.ceil((60 * 1000 - sinceLatest) / 1000)} 秒后再发送。`; return; }
  msg.style.color = 'var(--berry)'; msg.textContent = '正在发送重置邮件…';
  try {
    // 使用站点根地址回跳，和 Supabase URL Configuration 中常见的 Site URL 保持一致。
    const redirect = new URL('/', window.location.origin).href;
    const {res, data:detail} = await authRequest(`${SUPABASE_URL}/auth/v1/recover`, {
      method:'POST', headers:{'Content-Type':'application/json','apikey':SUPABASE_KEY},
      body:JSON.stringify({ email, redirect_to:redirect })
    });
    if(!res.ok){
      const raw = String(detail.msg || detail.error_description || detail.message || detail.error || '').toLowerCase();
      if(res.status === 429 || raw.includes('rate limit')) throw new Error('发送过于频繁，请稍后再试');
      if(raw.includes('redirect') || raw.includes('url')) throw new Error('回跳地址未获授权，请在 Supabase 的 URL Configuration 中加入 https://escoopcity.com/');
      throw new Error(detail.msg || detail.error_description || detail.message || `服务暂时不可用（${res.status}）`);
    }
    resetAttempts[email] = [...attempts, now];
    localStorage.setItem(resetLimitKey, JSON.stringify(resetAttempts));
    msg.style.color = 'var(--sage-dark)';
    msg.textContent = '重置邮件已发送，请点击邮件中的链接设置新密码。';
  } catch(e){
    console.warn('重置邮件发送失败:', e.message);
    msg.textContent = `重置邮件发送失败：${e.message || '请稍后重试。'}`;
  }
}
function logoutUser(silent){
  session = null;
  authSessionStore?.clear();
  currentMerchant = null;
  currentMerchantApplication = null;
  dealReviewRows = [];
  merchantApplicationRows = [];
  currentUser = defaultProfile();
  updateAuthUI();
  initProfilePage();
  if(!silent) showToast('已退出登录');
}

/* 邮箱验证链接会跳回本站并在URL带上令牌，自动完成登录 */
async function handleEmailConfirmRedirect(){
  const hash = window.location.hash;
  if(!hash || !hash.includes('access_token')) return;
  try {
    const params = new URLSearchParams(hash.slice(1));
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');
    const type = params.get('type'); // signup / recovery / magiclink
    if(!access_token) return;
    // 用令牌获取用户信息
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${access_token}` }
    });
    if(!res.ok) return;
    const user = await res.json();
    session = { access_token, refresh_token, user };
    authSessionStore?.write(session);
    updateAuthUI();
    initProfilePage();
    fetchProfileFromDb();
    fetchMerchantProfile();
    checkDealAdmin();
    // 清除地址栏中的令牌，避免泄露
    history.replaceState(null, '', window.location.pathname);
    if(type === 'recovery'){
      openAuth('reset');
      showToast('请设置新的登录密码');
      return;
    }
    showToast(type === 'signup' ? '🎉 邮箱验证成功，已自动登录！' : '✓ 已自动登录');
    switchTab('profile');
  } catch(e){
    console.warn('验证回跳处理失败:', e.message);
  }
}

// 根据出生年月自动计算年龄
function calcAge(birth){
  return profileStorage?.calcAge(birth) ?? null;
}

// 从 localStorage 加载用户信息
/* 每个账号一份独立资料，键：userProfile_{uid}；游客：userProfile_guest */
function profileKey(){
  return profileStorage?.key() || 'userProfile_guest';
}
function normalizeProfile(raw){
  return profileStorage?.normalize(raw) || raw || {};
}
function defaultProfile(){
  return profileStorage?.defaultProfile() || { name:'未登录用户', bio:'登录后可编辑个人资料', gender:'', birth:'', age:null, location:'', tags:[], id:'', cover:'' };
}
function loadUserProfile(){
  currentUser = profileStorage?.load() || defaultProfile();
  updateProfileDisplay();
}

// 保存用户信息到当前账号的档案
function saveUserProfileToStorage(){
  if(!(session && session.user)) return;
  currentUser = profileStorage?.save(currentUser) || normalizeProfile(currentUser);
}
/* 由账号UUID确定性生成8位纯数字专属ID（同一账号任何设备都相同） */
function uidToNumericId(uuid){
  return profileStorage?.uidToNumericId(uuid) || '';
}

/* ====== 头像上传：点击→选文件→拖动缩放裁剪→存库 ====== */
let avatarCropState = {
  img: null,
  dataUrl: '',
  target: 'profile',
  zoom: 1,
  x: 0,
  y: 0,
  dragging: false,
  startX: 0,
  startY: 0,
  originX: 0,
  originY: 0
};
function onAvatarClick(){
  if(!(session && session.user)){
    showToast('请先登录后再设置头像');
    return;
  }
  document.getElementById('avatarFileInput').click();
}
function onAvatarFileSelected(evt){
  const file = evt.target.files && evt.target.files[0];
  evt.target.value = ''; // 允许重复选择同一张图片
  if(!file) return;
  if(!file.type || !file.type.startsWith('image/')){
    showToast('请选择图片文件');
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e){
    const img = new Image();
    img.onload = function(){
      openAvatarCropper(img, e.target.result);
    };
    img.onerror = function(){ showToast('图片读取失败，请换一张试试'); };
    img.src = e.target.result;
  };
  reader.onerror = function(){ showToast('图片读取失败，请换一张试试'); };
  reader.readAsDataURL(file);
}
function openAvatarCropper(img, dataUrl, target){
  avatarCropState.img = img;
  avatarCropState.dataUrl = dataUrl;
  avatarCropState.target = target || 'profile';
  avatarCropState.zoom = 1;
  avatarCropState.x = 0;
  avatarCropState.y = 0;
  const overlay = document.getElementById('avatarCropOverlay');
  const cropImg = document.getElementById('avatarCropImage');
  const zoom = document.getElementById('avatarZoomRange');
  if(zoom) zoom.value = '1';
  cropImg.src = dataUrl;
  overlay.classList.add('open');
  requestAnimationFrame(() => {
    bindAvatarCropDrag();
    renderAvatarCropper();
  });
}
function closeAvatarCropper(){
  const overlay = document.getElementById('avatarCropOverlay');
  if(overlay) overlay.classList.remove('open');
  avatarCropState.dragging = false;
}
function avatarCropMetrics(){
  const frame = document.getElementById('avatarCropFrame');
  const img = avatarCropState.img;
  const size = frame ? frame.clientWidth : 260;
  if(!img || !img.width || !img.height) return null;
  const baseScale = Math.max(size / img.width, size / img.height);
  const scale = baseScale * avatarCropState.zoom;
  const dispW = img.width * scale;
  const dispH = img.height * scale;
  return { size, scale, dispW, dispH };
}
function clampAvatarCrop(){
  const m = avatarCropMetrics();
  if(!m) return;
  const maxX = Math.max(0, (m.dispW - m.size) / 2);
  const maxY = Math.max(0, (m.dispH - m.size) / 2);
  avatarCropState.x = Math.min(maxX, Math.max(-maxX, avatarCropState.x));
  avatarCropState.y = Math.min(maxY, Math.max(-maxY, avatarCropState.y));
}
function renderAvatarCropper(){
  const cropImg = document.getElementById('avatarCropImage');
  const m = avatarCropMetrics();
  if(!cropImg || !m) return;
  clampAvatarCrop();
  cropImg.style.width = `${m.dispW}px`;
  cropImg.style.height = `${m.dispH}px`;
  cropImg.style.left = `calc(50% + ${avatarCropState.x}px)`;
  cropImg.style.top = `calc(50% + ${avatarCropState.y}px)`;
}
function setAvatarCropZoom(value){
  const prev = avatarCropState.zoom || 1;
  avatarCropState.zoom = Math.max(1, Math.min(3, parseFloat(value) || 1));
  if(prev !== avatarCropState.zoom){
    avatarCropState.x *= avatarCropState.zoom / prev;
    avatarCropState.y *= avatarCropState.zoom / prev;
  }
  renderAvatarCropper();
}
function bindAvatarCropDrag(){
  const frame = document.getElementById('avatarCropFrame');
  if(!frame || frame.dataset.bound === '1') return;
  frame.dataset.bound = '1';
  frame.style.touchAction = 'none';
  const startDragAt = (clientX, clientY) => {
    if(!avatarCropState.img) return;
    avatarCropState.dragging = true;
    avatarCropState.startX = clientX;
    avatarCropState.startY = clientY;
    avatarCropState.originX = avatarCropState.x;
    avatarCropState.originY = avatarCropState.y;
    frame.classList.add('dragging');
  };
  const moveDragTo = (clientX, clientY) => {
    if(!avatarCropState.dragging) return;
    avatarCropState.x = avatarCropState.originX + (clientX - avatarCropState.startX);
    avatarCropState.y = avatarCropState.originY + (clientY - avatarCropState.startY);
    renderAvatarCropper();
  };
  const endDrag = e => {
    avatarCropState.dragging = false;
    frame.classList.remove('dragging');
    if(e && e.pointerId != null){ try { frame.releasePointerCapture(e.pointerId); } catch(err){} }
  };
  frame.addEventListener('pointerdown', e => {
    startDragAt(e.clientX, e.clientY);
    if(e.pointerId != null){ try { frame.setPointerCapture(e.pointerId); } catch(err){} }
  });
  frame.addEventListener('pointermove', e => {
    moveDragTo(e.clientX, e.clientY);
  });
  frame.addEventListener('pointerup', endDrag);
  frame.addEventListener('pointercancel', endDrag);
  frame.addEventListener('touchstart', e => {
    const t = e.touches && e.touches[0];
    if(!t) return;
    e.preventDefault();
    startDragAt(t.clientX, t.clientY);
  }, { passive:false });
  frame.addEventListener('touchmove', e => {
    const t = e.touches && e.touches[0];
    if(!t) return;
    e.preventDefault();
    moveDragTo(t.clientX, t.clientY);
  }, { passive:false });
  frame.addEventListener('touchend', endDrag);
  frame.addEventListener('touchcancel', endDrag);
  window.addEventListener('resize', () => {
    if(document.getElementById('avatarCropOverlay')?.classList.contains('open')) renderAvatarCropper();
  });
}
async function confirmAvatarCrop(){
  const img = avatarCropState.img;
  const m = avatarCropMetrics();
  if(!img || !m){ showToast('请先选择头像图片'); return; }
  const output = 256;
  const left = m.size / 2 + avatarCropState.x - m.dispW / 2;
  const top = m.size / 2 + avatarCropState.y - m.dispH / 2;
  const sx = (0 - left) / m.scale;
  const sy = (0 - top) / m.scale;
  const sw = m.size / m.scale;
  const sh = m.size / m.scale;
  const canvas = document.createElement('canvas');
  canvas.width = output;
  canvas.height = output;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, output, output);
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, output, output);
  const dataUrl = canvas.toDataURL('image/jpeg', 0.86);
  let uploadedUrl;
  try { uploadedUrl = await uploadMediaDataUrl(dataUrl, avatarCropState.target === 'merchantLogo' ? 'merchant-logos' : 'avatars'); }
  catch(error){ showToast(error.message || '头像上传失败，请重试'); return; }
  if(avatarCropState.target === 'merchantLogo'){
    if(!currentMerchant) currentMerchant = { user_id: session?.user?.id };
    currentMerchant.logo = uploadedUrl;
    if(session && session.user) setMerchantIdentityCache(session.user.id, currentMerchant);
    closeAvatarCropper();
    openMerchantEditSheet();
    showToast('店铺Logo已更新，请保存资料');
    return;
  }
  currentUser.avatar = uploadedUrl;
  currentUser.avatarUpdatedAt = new Date().toISOString();
  if(session && session.user) cacheUserAvatar(session.user.id, dataUrl);
  saveUserProfileToStorage();
  updateProfileDisplay();
  if(session && session.user) refreshAvatarDisplays(session.user.id);
  closeAvatarCropper();
  syncProfileToDb();
}

let coverCropState = {
  img: null,
  dataUrl: '',
  target: 'profile',
  zoom: 1,
  x: 0,
  y: 0,
  dragging: false,
  startX: 0,
  startY: 0,
  originX: 0,
  originY: 0
};
function openCoverCropper(img, dataUrl, target){
  coverCropState.img = img;
  coverCropState.dataUrl = dataUrl;
  coverCropState.target = target || 'profile';
  coverCropState.zoom = 1;
  coverCropState.x = 0;
  coverCropState.y = 0;
  const overlay = document.getElementById('coverCropOverlay');
  const cropImg = document.getElementById('coverCropImage');
  const zoom = document.getElementById('coverZoomRange');
  if(zoom) zoom.value = '1';
  if(cropImg) cropImg.src = dataUrl;
  overlay?.classList.add('open');
  requestAnimationFrame(() => {
    bindCoverCropDrag();
    // WebView 在遮罩刚打开的一帧里可能仍使用旧宽度；下一帧再定位一次，避免预览偏右。
    renderCoverCropper();
    requestAnimationFrame(renderCoverCropper);
  });
}
function closeCoverCropper(){
  const overlay = document.getElementById('coverCropOverlay');
  if(overlay) overlay.classList.remove('open');
  coverCropState.dragging = false;
}
function coverCropMetrics(){
  const frame = document.getElementById('coverCropFrame');
  const img = coverCropState.img;
  const width = frame ? frame.clientWidth : 560;
  const height = frame ? frame.clientHeight : Math.round(width / 2.35);
  if(!img || !img.width || !img.height || !width || !height) return null;
  const baseScale = Math.max(width / img.width, height / img.height);
  const scale = baseScale * coverCropState.zoom;
  const dispW = img.width * scale;
  const dispH = img.height * scale;
  return { width, height, scale, dispW, dispH };
}
function clampCoverCrop(){
  const m = coverCropMetrics();
  if(!m) return;
  const maxX = Math.max(0, (m.dispW - m.width) / 2);
  const maxY = Math.max(0, (m.dispH - m.height) / 2);
  coverCropState.x = Math.min(maxX, Math.max(-maxX, coverCropState.x));
  coverCropState.y = Math.min(maxY, Math.max(-maxY, coverCropState.y));
}
function renderCoverCropper(){
  const cropImg = document.getElementById('coverCropImage');
  const m = coverCropMetrics();
  if(!cropImg || !m) return;
  clampCoverCrop();
  cropImg.style.width = `${m.dispW}px`;
  cropImg.style.height = `${m.dispH}px`;
  // 不使用 calc(50% + px)：部分 App WebView 会把它按页面坐标而不是裁剪框坐标计算。
  cropImg.style.left = `${m.width / 2 + coverCropState.x}px`;
  cropImg.style.top = `${m.height / 2 + coverCropState.y}px`;
  cropImg.style.transform = 'translate3d(-50%,-50%,0)';
}
function setCoverCropZoom(value){
  const prev = coverCropState.zoom || 1;
  coverCropState.zoom = Math.max(1, Math.min(3, parseFloat(value) || 1));
  if(prev !== coverCropState.zoom){
    coverCropState.x *= coverCropState.zoom / prev;
    coverCropState.y *= coverCropState.zoom / prev;
  }
  renderCoverCropper();
}
function bindCoverCropDrag(){
  const frame = document.getElementById('coverCropFrame');
  if(!frame || frame.dataset.bound === '1') return;
  frame.dataset.bound = '1';
  frame.style.touchAction = 'none';
  const startDragAt = (clientX, clientY) => {
    if(!coverCropState.img) return;
    coverCropState.dragging = true;
    coverCropState.startX = clientX;
    coverCropState.startY = clientY;
    coverCropState.originX = coverCropState.x;
    coverCropState.originY = coverCropState.y;
    frame.classList.add('dragging');
  };
  const moveDragTo = (clientX, clientY) => {
    if(!coverCropState.dragging) return;
    coverCropState.x = coverCropState.originX + (clientX - coverCropState.startX);
    coverCropState.y = coverCropState.originY + (clientY - coverCropState.startY);
    renderCoverCropper();
  };
  const endDrag = e => {
    coverCropState.dragging = false;
    frame.classList.remove('dragging');
    if(e && e.pointerId != null){ try { frame.releasePointerCapture(e.pointerId); } catch(err){} }
  };
  frame.addEventListener('pointerdown', e => {
    startDragAt(e.clientX, e.clientY);
    if(e.pointerId != null){ try { frame.setPointerCapture(e.pointerId); } catch(err){} }
  });
  frame.addEventListener('pointermove', e => moveDragTo(e.clientX, e.clientY));
  frame.addEventListener('pointerup', endDrag);
  frame.addEventListener('pointercancel', endDrag);
  frame.addEventListener('touchstart', e => {
    const t = e.touches && e.touches[0];
    if(!t) return;
    e.preventDefault();
    startDragAt(t.clientX, t.clientY);
  }, { passive:false });
  frame.addEventListener('touchmove', e => {
    const t = e.touches && e.touches[0];
    if(!t) return;
    e.preventDefault();
    moveDragTo(t.clientX, t.clientY);
  }, { passive:false });
  frame.addEventListener('touchend', endDrag);
  frame.addEventListener('touchcancel', endDrag);
  window.addEventListener('resize', () => {
    if(document.getElementById('coverCropOverlay')?.classList.contains('open')) renderCoverCropper();
  });
}
async function confirmCoverCrop(){
  const img = coverCropState.img;
  const m = coverCropMetrics();
  if(!img || !m){ showToast('请先选择背景图片'); return; }
  const outputW = 1200;
  const outputH = 510;
  const left = m.width / 2 + coverCropState.x - m.dispW / 2;
  const top = m.height / 2 + coverCropState.y - m.dispH / 2;
  const sx = (0 - left) / m.scale;
  const sy = (0 - top) / m.scale;
  const sw = m.width / m.scale;
  const sh = m.height / m.scale;
  const canvas = document.createElement('canvas');
  canvas.width = outputW;
  canvas.height = outputH;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, outputW, outputH);
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outputW, outputH);
  const dataUrl = canvas.toDataURL('image/jpeg', 0.84);
  let uploadedUrl;
  try { uploadedUrl = await uploadMediaDataUrl(dataUrl, coverCropState.target === 'merchantCover' ? 'merchant-covers' : 'covers'); }
  catch(error){ showToast(error.message || '背景上传失败，请重试'); return; }
  if(coverCropState.target === 'merchantCover'){
    if(!currentMerchant) currentMerchant = { user_id: session?.user?.id };
    currentMerchant.cover_image = uploadedUrl;
    closeCoverCropper();
    openMerchantEditSheet();
    showToast('店铺背景已更新，请保存资料');
    return;
  }
  currentUser.cover = uploadedUrl;
  saveUserProfileToStorage();
  updateProfileDisplay();
  closeCoverCropper();
  syncProfileToDb();
  showToast('背景已更新');
}
async function syncAuthDisplayName(name){
  if(!(session && session.user) || !name) return false;
  try {
    const res = await authedFetch(`${SUPABASE_URL}/auth/v1/user`, {
      method: 'PUT',
      body: JSON.stringify({ data: { name, display_name: name } })
    });
    if(!res.ok){ console.warn('Auth 昵称同步失败:', await res.text()); return false; }
    const data = await res.json();
    session.user = data.user || session.user;
    session.user.user_metadata = Object.assign({}, session.user.user_metadata || {}, { name, display_name: name });
    authSessionStore?.write(session);
    return true;
  } catch(error){
    console.warn('Auth 昵称同步异常:', error.message);
    return false;
  }
}
/* 同步头像/昵称到 profiles 表：先尝试更新已有行，没有行再插入（与关注表同一套路） */
async function syncProfileToDb(){
  if(!(session && session.user)) return;
  try {
    currentUser = normalizeProfile(currentUser);
    const updatedAt = new Date().toISOString();
    const fullPayload = {
      name: currentUser.name,
      avatar: currentUser.avatar || null,
      bio: currentUser.bio || null,
      tags: currentUser.tags || [],
      gender: currentUser.gender || null,
      birth: currentUser.birth || null,
      cover: currentUser.cover || null,
      market_code: normalizeUserMarketCode(currentUser.market_code),
      ip_location: window._ipLocation || currentUser.location || null,
      updated_at: updatedAt
    };
    const fallbackPayload = { name: currentUser.name, avatar: currentUser.avatar || null, updated_at: updatedAt };
    let res = await profileApi?.write(fullPayload);
    if(!res) throw new Error('资料接口未初始化');
    if(!res.ok){
      const text = await res.text();
      console.warn('完整资料同步失败，回退头像昵称同步:', text);
      res = await profileApi.write(fallbackPayload);
    }
    if(res.ok){
      setProfileCache(Object.assign({ user_id:session.user.id }, fullPayload));
      await syncAuthDisplayName(currentUser.name);
      showToast('✓ 资料已同步');
    }
    else { const t = await res.text(); console.warn('资料同步失败:', t); showToast('资料同步失败，请重试'); }
  } catch(e){
    console.warn('资料同步异常:', e.message);
    showToast('资料同步失败，请检查网络');
  }
}
/* 登录时从 profiles 表拉取头像/昵称，覆盖本地档案（跨设备同步） */
async function fetchProfileFromDb(){
  if(!(session && session.user)) return;
  try {
    const row = await profileApi?.fetchCurrent();
    if(row){
      const local = normalizeProfile(currentUser);
      currentUser = normalizeProfile(Object.assign({}, local, {
        name: row.name || local.name,
        avatar: row.avatar || local.avatar,
        bio: row.bio || local.bio,
        tags: Array.isArray(row.tags) && row.tags.length ? row.tags : local.tags,
        gender: row.gender || local.gender,
        birth: row.birth || local.birth,
        cover: row.cover || local.cover,
        market_code: normalizeUserMarketCode(row.market_code || local.market_code),
        location: row.ip_location || local.location,
        avatarUpdatedAt: row.updated_at || local.avatarUpdatedAt
      }));
      if(row.ip_location && !window._ipLocation) window._ipLocation = row.ip_location;
      setProfileCache(Object.assign({ user_id:session.user.id }, row));
      saveUserProfileToStorage();
      updateProfileDisplay();
      refreshAvatarDisplays(session.user.id);
    }
  } catch(e){ console.warn('资料拉取失败:', e.message); }
}
/* 拉取当前账号的商家资料。若存在且已通过认证(verified=true)，"我"页会显示商家专属主页而非普通个人页 */
let currentMerchant = null;
let merchantMatrixWorkspaces = [];
let merchantMatrixInvites = [];
let merchantMatrixActiveWorkspace = null;
let merchantMatrixPeople = [];
let merchantMatrixSelectedPerson = null;
function merchantOperatorWorkspace(){
  return merchantMatrixActiveWorkspace && merchantMatrixActiveWorkspace.merchant
    ? merchantMatrixActiveWorkspace.merchant
    : currentMerchant;
}
function merchantOperatorRole(){
  if(merchantMatrixActiveWorkspace) return merchantMatrixActiveWorkspace.role || 'clerk';
  return currentMerchant && session && session.user && currentMerchant.user_id === session.user.id ? 'owner' : '';
}
/* Removed overridden canOperateMerchantWorkspace implementation during v5.510 cleanup. */

function isMerchantWorkspaceOwner(){
  return merchantOperatorRole() === 'owner';
}
function activeMerchantWorkspaceId(){
  const m = merchantOperatorWorkspace();
  return m && m.user_id || '';
}
async function loadMerchantMatrixState(){
  if(!(session && session.user)){
    merchantMatrixWorkspaces = [];
    merchantMatrixInvites = [];
    merchantMatrixActiveWorkspace = null;
    return;
  }
  try {
    const [accessRes, inviteRes] = await Promise.all([
      authedFetch(SUPABASE_URL + '/rest/v1/rpc/merchant_matrix_my_access', { method:'POST', headers:{'Content-Type':'application/json'}, body:'{}' }),
      authedFetch(SUPABASE_URL + '/rest/v1/merchant_team_members?member_user_id=eq.' + encodeURIComponent(session.user.id) + '&status=eq.pending&select=id,merchant_user_id,role,invited_at&order=invited_at.desc', { method:'GET' })
    ]);
    merchantMatrixWorkspaces = accessRes.ok ? (await accessRes.json()).map(row => Object.assign({}, row, { merchant:row.merchant || {} })) : [];
    merchantMatrixInvites = inviteRes.ok ? await inviteRes.json() : [];
    const merchantIds = merchantMatrixInvites.map(row => row.merchant_user_id).filter(Boolean);
    if(merchantIds.length){
      const res = await authedFetch(SUPABASE_URL + '/rest/v1/merchants?user_id=in.(' + merchantIds.map(encodeURIComponent).join(',') + ')&select=user_id,business_name,logo');
      if(res.ok) (await res.json()).forEach(row => setMerchantIdentityCache(row.user_id, row));
    }
  } catch(error){
    console.warn('商家矩阵账号读取失败:', error.message);
    merchantMatrixWorkspaces = [];
    merchantMatrixInvites = [];
  }
}
/* Removed overridden merchantMatrixWorkspaceCardHtml implementation during v5.510 cleanup. */

async function respondMerchantMatrixInvite(id, accept){
  try {
    if(!merchantTeamApi) throw new Error('商家团队接口未初始化');
    await merchantTeamApi.respondInvite(id, accept);
    await loadMerchantMatrixState();
    if(currentTab === 'profile') initProfilePage();
    showToast(accept ? '已加入商家团队' : '已拒绝邀请');
  } catch(error){ showToast('处理邀请失败，请稍后重试'); }
}
/* Removed overridden openMerchantMatrixWorkspace implementation during v5.510 cleanup. */

/* Removed overridden openMerchantMatrixOrders implementation during v5.510 cleanup. */

function leaveMerchantMatrixWorkspace(){
  merchantMatrixActiveWorkspace = null;
  window._activeMerchantMemberManagerId = null;
}
function closeMerchantTeamManager(){
  document.getElementById('merchantTeamManager')?.classList.remove('open');
  merchantMatrixPeople = [];
  merchantMatrixSelectedPerson = null;
}
async function openMerchantTeamManager(){
  if(!(currentMerchant && currentMerchant.verified && session && session.user && currentMerchant.user_id === session.user.id)){
    showToast('只有认证商家店主可以管理团队');
    return;
  }
  const sheet = document.getElementById('merchantTeamManager');
  if(!sheet) return;
  sheet.classList.add('open');
  await renderMerchantTeamManager();
}
/* Removed overridden merchantMatrixRoleText implementation during v5.510 cleanup. */

async function renderMerchantTeamManager(){
  const body = document.getElementById('merchantTeamManagerBody');
  if(!body || !currentMerchant) return;
  body.innerHTML = '<div class="deals-empty-panel">正在读取团队成员...</div>';
  try {
    const url = SUPABASE_URL + '/rest/v1/merchant_team_members?merchant_user_id=eq.' + encodeURIComponent(currentMerchant.user_id) + '&select=id,member_user_id,role,status,invited_at,responded_at,updated_at&order=updated_at.desc';
    const res = await authedFetch(url, {method:'GET'});
    if(!res.ok) throw new Error(await res.text());
    const rows = await res.json();
    await loadProfilesForIds(rows.map(row => row.member_user_id));
    const selected = merchantMatrixSelectedPerson;
    const selectedName = selected ? (selected.name || '已选择用户') : '还没有选择用户';
    const members = rows.map(row => {
      const profile = cachedProfile(row.member_user_id);
      const name = profile.name || '乐生活用户';
      const avatar = profile.avatar || resolveAvatarUrl(row.member_user_id);
      const status = row.status === 'active' ? '已授权' : row.status === 'pending' ? '待确认' : row.status === 'declined' ? '已拒绝' : '已撤销';
      const actions = row.status === 'active' || row.status === 'pending'
        ? '<button onclick="revokeMerchantMatrixMember(' + Number(row.id) + ')" style="padding:6px 9px;border:1px solid var(--line);border-radius:8px;background:#fff;color:var(--berry-dark);font-size:11px;font-weight:900;">撤销</button>'
        : '';
      return '<div style="display:flex;align-items:center;gap:10px;padding:11px 0;border-bottom:1px solid var(--line);"><span class="merchant-member-avatar" style="width:38px;height:38px;background:var(--bg-alt);color:var(--sage-dark);">' + (avatar ? '<img src="' + escAttr(avatar) + '" alt="">' : escHtml(initials(name))) + '</span><div style="flex:1;min-width:0;"><b style="display:block;font-size:13px;">' + escHtml(name) + '</b><small style="display:block;margin-top:3px;color:var(--ink-faint);">' + merchantMatrixRoleText(row.role) + ' · ' + status + '</small></div>' + actions + '</div>';
    }).join('') || '<div class="deals-empty-panel" style="margin:12px 0 0;">还没有矩阵账号。</div>';
    body.innerHTML = '<div class="merchant-dash-card" style="box-shadow:none;"><b style="font-size:16px;">邀请矩阵账号</b><p style="font-size:12px;line-height:1.6;color:var(--ink-faint);margin:7px 0 12px;">被邀请者使用自己的乐生活个人账号确认后，可进入会员核销工作台；不会共享你的商家密码。</p><div class="merchant-checkin-form"><input id="merchantMatrixSearch" placeholder="输入乐生活昵称搜索" oninput="searchMerchantMatrixPeople(this.value)" autocomplete="off"><button onclick="searchMerchantMatrixPeople(document.getElementById(&quot;merchantMatrixSearch&quot;).value)">搜索</button></div><div id="merchantMatrixPeople" style="margin-top:8px;"></div><div style="margin-top:12px;padding:10px;border-radius:9px;background:var(--bg-alt);font-size:12px;">已选择：<b id="merchantMatrixSelected">' + escHtml(selectedName) + '</b></div><div class="member-tx-filter" style="margin:12px 0 0;"><button data-role="clerk" class="' + ((window._merchantMatrixInviteRole || 'clerk') === 'clerk' ? 'on' : '') + '" onclick="setMerchantMatrixInviteRole(this.dataset.role)">店员</button><button data-role="operator" class="' + ((window._merchantMatrixInviteRole || 'clerk') === 'operator' ? 'on' : '') + '" onclick="setMerchantMatrixInviteRole(this.dataset.role)">运营</button></div><button class="merchant-reward-redeem-btn" style="margin:12px 0 0;" onclick="inviteMerchantMatrixMember()">发送授权邀请</button></div><div style="font-size:14px;font-weight:900;margin:18px 0 6px;">团队成员</div>' + members;
    renderMerchantMatrixPeople();
  } catch(error){
    console.warn('商家团队读取失败:', error.message);
    body.innerHTML = '<div class="deals-empty-panel">团队功能需要先运行 5.200 数据库脚本。</div>';
  }
}
function setMerchantMatrixInviteRole(role){
  window._merchantMatrixInviteRole = role === 'operator' ? 'operator' : 'clerk';
  renderMerchantTeamManager();
}
async function searchMerchantMatrixPeople(query){
  const target = document.getElementById('merchantMatrixPeople');
  const text = String(query || '').trim();
  if(!target) return;
  if(!text){ merchantMatrixPeople = []; renderMerchantMatrixPeople(); return; }
  target.innerHTML = '<div style="font-size:12px;color:var(--ink-faint);padding:8px 0;">正在搜索...</div>';
  try {
    if(!merchantTeamApi) throw new Error('商家团队接口未初始化');
    merchantMatrixPeople = await merchantTeamApi.searchPeople(text);
    merchantMatrixPeople.forEach(setProfileCache);
    renderMerchantMatrixPeople();
  } catch(error){
    target.innerHTML = '<div style="font-size:12px;color:var(--berry-dark);padding:8px 0;">没有找到可邀请的用户。</div>';
  }
}
function renderMerchantMatrixPeople(){
  const target = document.getElementById('merchantMatrixPeople');
  if(!target) return;
  target.innerHTML = (merchantMatrixPeople || []).map(person => {
    const name = person.name || '乐生活用户';
    const avatar = person.avatar || resolveAvatarUrl(person.user_id);
    return '<button data-user-id="' + escAttr(person.user_id || '') + '" onclick="selectMerchantMatrixPerson(this.dataset.userId)" style="width:100%;display:flex;align-items:center;gap:9px;border:0;border-bottom:1px solid var(--line);background:#fff;padding:8px 0;text-align:left;"><span class="merchant-member-avatar" style="width:32px;height:32px;background:var(--bg-alt);color:var(--sage-dark);">' + (avatar ? '<img src="' + escAttr(avatar) + '" alt="">' : escHtml(initials(name))) + '</span><b style="font-size:13px;">' + escHtml(name) + '</b></button>';
  }).join('');
}
function selectMerchantMatrixPerson(userId){
  merchantMatrixSelectedPerson = (merchantMatrixPeople || []).find(row => String(row.user_id) === String(userId)) || null;
  const el = document.getElementById('merchantMatrixSelected');
  if(el) el.textContent = merchantMatrixSelectedPerson ? merchantMatrixSelectedPerson.name : '还没有选择用户';
}
async function inviteMerchantMatrixMember(){
  if(!merchantMatrixSelectedPerson){ showToast('请先搜索并选择一个乐生活用户'); return; }
  try {
    const res = await authedFetch(SUPABASE_URL + '/rest/v1/rpc/merchant_matrix_invite_member', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({p_member_user_id:merchantMatrixSelectedPerson.user_id,p_role:window._merchantMatrixInviteRole || 'clerk'})});
    if(!res.ok) throw new Error(await res.text());
    merchantMatrixSelectedPerson = null;
    merchantMatrixPeople = [];
    showToast('授权邀请已发送，等待对方确认');
    await renderMerchantTeamManager();
  } catch(error){ showToast('邀请失败，请确认对方已完成注册'); }
}
async function revokeMerchantMatrixMember(id){
  if(!confirm('撤销后，该账号将不能再进入会员核销工作台。确定继续吗？')) return;
  try {
    if(!merchantTeamApi) throw new Error('商家团队接口未初始化');
    await merchantTeamApi.revoke(id);
    showToast('已撤销商家授权');
    await renderMerchantTeamManager();
  } catch(error){ showToast('撤销失败，请稍后重试'); }
}
async function fetchMerchantProfile(){
  if(!(session && session.user)){ currentMerchant = null; return; }
  try {
    if(!merchantPublicApi) throw new Error('商家资料接口未初始化');
    currentMerchant = await merchantPublicApi.getByUserId({ userId:session.user.id, select:'*', verified:false });
    if(currentMerchant) setMerchantIdentityCache(currentMerchant.user_id || session.user.id, currentMerchant);
    await loadMerchantApplicationStatus(false);
    await loadMerchantMatrixState();
    // 若当前正停留在"我"页，刷新一下让商家主页/普通个人页及时切换
    if(currentTab === 'profile') initProfilePage();
  } catch(e){ console.warn('商家资料拉取失败:', e.message); currentMerchant = null; }
}
/* 属性值安全转义，防止商家资料里的引号破坏 value="..." 属性 */
function escAttr(s){ return (s == null ? '' : String(s)).replace(/"/g,'&quot;'); }
function escHtml(s){
  return (s == null ? '' : String(s)).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function youtubeThumbUrl(id, quality='hqdefault'){
  return `https://img.youtube.com/vi/${encodeURIComponent(id)}/${quality}.jpg`;
}
function youtubeThumbImgHtml(id, alt=''){
  return `<img src="${youtubeThumbUrl(id)}" onerror="this.onerror=null;this.src='${youtubeThumbUrl(id, 'default')}';" alt="${escHtml(alt)}">`;
}
function postUploadedCoverSrc(p){
  if(!p) return '';
  return p.image || (Array.isArray(p.images) && p.images[0]) || '';
}
function postThumbnailCoverSrc(p){
  if(!p) return '';
  return p.image_thumbnail || (Array.isArray(p.image_thumbnails) && p.image_thumbnails[0]) || postUploadedCoverSrc(p);
}
function postCoverImgHtml(p, alt, useThumbnail=false){
  const cover = useThumbnail ? postThumbnailCoverSrc(p) : postUploadedCoverSrc(p);
  const original = postUploadedCoverSrc(p);
  const fallback = original && original !== cover ? ` onerror="this.onerror=null;this.src='${escAttr(original)}';"` : '';
  if(cover) return `<img src="${escAttr(cover)}"${fallback} alt="${escAttr(alt || p.title || '')}" style="width:100%;height:100%;object-fit:cover;display:block;">`;
  if(p && p.youtube) return youtubeThumbImgHtml(p.youtube, alt || p.title || 'YouTube封面').replace('<img ', '<img style="width:100%;height:100%;object-fit:cover;display:block;" ');
  return '';
}
function postCardMediaHtml(p, fallbackIconSize){
  const img = postCoverImgHtml(p, p && p.title, true);
  if(img) return `${img}${(p && p.youtube) ? `<div class="play-badge">${playIcon()}</div>` : ''}`;
  return `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--ink-faint);">${uiIcon('edit', fallbackIconSize || 40)}</div>`;
}
function youtubeVerticalMarker(){
  return '[[yt_vertical]]';
}
function isYoutubeVerticalSource(url){
  const raw = String(url || '').toLowerCase();
  if(raw.includes('/shorts/') || raw.includes('youtube.com/shorts')) return true;
  try {
    const parsed = new URL(String(url || '').trim());
    return ['vertical','portrait','shorts'].some(key => ['1','true','yes'].includes((parsed.searchParams.get(key) || '').toLowerCase()));
  } catch(e){
    return /[?&](vertical|portrait|shorts)=(1|true|yes)\b/i.test(raw);
  }
}
function getPostYoutubeVertical(p){
  if(!p) return false;
  if(p.youtube_vertical) return true;
  return String(p.content || '').includes(youtubeVerticalMarker());
}
function youtubeEmbedUrl(id, opts){
  opts = opts || {};
  const params = new URLSearchParams({
    rel: '0',
    autoplay: '1',
    mute: '0',
    playsinline: '1',
    enablejsapi: '1',
    vq: 'highres'
  });
  try { params.set('origin', window.location.origin); } catch(e){}
  if(opts.start) params.set('start', String(opts.start));
  return `https://www.youtube.com/embed/${encodeURIComponent(id)}?${params.toString()}`;
}
function unmuteYoutubeFrame(id){
  const frame = document.getElementById(`ytFrame-${id}`);
  if(!frame || !frame.contentWindow) return;
  try {
    frame.contentWindow.postMessage(JSON.stringify({ event:'command', func:'unMute', args:[] }), '*');
    frame.contentWindow.postMessage(JSON.stringify({ event:'command', func:'setVolume', args:[100] }), '*');
    frame.contentWindow.postMessage(JSON.stringify({ event:'command', func:'setPlaybackQuality', args:['highres'] }), '*');
    frame.contentWindow.postMessage(JSON.stringify({ event:'command', func:'setPlaybackQuality', args:['hd2160'] }), '*');
    frame.contentWindow.postMessage(JSON.stringify({ event:'command', func:'setPlaybackQuality', args:['hd1440'] }), '*');
    frame.contentWindow.postMessage(JSON.stringify({ event:'command', func:'setPlaybackQuality', args:['hd1080'] }), '*');
    frame.contentWindow.postMessage(JSON.stringify({ event:'command', func:'setPlaybackQuality', args:['hd720'] }), '*');
    frame.contentWindow.postMessage(JSON.stringify({ event:'command', func:'playVideo', args:[] }), '*');
  } catch(e){}
  const btn = document.getElementById(`ytSound-${id}`);
  if(btn) btn.style.display = 'none';
}
function primeYoutubeSound(id){
  [250, 700, 1400, 2400].forEach(delay => {
    setTimeout(() => unmuteYoutubeFrame(id), delay);
  });
}
function mediaWatermarkText(author){
  return `乐生活 · ${author || '乐生活用户'}`;
}
function mediaWatermarkHtml(author){
  return '';
}
function currentPostImageSrc(p){
  if(!p) return '';
  if(Array.isArray(p.images) && p.images.length > 0){
    const idx = Math.max(0, Math.min(currentImageIndex || 0, p.images.length - 1));
    return p.images[idx];
  }
  return postUploadedCoverSrc(p);
}
function downloadCurrentPostImage(e){
  if(e) e.stopPropagation();
  const p = getPost();
  const src = currentPostImageSrc(p);
  if(!src){ showToast('当前帖子没有可下载图片'); return; }
  downloadPostImage(src);
}
function downloadPostImage(src){
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    try {
      const canvas = document.createElement('canvas');
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(blob => {
        if(!blob){ showToast('图片生成失败，请稍后重试'); return; }
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `乐生活-${Date.now()}.jpg`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 800);
        showToast('图片已下载');
      }, 'image/jpeg', 0.92);
    } catch(err){
      console.warn('下载图片失败:', err.message);
      showToast('该图片来源暂不支持直接下载');
    }
  };
  img.onerror = () => showToast('图片读取失败，无法下载');
  img.src = src;
}
function roundRect(ctx, x, y, w, h, r){
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function merchantNoteCardHtml(p, isOwnerPage){
  const media = postCardMediaHtml(p, 32);
  return `
    <div class="merchant-real-card" onclick="${isOwnerPage ? `openPost(${JSON.stringify(p.id)})` : `openPostFromMerchantPage(${JSON.stringify(p.id)})`}">
      <div class="thumb">${media}</div>
      <div class="body">
        <div class="title">${escHtml(p.title || '无标题')}</div>
        <div class="meta">${catIcon(p.category,13)} ${escHtml(p.time || '')}</div>
      </div>
    </div>
  `;
}
function merchantDealsHtml(rows){
  if(!rows.length) return '<div class="deals-empty-panel">暂时还没有通过审核的商家优惠。</div>';
  return rows.map(d => {
    const price = moneyText(d.current_price) || d.price_note || '查看详情';
    const save = d.percent_off ? `省 ${d.percent_off}%` : (d.save_amount ? `省 ${moneyText(d.save_amount)}` : '已收录');
    return `
      <div class="merchant-deal-row">
        <div class="top">
          <div class="name">${escHtml(d.product_name_cn || d.product_name || '未命名优惠')}</div>
          <div class="price">${escHtml(price)}</div>
        </div>
        <div class="note">${escHtml(save)} · ${escHtml(d.location || '网购 / 门店')} · ${escHtml(d.ai_summary_cn || d.price_note || '价格以来源页面最终显示为准')}</div>
        ${d.source_url ? `<div class="merchant-apply-actions" style="margin-top:9px;"><button class="primary" onclick="openDealSource('${String(d.source_url || '').replace(/'/g, "\\'")}', '${String(d.id || '').replace(/'/g, '')}')">官网核对</button></div>` : ''}
      </div>
    `;
  }).join('');
}
window._merchantSectionByUserId = window._merchantSectionByUserId || {};
window._merchantProductCategoryByUserId = window._merchantProductCategoryByUserId || {};
function merchantJsonList(value){
  if(Array.isArray(value)) return value;
  if(typeof value === 'string'){
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch(e){ return []; }
  }
  return [];
}
function merchantProducts(m){ return merchantJsonList(m && (m.products || m.store_products)); }
function merchantCoupons(m){ return merchantJsonList(m && m.coupons); }
function merchantActiveSection(m){
  const userId = m && m.user_id;
  return (userId && window._merchantSectionByUserId[userId]) || 'posts';
}
function merchantProductCategoryValue(p){
  return merchantProductCategoryList(p)[0] || '其他';
}
function merchantProductCategoryList(p){
  if(!p) return [];
  const raw = Array.isArray(p.categories)
    ? p.categories
    : String((p.category || p.product_category || p.type) || '').split(/[，,、/]+/);
  const list = raw.map(x => String(x || '').trim()).filter(Boolean);
  return [...new Set(list)].slice(0, 3);
}
function merchantProductCategories(products){
  return [...new Set((products || []).flatMap(merchantProductCategoryList).filter(Boolean))];
}
function merchantProductAvailable(p){
  return p && p.active !== false;
}
function merchantActiveProductCategory(m){
  const userId = m && m.user_id;
  return (userId && window._merchantProductCategoryByUserId[userId]) || '全部';
}
function switchMerchantProductCategory(userId, category){
  window._merchantProductCategoryByUserId[userId] = category || '全部';
  const m = (currentMerchant && currentMerchant.user_id === userId) ? currentMerchant : window._merchantIdentityCache[userId];
  rerenderMerchantSection(m);
}
function rerenderMerchantSection(m){
  if(!m) return;
  if(currentMerchant && currentMerchant.user_id === m.user_id && currentTab === 'profile'){
    renderMerchantPage();
    return;
  }
  const body = document.getElementById('merchantPublicBody');
  if(body && document.getElementById('merchantPublicOverlay')?.classList.contains('open')){
    body.innerHTML = merchantContentHtml(m, { isOwnerPage:false });
  }
}
function switchMerchantSection(userId, section){
  window._merchantSectionByUserId[userId] = section;
  const m = (currentMerchant && currentMerchant.user_id === userId) ? currentMerchant : window._merchantIdentityCache[userId];
  rerenderMerchantSection(m);
  if(section === 'store' && m && merchantEnabledFeatures(m).includes('rental')){
    setTimeout(() => loadMerchantRentalStoreCatalog(m, true), 0);
  }
}
function merchantOwnerButton(label, handler){
  return `<button onclick="${handler}" style="width:100%;margin-bottom:10px;border-radius:999px;background:var(--sage);color:#fff;padding:10px 12px;font-size:13px;font-weight:900;">${label}</button>`;
}
window._merchantRentalStoreCatalog = window._merchantRentalStoreCatalog || {};
function merchantRentalStoreKey(m){ return String(m?.user_id || merchantSiteSlug(m) || ''); }
function merchantRentalStoreRate(vehicle){
  if(vehicle?.pricing_mode === 'hour') return `${merchantRentalMoney(vehicle.hourly_rate)}/小时`;
  if(vehicle?.pricing_mode === 'both') return `${merchantRentalMoney(vehicle.hourly_rate)}/小时起`;
  return `${merchantRentalMoney(vehicle?.daily_rate)}/天`;
}
async function loadMerchantRentalStoreCatalog(m, force){
  const key = merchantRentalStoreKey(m);
  const previous = window._merchantRentalStoreCatalog[key];
  if(!key || previous?.loading || (!force && previous && !previous.error)) return;
  window._merchantRentalStoreCatalog[key] = { loading:true, vehicles:[] };
  try {
    const data = await rentalApi.publicCatalog(merchantSiteSlug(m));
    window._merchantRentalStoreCatalog[key] = { loading:false, vehicles:Array.isArray(data?.vehicles) ? data.vehicles : [] };
  } catch(error){
    console.warn('租车车辆库读取失败:', error.message);
    window._merchantRentalStoreCatalog[key] = { loading:false, error:true, vehicles:[] };
  }
  rerenderMerchantSection(m);
}
function merchantRentalStoreHtml(m, isOwnerPage){
  const key = merchantRentalStoreKey(m);
  const catalog = window._merchantRentalStoreCatalog[key];
  if(!catalog){
    setTimeout(() => loadMerchantRentalStoreCatalog(m), 0);
    return '<div class="deals-empty-panel">正在读取车辆库...</div>';
  }
  if(catalog.error){
    return `<div class="deals-empty-panel">车辆库暂时无法读取。<button style="margin:12px auto 0;display:block;" onclick="loadMerchantRentalStoreCatalog(window._merchantIdentityCache['${String(m.user_id || '').replace(/'/g,'')}'] || currentMerchant, true)">重新读取</button></div>`;
  }
  const vehicles = Array.isArray(catalog.vehicles) ? catalog.vehicles : [];
  const userId = String(m.user_id || '').replace(/'/g, '');
  const ownerAction = isOwnerPage
    ? merchantOwnerButton(`${uiIcon('car',16)} 管理车辆`, `openMerchantRentalManager('${userId}')`)
    : '';
  if(!vehicles.length){
    if(catalog.loading) return `${ownerAction}<div class="deals-empty-panel">正在读取车辆库...</div>`;
    return `${ownerAction}<div class="deals-empty-panel">${isOwnerPage ? '还没有添加车辆。添加后，顾客会在这里查看并预约。' : '这家商家暂未发布可预约车辆。'}</div>`;
  }
  return `${ownerAction}<div class="merchant-product-grid">${vehicles.map(vehicle => {
    const photo = merchantRentalPhotos(vehicle.photos)[0];
    const details = [vehicle.year, vehicle.make, vehicle.model, `${vehicle.seats || 5}座`, vehicle.transmission].filter(Boolean).join(' · ');
    return `<div class="merchant-product-card" onclick="openMerchantRentalPage('${userId}')">
      <div class="merchant-product-thumb">${photo ? `<img src="${escAttr(photo)}" alt="">` : uiIcon('car',34)}</div>
      <div class="merchant-product-body">
        <div><span class="merchant-product-chip">租车</span></div>
        <div class="merchant-product-name">${escHtml(vehicle.name || '可预约车辆')}</div>
        <div class="merchant-product-price">${escHtml(merchantRentalStoreRate(vehicle))}</div>
        ${details ? `<div class="merchant-product-desc">${escHtml(details)}</div>` : ''}
        <div class="merchant-product-desc">押金 ${merchantRentalMoney(vehicle.deposit_amount)} · 点击查看并预约</div>
      </div>
    </div>`;
  }).join('')}</div>`;
}
function merchantStoreHtml(m, isOwnerPage){
  if(merchantEnabledFeatures(m).includes('auto_sales')) return merchantAutoStoreHtml(m, isOwnerPage);
  if(merchantEnabledFeatures(m).includes('rental')) return merchantRentalStoreHtml(m, isOwnerPage);
  const allProducts = merchantProducts(m);
  const products = isOwnerPage ? allProducts : allProducts.filter(merchantProductAvailable);
  const userId = String(m.user_id || '').replace(/'/g, '');
  const categories = merchantProductCategories(products);
  const activeCategory = merchantActiveProductCategory(m);
  const visibleProducts = activeCategory === '全部'
    ? products
    : products.filter(p => merchantProductCategoryList(p).includes(activeCategory));
  const filters = categories.length > 1 ? `
    <div class="merchant-product-filters">
      <button class="${activeCategory === '全部' ? 'on' : ''}" onclick="switchMerchantProductCategory('${userId}','全部')">全部</button>
      ${categories.map(cat => `<button class="${activeCategory === cat ? 'on' : ''}" onclick="switchMerchantProductCategory('${userId}', '${escAttr(cat).replace(/'/g, "\\'")}')">${escHtml(cat)}</button>`).join('')}
    </div>
  ` : '';
  return `
    ${isOwnerPage ? merchantOwnerButton('+ 添加商品', `openMerchantProductEditor('${userId}')`) : ''}
    ${products.length ? `${filters}<div class="merchant-product-grid">${visibleProducts.map(p => {
      const originalIndex = allProducts.findIndex(x => x === p);
      return merchantProductCardHtml(m, p, originalIndex, isOwnerPage);
    }).join('')}</div>` : '<div class="deals-empty-panel">店铺商品还在整理中。</div>'}
    ${products.length && !visibleProducts.length ? '<div class="deals-empty-panel">这个分类暂时没有商品。</div>' : ''}
  `;
}
function merchantAutoStoreHtml(m, isOwnerPage){
  const uid = String(m.user_id || '').replace(/'/g,'');
  return `<div class="merchant-auto-store merchant-auto-store-compact"><div class="merchant-auto-store-icon">${uiIcon('car',30)}</div><div><b>二手车买卖</b><p>浏览在售车辆或提交车辆估价。</p></div><div class="merchant-auto-store-actions">${isOwnerPage ? `<button class="primary" onclick="openMerchantAutoManager('${uid}')">${uiIcon('settings',14)} 管理</button>` : ''}<button onclick="openMerchantAutoPage('${uid}','buy')">${uiIcon('car',14)} 买车</button><button onclick="openMerchantAutoPage('${uid}','sell')">${uiIcon('car',14)} 卖车</button></div></div>`;
}
function merchantProductCardHtml(m, p, i, isOwnerPage){
  const userId = String(m.user_id || '').replace(/'/g, '');
  const inactive = p.active === false;
  const chips = merchantProductCategoryList(p);
  return `
    <div class="merchant-product-card" onclick="openMerchantProductDetail('${userId}', ${i})">
      <div class="merchant-product-thumb">${p.image ? `<img src="${escAttr(p.image)}" alt="">` : uiIcon('bag',34)}</div>
      <div class="merchant-product-body">
        <div>${chips.map(c => `<span class="merchant-product-chip">${escHtml(c)}</span>`).join(' ')}</div>
        ${inactive ? '<div class="merchant-product-chip" style="background:#fff0eb;color:#b9413a;">已下架</div>' : ''}
        <div class="merchant-product-name">${escHtml(p.name || '未命名商品')}</div>
        <div class="merchant-product-price">${escHtml(p.price || '到店咨询')}</div>
        ${p.description ? `<div class="merchant-product-desc">${escHtml(p.description)}</div>` : ''}
        ${isOwnerPage ? `
          <div class="merchant-owner-actions" onclick="event.stopPropagation()">
            <button onclick="openMerchantProductEditor('${userId}', ${i})">编辑</button>
            <button onclick="toggleMerchantProductActive(${i})">${inactive ? '上架' : '下架'}</button>
            <button class="danger" onclick="deleteMerchantProduct(${i})">删除</button>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}
function merchantSocialIcon(label){
  const key = String(label || '').toLowerCase();
  if(key.includes('小红书')) return '<span class="merchant-social-icon xhs">小</span>';
  if(key.includes('instagram')) return '<span class="merchant-social-icon instagram">◎</span>';
  if(key.includes('facebook')) return '<span class="merchant-social-icon facebook">f</span>';
  if(key.includes('youtube')) return '<span class="merchant-social-icon youtube">▶</span>';
  if(key.includes('google')) return '<span class="merchant-social-icon google">G</span>';
  if(key.includes('yelp')) return '<span class="merchant-social-icon yelp">Y</span>';
  return '<span class="merchant-social-icon website">↗</span>';
}
function ensureMerchantDetailOverlay(){
  let el = document.getElementById('merchantDetailOverlay');
  if(el) return el;
  el = document.createElement('div');
  el.id = 'merchantDetailOverlay';
  el.className = 'merchant-detail-overlay';
  el.onclick = e => { if(e.target.id === 'merchantDetailOverlay') closeMerchantDetailOverlay(); };
  el.innerHTML = '<div class="merchant-detail-sheet" id="merchantDetailSheet"></div>';
  document.body.appendChild(el);
  return el;
}
function closeMerchantDetailOverlay(){
  document.getElementById('merchantDetailOverlay')?.classList.remove('open');
}
function openMerchantProductDetail(userId, index){
  const m = (currentMerchant && currentMerchant.user_id === userId) ? currentMerchant : window._merchantIdentityCache[userId];
  const p = merchantProducts(m)[index];
  if(!m || !p){ showToast('商品暂时无法打开'); return; }
  if(p.active === false && !(currentMerchant && currentMerchant.user_id === userId)){ showToast('商品已下架'); return; }
  const overlay = ensureMerchantDetailOverlay();
  const sheet = document.getElementById('merchantDetailSheet');
  const buyUrl = p.buy_url || p.url || '';
  const chips = merchantProductCategoryList(p);
  sheet.innerHTML = `
    <button onclick="closeMerchantDetailOverlay()" style="float:right;margin:12px 12px 0 0;width:36px;height:36px;border-radius:50%;background:var(--bg-alt);font-size:18px;">×</button>
    <div style="clear:both;">
      <div style="width:100%;aspect-ratio:1/1;background:var(--bg-alt);display:flex;align-items:center;justify-content:center;overflow:hidden;">
        ${p.image ? `<img src="${escAttr(p.image)}" alt="" style="width:100%;height:100%;object-fit:cover;">` : uiIcon('bag',56)}
      </div>
      <div style="padding:16px;">
        <div>${chips.map(c => `<span class="merchant-product-chip">${escHtml(c)}</span>`).join(' ')}</div>
        <h3 style="font-size:20px;font-weight:900;margin:0 0 6px;color:var(--ink);">${escHtml(p.name || '未命名商品')}</h3>
        <div style="font-size:18px;font-weight:900;color:var(--berry);margin-bottom:10px;">${escHtml(p.price || '到店咨询')}</div>
        <p style="font-size:13px;line-height:1.7;color:var(--ink-soft);white-space:pre-line;margin:0 0 14px;">${escHtml(p.description || '暂无详细介绍。')}</p>
        <div style="display:flex;gap:10px;">
          ${buyUrl ? `<a href="${escAttr(buyUrl)}" target="_blank" rel="noopener" style="flex:1;text-align:center;border-radius:999px;background:var(--berry);color:#fff;padding:11px 12px;font-weight:900;text-decoration:none;">在线购买</a>` : ''}
          <a href="tel:${escAttr(m.phone || '')}" style="flex:1;text-align:center;border-radius:999px;background:var(--sage);color:#fff;padding:11px 12px;font-weight:900;text-decoration:none;">联系商家</a>
        </div>
      </div>
    </div>
  `;
  overlay.classList.add('open');
}
async function saveMerchantListField(field, rows){
  if(!(session && session.user) || !currentMerchant){ showToast('请先登录商家账号'); return false; }
  const payload = { [field]: rows, updated_at: new Date().toISOString() };
  try {
    if(!merchantPublicApi) throw new Error('商家资料接口未初始化');
    await merchantPublicApi.patch({ userId:session.user.id, payload });
  } catch(error) {
    const t = error.message || '';
    console.warn('商家列表保存失败:', t);
    showToast(t.includes('listing_restricted') ? '该商品可能属于平台限制或禁售范围，暂时不能保存。' : '保存失败，请确认网络后重试');
    return false;
  }
  currentMerchant[field] = rows;
  setMerchantIdentityCache(session.user.id, currentMerchant);
  renderMerchantPage();
  showToast('已保存');
  return true;
}
window._merchantItemEditor = window._merchantItemEditor || { type:'product', image:'' };
function openMerchantProductEditor(userId, index){
  if(!(session && session.user) || !currentMerchant || currentMerchant.user_id !== userId){ showToast('只有商家本人可以编辑'); return; }
  const products = merchantProducts(currentMerchant);
  const editing = Number.isInteger(index) && index >= 0 && index < products.length;
  const item = editing ? products[index] : {};
  const itemCategories = merchantProductCategoryList(item);
  window._merchantItemEditor = { type:'product', index: editing ? index : null, image:item.image || '', active:item.active !== false };
  const title = document.getElementById('merchantItemEditorTitle');
  if(title) title.textContent = editing ? '编辑商品' : '添加商品';
  const body = document.getElementById('merchantProductEditorBody');
  body.innerHTML = `
    <div class="merchant-form-field">
      <label>商品照片</label>
      <div class="merchant-image-pick coupon-wide" id="merchantProductImagePreview" onclick="document.getElementById('merchantProductImageInput').click()">
        ${item.image ? `<img src="${escAttr(item.image)}" alt="">` : `<div>${uiIcon('image',32)}<div style="margin-top:8px;">上传优惠券长图</div></div>`}
      </div>
      <input type="file" id="merchantProductImageInput" accept="image/*" style="display:none;" onchange="onMerchantItemImageSelected(event)">
    </div>
    <div class="merchant-form-field">
      <label>商品名称</label>
      <input id="merchantProductName" type="text" placeholder="例如：招牌奶茶" value="${escAttr(item.name || '')}">
    </div>
    <div class="merchant-form-field">
      <label>商品分类（最多 3 个）</label>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
        <input id="merchantProductCategory1" type="text" placeholder="奶茶" value="${escAttr(itemCategories[0] || '')}">
        <input id="merchantProductCategory2" type="text" placeholder="冷饮" value="${escAttr(itemCategories[1] || '')}">
        <input id="merchantProductCategory3" type="text" placeholder="水果茶" value="${escAttr(itemCategories[2] || '')}">
      </div>
      <div style="font-size:11px;color:var(--ink-faint);margin-top:5px;">一个商品可同时出现在多个分类里，例如“奶茶 / 热饮 / 新品”。</div>
    </div>
    <div class="merchant-form-field">
      <label>价格</label>
      <input id="merchantProductPrice" type="text" placeholder="例如：$5.99 / 到店咨询" value="${escAttr(item.price || '')}">
    </div>
    <label style="display:flex;align-items:center;gap:8px;margin:-2px 0 13px;font-size:12px;color:var(--ink-soft);cursor:pointer;"><input id="merchantProductOrderable" type="checkbox" ${item.orderable !== false ? 'checked' : ''} style="width:16px;height:16px;accent-color:var(--sage);">可在扫码点餐菜单中点选</label>
    <div class="merchant-form-field">
      <label>商品介绍</label>
      <textarea id="merchantProductDesc" placeholder="介绍口味、规格、亮点、适合人群...">${escHtml(item.description || '')}</textarea>
    </div>
    <div class="merchant-form-field">
      <label>在线购买链接（可选）</label>
      <input id="merchantProductBuyUrl" type="url" placeholder="https://" value="${escAttr(item.buy_url || item.url || '')}">
    </div>
    <div class="merchant-form-actions">
      <button onclick="closeMerchantProductEditor()">取消</button>
      <button class="primary" onclick="saveMerchantProductFromEditor()">${editing ? '保存修改' : '保存商品'}</button>
    </div>
  `;
  document.getElementById('merchantProductEditor')?.classList.add('open');
}
function closeMerchantProductEditor(){
  document.getElementById('merchantProductEditor')?.classList.remove('open');
}
function refreshMerchantItemImagePreview(){
  const state = window._merchantItemEditor || {};
  const preview = document.getElementById('merchantProductImagePreview');
  if(!preview) return;
  preview.innerHTML = state.image
    ? `<img src="${escAttr(state.image)}" alt="">`
    : `<div>${uiIcon('image',32)}<div style="margin-top:8px;">上传并裁切 1:1 图片</div></div>`;
}
async function saveMerchantProductFromEditor(){
  if(!(session && session.user) || !currentMerchant){ showToast('请先登录商家账号'); return; }
  const name = document.getElementById('merchantProductName')?.value.trim();
  if(!name){ showToast('请填写商品名称'); return; }
  const products = merchantProducts(currentMerchant).slice();
  const state = window._merchantItemEditor || {};
  const previousImage = state.index != null && products[state.index] ? products[state.index].image || '' : '';
  let image = state.image || '';
  try {
    if(isDataImageUrl(image)){
      showToast('正在压缩并上传商品图片…');
      image = await uploadMediaDataUrl(image, 'products');
      state.image = image;
    }
  } catch(error){ showToast(error.message || '商品图片上传失败，请重试'); return; }
  const categories = [
    document.getElementById('merchantProductCategory1')?.value.trim(),
    document.getElementById('merchantProductCategory2')?.value.trim(),
    document.getElementById('merchantProductCategory3')?.value.trim()
  ].filter(Boolean);
  const row = {
    id: state.index != null && products[state.index] ? (products[state.index].id || `p_${Date.now()}`) : `p_${Date.now()}`,
    name,
    category: categories[0] || '其他',
    categories: categories.length ? categories : ['其他'],
    price: document.getElementById('merchantProductPrice')?.value.trim() || '',
    description: document.getElementById('merchantProductDesc')?.value.trim() || '',
    buy_url: document.getElementById('merchantProductBuyUrl')?.value.trim() || '',
    image
    ,active: state.index != null && products[state.index] ? products[state.index].active !== false : true
    ,orderable: document.getElementById('merchantProductOrderable')?.checked !== false
  };
  if(state.index != null && products[state.index]) products[state.index] = row;
  else products.unshift(row);
  const ok = await saveMerchantListField('products', products);
  if(ok){
    closeMerchantProductEditor();
    if(previousImage && previousImage !== image) releaseMediaUrl(previousImage);
  }
}
async function deleteMerchantProduct(index){
  if(!(session && session.user) || !currentMerchant){ showToast('请先登录商家账号'); return; }
  const products = merchantProducts(currentMerchant).slice();
  if(!products[index]) return;
  if(!confirm(`确定删除「${products[index].name || '这个商品'}」吗？`)) return;
  const removedImage = products[index].image || '';
  products.splice(index, 1);
  if(await saveMerchantListField('products', products)) releaseMediaUrl(removedImage);
}
async function toggleMerchantProductActive(index){
  if(!(session && session.user) || !currentMerchant){ showToast('请先登录商家账号'); return; }
  const products = merchantProducts(currentMerchant).slice();
  if(!products[index]) return;
  products[index] = Object.assign({}, products[index], { active: products[index].active === false });
  await saveMerchantListField('products', products);
}

/* ---------- 5.210：商家餐桌扫码点餐 ---------- */
window._merchantOrderState = window._merchantOrderState || { merchant:null, table:null, tables:[], cart:{}, category:'全部', activeOrderId:null, orderCode:'', managerStatus:'active', orders:[], items:[] };
/* Removed overridden merchantOrderState implementation during v5.510 cleanup. */

function merchantOrderPriceNumber(value){ const match = String(value || '').match(/\d+(?:\.\d{1,2})?/); return match ? Number(match[0]) : 0; }
function merchantOrderMoney(value){ return `$${Number(value || 0).toFixed(2)}`; }
function merchantOrderUrl(m, tableCode){ return `${window.location.origin}/restaurant/order/?merchant=${encodeURIComponent(merchantSiteSlug(m))}&table=${encodeURIComponent(tableCode)}&restaurant_v=5.419&app_v=${encodeURIComponent(APP_VERSION)}&refresh_t=${Date.now()}`; }
function merchantTakeoutUrl(m){ return `${window.location.origin}/restaurant/order/?merchant=${encodeURIComponent(merchantSiteSlug(m))}&mode=takeout&restaurant_v=5.419&app_v=${encodeURIComponent(APP_VERSION)}&refresh_t=${Date.now()}`; }
function merchantQueueUrl(m){ return `https://escoopcity.com/restaurant/queue/?merchant=${encodeURIComponent(merchantSiteSlug(m))}&queue_v=5.382`; }
/* Removed overridden merchantOrderStatusText implementation during v5.510 cleanup. */

function merchantOrderProducts(m){ return merchantProducts(m).filter(p => merchantProductAvailable(p) && p.orderable !== false); }
async function getMerchantOrderMerchant(userId){
  if(currentMerchant && String(currentMerchant.user_id) === String(userId) && Array.isArray(currentMerchant.products || currentMerchant.store_products)) return currentMerchant;
  const cached=window._merchantIdentityCache && window._merchantIdentityCache[userId];
  if(cached && Array.isArray(cached.products || cached.store_products)) return cached;
  try {
    if(!merchantPublicApi) throw new Error('商家资料接口未初始化');
    const m = await merchantPublicApi.getByUserId({ userId, select:'*', verified:true });
    if(m) setMerchantIdentityCache(m.user_id, m);
    return m || cached || null;
  } catch(error) { if(cached) return cached; throw error; }
}
async function loadMerchantOrderTables(merchantUserId, includeInactive){
  const filter = includeInactive ? '' : '&is_active=eq.true';
  const res = await authedFetch(`${SUPABASE_URL}/rest/v1/merchant_order_tables?merchant_user_id=eq.${encodeURIComponent(merchantUserId)}${filter}&select=*&order=table_name.asc`, {method:'GET'});
  if(!res.ok) throw new Error(await res.text()); return await res.json();
}
async function applyMerchantOrderTableAvailability(tables, merchantUserId){
  try{
    const res=await authedFetch(`${SUPABASE_URL}/rest/v1/rpc/merchant_order_table_availability`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({p_merchant_user_id:merchantUserId})});
    if(!res.ok) throw new Error(await res.text());
    const occupied=new Set((await res.json()).filter(row=>row.is_occupied).map(row=>String(row.table_code)));
    return (tables||[]).map(table=>Object.assign({},table,{is_occupied:occupied.has(String(table.table_code))}));
  }catch(error){console.warn('读取餐桌占用状态失败:',error.message);return tables||[];}
}
async function openMerchantOrderEntry(merchantUserId, tableCode){
  if(!(session && session.user)){ showToast('登录后即可扫码点餐'); openAuth('login'); return; }
  const sheet = document.getElementById('merchantOrderMenu'); const body = document.getElementById('merchantOrderMenuBody');
  if(!sheet || !body) return; sheet.classList.add('open'); body.innerHTML = '<div class="deals-empty-panel">正在读取菜单...</div>';
  try {
    const m = await getMerchantOrderMerchant(merchantUserId); if(!m) throw new Error('merchant_not_found');
    const tables = await loadMerchantOrderTables(m.user_id, false);
    const table = tableCode ? tables.find(row => String(row.table_code) === String(tableCode).toLowerCase()) : null;
    window._merchantOrderState = { merchant:m, table:table || null, tables, cart:{}, category:'全部', activeOrderId:null, orderCode:'', managerStatus:'active', orders:[], items:[] };
    renderMerchantOrderMenu();
  } catch(error){ console.warn('打开扫码点餐失败:', error.message); body.innerHTML = '<div class="deals-empty-panel">点餐页面暂时无法打开，请稍后再试。</div>'; }
}
/* Removed overridden closeMerchantOrderMenu implementation during v5.510 cleanup. */

function selectMerchantOrderTable(code){ const state=merchantOrderState(); state.table=(state.tables||[]).find(row=>String(row.table_code)===String(code))||null; state.cart={}; state.activeOrderId=null; renderMerchantOrderMenu(); }
function merchantOrderQty(productId){ return Number(merchantOrderState().cart[String(productId)] || 0); }
function changeMerchantOrderQty(productId, delta){ const state=merchantOrderState(); const next=Math.max(0,Math.min(99,merchantOrderQty(productId)+Number(delta||0))); if(next) state.cart[String(productId)]=next; else delete state.cart[String(productId)]; renderMerchantOrderMenu(); }
function switchMerchantOrderCategory(category){ merchantOrderState().category=category||'全部'; renderMerchantOrderMenu(); }
function merchantOrderCartRows(){ const state=merchantOrderState(); return merchantOrderProducts(state.merchant).filter(p=>merchantOrderQty(p.id)).map(p=>Object.assign({},p,{quantity:merchantOrderQty(p.id)})); }
function renderMerchantOrderMenuBase(){
  const body=document.getElementById('merchantOrderMenuBody'); const state=merchantOrderState(); if(!body||!state.merchant) return; const m=state.merchant;
  if(!state.table){
    body.innerHTML=`<div class="order-merchant-hero"><div class="order-merchant-title"><div class="logo">${m.logo?`<img src="${escAttr(m.logo)}" alt="">`:escHtml(initials(m.business_name||'店'))}</div><div><b>${escHtml(m.business_name||'商家点餐')}</b><span>请选择你所在的桌位</span></div></div></div><div class="order-notice">为保证订单送到正确的桌位，请选择桌号。到店结账，不会在此页面扣款。</div>${(state.tables||[]).length?state.tables.map(table=>`<button class="merchant-table-card" onclick="selectMerchantOrderTable('${escAttr(table.table_code)}')"><span style="width:42px;height:42px;border-radius:12px;background:var(--sage-light);color:var(--sage-dark);display:flex;align-items:center;justify-content:center;font-weight:900;">${uiIcon('store',18)}</span><span style="min-width:0;flex:1;text-align:left;"><b>${escHtml(table.table_name)}</b><span>点此开始点餐</span></span><span style="font-size:22px;color:var(--sage-dark);">›</span></button>`).join(''):'<div class="deals-empty-panel">这家店还没有设置餐桌二维码，请向店员咨询。</div>'}`;
    return;
  }
  const products=merchantOrderProducts(m), categories=merchantProductCategories(products), category=state.category||'全部';
  const visible=category==='全部'?products:products.filter(p=>merchantProductCategoryList(p).includes(category)); const cart=merchantOrderCartRows();
  const count=cart.reduce((sum,row)=>sum+row.quantity,0), total=cart.reduce((sum,row)=>sum+merchantOrderPriceNumber(row.price)*row.quantity,0);
  body.innerHTML=`<div class="order-merchant-hero"><div class="order-merchant-title"><div class="logo">${m.logo?`<img src="${escAttr(m.logo)}" alt="">`:escHtml(initials(m.business_name||'店'))}</div><div><b>${escHtml(m.business_name||'商家点餐')}</b><span>${escHtml(m.address||'乐生活扫码点餐')}</span></div></div><div class="order-table-pill">${uiIcon('store',14)} ${escHtml(state.table.table_name)} <button onclick="merchantOrderState().table=null;renderMerchantOrderMenu()" style="border:0;background:transparent;color:#fff;text-decoration:underline;font:800 11px inherit;padding:0;">更换</button></div></div><div class="order-notice">请确认桌号后再提交。此页面仅发送订单给商家，到店后按商家方式结账。</div>${state.activeOrderId?`<div class="order-notice" style="border-color:var(--sage);background:var(--sage-light);color:var(--sage-dark);">订单 ${escHtml(state.orderCode||'')} 已发送。需要加菜时继续选择菜品并提交即可。</div>`:''}${categories.length>1?`<div class="order-category-tabs"><button class="${category==='全部'?'on':''}" onclick="switchMerchantOrderCategory('全部')">全部</button>${categories.map(cat=>`<button class="${category===cat?'on':''}" onclick="switchMerchantOrderCategory('${escAttr(cat).replace(/'/g,"\\'")}')">${escHtml(cat)}</button>`).join('')}</div>`:''}<div class="order-menu-list">${visible.length?visible.map(p=>{const qty=merchantOrderQty(p.id);return `<div class="order-menu-item"><div class="order-menu-thumb">${p.image?`<img src="${escAttr(p.image)}" alt="">`:uiIcon('bag',28)}</div><div class="order-menu-main"><b>${escHtml(p.name||'未命名商品')}</b>${p.description?`<p>${escHtml(p.description)}</p>`:''}<strong>${escHtml(p.price||'到店咨询')}</strong></div><div class="order-qty"><button onclick="changeMerchantOrderQty('${escAttr(p.id)}',-1)" ${qty?'':'disabled'}>−</button>${qty?`<span>${qty}</span>`:''}<button class="add" onclick="changeMerchantOrderQty('${escAttr(p.id)}',1)">+</button></div></div>`}).join(''):'<div class="deals-empty-panel">商家还没有可点的菜单，请向店员咨询。</div>'}</div><div class="order-bottom-bar"><div class="summary"><b>${merchantOrderMoney(total)}</b><span>${count?`已选 ${count} 件`:'请选择菜品'}${state.activeOrderId?' · 本次加菜':''}</span></div><button ${count?'':'disabled'} onclick="submitMerchantOrder()">${state.activeOrderId?'确认加菜':'提交订单'}</button></div>`;
}
/* Removed overridden renderMerchantOrderMenu implementation during v5.510 cleanup. */

async function submitMerchantOrder(){
  const state=merchantOrderState(), rows=merchantOrderCartRows(); if(!state.merchant||!state.table||!rows.length){showToast('请先选择菜品');return;}
  const note=window.prompt('备注（可选，例如少冰、不要辣）','')||'';
  try { const res=await authedFetch(`${SUPABASE_URL}/rest/v1/rpc/merchant_order_create`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({p_merchant_user_id:state.merchant.user_id,p_table_code:state.table.table_code,p_items:rows.map(row=>({product_id:row.id,quantity:row.quantity})),p_note:note,p_existing_order_id:state.activeOrderId||null})});if(!res.ok)throw new Error(await res.text());const id=await res.json();state.activeOrderId=id;state.cart={};const orderRes=await authedFetch(`${SUPABASE_URL}/rest/v1/merchant_orders?id=eq.${encodeURIComponent(id)}&select=order_code&limit=1`,{method:'GET'});if(orderRes.ok){const row=(await orderRes.json())[0];state.orderCode=row&&row.order_code||'';}renderMerchantOrderMenu();showToast(state.orderCode?`订单 ${state.orderCode} 已发送`:'订单已发送给商家'); } catch(error){console.warn('提交点餐失败:',error.message);showToast(String(error.message||'').includes('product_unavailable')?'有菜品已下架，请重新选择':'提交失败，请稍后重试');}
}
function merchantOrderManagerMerchantId(){ if(currentMerchant&&session&&session.user&&String(currentMerchant.user_id)===String(session.user.id))return currentMerchant.user_id; return activeMerchantWorkspaceId(); }
async function openMerchantOrderManager(merchantUserId){ const id=merchantUserId||merchantOrderManagerMerchantId(); if(!id||!(String(id)===String(session&&session.user&&session.user.id)||canOperateMerchantWorkspace())){showToast('你没有这家商店的订单管理权限');return;}const sheet=document.getElementById('merchantOrderManager');if(!sheet)return;sheet.dataset.merchantUserId=id;sheet.classList.add('open');await renderMerchantOrderManager(); }
/* Removed overridden closeMerchantOrderManager implementation during v5.510 cleanup. */

/* Removed overridden merchantOrderManagerStatus implementation during v5.510 cleanup. */

async function renderMerchantOrderManager(){
  const body=document.getElementById('merchantOrderManagerBody'),merchantUserId=document.getElementById('merchantOrderManager')?.dataset.merchantUserId||merchantOrderManagerMerchantId();if(!body||!merchantUserId)return;body.innerHTML='<div class="deals-empty-panel">正在读取订单...</div>';
  try {const [merchant,tables,orders]=await Promise.all([getMerchantOrderMerchant(merchantUserId),loadMerchantOrderTables(merchantUserId,true),(async()=>{const res=await authedFetch(`${SUPABASE_URL}/rest/v1/merchant_orders?merchant_user_id=eq.${encodeURIComponent(merchantUserId)}&select=*&order=updated_at.desc&limit=100`,{method:'GET'});if(!res.ok)throw new Error(await res.text());return await res.json();})()]);const ids=orders.map(row=>row.id).filter(Boolean);let items=[];if(ids.length){const res=await authedFetch(`${SUPABASE_URL}/rest/v1/merchant_order_items?order_id=in.(${ids.map(encodeURIComponent).join(',')})&select=*&order=batch_no.asc,created_at.asc`,{method:'GET'});if(res.ok)items=await res.json();}Object.assign(merchantOrderState(),{merchant,tables,orders,items});const status=merchantOrderState().managerStatus||'active',list=orders.filter(row=>status==='active'?!['completed','cancelled'].includes(row.status):row.status===status),tabs=[['active','处理中'],['pending','待确认'],['preparing','制作中'],['served','已上桌'],['completed','已完成']];body.innerHTML=`<div class="merchant-order-top-actions"><button class="primary" onclick="openMerchantTableManager()">${uiIcon('store',17)} 餐桌二维码</button><button onclick="renderMerchantOrderManager()">${uiIcon('refresh',17)} 刷新订单</button></div><div class="order-notice">${escHtml(merchant&&merchant.business_name||'商家')} · 顾客提交的订单会显示在这里。订单仅作到店点餐记录，不含线上支付。</div><div class="merchant-order-status-tabs">${tabs.map(row=>`<button class="${status===row[0]?'on':''}" onclick="merchantOrderManagerStatus('${row[0]}')">${row[1]} ${row[0]==='active'?`(${orders.filter(o=>!['completed','cancelled'].includes(o.status)).length})`:''}</button>`).join('')}</div>${list.length?list.map(order=>merchantOrderCardHtml(order,items.filter(item=>String(item.order_id)===String(order.id)))).join(''):'<div class="deals-empty-panel">这里暂时没有订单。</div>'}`;}catch(error){console.warn('订单管理读取失败:',error.message);body.innerHTML='<div class="deals-empty-panel">订单读取失败，请确认已运行 5.210 SQL。</div>';}
}
/* Removed overridden merchantOrderCardHtml implementation during v5.510 cleanup. */

async function setMerchantOrderStatus(orderId,status){try{await restaurantOrderApi.setOrderStatus(orderId,status);showToast(`订单已${merchantOrderStatusText(status)}`);renderMerchantOrderManager();}catch(error){showToast('更新订单状态失败');}}
function closeMerchantTableManager(){document.getElementById('merchantTableManager')?.classList.remove('open');}
async function openMerchantTableManager(){if(!merchantWorkspaceHasPermission('table_manage')){showToast('你没有餐桌二维码管理权限');return;}const sheet=document.getElementById('merchantTableManager');if(!sheet)return;sheet.classList.add('open');await renderMerchantTableManager();}
async function renderMerchantTableManager(){const body=document.getElementById('merchantTableManagerBody'),merchantUserId=document.getElementById('merchantOrderManager')?.dataset.merchantUserId||merchantOrderManagerMerchantId();if(!body||!merchantUserId)return;body.innerHTML='<div class="deals-empty-panel">正在读取餐桌...</div>';try{const[m,tables]=await Promise.all([getMerchantOrderMerchant(merchantUserId),loadMerchantOrderTables(merchantUserId,true)]);merchantOrderState().merchant=m;merchantOrderState().tables=tables;body.innerHTML=`<div class="order-notice">新增桌位后会生成专属二维码。将二维码贴在桌上，顾客扫码后即可从该桌点餐。</div><div class="merchant-form-field"><label>新增餐桌</label><div style="display:grid;grid-template-columns:1fr auto;gap:8px;"><input id="merchantOrderTableName" maxlength="24" placeholder="例如：A01、靠窗 1 号桌"><button class="primary" onclick="addMerchantOrderTable()" style="border:0;border-radius:10px;background:var(--sage);color:#fff;font:900 13px inherit;padding:0 14px;">添加</button></div></div>${tables.length?tables.map(table=>merchantOrderTableCardHtml(m,table)).join(''):'<div class="deals-empty-panel">还没有餐桌二维码。</div>'}`;}catch(error){body.innerHTML='<div class="deals-empty-panel">餐桌读取失败，请稍后重试。</div>';}}
/* Removed overridden merchantOrderTableCardHtml implementation during v5.510 cleanup. */

async function addMerchantOrderTable(){const name=document.getElementById('merchantOrderTableName')?.value.trim(),merchantUserId=document.getElementById('merchantOrderManager')?.dataset.merchantUserId||merchantOrderManagerMerchantId();if(!name||!merchantUserId){showToast('请填写餐桌名称');return;}const code=`t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`;try{await restaurantOrderApi.addTable({merchantUserId,tableName:name,tableCode:code});showToast('餐桌二维码已生成');renderMerchantTableManager();}catch(error){showToast('新增餐桌失败，请确认你有管理权限');}}
async function toggleMerchantOrderTable(id,enabled){try{const res=await authedFetch(`${SUPABASE_URL}/rest/v1/merchant_order_tables?id=eq.${Number(id)}`,{method:'PATCH',body:JSON.stringify({is_active:!!enabled,updated_at:new Date().toISOString()})});if(!res.ok)throw new Error(await res.text());renderMerchantTableManager();}catch(error){showToast('更新餐桌失败');}}
function copyMerchantOrderTableLink(url){if(navigator.clipboard)navigator.clipboard.writeText(url).then(()=>showToast('点餐链接已复制')).catch(()=>window.prompt('请复制点餐链接',url));else window.prompt('请复制点餐链接',url);}

/* ---------- 5.248：扫码点餐流程增强 ---------- */
const MERCHANT_ORDER_REFRESH_MS = 3 * 60 * 1000;
window._merchantOrderRefreshTimers = window._merchantOrderRefreshTimers || { manager:null, customer:null };
function merchantOrderState(){
  window._merchantOrderState = window._merchantOrderState || {};
  const state = window._merchantOrderState;
  if(!state.cart) state.cart = {};
  if(!Array.isArray(state.tables)) state.tables = [];
  if(!Array.isArray(state.items)) state.items = [];
  if(!Array.isArray(state.orders)) state.orders = [];
  if(!state.category) state.category = '全部';
  if(!state.managerStatus) state.managerStatus = 'active';
  return state;
}
function stopMerchantOrderAutoRefresh(type){
  const timers = window._merchantOrderRefreshTimers;
  if(timers && timers[type]) clearInterval(timers[type]);
  if(timers) timers[type] = null;
}
function startMerchantOrderAutoRefresh(type){
  stopMerchantOrderAutoRefresh(type);
  window._merchantOrderRefreshTimers[type] = setInterval(() => {
    const sheetId = type === 'manager' ? 'merchantOrderManager' : 'merchantOrderMenu';
    const open = document.getElementById(sheetId)?.classList.contains('open');
    if(!open){ stopMerchantOrderAutoRefresh(type); return; }
    if(type === 'manager') renderMerchantOrderManager(true);
    else loadMerchantCustomerActiveOrder(true);
  }, MERCHANT_ORDER_REFRESH_MS);
}
async function loadMerchantOrderDetails(orderId){
  if(!orderId) return { order:null, items:[] };
  const [orderRes, itemsRes] = await Promise.all([
    authedFetch(`${SUPABASE_URL}/rest/v1/merchant_orders?id=eq.${encodeURIComponent(orderId)}&select=*&limit=1`, { method:'GET' }),
    authedFetch(`${SUPABASE_URL}/rest/v1/merchant_order_items?order_id=eq.${encodeURIComponent(orderId)}&select=*&order=batch_no.asc,created_at.asc`, { method:'GET' })
  ]);
  if(!orderRes.ok) throw new Error(await orderRes.text());
  if(!itemsRes.ok) throw new Error(await itemsRes.text());
  return { order:(await orderRes.json())[0] || null, items:await itemsRes.json() };
}
async function loadMerchantCustomerActiveOrder(silent){
  const state = merchantOrderState();
  if(!state.merchant || (!state.table && state.orderMode!=='takeout') || !(session && session.user)) return;
  try {
    const orderFilter=state.orderMode==='takeout'?`order_type=eq.takeout`:`table_id=eq.${Number(state.table.id)}`;
    const res = await authedFetch(`${SUPABASE_URL}/rest/v1/merchant_orders?merchant_user_id=eq.${encodeURIComponent(state.merchant.user_id)}&${orderFilter}&user_id=eq.${encodeURIComponent(session.user.id)}&status=in.(pending,confirmed,preparing,reminded,served)&select=*&order=updated_at.desc&limit=1`, { method:'GET' });
    if(!res.ok) throw new Error(await res.text());
    const order = (await res.json())[0] || null;
    if(order){
      const detail = await loadMerchantOrderDetails(order.id);
      state.order = detail.order;
      state.activeOrderId = order.id;
      state.orderCode = order.order_code || '';
      state.items = detail.items;
    } else {
      state.order = null;
      state.activeOrderId = null;
      state.orderCode = '';
      state.items = [];
    }
    if(!silent) renderMerchantOrderMenu();
    else renderMerchantOrderMenu();
  } catch(error){
    console.warn('读取已点内容失败:', error.message);
    if(!silent) showToast('已点内容暂时无法刷新');
  }
}
function merchantCustomerTableLockKey(merchantUserId){
  return `leshenghuo_order_table_lock_${session&&session.user?session.user.id:'guest'}_${merchantUserId||''}`;
}
function merchantCustomerTableLock(merchantUserId){
  try{return JSON.parse(localStorage.getItem(merchantCustomerTableLockKey(merchantUserId))||'null');}catch(error){return null;}
}
function saveMerchantCustomerTableLock(merchantUserId,table){
  if(!merchantUserId||!table)return;
  localStorage.setItem(merchantCustomerTableLockKey(merchantUserId),JSON.stringify({table_code:String(table.table_code||''),table_name:String(table.table_name||''),saved_at:Date.now()}));
}
function clearMerchantCustomerTableLock(merchantUserId){
  localStorage.removeItem(merchantCustomerTableLockKey(merchantUserId));
}
async function openMerchantOrderEntry(merchantUserId, tableCode, orderMode){
  if(!(session && session.user)){ showToast('登录后即可扫码点餐'); openAuth('login'); return; }
  const sheet = document.getElementById('merchantOrderMenu');
  const body = document.getElementById('merchantOrderMenuBody');
  if(!sheet || !body) return;
  sheet.classList.add('open');
  body.innerHTML = '<div class="deals-empty-panel">正在读取菜单...</div>';
  try {
    const merchant = await getMerchantOrderMerchant(merchantUserId);
    if(!merchant) throw new Error('merchant_not_found');
    const takeout=orderMode==='takeout';
    const tables = takeout ? [] : await applyMerchantOrderTableAvailability(await loadMerchantOrderTables(merchant.user_id, false),merchant.user_id);
    const requestedTable = tableCode ? tables.find(row => String(row.table_code) === String(tableCode).toLowerCase()) : null;
    const tableLock = takeout ? null : merchantCustomerTableLock(merchant.user_id);
    const lockedTable = tableLock ? tables.find(row => String(row.table_code) === String(tableLock.table_code)) : null;
    const table = lockedTable || requestedTable || null;
    window._merchantOrderState = { merchant, table:table || null, tables, cart:{}, category:'全部', activeOrderId:null, orderCode:'', order:null, items:[], orders:[], managerStatus:'active', orderMode:takeout?'takeout':'dinein', takeout:{fulfillment:'pickup'} };
    if(table && !lockedTable) saveMerchantCustomerTableLock(merchant.user_id,table);
    if(lockedTable && requestedTable && String(lockedTable.table_code)!==String(requestedTable.table_code)) showToast(`当前点餐已锁定在${lockedTable.table_name}，如需换桌请点击“更换”。`);
    if(takeout){ renderMerchantOrderMenu(); return; }
    if(table) await loadMerchantCustomerActiveOrder();
    else renderMerchantOrderMenu();
  } catch(error){
    console.warn('打开扫码点餐失败:', error.message);
    body.innerHTML = '<div class="deals-empty-panel">点餐页面暂时无法打开，请稍后再试。</div>';
  }
}
function closeMerchantOrderMenu(){ document.getElementById('merchantOrderMenu')?.classList.remove('open'); }
async function selectMerchantOrderTable(code){
  const state = merchantOrderState();
  const nextTable = (state.tables || []).find(row => String(row.table_code) === String(code)) || null;
  if(!nextTable) return;
  if(nextTable.is_occupied && String(nextTable.table_code)!==String(state.table&&state.table.table_code)){showToast('该桌正在用餐，暂时不能更换。');return;}
  const existingLock = merchantCustomerTableLock(state.merchant&&state.merchant.user_id);
  if(existingLock && String(existingLock.table_code)!==String(nextTable.table_code)){
    if(state.activeOrderId || state.order){showToast('该桌已经正式下单，需要服务员协助换桌。');return;}
    if(Object.keys(state.cart||{}).length && !confirm('更换桌号会清空当前已选菜品，是否继续？')) return;
  }
  state.table = nextTable;
  state.cart = {};
  state.activeOrderId = null;
  state.order = null;
  state.items = [];
  saveMerchantCustomerTableLock(state.merchant&&state.merchant.user_id,nextTable);
  await loadMerchantCustomerActiveOrder();
}
function requestMerchantOrderTableChange(){
  const state=merchantOrderState();
  if(!state||!state.merchant)return;
  if(state.activeOrderId||state.order){showToast('该桌已经正式下单，需要服务员协助换桌。');return;}
  if(Object.keys(state.cart||{}).length&&!confirm('更换桌号会清空当前已选菜品，是否继续？'))return;
  clearMerchantCustomerTableLock(state.merchant.user_id);
  state.table=null;state.cart={};state.items=[];
  renderMerchantOrderMenu();
}
/* Removed overridden merchantOrderBatchHtml implementation during v5.510 cleanup. */

function merchantCustomerOrderSummaryHtml(state){
  const order = state.order;
  if(!order) return '';
  const allServed = (state.items || []).length > 0 && (state.items || []).every(item => item.is_served === true);
  const canRemind = ['pending','confirmed','preparing'].includes(String(order.status || ''));
  const canCheckout = order.payment_status !== 'paid' && !['cancelled','completed'].includes(String(order.status || ''));
  const checkoutButton = canCheckout ? `<button onclick="openMerchantOrderCheckout()" style="margin-top:12px;width:100%;border:0;border-radius:10px;background:var(--sage);color:#fff;padding:11px;font:900 13px inherit;">${allServed?'结算':'提前结算'}</button>` : '';
  const serviceAction = !allServed && canRemind ? `<button onclick="remindMerchantOrder()" style="margin-top:10px;width:100%;border:1px solid var(--berry);border-radius:10px;background:#fff;color:var(--berry);padding:10px;font:900 13px inherit;">催菜</button>` : '';
  const note = order.payment_status === 'paid' ? '<div style="margin-top:10px;font-size:11.5px;color:var(--sage-dark);">已完成付款，商家仍会继续制作并上菜。</div>' : !allServed ? '<div style="margin-top:10px;font-size:11.5px;color:var(--ink-faint);">菜品未全部上桌也可先结算，商家会继续出菜。</div>' : '';
  return `<div class="merchant-mini-section" style="margin:14px 0 2px;"><div style="display:flex;align-items:center;justify-content:space-between;gap:10px;"><b>${uiIcon('bag',14)} 已点内容</b><span style="font-size:11px;font-weight:800;color:var(--sage-dark);">${escHtml(merchantOrderStatusText(order.status))}</span></div><div class="merchant-order-lines" style="margin-top:10px;">${merchantOrderBatchHtml(state.items)}</div><div class="merchant-order-line" style="margin-top:10px;padding-top:10px;border-top:1px solid var(--line);"><b>合计 ${Number(order.item_count || 0)} 件</b><b style="color:var(--berry);">${merchantOrderMoney(order.subtotal)}</b></div>${checkoutButton}${serviceAction}${note}</div>`;
}
function renderMerchantOrderMenu(){
  const body = document.getElementById('merchantOrderMenuBody');
  const state = merchantOrderState();
  if(!body || !state.merchant) return;
  const merchant = state.merchant;
  const isTakeout = state.orderMode === 'takeout';
  if(!state.table && state.orderMode!=='takeout'){
    body.innerHTML = `<div class="order-merchant-hero"><div class="order-merchant-title"><div class="logo">${merchant.logo ? `<img src="${escAttr(merchant.logo)}" alt="">` : escHtml(initials(merchant.business_name || '店'))}</div><div><b>${escHtml(merchant.business_name || '商家点餐')}</b><span>请选择你所在的桌位</span></div></div></div><div class="order-notice">为保证订单送到正确的桌位，请选择桌号。正在用餐的桌位不能更换进入。</div>${(state.tables || []).length ? state.tables.map(table => table.is_occupied ? `<button class="merchant-table-card" disabled style="opacity:.52;cursor:not-allowed;"><span style="width:42px;height:42px;border-radius:12px;background:#f3e7e5;color:var(--berry);display:flex;align-items:center;justify-content:center;">${uiIcon('store',18)}</span><span style="min-width:0;flex:1;text-align:left;"><b>${escHtml(table.table_name)}</b><span>正在用餐</span></span><span style="font-size:12px;color:var(--berry);font-weight:900;">已占用</span></button>` : `<button class="merchant-table-card" onclick="selectMerchantOrderTable('${escAttr(table.table_code)}')"><span style="width:42px;height:42px;border-radius:12px;background:var(--sage-light);color:var(--sage-dark);display:flex;align-items:center;justify-content:center;">${uiIcon('store',18)}</span><span style="min-width:0;flex:1;text-align:left;"><b>${escHtml(table.table_name)}</b><span>点此开始点餐</span></span><span style="font-size:22px;color:var(--sage-dark);">›</span></button>`).join('') : '<div class="deals-empty-panel">这家店还没有设置餐桌二维码，请向店员咨询。</div>'}`;
    return;
  }
  const products = merchantOrderProducts(merchant);
  const categories = merchantProductCategories(products);
  const category = state.category || '全部';
  const visible = category === '全部' ? products : products.filter(product => merchantProductCategoryList(product).includes(category));
  const cart = merchantOrderCartRows();
  const count = cart.reduce((sum,row) => sum + row.quantity, 0);
  const total = cart.reduce((sum,row) => sum + merchantOrderPriceNumber(row.price) * row.quantity, 0);
  body.innerHTML = `<div class="order-merchant-hero"><div class="order-merchant-title"><div class="logo">${merchant.logo ? `<img src="${escAttr(merchant.logo)}" alt="">` : escHtml(initials(merchant.business_name || '店'))}</div><div><b>${escHtml(merchant.business_name || (isTakeout ? '外卖点单' : '商家点餐'))}</b><span>${escHtml(merchant.address || (isTakeout ? '乐生活外卖点单' : '乐生活扫码点餐'))}</span></div></div><div class="order-table-pill">${isTakeout ? `${uiIcon('bag',14)} 外卖点单` : `${uiIcon('store',14)} ${escHtml(state.table.table_name)} <button onclick="requestMerchantOrderTableChange()" style="border:0;background:transparent;color:#fff;text-decoration:underline;font:800 11px inherit;padding:0;">更换</button>`}</div></div><div class="order-notice">${isTakeout ? '选择菜品后加入购物车，再填写取餐与结算信息。' : '下拉即可刷新已点内容。提交订单后可继续加菜。'}</div>${merchantCustomerOrderSummaryHtml(state)}${categories.length > 1 ? `<div class="order-category-tabs"><button class="${category === '全部' ? 'on' : ''}" onclick="switchMerchantOrderCategory('全部')">全部</button>${categories.map(cat => `<button class="${category === cat ? 'on' : ''}" onclick="switchMerchantOrderCategory('${escAttr(cat).replace(/'/g,"\\'")}')">${escHtml(cat)}</button>`).join('')}</div>` : ''}<div class="order-menu-list">${visible.length ? visible.map(product => { const quantity = merchantOrderQty(product.id); return `<div class="order-menu-item"><div class="order-menu-thumb">${product.image ? `<img src="${escAttr(product.image)}" alt="">` : uiIcon('bag',28)}</div><div class="order-menu-main"><b>${escHtml(product.name || '未命名商品')}</b>${product.description ? `<p>${escHtml(product.description)}</p>` : ''}<strong>${escHtml(product.price || '到店咨询')}</strong></div><div class="order-qty"><button onclick="changeMerchantOrderQty('${escAttr(product.id)}',-1)" ${quantity ? '' : 'disabled'}>−</button>${quantity ? `<span>${quantity}</span>` : ''}<button class="add" onclick="changeMerchantOrderQty('${escAttr(product.id)}',1)">+</button></div></div>`; }).join('') : '<div class="deals-empty-panel">商家还没有可点的菜单，请向店员咨询。</div>'}</div><div class="order-bottom-bar"><div class="summary"><b>${merchantOrderMoney(total)}</b><span>${count ? `已选 ${count} 件` : '请选择菜品'}${state.activeOrderId ? ' · 将作为加菜提交' : ''}</span></div><button ${count ? '' : 'disabled'} onclick="${isTakeout && !state.activeOrderId ? 'openMerchantTakeoutCart()' : 'submitMerchantOrder()'}">${state.activeOrderId ? '确认加菜' : (isTakeout ? '加入购物车' : '提交订单')}</button></div>`;
}
async function submitMerchantOrder(){
  const state = merchantOrderState();
  const rows = merchantOrderCartRows();
  if(!state.merchant || (!state.table && state.orderMode!=='takeout') || !rows.length){ showToast('请先选择菜品'); return; }
  if(state.orderMode==='takeout' && !state.activeOrderId){ openMerchantTakeoutCart(); return; }
  const note = window.prompt('备注（可选，例如少冰、不要辣）','');
  if(note === null) return;
  try {
    const id = await restaurantOrderApi.createDineInOrder({
      merchantUserId:state.merchant.user_id,
      tableCode:state.table.table_code,
      items:rows.map(row => ({ product_id:row.id, quantity:row.quantity })),
      note:note || '',
      existingOrderId:state.activeOrderId || null
    });
    state.activeOrderId = id;
    state.cart = {};
    await loadMerchantCustomerActiveOrder();
    showToast('订单已发送给商家');
  } catch(error){
    console.warn('提交点餐失败:', error.message);
    const message=String(error.message||'');
    showToast(message.includes('merchant_order_table_occupied') ? '该桌正在用餐，请选择其他桌号' : message.includes('product_unavailable') ? '有菜品已下架，请重新选择' : '提交失败，请稍后再试');
  }
}
function openMerchantTakeoutOrder(merchantUserId){ return openMerchantTakeoutPage(merchantUserId); }
function isNativeAppRuntime(){
  try {
    return isEmbeddedAppEntry()
      || !!(window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform());
  } catch(error){ return isEmbeddedAppEntry(); }
}
function openMerchantModule(url){
  if(isNativeAppRuntime() || document.documentElement.classList.contains('app-webview-entry')){
    openMerchantEmbeddedOrder(url);
    return;
  }
  window.location.href = url;
}
function closeMerchantEmbeddedOrder(){
  const sheet=document.getElementById('merchantEmbeddedOrder');
  if(!sheet) return;
  sheet.remove();
}
function closeEmbeddedExperience(){
  closeMerchantEmbeddedOrder();
  closeInternalModule();
}
window.closeEmbeddedExperience = closeEmbeddedExperience;
function openMerchantEmbeddedOrder(url){
  closeMerchantEmbeddedOrder();
  const sheet=document.createElement('section');
  sheet.id='merchantEmbeddedOrder';
  sheet.className='merchant-fullscreen-sheet open';
  sheet.innerHTML=`<iframe src="${escAttr(url)}" title="外卖点单" style="width:100%;height:100%;border:0;background:#fff;" allow="payment"></iframe>`;
  document.body.appendChild(sheet);
}
window.addEventListener('message',event=>{
  if(event.origin !== window.location.origin) return;
  if(['leshenghuo-close-takeout','leshenghuo-close-rental','leshenghuo-close-auto','leshenghuo-module-close'].includes(event?.data?.type)){
    closeMerchantEmbeddedOrder();
    if(event.data.type === 'leshenghuo-module-close'){
      setBottomNavActive(currentTab || 'home');
    }
  }
});
async function openMerchantTakeoutPage(merchantUserId){
  try {
    const merchant=await getMerchantOrderMerchant(merchantUserId);
    if(!merchant){showToast('暂时无法读取商家资料');return;}
    const url=merchantTakeoutUrl(merchant);
    openMerchantModule(url);
  } catch(error){
    console.warn('打开独立外卖点餐页失败:',error.message);
    showToast('点餐页面暂时无法打开，请稍后再试');
  }
}
async function openMerchantQueuePage(merchantUserId){
  try {
    const merchant=await getMerchantOrderMerchant(merchantUserId);
    if(!merchant){showToast('暂时无法读取商家资料');return;}
    const url=merchantQueueUrl(merchant);
    openMerchantModule(url);
  } catch(error){
    console.warn('打开扫码排队页失败:',error.message);
    showToast('排队页面暂时无法打开，请稍后再试');
  }
}
function openMerchantTakeoutCart(){
  const state=merchantOrderState(), rows=merchantOrderCartRows();
  if(!state.merchant||!rows.length){showToast('请先选择菜品');return;}
  const sheet=document.getElementById('merchantOrderCheckout'),body=document.getElementById('merchantOrderCheckoutBody'),title=document.querySelector('#merchantOrderCheckout h3');
  if(!sheet||!body)return;
  if(title)title.textContent='购物车';
  document.getElementById('merchantOrderMenu')?.classList.remove('open');
  sheet.classList.add('open');
  const total=rows.reduce((sum,row)=>sum+merchantOrderPriceNumber(row.price)*row.quantity,0);
  body.innerHTML=`<div class="order-merchant-hero"><div class="order-merchant-title"><div class="logo">${state.merchant.logo?`<img src="${escAttr(state.merchant.logo)}" alt="">`:escHtml(initials(state.merchant.business_name||'店'))}</div><div><b>${escHtml(state.merchant.business_name||'外卖点单')}</b><span>确认已选菜品</span></div></div></div><div class="merchant-mini-section"><b>${uiIcon('bag',14)} 已选菜品</b><div class="merchant-order-lines" style="margin-top:10px;">${rows.map(row=>`<div class="merchant-order-line" style="align-items:center;gap:10px;"><span style="flex:1;">${escHtml(row.name||'未命名商品')} × ${Number(row.quantity||0)}</span><b>${merchantOrderMoney(merchantOrderPriceNumber(row.price)*row.quantity)}</b><span class="order-qty" style="margin-left:0;"><button onclick="changeMerchantOrderQty('${escAttr(row.id)}',-1);openMerchantTakeoutCart()">−</button><span>${Number(row.quantity||0)}</span><button class="add" onclick="changeMerchantOrderQty('${escAttr(row.id)}',1);openMerchantTakeoutCart()">+</button></span></div>`).join('')}</div><div class="merchant-order-line" style="margin-top:12px;padding-top:12px;border-top:1px solid var(--line);font-size:15px;"><b>菜品小计</b><b style="color:var(--berry);">${merchantOrderMoney(total)}</b></div></div><button class="primary" onclick="openMerchantTakeoutCheckoutSetup()" style="width:100%;border:0;border-radius:10px;padding:12px;background:var(--sage);color:#fff;font:900 14px inherit;">填写结算信息</button>`;
}
function showMerchantTakeoutLink(merchantUserId){
  const merchant=(currentMerchant&&String(currentMerchant.user_id)===String(merchantUserId))?currentMerchant:window._merchantIdentityCache[merchantUserId];
  if(!merchant){showToast('正在读取商家资料，请稍后再试');return;}
  const url=merchantTakeoutUrl(merchant);
  const sheet=document.getElementById('merchantTableManager'),body=document.getElementById('merchantTableManagerBody');
  if(!sheet||!body){window.prompt('外卖点单链接：',url);return;}
  sheet.classList.add('open');
  body.innerHTML=`<div class="order-notice">顾客扫描此二维码后直接进入外卖点单，无需选择餐桌。</div><div class="merchant-table-card"><div class="merchant-table-qr">${memberCardQrHtml(url)}</div><div style="min-width:0;flex:1;"><b>外卖点单二维码</b><span>支持到店自提和送餐上门</span><button onclick="copyMerchantOrderTableLink('${escAttr(url).replace(/'/g,"\\'")}')" style="margin-top:9px;">复制外卖链接</button></div></div>`;
}
function setMerchantTakeoutFulfillment(value){
  const state=merchantOrderState();state.takeout=Object.assign({},state.takeout||{},{fulfillment:value==='delivery'?'delivery':'pickup'});openMerchantTakeoutCheckoutSetup();
}
function openMerchantTakeoutCheckoutSetup(){
  const state=merchantOrderState(),sheet=document.getElementById('merchantOrderCheckout'),body=document.getElementById('merchantOrderCheckoutBody');
  if(!state.merchant||!body||!sheet)return;
  const title=document.querySelector('#merchantOrderCheckout h3'); if(title)title.textContent='订单结算';
  const takeout=state.takeout||{fulfillment:'pickup'},delivery=takeout.fulfillment==='delivery',profile=profileForUser(session&&session.user&&session.user.id)||{};
  sheet.classList.add('open');
  body.innerHTML=`<div class="order-merchant-hero"><div class="order-merchant-title"><div class="logo">${state.merchant.logo?`<img src="${escAttr(state.merchant.logo)}" alt="">`:escHtml(initials(state.merchant.business_name||'店'))}</div><div><b>${escHtml(state.merchant.business_name||'外卖点单')}</b><span>确认取餐与结算信息</span></div></div></div><div class="order-category-tabs"><button class="${!delivery?'on':''}" onclick="setMerchantTakeoutFulfillment('pickup')">到店自提</button><button class="${delivery?'on':''}" onclick="setMerchantTakeoutFulfillment('delivery')">送餐上门</button></div><div class="merchant-mini-section"><b>联系人</b><div style="display:grid;gap:10px;margin-top:10px;"><input id="merchantTakeoutName" maxlength="40" placeholder="姓名（必填）" value="${escAttr(takeout.name||profile.name||myNick()||'')}"><input id="merchantTakeoutPhone" type="tel" maxlength="32" inputmode="tel" placeholder="电话（必填）" value="${escAttr(takeout.phone||'')}"></div></div>${delivery?`<div class="merchant-mini-section"><b>配送信息</b><div style="display:grid;gap:10px;margin-top:10px;"><textarea id="merchantTakeoutAddress" maxlength="240" placeholder="配送地址（必填）">${escHtml(takeout.address||'')}</textarea><select id="merchantTakeoutTimeMode" onchange="toggleMerchantTakeoutTime()"><option value="now" ${(takeout.time_mode||'now')==='now'?'selected':''}>尽快送达</option><option value="scheduled" ${takeout.time_mode==='scheduled'?'selected':''}>指定日期和时间</option></select><input id="merchantTakeoutDeliveryAt" type="datetime-local" style="display:${takeout.time_mode==='scheduled'?'block':'none'}" value="${escAttr(takeout.delivery_at||'')}"></div></div>`:''}<div class="merchant-mini-section"><b>订单内容</b><div class="merchant-order-lines" style="margin-top:9px;">${merchantOrderBatchHtml(merchantOrderCartRows().map(row=>({product_name:row.name,quantity:row.quantity,unit_price:merchantOrderPriceNumber(row.price)})))}</div><div class="merchant-order-line" style="margin-top:10px;padding-top:10px;border-top:1px solid var(--line);"><b>菜品小计</b><b>${merchantOrderMoney(merchantOrderCartRows().reduce((sum,row)=>sum+merchantOrderPriceNumber(row.price)*row.quantity,0))}</b></div></div><button class="primary" onclick="submitMerchantTakeoutOrder()" style="width:100%;border:0;border-radius:10px;padding:12px;background:var(--sage);color:#fff;font:900 14px inherit;">${delivery?'进入在线支付':'确认并选择支付方式'}</button>`;
}
function toggleMerchantTakeoutTime(){const input=document.getElementById('merchantTakeoutDeliveryAt');if(input)input.style.display=document.getElementById('merchantTakeoutTimeMode')?.value==='scheduled'?'block':'none';}
async function submitMerchantTakeoutOrder(){
  const state=merchantOrderState(),rows=merchantOrderCartRows(),delivery=(state.takeout||{}).fulfillment==='delivery';
  const name=document.getElementById('merchantTakeoutName')?.value.trim()||'',phone=document.getElementById('merchantTakeoutPhone')?.value.trim()||'',address=document.getElementById('merchantTakeoutAddress')?.value.trim()||'',timeMode=document.getElementById('merchantTakeoutTimeMode')?.value||'now',deliveryAt=document.getElementById('merchantTakeoutDeliveryAt')?.value||'';
  if(!name||!phone){showToast('请填写姓名和电话');return;} if(delivery&&!address){showToast('请填写配送地址');return;} if(delivery&&timeMode==='scheduled'&&!deliveryAt){showToast('请选择送餐时间');return;}
  try{
    const id=await restaurantOrderApi.createTakeoutOrder({merchantUserId:state.merchant.user_id,items:rows.map(row=>({product_id:row.id,quantity:row.quantity})),customerName:name,customerPhone:phone,fulfillment:delivery?'delivery':'pickup',deliveryAddress:delivery?address:'',deliveryAt:delivery&&timeMode==='scheduled'?new Date(deliveryAt).toISOString():null});
    const detail=await loadMerchantOrderDetails(id);Object.assign(state,{activeOrderId:id,order:detail.order,items:detail.items,cart:{},takeout:{fulfillment:delivery?'delivery':'pickup',name,phone,address,time_mode:timeMode,delivery_at:deliveryAt}});await loadMerchantCouponClaims(true);state.checkout={method:delivery?'online':'cash',selectedClaims:[],tip:0,customTipAmount:null};renderMerchantOrderCheckout();showToast(delivery?'外卖订单已提交，请完成在线支付':'订单已提交，请选择支付方式');
  }catch(error){console.warn('外卖订单提交失败:',error.message);showToast('外卖订单提交失败，请稍后重试');}
}
async function openMerchantOrderManager(merchantUserId){
  const id = merchantUserId || merchantOrderManagerMerchantId();
  if(!id || !(String(id) === String(session && session.user && session.user.id) || canOperateMerchantWorkspace())){ showToast('你没有这家商店的订单管理权限'); return; }
  const sheet = document.getElementById('merchantOrderManager');
  if(!sheet) return;
  sheet.dataset.merchantUserId = id;
  sheet.classList.add('open');
  startMerchantOrderAutoRefresh('manager');
  await renderMerchantOrderManager();
}
function closeMerchantOrderManager(){ stopMerchantOrderAutoRefresh('manager'); document.getElementById('merchantOrderManager')?.classList.remove('open'); if(!(currentMerchant && session && session.user && String(currentMerchant.user_id) === String(session.user.id))) leaveMerchantMatrixWorkspace(); }
async function renderMerchantOrderManager(silent){
  const body = document.getElementById('merchantOrderManagerBody');
  const merchantUserId = document.getElementById('merchantOrderManager')?.dataset.merchantUserId || merchantOrderManagerMerchantId();
  if(!body || !merchantUserId) return;
  if(!silent) body.innerHTML = '<div class="deals-empty-panel">正在读取订单...</div>';
  try {
    const [merchant, tables, orders] = await Promise.all([
      getMerchantOrderMerchant(merchantUserId),
      loadMerchantOrderTables(merchantUserId, true),
      (async () => { const res = await authedFetch(`${SUPABASE_URL}/rest/v1/merchant_orders?merchant_user_id=eq.${encodeURIComponent(merchantUserId)}&select=*&order=updated_at.desc&limit=100`, {method:'GET'}); if(!res.ok) throw new Error(await res.text()); return await res.json(); })()
    ]);
    const ids = orders.map(row => row.id).filter(Boolean);
    let items = [];
    if(ids.length){ const res = await authedFetch(`${SUPABASE_URL}/rest/v1/merchant_order_items?order_id=in.(${ids.map(encodeURIComponent).join(',')})&select=*&order=batch_no.asc,created_at.asc`, {method:'GET'}); if(res.ok) items = await res.json(); }
    Object.assign(merchantOrderState(), { merchant, tables, orders, items });
    const status = merchantOrderState().managerStatus || 'active';
    const list = orders.filter(row => status === 'active' ? !['completed','cancelled'].includes(row.status) : row.status === status);
    const tabs = [['active','处理中'],['pending','待确认'],['preparing','制作中'],['served','已上桌'],['completed','已完成']];
    body.innerHTML = `<div class="merchant-order-top-actions"><button class="primary" onclick="openMerchantTableManager()">${uiIcon('store',17)} 餐桌二维码</button><button onclick="openMerchantOrderCheckoutSettings()">${uiIcon('settings',17)} 结算设置</button><button onclick="renderMerchantOrderManager()">${uiIcon('refresh',17)} 刷新订单</button></div><div class="order-notice">${escHtml(merchant && merchant.business_name || '商家')} · 此页打开时每 3 分钟自动刷新，新加的菜会单独标识。</div><div class="merchant-order-status-tabs">${tabs.map(row => `<button class="${status === row[0] ? 'on' : ''}" onclick="merchantOrderManagerStatus('${row[0]}')">${row[1]} ${row[0] === 'active' ? `(${orders.filter(order => !['completed','cancelled'].includes(order.status)).length})` : ''}</button>`).join('')}</div>${list.length ? list.map(order => merchantOrderCardHtml(order, items.filter(item => String(item.order_id) === String(order.id)))).join('') : '<div class="deals-empty-panel">这里暂时没有订单。</div>'}`;
  } catch(error){
    console.warn('订单管理读取失败:', error.message);
    if(!silent) body.innerHTML = '<div class="deals-empty-panel">订单读取失败，请确认已运行点餐 SQL。</div>';
  }
}
/* Removed overridden merchantOrderCardHtml implementation during v5.510 cleanup. */

async function setMerchantOrderItemServed(itemId, isServed){
  try {
    const res = await authedFetch(`${SUPABASE_URL}/rest/v1/rpc/merchant_order_set_item_served`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ p_item_id:Number(itemId), p_is_served:!!isServed }) });
    if(!res.ok) throw new Error(await res.text());
    showToast(isServed ? '已标记上桌' : '已撤回上桌状态');
    renderMerchantOrderManager(true);
  } catch(error){ console.warn('更新上桌状态失败:', error.message); showToast('更新失败，请确认订单已确认接单'); }
}
function merchantOrderTableCardHtml(merchant, table){
  const url = merchantOrderUrl(merchant, table.table_code);
  return `<div class="merchant-table-card" style="opacity:${table.is_active ? 1 : .58};"><div class="merchant-table-qr">${memberCardQrHtml(url)}</div><div style="min-width:0;flex:1;"><b>${escHtml(table.table_name)}</b><span>${table.is_active ? '顾客可以扫码点餐' : '已暂停使用'}</span></div><div style="display:grid;gap:5px;"><button onclick="copyMerchantOrderTableLink('${escAttr(url).replace(/'/g,"\\'")}')">复制链接</button><button onclick="toggleMerchantOrderTable(${Number(table.id)},${table.is_active ? 'false' : 'true'})">${table.is_active ? '暂停' : '启用'}</button><button style="color:var(--berry);" onclick="deleteMerchantOrderTable(${Number(table.id)},'${escAttr(table.table_name).replace(/'/g,"\\'")}')">删除</button></div></div>`;
}
async function deleteMerchantOrderTable(id, name){
  if(!confirm(`确定删除「${name || '这张餐桌'}」吗？未产生订单的餐桌会被永久删除。`)) return;
  try {
    const res = await authedFetch(`${SUPABASE_URL}/rest/v1/merchant_order_tables?id=eq.${Number(id)}`, { method:'DELETE' });
    if(!res.ok) throw new Error(await res.text());
    showToast('餐桌已删除');
    renderMerchantTableManager();
  } catch(error){
    console.warn('删除餐桌失败:', error.message);
    showToast('这张餐桌已有订单记录，不能删除；可先暂停使用。');
  }
}
function merchantOrderCheckoutSettings(merchant){
  const raw = merchant && merchant.order_checkout_settings && typeof merchant.order_checkout_settings === 'object' ? merchant.order_checkout_settings : {};
  const tips = Array.isArray(raw.tip_options) ? raw.tip_options.map(Number).filter(value => value >= 0 && value <= 100).slice(0, 5) : [15,18,20];
  return { coupon_mode:raw.coupon_mode === 'multiple' ? 'multiple' : 'single', tip_options:tips.length ? tips : [15,18,20] };
}
function closeMerchantOrderCheckoutSettings(){ document.getElementById('merchantOrderCheckoutSettings')?.classList.remove('open'); }
function openMerchantOrderCheckoutSettings(){
  const merchant = merchantOrderState().merchant || currentMerchant;
  if(!merchant || !merchantWorkspaceHasPermission('order_manage')){ showToast('你没有结算设置权限'); return; }
  const sheet = document.getElementById('merchantOrderCheckoutSettings');
  const body = document.getElementById('merchantOrderCheckoutSettingsBody');
  if(!sheet || !body) return;
  const settings = merchantOrderCheckoutSettings(merchant);
  sheet.classList.add('open');
  body.innerHTML = `<div class="order-notice">这些设置只影响扫码点餐的结算界面；在线支付暂未接入真实扣款。</div><div class="merchant-form-field"><label>优惠券使用规则</label><label style="display:flex;align-items:center;gap:8px;margin:10px 0;"><input type="radio" name="merchantCouponMode" value="single" ${settings.coupon_mode === 'single' ? 'checked' : ''}>每单仅可使用一张优惠券</label><label style="display:flex;align-items:center;gap:8px;"><input type="radio" name="merchantCouponMode" value="multiple" ${settings.coupon_mode === 'multiple' ? 'checked' : ''}>允许同一订单选择多张优惠券</label></div><div class="merchant-form-field"><label>默认小费选项（百分比）</label><input id="merchantOrderTipOptions" type="text" value="${escAttr(settings.tip_options.join(','))}" inputmode="text" autocapitalize="off" spellcheck="false" placeholder="例如：15,18,20"><p style="font-size:11px;color:var(--ink-faint);margin-top:7px;">用英文逗号分隔，最多 5 个，范围 0-100。</p></div><button class="primary" onclick="saveMerchantOrderCheckoutSettings()" style="width:100%;border:0;border-radius:10px;padding:12px;background:var(--sage);color:#fff;font:900 14px inherit;">保存设置</button>`;
}
async function saveMerchantOrderCheckoutSettings(){
  const merchant = merchantOrderState().merchant || currentMerchant;
  const mode = document.querySelector('input[name="merchantCouponMode"]:checked')?.value === 'multiple' ? 'multiple' : 'single';
  const tips = String(document.getElementById('merchantOrderTipOptions')?.value || '').split(',').map(value => Number(value.trim())).filter(value => Number.isFinite(value) && value >= 0 && value <= 100).slice(0,5);
  try {
    if(!merchantPublicApi) throw new Error('商家资料接口未初始化');
    const rows = await merchantPublicApi.patch({ userId:merchant.user_id, returnRepresentation:true, payload:{ order_checkout_settings:{coupon_mode:mode,tip_options:tips.length ? tips : [15,18,20]}, updated_at:new Date().toISOString() } });
    const row = rows[0];
    if(row){ Object.assign(merchant,row); if(currentMerchant && String(currentMerchant.user_id) === String(row.user_id)) Object.assign(currentMerchant,row); }
    closeMerchantOrderCheckoutSettings();
    showToast('结算设置已保存');
  } catch(error){ console.warn('保存结算设置失败:', error.message); showToast('保存失败，请稍后再试'); }
}
function closeMerchantOrderCheckout(){ document.getElementById('merchantOrderCheckout')?.classList.remove('open'); }
async function openMerchantOrderCheckout(){
  const state = merchantOrderState();
  if(!state.order || !(state.items || []).length || !(state.items || []).every(item => item.is_served === true)){ showToast('请等待商家将全部菜品标记上桌'); return; }
  await loadMerchantCouponClaims(true);
  state.checkout = { method:'cash', selectedClaims:[], tip:0 };
  document.getElementById('merchantOrderCheckout')?.classList.add('open');
  renderMerchantOrderCheckout();
}
function setMerchantOrderCheckoutMethod(method){
  const state = merchantOrderState();
  state.checkout.method = method;
  const eligibleIds = new Set(merchantOrderCheckoutClaims(state).filter(row => row.eligibility.eligible).map(row => Number(row.claim.id)));
  state.checkout.selectedClaims = (state.checkout.selectedClaims || []).filter(id => eligibleIds.has(Number(id)));
  renderMerchantOrderCheckout();
}
/* Removed overridden setMerchantOrderTip implementation during v5.510 cleanup. */

/* Removed overridden selectMerchantOrderCheckoutCoupon implementation during v5.510 cleanup. */

/* Removed overridden renderMerchantOrderCheckout implementation during v5.510 cleanup. */

function merchantCouponsHtml(m, isOwnerPage){
  if(!isOwnerPage && session && session.user && !window._merchantCouponClaims.loaded){
    loadMerchantCouponClaims().then(() => rerenderMerchantSection(m));
  }
  const allCoupons = merchantCoupons(m);
  const coupons = isOwnerPage ? allCoupons : allCoupons.filter(c => merchantCouponAvailable(c));
  const userId = String(m.user_id || '').replace(/'/g, '');
  return `
    ${isOwnerPage ? merchantOwnerButton('+ 添加优惠券', `openMerchantCouponEditor('${userId}')`) : ''}
    ${coupons.length ? coupons.map(c => {
      const originalIndex = allCoupons.findIndex(x => x === c);
      return merchantCouponCardHtml(m, c, originalIndex, isOwnerPage);
    }).join('') : '<div class="deals-empty-panel">目前还没有可领取的优惠券。</div>'}
  `;
}
window._merchantCouponClaims = window._merchantCouponClaims || { rows:[], loaded:false };
function merchantCouponId(c, i){ return (c && c.id) || `legacy-${i}`; }
function couponClaimPublicCode(claim){ return `LSHC-${String(claim && claim.id || 0).padStart(6, '0')}`; }
function couponClaimFor(m, c, i){
  const couponId = merchantCouponId(c, i);
  return (window._merchantCouponClaims.rows || []).find(row => String(row.merchant_user_id) === String(m && m.user_id) && String(row.coupon_id) === String(couponId));
}
async function loadMerchantCouponClaims(force){
  if(!(session && session.user)) return [];
  if(window._merchantCouponClaims.loaded && !force) return window._merchantCouponClaims.rows;
  try {
    if(!merchantCouponApi) throw new Error('优惠券接口未初始化');
    const rows = await merchantCouponApi.listClaims({ userId:session.user.id });
    window._merchantCouponClaims = { rows, loaded:true };
    return rows;
  } catch(e){ console.warn('优惠券读取失败:', e.message); window._merchantCouponClaims = { rows:[], loaded:true }; return []; }
}
function merchantCouponExpired(c){
  if(!c || !c.expires_at) return false;
  const t = new Date(`${c.expires_at}T23:59:59`).getTime();
  return Number.isFinite(t) && t < Date.now();
}
/* Removed overridden merchantCouponAvailable implementation during v5.510 cleanup. */

/* Removed overridden merchantCouponCardHtml implementation during v5.510 cleanup. */

async function claimMerchantCoupon(userId, index){
  if(!(session && session.user)){ showToast('请先登录后领取优惠券'); openAuth(); return; }
  const m = (currentMerchant && currentMerchant.user_id === userId) ? currentMerchant : window._merchantIdentityCache[userId];
  const c = merchantCoupons(m)[index];
  if(!merchantCouponAvailable(c)){ showToast('这张优惠券暂不可用'); return; }
  const couponId = merchantCouponId(c, index);
  try {
    const res = await authedFetch(`${SUPABASE_URL}/rest/v1/merchant_coupon_claims`, {
      method:'POST', headers:{ 'Content-Type':'application/json', 'Prefer':'return=representation' },
      body:JSON.stringify({ merchant_user_id:userId, user_id:session.user.id, coupon_id:couponId, coupon_snapshot:{ title:c.title || '优惠券', badge:c.badge || '优惠', description:c.description || '', image:c.image || '', expires_at:c.expires_at || '', pricing_rule:c.pricing_rule || null } })
    });
    if(!res.ok && res.status !== 409) throw new Error(await res.text());
    await loadMerchantCouponClaims(true);
    showToast(res.status === 409 ? '这张优惠券已经领取' : '已领取，到店出示二维码即可');
    rerenderMerchantSection(m);
  } catch(e){ console.warn('领取优惠券失败:', e.message); showToast('领取失败，请稍后重试'); }
}
function closeMerchantCouponWallet(){ document.getElementById('merchantCouponWallet')?.classList.remove('open'); }
/* Removed overridden closeMerchantCouponRedeem implementation during v5.510 cleanup. */

async function openMerchantCouponRedeemByCode(code){
  if(!canOperateMerchantWorkspace() || !activeMerchantWorkspaceId()){ showToast('请先进入商家工作台'); return; }
  const idText = String(code || '').toUpperCase().replace(/^LSHC-?/,'').replace(/\D/g,'');
  const id = Number(idText);
  if(!id){ showToast('优惠券二维码无效'); return; }
  const sheet = document.getElementById('merchantCouponRedeem');
  const body = document.getElementById('merchantCouponRedeemBody');
  if(!sheet || !body) return;
  sheet.classList.add('open');
  body.innerHTML = '<div class="deals-empty-panel">正在核对优惠券...</div>';
  try {
    const res = await authedFetch(`${SUPABASE_URL}/rest/v1/merchant_coupon_claims?id=eq.${id}&merchant_user_id=eq.${encodeURIComponent(activeMerchantWorkspaceId())}&select=*&limit=1`, { method:'GET' });
    if(!res.ok) throw new Error(await res.text());
    const rows = await res.json();
    const claim = rows && rows[0];
    if(!claim){ body.innerHTML = '<div class="deals-empty-panel">没有找到本店的这张优惠券。</div>'; return; }
    await loadProfilesForIds([claim.user_id]);
    const profile = cachedProfile(claim.user_id);
    const snapshot = claim.coupon_snapshot || {};
    const redeemed = claim.status === 'redeemed';
    body.innerHTML = `<div class="merchant-dash-card" style="box-shadow:none;"><div style="display:flex;align-items:center;gap:12px;"><div class="merchant-member-avatar" onclick="openUserPublicPage('${String(claim.user_id).replace(/'/g,'')}','${String(profile.name || '乐生活用户').replace(/'/g,'')}')" style="cursor:pointer;">${profile.avatar ? `<img src="${escAttr(profile.avatar)}" alt="">` : escHtml(initials(profile.name || '用'))}</div><div><b style="display:block;font-size:16px;">${escHtml(snapshot.title || '优惠券')}</b><span style="font-size:12px;color:var(--ink-faint);">${escHtml(profile.name || '乐生活用户')} · ${redeemed ? '已核销' : '待核销'}</span></div></div>${snapshot.image ? `<div class="merchant-coupon-image" style="margin-top:14px;"><img src="${escAttr(snapshot.image)}" alt=""></div>` : ''}<p style="font-size:13px;line-height:1.65;color:var(--ink-soft);">${escHtml(snapshot.description || '')}</p></div>${redeemed ? '<div class="deals-empty-panel">这张优惠券已经核销，不能重复使用。</div>' : `<button class="merchant-reward-redeem-btn" onclick="confirmMerchantCouponRedeem(${Number(claim.id)})">确认核销优惠券</button>`}`;
  } catch(e){ console.warn('优惠券核对失败:', e.message); body.innerHTML = '<div class="deals-empty-panel">优惠券暂时无法核对，请稍后重试。</div>'; }
}
async function confirmMerchantCouponRedeem(id){
  try {
    const res = await authedFetch(`${SUPABASE_URL}/rest/v1/rpc/redeem_merchant_coupon_claim`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ p_claim_id:Number(id) }) });
    if(!res.ok) throw new Error(await res.text());
    const claim = await res.json();
    if(claim && claim.user_id){
      const snapshot = claim.coupon_snapshot || {};
      await createMemberActivityNotification({
        userId:claim.user_id,
        couponClaimId:claim.id,
        kind:'coupon',
        title:'优惠券已核销',
        body:`${merchantOperatorWorkspace() && merchantOperatorWorkspace().business_name || '商家'} 已核销你的「${snapshot.title || '优惠券'}」。`
      });
    }
    showToast('✓ 优惠券已核销');
    closeMerchantCouponRedeem();
  } catch(e){ console.warn('优惠券核销失败:', e.message); showToast('核销失败：该券可能已使用或已失效'); }
}
async function openMerchantCouponWallet(focusClaimId){
  if(!(session && session.user)){ openAuth(); return; }
  const sheet = document.getElementById('merchantCouponWallet');
  const body = document.getElementById('merchantCouponWalletBody');
  if(!sheet || !body) return;
  sheet.classList.add('open');
  body.innerHTML = '<div class="deals-empty-panel">正在读取已领取优惠券...</div>';
  const rows = await loadMerchantCouponClaims(true);
  const merchantIds = [...new Set(rows.map(row => row.merchant_user_id).filter(Boolean))];
  if(merchantIds.length){
    const res = await authedFetch(`${SUPABASE_URL}/rest/v1/merchants?user_id=in.(${merchantIds.map(encodeURIComponent).join(',')})&select=user_id,business_name,logo`, { method:'GET' });
    if(res.ok) (await res.json()).forEach(row => setMerchantIdentityCache(row.user_id, row));
  }
  const visibleRows = focusClaimId ? rows.filter(claim => Number(claim.id) === Number(focusClaimId)) : rows;
  body.innerHTML = visibleRows.length ? visibleRows.map(claim => {
    const merchant = window._merchantIdentityCache[claim.merchant_user_id] || {};
    const snapshot = claim.coupon_snapshot || {};
    const redeemed = claim.status === 'redeemed';
    return `<div class="merchant-coupon-card" style="margin-bottom:14px;">${snapshot.image ? `<div class="merchant-coupon-image"><img src="${escAttr(snapshot.image)}" alt=""></div>` : ''}<div class="merchant-coupon-title">${escHtml(snapshot.title || '优惠券')}<span>${redeemed ? '已核销' : escHtml(snapshot.badge || '已领取')}</span></div><div class="merchant-coupon-note">${escHtml(merchant.business_name || '乐生活商家')} · ${escHtml(snapshot.description || '到店出示使用')}</div>${!redeemed ? `<div class="member-present-code" style="margin-top:12px;"><div class="member-present-qr">${memberCardQrHtml(couponClaimPublicCode(claim))}</div><b>${escHtml(couponClaimPublicCode(claim))}</b><span>到店出示二维码给商家扫描核销</span></div>` : `<div class="merchant-coupon-note" style="color:var(--ink-faint);">已于 ${claim.redeemed_at ? escHtml(new Date(claim.redeemed_at).toLocaleString('zh-CN')) : ''} 核销</div>`}</div>`;
  }).join('') : '<div class="deals-empty-panel">还没有领取优惠券。</div>';
}
function openMerchantCouponEditor(userId, index){
  if(!(session && session.user) || !currentMerchant || currentMerchant.user_id !== userId){ showToast('只有商家本人可以编辑'); return; }
  const coupons = merchantCoupons(currentMerchant);
  const editing = Number.isInteger(index) && index >= 0 && index < coupons.length;
  const item = editing ? coupons[index] : {};
  const savedPricingRule=item.pricing_rule || {};
  const savedPricingType=String(savedPricingRule.type || 'fixed');
  const savedPricingScope=savedPricingType.startsWith('whole_') ? 'whole' : 'threshold';
  const savedPricingBenefit=savedPricingType.includes('percent') ? 'percent' : savedPricingType === 'gift' ? 'gift' : 'fixed';
  window._merchantItemEditor = { type:'coupon', index: editing ? index : null, image:item.image || '' };
  const title = document.getElementById('merchantItemEditorTitle');
  if(title) title.textContent = editing ? '编辑优惠券' : '添加优惠券';
  const body = document.getElementById('merchantProductEditorBody');
  body.innerHTML = `
    <div class="merchant-form-field">
      <label>优惠券图片</label>
      <div class="merchant-image-pick" id="merchantProductImagePreview" onclick="document.getElementById('merchantProductImageInput').click()">
        ${item.image ? `<img src="${escAttr(item.image)}" alt="">` : `<div>${uiIcon('image',32)}<div style="margin-top:8px;">上传并裁切 1:1 图片</div></div>`}
      </div>
      <input type="file" id="merchantProductImageInput" accept="image/*" style="display:none;" onchange="onMerchantItemImageSelected(event)">
    </div>
    <div class="merchant-form-field">
      <label>优惠券标题</label>
      <input id="merchantCouponTitle" type="text" placeholder="例如：买二送一" value="${escAttr(item.title || '')}">
    </div>
    <div class="merchant-form-field">
      <label>角标</label>
      <input id="merchantCouponBadge" type="text" placeholder="限时 / 新客 / 9折" value="${escAttr(item.badge || '优惠')}">
    </div>
    <div class="merchant-form-field">
      <label>使用说明</label>
      <textarea id="merchantCouponDesc" placeholder="例如：限堂食饮品，到店出示使用。">${escHtml(item.description || '')}</textarea>
    </div>
    <div class="merchant-form-field">
      <label>优惠计算规则</label>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:9px;">
        <label style="font-size:12px;color:var(--ink-soft);">1. 优惠范围<select id="merchantCouponRuleScope" onchange="toggleMerchantCouponPricingRule()"><option value="threshold" ${savedPricingScope === 'threshold' ? 'selected' : ''}>订单满额后优惠</option><option value="whole" ${savedPricingScope === 'whole' ? 'selected' : ''}>整单直接优惠</option></select></label>
        <label style="font-size:12px;color:var(--ink-soft);">2. 优惠方式<select id="merchantCouponRuleBenefit" onchange="toggleMerchantCouponPricingRule()"><option value="fixed" ${savedPricingBenefit === 'fixed' ? 'selected' : ''}>减固定金额</option><option value="percent" ${savedPricingBenefit === 'percent' ? 'selected' : ''}>按百分比优惠</option><option value="gift" ${savedPricingBenefit === 'gift' ? 'selected' : ''}>赠送指定商品</option></select></label>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:9px;">
        <label id="merchantCouponMinSpendWrap" style="font-size:12px;color:var(--ink-soft);">订单满额<input id="merchantCouponMinSpend" type="number" min="0" step="0.01" inputmode="decimal" value="${escAttr(String(item.pricing_rule?.min_spend ?? ''))}" placeholder="例如 100"></label>
        <label id="merchantCouponRuleValueLabel" style="font-size:12px;color:var(--ink-soft);">优惠金额<input id="merchantCouponRuleValue" type="number" min="0" step="0.01" inputmode="decimal" value="${escAttr(String(item.pricing_rule?.value ?? ''))}" placeholder="例如 5"></label>
      </div>
      <label id="merchantCouponRepeatWrap" style="display:${item.pricing_rule?.type === 'tiered_fixed' ? 'flex' : 'none'};align-items:center;gap:7px;margin-top:10px;font-size:12px;"><input id="merchantCouponRepeat" type="checkbox" ${item.pricing_rule?.repeat ? 'checked' : ''}>单笔订单每满一次都可重复优惠（例如满 100 减 5，满 305 减 15）</label>
      <div id="merchantCouponGiftWrap" style="display:${item.pricing_rule?.type === 'gift' ? 'grid' : 'none'};grid-template-columns:1fr 110px;gap:9px;margin-top:10px;">
        <label style="font-size:12px;color:var(--ink-soft);">赠送商品<select id="merchantCouponGiftProduct"><option value="">请选择商品</option>${merchantOrderProducts(currentMerchant).map(product => `<option value="${escAttr(String(product.id || ''))}" ${String(item.pricing_rule?.gift_product_id || '') === String(product.id || '') ? 'selected' : ''}>${escHtml(product.name || '未命名商品')} · ${merchantOrderMoney(product.price || 0)}</option>`).join('')}</select></label>
        <label style="font-size:12px;color:var(--ink-soft);">赠送数量<input id="merchantCouponGiftQuantity" type="number" min="1" step="1" inputmode="numeric" value="${escAttr(String(item.pricing_rule?.gift_quantity || 1))}"></label>
      </div>
      <p id="merchantCouponRuleHint" style="font-size:11px;color:var(--ink-faint);margin:8px 0 0;"></p>
    </div>
    <div class="merchant-form-field">
      <label>有效期（可选）</label>
      <input id="merchantCouponExpires" type="text" placeholder="例如：2026-08-31" value="${escAttr(item.expires_at || '')}">
    </div>
    <div class="merchant-form-field">
      <label>适用星期（不选则每天可用）</label>
      <div style="display:grid;grid-template-columns:repeat(4,max-content);gap:8px 12px;align-items:center;">${[['1','周一'],['2','周二'],['3','周三'],['4','周四'],['5','周五'],['6','周六'],['0','周日']].map(([value,label]) => `<label style="display:flex;align-items:center;gap:4px;font-size:12px;white-space:nowrap;"><input class="merchantCouponWeekday" type="checkbox" value="${value}" ${(Array.isArray(item.weekdays) && item.weekdays.map(String).includes(value)) ? 'checked' : ''}>${label}</label>`).join('')}</div>
    </div>
    <div class="merchant-form-field">
      <label>每日适用时段（可选，洛杉矶时间）</label>
      <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;"><input id="merchantCouponTimeStart" type="time" value="${escAttr(item.time_start || '')}"><span style="font-size:12px;color:var(--ink-faint);">至</span><input id="merchantCouponTimeEnd" type="time" value="${escAttr(item.time_end || '')}"></div>
    </div>
    <div class="merchant-form-field">
      <label>适用支付方式（不选则全部可用）</label>
      <div style="display:flex;gap:12px;flex-wrap:wrap;">${[['cash','现金'],['card','刷卡 / 在线支付']].map(([value,label]) => `<label style="display:flex;align-items:center;gap:4px;font-size:12px;white-space:nowrap;"><input class="merchantCouponPaymentMethod" type="checkbox" value="${value}" ${(Array.isArray(item.payment_methods) && item.payment_methods.map(String).includes(value)) ? 'checked' : ''}>${label}</label>`).join('')}</div>
    </div>
    <div class="merchant-form-field">
      <label>每位用户领取频率</label>
      <select id="merchantCouponClaimMode" onchange="toggleMerchantCouponClaimInterval()">
        ${[['once','仅可领取一次'],['after_redeem','核销后可再次领取'],['unlimited','不限次数'],['daily','每天可领取一次'],['weekly','每周可领取一次'],['monthly','每月可领取一次'],['interval','每 N 天可领取一次']].map(([value,label]) => `<option value="${value}" ${(item.claim_mode || 'once') === value ? 'selected' : ''}>${label}</option>`).join('')}
      </select>
      <div id="merchantCouponClaimIntervalWrap" style="display:${(item.claim_mode || 'once') === 'interval' ? 'block' : 'none'};margin-top:9px;"><input id="merchantCouponClaimIntervalDays" type="number" min="1" max="365" inputmode="numeric" value="${escAttr(String(item.claim_interval_days || 7))}" placeholder="例如：7"><p style="font-size:11px;color:var(--ink-faint);margin:6px 0 0;">填写 1-365，例如每 14 天可领取一次。</p></div>
    </div>
    <div class="merchant-form-actions">
      <button onclick="closeMerchantProductEditor()">取消</button>
      <button class="primary" onclick="saveMerchantCouponFromEditor()">${editing ? '保存修改' : '保存优惠券'}</button>
    </div>
  `;
  toggleMerchantCouponPricingRule();
  document.getElementById('merchantProductEditor')?.classList.add('open');
}
function toggleMerchantCouponPricingRule(){
  const scope=document.getElementById('merchantCouponRuleScope')?.value||'threshold';
  const benefit=document.getElementById('merchantCouponRuleBenefit')?.value||'fixed';
  const type=scope==='whole'?(benefit==='percent'?'whole_percent':'whole_fixed'):(benefit==='percent'?'percent':benefit==='gift'?'gift':'fixed');
  const label=document.getElementById('merchantCouponRuleValueLabel');
  const minimum=document.getElementById('merchantCouponMinSpendWrap');
  const value=document.getElementById('merchantCouponRuleValue');
  const repeat=document.getElementById('merchantCouponRepeatWrap');
  const gift=document.getElementById('merchantCouponGiftWrap');
  const hint=document.getElementById('merchantCouponRuleHint');
  if(label) label.innerHTML=type==='percent'?'优惠比例（%）<input id="merchantCouponRuleValue" type="number" min="0.01" max="100" step="0.01" inputmode="decimal" value="'+escAttr(String(value?.value||''))+'" placeholder="例如 15">':type==='gift'?'赠品优惠由商品价格自动计算<input id="merchantCouponRuleValue" type="hidden" value="0">':'优惠金额（美元）<input id="merchantCouponRuleValue" type="number" min="0" step="0.01" inputmode="decimal" value="'+escAttr(String(value?.value||''))+'" placeholder="例如 5">';
  if(scope==='whole'&&benefit==='gift'){document.getElementById('merchantCouponRuleBenefit').value='fixed';return toggleMerchantCouponPricingRule();}
  if(minimum) minimum.style.display=scope==='whole'?'none':'block';
  if(repeat) repeat.style.display=scope==='threshold'&&benefit==='fixed'?'flex':'none';
  if(gift) gift.style.display=type==='gift'?'grid':'none';
  if(hint) hint.textContent=scope==='whole'&&benefit==='percent'?'不设消费门槛，整张订单按填写比例优惠；可搭配“仅限现金”支付方式。':scope==='whole'?'不设消费门槛，整张订单直接立减固定金额。':benefit==='percent'?'达到订单满额后，按订单金额计算优惠。':benefit==='gift'?'顾客须将赠品加入订单；达到门槛后，系统自动扣除赠品金额。':'达到订单满额后，每单仅减一次；可勾选每满一次重复优惠。';
}
async function saveMerchantCouponFromEditor(){
  if(!(session && session.user) || !currentMerchant){ showToast('请先登录商家账号'); return; }
  const title = document.getElementById('merchantCouponTitle')?.value.trim();
  if(!title){ showToast('请填写优惠券标题'); return; }
  const coupons = merchantCoupons(currentMerchant).slice();
  const state = window._merchantItemEditor || {};
  const previousImage = state.index != null && coupons[state.index] ? coupons[state.index].image || '' : '';
  const pricingScope=document.getElementById('merchantCouponRuleScope')?.value||'threshold';
  const pricingBenefit=document.getElementById('merchantCouponRuleBenefit')?.value||'fixed';
  const basePricingType=pricingScope==='whole'?(pricingBenefit==='percent'?'whole_percent':'whole_fixed'):(pricingBenefit==='percent'?'percent':pricingBenefit==='gift'?'gift':'fixed');
  const minSpend=Math.max(0,Number(document.getElementById('merchantCouponMinSpend')?.value||0));
  const ruleValue=Math.max(0,Number(document.getElementById('merchantCouponRuleValue')?.value||0));
  const giftProductId=String(document.getElementById('merchantCouponGiftProduct')?.value||'');
  const giftQuantity=Math.max(1,Math.floor(Number(document.getElementById('merchantCouponGiftQuantity')?.value||1)));
  if(pricingScope==='threshold' && minSpend<=0){ showToast('请填写订单满额'); return; }
  if(basePricingType==='gift'&&!giftProductId){ showToast('请选择要赠送的商品'); return; }
  if(basePricingType!=='gift'&&ruleValue<=0){ showToast(basePricingType.includes('percent')?'请填写优惠比例':'请填写优惠金额'); return; }
  if(basePricingType.includes('percent')&&ruleValue>100){ showToast('优惠比例不能超过 100%'); return; }
  const repeatEnabled=pricingScope==='threshold'&&pricingBenefit==='fixed'&&!!document.getElementById('merchantCouponRepeat')?.checked;
  const pricingType=repeatEnabled?'tiered_fixed':basePricingType;
  let image = state.image || '';
  try {
    if(isDataImageUrl(image)){
      showToast('正在压缩并上传优惠券图片…');
      image = await uploadMediaDataUrl(image, 'coupons');
      state.image = image;
    }
  } catch(error){ showToast(error.message || '优惠券图片上传失败，请重试'); return; }
  const row = {
    id: state.index != null && coupons[state.index] ? (coupons[state.index].id || `c_${Date.now()}`) : `c_${Date.now()}`,
    title,
    description: document.getElementById('merchantCouponDesc')?.value.trim() || '',
    badge: document.getElementById('merchantCouponBadge')?.value.trim() || '优惠',
    expires_at: document.getElementById('merchantCouponExpires')?.value.trim() || '',
    weekdays: [...document.querySelectorAll('.merchantCouponWeekday:checked')].map(input => String(input.value)),
    time_start: document.getElementById('merchantCouponTimeStart')?.value || '',
    time_end: document.getElementById('merchantCouponTimeEnd')?.value || '',
    payment_methods: [...document.querySelectorAll('.merchantCouponPaymentMethod:checked')].map(input => String(input.value)),
    claim_mode: document.getElementById('merchantCouponClaimMode')?.value || 'once',
    claim_interval_days: Math.min(365, Math.max(1, Number(document.getElementById('merchantCouponClaimIntervalDays')?.value || 7))),
    pricing_rule: { type:pricingType, min_spend:minSpend, value:ruleValue, repeat:repeatEnabled, gift_product_id:giftProductId, gift_quantity:giftQuantity },
    image,
    active: state.index != null && coupons[state.index] ? coupons[state.index].active !== false : true
  };
  if(state.index != null && coupons[state.index]) coupons[state.index] = row;
  else coupons.unshift(row);
  const ok = await saveMerchantListField('coupons', coupons);
  if(ok){
    closeMerchantProductEditor();
    if(previousImage && previousImage !== image) releaseMediaUrl(previousImage);
  }
}
async function deleteMerchantCoupon(index){
  if(!(session && session.user) || !currentMerchant){ showToast('请先登录商家账号'); return; }
  const coupons = merchantCoupons(currentMerchant).slice();
  if(!coupons[index]) return;
  if(!confirm(`确定删除「${coupons[index].title || '这张优惠券'}」吗？`)) return;
  const removedImage = coupons[index].image || '';
  coupons.splice(index, 1);
  if(await saveMerchantListField('coupons', coupons)) releaseMediaUrl(removedImage);
}
async function toggleMerchantCouponActive(index){
  if(!(session && session.user) || !currentMerchant){ showToast('请先登录商家账号'); return; }
  const coupons = merchantCoupons(currentMerchant).slice();
  if(!coupons[index]) return;
  coupons[index] = Object.assign({}, coupons[index], { active: coupons[index].active === false });
  await saveMerchantListField('coupons', coupons);
}

/* ---------- 5.249：优惠券规则、小费与顾客下拉刷新 ---------- */
function merchantCouponLaClock(){
  const parts = new Intl.DateTimeFormat('en-US', { timeZone:'America/Los_Angeles', weekday:'short', hour:'2-digit', minute:'2-digit', hourCycle:'h23' }).formatToParts(new Date());
  const get = type => parts.find(part => part.type === type)?.value || '';
  const weekdays = { Sun:'0', Mon:'1', Tue:'2', Wed:'3', Thu:'4', Fri:'5', Sat:'6' };
  return { weekday:weekdays[get('weekday')] || '', time:`${get('hour')}:${get('minute')}` };
}
/* Removed overridden merchantCouponEligibility implementation during v5.510 cleanup. */

/* Removed overridden merchantCouponAvailable implementation during v5.510 cleanup. */

function merchantCouponForClaim(merchant, claim){
  const coupons = merchantCoupons(merchant);
  return coupons.find((coupon, index) => String(merchantCouponId(coupon, index)) === String(claim && claim.coupon_id)) || null;
}
function merchantCouponRuleText(coupon){
  const weekdays = Array.isArray(coupon && coupon.weekdays) ? coupon.weekdays.map(String) : [];
  const labels = { '1':'周一','2':'周二','3':'周三','4':'周四','5':'周五','6':'周六','0':'周日' };
  const dayText = weekdays.length ? weekdays.map(day => labels[day] || '').filter(Boolean).join('、') : '每天';
  const timeText = coupon && (coupon.time_start || coupon.time_end) ? ` · ${coupon.time_start || '00:00'}-${coupon.time_end || '24:00'}` : '';
  const paymentMethods = Array.isArray(coupon && coupon.payment_methods) ? coupon.payment_methods.map(String) : [];
  const paymentLabels = { cash:'现金', card:'刷卡 / 在线支付' };
  const paymentText = paymentMethods.length ? ` · ${paymentMethods.map(method => paymentLabels[method] || method).join('、')}` : '';
  return `${dayText}${timeText}${paymentText}`;
}
/* Removed overridden merchantCouponDiscountAmount implementation during v5.510 cleanup. */

/* Removed overridden merchantCouponCardHtml implementation during v5.510 cleanup. */

async function claimMerchantCoupon(userId, index){
  if(!(session && session.user)){ showToast('请先登录后领取优惠券'); openAuth(); return; }
  const merchant = (currentMerchant && currentMerchant.user_id === userId) ? currentMerchant : window._merchantIdentityCache[userId];
  const coupon = merchantCoupons(merchant)[index];
  const eligibility = merchantCouponEligibility(coupon);
  if(!eligibility.eligible){ showToast(eligibility.reason); return; }
  const couponId = merchantCouponId(coupon, index);
  try {
    const res = await authedFetch(`${SUPABASE_URL}/rest/v1/merchant_coupon_claims`, { method:'POST', headers:{'Content-Type':'application/json','Prefer':'return=representation'}, body:JSON.stringify({ merchant_user_id:userId, user_id:session.user.id, coupon_id:couponId, coupon_snapshot:{ title:coupon.title || '优惠券', badge:coupon.badge || '优惠', description:coupon.description || '', image:coupon.image || '', expires_at:coupon.expires_at || '', weekdays:coupon.weekdays || [], time_start:coupon.time_start || '', time_end:coupon.time_end || '', payment_methods:coupon.payment_methods || [], pricing_rule:coupon.pricing_rule || null } }) });
    if(!res.ok && res.status !== 409) throw new Error(await res.text());
    await loadMerchantCouponClaims(true);
    showToast(res.status === 409 ? '这张优惠券已经领取' : '已领取，到店出示二维码即可');
    rerenderMerchantSection(merchant);
  } catch(error){ console.warn('领取优惠券失败:', error.message); showToast('领取失败，请稍后重试'); }
}
function couponRedeemErrorText(message){
  const text = String(message || '');
  if(text.includes('coupon_expired')) return '该优惠券已过有效期，不能核销。';
  if(text.includes('coupon_invalid_weekday')) return '该优惠券不适用于今天，不能核销。';
  if(text.includes('coupon_invalid_time')) return '当前不在该优惠券的适用时段，不能核销。';
  if(text.includes('coupon_not_available')) return '该优惠券已停用或不存在，不能核销。';
  return '核销失败：该券可能已使用或已失效。';
}
async function confirmMerchantCouponRedeem(id){
  try {
    const res = await authedFetch(`${SUPABASE_URL}/rest/v1/rpc/redeem_merchant_coupon_claim`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ p_claim_id:Number(id) }) });
    if(!res.ok) throw new Error(await res.text());
    const claim = await res.json();
    if(claim && claim.user_id){ const snapshot = claim.coupon_snapshot || {}; await createMemberActivityNotification({ userId:claim.user_id, couponClaimId:claim.id, kind:'coupon', title:'优惠券已核销', body:`${merchantOperatorWorkspace() && merchantOperatorWorkspace().business_name || '商家'} 已核销你的「${snapshot.title || '优惠券'}」。` }); }
    showToast('✓ 优惠券已核销');
    closeMerchantCouponRedeem();
  } catch(error){ console.warn('优惠券核销失败:', error.message); showToast(couponRedeemErrorText(error.message)); }
}
function setMerchantOrderTip(percent){ const checkout = merchantOrderState().checkout || {}; checkout.tip = Number(percent) || 0; checkout.customTipAmount = null; merchantOrderState().checkout = checkout; renderMerchantOrderCheckout(); }
function setMerchantOrderCustomTip(){
  const checkout = merchantOrderState().checkout || {};
  const input = window.prompt('请输入小费金额（美元）', checkout.customTipAmount != null ? String(checkout.customTipAmount) : '');
  if(input === null) return;
  const value = Number(String(input).replace(/[^\d.]/g, ''));
  if(!Number.isFinite(value) || value < 0){ showToast('请输入正确的小费金额'); return; }
  checkout.customTipAmount = value; checkout.tip = null; merchantOrderState().checkout = checkout; renderMerchantOrderCheckout();
}
/* Removed overridden merchantOrderCheckoutClaims implementation during v5.510 cleanup. */

function selectMerchantOrderCheckoutCoupon(id){
  const state = merchantOrderState();
  const row = merchantOrderCheckoutClaims(state).find(item => Number(item.claim.id) === Number(id));
  if(!row || !row.eligibility.eligible){ showToast(row ? row.eligibility.reason : '该优惠券暂不可用'); return; }
  const settings = merchantOrderCheckoutSettings(state.merchant);
  const selected = state.checkout.selectedClaims || [];
  state.checkout.selectedClaims = selected.includes(Number(id)) ? selected.filter(value => value !== Number(id)) : (settings.coupon_mode === 'multiple' ? selected.concat(Number(id)) : [Number(id)]);
  renderMerchantOrderCheckout();
}
/* Removed overridden merchantCheckoutCouponChoiceHtml implementation during v5.510 cleanup. */

function renderMerchantOrderCheckout(){
  const body = document.getElementById('merchantOrderCheckoutBody');
  const state = merchantOrderState();
  if(!body || !state.merchant || !state.order) return;
  const settings = merchantOrderCheckoutSettings(state.merchant);
  const checkout = state.checkout || { method:'cash', selectedClaims:[], tip:0, customTipAmount:null };
  const deliveryOnly = state.order.order_type === 'takeout' && state.order.fulfillment === 'delivery';
  if(deliveryOnly) checkout.method = 'online';
  state.checkout = checkout;
  const rows = merchantOrderCheckoutClaims(state);
  const selectedRows = (checkout.selectedClaims || []).map(id => rows.find(row => Number(row.claim.id) === Number(id) && row.eligibility.eligible)).filter(Boolean);
  const subtotal = Number(state.order.subtotal || 0);
  const discount = Math.min(subtotal, selectedRows.reduce((sum,row) => sum + merchantCouponDiscountAmount(row.coupon || row.claim.coupon_snapshot || {}, subtotal, state.items), 0));
  const afterCoupon = Math.max(0, subtotal - discount);
  const tip = checkout.customTipAmount != null ? Number(checkout.customTipAmount) : afterCoupon * (Number(checkout.tip || 0) / 100);
  const total = afterCoupon + tip;
  const couponChoices = merchantCheckoutCouponChoiceHtml(rows, checkout);
  const qrCards = selectedRows.map(row => { const snapshot=row.claim.coupon_snapshot || {}; return `<div class="member-present-code" style="margin-top:12px;"><div class="member-present-qr">${memberCardQrHtml(couponClaimPublicCode(row.claim))}</div><b>${escHtml(snapshot.title || '优惠券')}</b><span>${escHtml(couponClaimPublicCode(row.claim))} · 向商家出示二维码核销</span></div>`; }).join('');
  const couponPanel = `<div class="merchant-mini-section" style="margin-top:14px;"><b>${uiIcon('ticket',14)} 可用优惠券</b><p>${settings.coupon_mode === 'multiple' ? '本店允许此订单选择多张已领取优惠券。' : '本店每单限选一张已领取优惠券。'}</p>${couponChoices}${qrCards}</div>`;
  const inPersonLabel = checkout.method === 'card' ? '刷卡' : '现金';
  const cashContent = `${couponPanel}<div class="merchant-mini-section"><div class="merchant-order-line"><span>菜品小计</span><b>${merchantOrderMoney(subtotal)}</b></div><div class="merchant-order-line" style="margin-top:8px;"><span>优惠券优惠</span><b style="color:var(--berry);">-${merchantOrderMoney(discount)}</b></div><div class="merchant-order-line" style="margin-top:8px;font-size:15px;"><b>应付合计</b><b style="color:var(--berry);">${merchantOrderMoney(afterCoupon)}</b></div></div><div class="order-notice">请到店使用${inPersonLabel}结算；商家核销优惠券后会按上方金额完成订单。</div>`;
  const onlineContent = `<div class="merchant-mini-section" style="margin-top:14px;"><b>${uiIcon('bag',14)} 今日菜单合计</b><div class="merchant-order-lines" style="margin-top:10px;">${merchantOrderBatchHtml(state.items)}</div><div class="merchant-order-line" style="margin-top:10px;padding-top:10px;border-top:1px solid var(--line);"><span>菜品小计</span><b>${merchantOrderMoney(subtotal)}</b></div></div>${couponPanel}<div class="merchant-mini-section"><b>小费</b><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;">${[0].concat(settings.tip_options).map(percent => `<button onclick="setMerchantOrderTip(${Number(percent)})" style="border:1px solid ${checkout.customTipAmount == null && Number(checkout.tip) === Number(percent) ? 'var(--sage)' : 'var(--line)'};background:${checkout.customTipAmount == null && Number(checkout.tip) === Number(percent) ? 'var(--sage-light)' : '#fff'};border-radius:9px;padding:8px 12px;font:800 12px inherit;">${Number(percent) ? `${Number(percent)}%` : '不加小费'}</button>`).join('')}<button onclick="setMerchantOrderCustomTip()" style="border:1px solid ${checkout.customTipAmount != null ? 'var(--sage)' : 'var(--line)'};background:${checkout.customTipAmount != null ? 'var(--sage-light)' : '#fff'};border-radius:9px;padding:8px 12px;font:800 12px inherit;">自定</button></div><div class="merchant-order-line" style="margin-top:12px;"><span>优惠券优惠</span><b style="color:var(--berry);">-${merchantOrderMoney(discount)}</b></div><div class="merchant-order-line" style="margin-top:8px;"><span>小费</span><b>${merchantOrderMoney(tip)}</b></div><div class="merchant-order-line" style="margin-top:8px;font-size:15px;"><b>应付合计</b><b style="color:var(--berry);">${merchantOrderMoney(total)}</b></div></div><div class="merchant-mini-section"><b>支付方式</b><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px;">${['Apple Pay','Google Pay','信用卡','商家礼品卡'].map(label => `<button disabled style="border:1px solid var(--line);border-radius:10px;background:#f5f4ef;color:var(--ink-faint);padding:11px;font:800 12px inherit;">${escHtml(label)}</button>`).join('')}</div><p style="margin-top:10px;font-size:11px;color:var(--ink-faint);">在线支付尚未接入，当前不会扣款，也不会提前核销优惠券。</p></div>`;
  const paymentTabs=deliveryOnly?`<button class="on">在线支付</button>`:`<button class="${checkout.method === 'cash' ? 'on' : ''}" onclick="setMerchantOrderCheckoutMethod('cash')">现金</button><button class="${checkout.method === 'card' ? 'on' : ''}" onclick="setMerchantOrderCheckoutMethod('card')">刷卡</button><button class="${checkout.method === 'online' ? 'on' : ''}" onclick="setMerchantOrderCheckoutMethod('online')">在线支付</button>`;
  body.innerHTML = `<div class="order-merchant-hero"><div class="order-merchant-title"><div class="logo">${state.merchant.logo ? `<img src="${escAttr(state.merchant.logo)}" alt="">` : escHtml(initials(state.merchant.business_name || '店'))}</div><div><b>${escHtml(state.merchant.business_name || '订单结算')}</b><span>${escHtml(state.order.table_name || '')} · ${escHtml(state.order.order_code || '')}</span></div></div></div><div class="order-category-tabs">${paymentTabs}</div>${checkout.method === 'online' ? onlineContent : cashContent}`;
}
function bindMerchantOrderPullRefresh(){
  const sheet = document.getElementById('merchantOrderMenu');
  const body = document.getElementById('merchantOrderMenuBody');
  if(!sheet || !body || body.dataset.pullBound === '1') return;
  body.dataset.pullBound = '1';
  let startY = 0;
  let distance = 0;
  body.addEventListener('touchstart', event => { if(body.scrollTop <= 0 && event.touches.length === 1){ startY = event.touches[0].clientY; distance = 0; } }, {passive:true});
  body.addEventListener('touchmove', event => { if(!startY) return; distance = Math.max(0, event.touches[0].clientY - startY); if(distance > 14) pullRefreshIndicator(distance > 64 ? 'ready' : 'pulling', distance > 64 ? '松开刷新已点内容' : '下拉刷新已点内容'); }, {passive:true});
  body.addEventListener('touchend', async () => { const shouldRefresh = distance > 64; startY = 0; distance = 0; if(!shouldRefresh) return pullRefreshIndicator(); pullRefreshIndicator('loading', '正在刷新已点内容'); await loadMerchantCustomerActiveOrder(true); pullRefreshIndicator('loading', '刷新完成'); setTimeout(() => pullRefreshIndicator(), 450); }, {passive:true});
}
bindMerchantOrderPullRefresh();
async function openMerchantCouponWalletNative(focusClaimId){
  if(!(session && session.user)){ openAuth(); return; }
  const sheet = document.getElementById('merchantCouponWallet');
  const body = document.getElementById('merchantCouponWalletBody');
  if(!sheet || !body) return;
  sheet.classList.add('open');
  body.innerHTML = '<div class="deals-empty-panel">正在读取已领取优惠券...</div>';
  try {
    const rows = await loadMerchantCouponClaims(true);
    const merchantIds = [...new Set(rows.map(row => row.merchant_user_id).filter(Boolean))];
    if(merchantIds.length){
      if(!merchantPublicApi) throw new Error('商家资料接口未初始化');
      (await merchantPublicApi.listByUserIds({ userIds:merchantIds, select:'user_id,business_name,logo,coupons' })).forEach(row => setMerchantIdentityCache(row.user_id, row));
    }
    const visibleRows = focusClaimId ? rows.filter(claim => Number(claim.id) === Number(focusClaimId)) : rows;
    body.innerHTML = visibleRows.length ? visibleRows.map(claim => {
      const merchant = window._merchantIdentityCache[claim.merchant_user_id] || {};
      const snapshot = claim.coupon_snapshot || {};
      const currentCoupon = merchantCouponForClaim(merchant, claim);
      const eligibility = currentCoupon ? merchantCouponEligibility(currentCoupon) : { eligible:false, reason:'该优惠券已停用或不存在' };
      const redeemed = claim.status === 'redeemed';
      const canPresent = !redeemed && eligibility.eligible;
      return `<div class="merchant-coupon-card" style="margin-bottom:14px;">${snapshot.image ? `<div class="merchant-coupon-image"><img src="${escAttr(snapshot.image)}" alt=""></div>` : ''}<div class="merchant-coupon-title">${escHtml(snapshot.title || '优惠券')}<span>${redeemed ? '已核销' : canPresent ? escHtml(snapshot.badge || '已领取') : '当前不可用'}</span></div><div class="merchant-coupon-note">${escHtml(merchant.business_name || '乐生活商家')} · ${escHtml(snapshot.description || '到店出示使用')}</div>${currentCoupon ? `<div class="merchant-coupon-note">适用：${escHtml(merchantCouponRuleText(currentCoupon))}</div>` : ''}${canPresent ? `<div class="member-present-code" style="margin-top:12px;"><div class="member-present-qr">${memberCardQrHtml(couponClaimPublicCode(claim))}</div><b>${escHtml(couponClaimPublicCode(claim))}</b><span>到店出示二维码给商家扫描核销</span></div><button onclick="deleteMerchantCouponClaim(${Number(claim.id)})" style="margin-top:10px;width:100%;border:1px solid var(--line);border-radius:9px;padding:9px;background:#fff;color:var(--berry-dark);font:800 12px inherit;">删除已领取优惠券</button>` : redeemed ? `<div class="merchant-coupon-note" style="color:var(--ink-faint);">已于 ${claim.redeemed_at ? escHtml(new Date(claim.redeemed_at).toLocaleString('zh-CN')) : ''} 核销</div>` : `<div class="merchant-coupon-note" style="color:var(--berry);">当前无法出示：${escHtml(eligibility.reason)}</div>`}</div>`;
    }).join('') : '<div class="deals-empty-panel">还没有领取优惠券。</div>';
  } catch(error){ console.warn('读取优惠券失败:', error.message); body.innerHTML = '<div class="deals-empty-panel">优惠券暂时无法读取，请稍后重试。</div>'; }
}
async function deleteMerchantCouponClaim(claimId){
  if(!confirm('确定删除这张未核销的优惠券吗？删除后不能恢复。')) return;
  try{
    if(!merchantCouponApi) throw new Error('优惠券接口未初始化');
    await merchantCouponApi.remove(claimId);
    await loadMerchantCouponClaims(true);
    showToast('优惠券已删除');
    openMerchantCouponWalletNative();
  }catch(error){
    console.warn('删除优惠券失败:',error.message);
    showToast('删除失败：已核销优惠券不能删除');
  }
}
async function openMerchantCouponRedeemByCode(code){
  if(!canOperateMerchantWorkspace() || !activeMerchantWorkspaceId()){ showToast('请先进入商家工作台'); return; }
  const id = Number(String(code || '').toUpperCase().replace(/^LSHC-?/,'').replace(/\D/g,''));
  if(!id){ showToast('优惠券二维码无效'); return; }
  const sheet = document.getElementById('merchantCouponRedeem');
  const body = document.getElementById('merchantCouponRedeemBody');
  if(!sheet || !body) return;
  sheet.classList.add('open'); body.innerHTML = '<div class="deals-empty-panel">正在核对优惠券...</div>';
  try {
    const claimRes = await authedFetch(`${SUPABASE_URL}/rest/v1/merchant_coupon_claims?id=eq.${id}&merchant_user_id=eq.${encodeURIComponent(activeMerchantWorkspaceId())}&select=*&limit=1`, { method:'GET' });
    if(!claimRes.ok) throw new Error(await claimRes.text());
    const claim = (await claimRes.json())[0];
    if(!claim){ body.innerHTML = '<div class="deals-empty-panel">没有找到本店的这张优惠券。</div>'; return; }
    const merchantRes = await authedFetch(`${SUPABASE_URL}/rest/v1/merchants?user_id=eq.${encodeURIComponent(activeMerchantWorkspaceId())}&select=user_id,coupons&limit=1`, { method:'GET' });
    const merchant = merchantRes.ok ? (await merchantRes.json())[0] || {} : {};
    await loadProfilesForIds([claim.user_id]);
    const profile = cachedProfile(claim.user_id);
    const snapshot = claim.coupon_snapshot || {};
    const currentCoupon = merchantCouponForClaim(merchant, claim);
    const eligibility = currentCoupon ? merchantCouponEligibility(currentCoupon) : { eligible:false, reason:'该优惠券已停用或不存在' };
    const redeemed = claim.status === 'redeemed';
    body.innerHTML = `<div class="merchant-dash-card" style="box-shadow:none;"><div style="display:flex;align-items:center;gap:12px;"><div class="merchant-member-avatar" onclick="openUserPublicPage('${String(claim.user_id).replace(/'/g,'')}','${String(profile.name || '乐生活用户').replace(/'/g,'')}')" style="cursor:pointer;">${profile.avatar ? `<img src="${escAttr(profile.avatar)}" alt="">` : escHtml(initials(profile.name || '用'))}</div><div><b style="display:block;font-size:16px;">${escHtml(snapshot.title || '优惠券')}</b><span style="font-size:12px;color:var(--ink-faint);">${escHtml(profile.name || '乐生活用户')} · ${redeemed ? '已核销' : eligibility.eligible ? '可核销' : '暂不可核销'}</span></div></div>${snapshot.image ? `<div class="merchant-coupon-image" style="margin-top:14px;"><img src="${escAttr(snapshot.image)}" alt=""></div>` : ''}<p style="font-size:13px;line-height:1.65;color:var(--ink-soft);">${escHtml(snapshot.description || '')}</p>${currentCoupon ? `<p style="font-size:12px;color:var(--ink-faint);">适用：${escHtml(merchantCouponRuleText(currentCoupon))}</p>` : ''}</div>${redeemed ? '<div class="deals-empty-panel">这张优惠券已经核销，不能重复使用。</div>' : eligibility.eligible ? `<button class="merchant-reward-redeem-btn" onclick="confirmMerchantCouponRedeem(${Number(claim.id)})">确认核销优惠券</button>` : `<div class="deals-empty-panel" style="color:var(--berry);">不能使用：${escHtml(eligibility.reason)}</div>`}`;
  } catch(error){ console.warn('优惠券核对失败:', error.message); body.innerHTML = '<div class="deals-empty-panel">优惠券暂时无法核对，请稍后重试。</div>'; }
}
/* ---------- 5.250：网页优惠券限制、催菜与消费账单 ---------- */
function isNativeMerchantApp(){
  try { return !!(window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform()); } catch(error){ return false; }
}
function closeMerchantCouponAppDownload(){ document.getElementById('merchantCouponAppDownload')?.classList.remove('open'); }
function openMerchantCouponAppDownload(){
  const sheet = document.getElementById('merchantCouponAppDownload');
  const body = document.getElementById('merchantCouponAppDownloadBody');
  if(!sheet || !body) return;
  const ua = navigator.userAgent || '';
  const ios = /iPhone|iPad|iPod/i.test(ua);
  const android = /Android/i.test(ua);
  const primary = ios ? 'iPhone 版' : android ? 'Android 版' : '乐生活 App';
  body.innerHTML = `<div class="deals-empty-panel" style="margin-top:20px;"><b style="display:block;font-size:17px;color:var(--ink);margin-bottom:8px;">优惠券仅支持在乐生活 App 使用</b><p style="line-height:1.7;">网页端可正常扫码点餐，但优惠券领取、出示和结算核销需在 App 内完成。</p><button class="primary" onclick="showToast('乐生活 App 即将上架，下载链接将在上架后自动启用')" style="margin-top:14px;width:100%;border:0;border-radius:10px;padding:12px;background:var(--sage);color:#fff;font:900 14px inherit;">下载${primary}</button>${!ios && !android ? '<button onclick="showToast(\'请使用手机打开本页下载 App\')" style="margin-top:9px;width:100%;border:1px solid var(--line);border-radius:10px;padding:12px;background:#fff;font:800 13px inherit;">在手机上继续</button>' : ''}<p style="font-size:11px;color:var(--ink-faint);margin-top:14px;">App 上架后将按你的设备自动跳转至 App Store 或 Google Play。</p></div>`;
  sheet.classList.add('open');
}
function merchantCouponAvailable(coupon){ return merchantCouponEligibility(coupon).eligible; }
async function claimMerchantCoupon(userId,index){
  if(!isNativeMerchantApp()){ openMerchantCouponAppDownload(); return; }
  if(!(session && session.user)){ showToast('请先登录后领取优惠券'); openAuth(); return; }
  const merchant = (currentMerchant && currentMerchant.user_id === userId) ? currentMerchant : window._merchantIdentityCache[userId];
  const coupon = merchantCoupons(merchant)[index];
  const eligibility = merchantCouponEligibility(coupon);
  if(!eligibility.eligible){ showToast(eligibility.reason); return; }
  const couponId = merchantCouponId(coupon,index);
  try {
    const res = await authedFetch(`${SUPABASE_URL}/rest/v1/merchant_coupon_claims`, { method:'POST', headers:{'Content-Type':'application/json','Prefer':'return=representation'}, body:JSON.stringify({ merchant_user_id:userId,user_id:session.user.id,coupon_id:couponId,coupon_snapshot:{title:coupon.title || '优惠券',badge:coupon.badge || '优惠',description:coupon.description || '',image:coupon.image || '',expires_at:coupon.expires_at || '',weekdays:coupon.weekdays || [],time_start:coupon.time_start || '',time_end:coupon.time_end || '',payment_methods:coupon.payment_methods || []} }) });
    if(!res.ok && res.status !== 409) throw new Error(await res.text());
    await loadMerchantCouponClaims(true); showToast(res.status === 409 ? '这张优惠券已经领取' : '已领取，到店出示二维码即可'); rerenderMerchantSection(merchant);
  } catch(error){ console.warn('领取优惠券失败:',error.message); showToast('领取失败，请稍后重试'); }
}
async function openMerchantCouponWallet(focusClaimId){
  if(!isNativeMerchantApp()){ openMerchantCouponAppDownload(); return; }
  return openMerchantCouponWalletNative(focusClaimId);
}
function merchantOrderStatusText(status){ return ({pending:'待处理',confirmed:'处理中',preparing:'处理中',reminded:'催菜中',served:'已上桌',completed:'已完成',cancelled:'已取消'})[status] || '处理中'; }
async function loadMerchantOrderTables(merchantUserId, includeInactive){
  if(!restaurantDataApi) throw new Error('restaurant_data_api_unavailable');
  return restaurantDataApi.listTables({merchantUserId, includeInactive:!!includeInactive});
}
async function deleteMerchantOrderTable(id,name){
  if(!confirm(`确定删除「${name || '这张餐桌'}」吗？`)) return;
  try {
    const result = await restaurantOrderApi.deleteTable(id);
    merchantOrderState().tables = (merchantOrderState().tables || []).filter(table => Number(table.id) !== Number(id));
    showToast(result === 'archived' ? '餐桌已有历史订单，已停用并移除' : '餐桌已删除');
    await renderMerchantTableManager();
  } catch(error){ console.warn('删除餐桌失败:',error.message); showToast('删除餐桌失败，请稍后重试'); }
}
/* Removed overridden merchantOrderManagerStatus implementation during v5.510 cleanup. */

function merchantOrderLastActivity(order,items){ const list=items.filter(item=>String(item.order_id)===String(order.id)); return Math.max(new Date(order.created_at || 0).getTime() || 0,...list.map(item=>new Date(item.created_at || 0).getTime() || 0)); }
async function renderMerchantOrderManager(silent){
  const body=document.getElementById('merchantOrderManagerBody'),merchantUserId=document.getElementById('merchantOrderManager')?.dataset.merchantUserId||merchantOrderManagerMerchantId();
  if(!body||!merchantUserId)return; if(!silent)body.innerHTML='<div class="deals-empty-panel">正在读取订单...</div>';
  try {
    const [merchant,tables,orders]=await Promise.all([getMerchantOrderMerchant(merchantUserId),loadMerchantOrderTables(merchantUserId,true),restaurantDataApi.listOrders({merchantUserId,limit:100})]);
    const ids=orders.map(row=>row.id).filter(Boolean); let items=[];
    if(ids.length) items=await restaurantDataApi.listOrderItems({orderIds:ids});
    Object.assign(merchantOrderState(),{merchant,tables,orders,items}); const status=merchantOrderState().managerStatus||'processing';
    const statusMatch={processing:row=>['pending','confirmed','preparing'].includes(row.status),reminded:row=>row.status==='reminded',served:row=>row.status==='served',completed:row=>row.status==='completed'};
    const list=orders.filter(statusMatch[status]||statusMatch.processing).sort((a,b)=>merchantOrderLastActivity(a,items)-merchantOrderLastActivity(b,items));
    const tabs=[['processing','处理中'],['served','已上桌'],['reminded','催菜中'],['completed','已完成']];
    body.innerHTML=`<div class="merchant-order-top-actions"><button class="primary" onclick="openMerchantKitchenDisplay('${String(merchantUserId).replace(/'/g,'')}')">${uiIcon('bag',17)} 后厨订单屏</button><button onclick="openMerchantTableManager()">${uiIcon('store',17)} 餐桌二维码</button><button onclick="openMerchantOrderCheckoutSettings()">${uiIcon('settings',17)} 结算设置</button><button onclick="renderMerchantOrderManager()">${uiIcon('refresh',17)} 刷新订单</button></div><div class="order-notice">${escHtml(merchant&&merchant.business_name||'商家')} · 每 3 分钟自动刷新；新加菜会按最新点菜时间重新排序。</div><div class="merchant-order-status-tabs">${tabs.map(row=>`<button class="${status===row[0]?'on':''}" onclick="merchantOrderManagerStatus('${row[0]}')">${row[1]} (${orders.filter(statusMatch[row[0]]).length})</button>`).join('')}</div>${list.length?list.map(order=>merchantOrderCardHtml(order,items.filter(item=>String(item.order_id)===String(order.id)))).join(''):'<div class="deals-empty-panel">这里暂时没有订单。</div>'}`;
  }catch(error){console.warn('订单管理读取失败:',error.message);if(!silent)body.innerHTML='<div class="deals-empty-panel">订单读取失败，请稍后重试。</div>';}
}
/* Removed overridden merchantOrderCardHtml implementation during v5.510 cleanup. */

async function completeMerchantOrderWithBill(orderId,paymentMethod){
  if(!confirm(`确认该订单已使用${paymentMethod==='cash'?'现金':'刷卡'}完成支付？`))return;
  try{await restaurantOrderApi.completeWithBill({orderId,paymentMethod});showToast('订单已完成，账单已发送给顾客');renderMerchantOrderManager();}catch(error){console.warn('完成订单失败:',error.message);showToast('完成订单失败，请稍后重试');}
}
async function remindMerchantOrder(){
  const state=merchantOrderState(); if(!state.order)return;
  try{state.order=await restaurantOrderApi.remindOrder(state.order.id);renderMerchantOrderMenu();showToast('已提醒商家催菜');}catch(error){showToast('当前不能催菜，请稍后重试');}
}
function merchantOrderCheckoutClaims(state){ if(!isNativeMerchantApp())return []; const paymentMethod=state.checkout&&state.checkout.method||'cash'; return (window._merchantCouponClaims.rows||[]).filter(claim=>String(claim.merchant_user_id)===String(state.merchant.user_id)&&claim.status==='claimed').map(claim=>({claim,coupon:merchantCouponForClaim(state.merchant,claim)})).map(row=>Object.assign(row,{eligibility:merchantCouponEligibility(row.coupon||row.claim.coupon_snapshot||{},paymentMethod)})); }
function merchantCheckoutCouponChoiceHtml(rows,checkout){ if(!isNativeMerchantApp())return '<div class="order-notice" style="margin-top:10px;">网页端扫码点餐不支持优惠券结算，请在乐生活 App 内使用。</div>'; return rows.length?`<div style="display:grid;gap:9px;margin-top:10px;">${rows.map(row=>{const selected=(checkout.selectedClaims||[]).includes(Number(row.claim.id));const snapshot=row.claim.coupon_snapshot||row.coupon||{};return `<button onclick="selectMerchantOrderCheckoutCoupon(${Number(row.claim.id)})" ${row.eligibility.eligible?'':'disabled'} style="text-align:left;border:1.5px solid ${selected?'var(--sage)':'var(--line)'};background:${selected?'var(--sage-light)':'#fff'};border-radius:10px;padding:10px;opacity:${row.eligibility.eligible?1:.55};"><b>${escHtml(snapshot.title||'优惠券')}</b><span style="display:block;font-size:11px;color:${row.eligibility.eligible?'var(--ink-soft)':'var(--berry)'};margin-top:4px;">${escHtml(row.eligibility.eligible?(snapshot.description||'到店出示使用'):row.eligibility.reason)}</span></button>`;}).join('')}</div>`:'<div class="deals-empty-panel" style="margin-top:10px;">还没有可使用的已领取优惠券。</div>'; }
/* Removed overridden closeMerchantOrderHistory implementation during v5.510 cleanup. */

async function openMerchantOrderHistory(){
  if(!(session&&session.user)){openAuth();return;} const sheet=document.getElementById('merchantOrderHistory'),body=document.getElementById('merchantOrderHistoryBody');if(!sheet||!body)return;sheet.classList.add('open');body.innerHTML='<div class="deals-empty-panel">正在读取消费记录...</div>';
  try{const res=await authedFetch(`${SUPABASE_URL}/rest/v1/merchant_order_bills?user_id=eq.${encodeURIComponent(session.user.id)}&select=*&order=created_at.desc&limit=200`,{method:'GET'});if(!res.ok)throw new Error(await res.text());const bills=await res.json();const merchantIds=[...new Set(bills.map(b=>b.merchant_user_id).filter(Boolean))];if(merchantIds.length){const mres=await authedFetch(`${SUPABASE_URL}/rest/v1/merchants?user_id=in.(${merchantIds.map(encodeURIComponent).join(',')})&select=user_id,business_name,logo`,{method:'GET'});if(mres.ok)(await mres.json()).forEach(row=>setMerchantIdentityCache(row.user_id,row));}body.innerHTML=bills.length?bills.map(bill=>{const merchant=window._merchantIdentityCache[bill.merchant_user_id]||{};const method={cash:'现金',card:'刷卡',online:'在线支付'}[bill.payment_method]||'支付';return `<div class="merchant-dash-card" style="box-shadow:none;margin-bottom:12px;"><div style="display:flex;justify-content:space-between;gap:12px;"><div><b>${escHtml(merchant.business_name||'乐生活商家')}</b><span style="display:block;margin-top:4px;font-size:12px;color:var(--ink-faint);">${new Date(bill.created_at).toLocaleString('zh-CN')} · ${method}</span></div><b style="color:var(--berry);">${merchantOrderMoney(bill.total_amount)}</b></div><div style="margin-top:10px;font-size:12px;color:var(--ink-soft);">菜品 ${merchantOrderMoney(bill.subtotal)}${Number(bill.discount_amount)?` · 优惠 -${merchantOrderMoney(bill.discount_amount)}`:''}${Number(bill.tip_amount)?` · 小费 ${merchantOrderMoney(bill.tip_amount)}`:''}</div></div>`;}).join(''):'<div class="deals-empty-panel">还没有消费记录。</div>';}catch(error){console.warn('读取消费记录失败:',error.message);body.innerHTML='<div class="deals-empty-panel">消费记录暂时无法读取，请稍后重试。</div>';}
}
window._merchantKitchenRefreshTimer = window._merchantKitchenRefreshTimer || null;
window._merchantRunnerRefreshTimer = window._merchantRunnerRefreshTimer || null;
function closeMerchantKitchenDisplay(){
  if(window._merchantKitchenRefreshTimer){ clearInterval(window._merchantKitchenRefreshTimer); window._merchantKitchenRefreshTimer=null; }
  document.getElementById('merchantKitchenDisplay')?.classList.remove('open');
}
async function openMerchantKitchenDisplay(merchantUserId){
  const id=merchantUserId||merchantOrderManagerMerchantId();
  if(!id||!merchantWorkspaceCanEnterOrderBackend()){ showToast('你没有这家商店的点餐后台权限'); return; }
  const sheet=document.getElementById('merchantKitchenDisplay'); if(!sheet)return;
  sheet.dataset.merchantUserId=id; sheet.classList.add('open');
  if(window._merchantKitchenRefreshTimer) clearInterval(window._merchantKitchenRefreshTimer);
  window._merchantKitchenRefreshTimer=setInterval(()=>{ if(sheet.classList.contains('open')) renderMerchantKitchenDisplay(true); },8000);
  await renderMerchantKitchenDisplay();
}
function merchantKitchenGroupName(item,merchant){
  const product=(merchantProducts(merchant)||[]).find(row=>String(row.id)===String(item.product_id));
  return merchantProductCategoryList(product||{})[0] || '其他';
}
async function renderMerchantKitchenDisplay(silent){
  const sheet=document.getElementById('merchantKitchenDisplay'),body=document.getElementById('merchantKitchenDisplayBody'),merchantUserId=sheet?.dataset.merchantUserId||merchantOrderManagerMerchantId();
  if(!body||!merchantUserId)return; if(!silent)body.innerHTML='<div class="deals-empty-panel">正在同步后厨订单...</div>';
  try{
    const [merchant,orderRes]=await Promise.all([getMerchantOrderMerchant(merchantUserId),authedFetch(`${SUPABASE_URL}/rest/v1/merchant_orders?merchant_user_id=eq.${encodeURIComponent(merchantUserId)}&status=in.(pending,confirmed,preparing,reminded,served)&select=*&order=updated_at.asc&limit=120`,{method:'GET'})]);
    if(!orderRes.ok)throw new Error(await orderRes.text()); const orders=await orderRes.json(); const ids=orders.map(row=>row.id).filter(Boolean); let items=[];
    if(ids.length){const itemRes=await authedFetch(`${SUPABASE_URL}/rest/v1/merchant_order_items?order_id=in.(${ids.map(encodeURIComponent).join(',')})&select=*&order=created_at.asc`,{method:'GET'});if(itemRes.ok)items=await itemRes.json();}
    const activeItems=items.filter(item=>!item.is_served); const groups={};
    activeItems.forEach(item=>{const order=orders.find(row=>String(row.id)===String(item.order_id));if(!order)return;const name=merchantKitchenGroupName(item,merchant);(groups[name]||(groups[name]=[])).push({item,order});});
    const groupHtml=Object.keys(groups).sort().map(name=>`<section style="margin:0 0 18px;"><div style="position:sticky;top:0;background:var(--bg);padding:8px 0 7px;display:flex;justify-content:space-between;align-items:center;"><b style="font-size:16px;">${escHtml(name)}</b><span style="font-size:12px;color:var(--ink-faint);">${groups[name].filter(row=>!row.item.kitchen_done).length} 道制作中</span></div><div style="display:grid;gap:9px;">${groups[name].sort((a,b)=>new Date(a.item.created_at||0)-new Date(b.item.created_at||0)).map(({item,order})=>`<div class="merchant-order-card" style="margin:0;border-left:4px solid ${item.kitchen_done?'var(--sage)':order.status==='reminded'?'var(--berry)':'#d85151'};"><div style="display:flex;justify-content:space-between;gap:10px;"><div><b style="font-size:16px;">${escHtml(item.product_name)} × ${Number(item.quantity||0)}</b><span style="display:block;margin-top:4px;font-size:12px;color:var(--ink-soft);">${escHtml(order.table_name||'餐桌')} · ${escHtml(order.order_code||'')} ${item.batch_no>1?'· 新加菜':''}</span></div><span style="font-size:12px;font-weight:900;color:${item.kitchen_done?'var(--sage-dark)':order.status==='reminded'?'var(--berry)':'#c64040'};">${item.kitchen_done?'已完成制作':order.status==='reminded'?'催菜中':'制作中'}</span></div><div style="display:flex;gap:8px;margin-top:10px;">${item.kitchen_done?`<button style="border:0;border-radius:9px;padding:8px 11px;background:var(--sage);color:#fff;font:900 12px inherit;">已完成</button><button onclick="setMerchantOrderItemKitchenDone(${Number(item.id)},false)" style="border:1px solid var(--line);border-radius:9px;padding:8px 11px;background:#fff;font:900 12px inherit;">取消完成</button>`:`<button onclick="setMerchantOrderItemKitchenDone(${Number(item.id)},true)" style="border:0;border-radius:9px;padding:8px 11px;background:#d85151;color:#fff;font:900 12px inherit;">完成制作</button>`}</div></div>`).join('')}</div></section>`).join('');
    body.innerHTML=`<div class="order-notice">${escHtml(merchant&&merchant.business_name||'商家')} · 每 8 秒自动同步新单和催菜订单。后厨只负责制作完成；上桌由传菜岗位处理。</div>${groupHtml||'<div class="deals-empty-panel">当前没有待出菜品。</div>'}`;
  }catch(error){console.warn('后厨订单屏读取失败:',error.message);if(!silent)body.innerHTML='<div class="deals-empty-panel">后厨订单暂时无法同步，请稍后刷新。</div>';}
}
async function setMerchantOrderItemKitchenDone(itemId,done){
  if(!merchantWorkspaceHasPermission('kitchen_complete')){ showToast('你没有后厨完成制作权限'); return; }
  try{
    await restaurantOrderApi.setItemKitchenDone(itemId,done);
    showToast(done?'已标记完成制作':'已取消完成标记');
    renderMerchantKitchenDisplay(true);
  }catch(error){ console.warn('后厨状态更新失败:',error.message); showToast('更新失败，请确认后厨权限'); }
}
function closeMerchantRunnerDisplay(){
  if(window._merchantRunnerRefreshTimer){clearInterval(window._merchantRunnerRefreshTimer);window._merchantRunnerRefreshTimer=null;}
  document.getElementById('merchantRunnerDisplay')?.classList.remove('open');
}
async function openMerchantRunnerDisplay(merchantUserId){
  const id=merchantUserId||merchantOrderManagerMerchantId();
  if(!id||!merchantWorkspaceCanEnterOrderBackend()){showToast('你没有这家商店的点餐后台权限');return;}
  const sheet=document.getElementById('merchantRunnerDisplay');if(!sheet)return;
  sheet.dataset.merchantUserId=id;sheet.classList.add('open');
  if(window._merchantRunnerRefreshTimer)clearInterval(window._merchantRunnerRefreshTimer);
  window._merchantRunnerRefreshTimer=setInterval(()=>{if(sheet.classList.contains('open'))renderMerchantRunnerDisplay(true);},8000);
  await renderMerchantRunnerDisplay();
}
async function renderMerchantRunnerDisplay(silent){
  const sheet=document.getElementById('merchantRunnerDisplay'),body=document.getElementById('merchantRunnerDisplayBody'),merchantUserId=sheet?.dataset.merchantUserId||merchantOrderManagerMerchantId();
  if(!body||!merchantUserId)return;if(!silent)body.innerHTML='<div class="deals-empty-panel">正在同步传菜订单...</div>';
  try{
    const orders=await restaurantDataApi.listOrders({merchantUserId,statuses:['pending','confirmed','preparing','reminded','served'],limit:120,order:'updated_at.asc'});const ids=orders.map(row=>row.id).filter(Boolean);
    const items=ids.length?await restaurantDataApi.listOrderItems({orderIds:ids,order:'created_at.asc'}):[];
    const ready=items.filter(item=>item.kitchen_done&&!item.is_served),served=items.filter(item=>item.is_served);
    const card=(item,readyState)=>{const order=orders.find(row=>String(row.id)===String(item.order_id))||{};return `<div class="merchant-order-card" style="margin:0;border-left:4px solid ${readyState?'var(--sage)':'var(--line)'};"><div style="display:flex;justify-content:space-between;gap:10px;"><div><b style="font-size:16px;">${escHtml(item.product_name)} × ${Number(item.quantity||0)}</b><span style="display:block;margin-top:4px;font-size:12px;color:var(--ink-soft);">${escHtml(order.table_name||'餐桌')} · ${escHtml(order.order_code||'')} ${item.batch_no>1?'· 新加菜':''}</span></div><span style="font-size:12px;font-weight:900;color:${readyState?'var(--sage-dark)':'var(--ink-faint)'};">${readyState?'待上桌':'已上桌'}</span></div><button onclick="setMerchantOrderItemRunnerServed(${Number(item.id)},${readyState?'true':'false'})" style="margin-top:10px;border:${readyState?'0':'1px solid var(--line)'};border-radius:9px;padding:8px 11px;background:${readyState?'var(--sage)':'#fff'};color:${readyState?'#fff':'var(--ink)'};font:900 12px inherit;">${readyState?'上桌':'撤回上桌'}</button></div>`;};
    body.innerHTML=`<div class="order-notice">每 8 秒自动同步。只有后厨已完成的菜品会出现在待上桌列表。</div><section style="margin:0 0 18px;"><b style="display:block;font-size:16px;margin-bottom:9px;">待上桌 ${ready.length}</b><div style="display:grid;gap:9px;">${ready.map(item=>card(item,true)).join('')||'<div class="deals-empty-panel">暂时没有待上桌菜品。</div>'}</div></section><section><b style="display:block;font-size:16px;margin-bottom:9px;">已上桌</b><div style="display:grid;gap:9px;">${served.slice(-30).reverse().map(item=>card(item,false)).join('')||'<div class="deals-empty-panel">本轮还没有已上桌菜品。</div>'}</div></section>`;
  }catch(error){console.warn('传菜订单屏读取失败:',error.message);if(!silent)body.innerHTML='<div class="deals-empty-panel">传菜订单暂时无法同步，请稍后刷新。</div>';}
}
async function setMerchantOrderItemRunnerServed(itemId,served){
  if(!merchantWorkspaceHasPermission('order_serve')){showToast('你没有传菜上桌权限');return;}
  try{await restaurantOrderApi.setItemServed(itemId,served);showToast(served?'已标记上桌':'已撤回上桌');renderMerchantRunnerDisplay(true);}catch(error){console.warn('上桌状态更新失败:',error.message);showToast('更新失败，请确认传菜权限');}
}

/* 商家矩阵：岗位与权限。店主和店经理默认拥有完整日常经营权限。 */
const MERCHANT_STAFF_ROLES = [
  ['manager','管理','全部功能与团队管理'],
  ['cashier','收银','结账、会员与优惠券核销'],
  ['runner','服务员','上菜、催菜与桌台服务'],
  ['kitchen','后厨','后厨订单屏与完成制作'],
  ['operator','宣传','AI 发文、内容发布与社媒同步']
];
const MERCHANT_STAFF_PERMISSIONS = [
  ['order_view','查看订单'],['order_manage','管理订单'],['kitchen_view','查看后厨屏'],['kitchen_complete','完成制作'],
  ['order_serve','传菜上桌'],['order_complete','完成订单'],['coupon_redeem','核销优惠券'],['member_manage','会员核销'],
  ['menu_manage','管理菜单'],['table_manage','管理餐桌'],['content_manage','内容与 AI 发文'],['team_manage','管理团队'],['bill_view','查看账单']
];
function merchantWorkspaceRoles(){
  if(currentMerchant&&session&&session.user&&String(currentMerchant.user_id)===String(session.user.id))return ['owner'];
  const row=merchantMatrixActiveWorkspace||{};
  return Array.isArray(row.roles)&&row.roles.length?row.roles:(row.role?[row.role]:[]);
}
function merchantWorkspacePermissions(){
  if(merchantWorkspaceRoles().includes('owner')||merchantWorkspaceRoles().includes('manager'))return ['*'];
  return merchantRolePermissionCodes(merchantWorkspaceRoles());
}
function merchantRolePermissionCodes(roles){
  const set=new Set(Array.isArray(roles)?roles:[]);
  if(set.has('manager')) return ['*'];
  const permissions=[];
  if(set.has('kitchen')) permissions.push('kitchen_view','kitchen_complete');
  if(set.has('runner')) permissions.push('order_view','order_serve');
  if(set.has('cashier')) permissions.push('order_view','order_complete','coupon_redeem','member_manage','bill_view');
  if(set.has('operator')) permissions.push('content_manage');
  if(set.has('clerk')) permissions.push('order_view','order_serve','coupon_redeem','member_manage');
  return [...new Set(permissions)];
}
function merchantWorkspaceHasPermission(permission){ return merchantWorkspacePermissions().includes('*')||merchantWorkspacePermissions().includes(permission); }
function merchantWorkspaceCanLinkKitchenServe(){
  const roles=merchantWorkspaceRoles();
  return roles.includes('owner') || roles.includes('manager') || (roles.includes('kitchen') && roles.includes('runner'));
}
function merchantMatrixRoleText(role){ const found=MERCHANT_STAFF_ROLES.find(row=>row[0]===role);return found?found[1]:(role==='owner'?'店主':role==='clerk'?'服务员':'员工'); }
function merchantMatrixRolesText(roles,legacyRole){ const list=Array.isArray(roles)&&roles.length?roles:(legacyRole?[legacyRole]:[]);return list.map(merchantMatrixRoleText).join('、')||'员工'; }
function merchantPermissionText(code){ const row=MERCHANT_STAFF_PERMISSIONS.find(item=>item[0]===code);return row?row[1]:code; }
function canOperateMerchantWorkspace(){ return merchantWorkspaceHasPermission('member_manage')||merchantWorkspaceHasPermission('content_manage')||merchantWorkspaceHasPermission('order_view')||merchantWorkspaceHasPermission('coupon_redeem')||merchantWorkspaceHasPermission('kitchen_view')||merchantWorkspaceHasPermission('order_serve'); }
function merchantWorkspaceCanEnterOrderBackend(){
  if(currentMerchant&&session&&session.user&&String(currentMerchant.user_id)===String(session.user.id)) return true;
  return !!merchantMatrixActiveWorkspace;
}
function merchantStaffAccessPickerHtml(prefix,roles,permissions){
  const roleSet=new Set(Array.isArray(roles)&&roles.length?roles:['runner']);
  return '<div style="margin-top:13px;"><b style="font-size:13px;">岗位（可多选）</b><p style="margin:5px 0 8px;font-size:11px;color:var(--ink-faint);line-height:1.5;">勾选岗位即可自动获得对应功能。后厨与服务员同时勾选时，可直接上桌并同步完成制作。</p><div style="display:grid;gap:7px;">'+MERCHANT_STAFF_ROLES.map(row=>'<label style="display:grid;grid-template-columns:18px 1fr;align-items:start;gap:7px;border:1px solid var(--line);border-radius:8px;padding:9px;font-size:12px;background:#fff;"><input class="'+prefix+'-role" type="checkbox" value="'+row[0]+'" '+(roleSet.has(row[0])?'checked':'')+' style="margin-top:2px;"><span><b style="display:block;color:var(--ink);">'+row[1]+'</b><small style="display:block;margin-top:2px;color:var(--ink-faint);line-height:1.4;">'+row[2]+'</small></span></label>').join('')+'</div></div>';
}
function merchantStaffPickerValues(prefix,kind){ return Array.from(document.querySelectorAll('.'+prefix+'-'+kind+':checked')).map(node=>node.value); }
async function loadMerchantMatrixState(){
  if(!(session&&session.user)){merchantMatrixWorkspaces=[];merchantMatrixInvites=[];merchantMatrixActiveWorkspace=null;return;}
  try{
    if(!merchantTeamApi)throw new Error('商家团队接口未初始化');
    const state=await merchantTeamApi.loadState(session.user.id);
    merchantMatrixWorkspaces=(state.workspaces||[]).map(row=>Object.assign({},row,{merchant:row.merchant||{}}));
    merchantMatrixInvites=state.invites||[];
    const ids=merchantMatrixInvites.map(row=>row.merchant_user_id).filter(Boolean);
    if(ids.length){
      if(!merchantPublicApi) throw new Error('商家资料接口未初始化');
      (await merchantPublicApi.listByUserIds({userIds:ids,select:'user_id,business_name,logo'})).forEach(row=>setMerchantIdentityCache(row.user_id,row));
    }
  }catch(error){console.warn('商家矩阵账号读取失败:',error.message);merchantMatrixWorkspaces=[];merchantMatrixInvites=[];}
}
function merchantMatrixWorkspaceCardHtml(){
  if(!(session&&session.user))return '';
  const invites=merchantMatrixInvites||[],spaces=merchantMatrixWorkspaces||[];
  if(!invites.length&&!spaces.length)return '';
  const inviteHtml=invites.map(row=>{const m=window._merchantIdentityCache[row.merchant_user_id]||{},name=m.business_name||'认证商家';return '<div style="padding:11px 0;border-bottom:1px solid var(--line);"><b style="font-size:13px;">'+escHtml(name)+' 邀请你加入商家团队</b><div style="font-size:12px;color:var(--ink-faint);margin-top:4px;">岗位：'+escHtml(merchantMatrixRolesText(row.roles,row.role))+'</div><div style="display:flex;gap:8px;margin-top:9px;"><button onclick="respondMerchantMatrixInvite('+Number(row.id)+',true)" style="border:0;border-radius:9px;background:var(--sage);color:#fff;padding:7px 12px;font-size:12px;font-weight:800;">接受授权</button><button onclick="respondMerchantMatrixInvite('+Number(row.id)+',false)" style="border:1px solid var(--line);border-radius:9px;background:#fff;padding:7px 12px;font-size:12px;font-weight:800;">拒绝</button></div></div>';}).join('');
  const workspaceHtml=spaces.map(row=>{const m=row.merchant||{},name=m.business_name||'认证商家',roles=Array.isArray(row.roles)&&row.roles.length?row.roles:[row.role],id=escAttr(row.merchant_user_id||''),buttons=[];
    buttons.push('<button data-merchant-id="'+id+'" onclick="openMerchantMatrixOrders(this.dataset.merchantId)" style="border:1px solid var(--sage);border-radius:8px;background:var(--sage-light);color:var(--sage-dark);padding:8px;font-size:12px;font-weight:900;">点餐后台</button>');
    buttons.push('<button data-merchant-id="'+id+'" onclick="openMerchantMatrixOperations(this.dataset.merchantId)" style="border:1px solid var(--line);border-radius:8px;background:var(--bg-alt);padding:8px;font-size:12px;font-weight:900;">运营后台</button>');
    return '<div style="width:100%;border:1px solid var(--line);background:#fff;border-radius:10px;padding:10px;margin-top:8px;"><div style="display:flex;align-items:center;gap:10px;"><span class="merchant-member-avatar" style="width:34px;height:34px;background:var(--sage-light);color:var(--sage-dark);">'+(m.logo?'<img src="'+escAttr(m.logo)+'" alt="">':escHtml(initials(name)))+'</span><span style="min-width:0;flex:1;"><b style="display:block;font-size:13px;color:var(--ink);">'+escHtml(name)+'</b><small style="display:block;color:var(--ink-faint);margin-top:3px;">'+escHtml(merchantMatrixRolesText(roles,row.role))+'</small></span></div><div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin-top:9px;">'+buttons.join('')+'</div></div>';}).join('');
  return '<section style="margin:14px 0 4px;padding:13px 14px;border:1px solid var(--line);border-radius:12px;background:var(--card);"><div style="font-size:14px;font-weight:900;color:var(--ink);">商家工作台</div>'+inviteHtml+workspaceHtml+'</section>';
}
function setMerchantMatrixWorkspace(merchantUserId){const row=(merchantMatrixWorkspaces||[]).find(item=>String(item.merchant_user_id)===String(merchantUserId));if(!row||!row.merchant){showToast('商家授权已失效，请刷新后重试');return null;}merchantMatrixActiveWorkspace=row;window._activeMerchantMemberManagerId=row.merchant_user_id;return row;}
function openMerchantMatrixWorkspace(merchantUserId){const row=setMerchantMatrixWorkspace(merchantUserId);if(row)openMerchantMemberManager(row.merchant_user_id);}
function openMerchantMatrixOrders(merchantUserId){const row=setMerchantMatrixWorkspace(merchantUserId);if(row)openMerchantOrderManager(row.merchant_user_id);}
function openMerchantMatrixKitchen(merchantUserId){const row=setMerchantMatrixWorkspace(merchantUserId);if(row)openMerchantKitchenDisplay(row.merchant_user_id);}
function openMerchantMatrixRunner(merchantUserId){const row=setMerchantMatrixWorkspace(merchantUserId);if(row)openMerchantRunnerDisplay(row.merchant_user_id);}
async function openMerchantMatrixOperations(merchantUserId){
  const row=setMerchantMatrixWorkspace(merchantUserId);
  if(!row||!merchantWorkspaceHasPermission('content_manage')){showToast('你没有这家商店的运营权限');return;}
  try{
    const merchant=await getMerchantOrderMerchant(row.merchant_user_id);
    if(!merchant)throw new Error('merchant_not_found');
    currentMerchant=merchant;
    openMerchantPublishDashboard();
  }catch(error){console.warn('运营后台打开失败:',error.message);showToast('运营后台暂时无法打开，请稍后重试');}
}
async function renderMerchantTeamManager(){
  const body=document.getElementById('merchantTeamManagerBody');if(!body||!currentMerchant)return;body.innerHTML='<div class="deals-empty-panel">正在读取团队成员...</div>';
  try{
    if(!merchantTeamApi)throw new Error('商家团队接口未初始化');const rows=await merchantTeamApi.listMembers(currentMerchant.user_id);await loadProfilesForIds(rows.map(row=>row.member_user_id));const selected=merchantMatrixSelectedPerson,selectedName=selected?(selected.name||'已选择用户'):'还没有选择用户';
    const members=rows.map(row=>{const p=cachedProfile(row.member_user_id),name=p.name||'乐生活用户',avatar=p.avatar||resolveAvatarUrl(row.member_user_id),status=row.status==='active'?'已授权':row.status==='pending'?'待确认':row.status==='declined'?'已拒绝':'已撤销',editing=Number(window._merchantMatrixEditingId)===Number(row.id);const details=editing?'<div style="grid-column:1/-1;padding-top:7px;">'+merchantStaffAccessPickerHtml('merchantEdit'+Number(row.id),row.roles||[row.role],row.permissions||[])+'<div style="display:flex;gap:8px;margin-top:10px;"><button class="primary" style="padding:7px 10px;border:0;border-radius:8px;background:var(--sage);color:#fff;font-weight:900;" onclick="saveMerchantMatrixMemberAccess('+Number(row.id)+')">保存权限</button><button style="padding:7px 10px;border:1px solid var(--line);border-radius:8px;background:#fff;font-weight:900;" onclick="closeMerchantMatrixMemberAccess()">取消</button></div></div>':'<button onclick="editMerchantMatrixMemberAccess('+Number(row.id)+')" style="padding:6px 9px;border:1px solid var(--line);border-radius:8px;background:#fff;font-size:11px;font-weight:900;">权限</button>';const actions=(row.status==='active'||row.status==='pending')?'<button onclick="revokeMerchantMatrixMember('+Number(row.id)+')" style="padding:6px 9px;border:1px solid var(--line);border-radius:8px;background:#fff;color:var(--berry-dark);font-size:11px;font-weight:900;">撤销</button>':'';return '<div style="display:grid;grid-template-columns:38px 1fr auto;align-items:center;gap:10px;padding:11px 0;border-bottom:1px solid var(--line);"><span class="merchant-member-avatar" style="width:38px;height:38px;background:var(--bg-alt);color:var(--sage-dark);">'+(avatar?'<img src="'+escAttr(avatar)+'" alt="">':escHtml(initials(name)))+'</span><div style="min-width:0;"><b style="display:block;font-size:13px;">'+escHtml(name)+'</b><small style="display:block;margin-top:3px;color:var(--ink-faint);">'+escHtml(merchantMatrixRolesText(row.roles,row.role))+' · '+status+'</small></div><div style="display:flex;gap:6px;">'+details+actions+'</div></div>';}).join('')||'<div class="deals-empty-panel" style="margin:12px 0 0;">还没有矩阵账号。</div>';
    body.innerHTML='<div class="merchant-dash-card" style="box-shadow:none;"><b style="font-size:16px;">邀请矩阵账号</b><p style="font-size:12px;line-height:1.6;color:var(--ink-faint);margin:7px 0 12px;">成员用自己的乐生活账号接受邀请后，只能进入你分配的工作区；不会共享商家密码。</p><div class="merchant-checkin-form"><input id="merchantMatrixSearch" placeholder="输入乐生活昵称搜索" oninput="searchMerchantMatrixPeople(this.value)" autocomplete="off"><button onclick="searchMerchantMatrixPeople(document.getElementById(&quot;merchantMatrixSearch&quot;).value)">搜索</button></div><div id="merchantMatrixPeople" style="margin-top:8px;"></div><div style="margin-top:12px;padding:10px;border-radius:9px;background:var(--bg-alt);font-size:12px;">已选择：<b id="merchantMatrixSelected">'+escHtml(selectedName)+'</b></div>'+merchantStaffAccessPickerHtml('merchantInvite',window._merchantMatrixInviteRoles||[],window._merchantMatrixInvitePermissions||[])+'<button class="merchant-reward-redeem-btn" style="margin:12px 0 0;" onclick="inviteMerchantMatrixMember()">发送授权邀请</button></div><div style="font-size:14px;font-weight:900;margin:18px 0 6px;">团队成员</div>'+members;
    renderMerchantMatrixPeople();
  }catch(error){console.warn('商家团队读取失败:',error.message);body.innerHTML='<div class="deals-empty-panel">团队功能暂时无法读取，请稍后重试。</div>';}
}
function editMerchantMatrixMemberAccess(id){window._merchantMatrixEditingId=Number(id);renderMerchantTeamManager();}
function closeMerchantMatrixMemberAccess(){window._merchantMatrixEditingId=null;renderMerchantTeamManager();}
async function saveMerchantMatrixMemberAccess(id){const roles=merchantStaffPickerValues('merchantEdit'+Number(id),'role'),permissions=merchantStaffPickerValues('merchantEdit'+Number(id),'permission');if(!roles.length){showToast('请至少选择一个岗位');return;}try{if(!merchantTeamApi)throw new Error('商家团队接口未初始化');await merchantTeamApi.updateAccess({id,roles,permissions});window._merchantMatrixEditingId=null;showToast('员工权限已更新');renderMerchantTeamManager();}catch(error){console.warn('权限更新失败:',error.message);showToast('权限更新失败');}}
async function inviteMerchantMatrixMember(){const roles=merchantStaffPickerValues('merchantInvite','role'),permissions=merchantStaffPickerValues('merchantInvite','permission');if(!merchantMatrixSelectedPerson){showToast('请先搜索并选择一个乐生活用户');return;}if(!roles.length){showToast('请至少选择一个岗位');return;}try{if(!merchantTeamApi)throw new Error('商家团队接口未初始化');await merchantTeamApi.invite({userId:merchantMatrixSelectedPerson.user_id,roles,permissions});merchantMatrixSelectedPerson=null;merchantMatrixPeople=[];showToast('授权邀请已发送，等待对方确认');renderMerchantTeamManager();}catch(error){console.warn('矩阵邀请失败:',error.message);showToast('邀请失败，请确认对方已完成注册');}}

async function openMerchantOrderManager(merchantUserId){
  const id=merchantUserId||merchantOrderManagerMerchantId();
  if(!id||!merchantWorkspaceCanEnterOrderBackend()){showToast('你没有这家商店的点餐后台权限');return;}
  const sheet=document.getElementById('merchantOrderManager');if(!sheet)return;
  sheet.dataset.merchantUserId=id;sheet.dataset.orderType='dinein';document.getElementById('merchantOrderManagerTitle').textContent='扫码点餐';sheet.classList.add('open');startMerchantOrderAutoRefresh('manager');await renderMerchantOrderManager();
}
async function openMerchantTakeoutManager(merchantUserId){
  const id=merchantUserId||merchantOrderManagerMerchantId();
  if(!id||!merchantWorkspaceCanEnterOrderBackend()){showToast('你没有这家商店的点餐后台权限');return;}
  const sheet=document.getElementById('merchantOrderManager');if(!sheet)return;
  sheet.dataset.merchantUserId=id;sheet.dataset.orderType='takeout';document.getElementById('merchantOrderManagerTitle').textContent='外卖订单';sheet.classList.add('open');startMerchantOrderAutoRefresh('manager');await renderMerchantOrderManager();
}
async function openMerchantQueueManager(merchantUserId){
  const id=merchantUserId||merchantOrderManagerMerchantId();
  if(!id||!merchantWorkspaceCanEnterOrderBackend()){showToast('你没有这家商店的点餐后台权限');return;}
  const sheet=document.getElementById('merchantOrderManager');if(!sheet)return;
  sheet.dataset.merchantUserId=id;sheet.dataset.orderType='queue';document.getElementById('merchantOrderManagerTitle').textContent='扫码排队';sheet.classList.add('open');await renderMerchantQueueManager();
}
async function renderMerchantQueueManager(){
  const body=document.getElementById('merchantOrderManagerBody'),merchantUserId=document.getElementById('merchantOrderManager')?.dataset.merchantUserId||merchantOrderManagerMerchantId();
  if(!body||!merchantUserId)return;body.innerHTML='<div class="deals-empty-panel">正在读取排队信息...</div>';
  try{
    const [merchant,res]=await Promise.all([getMerchantOrderMerchant(merchantUserId),authedFetch(`${SUPABASE_URL}/rest/v1/rpc/merchant_waitlist_manager_list`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({p_merchant_user_id:merchantUserId})})]);
    if(!res.ok)throw new Error(await res.text());
    const rows=await res.json(),queued=rows.filter(row=>row.status==='queued'),finished=rows.filter(row=>row.status!=='queued'),url=merchantQueueUrl(merchant);
    body.innerHTML=`<div class="merchant-table-card" style="margin-bottom:12px;justify-content:center;"><div class="merchant-table-qr">${memberCardQrHtml(url)}</div><div style="display:grid;gap:8px;"><button onclick="renderMerchantQueueManager()">生成二维码</button><button onclick="saveMerchantQueueQrImage('${escAttr(url).replace(/'/g,"\\'")}')">保存二维码</button></div></div><div class="merchant-order-top-actions"><button onclick="renderMerchantQueueManager()">${uiIcon('refresh',17)} 刷新排队</button></div><div class="order-notice">扫码可直接排队。公开页只显示人数与编号；姓名、电话、预点菜仅供店内管理。</div><div class="merchant-order-status-tabs"><button class="on">排队中 (${queued.length})</button><button onclick="this.closest('#merchantOrderManagerBody').querySelectorAll('.merchant-waitlist-finished').forEach(el=>el.hidden=!el.hidden)">已处理 (${finished.length})</button></div>${queued.length?queued.map(merchantWaitlistCardHtml).join(''):'<div class="deals-empty-panel">目前没有排队中的顾客。</div>'}${finished.length?`<div class="merchant-waitlist-finished" hidden>${finished.map(merchantWaitlistCardHtml).join('')}</div>`:''}`;
  }catch(error){console.warn('排队管理读取失败:',error.message);body.innerHTML='<div class="deals-empty-panel">排队信息暂时无法读取，请确认已运行 v5.317 数据库更新。</div>';}
}
function merchantWaitlistCardHtml(row){
  const status={queued:'排队中',seated:'已入座',cancelled:'已取消',expired:'已过期'}[row.status]||row.status;
  const preorder=Array.isArray(row.preorder_items)?row.preorder_items:[];
  return `<div class="merchant-order-card"><div class="merchant-order-card-head"><div><b>${Number(row.party_size||0)} 人 · ${escHtml(row.queue_code||'')}</b><span>${escHtml(row.customer_name||'')} · ${escHtml(row.customer_phone||'')} · ${row.created_at?new Date(row.created_at).toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'}):''}</span></div><i class="merchant-order-state">${status}</i></div><div style="font-size:12px;color:var(--ink-soft);">排队序号 ${Number(row.queue_number||0)} · 预计等待 ${Number(row.estimated_wait_minutes||0)} 分钟${preorder.length?` · 已预点 ${preorder.length} 种菜品`:''}</div>${row.status==='queued'?`<div class="merchant-order-card-actions"><button class="primary" onclick="setMerchantWaitlistStatus('${String(row.id)}','seated')">安排入座</button><button onclick="setMerchantWaitlistStatus('${String(row.id)}','cancelled')">取消排队</button></div>`:''}</div>`;
}
async function setMerchantWaitlistStatus(id,status){
  try{const res=await authedFetch(`${SUPABASE_URL}/rest/v1/rpc/merchant_waitlist_set_status`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({p_waitlist_id:id,p_status:status,p_table_id:null})});if(!res.ok)throw new Error(await res.text());showToast(status==='seated'?'已安排入座':'已取消排队');renderMerchantQueueManager();}catch(error){showToast('更新排队状态失败，请稍后重试');}
}
async function saveMerchantQrPng(svg,filename){
  const sourceBlob=new Blob([svg],{type:'image/svg+xml'}),sourceUrl=URL.createObjectURL(sourceBlob),image=new Image();
  image.onload=()=>{const canvas=document.createElement('canvas'),size=1600,ctx=canvas.getContext('2d');canvas.width=size;canvas.height=size;ctx.fillStyle='#fff';ctx.fillRect(0,0,size,size);ctx.drawImage(image,160,160,1280,1280);URL.revokeObjectURL(sourceUrl);canvas.toBlob(async file=>{if(!file){showToast('二维码保存失败');return;}const imageFile=new File([file],filename,{type:'image/png'});try{if(navigator.canShare&&navigator.canShare({files:[imageFile]})){await navigator.share({title:'乐生活二维码',files:[imageFile]});showToast('已打开系统分享，可保存到相册或打印');return;}}catch(error){if(error?.name==='AbortError')return;console.warn('系统分享二维码失败:',error.message);}const link=document.createElement('a'),fileUrl=URL.createObjectURL(file);link.href=fileUrl;link.download=filename;link.style.display='none';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(fileUrl),1500);showToast('二维码图片已下载，可保存或打印');},'image/png');};
  image.onerror=()=>{URL.revokeObjectURL(sourceUrl);showToast('二维码生成失败，请重试');};image.src=sourceUrl;
}
function saveMerchantQueueQrImage(url){ return saveMerchantQrPng(memberCardQrHtml(url),'乐生活-扫码排队二维码.png'); }
function merchantOrderManagerStatus(status){merchantOrderState().managerStatus=status||'processing';renderMerchantOrderManager();}
async function renderMerchantOrderManager(silent){
  const body=document.getElementById('merchantOrderManagerBody'),merchantUserId=document.getElementById('merchantOrderManager')?.dataset.merchantUserId||merchantOrderManagerMerchantId();if(!body||!merchantUserId)return;if(!silent)body.innerHTML='<div class="deals-empty-panel">正在读取订单...</div>';
  try{
    const [merchant,tables,orders]=await Promise.all([getMerchantOrderMerchant(merchantUserId),loadMerchantOrderTables(merchantUserId,true),(async()=>{const res=await authedFetch(`${SUPABASE_URL}/rest/v1/merchant_orders?merchant_user_id=eq.${encodeURIComponent(merchantUserId)}&select=*&order=updated_at.desc&limit=100`,{method:'GET'});if(!res.ok)throw new Error(await res.text());return await res.json();})()]);const orderType=document.getElementById('merchantOrderManager')?.dataset.orderType||'dinein',scopedOrders=orders.filter(order=>orderType==='takeout'?order.order_type==='takeout':order.order_type!=='takeout'),ids=scopedOrders.map(row=>row.id).filter(Boolean);let items=[];if(ids.length){const res=await authedFetch(`${SUPABASE_URL}/rest/v1/merchant_order_items?order_id=in.(${ids.map(encodeURIComponent).join(',')})&select=*&order=batch_no.asc,created_at.asc`,{method:'GET'});if(res.ok)items=await res.json();}
    Object.assign(merchantOrderState(),{merchant,tables,orders:scopedOrders,items});const status=merchantOrderState().managerStatus||'processing',statusMatch={processing:row=>['pending','confirmed','preparing','served'].includes(row.status),reminded:row=>row.status==='reminded',completed:row=>row.status==='completed'},list=scopedOrders.filter(statusMatch[status]||statusMatch.processing).sort((a,b)=>merchantOrderLastActivity(a,items)-merchantOrderLastActivity(b,items)),tabs=[['processing','处理中'],['reminded','催菜中'],['completed','已完成']],actions=[];
    actions.push(`<button class="primary" onclick="openMerchantKitchenDisplay('${String(merchantUserId).replace(/'/g,'')}')">${uiIcon('bag',17)} 后厨订单屏</button>`);actions.push(`<button onclick="openMerchantRunnerDisplay('${String(merchantUserId).replace(/'/g,'')}')">传菜上桌</button>`);actions.push(`<button onclick="openMerchantMemberManager('${String(merchantUserId).replace(/'/g,'')}')">会员与优惠核销</button>`);actions.push(`<button onclick="openMerchantTableManager()">${uiIcon('store',17)} 餐桌二维码</button>`);actions.push(`<button onclick="openMerchantOrderCheckoutSettings()">${uiIcon('settings',17)} 结算设置</button>`);actions.push(`<button onclick="renderMerchantOrderManager()">${uiIcon('refresh',17)} 刷新订单</button>`);
    body.innerHTML=`${orderType==='takeout'?merchantTakeoutOrderQrHtml(merchant):''}<div class="merchant-order-top-actions">${actions.join('')}</div><div class="order-notice">${escHtml(merchant&&merchant.business_name||'商家')} · ${orderType==='takeout'?'外卖订单':'餐桌订单'}每 3 分钟自动刷新；不同岗位只显示其授权操作。</div><div class="merchant-order-status-tabs">${tabs.map(row=>`<button class="${status===row[0]?'on':''}" onclick="merchantOrderManagerStatus('${row[0]}')">${row[1]} (${scopedOrders.filter(statusMatch[row[0]]).length})</button>`).join('')}</div>${list.length?list.map(order=>merchantOrderCardHtml(order,items.filter(item=>String(item.order_id)===String(order.id)))).join(''):'<div class="deals-empty-panel">这里暂时没有订单。</div>'}`;
  }catch(error){console.warn('订单管理读取失败:',error.message);if(!silent)body.innerHTML='<div class="deals-empty-panel">订单读取失败，请稍后重试。</div>';}
}
function merchantTakeoutOrderQrHtml(merchant){
  const url=merchantTakeoutUrl(merchant);
  return `<div class="merchant-table-card" style="margin-bottom:12px;justify-content:center;"><div class="merchant-table-qr" id="merchantTakeoutQrCode">${memberCardQrHtml(url)}</div><div style="display:grid;gap:8px;"><button onclick="renderMerchantOrderManager(true)">生成二维码</button><button onclick="saveMerchantTakeoutQrImage('${escAttr(url).replace(/'/g,"\\'")}')">保存二维码</button></div></div>`;
}
function saveMerchantTakeoutQrImage(url){ return saveMerchantQrPng(memberCardQrHtml(url),'乐生活-外卖点单二维码.png'); }
function merchantOrderBatchHtml(items,manager){
  let lastBatch=null;const canServe=!!manager&&merchantWorkspaceHasPermission('order_serve');
  // 同一秒创建的菜品也按编号排序，刷新后不会改变行位置。
  const orderedItems=[...(items||[])].sort((a,b)=>Number(a.batch_no||1)-Number(b.batch_no||1)||new Date(a.created_at||0)-new Date(b.created_at||0)||Number(a.id||0)-Number(b.id||0));
  return orderedItems.map(item=>{const batch=Number(item.batch_no||1),divider=batch!==lastBatch?`<div style="margin:${lastBatch===null?'0 0 7px':'12px 0 7px'};padding-top:${lastBatch===null?'0':'10px'};border-top:${lastBatch===null?'0':'1px dashed var(--line)'};font-size:11px;font-weight:900;color:${batch>1?'var(--berry)':'var(--ink-faint)'};">${batch>1?`新加菜 · 第 ${batch-1} 次追加`:'首次点单'}</div>`:'';lastBatch=batch;const served=item.is_served===true,ready=!!item.kitchen_done,canLink=canServe&&merchantWorkspaceCanLinkKitchenServe(),serveAction=served?`<button onclick="setMerchantOrderItemServed(${Number(item.id)},false)" style="border:0;border-radius:8px;padding:6px 8px;font:800 11px inherit;color:#fff;background:var(--sage);white-space:nowrap;">已上桌 · 撤回</button>`:ready?`<button onclick="setMerchantOrderItemServed(${Number(item.id)},true)" style="border:0;border-radius:8px;padding:6px 8px;font:800 11px inherit;color:#fff;background:var(--berry);white-space:nowrap;">上桌</button>`:canLink?`<button onclick="setMerchantOrderItemServed(${Number(item.id)},true)" style="border:0;border-radius:8px;padding:6px 8px;font:800 11px inherit;color:#fff;background:var(--berry);white-space:nowrap;">上桌 · 同步完成</button>`:`<button disabled style="border:1px solid var(--line);border-radius:8px;padding:6px 8px;font:800 11px inherit;color:var(--ink-faint);background:var(--bg-alt);white-space:nowrap;cursor:not-allowed;">待后厨完成</button>`;return `${divider}<div class="merchant-order-line" style="align-items:center;gap:8px;"><span style="flex:1;${served?'color:var(--ink-faint);text-decoration:line-through;':''}">${escHtml(item.product_name)} × ${Number(item.quantity||0)}${ready&&!served?' <small style="color:var(--sage-dark);">已完成制作</small>':''}</span><b style="white-space:nowrap;">${merchantOrderMoney(Number(item.unit_price||0)*Number(item.quantity||0))}</b>${serveAction}</div>`;}).join('');
}
/* Removed overridden merchantOrderCardHtml implementation during v5.510 cleanup. */

async function setMerchantOrderItemServed(itemId,isServed){
  if(!merchantWorkspaceHasPermission('order_serve')){showToast('你没有传菜上桌权限');return;}
  try{const linked=isServed&&merchantWorkspaceCanLinkKitchenServe();await restaurantOrderApi.setItemServed(itemId,isServed);showToast(linked?'已上桌，并同步完成制作':isServed?'已标记上桌':'已撤回上桌状态，并同步恢复待制作');if(document.getElementById('merchantRunnerDisplay')?.classList.contains('open'))renderMerchantRunnerDisplay(true);if(document.getElementById('merchantKitchenDisplay')?.classList.contains('open'))renderMerchantKitchenDisplay(true);renderMerchantOrderManager(true);}catch(error){console.warn('更新上桌状态失败:',error.message);showToast('更新失败，请确认传菜权限与后厨状态');}
}
/* Removed overridden openMerchantMemberManager implementation during v5.510 cleanup. */


let merchantProductCropState = {
  img:null,
  dataUrl:'',
  mode:'product',
  zoom:1,
  x:0,
  y:0,
  dragging:false,
  startX:0,
  startY:0,
  originX:0,
  originY:0
};
function onMerchantItemImageSelected(event){
  const file = event.target.files && event.target.files[0];
  event.target.value = '';
  if(!file || !file.type || !file.type.startsWith('image/')){ showToast('请选择图片文件'); return; }
  const reader = new FileReader();
  reader.onload = ev => {
    const img = new Image();
    img.onload = () => openMerchantProductCropper(img, ev.target.result);
    img.onerror = () => showToast('图片读取失败，请换一张试试');
    img.src = ev.target.result;
  };
  reader.onerror = () => showToast('图片读取失败，请换一张试试');
  reader.readAsDataURL(file);
}
function openMerchantProductCropper(img, dataUrl){
  const mode = (window._merchantItemEditor && window._merchantItemEditor.type === 'coupon') ? 'coupon' : 'product';
  merchantProductCropState = {
    img,
    dataUrl,
    mode,
    zoom:1,
    x:0,
    y:0,
    dragging:false,
    startX:0,
    startY:0,
    originX:0,
    originY:0
  };
  const cropImg = document.getElementById('merchantProductCropImage');
  const frame = document.getElementById('merchantProductCropFrame');
  const zoom = document.getElementById('merchantProductZoomRange');
  if(cropImg) cropImg.src = dataUrl;
  if(frame) frame.classList.toggle('wide', mode === 'coupon');
  if(zoom) zoom.value = '1';
  document.getElementById('merchantProductCropper')?.classList.add('open');
  requestAnimationFrame(() => {
    bindMerchantProductCropDrag();
    renderMerchantProductCropper();
  });
}
function closeMerchantProductCropper(){
  document.getElementById('merchantProductCropper')?.classList.remove('open');
  merchantProductCropState.dragging = false;
}
function merchantProductCropMetrics(){
  const frame = document.getElementById('merchantProductCropFrame');
  const img = merchantProductCropState.img;
  const width = frame ? frame.clientWidth : 320;
  const height = frame ? frame.clientHeight : (merchantProductCropState.mode === 'coupon' ? Math.round(width / 3) : width);
  if(!img || !img.width || !img.height) return null;
  const baseScale = Math.max(width / img.width, height / img.height);
  const scale = baseScale * merchantProductCropState.zoom;
  const dispW = img.width * scale;
  const dispH = img.height * scale;
  return { width, height, scale, dispW, dispH, size:width };
}
function clampMerchantProductCrop(){
  const m = merchantProductCropMetrics();
  if(!m) return;
  const maxX = Math.max(0, (m.dispW - m.width) / 2);
  const maxY = Math.max(0, (m.dispH - m.height) / 2);
  merchantProductCropState.x = Math.min(maxX, Math.max(-maxX, merchantProductCropState.x));
  merchantProductCropState.y = Math.min(maxY, Math.max(-maxY, merchantProductCropState.y));
}
function renderMerchantProductCropper(){
  const cropImg = document.getElementById('merchantProductCropImage');
  const m = merchantProductCropMetrics();
  if(!cropImg || !m) return;
  clampMerchantProductCrop();
  cropImg.style.width = `${m.dispW}px`;
  cropImg.style.height = `${m.dispH}px`;
  cropImg.style.left = `calc(50% + ${merchantProductCropState.x}px)`;
  cropImg.style.top = `calc(50% + ${merchantProductCropState.y}px)`;
}
function setMerchantProductCropZoom(value){
  const prev = merchantProductCropState.zoom || 1;
  merchantProductCropState.zoom = Math.max(1, Math.min(3, parseFloat(value) || 1));
  if(prev !== merchantProductCropState.zoom){
    merchantProductCropState.x *= merchantProductCropState.zoom / prev;
    merchantProductCropState.y *= merchantProductCropState.zoom / prev;
  }
  renderMerchantProductCropper();
}
function bindMerchantProductCropDrag(){
  const frame = document.getElementById('merchantProductCropFrame');
  if(!frame || frame.dataset.bound === '1') return;
  frame.dataset.bound = '1';
  const startDragAt = (clientX, clientY) => {
    if(!merchantProductCropState.img) return;
    merchantProductCropState.dragging = true;
    merchantProductCropState.startX = clientX;
    merchantProductCropState.startY = clientY;
    merchantProductCropState.originX = merchantProductCropState.x;
    merchantProductCropState.originY = merchantProductCropState.y;
    frame.classList.add('dragging');
  };
  const moveDragTo = (clientX, clientY) => {
    if(!merchantProductCropState.dragging) return;
    merchantProductCropState.x = merchantProductCropState.originX + (clientX - merchantProductCropState.startX);
    merchantProductCropState.y = merchantProductCropState.originY + (clientY - merchantProductCropState.startY);
    renderMerchantProductCropper();
  };
  const endDrag = e => {
    merchantProductCropState.dragging = false;
    frame.classList.remove('dragging');
    if(e && e.pointerId != null){ try { frame.releasePointerCapture(e.pointerId); } catch(err){} }
  };
  frame.addEventListener('pointerdown', e => {
    startDragAt(e.clientX, e.clientY);
    if(e.pointerId != null){ try { frame.setPointerCapture(e.pointerId); } catch(err){} }
  });
  frame.addEventListener('pointermove', e => moveDragTo(e.clientX, e.clientY));
  frame.addEventListener('pointerup', endDrag);
  frame.addEventListener('pointercancel', endDrag);
  frame.addEventListener('touchstart', e => {
    const t = e.touches && e.touches[0];
    if(!t) return;
    e.preventDefault();
    startDragAt(t.clientX, t.clientY);
  }, { passive:false });
  frame.addEventListener('touchmove', e => {
    const t = e.touches && e.touches[0];
    if(!t) return;
    e.preventDefault();
    moveDragTo(t.clientX, t.clientY);
  }, { passive:false });
  frame.addEventListener('touchend', endDrag);
  frame.addEventListener('touchcancel', endDrag);
  window.addEventListener('resize', () => {
    if(document.getElementById('merchantProductCropper')?.classList.contains('open')) renderMerchantProductCropper();
  });
}
function confirmMerchantProductCrop(){
  const img = merchantProductCropState.img;
  const m = merchantProductCropMetrics();
  if(!img || !m){ showToast('请先选择图片'); return; }
  const isCoupon = merchantProductCropState.mode === 'coupon';
  const outputW = isCoupon ? 960 : 640;
  const outputH = isCoupon ? 320 : 640;
  const left = m.width / 2 + merchantProductCropState.x - m.dispW / 2;
  const top = m.height / 2 + merchantProductCropState.y - m.dispH / 2;
  const sx = (0 - left) / m.scale;
  const sy = (0 - top) / m.scale;
  const sw = m.width / m.scale;
  const sh = m.height / m.scale;
  const canvas = document.createElement('canvas');
  canvas.width = outputW;
  canvas.height = outputH;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, outputW, outputH);
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outputW, outputH);
  window._merchantItemEditor = window._merchantItemEditor || {};
  window._merchantItemEditor.image = canvas.toDataURL('image/jpeg', 0.78);
  closeMerchantProductCropper();
  refreshMerchantItemImagePreview();
}
const MERCHANT_SLUG_MIN_LENGTH = 3;
const MERCHANT_SLUG_MAX_LENGTH = 48;
const MERCHANT_RESERVED_SLUGS = new Set([
  'm','app','api','admin','index','index-html','app-html','404','404-html','version-json',
  'versions','assets','favicon','favicon-ico','robots-txt','sitemap-xml','supabase','auth',
  'login','search','home','week','deals','message','messages','profile','merchant','merchants',
  'restaurant','rental','autos','shop','shipping'
]);
const MARKET_OPTIONS = [
  ['la','洛杉矶 LA','洛杉磯 LA','Los Angeles (LA)'],['sgv','圣盖博谷 SGV','聖蓋博谷 SGV','San Gabriel Valley (SGV)'],['oc','橙县 OC','橙縣 OC','Orange County (OC)'],['ie','内陆帝国 IE','內陸帝國 IE','Inland Empire (IE)'],['sd','圣地亚哥 SD','聖地亞哥 SD','San Diego (SD)'],
  ['sf','旧金山湾区 SF','舊金山灣區 SF','San Francisco Bay Area (SF)'],['lv','拉斯维加斯 LV','拉斯維加斯 LV','Las Vegas (LV)'],['nyc','纽约 NYC','紐約 NYC','New York City (NYC)'],['sea','西雅图 SEA','西雅圖 SEA','Seattle (SEA)'],['other','其他地区','其他地區','Other region']
];
/* 个人资料只使用大区；门店仍可保留更细的服务区域选择。 */
const USER_MARKET_OPTIONS = [
  ['la','大洛杉矶（LA）','大洛杉磯（LA）','Los Angeles（LA）'],
  ['sf','湾区（SF）','灣區（SF）','San Francisco Bay Area（SF）'],
  ['sd','圣地亚哥（SD）','聖地牙哥（SD）','San Diego（SD）'],
  ['lv','拉斯维加斯（LV）','拉斯維加斯（LV）','Las Vegas（LV）'],
  ['sea','西雅图（SEA）','西雅圖（SEA）','Seattle（SEA）'],
  ['nyc','纽约（NYC）','紐約（NYC）','New York City（NYC）']
];
const USER_MARKET_ALIASES = { sgv:'la', oc:'la', ie:'la' };
function normalizeMarketCode(value){
  const code = String(value || '').trim().toLowerCase();
  return MARKET_OPTIONS.some(row => row[0] === code) ? code : 'la';
}
function normalizeUserMarketCode(value){
  const rawCode = String(value || '').trim().toLowerCase();
  const code = USER_MARKET_ALIASES[rawCode] || rawCode;
  return USER_MARKET_OPTIONS.some(row => row[0] === code) ? code : 'la';
}
function marketSelectOptions(value){
  const selected = normalizeMarketCode(value);
  const language = window.LeshenghuoI18n?.getLanguage?.() || localStorage.getItem('leshenghuo_language') || 'zh-CN';
  const labelIndex = language === 'en' ? 3 : (language === 'zh-TW' ? 2 : 1);
  return MARKET_OPTIONS.map(row => `<option value="${row[0]}" ${row[0] === selected ? 'selected' : ''}>${row[labelIndex]}</option>`).join('');
}
function userMarketSelectOptions(value){
  const selected = normalizeUserMarketCode(value);
  const language = window.LeshenghuoI18n?.getLanguage?.() || localStorage.getItem('leshenghuo_language') || 'zh-CN';
  const labelIndex = language === 'en' ? 3 : (language === 'zh-TW' ? 2 : 1);
  return USER_MARKET_OPTIONS.map(row => `<option value="${row[0]}" ${row[0] === selected ? 'selected' : ''}>${row[labelIndex]}</option>`).join('');
}
function merchantMarketCode(m){ return normalizeMarketCode(m && m.market_code); }
let merchantSlugCheckTimer = null;
let merchantSlugCheckState = { slug:'', available:false };
function normalizeMerchantSlug(value){
  const raw = String(value || '').trim().toLowerCase();
  const ascii = raw
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, MERCHANT_SLUG_MAX_LENGTH);
  return ascii;
}
function merchantSlugify(value, fallback){
  return normalizeMerchantSlug(value) || normalizeMerchantSlug(fallback) || `merchant-${Date.now().toString(36)}`;
}
function merchantSlugCooldownDays(m, nextSlug){
  const previous = normalizeMerchantSlug(m && m.slug);
  if(!previous || previous === nextSlug || !(m && m.slug_changed_at)) return 0;
  const unlockAt = new Date(m.slug_changed_at).getTime() + 365 * 24 * 60 * 60 * 1000;
  const remaining = unlockAt - Date.now();
  return remaining > 0 ? Math.ceil(remaining / (24 * 60 * 60 * 1000)) : 0;
}
function merchantSlugInputMessage(slug){
  if(!slug) return '请输入英文、数字或短横线组成的地址。';
  if(slug.length < MERCHANT_SLUG_MIN_LENGTH) return `地址至少需要 ${MERCHANT_SLUG_MIN_LENGTH} 个字符。`;
  if(MERCHANT_RESERVED_SLUGS.has(slug)) return '这个地址为系统保留地址，请换一个。';
  return '';
}
function setMerchantSlugStatus(message, tone){
  const el = document.getElementById('mBizSlugStatus');
  if(!el) return;
  const colors = { good:'var(--sage-dark)', warn:'var(--berry-dark)', muted:'var(--ink-faint)' };
  el.textContent = message || '';
  el.style.color = colors[tone] || colors.muted;
}
async function checkMerchantSlugAvailability(silent){
  const input = document.getElementById('mBizSlug');
  if(!input) return { available:false, slug:'' };
  const slug = normalizeMerchantSlug(input.value);
  if(input.value !== slug) input.value = slug;
  const inputMessage = merchantSlugInputMessage(slug);
  merchantSlugCheckState = { slug, available:false };
  if(inputMessage){
    if(!silent) setMerchantSlugStatus(inputMessage, 'warn');
    return merchantSlugCheckState;
  }
  const cooldownDays = merchantSlugCooldownDays(currentMerchant, slug);
  if(cooldownDays){
    const message = `链接每 365 天只能修改一次；还需 ${cooldownDays} 天后可以更改。`;
    if(!silent) setMerchantSlugStatus(message, 'warn');
    return merchantSlugCheckState;
  }
  if(slug === normalizeMerchantSlug(currentMerchant && currentMerchant.slug)){
    merchantSlugCheckState = { slug, available:true };
    if(!silent) setMerchantSlugStatus('当前正在使用这个链接。', 'muted');
    return merchantSlugCheckState;
  }
  if(!silent) setMerchantSlugStatus('正在检查链接是否可用…', 'muted');
  try {
    if(!merchantPublicApi) throw new Error('商家资料接口未初始化');
    const taken = await merchantPublicApi.isSlugTaken({ slug, marketCode:normalizeMarketCode(document.getElementById('mBizMarket')?.value || currentMerchant?.market_code), excludeUserId:session && session.user ? session.user.id : '' });
    const available = !taken;
    merchantSlugCheckState = { slug, available };
    if(!silent) setMerchantSlugStatus(available ? '这个链接可以使用。' : '这个链接已经被其他商家使用。', available ? 'good' : 'warn');
    return merchantSlugCheckState;
  } catch(e){
    console.warn('商家链接检查失败:', e.message);
    if(!silent) setMerchantSlugStatus('暂时无法检查链接，请稍后再试。', 'warn');
    return merchantSlugCheckState;
  }
}
async function merchantBusinessNameAvailable(name, marketCode){
  const normalized = String(name || '').trim();
  const currentName = String(currentMerchant?.business_name || '').trim();
  if(!normalized || normalized === currentName) return true;
  if(!merchantPublicApi) return false;
  return !(await merchantPublicApi.isBusinessNameTaken({
    businessName: normalized,
    marketCode: normalizeMarketCode(marketCode),
    excludeUserId: session?.user?.id || ''
  }));
}
function scheduleMerchantSlugCheck(){
  clearTimeout(merchantSlugCheckTimer);
  merchantSlugCheckTimer = setTimeout(() => checkMerchantSlugAvailability(false), 360);
}
function merchantSiteSlug(m){
  if(!m) return '';
  return merchantSlugify(m.slug || m.business_name || m.user_id, m.user_id);
}
function merchantSiteUrl(m){
  const slug = merchantSiteSlug(m);
  const market = merchantMarketCode(m);
  try {
    return `${window.location.origin}/${encodeURIComponent(market)}/merchant/${encodeURIComponent(slug)}`;
  } catch(e){
    return `/${encodeURIComponent(market)}/merchant/${encodeURIComponent(slug)}`;
  }
}
function merchantSocialLinks(m){
  const links = [];
  const platformLabel = url => {
    const u = String(url || '').toLowerCase();
    if(u.includes('instagram.com')) return 'Instagram';
    if(u.includes('xiaohongshu.com') || u.includes('xhslink.com')) return '小红书';
    if(u.includes('facebook.com') || u.includes('fb.com')) return 'Facebook';
    if(u.includes('yelp.com')) return 'Yelp';
    if(u.includes('google.com') || u.includes('goo.gl/maps') || u.includes('maps.app.goo.gl')) return 'Google';
    if(u.includes('youtube.com') || u.includes('youtu.be')) return 'YouTube';
    return '官网';
  };
  const source = m && m.external_links;
  if(source && typeof source === 'object' && !Array.isArray(source)){
    Object.entries(source).forEach(([label, url]) => {
      if(url && !String(url).toLowerCase().includes('tiktok.com')) links.push({ label: label || platformLabel(url), url });
    });
  } else if(typeof source === 'string'){
    source.split(/\n|,/).map(s => s.trim()).filter(url => url && !url.toLowerCase().includes('tiktok.com')).forEach(url => links.push({ label:platformLabel(url), url }));
  } else if(Array.isArray(source)){
    source.map(s => String(s || '').trim()).filter(url => url && !url.toLowerCase().includes('tiktok.com')).forEach(url => links.push({ label:platformLabel(url), url }));
  }
  if(m && m.website_url) links.unshift({ label:'官网', url:m.website_url });
  return links.slice(0, 5);
}
function copyMerchantSiteLink(userId){
  const m = (currentMerchant && currentMerchant.user_id === userId) ? currentMerchant : window._merchantIdentityCache[userId];
  const url = merchantSiteUrl(m || { user_id:userId, slug:userId });
  if(navigator.clipboard){
    navigator.clipboard.writeText(url).then(() => showToast('商家微网站链接已复制')).catch(() => showToast(url));
  } else {
    showToast(url);
  }
}
function shareMerchantSiteLink(userId){
  const m = (currentMerchant && currentMerchant.user_id === userId) ? currentMerchant : window._merchantIdentityCache[userId];
  openShareSheet({ type:'merchant', title:(m && m.business_name) || '乐生活商家主页', text:(m && (m.intro || m.address)) || '发现身边的精彩生活', url:merchantSiteUrl(m || { user_id:userId, slug:userId }), image:m && (m.logo || m.cover_image) });
}
function userProfileShareUrl(userId){
  return `${window.location.origin}/?user=${encodeURIComponent(userId)}`;
}
function sharePublicUserPage(userId, fallbackName){
  if(!userId){ showToast('用户主页链接暂时不可用'); return; }
  const profile = cachedProfile(userId, fallbackName || '乐生活用户');
  const name = profile.name || fallbackName || '乐生活用户';
  closePublicProfileMenu();
  openShareSheet({
    type:'user',
    title:name,
    text:profile.bio || '这个用户正在乐生活分享身边的精彩生活。',
    url:userProfileShareUrl(userId),
    image:profile.avatar || resolveAvatarUrl(userId)
  });
}
function shareMyProfile(){
  if(!(session && session.user)){ showToast('登录后即可分享个人主页'); openAuth('login'); return; }
  sharePublicUserPage(session.user.id, currentUser && currentUser.name);
}
function shareCurrentMerchantPublicPage(){
  const userId = document.getElementById('merchantPublicOverlay')?.dataset.userId || '';
  if(userId) shareMerchantSiteLink(userId);
  else showToast('商家链接暂时不可用');
}

let shareContext = null;
function shareFollowingPeople(){
  const me = session && session.user && session.user.id;
  if(!me) return [];
  return (window._followRows || []).filter(row => row.active && row.follower_id === me).slice(0, 8).map(row => {
    const profile = cachedProfile(row.followee_id, row.followee_name || '乐生活好友');
    return { id:row.followee_id, name:profile.name || row.followee_name || '乐生活好友' };
  });
}
function postShareUrl(p){ return `${window.location.origin}/?post=${encodeURIComponent(p.id)}`; }
function openPostShare(id){
  const p = posts.find(row => String(row.id) === String(id));
  if(!p) return;
  openShareSheet({ type:'post', postId:p.id, category:normalizeCategory(p.category), title:p.title || '乐生活笔记', text:p.excerpt || p.content || '发现身边的精彩生活', url:postShareUrl(p), image:(p.images && p.images[0]) || p.image || '' });
}
function openShareSheet(context){
  shareContext = context || null;
  const sheet = document.getElementById('shareSheet');
  if(!sheet || !shareContext) return;
  const people = shareFollowingPeople();
  const recent = people.length ? people.map(person => `<button class="share-recent-person" onclick="shareToFriend('${String(person.id).replace(/'/g,'')}','${String(person.name).replace(/'/g,'')}')"><span class="share-recent-avatar">${avatarCircleSizedHtml(person.name, person.id, 48)}</span>${escHtml(person.name)}</button>`).join('') : `<span style="font-size:12px;color:var(--ink-faint);padding:11px 4px;">关注好友后，可在这里快速私信分享。</span>`;
  const reportTarget = shareContext.type === 'post' ? `<button class="share-target" onclick="openContentReport()"><span class="share-target-icon report">${uiIcon('alert',22)}</span>举报笔记</button>` : '';
  const reduceTool = shareContext.type === 'post' && shareContext.category ? `<button class="share-tool" onclick="reduceFeedCategory('${String(shareContext.category).replace(/'/g,'')}')"><span>${uiIcon('eye',21)}</span>减少此类内容</button>` : '';
  sheet.innerHTML = `<div class="share-sheet-head">分享至<button onclick="closeShareSheet()" aria-label="关闭">×</button></div><div class="share-recent">${recent}</div><div class="share-target-grid"><button class="share-target" onclick="openShareFriendPicker()"><span class="share-target-icon dm">${uiIcon('message',22)}</span>私信好友</button><button class="share-target" onclick="shareNative('微信好友')"><span class="share-target-icon wechat">微</span>微信好友</button><button class="share-target" onclick="shareFacebook()"><span class="share-target-icon" style="background:#1877f2;color:#fff;">f</span>Facebook</button><button class="share-target" onclick="shareSms()"><span class="share-target-icon sms">${uiIcon('message',22)}</span>信息</button><button class="share-target" onclick="shareNative('更多应用')"><span class="share-target-icon">•••</span>更多应用</button><button class="share-target" onclick="generateShareImage()"><span class="share-target-icon image">${uiIcon('image',22)}</span>生成分享图</button>${reportTarget}</div><div class="share-tools"><button class="share-tool" onclick="copyCurrentShareLink()"><span>${uiIcon('share',21)}</span>复制链接</button><button class="share-tool" onclick="generateShareImage()"><span>${uiIcon('image',21)}</span>分享图片</button><button class="share-tool" onclick="shareNative('系统分享')"><span>${uiIcon('upload',21)}</span>系统分享</button>${reduceTool}</div>`;
  const overlay = document.getElementById('shareOverlay');
  if(overlay && overlay.parentElement !== document.body) document.body.appendChild(overlay);
  if(!overlay) return;
  overlay.style.zIndex = '2147483647';
  overlay.style.pointerEvents = 'auto';
  overlay.removeAttribute('inert');
  overlay.setAttribute('aria-hidden','false');
  overlay.classList.add('open');
  // Force one layout pass so mobile WebViews paint the sheet in this tap.
  void overlay.offsetHeight;
}
function closeShareSheet(){
  const overlay = document.getElementById('shareOverlay');
  if(!overlay) return;
  if(overlay.contains(document.activeElement) && document.activeElement instanceof HTMLElement){
    document.activeElement.blur();
  }
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden','true');
  overlay.setAttribute('inert','');
  overlay.style.pointerEvents = 'none';
}
function openShareFriendPicker(){
  const people = shareFollowingPeople(); const sheet = document.getElementById('shareSheet');
  if(!people.length){ showToast('先关注好友，再通过私信分享'); return; }
  sheet.innerHTML = `<div class="share-sheet-head">选择私信好友<button onclick="openShareSheet(shareContext)" aria-label="返回">‹</button></div><div class="share-picker-list">${people.map(person => `<button class="share-picker-row" onclick="shareToFriend('${String(person.id).replace(/'/g,'')}','${String(person.name).replace(/'/g,'')}')">${avatarCircleSizedHtml(person.name, person.id, 42)}<span>${escHtml(person.name)}<small>发送链接到私信</small></span></button>`).join('')}</div>`;
}
function sharedCardMessage(context){
  const title = String(context?.title || '乐生活内容').replace(/\s+/g,' ').slice(0,80);
  if(context?.type === 'post' && context?.postId != null){
    return `[[LSH_POST_CARD]]${JSON.stringify({
      postId:String(context.postId),
      title,
      image:String(context.image || '').trim()
    })}`;
  }
  const text = String(context?.text || '').replace(/\s+/g,' ').slice(0,120);
  const image = String(context?.image || '').trim();
  return `【乐生活分享】\n${title}${text ? `\n${text}` : ''}${image ? `\n【封面】${encodeURIComponent(image)}` : ''}\n${context?.url || ''}`;
}
async function shareToFriend(id, name){
  if(!(session && session.user)){ showToast('请先登录'); openAuth('login'); return; }
  if(!shareContext) return;
  const text = sharedCardMessage(shareContext);
  const sheet = document.getElementById('shareSheet');
  if(sheet) sheet.innerHTML = `<div class="share-send-status"><span class="share-send-spinner"></span><b>正在发送给 ${escHtml(name)}…</b></div>`;
  try {
    if(!messageApi) throw new Error('私信接口未初始化');
    const saved = await messageApi.send({ fromId:session.user.id, fromName:myNick(), toId:id, text });
    if(saved) dmRows.push(saved);
    if(sheet) sheet.innerHTML = `<div class="share-send-status success"><span>${uiIcon('check',30)}</span><b>已发送给 ${escHtml(name)}</b><small>可在“消息”中查看</small></div>`;
    showToast(`已发送给 ${name}`);
    setTimeout(closeShareSheet, 950);
  } catch(e){
    showToast('发送失败：' + e.message);
    openShareSheet(shareContext);
  }
}
async function copyCurrentShareLink(){ if(!shareContext) return; try { await navigator.clipboard.writeText(shareContext.url); showToast('链接已复制'); } catch(e){ showToast(shareContext.url); } }
const nativeActionRequests = new Map();
function requestNativeAction(action, payload = {}){
  if(!isEmbeddedAppEntry() || !window.parent || window.parent === window) return Promise.resolve({ handled:false, reason:'not_embedded' });
  const requestId = `native_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
  return new Promise(resolve => {
    const timeout = setTimeout(() => {
      nativeActionRequests.delete(requestId);
      resolve({ handled:false, reason:'timeout' });
    }, 12000);
    nativeActionRequests.set(requestId, { resolve, timeout });
    window.parent.postMessage({ type:'leshenghuo_native_action', requestId, action, payload }, window.location.origin);
  });
}
window.addEventListener('message', event => {
  const data = event && event.data;
  if(event.origin !== window.location.origin || !data || data.type !== 'leshenghuo_native_result' || !data.requestId) return;
  const pending = nativeActionRequests.get(data.requestId);
  if(!pending) return;
  clearTimeout(pending.timeout);
  nativeActionRequests.delete(data.requestId);
  pending.resolve(data.result || { handled:false });
});
async function shareNative(label){
  if(!shareContext) return;
  const payload = { title:shareContext.title, text:shareContext.text, url:shareContext.url, dialogTitle:label || '分享乐生活内容' };
  closeShareSheet();
  try {
    const nativeResult = await requestNativeAction('share', payload);
    if(!(nativeResult && nativeResult.handled)){
      if(navigator.share) await navigator.share(payload);
      else await copyCurrentShareLink();
    }
  } catch(e){
    // Cancelling the system share sheet is not an application error.
  } finally { closeShareSheet(); }
}
function appPermissionItem(label, detail, action, buttonLabel){
  return `<div style="padding:14px 0;border-bottom:1px solid var(--line);display:flex;gap:12px;align-items:center;"><div style="flex:1;min-width:0;"><b style="display:block;font-size:14px;">${escHtml(label)}</b><span style="display:block;margin-top:4px;font-size:12px;line-height:1.55;color:var(--ink-faint);">${escHtml(detail)}</span></div><button onclick="testNativeSystemAction('${action}')" style="flex-shrink:0;padding:8px 11px;border-radius:999px;border:1px solid var(--sage);background:#fff;color:var(--sage-dark);font:900 12px inherit;">${escHtml(buttonLabel)}</button></div>`;
}
function openAppPermissionCenter(){
  const overlay = document.getElementById('appPermissionOverlay');
  const body = document.getElementById('appPermissionBody');
  if(!overlay || !body) return;
  const inApp = isEmbeddedAppEntry() && window.parent && window.parent !== window;
  body.innerHTML = `<div class="feedback-meta">${inApp ? '权限只会在你使用对应功能时申请。仅浏览乐生活不会请求相机、位置、相册或通讯录。' : '请在已封装的乐生活 App 中测试系统权限；浏览器不会弹出原生权限窗口。'}</div><div style="margin-top:16px;">${appPermissionItem('附近商家与会员卡','点击后申请“使用期间定位”，仅用于本次附近排序。','location','测试定位')}${appPermissionItem('拍照发布','点击后才申请相机，用于拍摄笔记或商品图片。','camera','测试相机')}${appPermissionItem('从相册选择','点击后才申请相册访问，用于上传图片。','photos','测试相册')}${appPermissionItem('邀请通讯录好友','只有使用邀请功能时才申请通讯录。','contacts','测试通讯录')}${appPermissionItem('本地提醒','允许后可在 App 内设置“优惠快到期”提醒；此测试会在 1 分钟后提醒。','local-notification','测试提醒')}${appPermissionItem('触感反馈','不需要系统权限，用于确认操作时的轻微触感。','haptic','测试触感')}</div><div id="appPermissionResult" class="feedback-meta" style="margin-top:16px;">${inApp ? '可逐项测试，系统会仅在需要时显示授权提示。' : '当前不是原生 App 环境。'}</div>`;
  overlay.classList.add('open');
}
function closeAppPermissionCenter(){ document.getElementById('appPermissionOverlay')?.classList.remove('open'); }
async function testNativeSystemAction(action){
  const resultEl = document.getElementById('appPermissionResult');
  if(resultEl) resultEl.textContent = '正在请求系统能力…';
  const result = await requestNativeAction(action);
  if(!result || !result.handled){
    if(resultEl) resultEl.textContent = '当前 App 尚未安装此原生能力。完成本版原生同步后可重新测试。';
    return;
  }
  if(result.ok === false){
    if(resultEl) resultEl.textContent = result.message || '系统没有授予此权限，可在系统设置中稍后开启。';
    return;
  }
  const message = result.message || (action === 'haptic' ? '已触发轻微触感反馈。' : '系统能力已可用。');
  if(resultEl) resultEl.textContent = message;
  showToast(message);
}
async function shareFacebook(){
  if(!shareContext) return;
  // iOS WebView 直接跳转 Facebook 往往不会继续带上分享动作，封装 App 统一交给系统分享面板。
  if(isEmbeddedAppEntry() && window.parent && window.parent !== window){ await shareNative('Facebook'); return; }
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareContext.url)}`, '_blank', 'noopener');
}
function shareSms(){ if(!shareContext) return; closeShareSheet(); window.location.href = `sms:&body=${encodeURIComponent(`${shareContext.title}\n${shareContext.url}`)}`; }
function generateShareImage(){
  if(!shareContext) return; const canvas = document.createElement('canvas'); canvas.width=1080; canvas.height=1440; const ctx=canvas.getContext('2d');
  ctx.fillStyle='#f6f4ec';ctx.fillRect(0,0,1080,1440);ctx.fillStyle='#5e836a';ctx.fillRect(0,0,1080,92);ctx.fillStyle='#fff';ctx.font='700 42px sans-serif';ctx.fillText('乐生活  SCOOP CITY',64,60);ctx.fillStyle='#292722';ctx.font='700 66px sans-serif';
  const title=String(shareContext.title||'乐生活').slice(0,34); for(let i=0;i<title.length;i+=15) ctx.fillText(title.slice(i,i+15),64,210+(i/15)*82);ctx.fillStyle='#6c6a63';ctx.font='38px sans-serif';const desc=String(shareContext.text||'发现身边的精彩生活').replace(/\s+/g,' ').slice(0,72);for(let i=0;i<desc.length;i+=24)ctx.fillText(desc.slice(i,i+24),64,430+(i/24)*54);ctx.fillStyle='#fff';ctx.fillRect(64,1120,952,190);ctx.fillStyle='#5e836a';ctx.font='700 38px sans-serif';ctx.fillText('扫码或访问乐生活，发现身边的精彩生活',110,1202);ctx.fillStyle='#8b8980';ctx.font='28px sans-serif';ctx.fillText(shareContext.url.replace(/^https:\/\//,''),110,1260);
  const save = url => { const a=document.createElement('a');a.href=url;a.download='乐生活分享图.png';a.click();showToast('分享图已生成，可保存或发送'); };
  if(shareContext.image && String(shareContext.image).startsWith('data:image')){ const img=new Image();img.onload=()=>{ctx.drawImage(img,64,620,952,430);save(canvas.toDataURL('image/png'));};img.onerror=()=>save(canvas.toDataURL('image/png'));img.src=shareContext.image; } else save(canvas.toDataURL('image/png'));
}
function callMerchantPhone(phone){
  const clean = String(phone || '').replace(/[^\d+]/g, '');
  if(!clean){ showToast('商家暂未填写电话'); return; }
  window.location.href = `tel:${clean}`;
}
const MERCHANT_FEATURE_CATALOG = [
  { id:'shipping', title:'物流中心', icon:'bag', live:true, description:'录入商品条码与自购运单，使用乐生活面单额度和邮资风险预检。' },
  { id:'rental', title:'租车预约', icon:'car', live:true, phone:true, categories:['住宿旅游'], description:'展示车辆、按日或小时预约、人工确认、取还车记录与运营状态。' },
  { id:'auto_sales', title:'二手车买卖', icon:'car', live:true, phone:true, categories:['交通出行'], subcategories:['车辆销售'], description:'展示在售车辆、预约试驾，并接收客户卖车估价申请。' },
  { id:'table_order', title:'扫码点餐', icon:'bag', live:true, categories:['餐饮饮品'], description:'顾客扫码选择餐桌、点菜和加菜，商家集中处理订单。' },
  { id:'takeout_order', title:'外卖点餐与叫号', icon:'store', live:true, phone:true, categories:['餐饮饮品'], description:'顾客下单后生成取餐编号，适合奶茶、咖啡和外带窗口。' },
  { id:'booking', title:'预约服务', icon:'calendar', live:true, phone:true, categories:['服务预约','运动健康','亲子教育','休闲娱乐','住宿旅游','房产生活服务','专业服务','社区公益与组织'], excludeSubcategories:['美容'], description:'设置服务项目、时段、人数和预约说明；客户填写姓名与电话后提交预约。' },
  { id:'event_registration', title:'活动报名', icon:'calendar', live:true, phone:true, categories:['亲子教育','休闲娱乐','社区公益与组织'], description:'设置日期、总人数、每账号人数限制和剩余报名名额。' },
  { id:'ticketing', title:'票务与核销', icon:'ticket', live:true, phone:true, categories:['休闲娱乐','住宿旅游','社区公益与组织'], description:'创建票种、分区或精确选座；购票后生成二维码，到场即可核销。' },
  { id:'queue', title:'排队取号', icon:'user', live:false, phone:true, categories:['餐饮饮品','休闲娱乐'], description:'用户线上取号、查看前方人数，商家可按顺序叫号。' },
  { id:'quote', title:'咨询报价', icon:'message', live:false, phone:true, categories:['服务预约','房产生活服务','专业服务'], description:'用户提交需求和联系方式，商家后台统一回复与跟进。' },
  { id:'attendance', title:'签到', icon:'check', live:false, phone:true, categories:['亲子教育','休闲娱乐','社区公益与组织'], description:'课程、活动或团课到场签到，可结合会员或二维码使用。' },
  { id:'presale', title:'预售与团购', icon:'star', live:false, phone:true, categories:['餐饮饮品','零售好物','休闲娱乐'], description:'发布限量预售、团购套餐和核销规则。' },
  { id:'delivery_tracking', title:'配送订单追踪', icon:'map', live:false, phone:true, categories:['餐饮饮品','零售好物','住宿旅游'], description:'为配送订单展示制作、出发和送达进度。' }
];
function merchantFeatureAppliesToMerchant(feature, merchant, enabled){
  const category = String(merchant?.category || '').trim();
  const subcategory = String(merchant?.subcategory || '').trim();
  if(Array.isArray(feature.excludeSubcategories) && feature.excludeSubcategories.includes(subcategory)) return false;
  if((enabled || []).includes(feature.id)) return true;
  if(!category) return false;
  if(Array.isArray(feature.categories) && feature.categories.length && !feature.categories.includes(category)) return false;
  if(Array.isArray(feature.subcategories) && feature.subcategories.length && !feature.subcategories.includes(subcategory)) return false;
  return true;
}
function merchantFeatureStorageKey(merchantUserId){ return `leshenghuo_merchant_features_${merchantUserId || ''}`; }
function merchantEnabledFeatures(merchant){
  const stored = merchant && Array.isArray(merchant.enabled_features) ? merchant.enabled_features : null;
  if(stored) return [...new Set(stored.filter(Boolean))];
  const merchantUserId = typeof merchant === 'object' ? merchant && merchant.user_id : merchant;
  try { return JSON.parse(localStorage.getItem(merchantFeatureStorageKey(merchantUserId)) || '[]').filter(Boolean); }
  catch(error){ return []; }
}
async function saveMerchantEnabledFeatures(merchant, values){
  const clean = [...new Set((values || []).filter(Boolean))];
  const merchantUserId = merchant && merchant.user_id;
  if(!merchantUserId || !(session && session.user && String(session.user.id) === String(merchantUserId))) throw new Error('not_owner');
  if(!merchantPublicApi) throw new Error('商家资料接口未初始化');
  const rows = await merchantPublicApi.patch({ userId:merchantUserId, returnRepresentation:true, payload:{ enabled_features:clean, updated_at:new Date().toISOString() } });
  // Some native WebViews complete PATCH successfully without a response body.
  // Preserve the confirmed selection rather than treating that success as a missing merchant.
  const savedMerchant = rows[0] || Object.assign({}, merchant, { enabled_features:clean, updated_at:new Date().toISOString() });
  Object.assign(merchant, savedMerchant);
  if(currentMerchant && String(currentMerchant.user_id) === String(merchantUserId)) Object.assign(currentMerchant, savedMerchant);
  localStorage.setItem(merchantFeatureStorageKey(merchantUserId), JSON.stringify(clean));
  return clean;
}
function merchantFeatureIcon(feature){ return uiIcon(feature.icon || 'store', 20); }
function shippingCenterUrl(){ return `https://escoopcity.com/shipping/?shipping_v=5.530&app_v=${encodeURIComponent(APP_VERSION)}&refresh_t=${Date.now()}`; }
function openShippingCenter(){
  const url = shippingCenterUrl();
  openMerchantModule(url);
}
function merchantRentalUrl(m){ return `https://escoopcity.com/rental/index.html?merchant=${encodeURIComponent(merchantSiteSlug(m))}&rental_v=5.365&app_v=${encodeURIComponent(APP_VERSION)}&refresh_t=${Date.now()}`; }
function merchantBookingUrl(m){ return `https://escoopcity.com/booking/?merchant=${encodeURIComponent(merchantSiteSlug(m))}&booking_v=5.580&app_v=${encodeURIComponent(APP_VERSION)}&refresh_t=${Date.now()}`; }
function merchantEventsUrl(m){ return `https://escoopcity.com/events/?merchant=${encodeURIComponent(merchantSiteSlug(m))}&events_v=5.581&app_v=${encodeURIComponent(APP_VERSION)}&refresh_t=${Date.now()}`; }
function merchantTicketsUrl(m){ return `https://escoopcity.com/tickets/?merchant=${encodeURIComponent(merchantSiteSlug(m))}&tickets_v=5.592&app_v=${encodeURIComponent(APP_VERSION)}&refresh_t=${Date.now()}`; }
function openTicketEventFromPost(merchantSlug, eventId){
  if(!merchantSlug || !eventId){ showToast('该活动暂未完成票务配置'); return; }
  const url = `https://escoopcity.com/tickets/?merchant=${encodeURIComponent(merchantSlug)}&event=${encodeURIComponent(eventId)}&tickets_v=5.592&app_v=${encodeURIComponent(APP_VERSION)}&refresh_t=${Date.now()}`;
  openMerchantModule(url);
}
async function openMerchantBookingPage(merchantUserId){
  try {
    const merchant = await getMerchantOrderMerchant(merchantUserId);
    if(!merchant) throw new Error('merchant_not_found');
    const url = merchantBookingUrl(merchant);
    if(isNativeAppRuntime()) openMerchantEmbeddedOrder(url);
    else window.location.href = url;
  } catch(error){ console.warn('打开预约服务失败:', error.message); showToast('预约服务暂时无法打开，请稍后再试'); }
}
function merchantBookingCanManage(merchantUserId){
  return String(merchantUserId || '') === String(activeMerchantWorkspaceId() || '') && (isMerchantWorkspaceOwner() || merchantWorkspaceHasPermission('order_manage'));
}
async function openMerchantBookingManager(merchantUserId){
  const id = merchantUserId || activeMerchantWorkspaceId();
  if(!id || !merchantBookingCanManage(id)){ showToast('你没有这家商家的预约管理权限'); return; }
  try {
    const merchant = await getMerchantOrderMerchant(id);
    if(!merchant) throw new Error('merchant_not_found');
    const url = `https://escoopcity.com/booking/manage/?merchant=${encodeURIComponent(merchantSiteSlug(merchant))}&booking_v=5.580&app_v=${encodeURIComponent(APP_VERSION)}&refresh_t=${Date.now()}`;
    if(isNativeAppRuntime()) openMerchantEmbeddedOrder(url);
    else window.location.href = url;
  } catch(error){ console.warn('打开预约管理失败:', error.message); showToast('预约管理暂时无法打开，请稍后再试'); }
}
async function openMerchantEventsPage(merchantUserId){
  try {
    const merchant = await getMerchantOrderMerchant(merchantUserId);
    if(!merchant) throw new Error('merchant_not_found');
    const url = merchantEventsUrl(merchant);
    if(isNativeAppRuntime()) openMerchantEmbeddedOrder(url);
    else window.location.href = url;
  } catch(error){ console.warn('打开活动报名失败:', error.message); showToast('活动报名暂时无法打开，请稍后再试'); }
}
function merchantEventsCanManage(merchantUserId){
  return String(merchantUserId || '') === String(activeMerchantWorkspaceId() || '') && (isMerchantWorkspaceOwner() || merchantWorkspaceHasPermission('content_publish') || merchantWorkspaceHasPermission('order_manage'));
}
async function openMerchantEventsManager(merchantUserId){
  const id = merchantUserId || activeMerchantWorkspaceId();
  if(!id || !merchantEventsCanManage(id)){ showToast('你没有这家商家的活动管理权限'); return; }
  try {
    const merchant = await getMerchantOrderMerchant(id);
    if(!merchant) throw new Error('merchant_not_found');
    const url = `https://escoopcity.com/events/manage/?merchant=${encodeURIComponent(merchantSiteSlug(merchant))}&events_v=5.581&app_v=${encodeURIComponent(APP_VERSION)}&refresh_t=${Date.now()}`;
    if(isNativeAppRuntime()) openMerchantEmbeddedOrder(url);
    else window.location.href = url;
  } catch(error){ console.warn('打开活动管理失败:', error.message); showToast('活动管理暂时无法打开，请稍后再试'); }
}
async function openMerchantTicketsPage(merchantUserId){
  try {
    const merchant = await getMerchantOrderMerchant(merchantUserId);
    if(!merchant) throw new Error('merchant_not_found');
    const url = merchantTicketsUrl(merchant);
    if(isNativeAppRuntime()) openMerchantEmbeddedOrder(url);
    else window.location.href = url;
  } catch(error){ console.warn('打开票务失败:', error.message); showToast('票务暂时无法打开，请稍后再试'); }
}
function merchantTicketsCanManage(merchantUserId){
  return String(merchantUserId || '') === String(activeMerchantWorkspaceId() || '') && (isMerchantWorkspaceOwner() || merchantWorkspaceHasPermission('order_manage'));
}
async function openMerchantTicketsManager(merchantUserId){
  const id = merchantUserId || activeMerchantWorkspaceId();
  if(!id || !merchantTicketsCanManage(id)){ showToast('你没有这家商家的票务管理权限'); return; }
  try {
    const merchant = await getMerchantOrderMerchant(id);
    if(!merchant) throw new Error('merchant_not_found');
    const url = `https://escoopcity.com/tickets/manage/?merchant=${encodeURIComponent(merchantSiteSlug(merchant))}&tickets_v=5.592&app_v=${encodeURIComponent(APP_VERSION)}&refresh_t=${Date.now()}`;
    if(isNativeAppRuntime()) openMerchantEmbeddedOrder(url);
    else window.location.href = url;
  } catch(error){ console.warn('打开票务管理失败:', error.message); showToast('票务管理暂时无法打开，请稍后再试'); }
}
function merchantAutoUrl(m, tab='buy'){ return `https://escoopcity.com/autos/?merchant=${encodeURIComponent(merchantSiteSlug(m))}&tab=${encodeURIComponent(tab === 'sell' ? 'sell' : 'buy')}&auto_v=5.413&app_v=${encodeURIComponent(APP_VERSION)}&refresh_t=${Date.now()}`; }
async function openMerchantAutoPage(merchantUserId, tab='buy'){
  try {
    const merchant = await getMerchantOrderMerchant(merchantUserId);
    if(!merchant) throw new Error('merchant_not_found');
    const url = merchantAutoUrl(merchant, tab);
    if(isNativeAppRuntime()) openMerchantEmbeddedOrder(url);
    else window.location.href = url;
  } catch(error){ console.warn('打开二手车买卖失败:', error.message); showToast('二手车买卖暂时无法打开，请稍后再试'); }
}
function merchantAutoCanManage(merchantUserId){
  return String(merchantUserId || '') === String(activeMerchantWorkspaceId() || '') && (isMerchantWorkspaceOwner() || merchantWorkspaceHasPermission('order_manage'));
}
function merchantRetailCanManage(merchantUserId){
  return String(merchantUserId || '') === String(activeMerchantWorkspaceId() || '') && (isMerchantWorkspaceOwner() || merchantWorkspaceHasPermission('order_manage'));
}
function merchantInventoryCanManage(merchantUserId){
  return String(merchantUserId || '') === String(activeMerchantWorkspaceId() || '') && (isMerchantWorkspaceOwner() || merchantWorkspaceHasPermission('order_manage'));
}
async function openMerchantRetailManager(merchantUserId){
  const id = merchantUserId || activeMerchantWorkspaceId();
  if(!id || !merchantRetailCanManage(id)){ showToast('你没有这家商家的零售订单管理权限'); return; }
  try {
    const merchant = await getMerchantOrderMerchant(id);
    if(!merchant) throw new Error('merchant_not_found');
    const url = `https://escoopcity.com/retail/manage/?merchant=${encodeURIComponent(merchantSiteSlug(merchant))}&retail_v=5.570&app_v=${encodeURIComponent(APP_VERSION)}&refresh_t=${Date.now()}`;
    if(isNativeAppRuntime()) openMerchantEmbeddedOrder(url);
    else window.location.href = url;
  } catch(error){ console.warn('打开零售订单管理失败:', error.message); showToast('零售订单管理暂时无法打开，请稍后再试'); }
}
async function openMerchantInventoryManager(merchantUserId){
  const id = merchantUserId || activeMerchantWorkspaceId();
  if(!id || !merchantInventoryCanManage(id)){ showToast('你没有这家商家的库存管理权限'); return; }
  try {
    const merchant = await getMerchantOrderMerchant(id);
    if(!merchant) throw new Error('merchant_not_found');
    const url = `https://escoopcity.com/inventory/manage/?merchant=${encodeURIComponent(merchantSiteSlug(merchant))}&inventory_v=5.570&app_v=${encodeURIComponent(APP_VERSION)}&refresh_t=${Date.now()}`;
    if(isNativeAppRuntime()) openMerchantEmbeddedOrder(url);
    else window.location.href = url;
  } catch(error){ console.warn('打开库存管理失败:', error.message); showToast('库存管理暂时无法打开，请稍后再试'); }
}
async function openMerchantAutoManager(merchantUserId){
  const id = merchantUserId || activeMerchantWorkspaceId();
  if(!id || !merchantAutoCanManage(id)){ showToast('你没有这家商家的二手车管理权限'); return; }
  try {
    const merchant = await getMerchantOrderMerchant(id);
    if(!merchant) throw new Error('merchant_not_found');
    const url = `https://escoopcity.com/autos/manage/?merchant=${encodeURIComponent(id)}&manage_v=5.413&app_v=${encodeURIComponent(APP_VERSION)}&refresh_t=${Date.now()}`;
    if(isNativeAppRuntime()) openMerchantEmbeddedOrder(url);
    else window.location.href = url;
  } catch(error){ console.warn('打开二手车管理失败:', error.message); showToast('二手车管理暂时无法打开，请稍后再试'); }
}
function closeMerchantRentalManager(){ document.getElementById('merchantRentalManager')?.classList.remove('open'); }
async function openMerchantRentalPage(merchantUserId){
  try {
    const merchant = await getMerchantOrderMerchant(merchantUserId);
    if(!merchant) throw new Error('merchant_not_found');
    const url = merchantRentalUrl(merchant);
    if(isNativeAppRuntime()) openMerchantEmbeddedOrder(url);
    else window.location.href = url;
  } catch(error){ console.warn('打开租车预约失败:', error.message); showToast('租车预约暂时无法打开，请稍后再试'); }
}
function merchantRentalCanManage(merchantUserId){
  return String(merchantUserId || '') === String(activeMerchantWorkspaceId() || '') && (isMerchantWorkspaceOwner() || merchantWorkspaceHasPermission('order_manage'));
}
async function openMerchantManagementCenter(merchantUserId){
  const id = merchantUserId || activeMerchantWorkspaceId();
  if(!id || String(id) !== String(activeMerchantWorkspaceId() || '')){ showToast('请先进入自己的商家主页'); return; }
  closeProfileMenu();
  try {
    const merchant = await getMerchantOrderMerchant(id);
    if(!merchant) throw new Error('merchant_not_found');
    const url = `https://escoopcity.com/merchant/manage/?merchant=${encodeURIComponent(merchantSiteSlug(merchant))}&admin_v=5.365&app_v=${encodeURIComponent(APP_VERSION)}&refresh_t=${Date.now()}`;
    if(isNativeAppRuntime()) openMerchantEmbeddedOrder(url);
    else window.location.href = url;
  } catch(error){
    console.warn('打开商家管理后台失败:', error.message);
    showToast('商家管理后台暂时无法打开，请稍后再试');
  }
}
async function openMerchantRentalManager(merchantUserId){
  const id = merchantUserId || activeMerchantWorkspaceId();
  if(!id || !merchantRentalCanManage(id)){ showToast('你没有这家商家的租车管理权限'); return; }
  try {
    const merchant = await getMerchantOrderMerchant(id);
    if(!merchant) throw new Error('merchant_not_found');
    const url = `https://escoopcity.com/rental/manage/?merchant=${encodeURIComponent(merchantSiteSlug(merchant))}&manage_v=5.365&app_v=${encodeURIComponent(APP_VERSION)}&refresh_t=${Date.now()}`;
    if(isNativeAppRuntime()) openMerchantEmbeddedOrder(url);
    else window.location.href = url;
  } catch(error){
    console.warn('打开租车管理失败:', error.message);
    showToast('租车管理暂时无法打开，请稍后再试');
  }
}
function merchantRentalMoney(value){ return `$${Number(value || 0).toFixed(2)}`; }
function merchantRentalStatusText(status){ return ({available:'可预约',reserved:'已保留',rented:'租用中',maintenance:'维修中',cleaning:'清洁中',inactive:'已下架',pending:'待确认',confirmed:'已确认',rejected:'已拒绝',cancelled:'已取消',active:'取车中',returned:'已归还',overdue:'逾期'}[status] || status || '待确认'); }
function merchantRentalDate(value){ return value ? new Intl.DateTimeFormat('zh-CN',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'America/Los_Angeles'}).format(new Date(value)) : '未填写'; }
function merchantRentalPhotos(value){ return Array.isArray(value) ? value.filter(Boolean) : []; }
function merchantRentalAddonList(value){
  const list = Array.isArray(value) ? value : [];
  return list.map((item,index) => ({ id:String(item?.id || `addon-${Date.now()}-${index}`), name:String(item?.name || ''), description:String(item?.description || ''), price:item?.price ?? '', unit:item?.unit === 'day' ? 'day' : 'once' }));
}
function renderMerchantRentalAddonRows(){
  const wrap = document.getElementById('merchantRentalAddonRows');
  if(!wrap) return;
  const rows = window._merchantRentalEditingAddons || [];
  wrap.innerHTML = rows.map((item,index) => `<div class="merchant-rental-addon-row"><div class="merchant-form-field"><label>服务名称</label><input data-rental-addon="name" data-index="${index}" maxlength="80" value="${escAttr(item.name)}" placeholder="例如：儿童安全座椅"></div><div class="merchant-form-field"><label>收费</label><input data-rental-addon="price" data-index="${index}" inputmode="decimal" value="${escAttr(item.price)}" placeholder="0"></div><div class="merchant-form-field"><label>收费方式</label><select data-rental-addon="unit" data-index="${index}"><option value="once" ${item.unit === 'once' ? 'selected' : ''}>每次</option><option value="day" ${item.unit === 'day' ? 'selected' : ''}>每天</option></select></div><button type="button" class="merchant-rental-addon-remove" onclick="removeMerchantRentalAddon(${index})" aria-label="删除附加服务">×</button><div class="merchant-form-field merchant-rental-addon-description"><label>服务说明（可选）</label><input data-rental-addon="description" data-index="${index}" maxlength="180" value="${escAttr(item.description)}" placeholder="例如：适用 1 至 5 岁儿童"></div></div>`).join('');
}
function addMerchantRentalAddon(){
  window._merchantRentalEditingAddons = (window._merchantRentalEditingAddons || []).concat({ id:`addon-${Date.now()}`,name:'',description:'',price:'',unit:'once' });
  renderMerchantRentalAddonRows();
}
function removeMerchantRentalAddon(index){
  window._merchantRentalEditingAddons.splice(index,1);
  renderMerchantRentalAddonRows();
}
function merchantRentalEditorAddons(){
  const values = window._merchantRentalEditingAddons || [];
  return values.map((item,index) => ({
    id:item.id,
    name:document.querySelector(`[data-rental-addon="name"][data-index="${index}"]`)?.value.trim() || '',
    description:document.querySelector(`[data-rental-addon="description"][data-index="${index}"]`)?.value.trim() || '',
    price:document.querySelector(`[data-rental-addon="price"][data-index="${index}"]`)?.value.trim() || '0',
    unit:document.querySelector(`[data-rental-addon="unit"][data-index="${index}"]`)?.value === 'day' ? 'day' : 'once'
  })).filter(item => item.name);
}
async function renderMerchantRentalManager(){
  const sheet = document.getElementById('merchantRentalManager');
  const body = document.getElementById('merchantRentalManagerBody');
  const merchantUserId = sheet?.dataset.merchantUserId || activeMerchantWorkspaceId();
  if(!body || !merchantUserId) return;
  body.innerHTML = '<div class="deals-empty-panel">正在读取车辆与预约...</div>';
  try {
    const data = await rentalApi.managerList(merchantUserId);
    const vehicles = Array.isArray(data?.vehicles) ? data.vehicles : [];
    const bookings = Array.isArray(data?.bookings) ? data.bookings : [];
    window._merchantRentalData = { vehicles, bookings };
    const vehicleCards = vehicles.length ? vehicles.map(vehicle => {
      const photo = merchantRentalPhotos(vehicle.photos)[0];
      const rate = vehicle.pricing_mode === 'hour' ? `${merchantRentalMoney(vehicle.hourly_rate)}/小时` : vehicle.pricing_mode === 'both' ? `${merchantRentalMoney(vehicle.hourly_rate)}/小时起` : `${merchantRentalMoney(vehicle.daily_rate)}/天`;
      return `<div class="merchant-order-card"><div style="display:flex;gap:10px;align-items:center;"><div style="width:66px;height:52px;flex:0 0 66px;border-radius:9px;background:var(--sage-light);overflow:hidden;display:grid;place-items:center;">${photo ? `<img src="${escAttr(photo)}" alt="" style="width:100%;height:100%;object-fit:cover;">` : uiIcon('car',22)}</div><div style="min-width:0;flex:1;"><b>${escHtml(vehicle.name)}</b><span style="display:block;margin-top:4px;font-size:12px;color:var(--ink-soft);">${escHtml([vehicle.year,vehicle.make,vehicle.model,`${vehicle.seats || 5}座`].filter(Boolean).join(' · '))}</span><span style="display:block;margin-top:3px;font-size:12px;color:var(--berry);font-weight:800;">${rate} · 押金 ${merchantRentalMoney(vehicle.deposit_amount)}</span></div><i class="merchant-order-state">${escHtml(merchantRentalStatusText(vehicle.status))}</i></div><div class="merchant-order-card-actions"><button class="primary" onclick="openMerchantRentalVehicleEditor('${escAttr(vehicle.id)}')">编辑车辆</button><button onclick="merchantRentalSetVehicleStatus('${escAttr(vehicle.id)}','${vehicle.status === 'inactive' ? 'available' : 'inactive'}')">${vehicle.status === 'inactive' ? '重新上架' : '下架'}</button></div></div>`;
    }).join('') : '<div class="deals-empty-panel">还没有车辆。先添加一辆车，顾客即可查看并提交预约。</div>';
    const active = bookings.filter(row => !['returned','rejected','cancelled'].includes(row.status));
    const expectedRevenue = bookings.filter(row => !['rejected','cancelled'].includes(row.status)).reduce((sum,row) => sum + Number(row.total_amount || 0), 0);
    const bookingCards = active.length ? active.map(booking => {
      const vehicle = vehicles.find(row => String(row.id) === String(booking.vehicle_id)) || {};
      const actions = booking.status === 'pending' ? `<button class="primary" onclick="merchantRentalSetBookingStatus('${escAttr(booking.id)}','confirmed')">确认预约</button><button onclick="merchantRentalSetBookingStatus('${escAttr(booking.id)}','rejected')">拒绝</button>` : booking.status === 'confirmed' ? `<button class="primary" onclick="merchantRentalSetBookingStatus('${escAttr(booking.id)}','active')">确认取车</button><button onclick="merchantRentalSetBookingStatus('${escAttr(booking.id)}','cancelled')">取消预约</button>` : booking.status === 'active' || booking.status === 'overdue' ? `<button class="primary" onclick="merchantRentalSetBookingStatus('${escAttr(booking.id)}','returned')">确认归还</button><button onclick="merchantRentalSetBookingStatus('${escAttr(booking.id)}','overdue')">标记逾期</button>` : '';
      const paymentMethod=String(booking.payment_method||'');
      const stripeType=paymentMethod.replace(/^stripe(?:_test)?_?/, '');
      const stripeLabel={apple_pay:'Apple Pay',google_pay:'Google Pay',link:'Link',card:'信用卡'}[stripeType]||'Stripe';
      const paymentText = paymentMethod.startsWith('stripe_test') ? `Stripe 测试付款 · ${stripeLabel}（未产生真实收款）` : paymentMethod.startsWith('stripe') ? `Stripe 付款 · ${stripeLabel}` : booking.payment_status === 'paid' ? '已收款' : '待付款';
      return `<div class="merchant-order-card"><div class="merchant-order-card-head"><div><b>${escHtml(vehicle.name || '车辆')} · ${escHtml(booking.booking_code || '')}</b><span>${escHtml(booking.customer_name)} · ${escHtml(booking.customer_phone)}</span></div><i class="merchant-order-state">${escHtml(merchantRentalStatusText(booking.status))}</i></div><div class="merchant-order-lines"><div class="merchant-order-line"><span>${merchantRentalDate(booking.starts_at)} 至 ${merchantRentalDate(booking.ends_at)}</span><b>${merchantRentalMoney(booking.total_amount)}</b></div><div class="merchant-order-line"><span>租金 ${merchantRentalMoney(booking.base_amount)} · 会员/券优惠 ${merchantRentalMoney(Number(booking.member_discount_amount||0)+Number(booking.coupon_discount_amount||0))}</span></div><div class="merchant-order-line"><span>押金 ${merchantRentalMoney(booking.deposit_amount)} · ${escHtml(paymentText)} · ${escHtml(booking.deposit_status === 'authorized' || booking.deposit_status === 'collected' ? '押金已处理' : '押金待处理')}</span></div>${booking.operator_note ? `<div style="margin-top:8px;color:var(--ink-soft);font-size:12px;">预约备注：${escHtml(booking.operator_note)}</div>` : ''}${booking.financial_note ? `<div style="margin-top:6px;color:var(--ink-soft);font-size:12px;">费用备注：${escHtml(booking.financial_note)}</div>` : ''}</div><div class="merchant-order-card-actions"><button onclick="openMerchantRentalFinancialEditor('${escAttr(booking.id)}')">收款与优惠</button><button onclick="openMerchantRentalExtensionEditor('${escAttr(booking.id)}')">调整租期</button>${actions}</div></div>`;
    }).join('') : '<div class="deals-empty-panel">目前没有待处理的预约。</div>';
    body.innerHTML = `<div class="merchant-order-top-actions"><button class="primary" onclick="openMerchantRentalVehicleEditor()">${uiIcon('car',17)} 添加车辆</button><button onclick="renderMerchantRentalManager()">${uiIcon('refresh',17)} 刷新</button></div><div class="order-notice">顾客预约会先进入待确认。线上付款、押金预授权与自动退款将在支付服务接入后启用；目前可登记实际收款、押金、优惠、损坏和违章费用。</div><div class="merchant-order-status-tabs"><button class="on">车辆 ${vehicles.length}</button><button onclick="document.getElementById('merchantRentalBookings').scrollIntoView({behavior:'smooth'})">预约 ${active.length}</button><button>预计 ${merchantRentalMoney(expectedRevenue)}</button></div><section><div class="deals-section-header" style="margin:12px 0 8px;">车辆管理 <span>可预约 / 清洁 / 维修</span></div>${vehicleCards}</section><section id="merchantRentalBookings" style="margin-top:20px;"><div class="deals-section-header" style="margin:0 0 8px;">预约处理 <span>按取车时间排序</span></div>${bookingCards}</section>`;
  } catch(error){ console.warn('租车管理读取失败:', error.message); body.innerHTML = '<div class="deals-empty-panel">租车功能暂时无法读取，请确认已运行 v5.322 数据库更新。</div>'; }
}
function openMerchantRentalVehicleEditor(vehicleId){
  const body = document.getElementById('merchantRentalManagerBody');
  const vehicle = vehicleId ? (window._merchantRentalData?.vehicles || []).find(row => String(row.id) === String(vehicleId)) : {};
  if(!body) return;
  const photos = merchantRentalPhotos(vehicle?.photos);
  window._merchantRentalEditingPhotos = photos.slice();
  window._merchantRentalSelectedAddonIds = merchantRentalAddonList(vehicle?.addons).filter(item => item.service_type === 'addon' || !item.service_type).map(item => String(item.id));
  window._merchantRentalSelectedInsuranceId = merchantRentalAddonList(vehicle?.addons).find(item => item.service_type === 'insurance')?.id || '';
  window._merchantRentalEditingLuggage = Number.isFinite(Number(vehicle?.luggage_count)) ? Number(vehicle.luggage_count) : 2;
  setTimeout(initMerchantRentalVehicleExtras, 0);
  body.innerHTML = `<div class="merchant-order-top-actions"><button onclick="renderMerchantRentalManager()">← 返回车辆管理</button></div><div class="merchant-form-field"><label>车辆名称</label><input id="rentalVehicleName" maxlength="80" value="${escAttr(vehicle?.name || '')}" placeholder="例如：2024 Toyota Camry"></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;"><div class="merchant-form-field"><label>品牌</label><input id="rentalVehicleMake" maxlength="50" value="${escAttr(vehicle?.make || '')}" placeholder="Toyota"></div><div class="merchant-form-field"><label>车型</label><input id="rentalVehicleModel" maxlength="50" value="${escAttr(vehicle?.model || '')}" placeholder="Camry"></div><div class="merchant-form-field"><label>年份（选填）</label><input id="rentalVehicleYear" type="number" min="1900" max="2100" step="1" inputmode="numeric" value="${escAttr(vehicle?.year || '')}" placeholder="例如 2024"></div><div class="merchant-form-field"><label>座位数</label><input id="rentalVehicleSeats" type="number" min="1" max="30" step="1" inputmode="numeric" value="${escAttr(vehicle?.seats || 5)}"></div></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;"><div class="merchant-form-field"><label>变速箱</label><select id="rentalVehicleTransmission"><option ${vehicle?.transmission === '自动挡' ? 'selected' : ''}>自动挡</option><option ${vehicle?.transmission === '手动挡' ? 'selected' : ''}>手动挡</option></select></div><div class="merchant-form-field"><label>燃料</label><select id="rentalVehicleFuel"><option ${vehicle?.fuel_type === '汽油' ? 'selected' : ''}>汽油</option><option ${vehicle?.fuel_type === '混动' ? 'selected' : ''}>混动</option><option ${vehicle?.fuel_type === '纯电' ? 'selected' : ''}>纯电</option><option ${vehicle?.fuel_type === '柴油' ? 'selected' : ''}>柴油</option></select></div></div><div class="merchant-form-field"><label>租赁方式</label><select id="rentalVehiclePricing"><option value="day" ${vehicle?.pricing_mode === 'day' ? 'selected' : ''}>按天</option><option value="hour" ${vehicle?.pricing_mode === 'hour' ? 'selected' : ''}>按小时</option><option value="both" ${vehicle?.pricing_mode === 'both' ? 'selected' : ''}>按小时和天</option></select></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;"><div class="merchant-form-field"><label>日租价格</label><input id="rentalVehicleDayRate" inputmode="decimal" value="${escAttr(vehicle?.daily_rate || 0)}" placeholder="0"></div><div class="merchant-form-field"><label>小时价格</label><input id="rentalVehicleHourRate" inputmode="decimal" value="${escAttr(vehicle?.hourly_rate || 0)}" placeholder="0"></div><div class="merchant-form-field"><label>最少小时数</label><input id="rentalVehicleMinHours" type="number" min="1" max="168" step="1" inputmode="numeric" value="${escAttr(vehicle?.minimum_hours || 1)}"></div><div class="merchant-form-field"><label>取车押金</label><input id="rentalVehicleDeposit" inputmode="decimal" value="${escAttr(vehicle?.deposit_amount || 0)}" placeholder="0"></div></div><div class="merchant-form-field"><label>取车地点</label><input id="rentalVehiclePickup" maxlength="180" value="${escAttr(vehicle?.pickup_address || currentMerchant?.address || '')}" placeholder="默认使用店铺地址"></div><div class="merchant-form-field"><label>车辆状态</label><select id="rentalVehicleStatus">${[['available','可预约'],['cleaning','清洁中'],['maintenance','维修中'],['inactive','下架']].map(row => `<option value="${row[0]}" ${vehicle?.status === row[0] ? 'selected' : ''}>${row[1]}</option>`).join('')}</select></div><div class="merchant-form-field"><label>车辆介绍</label><textarea id="rentalVehicleDescription" maxlength="600" placeholder="例如：适合家庭出行，含倒车影像和 CarPlay。">${escHtml(vehicle?.description || '')}</textarea></div><div class="merchant-form-field"><label>车辆图片</label><input id="rentalVehiclePhotos" type="file" accept="image/*" multiple onchange="previewMerchantRentalVehiclePhotos(this.files)"><div id="rentalVehiclePhotoPreview" style="display:flex;gap:8px;overflow:auto;margin-top:8px;">${photos.map((url,index) => `<div style="position:relative;width:84px;height:64px;flex:0 0 84px;"><img src="${escAttr(url)}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;"><button onclick="removeMerchantRentalVehiclePhoto(${index})" style="position:absolute;right:-4px;top:-5px;width:20px;height:20px;border:0;border-radius:50%;background:var(--berry);color:#fff;line-height:1;">×</button></div>`).join('')}</div><div style="font-size:11px;color:var(--ink-faint);margin-top:6px;">图片会压缩后上传，第一张将作为车辆封面。</div></div><button id="merchantRentalVehicleSaveButton" class="merchant-reward-redeem-btn" style="margin-top:14px;" onclick="saveMerchantRentalVehicle('${escAttr(vehicle?.id || '')}')">保存车辆</button>`;
}
function initMerchantRentalVehicleExtras(){
  const saveButton = document.getElementById('merchantRentalVehicleSaveButton');
  if(!saveButton || document.getElementById('merchantRentalVehicleExtras')) return;
  const services = Array.isArray(window._merchantRentalData?.services) ? window._merchantRentalData.services : [];
  const addons = services.filter(item => item.service_type === 'addon' && item.is_active !== false);
  const insurances = services.filter(item => item.service_type === 'insurance' && item.is_active !== false);
  saveButton.insertAdjacentHTML('beforebegin', `<section id="merchantRentalVehicleExtras" style="margin-top:16px;padding-top:14px;border-top:1px solid var(--line);"><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;"><div class="merchant-form-field"><label>行李数量</label><input id="rentalVehicleLuggage" type="number" min="0" max="20" step="1" inputmode="numeric" value="${escAttr(window._merchantRentalEditingLuggage || 2)}"></div><div class="merchant-form-field"><label>客户页面燃油标记</label><input value="汽油 / 柴油 / 电动 / 混动" disabled style="opacity:.62;"></div></div><div style="display:flex;justify-content:space-between;align-items:center;margin:10px 0 8px;"><b style="font-size:15px;">附加服务（公用）</b><button type="button" onclick="openMerchantRentalServiceManager('addon')" style="border:0;background:transparent;color:var(--sage-dark);font-weight:800;">管理服务</button></div><div class="merchant-rental-shared-service-list">${addons.length ? addons.map(item => `<label><input type="checkbox" value="${escAttr(item.id)}" ${window._merchantRentalSelectedAddonIds.includes(String(item.id)) ? 'checked' : ''}> <span><b>${escHtml(item.name)}</b><small>${escHtml(item.description || '')} · ${merchantRentalMoney(item.price)}${item.unit === 'day' ? '/天' : '/次'}</small></span></label>`).join('') : '<div class="order-notice">尚未建立附加服务。先点“管理服务”添加，再回到车辆勾选。</div>'}</div><div style="display:flex;justify-content:space-between;align-items:center;margin:16px 0 8px;"><b style="font-size:15px;">保险服务（公用）</b><button type="button" onclick="openMerchantRentalServiceManager('insurance')" style="border:0;background:transparent;color:var(--sage-dark);font-weight:800;">管理保险</button></div><div class="merchant-form-field"><label>为这辆车选择保险</label><select id="rentalVehicleInsurance"><option value="">暂不提供保险服务</option>${insurances.map(item => `<option value="${escAttr(item.id)}" ${String(window._merchantRentalSelectedInsuranceId) === String(item.id) ? 'selected' : ''}>${escHtml(item.name)} · ${merchantRentalMoney(item.price)}${item.unit === 'day' ? '/天' : '/次'}</option>`).join('')}</select></div></section>`);
}
function openMerchantRentalServiceManager(type){
  const body = document.getElementById('merchantRentalManagerBody');
  if(!body) return;
  const services = (window._merchantRentalData?.services || []).filter(item => !type || item.service_type === type);
  const typeLabel = type === 'insurance' ? '保险服务' : '附加服务';
  body.innerHTML = `<div class="merchant-order-top-actions"><button onclick="renderMerchantRentalManager()">← 返回车辆管理</button><button class="primary" onclick="openMerchantRentalServiceEditor('${type || 'addon'}')">＋ 添加${typeLabel}</button></div><div class="order-notice">${typeLabel}是全店公用项目。修改名称、说明或价格后，所有已经选择该项目的车辆会同步更新。</div><div class="merchant-order-status-tabs"><button class="on">${typeLabel} ${services.length}</button><button onclick="openMerchantRentalServiceManager('${type === 'insurance' ? 'addon' : 'insurance'}')">${type === 'insurance' ? '附加服务' : '保险服务'}</button></div>${services.length ? services.map(item => `<div class="merchant-order-card"><div class="merchant-order-card-head"><div><b>${escHtml(item.name)}</b><span>${escHtml(item.description || '暂无说明')}</span></div><i class="merchant-order-state">${merchantRentalMoney(item.price)}${item.unit === 'day' ? '/天' : '/次'}</i></div><div class="merchant-order-card-actions"><button class="primary" onclick="openMerchantRentalServiceEditor('${item.service_type}','${escAttr(item.id)}')">编辑</button><button onclick="toggleMerchantRentalSharedService('${escAttr(item.id)}',${item.is_active === false ? 'true' : 'false'})">${item.is_active === false ? '重新启用' : '暂停使用'}</button></div></div>`).join('') : '<div class="deals-empty-panel">还没有设置服务项目。</div>'}`;
}
function openMerchantRentalServiceEditor(type, serviceId){
  const body = document.getElementById('merchantRentalManagerBody');
  const service = serviceId ? (window._merchantRentalData?.services || []).find(item => String(item.id) === String(serviceId)) : null;
  const label = type === 'insurance' ? '保险服务' : '附加服务';
  if(!body) return;
  body.innerHTML = `<div class="merchant-order-top-actions"><button onclick="openMerchantRentalServiceManager('${type}')">← 返回${label}</button></div><div class="merchant-form-field"><label>${label}名称</label><input id="rentalSharedServiceName" maxlength="80" value="${escAttr(service?.name || '')}" placeholder="例如：儿童安全座椅"></div><div class="merchant-form-field"><label>说明</label><textarea id="rentalSharedServiceDescription" maxlength="180" placeholder="例如：适用 1 至 5 岁儿童">${escHtml(service?.description || '')}</textarea></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;"><div class="merchant-form-field"><label>价格</label><input id="rentalSharedServicePrice" inputmode="decimal" value="${escAttr(service?.price ?? '')}" placeholder="0"></div><div class="merchant-form-field"><label>收费方式</label><select id="rentalSharedServiceUnit"><option value="once" ${service?.unit === 'once' ? 'selected' : ''}>每次</option><option value="day" ${service?.unit === 'day' ? 'selected' : ''}>每天</option></select></div></div><button class="merchant-reward-redeem-btn" style="margin-top:14px;" onclick="saveMerchantRentalSharedService('${type}','${escAttr(service?.id || '')}')">保存${label}</button>`;
}
async function saveMerchantRentalSharedService(type, id){
  const merchantUserId = document.getElementById('merchantRentalManager')?.dataset.merchantUserId || activeMerchantWorkspaceId();
  const name = document.getElementById('rentalSharedServiceName')?.value.trim() || '';
  if(!name){ showToast('请填写服务名称'); return; }
  try {
    await rentalApi.saveSharedService({id:id || undefined,merchant_user_id:merchantUserId,service_type:type,name,description:document.getElementById('rentalSharedServiceDescription')?.value.trim() || '',price:document.getElementById('rentalSharedServicePrice')?.value.trim() || '0',unit:document.getElementById('rentalSharedServiceUnit')?.value || 'once',is_active:true});
    showToast('公用服务已保存'); await renderMerchantRentalManager(); openMerchantRentalServiceManager(type);
  } catch(error){ console.warn('保存租车公用服务失败:',error.message); showToast('保存失败，请检查价格后重试'); }
}
async function toggleMerchantRentalSharedService(id, enabled){
  const service = (window._merchantRentalData?.services || []).find(item => String(item.id) === String(id));
  if(!service) return;
  try {
    await rentalApi.saveSharedService(Object.assign({},service,{merchant_user_id:document.getElementById('merchantRentalManager')?.dataset.merchantUserId || activeMerchantWorkspaceId(),is_active:enabled}));
    await renderMerchantRentalManager(); openMerchantRentalServiceManager(service.service_type);
  } catch(error){ showToast('更新服务状态失败'); }
}
function renderMerchantRentalVehiclePhotoPreview(){
  const wrap = document.getElementById('rentalVehiclePhotoPreview');
  if(!wrap) return;
  wrap.innerHTML = (window._merchantRentalEditingPhotos || []).map((url,index) => `<div style="position:relative;width:84px;height:64px;flex:0 0 84px;"><img src="${escAttr(url)}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;"><button onclick="removeMerchantRentalVehiclePhoto(${index})" style="position:absolute;right:-4px;top:-5px;width:20px;height:20px;border:0;border-radius:50%;background:var(--berry);color:#fff;line-height:1;">×</button></div>`).join('');
}
async function previewMerchantRentalVehiclePhotos(files){
  const list = Array.from(files || []).slice(0, 8);
  if(!list.length) return;
  const convert = file => new Promise((resolve,reject) => { const reader = new FileReader(); reader.onload = () => compressImage(reader.result, resolve, reject, 0.76, 1440); reader.onerror = reject; reader.readAsDataURL(file); });
  try { const values = await Promise.all(list.map(convert)); window._merchantRentalEditingPhotos = (window._merchantRentalEditingPhotos || []).concat(values).slice(0, 8); renderMerchantRentalVehiclePhotoPreview(); }
  catch(error){ showToast('图片处理失败，请换一张图片'); }
}
function removeMerchantRentalVehiclePhoto(index){ window._merchantRentalEditingPhotos.splice(index,1); renderMerchantRentalVehiclePhotoPreview(); }
async function saveMerchantRentalVehicle(vehicleId){
  if(window._savingMerchantRentalVehicle) return;
  const merchantUserId = document.getElementById('merchantRentalManager')?.dataset.merchantUserId || activeMerchantWorkspaceId();
  const get = id => document.getElementById(id)?.value?.trim() || '';
  const name = get('rentalVehicleName');
  if(!name){ showToast('请填写车辆名称'); return; }
  const year = get('rentalVehicleYear');
  if(year && (!/^\\d{4}$/.test(year) || Number(year) < 1900 || Number(year) > 2100)){
    showToast('车辆年份请填写 1900 至 2100 之间的四位数字');
    document.getElementById('rentalVehicleYear')?.focus();
    return;
  }
  const saveButton = document.getElementById('merchantRentalVehicleSaveButton');
  window._savingMerchantRentalVehicle = true;
  if(saveButton){ saveButton.disabled = true; saveButton.textContent = '正在保存车辆…'; }
  try {
    const uploadedPhotos = [];
    for(const source of (window._merchantRentalEditingPhotos || [])) uploadedPhotos.push(await uploadMediaDataUrl(source, 'products'));
    const payload = { id:vehicleId || undefined, name, make:get('rentalVehicleMake'), model:get('rentalVehicleModel'), year, seats:get('rentalVehicleSeats'), transmission:get('rentalVehicleTransmission'), fuel_type:get('rentalVehicleFuel'), pricing_mode:get('rentalVehiclePricing'), daily_rate:get('rentalVehicleDayRate'), hourly_rate:get('rentalVehicleHourRate'), minimum_hours:get('rentalVehicleMinHours'), deposit_amount:get('rentalVehicleDeposit'), pickup_address:get('rentalVehiclePickup'), status:get('rentalVehicleStatus'), description:get('rentalVehicleDescription'), photos:uploadedPhotos };
    const savedVehicle = await rentalApi.saveVehicle(merchantUserId,payload);
    const addonIds = Array.from(document.querySelectorAll('#merchantRentalVehicleExtras input[type="checkbox"]:checked')).map(input => input.value).filter(Boolean);
    await rentalApi.saveVehicleServices({vehicleId:savedVehicle?.id || vehicleId,addonServiceIds:addonIds,insuranceServiceId:document.getElementById('rentalVehicleInsurance')?.value || null});
    await rentalApi.saveVehicleAddons({vehicleId:savedVehicle?.id || vehicleId,luggageCount:Math.max(0, Math.min(20, Number(document.getElementById('rentalVehicleLuggage')?.value || 2)))});
    showToast('车辆已保存'); await renderMerchantRentalManager();
  } catch(error){
    const detail = String(error.message || '');
    console.warn('保存租车车辆失败:', detail);
    showToast(detail.includes('year_check') ? '车辆年份不正确，请填写 1900 至 2100 之间的年份' : '保存失败，请稍后再试');
  } finally {
    window._savingMerchantRentalVehicle = false;
    if(saveButton){ saveButton.disabled = false; saveButton.textContent = '保存车辆'; }
  }
}
async function merchantRentalSetVehicleStatus(vehicleId,status){
  const vehicle = (window._merchantRentalData?.vehicles || []).find(row => String(row.id) === String(vehicleId));
  if(!vehicle) return;
  vehicle.status = status;
  const merchantUserId = document.getElementById('merchantRentalManager')?.dataset.merchantUserId || activeMerchantWorkspaceId();
  try { await rentalApi.saveVehicle(merchantUserId,vehicle); showToast(status === 'inactive' ? '车辆已下架' : '车辆已重新上架'); renderMerchantRentalManager(); } catch(error){ showToast('车辆状态更新失败'); }
}
async function merchantRentalSetBookingStatus(bookingId,status){
  const note = status === 'rejected' || status === 'cancelled' ? (window.prompt('填写说明（选填）','') || '') : '';
  try { await rentalApi.setBookingStatus({bookingId,status,note}); showToast(`预约已${merchantRentalStatusText(status)}`); renderMerchantRentalManager(); } catch(error){ console.warn('更新租车预约失败:', error.message); showToast('更新失败，请确认该车辆没有时间冲突'); }
}
function rentalBookingById(bookingId){ return (window._merchantRentalData?.bookings || []).find(row => String(row.id) === String(bookingId)); }
function openMerchantRentalFinancialEditor(bookingId){
  const booking = rentalBookingById(bookingId), body = document.getElementById('merchantRentalManagerBody');
  if(!booking || !body) return;
  body.innerHTML = `<div class="merchant-order-top-actions"><button onclick="renderMerchantRentalManager()">← 返回预约列表</button></div>${booking.payment_method === 'stripe_test' ? '<div class="order-notice">此订单为 Stripe 测试付款，金额仅用于流程验证，未产生真实收款。</div>' : ''}<div class="merchant-form-field"><label>会员优惠金额</label><input id="rentalMemberDiscount" inputmode="decimal" value="${escAttr(booking.member_discount_amount || 0)}" placeholder="0"></div><div class="merchant-form-field"><label>优惠券优惠金额</label><input id="rentalCouponDiscount" inputmode="decimal" value="${escAttr(booking.coupon_discount_amount || 0)}" placeholder="0"></div><div class="merchant-form-field"><label>损坏费用</label><input id="rentalDamageAmount" inputmode="decimal" value="${escAttr(booking.damage_amount || 0)}" placeholder="0"></div><div class="merchant-form-field"><label>违章或其他费用</label><input id="rentalViolationAmount" inputmode="decimal" value="${escAttr(booking.violation_amount || 0)}" placeholder="0"></div><div class="merchant-form-field"><label>收款状态</label><select id="rentalPaymentStatus">${[['pending','待付款'],['paid','已收款'],['waived','免单'],['partial_refund','部分退款'],['refunded','已退款']].map(row => `<option value="${row[0]}" ${booking.payment_status === row[0] ? 'selected' : ''}>${row[1]}</option>`).join('')}</select></div><div class="merchant-form-field"><label>支付方式</label><select id="rentalPaymentMethod"><option value="">未填写</option>${[['stripe_test','Stripe 测试付款（未收款）'],['cash','现金'],['card','刷卡'],['online','在线支付（待接入）'],['bank_transfer','转账']].map(row => `<option value="${row[0]}" ${booking.payment_method === row[0] ? 'selected' : ''}>${row[1]}</option>`).join('')}</select></div><div class="merchant-form-field"><label>押金状态</label><select id="rentalDepositStatus">${[['not_collected','未收取'],['authorized','已预授权'],['collected','已收取'],['released','已退回'],['forfeited','已扣除'],['refunded','已退款']].map(row => `<option value="${row[0]}" ${booking.deposit_status === row[0] ? 'selected' : ''}>${row[1]}</option>`).join('')}</select></div><div class="merchant-form-field"><label>费用备注</label><textarea id="rentalFinancialNote" maxlength="400" placeholder="例如：会员月卡减免、维修赔偿说明">${escHtml(booking.financial_note || '')}</textarea></div><div class="order-notice">基础租金 ${merchantRentalMoney(booking.base_amount)}。金额会以“基础租金 - 会员优惠 - 优惠券优惠 + 损坏费用 + 违章费用”重新计算。</div><button class="merchant-reward-redeem-btn" style="margin-top:14px;" onclick="saveMerchantRentalFinancials('${escAttr(booking.id)}')">保存收款与优惠</button>`;
}
async function saveMerchantRentalFinancials(bookingId){
  const get = id => document.getElementById(id)?.value?.trim() || '0';
  try { await rentalApi.updateFinancials({p_booking_id:bookingId,p_member_discount_amount:get('rentalMemberDiscount'),p_coupon_discount_amount:get('rentalCouponDiscount'),p_damage_amount:get('rentalDamageAmount'),p_violation_amount:get('rentalViolationAmount'),p_payment_status:get('rentalPaymentStatus'),p_deposit_status:get('rentalDepositStatus'),p_payment_method:document.getElementById('rentalPaymentMethod')?.value || null,p_financial_note:document.getElementById('rentalFinancialNote')?.value || null}); showToast('租车费用已更新'); renderMerchantRentalManager(); } catch(error){ console.warn('更新租车费用失败:',error.message); showToast('费用更新失败，请检查填写的金额'); }
}
function openMerchantRentalExtensionEditor(bookingId){
  const booking = rentalBookingById(bookingId), body = document.getElementById('merchantRentalManagerBody');
  if(!booking || !body) return;
  const end = new Date(booking.ends_at); end.setMinutes(end.getMinutes() - end.getTimezoneOffset());
  body.innerHTML = `<div class="merchant-order-top-actions"><button onclick="renderMerchantRentalManager()">← 返回预约列表</button></div><div class="merchant-form-field"><label>预约编号</label><input disabled value="${escAttr(booking.booking_code || '')}"></div><div class="merchant-form-field"><label>新的还车时间</label><input id="rentalExtendEnd" type="datetime-local" value="${escAttr(end.toISOString().slice(0,16))}"></div><div class="merchant-form-field"><label>调整说明</label><textarea id="rentalExtendNote" maxlength="300" placeholder="例如：客户申请延长一天">${escHtml(booking.operator_note || '')}</textarea></div><div class="order-notice">系统会重新计算按日/小时租金，并检查新时间是否与其他预约冲突。现有的会员、优惠券、损坏和违章费用会继续保留。</div><button class="merchant-reward-redeem-btn" style="margin-top:14px;" onclick="saveMerchantRentalExtension('${escAttr(booking.id)}')">确认调整租期</button>`;
}
async function saveMerchantRentalExtension(bookingId){
  const raw = document.getElementById('rentalExtendEnd')?.value;
  if(!raw){ showToast('请选择新的还车时间'); return; }
  try { await rentalApi.extendBooking({bookingId,endsAt:new Date(raw).toISOString(),note:document.getElementById('rentalExtendNote')?.value || null}); showToast('租期与租金已更新'); renderMerchantRentalManager(); } catch(error){ console.warn('调整租期失败:',error.message); showToast(String(error.message||'').includes('conflict') ? '新租期与其他预约冲突，请换一个时间' : '调整失败，请检查还车时间'); }
}
function openMerchantFeatureCenter(){
  if(!(session && session.user && currentMerchant && String(currentMerchant.user_id) === String(session.user.id))){ showToast('只有店长可以管理商家功能'); return; }
  closeProfileMenu();
  renderMerchantFeatureCenter();
  document.getElementById('merchantFeatureCenter')?.classList.add('open');
}
function closeMerchantFeatureCenter(){ document.getElementById('merchantFeatureCenter')?.classList.remove('open'); }
function renderMerchantFeatureCenter(){
  const body = document.getElementById('merchantFeatureCenterBody');
  const merchant = currentMerchant;
  if(!body || !merchant) return;
  const enabled = merchantEnabledFeatures(merchant);
  const renderCard = feature => {
    const added = enabled.includes(feature.id);
    const disabled = !feature.live;
    const action = disabled
      ? `<button onclick="showMerchantFeatureRoadmap('${feature.id}')">即将开放</button>`
      : `<button class="${added ? 'active' : ''}" onclick="toggleMerchantFeature('${feature.id}')">${added ? '取消功能' : '添加功能'}</button>`;
    return `<div class="merchant-feature-card ${disabled ? 'is-planned' : ''}"><div class="merchant-feature-icon">${merchantFeatureIcon(feature)}</div><div><b>${escHtml(feature.title)}</b><p>${escHtml(feature.description)}</p></div>${action}</div>`;
  };
  const applicable = MERCHANT_FEATURE_CATALOG.filter(feature => merchantFeatureAppliesToMerchant(feature, merchant, enabled));
  const live = applicable.filter(feature => feature.live);
  const planned = applicable.filter(feature => !feature.live);
  const included = [
    { title:'商家页面基础功能', icon:'store' },
    { title:'AI 发文', icon:'edit' },
    { title:'商家店铺', icon:'bag' },
    { title:'会员功能', icon:'star' },
    { title:'优惠券核销', icon:'ticket' }
  ];
  const categoryHint = merchant.category ? `${merchant.category}${merchant.subcategory ? ` · ${merchant.subcategory}` : ''}` : '请先在商家资料中选择主营类型';
  body.innerHTML = `<div class="merchant-feature-intro"><b>商家开通即有：</b><p>以下基础功能无需额外添加，高级功能按需求开通。</p></div><div class="merchant-feature-included">${included.map(item => `<div class="merchant-feature-included-item"><span>${uiIcon(item.icon,16)}</span><b>${escHtml(item.title)}</b></div>`).join('')}</div><div class="merchant-feature-section-title">高级功能 <span>${enabled.filter(id => live.some(item => item.id === id)).length}/${live.length} 已添加</span></div><div class="merchant-feature-category-note">当前认证类型：${escHtml(categoryHint)}</div><div class="merchant-feature-list">${live.length ? live.map(renderCard).join('') : '<div class="deals-empty-panel">当前认证类型暂无可开通的高级功能。</div>'}</div>${planned.length ? `<div class="merchant-feature-section-title">后续功能 <span>逐步开放</span></div><div class="merchant-feature-list">${planned.map(renderCard).join('')}</div>` : ''}`;
}
function showMerchantFeatureRoadmap(featureId){
  const feature = MERCHANT_FEATURE_CATALOG.find(item => item.id === featureId);
  showToast(`${feature ? feature.title : '该功能'}将后续逐步开放，敬请期待`);
}
async function toggleMerchantFeature(featureId){
  const merchant = currentMerchant;
  const feature = MERCHANT_FEATURE_CATALOG.find(item => item.id === featureId);
  if(!merchant || !feature || !feature.live) return;
  const enabled = merchantEnabledFeatures(merchant);
  if(enabled.includes(featureId)){
    if(!confirm(`确定取消「${feature.title}」吗？现有功能数据不会被删除。`)) return;
    try { await saveMerchantEnabledFeatures(merchant, enabled.filter(id => id !== featureId)); showToast(`已取消${feature.title}`); }
    catch(error){ console.warn('取消商家功能失败:', error.message); showToast('保存失败，请先运行 5.247 SQL 后重试'); return; }
  } else {
    try { await saveMerchantEnabledFeatures(merchant, enabled.concat(featureId)); showToast(`已添加${feature.title}`); }
    catch(error){ console.warn('添加商家功能失败:', error.message); showToast('保存失败，请先运行 5.247 SQL 后重试'); return; }
  }
  renderMerchantFeatureCenter();
  renderMerchantPage();
}
function merchantContentHtml(m, opts){
  opts = opts || {};
  const isOwnerPage = !!opts.isOwnerPage;
  const notes = posts
    .filter(p => p.user_id === m.user_id)
    .sort((a,b) => new Date(b.created_at || b.time || 0) - new Date(a.created_at || a.time || 0))
    .slice(0, 6);
  const perks = Array.isArray(m.perks) ? m.perks : [];
  const couponCount = merchantCoupons(m).filter(merchantCouponAvailable).length;
  const socialLinks = merchantSocialLinks(m);
  const section = merchantActiveSection(m);
  const uidSafe = String(m.user_id || '').replace(/'/g, '');
  const merchantPublicId = m.user_id ? uidToNumericId(String(m.user_id)) : (m.store_id || merchantSiteSlug(m));
  const merchantLocationText = (m.address || '').replace(/^美国/, '').replace(/，邮编.*/, '').trim() || '乐生活认证商家';
  const merchantIntroText = m.intro || m.description || '这个商家还没有填写介绍。';
  const merchantHoursText = formatMerchantHoursForDisplay(m.business_hours);
  const merchantFeatures = merchantEnabledFeatures(m);
  const tableOrderEnabled = merchantFeatures.includes('table_order');
  const rentalEnabled = merchantFeatures.includes('rental');
  const bookingEnabled = merchantFeatures.includes('booking');
  const eventRegistrationEnabled = merchantFeatures.includes('event_registration');
  const ticketingEnabled = merchantFeatures.includes('ticketing');
  const autoSalesEnabled = merchantFeatures.includes('auto_sales');
  const retailEnabled = String(m.category || '').includes('零售') || String(m.subcategory || '').includes('零售');
  const sectionBody = section === 'store'
    ? merchantStoreHtml(m, isOwnerPage)
    : section === 'coupons'
      ? merchantCouponsHtml(m, isOwnerPage)
      : (notes.length ? `<div class="merchant-real-list">${notes.map(p => merchantNoteCardHtml(p, isOwnerPage)).join('')}</div>` : '<div class="deals-empty-panel">这个商家还没有发布动态。</div>');
  return `
    <div class="profile-cover-card">
      <div class="profile-cover-bg ${m.cover_image ? 'has-image' : ''}" style="${m.cover_image ? `background-image:linear-gradient(180deg,rgba(28,31,25,.12),rgba(28,31,25,.66)),url('${escAttr(m.cover_image)}');` : ''}">
      ${isOwnerPage ? `
        <button class="profile-cover-menu-btn" onclick="toggleMerchantOwnerMenu(event)" aria-label="菜单">${uiIcon('menu',19)}</button>
        <div class="profile-menu merchant-owner-menu" id="merchantOwnerMenu">
          <button onclick="copyMerchantSiteLink('${uidSafe}')">${uiIcon('share',15)}复制微网站链接</button>
          <button onclick="shareMerchantSiteLink('${uidSafe}')">${uiIcon('share',15)}转发店铺</button>
          <button onclick="openMerchantFeatureCenter()">${uiIcon('store',15)}功能中心</button>
          ${bookingEnabled ? `<button onclick="closeProfileMenu();openMerchantBookingManager('${uidSafe}')">${uiIcon('calendar',15)}预约管理</button>` : ''}
          ${eventRegistrationEnabled ? `<button onclick="closeProfileMenu();openMerchantEventsManager('${uidSafe}')">${uiIcon('calendar',15)}活动管理</button>` : ''}
          ${ticketingEnabled ? `<button onclick="closeProfileMenu();openMerchantTicketsManager('${uidSafe}')">${uiIcon('ticket',15)}票务管理</button>` : ''}
          <button onclick="closeProfileMenu();openShippingCenter()">${uiIcon('bag',15)}物流中心</button>
          <button onclick="closeProfileMenu();openMerchantEditSheet()">${uiIcon('edit',15)}编辑商家资料</button>
          <button onclick="closeProfileMenu();openMerchantTeamManager()">${uiIcon('user',15)}团队与矩阵账号</button>
          ${isDealAdmin ? `<button onclick="closeProfileMenu();switchTab('admin')">${uiIcon('settings',15)}管理后台</button>` : ''}
          <button onclick="closeProfileMenu();switchAccount()">${uiIcon('logout',15)}切换账号</button>
        </div>
      ` : ''}
        <div class="profile-cover-info">
          <div style="position:relative;flex-shrink:0;">
            <div class="profile-cover-avatar" style="overflow:hidden;padding:0;background:#fff;">
              ${m.logo ? `<img src="${escAttr(m.logo)}" alt="">` : `<span style="color:#fff;">${initials(m.business_name || '商')}</span>`}
            </div>
          </div>
          <div class="profile-cover-main">
            <div class="profile-cover-name-row">
              <div class="profile-cover-name">${escHtml(m.business_name || '还没有填写店名')}</div>
            </div>
            <div class="profile-cover-id">ID：${escHtml(String(merchantPublicId || '').replace('#',''))}</div>
            <div class="profile-cover-location">IP属地：${escHtml(merchantLocationText)}</div>
            <div class="profile-cover-bio">${escHtml(merchantIntroText)}</div>
            <div class="profile-cover-tags">
              <span>地址：${escHtml(m.address || '还没有填写地址')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="padding:0 16px;position:relative;">
      <div style="display:flex;align-items:center;gap:16px;margin-top:8px;font-size:13px;color:var(--ink-soft);" id="${isOwnerPage ? 'merchantStatsRow' : 'merchantPublicStatsRow'}">
        <span>${notes.length} 动态</span><span>${couponCount} 优惠券</span>
      </div>
      ${(m.business_hours || socialLinks.length || m.category) ? `
        <div class="merchant-mini-section">
          <b>${uiIcon('store',14)} 商家信息</b>
          ${m.category ? `<p>${merchantCategoryIcon(m.category,14)} ${escHtml(merchantCategoryLabel(m.category))}${m.subcategory ? (' / ' + escHtml(m.subcategory)) : ''}</p>` : ''}
          ${merchantHoursText ? `<p style="margin-top:${m.category ? '8px' : '0'};">营业时间：${escHtml(merchantHoursText)}</p>` : ''}
          ${socialLinks.length ? `<div class="merchant-link-row">${socialLinks.map(link => `<a href="${escAttr(link.url)}" target="_blank" rel="noopener">${merchantSocialIcon(link.label)}${escHtml(link.label)}</a>`).join('')}</div>` : ''}
        </div>
      ` : ''}
      <div style="display:flex;gap:10px;margin-top:14px;">
        <button onclick="callMerchantPhone('${escAttr(m.phone || '')}')" style="flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:10px;border:none;border-radius:10px;background:var(--sage);color:#fff;font-size:13.5px;font-weight:700;text-decoration:none;">${uiIcon('phone',15)} Call</button>
        <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.address || m.business_name || '')}" target="_blank" rel="noopener" style="flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:10px;border:1.5px solid var(--line-strong);border-radius:10px;background:var(--card);color:var(--ink);font-size:13.5px;font-weight:700;text-decoration:none;">${uiIcon('map',15)} 导航</a>
      </div>
      ${tableOrderEnabled ? `<div class="merchant-mini-section" style="margin-top:14px;"><b>${uiIcon('bag',14)} 点餐服务</b><p>扫码点餐可选择餐桌；外卖点单可选择自提或送餐上门；扫码排队可提前点菜。</p>${isOwnerPage ? `<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:10px;"><button onclick="openMerchantOrderManager('${uidSafe}')" style="border:none;border-radius:10px;padding:10px 6px;background:var(--sage);color:#fff;font:800 12px inherit;">${uiIcon('store',14)} 点餐订单</button><button onclick="openMerchantTakeoutManager('${uidSafe}')" style="border:1px solid var(--sage);border-radius:10px;padding:10px 6px;background:#fff;color:var(--sage-dark);font:800 12px inherit;">${uiIcon('bag',14)} 外卖订单</button><button onclick="openMerchantQueueManager('${uidSafe}')" style="border:1px solid var(--sage);border-radius:10px;padding:10px 6px;background:#fff;color:var(--sage-dark);font:800 12px inherit;">${uiIcon('user',14)} 扫码排队</button></div>` : `<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:10px;"><button onclick="openMerchantOrderEntry('${uidSafe}')" style="border:none;border-radius:10px;padding:10px 5px;background:var(--sage);color:#fff;font:800 12px inherit;">${uiIcon('store',14)} 扫码点餐</button><button onclick="openMerchantTakeoutOrder('${uidSafe}')" style="border:1px solid var(--sage);border-radius:10px;padding:10px 5px;background:#fff;color:var(--sage-dark);font:800 12px inherit;">${uiIcon('bag',14)} 外卖点单</button><button onclick="openMerchantQueuePage('${uidSafe}')" style="border:1px solid var(--sage);border-radius:10px;padding:10px 5px;background:#fff;color:var(--sage-dark);font:800 12px inherit;">${uiIcon('user',14)} 扫码排队</button></div>`}</div>` : ''}
      ${rentalEnabled ? `<div class="merchant-mini-section" style="margin-top:14px;"><b>${uiIcon('car',14)} 租车预约</b><p>按日或小时预约，商家确认后安排取车；押金和付款状态由商家统一管理。</p>${isOwnerPage ? `<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:10px;"><button onclick="openMerchantRentalManager('${uidSafe}')" style="border:none;border-radius:10px;padding:10px 6px;background:var(--sage);color:#fff;font:800 12px inherit;">${uiIcon('settings',14)} 车辆与预约</button><button onclick="openMerchantRentalPage('${uidSafe}')" style="border:1px solid var(--sage);border-radius:10px;padding:10px 6px;background:#fff;color:var(--sage-dark);font:800 12px inherit;">${uiIcon('car',14)} 查看预约页</button></div>` : `<button onclick="openMerchantRentalPage('${uidSafe}')" style="width:100%;margin-top:10px;border:0;border-radius:10px;padding:10px 6px;background:var(--sage);color:#fff;font:800 13px inherit;">${uiIcon('car',14)} 查看车辆并预约</button>`}</div>` : ''}
      ${bookingEnabled ? `<div class="merchant-mini-section" style="margin-top:14px;"><b>${uiIcon('calendar',14)} 预约服务</b><p>选择服务、日期和时段，提交姓名与电话后由商家确认。</p>${isOwnerPage ? `<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:10px;"><button onclick="openMerchantBookingManager('${uidSafe}')" style="border:none;border-radius:10px;padding:10px 6px;background:var(--sage);color:#fff;font:800 12px inherit;">${uiIcon('settings',14)} 预约管理</button><button onclick="openMerchantBookingPage('${uidSafe}')" style="border:1px solid var(--sage);border-radius:10px;padding:10px 6px;background:#fff;color:var(--sage-dark);font:800 12px inherit;">${uiIcon('calendar',14)} 查看预约页</button></div>` : `<button onclick="openMerchantBookingPage('${uidSafe}')" style="width:100%;margin-top:10px;border:0;border-radius:10px;padding:10px 6px;background:var(--sage);color:#fff;font:800 13px inherit;">${uiIcon('calendar',14)} 立即预约</button>`}</div>` : ''}
      ${eventRegistrationEnabled ? `<div class="merchant-mini-section" style="margin-top:14px;"><b>${uiIcon('calendar',14)} 活动报名</b><p>查看活动日期、剩余名额和报名限制；提交姓名与电话后完成报名。</p>${isOwnerPage ? `<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:10px;"><button onclick="openMerchantEventsManager('${uidSafe}')" style="border:none;border-radius:10px;padding:10px 6px;background:var(--sage);color:#fff;font:800 12px inherit;">${uiIcon('settings',14)} 活动管理</button><button onclick="openMerchantEventsPage('${uidSafe}')" style="border:1px solid var(--sage);border-radius:10px;padding:10px 6px;background:#fff;color:var(--sage-dark);font:800 12px inherit;">${uiIcon('calendar',14)} 查看报名页</button></div>` : `<button onclick="openMerchantEventsPage('${uidSafe}')" style="width:100%;margin-top:10px;border:0;border-radius:10px;padding:10px 6px;background:var(--sage);color:#fff;font:800 13px inherit;">${uiIcon('calendar',14)} 查看活动并报名</button>`}</div>` : ''}
      ${ticketingEnabled ? `<div class="merchant-mini-section" style="margin-top:14px;"><b>${uiIcon('ticket',14)} 票务与核销</b><p>购买活动门票后生成二维码；商家现场核销，免费票可即时领取。</p>${isOwnerPage ? `<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:10px;"><button onclick="openMerchantTicketsManager('${uidSafe}')" style="border:none;border-radius:10px;padding:10px 6px;background:var(--sage);color:#fff;font:800 12px inherit;">${uiIcon('settings',14)} 票务管理</button><button onclick="openMerchantTicketsPage('${uidSafe}')" style="border:1px solid var(--sage);border-radius:10px;padding:10px 6px;background:#fff;color:var(--sage-dark);font:800 12px inherit;">${uiIcon('ticket',14)} 查看售票页</button></div>` : `<button onclick="openMerchantTicketsPage('${uidSafe}')" style="width:100%;margin-top:10px;border:0;border-radius:10px;padding:10px 6px;background:var(--sage);color:#fff;font:800 13px inherit;">${uiIcon('ticket',14)} 查看票务并购票</button>`}</div>` : ''}
      ${autoSalesEnabled ? `<div class="merchant-mini-section" style="margin-top:14px;"><b>${uiIcon('car',14)} 二手车买卖</b><div style="display:grid;grid-template-columns:repeat(${isOwnerPage ? 3 : 2},minmax(0,1fr));gap:8px;margin-top:10px;">${isOwnerPage ? `<button onclick="openMerchantAutoManager('${uidSafe}')" style="border:none;border-radius:10px;padding:10px 6px;background:var(--sage);color:#fff;font:800 12px inherit;">${uiIcon('settings',14)} 管理</button>` : ''}<button onclick="openMerchantAutoPage('${uidSafe}','buy')" style="border:1px solid var(--sage);border-radius:10px;padding:10px 6px;background:#fff;color:var(--sage-dark);font:800 12px inherit;">${uiIcon('car',14)} 买车</button><button onclick="openMerchantAutoPage('${uidSafe}','sell')" style="border:1px solid var(--sage);border-radius:10px;padding:10px 6px;background:#fff;color:var(--sage-dark);font:800 12px inherit;">${uiIcon('car',14)} 卖车</button></div></div>` : ''}
      ${retailEnabled && isOwnerPage ? `<div class="merchant-mini-section" style="margin-top:14px;"><b>${uiIcon('bag',14)} 零售经营</b><p>处理顾客自取订单，并通过扫码入库、出库和盘点管理商品库存。</p><div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:10px;"><button onclick="openMerchantRetailManager('${uidSafe}')" style="border:0;border-radius:10px;padding:10px 6px;background:var(--sage);color:#fff;font:800 12px inherit;">${uiIcon('bag',14)} 零售订单</button><button onclick="openMerchantInventoryManager('${uidSafe}')" style="border:1px solid var(--sage);border-radius:10px;padding:10px 6px;background:#fff;color:var(--sage-dark);font:800 12px inherit;">${uiIcon('store',14)} 扫码库存</button></div></div>` : ''}
      ${isOwnerPage && merchantFeatures.includes('shipping') ? `<div class="merchant-mini-section" style="margin-top:14px;"><b>${uiIcon('bag',14)} 物流发货</b><p>录入商品包装码与自购物流运单，并查看乐生活面单额度和邮资预检。</p><button onclick="openShippingCenter()" style="width:100%;margin-top:10px;border:0;border-radius:10px;padding:10px 6px;background:var(--sage);color:#fff;font:800 13px inherit;">${uiIcon('bag',14)} 进入物流中心</button></div>` : ''}
      ${isOwnerPage ? `<div class="merchant-mini-section" style="margin-top:14px;"><b>${uiIcon('settings',14)} 商家管理后台</b><p>统一查看经营概览，并进入点餐、会员、优惠券、内容、团队和已开通的业务功能。</p><button onclick="openMerchantManagementCenter('${uidSafe}')" style="width:100%;margin-top:10px;border:0;border-radius:10px;padding:10px 6px;background:var(--sage-dark);color:#fff;font:800 13px inherit;">${uiIcon('settings',14)} 进入商家管理后台</button></div>` : ''}
      <div style="margin-top:14px;padding:14px;background:var(--sage-dark);border-radius:14px;">
        <div style="display:flex;align-items:center;gap:6px;color:#fff;font-size:14px;font-weight:700;">${uiIcon('bag',15)} 会员优惠规则</div>
        <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;">
          ${perks.length ? perks.map(p => `<span style="background:rgba(255,255,255,0.16);color:#fff;font-size:12px;padding:4px 10px;border-radius:8px;">${escHtml(p)}</span>`).join('') : '<span style="color:rgba(255,255,255,0.75);font-size:12px;">还没有设置优惠</span>'}
        </div>
        <div style="margin-top:10px;font-size:12px;color:rgba(255,255,255,0.85);">集${m.loyalty_target || 8}次消费换「${escHtml(m.loyalty_reward || '免费一杯')}」</div>
        ${merchantMembershipHtml(m, isOwnerPage)}
      </div>
    </div>
    <div style="height:8px;background:var(--bg-alt);margin:16px 0 0;"></div>
    <div class="merchant-section-tabs">
      <button class="${section === 'posts' ? 'on' : ''}" onclick="switchMerchantSection('${uidSafe}','posts')">最新动态</button>
      <button class="${section === 'store' ? 'on' : ''}" onclick="switchMerchantSection('${uidSafe}','store')">店铺</button>
      <button class="${section === 'coupons' ? 'on' : ''}" onclick="switchMerchantSection('${uidSafe}','coupons')">优惠券</button>
    </div>
    <div style="padding:14px 16px 4px;">
      <div class="deals-section-header" style="margin:0 0 10px;">
        ${section === 'store' ? ((rentalEnabled || autoSalesEnabled) ? '车辆库' : '店铺') : section === 'coupons' ? '优惠券' : '最新动态'}
        ${section === 'store' && autoSalesEnabled && isOwnerPage ? `<button onclick="openMerchantAutoManager('${uidSafe}')" style="margin-left:auto;border:0;border-radius:8px;background:var(--sage);color:#fff;padding:7px 10px;font:800 12px inherit;">${uiIcon('settings',13)} 二手车管理</button>` : section === 'store' && rentalEnabled && isOwnerPage ? `<button onclick="openMerchantRentalManager('${uidSafe}')" style="margin-left:auto;border:0;border-radius:8px;background:var(--sage);color:#fff;padding:7px 10px;font:800 12px inherit;">${uiIcon('settings',13)} 租车管理后台</button>` : `<span>${section === 'store' ? ((rentalEnabled || autoSalesEnabled) ? '可预约 / 在售车辆' : '商品 / 服务列表') : section === 'coupons' ? '到店出示使用' : '来自商家真实发布'}</span>`}
      </div>
      ${sectionBody}
    </div>
  `;
}

/* 渲染认证商家专属主页（"我"页在已认证商家账号下显示的内容） */
function renderMerchantPage(){
  const m = currentMerchant;
  const wrap = document.getElementById('merchantPageWrap');
  if(!m || !wrap) return;
  wrap.innerHTML = merchantContentHtml(m, { isOwnerPage: true });
  loadMerchantStats(m.user_id);
  Promise.all([loadMerchantMemberships(m.user_id, true), loadMerchantMemberTransactions(m.user_id, true)]).then(() => {
    if(currentMerchant && currentMerchant.user_id === m.user_id && currentTab === 'profile'){
      wrap.innerHTML = merchantContentHtml(currentMerchant, { isOwnerPage: true });
      loadMerchantStats(m.user_id);
    }
  });
  loadMerchantDeals(m).then(() => {
    if(currentMerchant && currentMerchant.user_id === m.user_id && currentTab === 'profile'){
      wrap.innerHTML = merchantContentHtml(currentMerchant, { isOwnerPage: true });
      loadMerchantStats(m.user_id);
    }
  });
}
/* 拉取商家主页真实的关注数/点赞数 */
async function loadMerchantStats(merchantId){
  try {
    if(!merchantPublicApi) throw new Error('商家资料接口未初始化');
    const { followers, likes } = await merchantPublicApi.loadStats(merchantId);
    const row = document.getElementById('merchantStatsRow');
    if(row) row.innerHTML = `<span>${followers.length} 关注</span><span>♥ ${likes.length}</span>`;
  } catch(e){ console.warn('商家统计加载失败:', e.message); }
}
async function loadMerchantDeals(m){
  if(!m) return [];
  try {
    const select = 'id,merchant_id,retailer_name,product_name,product_name_cn,original_price,current_price,unit,percent_off,save_amount,location,source_url,price_note,ai_summary_cn,source_type,updated_at,deal_date';
    if(!merchantPublicApi) throw new Error('商家资料接口未初始化');
    m._deals = await merchantPublicApi.loadDeals({ merchantId:m.id, businessName:m.business_name, select, limit:8 });
    return m._deals;
  } catch(e){
    console.warn('商家优惠加载失败:', e.message);
    m._deals = [];
    return [];
  }
}
function merchantMembershipCacheKey(merchantUserId){
  return String(merchantUserId || '');
}
function cachedMerchantMemberships(merchantUserId){
  const key = merchantMembershipCacheKey(merchantUserId);
  const cache = window._merchantMembershipCache || {};
  return cache[key] || { rows: [], missing: false, loaded: false };
}
function setMerchantMembershipCache(merchantUserId, value){
  window._merchantMembershipCache = window._merchantMembershipCache || {};
  window._merchantMembershipCache[merchantMembershipCacheKey(merchantUserId)] = value;
}
function isMerchantMember(merchantUserId){
  const me = session && session.user ? session.user.id : '';
  if(!me || !merchantUserId) return false;
  return cachedMerchantMemberships(merchantUserId).rows.some(r => r.user_id === me && (r.status || 'active') === 'active');
}
async function loadMerchantMemberships(merchantUserId, force){
  if(!merchantUserId) return [];
  const cache = cachedMerchantMemberships(merchantUserId);
  if(cache.loaded && !force) return cache.rows;
  try {
    if(!merchantMembershipApi) throw new Error('商家会员接口未初始化');
    const select = 'id,merchant_user_id,user_id,user_name,user_avatar,status,points,stamp_count,joined_at,updated_at';
    const rows = await merchantMembershipApi.loadForMerchant({ merchantUserId, select, limit:80 });
    setMerchantMembershipCache(merchantUserId, { rows, missing:false, loaded:true });
    const uncached = rows.map(row => row.user_id).filter(id => id && !window._profileCache[id]);
    if(uncached.length) loadProfilesForIds(uncached).then(() => {
      if(document.getElementById('merchantMemberManager')?.classList.contains('open')) renderMerchantMemberManager();
      if(currentTab === 'profile' && currentMerchant && currentMerchant.user_id === merchantUserId) renderMerchantPage();
    });
    return rows;
  } catch(e){
    console.warn('商家会员加载失败:', e.message);
    setMerchantMembershipCache(merchantUserId, { rows:[], missing:true, loaded:true });
    return [];
  }
}
function merchantMemberDisplayName(){
  return myNick() || (session && session.user && session.user.email ? session.user.email.split('@')[0] : '乐生活用户');
}
function merchantMemberAvatar(){
  if(typeof currentUser !== 'undefined' && currentUser.avatar) return currentUser.avatar;
  return session && session.user ? resolveAvatarUrl(session.user.id) : '';
}
async function joinMerchantMembership(merchantUserId){
  if(!(session && session.user)){
    showToast('请先登录后加入会员');
    openProfileLogin();
    return;
  }
  if(!merchantUserId || session.user.id === merchantUserId){
    showToast('这是你的商家主页');
    return;
  }
  try {
    const payload = {
      merchant_user_id: merchantUserId,
      user_id: session.user.id,
      user_name: merchantMemberDisplayName(),
      user_avatar: merchantMemberAvatar(),
      status: 'active',
      updated_at: new Date().toISOString()
    };
    if(!merchantMembershipApi) throw new Error('商家会员接口未初始化');
    await merchantMembershipApi.upsert(payload);
    await loadMerchantMemberships(merchantUserId, true);
    await loadUserMembershipCards(true);
    refreshMerchantPublicByUserId(merchantUserId);
    if(currentMerchant && currentMerchant.user_id === merchantUserId) renderMerchantPage();
    showToast('已加入商家会员');
  } catch(e){
    console.warn('加入商家会员失败:', e.message);
    showToast('加入失败，请确认已执行会员数据库脚本');
  }
}
async function leaveMerchantMembership(merchantUserId){
  if(!(session && session.user)){
    openProfileLogin();
    return;
  }
  try {
    if(!merchantMembershipApi) throw new Error('商家会员接口未初始化');
    await merchantMembershipApi.remove({ merchantUserId, userId:session.user.id });
    await loadMerchantMemberships(merchantUserId, true);
    await loadUserMembershipCards(true);
    refreshMerchantPublicByUserId(merchantUserId);
    showToast('已取消会员');
  } catch(e){
    console.warn('取消商家会员失败:', e.message);
    showToast('暂时无法取消，请稍后再试');
  }
}
function refreshMerchantPublicByUserId(merchantUserId){
  const overlay = document.getElementById('merchantPublicOverlay');
  const body = document.getElementById('merchantPublicBody');
  if(!overlay || !body || !overlay.classList.contains('open')) return;
  if(String(overlay.dataset.userId || '') !== String(merchantUserId || '')) return;
  const m = window._merchantIdentityCache && window._merchantIdentityCache[merchantUserId];
  if(m) body.innerHTML = merchantContentHtml(m, { isOwnerPage:false });
}
function merchantMemberItemHtml(member){
  const profile = cachedProfile(member.user_id, member.user_name);
  const name = profile.name || member.user_name || '乐生活用户';
  const avatar = resolveAvatarUrl(member.user_id) || profile.avatar || member.user_avatar;
  const joined = member.joined_at ? new Date(member.joined_at).toLocaleDateString('zh-CN') : '刚加入';
  return `
    <div class="merchant-member-item">
      <div class="merchant-member-avatar" onclick="openUserPublicPage('${String(member.user_id || '').replace(/'/g,'')}','${String(name).replace(/'/g,'')}')" style="cursor:pointer;">${avatar ? `<img src="${escAttr(avatar)}" alt="">` : escHtml(initials(name))}</div>
      <div style="min-width:0;flex:1;">
        <div class="merchant-member-name">${escHtml(name)}</div>
        <div class="merchant-member-date">加入于 ${escHtml(joined)} · ${Number(member.stamp_count || 0)} 次记录</div>
      </div>
    </div>
  `;
}
function merchantMembershipHtml(m, isOwnerPage){
  const merchantUserId = m.user_id || '';
  const cache = cachedMerchantMemberships(merchantUserId);
  const members = cache.rows || [];
  const joined = isMerchantMember(merchantUserId);
  if(cache.missing){
    return `
      <div class="merchant-member-row">
        <div class="merchant-member-meta"><b>会员体系未启用</b>运行 5.20 SQL 后可加入会员</div>
      </div>
    `;
  }
  if(isOwnerPage){
    const txRows = (cachedMerchantTransactions(merchantUserId).rows || []).filter(tx => memberTransactionKind(tx) !== 'reward_reversal');
    const recentMemberIds = [...new Set(txRows.map(tx => String(tx.membership_id)))].slice(0, 3);
    const preview = recentMemberIds.map(id => members.find(member => String(member.id) === id)).filter(Boolean);
    return `
      <div class="merchant-member-row">
        <div class="merchant-member-meta"><b>${members.length} 位会员</b>最近消费会员如下</div>
        <button class="merchant-member-action owner" onclick="openMerchantMemberManager('${String(merchantUserId).replace(/'/g,'')}')">会员管理</button>
      </div>
      ${preview.length ? `<div class="merchant-member-list">${preview.map(merchantMemberItemHtml).join('')}</div>` : '<div style="margin-top:10px;color:rgba(255,255,255,.72);font-size:12px;">暂时还没有消费记录。</div>'}
    `;
  }
  if(session && session.user && session.user.id === merchantUserId){
    return '';
  }
  if(joined){
    return `
      <div class="merchant-member-row">
        <div class="merchant-member-meta"><b>已是会员</b>可在店内出示会员身份</div>
        <button class="merchant-member-action joined" onclick="leaveMerchantMembership('${String(merchantUserId).replace(/'/g,'')}')">取消会员</button>
      </div>
    `;
  }
  return `
    <div class="merchant-member-row">
      <div class="merchant-member-meta"><b>${members.length} 位会员</b>${session && session.user ? '加入后可享受会员优惠' : '登录后可加入会员'}</div>
      <button class="merchant-member-action" onclick="joinMerchantMembership('${String(merchantUserId).replace(/'/g,'')}')">${session && session.user ? '成为会员' : '登录加入'}</button>
    </div>
  `;
}
/* Removed overridden openMerchantMemberManager implementation during v5.510 cleanup. */

function closeMerchantMemberManager(){
  document.getElementById('merchantMemberManager')?.classList.remove('open');
  leaveMerchantMatrixWorkspace();
}
function renderMerchantMemberManager(){
  const body = document.getElementById('merchantMemberManagerBody');
  if(!body) return;
  const merchantUserId = window._activeMerchantMemberManagerId || activeMerchantWorkspaceId();
  const cache = cachedMerchantMemberships(merchantUserId);
  const members = cache.rows || [];
  if(cache.missing){
    body.innerHTML = '<div class="deals-empty-panel">请先运行 5.20 会员数据库脚本。</div>';
    return;
  }
  if(!cache.loaded){
    body.innerHTML = '<div class="deals-empty-panel">正在读取会员数据...</div>';
    return;
  }
  const txCache = cachedMerchantTransactions(merchantUserId);
  const today = new Date().toLocaleDateString('zh-CN');
  const weekday = new Intl.DateTimeFormat('zh-CN', { weekday:'long' }).format(new Date());
  const todayTxCount = (txCache.rows || []).filter(tx => tx.created_at && new Date(tx.created_at).toLocaleDateString('zh-CN') === today).length;
  const latestMembers = members.slice().sort((a,b) => new Date(b.joined_at || 0) - new Date(a.joined_at || 0)).slice(0, 10);
  const recentSpendMemberIds = [...new Set((txCache.rows || []).filter(tx => memberTransactionKind(tx) !== 'reward_reversal').map(tx => String(tx.membership_id)))].slice(0, 10);
  const recentSpendMembers = recentSpendMemberIds.map(id => members.find(member => String(member.id) === id)).filter(Boolean);
  const workspaceMerchant = merchantOperatorWorkspace() || {};
  const merchantName = workspaceMerchant.business_name || '我的店铺';
  const merchantLogo = workspaceMerchant.logo;
  body.innerHTML = `
    <div class="merchant-dash-card" style="box-shadow:none;display:flex;align-items:center;gap:12px;">
      <div class="merchant-member-avatar" style="width:46px;height:46px;background:var(--sage-light);color:var(--sage-dark);">${merchantLogo ? `<img src="${escAttr(merchantLogo)}" alt="">` : escHtml(initials(merchantName))}</div>
      <div><div style="font-size:15px;font-weight:900;color:var(--ink);">${escHtml(merchantName)}</div><div class="merchant-dash-sub">${escHtml(today)} · ${escHtml(weekday)}</div></div>
    </div>
    <div class="merchant-member-summary">
      <div><b>${members.length}</b><span>当前会员</span></div>
      <div><b>${todayTxCount}</b><span>今日核销 / 兑换</span></div>
    </div>
    <div class="merchant-checkin-panel">
      <div class="merchant-checkin-title">扫码 / 输入会员号核销</div>
      <div class="merchant-checkin-sub">让用户打开“出示会员卡”，输入 LSH 开头的会员号，即可自动累计。</div>
      <div class="merchant-checkin-form">
        <input id="merchantCheckinCode" placeholder="LSH-000001" autocomplete="off">
        <button onclick="findMerchantMemberByCode()">查找</button>
      </div>
      <div class="merchant-checkin-actions">
        <button onclick="openMerchantMemberScanner()">打开扫码</button>
      </div>
      <div id="merchantCheckinResult" class="merchant-dash-sub" style="margin-top:10px;">查找到会员后会自动打开操作页面。</div>
    </div>
    ${merchantTransactionPanelHtml(merchantUserId)}
    <div style="font-size:13px;font-weight:900;margin:16px 0 8px;">近期新加入会员</div>
    ${latestMembers.length ? `<div class="merchant-member-manage-list">${latestMembers.map(merchantMemberManageCardHtml).join('')}</div>` : '<div class="deals-empty-panel">还没有用户加入会员。</div>'}
    <div style="font-size:13px;font-weight:900;margin:20px 0 8px;">最近消费会员</div>
    ${recentSpendMembers.length ? `<div class="merchant-member-manage-list">${recentSpendMembers.map(merchantMemberManageCardHtml).join('')}</div>` : '<div class="deals-empty-panel">暂时还没有消费记录。</div>'}
  `;
}
function merchantMemberManageCardHtml(member){
  const profile = cachedProfile(member.user_id, member.user_name);
  const name = profile.name || member.user_name || '乐生活用户';
  const avatar = resolveAvatarUrl(member.user_id) || profile.avatar || member.user_avatar;
  const joined = member.joined_at ? new Date(member.joined_at).toLocaleDateString('zh-CN') : '刚加入';
  const stamps = Number(member.stamp_count || 0);
  const points = Number(member.points || 0);
  const merchant = merchantOperatorWorkspace() || {};
  const rewardInfo = merchantRewardInfo(member, merchant);
  const tier = memberTierInfo(member, merchant);
  const birthdayText = isBirthdayMonth(profile.birth) && merchant.birthday_reward ? ` · 本月生日权益` : '';
  return `
    <div class="merchant-member-manage-card" onclick="openMerchantMemberDetail(${JSON.stringify(member.id)})" style="cursor:pointer;">
      <div class="merchant-member-manage-top">
        <div class="merchant-member-avatar" onclick="event.stopPropagation();openUserPublicPage('${String(member.user_id || '').replace(/'/g,'')}','${String(name).replace(/'/g,'')}')" style="background:var(--bg-alt);color:var(--sage-dark);cursor:pointer;">${avatar ? `<img src="${escAttr(avatar)}" alt="">` : escHtml(initials(name))}</div>
        <div style="min-width:0;flex:1;">
          <div class="name">${escHtml(name)}</div>
          <div class="meta">${escHtml(tier.name)} · 加入于 ${escHtml(joined)}${birthdayText}</div>
        </div>
      </div>
      <div class="merchant-member-metrics">
        <div class="merchant-member-metric"><b>${stamps}</b><span>消费次数</span></div>
        <div class="merchant-member-metric"><b>${points}</b><span>积分</span></div>
      </div>
      ${memberRewardProgressHtml(member, merchant)}
      <div style="font-size:12px;color:var(--sage-dark);font-weight:900;margin-top:10px;">点击查看会员资料与操作 ›</div>
    </div>
  `;
}
function activeMerchantMemberById(id){
  const merchantUserId = window._activeMerchantMemberManagerId || activeMerchantWorkspaceId();
  return cachedMerchantMemberships(merchantUserId).rows.find(r => String(r.id) === String(id));
}
async function updateMerchantMembershipRow(id, patch, audit){
  const merchantUserId = window._activeMerchantMemberManagerId || activeMerchantWorkspaceId();
  if(!canOperateMerchantWorkspace() || !merchantUserId){
    showToast('你没有这家商店的会员操作权限');
    return false;
  }
  try {
    const body = Object.assign({}, patch, { updated_at: new Date().toISOString() });
    await merchantMembershipApi.update({membershipId:id,merchantUserId,patch:body});
    let transaction = null;
    if(audit) transaction = await logMerchantMemberTransaction(audit);
    if(audit && Number(audit.pointsDelta || 0) !== 0){
      await logMerchantMemberTransaction({
        membership:audit.membership,
        action:'points',
        delta:Number(audit.pointsDelta),
        before:Number(audit.pointsBefore || 0),
        after:Number(audit.pointsAfter || 0),
        source:audit.source || 'manual',
        note:'消费自动积分'
      });
    }
    if(audit && audit.membership && audit.membership.user_id){
      const isPoints = audit.action === 'points';
      const positive = Number(audit.delta || 0) >= 0;
      const label = isPoints ? '积分' : '消费次数';
      const autoPoints = Number(audit.pointsDelta || 0);
      await createMemberActivityNotification({
        userId:audit.membership.user_id,
        membershipId:audit.membership.id,
        transactionId:transaction && transaction.id,
        kind:isPoints ? 'points' : 'stamp',
        title:autoPoints ? '到店消费已累计' : `${label}${positive ? '已累计' : '已调整'}`,
        body:autoPoints
          ? `${merchantOperatorWorkspace() && merchantOperatorWorkspace().business_name || '商家'} 已为你累计消费 ${Math.abs(Number(audit.delta || 0))} 次，并增加 ${autoPoints} 积分。`
          : `${merchantOperatorWorkspace() && merchantOperatorWorkspace().business_name || '商家'} ${positive ? '已为你' : '已将你的'}${label}${positive ? `增加 ${Math.abs(Number(audit.delta || 0))}` : `调整 ${Number(audit.delta || 0)}`}${isPoints ? ' 分' : ' 次'}。`
      });
    }
    if(audit) window._merchantLastOperation = { membershipId:String(id), text:audit.toast || '会员操作已完成' };
    clearMemberCardTransactionCache(id);
    refreshUserMembershipCardCache(audit && audit.membership ? audit.membership : { id }, body);
    await loadMerchantMemberships(merchantUserId, true);
    await loadMerchantMemberTransactions(merchantUserId, true);
    renderMerchantMemberManager();
    if(currentMerchant && !merchantMatrixActiveWorkspace) renderMerchantPage();
    if(document.getElementById('merchantMemberDetail')?.classList.contains('open')) renderMerchantMemberDetail();
    showToast(audit && audit.toast ? audit.toast : '会员记录已更新');
    return true;
  } catch(e){
    console.warn('会员记录更新失败:', e.message);
    showToast('更新失败，请稍后再试');
    return false;
  }
}
function adjustMerchantMemberValue(id, field, delta){
  const member = activeMerchantMemberById(id);
  if(!member) return;
  const before = Number(member[field] || 0);
  const next = Math.max(0, before + delta);
  updateMerchantMembershipRow(id, { [field]: next }, {
    membership: member, action: field === 'stamp_count' ? 'stamp' : 'points',
    delta, before, after: next, source: 'manual', toast: '会员记录已更新'
  });
}
function closeMerchantMemberDetail(){ document.getElementById('merchantMemberDetail')?.classList.remove('open'); }
async function openMerchantMemberDetail(id, context){
  const member = activeMerchantMemberById(id);
  if(!member){ showToast('没有找到该会员'); return; }
  window._activeMerchantMemberDetailId = member.id;
  window._merchantMemberOperationContext = context || 'manual';
  window._merchantQuickAction = 'stamp';
  document.getElementById('merchantMemberDetail')?.classList.add('open');
  await loadProfilesForIds([member.user_id]);
  renderMerchantMemberDetail();
}
function renderMerchantMemberDetail(){
  const body = document.getElementById('merchantMemberDetailBody');
  const member = activeMerchantMemberById(window._activeMerchantMemberDetailId);
  if(!body || !member) return;
  const profile = cachedProfile(member.user_id, member.user_name);
  const name = profile.name || member.user_name || '乐生活用户';
  const avatar = resolveAvatarUrl(member.user_id) || profile.avatar;
  const merchant = merchantOperatorWorkspace() || {};
  const reward = merchantRewardInfo(member, merchant);
  const quickAction = window._merchantQuickAction || 'stamp';
  const operationContext = window._merchantMemberOperationContext || 'manual';
  const operationHint = operationContext === 'qr_checkin' ? '已通过扫码识别会员卡，请确认本次操作。' : operationContext === 'code_checkin' ? '已通过会员号找到用户，请确认本次操作。' : '选择本次到店操作后确认执行。';
  const lastOperation = window._merchantLastOperation && String(window._merchantLastOperation.membershipId) === String(member.id) ? window._merchantLastOperation.text : '';
  const cardId = memberCardPublicId(member);
  const txRows = (cachedMerchantTransactions(activeMerchantWorkspaceId()).rows || []).filter(tx => String(tx.membership_id) === String(member.id)).slice(0, 8);
  body.innerHTML = `
    <div class="merchant-dash-card" style="box-shadow:none;">
      <div style="display:flex;align-items:center;gap:12px;">
        <div class="merchant-member-avatar" onclick="openUserPublicPage('${String(member.user_id || '').replace(/'/g,'')}','${String(name).replace(/'/g,'')}')" style="width:60px;height:60px;cursor:pointer;background:var(--bg-alt);">${avatar ? `<img src="${escAttr(avatar)}" alt="">` : escHtml(initials(name))}</div>
        <div style="min-width:0;flex:1;"><b style="font-size:17px;display:block;">${escHtml(name)}</b><span style="font-size:12px;color:var(--ink-faint);">会员号 ${escHtml(cardId)} · ${member.joined_at ? '加入于 '+escHtml(new Date(member.joined_at).toLocaleDateString('zh-CN')) : ''}</span></div>
      </div>
      <div class="merchant-member-summary" style="margin:16px 0 0;"><div><b>${Number(member.stamp_count || 0)}</b><span>消费次数</span></div><div><b>${Number(member.points || 0)}</b><span>积分</span></div></div>
      ${memberRewardProgressHtml(member, merchant)}
      ${memberTierBenefitsHtml(member, merchant, profile.birth)}
    </div>
    <div class="merchant-checkin-panel" style="margin-top:14px;">
      <div class="merchant-checkin-title">本次到店操作</div>
      <div class="merchant-checkin-sub">${escHtml(operationHint)}</div>
      <div class="member-tx-filter" style="margin:0 0 10px;">
        <button class="${quickAction==='stamp'?'on':''}" onclick="setMerchantQuickAction('stamp')">消费 +1${merchantPointsPerVisit(merchant) ? ` · 积 ${merchantPointsPerVisit(merchant)}` : ''}</button>
        <button class="${quickAction==='points'?'on':''}" onclick="setMerchantQuickAction('points')">积分 +1</button>
        <button class="${quickAction==='reward'?'on':''}" onclick="setMerchantQuickAction('reward')">兑换奖励</button>
      </div>
      <button class="merchant-reward-redeem-btn" style="margin:0;" onclick="confirmMerchantQuickAction()">${quickAction==='stamp' ? `确认本次消费 +1${merchantPointsPerVisit(merchant) ? `，积分 +${merchantPointsPerVisit(merchant)}` : ''}` : quickAction==='points' ? '确认本次积分 +1' : reward.ready ? `确认兑换「${escHtml(reward.reward)}」` : `还差 ${reward.remain} 次可兑换`}</button>
      ${lastOperation ? `<div style="margin-top:10px;padding:9px 10px;border-radius:10px;background:var(--sage-light);color:var(--sage-dark);font-size:12px;font-weight:900;">✓ ${escHtml(lastOperation)}</div>` : ''}
    </div>
    <div class="merchant-form-actions" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
      <button class="primary" onclick="adjustMerchantMemberValue(${JSON.stringify(member.id)},'stamp_count',1)">消费 +1</button>
      <button onclick="adjustMerchantMemberValue(${JSON.stringify(member.id)},'stamp_count',-1)">消费 -1</button>
      <button class="primary" onclick="adjustMerchantMemberValue(${JSON.stringify(member.id)},'points',1)">积分 +1</button>
      <button onclick="adjustMerchantMemberValue(${JSON.stringify(member.id)},'points',-1)">积分 -1</button>
    </div>
    ${reward.ready ? `<button class="merchant-reward-redeem-btn" onclick="redeemMerchantMemberReward(${JSON.stringify(member.id)})">确认兑换「${escHtml(reward.reward)}」</button>` : ''}
    <button class="merchant-member-remove-btn" onclick="pauseMerchantMember(${JSON.stringify(member.id)});closeMerchantMemberDetail();">移除会员</button>
    <div class="member-tx-panel" style="margin-top:16px;"><div class="member-tx-head"><b>近期消费记录</b><button onclick="openMerchantTransactionHistory(${JSON.stringify(member.id)})" style="color:var(--sage-dark);font-weight:900;">查看全部</button></div>${txRows.length ? `<div class="member-tx-list">${txRows.map(tx => memberTransactionRowHtml(tx, activeMerchantWorkspaceId(), { merchantView:true })).join('')}</div>` : '<div class="deals-empty-panel" style="margin:0;">还没有消费记录。</div>'}</div>
  `;
}
function setMerchantQuickAction(action){
  window._merchantQuickAction = action || 'stamp';
  renderMerchantMemberDetail();
}
function confirmMerchantQuickAction(){
  const member = activeMerchantMemberById(window._activeMerchantMemberDetailId);
  if(!member) return;
  const action = window._merchantQuickAction || 'stamp';
  if(action === 'reward'){
    const info = merchantRewardInfo(member, merchantOperatorWorkspace() || {});
    if(!info.ready){ showToast(`还差 ${info.remain} 次可兑换`); return; }
    redeemMerchantMemberReward(member.id);
    return;
  }
  const field = action === 'points' ? 'points' : 'stamp_count';
  const before = Number(member[field] || 0);
  const autoPoints = action === 'stamp' ? merchantPointsPerVisit(merchantOperatorWorkspace() || {}) : 0;
  const pointsBefore = Number(member.points || 0);
  const source = window._merchantMemberOperationContext === 'qr_checkin' ? 'qr_checkin' : (window._merchantMemberOperationContext === 'code_checkin' ? 'code_checkin' : 'manual');
  const patch = action === 'stamp' ? { stamp_count:before + 1, points:pointsBefore + autoPoints } : { [field]:before + 1 };
  updateMerchantMembershipRow(member.id, patch, {
    membership:member,
    action:field === 'points' ? 'points' : 'stamp',
    delta:1,
    before,
    after:before + 1,
    pointsDelta:autoPoints,
    pointsBefore,
    pointsAfter:pointsBefore + autoPoints,
    source,
    toast:field === 'points' ? '积分已累计' : (autoPoints ? `消费次数已累计，积分 +${autoPoints}` : '消费次数已累计')
  });
}
window._merchantRewardRedeemState = null;
function merchantRewardRedeemDialog(){
  const el = document.getElementById('merchantRewardRedeemConfirm');
  if(!el) return null;
  if(el.parentElement !== document.body) document.body.appendChild(el);
  el.style.position = 'fixed';
  el.style.inset = '0';
  el.style.zIndex = '2147483000';
  return el;
}
function redeemMerchantMemberReward(id){
  const member = activeMerchantMemberById(id);
  if(!member) return;
  const merchant = merchantOperatorWorkspace() || {};
  const info = merchantRewardInfo(member, merchant);
  if(!info.ready){
    showToast(`还差 ${info.remain} 次可兑换`);
    return;
  }
  const maxQty = Math.max(1, Math.floor(Number(member.stamp_count || 0) / info.target));
  window._merchantRewardRedeemState = { id, member, info, maxQty };
  const text = document.getElementById('merchantRewardRedeemText');
  const input = document.getElementById('merchantRewardRedeemQty');
  const hint = document.getElementById('merchantRewardRedeemHint');
  if(text) text.textContent = `当前最多可兑换 ${maxQty} 次「${info.reward}」。`;
  if(input){
    input.value = '1';
    input.max = String(maxQty);
  }
  if(hint) hint.textContent = `默认兑换 1 次，可手动修改，最大不能超过 ${maxQty}。每次扣除 ${info.target} 次消费记录。`;
  const dialog = merchantRewardRedeemDialog();
  if(dialog){
    dialog.classList.add('open');
    dialog.style.display = 'flex';
    setTimeout(() => input && input.focus && input.focus(), 80);
  }
}
function closeMerchantRewardRedeemConfirm(){
  const dialog = merchantRewardRedeemDialog();
  if(dialog){
    dialog.classList.remove('open');
    dialog.style.display = 'none';
  }
}
function confirmMerchantRewardRedeem(){
  const state = window._merchantRewardRedeemState;
  if(!state || !state.member || !state.info) return;
  const input = document.getElementById('merchantRewardRedeemQty');
  const qty = Math.floor(Number(input && input.value) || 0);
  if(qty < 1){
    showToast('兑换数量至少为 1');
    return;
  }
  if(qty > state.maxQty){
    showToast(`超过最大兑换量，最多可兑换 ${state.maxQty} 次`);
    return;
  }
  closeMerchantRewardRedeemConfirm();
  redeemMerchantRewardWithAudit(state.id, qty, state.info.reward);
}
async function redeemMerchantRewardWithAudit(membershipId, qty, reward){
  const memberBefore = activeMerchantMemberById(membershipId);
  try {
    const res = await authedFetch(`${SUPABASE_URL}/rest/v1/rpc/redeem_merchant_reward`, {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ p_membership_id: Number(membershipId), p_quantity: Number(qty) })
    });
    if(!res.ok) throw new Error(await res.text());
    if(memberBefore && memberBefore.user_id){
      await createMemberActivityNotification({
        userId:memberBefore.user_id,
        membershipId:memberBefore.id,
        kind:'reward',
        title:'会员奖励已兑换',
        body:`${merchantOperatorWorkspace() && merchantOperatorWorkspace().business_name || '商家'} 已为你兑换 ${qty} 次「${reward}」。`
      });
    }
    clearMemberCardTransactionCache(membershipId);
    window._merchantLastOperation = { membershipId:String(membershipId), text:`已兑换 ${qty} 次「${reward}」` };
    await Promise.all([
      loadMerchantMemberships(window._activeMerchantMemberManagerId || activeMerchantWorkspaceId(), true),
      loadMerchantMemberTransactions(window._activeMerchantMemberManagerId || activeMerchantWorkspaceId(), true)
    ]);
    renderMerchantMemberManager();
    renderMerchantPage();
    showToast(`已兑换 ${qty} 次「${reward}」`);
  } catch(e){
    console.warn('奖励兑换失败:', e.message);
    showToast('兑换失败，请稍后再试');
  }
}
window._merchantRewardReversalState = null;
function openMerchantRewardReversalConfirm(transactionId){
  const tx = (cachedMerchantTransactions(window._activeMerchantMemberManagerId || activeMerchantWorkspaceId()).rows || []).find(row => String(row.id) === String(transactionId));
  if(!tx || memberTransactionKind(tx) !== 'reward_redeem' || tx.revoked_at) return;
  window._merchantRewardReversalState = tx;
  const text = document.getElementById('merchantRewardReversalText');
  if(text) text.textContent = `将恢复 ${Math.abs(Number(tx.delta || 0))} 次消费记录。撤销后会保留原兑换与撤销流水。`;
  document.getElementById('merchantRewardReversalConfirm')?.classList.add('open');
}
function closeMerchantRewardReversalConfirm(){
  document.getElementById('merchantRewardReversalConfirm')?.classList.remove('open');
}
async function confirmMerchantRewardReversal(){
  const tx = window._merchantRewardReversalState;
  if(!tx) return;
  const memberBefore = activeMerchantMemberById(tx.membership_id);
  closeMerchantRewardReversalConfirm();
  try {
    const res = await authedFetch(`${SUPABASE_URL}/rest/v1/rpc/revert_merchant_reward_redemption`, {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ p_transaction_id: Number(tx.id) })
    });
    if(!res.ok) throw new Error(await res.text());
    if(memberBefore && memberBefore.user_id){
      await createMemberActivityNotification({
        userId:memberBefore.user_id,
        membershipId:memberBefore.id,
        transactionId:tx.id,
        kind:'reward',
        title:'会员奖励兑换已撤销',
        body:`${merchantOperatorWorkspace() && merchantOperatorWorkspace().business_name || '商家'} 已撤销「${tx.note || '会员奖励'}」兑换，消费次数已恢复。`
      });
    }
    clearMemberCardTransactionCache(tx.membership_id);
    window._merchantLastOperation = { membershipId:String(tx.membership_id), text:'已撤销兑换，消费次数已恢复' };
    await Promise.all([
      loadMerchantMemberships(window._activeMerchantMemberManagerId || activeMerchantWorkspaceId(), true),
      loadMerchantMemberTransactions(window._activeMerchantMemberManagerId || activeMerchantWorkspaceId(), true)
    ]);
    renderMerchantMemberManager();
    renderMerchantPage();
    showToast('已撤销兑换，消费次数已恢复');
  } catch(e){
    console.warn('撤销奖励兑换失败:', e.message);
    showToast('撤销失败，记录可能已处理');
  } finally {
    window._merchantRewardReversalState = null;
  }
}
function pauseMerchantMember(id){
  updateMerchantMembershipRow(id, { status:'paused' });
}
function normalizeMemberCardCode(value){
  const text = String(value || '').trim().toUpperCase();
  const digits = text.replace(/^LSH-?/i, '').replace(/[^0-9]/g, '');
  return digits ? String(parseInt(digits, 10)) : '';
}
function memberByPublicCode(code){
  const id = normalizeMemberCardCode(code);
  if(!id) return null;
  const merchantUserId = window._activeMerchantMemberManagerId || activeMerchantWorkspaceId();
  return cachedMerchantMemberships(merchantUserId).rows.find(r => String(r.id) === id);
}
function renderMerchantCheckinResult(member){
  const box = document.getElementById('merchantCheckinResult');
  if(!box) return;
  if(!member){
    box.innerHTML = '<span style="color:#b9413a;font-weight:900;">没有找到本店会员，请确认会员号是否正确。</span>';
    return;
  }
  box.innerHTML = `已找到：<b style="color:var(--ink);">${escHtml(member.user_name || '乐生活用户')}</b>，正在打开会员操作页…`;
}
function findMerchantMemberByCode(){
  const input = document.getElementById('merchantCheckinCode');
  const member = memberByPublicCode(input && input.value);
  renderMerchantCheckinResult(member);
  if(member) setTimeout(() => openMerchantMemberDetail(member.id, 'code_checkin'), 120);
}
let merchantScannerStream = null;
let merchantScannerTimer = null;
let merchantQrFallbackLoader = null;
let merchantScannerTorchOn = false;
function loadMerchantQrFallback(){
  if(window.jsQR) return Promise.resolve(window.jsQR);
  if(merchantQrFallbackLoader) return merchantQrFallbackLoader;
  merchantQrFallbackLoader = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js';
    script.async = true;
    script.onload = () => window.jsQR ? resolve(window.jsQR) : reject(new Error('二维码识别器加载失败'));
    script.onerror = () => reject(new Error('二维码识别器加载失败，请检查网络'));
    document.head.appendChild(script);
  }).catch(error => {
    merchantQrFallbackLoader = null;
    throw error;
  });
  return merchantQrFallbackLoader;
}
async function startMerchantQrFallbackScanner(video, status){
  const decodeQr = await loadMerchantQrFallback();
  if(!document.getElementById('merchantMemberScanner')?.classList.contains('open')) return;
  if(!video) throw new Error('相机画面不可用');
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d', { willReadFrequently:true });
  let detecting = false;
  if(status) status.textContent = '请将会员卡或已领取优惠券的二维码放入框内。识别成功后会自动打开核销页面。';
  merchantScannerTimer = setInterval(() => {
    if(detecting || !video || video.readyState < 2 || !video.videoWidth || !context) return;
    detecting = true;
    try {
      const sourceWidth = video.videoWidth;
      const sourceHeight = video.videoHeight;
      const width = Math.min(sourceWidth, 960);
      const height = Math.max(1, Math.round(sourceHeight * (width / sourceWidth)));
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
      const image = context.getImageData(0, 0, width, height);
      const result = decodeQr(image.data, width, height, { inversionAttempts:'attemptBoth' });
      if(result && result.data) applyScannedMemberCode(result.data);
    } catch(error) {
      console.warn('兼容扫码识别失败:', error.message);
    } finally {
      detecting = false;
    }
  }, 420);
}
async function openMerchantMemberScanner(){
  if(!canOperateMerchantWorkspace() || !activeMerchantWorkspaceId()){
    showToast('请先进入商家工作台');
    return;
  }
  const sheet = document.getElementById('merchantMemberScanner');
  const body = document.getElementById('merchantMemberScannerBody');
  if(!sheet || !body) return;
  body.innerHTML = `
    <div class="member-scan-status" id="merchantScanStatus">正在准备相机...</div>
    <div class="member-scan-box">
      <video class="member-scan-video" id="merchantScanVideo" autoplay muted playsinline></video>
      <div class="member-scan-guide"></div>
    </div>
    <div class="merchant-form-actions">
      <button onclick="closeMerchantMemberScanner()">关闭</button>
      <button id="merchantScanTorchBtn" onclick="toggleMerchantScannerTorch()">打开灯光</button>
      <button class="primary" onclick="useManualMemberCodeAfterScan()">手动输入</button>
    </div>
  `;
  sheet.classList.add('open');
  const status = document.getElementById('merchantScanStatus');
  if(!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)){
    if(status) status.textContent = '当前设备无法打开相机，请点击“手动输入”，让用户出示会员号后核销。';
    return;
  }
  try {
    merchantScannerStream = await navigator.mediaDevices.getUserMedia({ video:{ facingMode:'environment' }, audio:false });
    const video = document.getElementById('merchantScanVideo');
    if(video) video.srcObject = merchantScannerStream;
    if('BarcodeDetector' in window){
      try {
        const detector = new BarcodeDetector({ formats:['qr_code','code_128','code_39','ean_13'] });
        if(status) status.textContent = '请将会员卡或已领取优惠券的二维码放入框内。识别成功后会自动打开核销页面。';
        merchantScannerTimer = setInterval(async () => {
          try {
            const targetVideo = document.getElementById('merchantScanVideo');
            if(!targetVideo || targetVideo.readyState < 2) return;
            const codes = await detector.detect(targetVideo);
            const raw = codes && codes[0] && codes[0].rawValue;
            if(raw) applyScannedMemberCode(raw);
          } catch(e){}
        }, 700);
        return;
      } catch(error){
        console.warn('原生扫码器不可用，切换兼容模式:', error.message);
      }
    }
    await startMerchantQrFallbackScanner(video, status);
  } catch(e){
    console.warn('打开会员扫码失败:', e.message);
    if(status) status.textContent = `相机或扫码器未能启动（${e.message || '设备不支持'}），请点击“手动输入”，让用户出示会员号后核销。`;
  }
}
async function toggleMerchantScannerTorch(){
  const track = merchantScannerStream && merchantScannerStream.getVideoTracks && merchantScannerStream.getVideoTracks()[0];
  if(!track){ showToast('相机尚未启动'); return; }
  const capabilities = typeof track.getCapabilities === 'function' ? track.getCapabilities() : {};
  if(!capabilities || !capabilities.torch || typeof track.applyConstraints !== 'function'){
    showToast('当前设备或浏览器不支持打开相机灯光');
    return;
  }
  try {
    merchantScannerTorchOn = !merchantScannerTorchOn;
    await track.applyConstraints({ advanced:[{ torch:merchantScannerTorchOn }] });
    const button = document.getElementById('merchantScanTorchBtn');
    if(button) button.textContent = merchantScannerTorchOn ? '关闭灯光' : '打开灯光';
    showToast(merchantScannerTorchOn ? '已打开灯光' : '已关闭灯光');
  } catch(error){
    merchantScannerTorchOn = false;
    console.warn('切换相机灯光失败:', error.message);
    showToast('无法控制相机灯光，请检查设备权限');
  }
}
function applyScannedMemberCode(raw){
  const couponMatch = String(raw || '').toUpperCase().match(/LSHC-?\d+/);
  if(couponMatch){
    const couponCode = couponMatch[0].replace(/^LSHC/i, 'LSHC-');
    closeMerchantMemberScanner();
    openMerchantCouponRedeemByCode(couponCode);
    showToast('已识别优惠券');
    return;
  }
  const codeMatch = String(raw || '').toUpperCase().match(/LSH-?\d+/);
  const code = codeMatch ? codeMatch[0].replace(/^LSH/i, 'LSH-') : String(raw || '').trim();
  const input = document.getElementById('merchantCheckinCode');
  if(input) input.value = code;
  closeMerchantMemberScanner();
  const member = memberByPublicCode(code);
  renderMerchantCheckinResult(member);
  if(member) setTimeout(() => openMerchantMemberDetail(member.id, 'qr_checkin'), 80);
  showToast('已识别会员号');
}
function useManualMemberCodeAfterScan(){
  closeMerchantMemberScanner();
  const input = document.getElementById('merchantCheckinCode');
  if(input) input.focus();
}
function closeMerchantMemberScanner(){
  if(merchantScannerTimer){
    clearInterval(merchantScannerTimer);
    merchantScannerTimer = null;
  }
  if(merchantScannerStream){
    merchantScannerStream.getTracks().forEach(t => t.stop());
    merchantScannerStream = null;
  }
  merchantScannerTorchOn = false;
  document.getElementById('merchantMemberScanner')?.classList.remove('open');
}
async function checkInMerchantMemberByCode(field, delta){
  const input = document.getElementById('merchantCheckinCode');
  const member = memberByPublicCode(input && input.value);
  if(!member){
    renderMerchantCheckinResult(null);
    showToast('没有找到这个会员号');
    return;
  }
  const before = Number(member[field] || 0);
  const after = Math.max(0, before + delta);
  const ok = await updateMerchantMembershipRow(member.id, { [field]: after }, {
    membership: member,
    action: field === 'stamp_count' ? 'stamp' : 'points',
    delta,
    before,
    after,
    source: 'code_checkin',
    toast: field === 'stamp_count' ? '消费次数已自动累计' : '积分已自动累计'
  });
  if(ok){
    const refreshed = activeMerchantMemberById(member.id);
    renderMerchantCheckinResult(refreshed || member);
  }
}
async function logMerchantMemberTransaction(audit){
  const member = audit && audit.membership;
  const merchant = merchantOperatorWorkspace();
  if(!member || !merchant || !merchant.user_id || !(session && session.user)) return;
  try {
    const isRewardRedeem = audit.source === 'reward_redeem';
    const payload = {
      membership_id: member.id,
      merchant_user_id: merchant.user_id,
      operator_user_id: session.user.id,
      user_id: member.user_id,
      action: audit.action || 'update',
      delta: Number(audit.delta || 0),
      before_value: Number(audit.before || 0),
      after_value: Number(audit.after || 0),
      source: isRewardRedeem ? 'manual' : (audit.source || 'manual'),
      note: audit.note || (isRewardRedeem ? '奖励兑换' : (audit.source === 'code_checkin' ? '会员卡号核销' : '商家手动调整'))
    };
    return await merchantMembershipApi.createTransaction(payload);
  } catch(e){
    console.warn('会员核销流水记录失败:', e.message);
    return null;
  }
}
async function createMemberActivityNotification(input){
  const merchant = merchantOperatorWorkspace();
  if(!(session && session.user && merchant && merchant.user_id) || !input || !input.userId) return null;
  try {
    const payload = {
      user_id:input.userId,
      merchant_user_id:merchant.user_id,
      membership_id:input.membershipId || null,
      transaction_id:input.transactionId || null,
      coupon_claim_id:input.couponClaimId || null,
      kind:input.kind || 'stamp',
      title:input.title || '会员权益更新',
      body:input.body || ''
    };
    return await merchantMembershipApi.createActivityNotification(payload);
  } catch(e){ console.warn('会员权益通知写入失败:', e.message); return null; }
}
window._merchantMemberTransactionCache = window._merchantMemberTransactionCache || {};
window._memberCardTransactionCache = window._memberCardTransactionCache || {};
function clearMemberCardTransactionCache(membershipId){
  const key = String(membershipId || '');
  if(key && window._memberCardTransactionCache) delete window._memberCardTransactionCache[key];
}
function refreshUserMembershipCardCache(member, patch){
  if(!(member && window._userMembershipCards && Array.isArray(window._userMembershipCards.rows))) return;
  const index = window._userMembershipCards.rows.findIndex(r => String(r.id) === String(member.id));
  if(index < 0) return;
  window._userMembershipCards.rows[index] = Object.assign({}, window._userMembershipCards.rows[index], patch || {}, { updated_at: new Date().toISOString() });
}
function cachedMerchantTransactions(merchantUserId){
  return window._merchantMemberTransactionCache[String(merchantUserId || '')] || { rows: [], loaded:false, missing:false };
}
async function loadMerchantMemberTransactions(merchantUserId, force){
  if(!merchantUserId) return [];
  const key = String(merchantUserId);
  const cache = cachedMerchantTransactions(key);
  if(cache.loaded && !force) return cache.rows;
  try {
    const select = 'id,membership_id,merchant_user_id,operator_user_id,user_id,action,delta,before_value,after_value,source,note,transaction_kind,reversal_of_id,revoked_at,revoked_by,created_at';
    const rows = await merchantMembershipApi.loadTransactionsForMerchant({merchantUserId:key,select,limit:1000});
    window._merchantMemberTransactionCache[key] = { rows, loaded:true, missing:false };
    const operatorIds = rows.map(row => row.operator_user_id).filter(id => id && !window._profileCache[id]);
    if(operatorIds.length) loadProfilesForIds(operatorIds).then(() => {
      if(document.getElementById('merchantMemberManager')?.classList.contains('open')) renderMerchantMemberManager();
    });
    return rows;
  } catch(e){
    console.warn('会员流水读取失败:', e.message);
    window._merchantMemberTransactionCache[key] = { rows: [], loaded:true, missing:true };
    return [];
  }
}
function memberTransactionActionText(tx){
  if(!tx) return '会员记录';
  if(tx.action === 'stamp') return '消费次数';
  if(tx.action === 'points') return '积分';
  return '会员记录';
}
function memberTransactionSourceText(tx){
  if(!tx) return '';
  const kind = memberTransactionKind(tx);
  if(kind === 'reward_reversal') return '撤销兑换';
  if(kind === 'reward_redeem') return tx.revoked_at ? '已撤销兑换' : '奖励兑换';
  if(String(tx.note || '').includes('奖励兑换')) return '奖励兑换';
  if(tx.source === 'code_checkin') return '会员号核销';
  if(tx.source === 'qr_checkin') return '扫码核销';
  if(tx.source === 'reward_redeem') return '奖励兑换';
  return '手动调整';
}
function memberTransactionKind(tx){
  if(tx && tx.transaction_kind) return tx.transaction_kind;
  if(String(tx && tx.note || '').includes('撤销奖励兑换')) return 'reward_reversal';
  if(String(tx && tx.note || '').includes('奖励兑换')) return 'reward_redeem';
  if(tx && tx.source === 'code_checkin') return 'stamp_checkin';
  if(tx && tx.action === 'points') return 'points_adjustment';
  return 'manual_adjustment';
}
function merchantRewardInfo(row, merchant){
  merchant = merchant || {};
  const target = Math.max(1, parseInt(merchant.loyalty_target || 8, 10) || 8);
  const reward = merchant.loyalty_reward || '免费一杯';
  const stamps = Number(row && row.stamp_count || 0);
  const remainder = stamps % target;
  const ready = stamps >= target;
  const progress = ready ? 100 : Math.round((remainder / target) * 100);
  const remain = ready ? 0 : Math.max(0, target - remainder);
  return { target, reward, stamps, remainder, ready, progress, remain };
}
function merchantTierRules(merchant){
  const raw = merchant && merchant.membership_tiers;
  const saved = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  const silver = Math.max(1, Math.min(999999, parseInt(saved.silver, 10) || 100));
  const gold = Math.max(silver + 1, Math.min(999999, parseInt(saved.gold, 10) || 300));
  const black = Math.max(gold + 1, Math.min(999999, parseInt(saved.black, 10) || 600));
  return { silver, gold, black };
}
function merchantPointsPerVisit(merchant){
  return Math.max(0, Math.min(1000, parseInt(merchant && merchant.points_per_visit, 10) || 1));
}
function memberTierInfo(row, merchant){
  const points = Math.max(0, Number(row && row.points || 0));
  const tiers = merchantTierRules(merchant);
  if(points >= tiers.black) return { name:'黑金会员', next:null, points, tiers };
  if(points >= tiers.gold) return { name:'金卡会员', next:{ name:'黑金会员', points:tiers.black }, points, tiers };
  if(points >= tiers.silver) return { name:'银卡会员', next:{ name:'金卡会员', points:tiers.gold }, points, tiers };
  return { name:'新会员', next:{ name:'银卡会员', points:tiers.silver }, points, tiers };
}
function isBirthdayMonth(birth){
  const match = String(birth || '').match(/^\d{4}-(\d{1,2})/);
  return !!(match && Number(match[1]) === new Date().getMonth() + 1);
}
function memberTierBenefitsHtml(row, merchant, birth, opts){
  opts = opts || {};
  const tier = memberTierInfo(row, merchant);
  const birthdayReward = String(merchant && merchant.birthday_reward || '').trim();
  const dark = opts.dark ? ' dark' : '';
  const nextText = tier.next ? `再积 ${Math.max(0, tier.next.points - tier.points)} 分升级${tier.next.name}` : '已达到最高等级';
  return `<div class="member-reward-progress${dark}" style="margin-top:10px;"><div class="member-reward-title"><b>${escHtml(tier.name)}</b><span>${tier.points} 积分</span></div><div class="member-reward-note">${escHtml(nextText)}${birthdayReward ? (isBirthdayMonth(birth) ? ` · 本月生日权益：${birthdayReward}` : ` · 生日月享「${birthdayReward}」`) : ''}</div></div>`;
}
function memberRewardProgressHtml(row, merchant, opts){
  opts = opts || {};
  const info = merchantRewardInfo(row, merchant);
  return `
    <div class="member-reward-progress ${opts.dark ? 'dark' : ''}">
      <div class="member-reward-title">
        <b>${info.ready ? '可兑换奖励' : '会员奖励进度'}</b>
        <span>${info.stamps}/${info.target} 次</span>
      </div>
      <div class="member-reward-track"><div class="member-reward-bar" style="width:${info.progress}%;"></div></div>
      <div class="member-reward-note">${info.ready ? `已可兑换「${escHtml(info.reward)}」，到店可请商家核销。` : `再消费 ${info.remain} 次可兑换「${escHtml(info.reward)}」。`}</div>
    </div>
  `;
}
function memberTransactionUserName(tx, merchantUserId){
  const member = cachedMerchantMemberships(merchantUserId).rows.find(r => String(r.id) === String(tx.membership_id));
  return (member && member.user_name) || '会员';
}
function memberTransactionNoteText(tx){
  const note = String((tx && tx.note) || '').trim();
  if(!note) return '';
  if(note === memberTransactionSourceText(tx)) return '';
  return note;
}
function memberTransactionRowHtml(tx, merchantUserId, opts){
  opts = opts || {};
  const delta = Number(tx.delta || 0);
  const date = tx.created_at ? new Date(tx.created_at).toLocaleString('zh-CN') : '';
  const action = memberTransactionActionText(tx);
  const source = memberTransactionSourceText(tx);
  const title = opts.userView ? `${source} · ${action}` : `${memberTransactionUserName(tx, merchantUserId)} · ${action}`;
  const note = memberTransactionNoteText(tx);
  const kind = memberTransactionKind(tx);
  const operator = tx && tx.operator_user_id ? cachedProfile(tx.operator_user_id, '').name : '';
  const canReverse = opts.merchantView && kind === 'reward_redeem' && !tx.revoked_at;
  return `
    <div class="member-tx-item">
      <div class="member-tx-main">
        <div class="member-tx-title">${escHtml(title)}${!opts.userView && source ? `<span class="member-tx-badge">${escHtml(source)}</span>` : ''}${tx.revoked_at ? '<span class="member-tx-revoked">已撤销</span>' : ''}</div>
        <div class="member-tx-meta">${date ? escHtml(date) + ' · ' : ''}${Number(tx.before_value || 0)} → ${Number(tx.after_value || 0)}</div>
        ${!opts.userView && operator ? `<div class="member-tx-meta">操作人：${escHtml(operator)}</div>` : ''}
        ${note ? `<div class="member-tx-note">${escHtml(note)}</div>` : ''}
        ${canReverse ? `<button class="member-tx-reverse-btn" onclick="openMerchantRewardReversalConfirm(${JSON.stringify(tx.id)})">撤销本次兑换</button>` : ''}
      </div>
      <div class="member-tx-delta ${delta < 0 ? 'minus' : ''}">${delta >= 0 ? '+' : ''}${delta}</div>
    </div>
  `;
}
function merchantTransactionPanelHtml(merchantUserId){
  const cache = cachedMerchantTransactions(merchantUserId);
  if(cache.missing){
    return '<div class="member-tx-panel"><div class="member-tx-head"><b>近期核销记录</b></div><div class="deals-empty-panel" style="margin:0;">运行 5.60 SQL 后可查看核销流水。</div></div>';
  }
  const selected = window._merchantTransactionFilter || 'all';
  const allRows = cache.rows || [];
  const rows = allRows.filter(tx => {
    const kind = memberTransactionKind(tx);
    if(selected === 'redeem') return kind === 'reward_redeem' || kind === 'reward_reversal';
    if(selected === 'checkin') return kind === 'stamp_checkin' || kind === 'points_adjustment';
    return true;
  }).slice(0, 10);
  return `
    <div class="member-tx-panel">
      <div class="member-tx-head"><b>会员操作记录</b><span>${rows.length ? `显示 ${rows.length} 条` : '暂无记录'}</span></div>
      <div class="member-tx-filter">
        <button class="${selected === 'all' ? 'on' : ''}" onclick="setMerchantTransactionFilter('all')">全部</button>
        <button class="${selected === 'checkin' ? 'on' : ''}" onclick="setMerchantTransactionFilter('checkin')">核销 / 积分</button>
        <button class="${selected === 'redeem' ? 'on' : ''}" onclick="setMerchantTransactionFilter('redeem')">奖励兑换</button>
      </div>
      ${rows.length ? `<div class="member-tx-list">${rows.map(tx => memberTransactionRowHtml(tx, merchantUserId, { merchantView:true })).join('')}</div><button onclick="openMerchantTransactionHistory()" style="width:100%;margin-top:10px;padding:10px;border:1px solid var(--line);border-radius:10px;background:#fff;color:var(--sage-dark);font-weight:900;">更多消费记录</button>` : '<div class="deals-empty-panel" style="margin:0;">这个分类还没有记录。</div>'}
    </div>
  `;
}
function closeMerchantTransactionHistory(){ document.getElementById('merchantTransactionHistory')?.classList.remove('open'); }
function transactionPeriodMatch(tx, period){
  if(period === 'all') return true;
  const date = new Date(tx.created_at || 0);
  const now = new Date();
  if(period === 'three_days'){
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2);
    return date >= start;
  }
  if(period === 'week'){
    const day = (now.getDay() + 6) % 7;
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day);
    return date >= start;
  }
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}
function transactionDateLabel(value){
  try { return new Intl.DateTimeFormat('zh-CN', { month:'long', day:'numeric', weekday:'short' }).format(new Date(value)); } catch(e){ return ''; }
}
function openMerchantTransactionHistory(membershipId){
  window._merchantTransactionHistoryUserMode = false;
  window._merchantTransactionHistoryMembershipId = membershipId || null;
  window._merchantTransactionHistoryPeriod = 'three_days';
  document.getElementById('merchantTransactionHistory')?.classList.add('open');
  renderMerchantTransactionHistory();
}
async function openMemberCardTransactionHistory(membershipId, merchantUserId){
  window._merchantTransactionHistoryUserMode = true;
  window._merchantTransactionHistoryMembershipId = membershipId;
  window._merchantTransactionHistoryMerchantUserId = merchantUserId;
  window._merchantTransactionHistoryPeriod = 'three_days';
  document.getElementById('merchantTransactionHistory')?.classList.add('open');
  await loadMemberCardTransactions(membershipId, true);
  renderMerchantTransactionHistory();
}
function renderMerchantTransactionHistory(){
  const body = document.getElementById('merchantTransactionHistoryBody');
  if(!body) return;
  const userMode = !!window._merchantTransactionHistoryUserMode;
  const merchantUserId = userMode ? window._merchantTransactionHistoryMerchantUserId : activeMerchantWorkspaceId();
  const membershipId = window._merchantTransactionHistoryMembershipId;
  const period = window._merchantTransactionHistoryPeriod || 'three_days';
  const baseRows = userMode ? ((window._memberCardTransactionCache[String(membershipId)] || {}).rows || []) : (cachedMerchantTransactions(merchantUserId).rows || []);
  const rows = baseRows
    .filter(tx => !membershipId || String(tx.membership_id) === String(membershipId))
    .filter(tx => transactionPeriodMatch(tx, period));
  const groups = rows.reduce((map, tx) => {
    const key = tx.created_at ? new Date(tx.created_at).toISOString().slice(0,10) : 'unknown';
    (map[key] ||= []).push(tx); return map;
  }, {});
  body.innerHTML = `
    <div class="member-tx-filter" style="margin-bottom:14px;">
      <button class="${period==='three_days'?'on':''}" onclick="window._merchantTransactionHistoryPeriod='three_days';renderMerchantTransactionHistory()">最近三天</button>
      <button class="${period==='week'?'on':''}" onclick="window._merchantTransactionHistoryPeriod='week';renderMerchantTransactionHistory()">本周</button>
      <button class="${period==='month'?'on':''}" onclick="window._merchantTransactionHistoryPeriod='month';renderMerchantTransactionHistory()">本月</button>
      <button class="${period==='all'?'on':''}" onclick="window._merchantTransactionHistoryPeriod='all';renderMerchantTransactionHistory()">全部</button>
    </div>
    ${rows.length ? Object.entries(groups).map(([day, list]) => `<section style="margin-bottom:18px;"><b style="display:block;font-size:13px;margin:0 0 8px;color:var(--ink-soft);">${escHtml(transactionDateLabel(list[0].created_at))}</b><div class="member-tx-list">${list.map(tx => memberTransactionRowHtml(tx, merchantUserId, userMode ? { userView:true } : { merchantView:true })).join('')}</div></section>`).join('') : '<div class="deals-empty-panel">这个时间范围内还没有消费记录。</div>'}`;
}
function setMerchantTransactionFilter(filter){
  window._merchantTransactionFilter = filter || 'all';
  renderMerchantMemberManager();
}
async function loadMemberCardTransactions(membershipId, force){
  const key = String(membershipId || '');
  if(!key) return [];
  const cache = window._memberCardTransactionCache[key] || { rows: [], loaded:false, missing:false };
  if(cache.loaded && !force) return cache.rows;
  try {
    const select = 'id,membership_id,merchant_user_id,user_id,action,delta,before_value,after_value,source,note,transaction_kind,reversal_of_id,revoked_at,revoked_by,created_at';
    const rows = await merchantMembershipApi.loadTransactionsForMembership({membershipId:key,select,limit:1000});
    window._memberCardTransactionCache[key] = { rows, loaded:true, missing:false };
    return rows;
  } catch(e){
    console.warn('会员卡流水读取失败:', e.message);
    window._memberCardTransactionCache[key] = { rows: [], loaded:true, missing:true };
    return [];
  }
}
function renderMemberCardTransactionTarget(membershipId, merchantUserId){
  const target = document.getElementById(`memberCardTxRows-${membershipId}`);
  if(!target) return;
  const cache = window._memberCardTransactionCache[String(membershipId)] || { rows: [], loaded:false, missing:false };
  if(cache.missing){
    target.innerHTML = '<div class="deals-empty-panel" style="margin:0;">运行 5.60 SQL 后可查看使用记录。</div>';
    return;
  }
  const rows = (cache.rows || []).slice(0, 10);
  target.innerHTML = rows.length
    ? `<div class="member-tx-list">${rows.map(tx => memberTransactionRowHtml(tx, merchantUserId, { userView:true })).join('')}</div><button onclick="openMemberCardTransactionHistory(${JSON.stringify(membershipId)},'${String(merchantUserId || '').replace(/'/g,'')}')" style="width:100%;margin-top:10px;padding:10px;border:1px solid var(--line);border-radius:10px;background:#fff;color:var(--sage-dark);font-weight:900;">更多消费记录</button>`
    : '<div class="deals-empty-panel" style="margin:0;">还没有使用记录。</div>';
}
window._userMembershipCards = window._userMembershipCards || { rows: [], merchants: {}, loaded:false, mode:'常用' };
function setUserMembershipMode(mode){
  window._userMembershipCards.mode = mode || '常用';
  if(mode === '附近' && !window._userMembershipCards.location && !window._userMembershipCards.locating){
    requestUserMembershipNearbyLocation();
  }
  renderUserMembershipCards();
}
function formatMembershipDistance(km){
  if(!Number.isFinite(km)) return '';
  return km < 1 ? `${Math.max(1, Math.round(km * 1000))} 米` : `${km.toFixed(km < 10 ? 1 : 0)} 公里`;
}
function isMembershipCoordinate(value){
  return value !== null && value !== '' && value !== undefined && Number.isFinite(Number(value));
}
function membershipDistanceKm(fromLat, fromLng, toLat, toLng){
  if(![fromLat, fromLng, toLat, toLng].every(isMembershipCoordinate)) return null;
  const values = [fromLat, fromLng, toLat, toLng].map(Number);
  const rad = value => value * Math.PI / 180;
  const [aLat, aLng, bLat, bLng] = values;
  const dLat = rad(bLat - aLat);
  const dLng = rad(bLng - aLng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(aLat)) * Math.cos(rad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}
function requestUserMembershipNearbyLocation(){
  const state = window._userMembershipCards;
  if(!navigator.geolocation){
    state.locationError = '当前设备不支持定位，请使用“常用”查看会员卡。';
    renderUserMembershipCards();
    return;
  }
  state.locating = true;
  state.locationError = '';
  renderUserMembershipCards();
  navigator.geolocation.getCurrentPosition(position => {
    state.location = { latitude: position.coords.latitude, longitude: position.coords.longitude };
    state.locating = false;
    renderUserMembershipCards();
  }, error => {
    state.locating = false;
    state.locationError = error && error.code === 1 ? '你没有授权定位，可在浏览器或 App 设置中允许位置权限后重试。' : '暂时无法取得当前位置，请稍后重试。';
    renderUserMembershipCards();
  }, { enableHighAccuracy:true, timeout:10000, maximumAge:300000 });
}
async function loadUserMembershipCards(force){
  if(!(session && session.user)){
    window._userMembershipCards = { rows: [], merchants: {}, loaded:true, mode: window._userMembershipCards.mode || '常用' };
    renderUserMembershipCards();
    return;
  }
  if(window._userMembershipCards.loaded && !force){
    renderUserMembershipCards();
    return;
  }
  const body = document.getElementById('userMembershipCards');
  if(body) body.innerHTML = '<div class="deals-empty-panel">正在读取会员卡...</div>';
  try {
    if(!merchantMembershipApi) throw new Error('商家会员接口未初始化');
    const select = 'id,merchant_user_id,user_id,user_name,user_avatar,status,points,stamp_count,joined_at,updated_at';
    const rows = await merchantMembershipApi.loadForUser({ userId:session.user.id, select, limit:120 });
    const ids = [...new Set(rows.map(r => r.merchant_user_id).filter(Boolean))];
    let merchants = {};
    if(ids.length){
      const merchantRows = await merchantMembershipApi.loadMerchants({ ids, select:'user_id,business_name,logo,address,category,phone,slug,cover_image,loyalty_target,loyalty_reward,points_per_visit,membership_tiers,birthday_reward,latitude,longitude' });
      merchantRows.forEach(m => { merchants[m.user_id] = m; setMerchantIdentityCache(m.user_id, m); });
    }
    window._userMembershipCards.rows = rows;
    window._userMembershipCards.merchants = merchants;
    window._userMembershipCards.loaded = true;
    renderUserMembershipCards();
  } catch(e){
    console.warn('会员卡读取失败:', e.message);
    if(body) body.innerHTML = '<div class="deals-empty-panel">会员卡暂时读取失败，请确认已执行 5.20 会员数据库脚本。</div>';
  }
}
function userMembershipFavoriteKey(id){
  return `leshenghuo_member_card_fav_${id}`;
}
function isUserMembershipFavorite(id){
  return localStorage.getItem(userMembershipFavoriteKey(id)) === '1';
}
function toggleUserMembershipFavorite(id){
  const key = userMembershipFavoriteKey(id);
  if(isUserMembershipFavorite(id)) localStorage.removeItem(key);
  else localStorage.setItem(key, '1');
  renderUserMembershipCards();
}
function memberCardNavigationUrl(merchant){
  const m = merchant || {};
  const destination = isMembershipCoordinate(m.latitude) && isMembershipCoordinate(m.longitude)
    ? `${Number(m.latitude)},${Number(m.longitude)}`
    : (m.address || m.business_name || '');
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}
function openMemberCardNavigation(membershipId){
  const row = getUserMembershipCardRow(membershipId);
  const merchant = row && ((window._userMembershipCards && window._userMembershipCards.merchants || {})[row.merchant_user_id] || window._merchantIdentityCache[row.merchant_user_id]);
  if(!merchant || !(merchant.address || (isMembershipCoordinate(merchant.latitude) && isMembershipCoordinate(merchant.longitude)))){
    showToast('这家店暂未设置可导航的位置');
    return;
  }
  const popup = window.open(memberCardNavigationUrl(merchant), '_blank', 'noopener');
  if(!popup) window.location.href = memberCardNavigationUrl(merchant);
}
function renderUserMembershipCards(){
  const body = document.getElementById('userMembershipCards');
  if(!body) return;
  const state = window._userMembershipCards || { rows: [], merchants: {}, mode:'常用' };
  const mode = state.mode || '常用';
  let rows = (state.rows || []).slice();
  if(mode === '收藏') rows = rows.filter(r => isUserMembershipFavorite(r.id));
  let nearbyMissingLocationCount = 0;
  if(mode === '附近' && state.location){
    const ranked = rows.map(row => {
      const merchant = state.merchants[row.merchant_user_id] || {};
      return Object.assign({}, row, { _distanceKm: membershipDistanceKm(state.location.latitude, state.location.longitude, merchant.latitude, merchant.longitude) });
    }).sort((a, b) => {
      const da = Number.isFinite(a._distanceKm) ? a._distanceKm : Number.POSITIVE_INFINITY;
      const db = Number.isFinite(b._distanceKm) ? b._distanceKm : Number.POSITIVE_INFINITY;
      return da - db;
    });
    nearbyMissingLocationCount = ranked.filter(row => !Number.isFinite(row._distanceKm)).length;
    rows = ranked.filter(row => Number.isFinite(row._distanceKm));
  }
  const nearbyNote = mode !== '附近' ? '' : state.locating
    ? '<div class="ai-note" style="margin:0 0 12px;">正在获取当前位置…</div>'
    : state.location
      ? `<div class="ai-note" style="margin:0 0 12px;">已找到 ${rows.length} 家可定位门店，已按距离排序。${nearbyMissingLocationCount ? `${nearbyMissingLocationCount} 家门店尚未设置位置，暂不列入附近结果。` : ''}你的定位只在当前设备临时使用，不会上传或保存。</div>`
      : `<div class="ai-note" style="margin:0 0 12px;">${escHtml(state.locationError || '开启定位后，可按距离查看附近可用会员卡。')} <button onclick="requestUserMembershipNearbyLocation()" style="margin-left:6px;border:none;background:none;color:var(--sage-dark);font:inherit;font-weight:900;text-decoration:underline;">${state.locationError ? '重新定位' : '开启定位'}</button></div>`;
  body.innerHTML = `
    <div class="member-card-tabs">
      ${['常用','收藏','附近'].map(tab => `<button class="${mode === tab ? 'on' : ''}" onclick="setUserMembershipMode('${tab}')">${tab}</button>`).join('')}
    </div>
    ${nearbyNote}
    ${rows.length ? `<div class="member-card-list">${rows.map((row, index) => userMembershipCardHtml(row, { nearbyRank:mode === '附近' ? index : -1 })).join('')}</div>` : `<div class="deals-empty-panel">${mode === '收藏' ? '还没有收藏会员卡。' : mode === '附近' ? (nearbyMissingLocationCount ? '已加入的商家暂未设置门店位置，暂时无法计算距离。' : '附近暂时没有可用会员卡。') : '还没有加入任何商家会员。'}</div>`}
  `;
}
function userMembershipCardHtml(row, opts){
  opts = opts || {};
  const state = window._userMembershipCards || { merchants:{} };
  const m = state.merchants[row.merchant_user_id] || window._merchantIdentityCache[row.merchant_user_id] || {};
  const name = m.business_name || '乐生活商家';
  const logo = m.logo || '';
  const address = m.address || '地址待补充';
  const distance = formatMembershipDistance(row._distanceKm);
  const fav = isUserMembershipFavorite(row.id);
  const isNearby = Number(opts.nearbyRank) >= 0;
  return `
    <div class="member-card">
      <button class="member-card-fav ${fav ? 'on' : ''}" onclick="toggleUserMembershipFavorite(${JSON.stringify(row.id)})" aria-label="${fav ? '取消收藏' : '收藏'}">${fav ? '♥' : '♡'}</button>
      <div class="member-card-top">
        <div class="member-card-logo">${logo ? `<img src="${escAttr(logo)}" alt="">` : escHtml(initials(name))}</div>
        <div style="min-width:0;flex:1;">
          <div class="member-card-name">${escHtml(name)}${opts.nearbyRank === 0 ? '<span style="margin-left:6px;font-size:10px;padding:3px 6px;border-radius:999px;background:var(--sage-light);color:var(--sage-dark);vertical-align:2px;">最近门店</span>' : ''}</div>
          <div class="member-card-meta">${escHtml(address)}${distance ? ` · 距你 ${escHtml(distance)}` : (window._userMembershipCards.mode === '附近' ? ' · 未设定门店定位' : '')}</div>
        </div>
      </div>
      <div class="member-card-stats">
        <div class="member-card-stat"><b>${Number(row.stamp_count || 0)}</b><span>消费次数</span></div>
        <div class="member-card-stat"><b>${Number(row.points || 0)}</b><span>积分</span></div>
      </div>
      ${memberRewardProgressHtml(row, m)}
      ${memberTierBenefitsHtml(row, m, currentUser && currentUser.birth)}
      <div class="member-card-actions">
        <button class="primary" onclick="showMemberCardPresenter(${JSON.stringify(row.id)})">出示会员卡</button>
        <button onclick="${isNearby ? `openMemberCardNavigation(${JSON.stringify(row.id)})` : `openMerchantPublicPage('${String(row.merchant_user_id || '').replace(/'/g,'')}')`}">${isNearby ? `${uiIcon('map',14)}到店导航` : '查看店铺'}</button>
      </div>
    </div>
  `;
}
function getUserMembershipCardRow(id){
  const state = window._userMembershipCards || { rows: [] };
  return (state.rows || []).find(r => String(r.id) === String(id));
}
function memberCardPublicId(row){
  const raw = `${row && row.id ? row.id : '0'}`.replace(/[^0-9A-Za-z]/g, '');
  return `LSH-${String(raw).padStart(6, '0').slice(-8)}`;
}
function memberCardQrHtml(code){
  try {
    if(typeof window.qrcode !== 'function') throw new Error('local QR library unavailable');
    const qr = window.qrcode(0, 'M');
    qr.addData(String(code || ''));
    qr.make();
    return qr.createSvgTag(5, 1, '会员二维码', '乐生活会员卡');
  } catch(e){
    console.warn('本地会员二维码生成失败:', e.message);
    return `<span style="font-size:11px;color:var(--ink-faint);padding:14px;line-height:1.5;">二维码生成失败<br>请使用下方会员号</span>`;
  }
}
function renderMemberCardCouponTarget(membershipId, merchantUserId){
  const target = document.getElementById(`memberCardCouponRows-${membershipId}`);
  if(!target) return;
  const rows = (window._merchantCouponClaims.rows || []).filter(claim => String(claim.merchant_user_id) === String(merchantUserId));
  target.innerHTML = rows.length ? rows.map(claim => {
    const snapshot = claim.coupon_snapshot || {};
    const redeemed = claim.status === 'redeemed';
    return `<button onclick="openMerchantCouponWallet(${Number(claim.id)})" style="width:100%;display:flex;align-items:center;gap:10px;text-align:left;padding:10px;border:1px solid var(--line);border-radius:12px;background:#fff;margin-top:8px;"><span style="width:34px;height:34px;border-radius:9px;background:var(--berry-light);color:var(--berry-dark);display:flex;align-items:center;justify-content:center;flex-shrink:0;">${uiIcon('inbox',17)}</span><span style="min-width:0;flex:1;"><b style="display:block;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escHtml(snapshot.title || '已领取优惠券')}</b><small style="display:block;font-size:11px;color:var(--ink-faint);margin-top:2px;">${redeemed ? '已核销' : '点击出示二维码'}</small></span><span style="font-size:11px;color:${redeemed?'var(--ink-faint)':'var(--sage-dark)'};font-weight:900;">${redeemed?'已使用':'出示'}</span></button>`;
  }).join('') : '<div style="font-size:12px;color:var(--ink-faint);padding:10px 0;">本店暂时没有已领取的优惠券。</div>';
}
function showMemberCardPresenter(id){
  const row = getUserMembershipCardRow(id);
  if(!row){ showToast('没有找到这张会员卡'); return; }
  const state = window._userMembershipCards || { merchants:{} };
  const m = state.merchants[row.merchant_user_id] || window._merchantIdentityCache[row.merchant_user_id] || {};
  const name = m.business_name || '乐生活商家';
  const logo = m.logo || '';
  const memberName = row.user_name || merchantMemberDisplayName() || '乐生活用户';
  const joined = row.joined_at ? new Date(row.joined_at).toLocaleDateString('zh-CN') : '';
  const publicCode = memberCardPublicId(row);
  const body = document.getElementById('memberCardPresenterBody');
  if(body){
    body.innerHTML = `
      <div class="member-present-card">
        <div class="member-present-top">
          <div class="member-present-logo">${logo ? `<img src="${escAttr(logo)}" alt="">` : escHtml(initials(name))}</div>
          <div style="min-width:0;flex:1;">
            <div class="member-present-name">${escHtml(name)}</div>
            <div class="member-present-meta">${escHtml(memberName)}${joined ? ` · ${escHtml(joined)} 加入` : ''}</div>
          </div>
        </div>
        <div class="member-present-grid">
          <div class="member-present-stat"><b>${Number(row.stamp_count || 0)}</b><span>消费次数</span></div>
          <div class="member-present-stat"><b>${Number(row.points || 0)}</b><span>积分</span></div>
        </div>
        ${memberRewardProgressHtml(row, m, { dark:true })}
        ${memberTierBenefitsHtml(row, m, currentUser && currentUser.birth, { dark:true })}
        <div class="member-present-code">
          <div class="member-present-qr" aria-label="会员二维码">${memberCardQrHtml(publicCode)}</div>
          <b>${escHtml(publicCode)}</b>
          <span>请向商家出示二维码，无法扫码时可输入会员号</span>
        </div>
      </div>
      <div class="member-tx-panel" style="margin-top:14px;">
        <div class="member-tx-head"><b>已领取优惠券</b><button onclick="openMerchantCouponWallet()" style="color:var(--sage-dark);font-weight:900;">全部优惠券</button></div>
        <div id="memberCardCouponRows-${row.id}" class="member-dash-sub">正在读取...</div>
      </div>
      <div class="member-tx-panel" style="margin-top:14px;">
        <div class="member-tx-head"><b>最近使用记录</b><span>这张会员卡</span></div>
        <div id="memberCardTxRows-${row.id}" class="member-dash-sub">正在读取...</div>
      </div>
      <div class="ai-note" style="margin-top:14px;">商家可扫描二维码或输入会员号核销。扫码成功后会自动填入会员号，再选择消费次数或积分累计。</div>
      <div class="merchant-form-actions">
        <button onclick="closeMemberCardPresenter()">关闭</button>
        <button class="primary" onclick="closeMemberCardPresenter();openMerchantPublicPage('${String(row.merchant_user_id || '').replace(/'/g,'')}')">查看店铺</button>
      </div>
    `;
  }
  document.getElementById('memberCardPresenter')?.classList.add('open');
  loadMemberCardTransactions(row.id, true).then(() => renderMemberCardTransactionTarget(row.id, row.merchant_user_id));
  loadMerchantCouponClaims(true).then(() => renderMemberCardCouponTarget(row.id, row.merchant_user_id));
}
function closeMemberCardPresenter(){
  document.getElementById('memberCardPresenter')?.classList.remove('open');
}
function openPersonalShopManager(){
  if(!(session && session.user)){
    showToast('请先登录后管理个人小店');
    openAuth('login');
    return;
  }
  window.location.assign('/shop/manage/');
}
async function openMerchantPublicPage(userId){
  if(!userId){ showToast('没有找到商家主页'); return; }
  try {
    if(!merchantPublicApi) throw new Error('商家资料接口未初始化');
    const m = await merchantPublicApi.getByUserId({ userId, select:'*', verified:true });
    if(!m){
      showToast('没有找到这个商家主页，可能还未通过认证。');
      return;
    }
    setMerchantIdentityCache(m.user_id, m);
    if(isNativeAppRuntime() || document.documentElement.classList.contains('app-webview-entry')){
      await openMerchantPublicPageBySlug(merchantSiteSlug(m));
      return;
    }
    window.location.assign(merchantSiteUrl(m));
  } catch(e){
    console.warn('打开商家主页失败:', e.message);
    showToast('商家主页暂时打不开，请稍后再试。');
  }
}
function routeMerchantSlugFromLocation(){
  try {
    const url = new URL(window.location.href);
    const querySlug = url.searchParams.get('m') || url.searchParams.get('merchant');
    if(querySlug) return normalizeMerchantSlug(querySlug);
    const parts = url.pathname.split('/').filter(Boolean).map(part => decodeURIComponent(part));
    const legacySlug = parts.length === 2 && parts[0] === 'm' ? parts[1] : '';
    const rootSlug = parts.length === 1 ? parts[0] : '';
    const slug = normalizeMerchantSlug(legacySlug || rootSlug);
    return MERCHANT_RESERVED_SLUGS.has(slug) ? '' : slug;
  } catch(e){
    return '';
  }
}
function routeMerchantOrderFromLocation(){
  try {
    const url = new URL(window.location.href);
    const slug = normalizeMerchantSlug(url.searchParams.get('order') || '');
    const table = String(url.searchParams.get('table') || '').trim().toLowerCase();
    const mode=String(url.searchParams.get('mode')||'').toLowerCase();
    if(!slug || (mode!=='takeout' && !/^[a-z0-9-]{3,48}$/.test(table))) return null;
    return { slug, table, mode };
  } catch(e){ return null; }
}
async function openMerchantOrderByRoute(route){
  if(!route) return false;
  if(!(session && session.user)){
    showToast('登录后即可扫码点餐');
    openAuth('login');
    return false;
  }
  try {
    if(!merchantPublicApi) throw new Error('商家资料接口未初始化');
    const row = await merchantPublicApi.getBySlug({ slug:route.slug, select:'user_id', verified:true });
    if(!row){ showToast('没有找到这家商店'); return false; }
    await openMerchantOrderEntry(row.user_id, route.table, route.mode);
    return true;
  } catch(error){ showToast('点餐链接暂时打不开，请稍后重试'); return false; }
}
function routePostIdFromLocation(){
  try {
    const raw = new URL(window.location.href).searchParams.get('post');
    return raw && /^\d+$/.test(raw) ? Number(raw) : null;
  } catch(e){ return null; }
}
function routeUserIdFromLocation(){
  try {
    const raw = String(new URL(window.location.href).searchParams.get('user') || '').trim();
    return /^[0-9a-f-]{8,64}$/i.test(raw) ? raw : '';
  } catch(e){ return ''; }
}
async function openMerchantPublicPageBySlug(slug){
  slug = merchantSlugify(slug);
  if(!slug) return false;
  if(!appNavigation?.isRestoring()) appNavigation?.enter({ type:'merchant', slug });
  const overlay = document.getElementById('merchantPublicOverlay');
  const body = document.getElementById('merchantPublicBody');
  if(!overlay || !body) return false;
  closeSearchPage();
  overlay.dataset.slug = slug;
  overlay.classList.add('open');
  body.innerHTML = '<div class="deals-empty-panel">正在打开商家微网站...</div>';
  try {
    if(!merchantPublicApi) throw new Error('商家资料接口未初始化');
    const m = await merchantPublicApi.getBySlug({ slug, select:'*', verified:true });
    if(!m){
      body.innerHTML = '<div class="deals-empty-panel">没有找到这个商家微网站，请确认链接是否正确。</div>';
      return false;
    }
    setMerchantIdentityCache(m.user_id, m);
    overlay.dataset.userId = m.user_id || '';
    body.innerHTML = merchantContentHtml(m, { isOwnerPage: false });
    await Promise.all([loadMerchantDeals(m), loadMerchantMemberships(m.user_id, true)]);
    if(document.getElementById('merchantPublicOverlay')?.classList.contains('open')){
      body.innerHTML = merchantContentHtml(m, { isOwnerPage: false });
    }
    return true;
  } catch(e){
    console.warn('打开商家微网站失败:', e.message);
    body.innerHTML = '<div class="deals-empty-panel">商家微网站暂时打不开，请稍后再试。</div>';
    return false;
  }
}
function closeMerchantPublicPage(){
  const overlay = document.getElementById('merchantPublicOverlay');
  if(overlay){
    overlay.classList.remove('open');
    overlay.dataset.userId = '';
    overlay.dataset.slug = '';
  }
}
function publicUserCardHtml(p){
  const media = postCardMediaHtml(p, 32);
  return `
    <div class="user-content-item" onclick="openPostFromUserPage(${JSON.stringify(p.id)})">
      <div style="position:relative;aspect-ratio:3/4;background:var(--bg-alt);overflow:hidden;">${media}</div>
      <div class="user-content-item-info">
        <div class="user-content-item-title">${escHtml(p.title || '未命名笔记')}</div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px;font-size:11px;color:var(--ink-faint);">
          <span>${catIcon(p.category,13)} ${escHtml(normalizeCategory(p.category) || '生活')}</span>
          <span>♥ ${p.likes || 0}</span>
        </div>
      </div>
    </div>
  `;
}
function userPublicContentHtml(userId, profile){
  const name = profile.name || '乐生活用户';
  const avatar = profile.avatar || resolveAvatarUrl(userId);
  const bio = profile.bio || '这个用户还没有填写介绍。';
  const tags = Array.isArray(profile.tags) ? profile.tags.filter(Boolean).slice(0, 3) : [];
  const age = calcAge(profile.birth);
  const ageText = [profile.gender || '', age ? `${age}岁` : ''].filter(Boolean).join(' ') || '乐生活用户';
  const ipLocation = profile.ip_location || '暂未显示';
  const coverStyle = profile.cover ? ` style="background-image:linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.62)),url('${escAttr(profile.cover)}');"` : '';
  const publicId = uidToNumericId(String(userId));
  const userPosts = posts
    .filter(p => p.user_id === userId && (p.visibility === 'public' || !p.visibility))
    .sort((a,b) => (b.pinned?1:0) - (a.pinned?1:0));
  const totalLikes = userPosts.reduce((sum,p) => sum + (Number(p.likes) || 0), 0);
  const isSelf = session && session.user && session.user.id === userId;
  const followBtn = isSelf
    ? `<button class="primary" onclick="closeUserPublicPage();switchTab('profile');">${uiIcon('user',16)}我的主页</button>`
    : `<button class="action-btn" id="userPublicFollowBtn" onclick="togglePublicUserFollow('${String(userId).replace(/'/g,'')}','${String(name).replace(/'/g,'')}')">${followRelationshipLabel(userId)}</button>`;
  return `
    <div class="profile-page-shell">
      <div class="profile-cover-card">
        <div class="profile-cover-bg public-profile-cover${profile.cover ? ' has-image' : ''}"${coverStyle}>
          <button class="profile-cover-menu-btn" onclick="togglePublicProfileMenu(event)" aria-label="菜单">${uiIcon('menu',19)}</button>
          <div class="profile-menu public-profile-menu" id="publicProfileMenu">
            <button onclick="event.stopPropagation();sharePublicUserPage('${String(userId).replace(/'/g,'')}','${String(name).replace(/'/g,'')}')">${uiIcon('share',15)}转发主页</button>
            <button onclick="event.stopPropagation();openPublicUserDm('${String(userId).replace(/'/g,'')}','${String(name).replace(/'/g,'')}')">${uiIcon('message',15)}发私信</button>
          </div>
          <button class="public-profile-close" onclick="appNavigateBack()" aria-label="关闭">×</button>
          <div class="profile-cover-info">
            <div class="profile-cover-avatar" style="cursor:default;">${avatar ? `<img src="${escAttr(avatar)}" alt="" style="width:100%;height:100%;object-fit:cover;">` : escHtml(initials(name))}</div>
            <div class="profile-cover-main">
              <div class="profile-cover-name-row"><div class="profile-cover-name">${escHtml(name)}</div></div>
              <div class="profile-cover-id">ID: ${escHtml(publicId)}</div>
              <div class="profile-cover-location">IP属地：${escHtml(ipLocation)}</div>
              <div class="profile-cover-bio">${escHtml(bio)}</div>
              <div class="profile-cover-tags"><span>${escHtml(ageText)}</span>${tags.map(tag => `<span>${escHtml(tag)}</span>`).join('')}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="profile-actions-row">
        ${followBtn}
        ${isSelf ? '' : `<button onclick="openPublicUserDm('${String(userId).replace(/'/g,'')}','${String(name).replace(/'/g,'')}')">${uiIcon('message',16)}发私信</button>`}
      </div>
      <div class="profile-follow-stats" style="margin-bottom:12px;">
        <div><b>${userPosts.length}</b>笔记</div><div><b>♥ ${totalLikes}</b>获赞</div>
      </div>
      <div class="profile-content">
        <div class="content-tabs"><button class="content-tab active">笔记</button></div>
        <div class="content-body">
        ${userPosts.length
          ? `<div class="user-content-grid">${userPosts.map(publicUserCardHtml).join('')}</div>`
          : `<div class="empty-state" style="text-align:center;padding:40px 20px;"><span style="display:block;margin:0 auto 10px;width:40px;height:40px;color:var(--ink-faint);">${uiIcon('edit',40)}</span><p style="color:var(--ink-soft);">这个用户还没有公开笔记</p></div>`}
        </div>
      </div>
    </div>
  `;
}
function renderUserPublicFollowState(userId){
  const btn = document.getElementById('userPublicFollowBtn');
  if(btn) btn.textContent = followRelationshipLabel(userId);
}
async function togglePublicUserFollow(userId, name){
  await toggleFollowUser(userId, name);
  renderUserPublicFollowState(userId);
}
function togglePublicProfileMenu(e){
  if(e) e.stopPropagation();
  document.getElementById('publicProfileMenu')?.classList.toggle('open');
}
function closePublicProfileMenu(){ document.getElementById('publicProfileMenu')?.classList.remove('open'); }
function openPublicUserDm(userId, name){
  if(!(session && session.user)){ showToast('请先登录后再发私信'); openAuth(); return; }
  closePublicProfileMenu();
  closeUserPublicPage();
  // 主页上的私信直接在当前页发起会话；避免独立消息模块在 App WebView 中被路由层吞掉。
  requestAnimationFrame(() => openDmTo(userId, name));
}
async function openUserPublicPage(userId, fallbackName){
  if(!userId){ showToast('没有找到用户主页'); return; }
  if(!appNavigation?.isRestoring()) appNavigation?.enter({ type:'user', userId, name:fallbackName || '' });
  if(session && session.user && userId === session.user.id){
    closeSearchPage();
    closeUserPublicPage();
    switchTab('profile');
    return;
  }
  if(isVerifiedMerchantUser(userId)){
    closeUserPublicPage();
    openMerchantPublicPage(userId);
    return;
  }
  closeSearchPage();
  const overlay = document.getElementById('userPublicOverlay');
  const body = document.getElementById('userPublicBody');
  if(!overlay || !body) return;
  overlay.dataset.userId = userId;
  overlay.dataset.name = fallbackName || '';
  overlay.classList.add('open');
  body.innerHTML = '<div class="deals-empty-panel" style="margin:20px;">正在打开用户主页...</div>';
  try {
    let profile = cachedProfile(userId, fallbackName);
    const row = await profileApi?.getByUserId({ userId });
    if(row) profile = Object.assign(profile, row);
    setProfileCache(profile);
    body.innerHTML = userPublicContentHtml(userId, profile);
  } catch(e){
    console.warn('打开用户主页失败:', e.message);
    body.innerHTML = '<div class="deals-empty-panel" style="margin:20px;">用户主页暂时打不开，请稍后再试。</div>';
  }
}
function closeUserPublicPage(){
  closePublicProfileMenu();
  const overlay = document.getElementById('userPublicOverlay');
  if(overlay){
    overlay.classList.remove('open');
    overlay.dataset.userId = '';
    overlay.dataset.name = '';
  }
}
async function openAuthorHome(userId){
  if(!userId){ showToast('没有找到作者主页'); return; }
  const isSelf = session && session.user && userId === session.user.id;
  if(isSelf){
    closePost();
    switchTab('profile');
    return;
  }
  try {
    if(!merchantPublicApi) throw new Error('商家资料接口未初始化');
    const merchant = await merchantPublicApi.getByUserId({ userId, select:'user_id,logo,business_name,verified', verified:true });
    if(merchant){
        setMerchantIdentityCache(userId, merchant);
        closePost();
        openMerchantPublicPage(userId);
        return;
    }
  } catch(e){ console.warn('作者主页检查失败:', e.message); }
  closePost();
  const p = posts.find(item => item.user_id === userId);
  openUserPublicPage(userId, p ? p.author : '');
}
/* 打开商家资料编辑面板 */
const MERCHANT_WEEK_DAYS = ['周一','周二','周三','周四','周五','周六','周日'];
function merchantDefaultHours(){
  return MERCHANT_WEEK_DAYS.map(day => ({ day, open:true, time:'11:00 - 21:00' }));
}
function parseMerchantHours(text){
  const raw = String(text || '').trim();
  const rows = merchantDefaultHours();
  if(!raw) return rows;
  const timeMatch = raw.match(/(\d{1,2}:\d{2}\s*[-~—至到]\s*\d{1,2}:\d{2})/);
  const normalizedTime = timeMatch ? timeMatch[1].replace(/[~—至到]/g, '-').replace(/\s*-\s*/g, ' - ') : raw;
  if(raw.includes('周一至周日') || raw.includes('每天') || raw.includes('全周')){
    return rows.map(r => Object.assign({}, r, { open:true, time:normalizedTime }));
  }
  const dayIndex = day => MERCHANT_WEEK_DAYS.indexOf(day);
  const applyRange = (fromDay, toDay, value) => {
    const from = dayIndex(fromDay);
    const to = dayIndex(toDay);
    if(from < 0 || to < 0) return;
    const start = Math.min(from, to);
    const end = Math.max(from, to);
    const isOff = /休息|关闭|不营业/.test(value);
    const time = isOff ? '' : String(value).replace(/[~—至到]/g, '-').replace(/\s*-\s*/g, ' - ');
    for(let i = start; i <= end; i++){
      rows[i] = { day: MERCHANT_WEEK_DAYS[i], open: !isOff, time };
    }
  };
  raw.replace(/(周[一二三四五六日])\s*(?:至|到|[-~—])\s*(周[一二三四五六日])\s*(休息|关闭|不营业|\d{1,2}:\d{2}\s*[-~—至到]\s*\d{1,2}:\d{2})/g, (_, fromDay, toDay, value) => {
    applyRange(fromDay, toDay, value);
    return _;
  });
  MERCHANT_WEEK_DAYS.forEach((day, idx) => {
    const dayRe = new RegExp(`${day}[^周]*?(休息|关闭|不营业|\\d{1,2}:\\d{2}\\s*[-~—至到]\\s*\\d{1,2}:\\d{2})`);
    const match = raw.match(dayRe);
    if(match){
      if(/休息|关闭|不营业/.test(match[1])) rows[idx] = { day, open:false, time:'' };
      else rows[idx] = { day, open:true, time:match[1].replace(/[~—至到]/g, '-').replace(/\s*-\s*/g, ' - ') };
    }
  });
  return rows;
}
function merchantHoursEditorHtml(text){
  const rows = parseMerchantHours(text);
  return `
    <div class="merchant-hours-list">
      ${rows.map((row, i) => `
        <div class="merchant-hours-row ${row.open ? '' : 'off'}" id="mBizHourRow${i}">
          <label class="merchant-hours-day">
            <input type="checkbox" id="mBizHourOpen${i}" ${row.open ? 'checked' : ''} onchange="toggleMerchantHourDay(${i})">
            ${row.day}
          </label>
          <input type="text" id="mBizHourTime${i}" value="${escAttr(row.time || '')}" placeholder="休息 / 11:00 - 21:00" ${row.open ? '' : 'disabled'}>
        </div>
      `).join('')}
    </div>
  `;
}
function toggleMerchantHourDay(i){
  const checked = !!document.getElementById(`mBizHourOpen${i}`)?.checked;
  const row = document.getElementById(`mBizHourRow${i}`);
  const input = document.getElementById(`mBizHourTime${i}`);
  if(row) row.classList.toggle('off', !checked);
  if(input){
    input.disabled = !checked;
    if(checked && !input.value.trim()) input.value = '11:00 - 21:00';
  }
}
function merchantDayRangeLabel(start, end){
  if(start === end) return MERCHANT_WEEK_DAYS[start];
  return `${MERCHANT_WEEK_DAYS[start]}至${MERCHANT_WEEK_DAYS[end]}`;
}
function compactMerchantHourRows(rows){
  const openRows = rows.filter(r => r.open && r.time);
  if(!openRows.length) return '暂无营业时间';
  const allSame = openRows.length === 7 && openRows.every(r => r.time === openRows[0].time);
  if(allSame) return `周一至周日 ${openRows[0].time}`;
  const parts = [];
  let start = 0;
  while(start < rows.length){
    const key = rows[start].open && rows[start].time ? rows[start].time : '休息';
    let end = start;
    while(end + 1 < rows.length){
      const nextKey = rows[end + 1].open && rows[end + 1].time ? rows[end + 1].time : '休息';
      if(nextKey !== key) break;
      end++;
    }
    parts.push(`${merchantDayRangeLabel(start, end)} ${key}`);
    start = end + 1;
  }
  return parts.join('；');
}
function formatMerchantHoursForDisplay(text){
  const raw = String(text || '').trim();
  if(!raw) return '';
  return compactMerchantHourRows(parseMerchantHours(raw));
}
function collectMerchantHours(){
  const rows = MERCHANT_WEEK_DAYS.map((day, i) => {
    const open = !!document.getElementById(`mBizHourOpen${i}`)?.checked;
    const time = document.getElementById(`mBizHourTime${i}`)?.value.trim() || '';
    return { day, open, time };
  });
  return compactMerchantHourRows(rows);
}
function openMerchantEditSheet(){
  const m = currentMerchant || {};
  const perksStr = Array.isArray(m.perks) ? m.perks.join(',') : '';
  const slug = merchantSiteSlug(m);
  const externalLinksText = merchantSocialLinks(m).map(link => link.url).join('\n');
  document.getElementById('merchantEditSheetBody').innerHTML = `
    <div class="merchant-edit-media">
      <div style="text-align:center;">
        <div class="merchant-edit-logo-preview" onclick="document.getElementById('merchantLogoInput').click()">
          ${m.logo ? `<img src="${escAttr(m.logo)}" alt="">` : uiIcon('store',28)}
        </div>
        <button onclick="document.getElementById('merchantLogoInput').click()">修改Logo</button>
        <input type="file" id="merchantLogoInput" accept="image/*" style="display:none;" onchange="onMerchantImageSelected(event,'logo')">
      </div>
      <div>
        <div class="merchant-edit-cover-preview" onclick="document.getElementById('merchantCoverInput').click()">
          ${m.cover_image ? `<img src="${escAttr(m.cover_image)}" alt="">` : '点击上传背景图'}
        </div>
        <button onclick="document.getElementById('merchantCoverInput').click()">修改背景</button>
        <input type="file" id="merchantCoverInput" accept="image/*" style="display:none;" onchange="onMerchantImageSelected(event,'cover')">
      </div>
    </div>
    <div style="margin-bottom:12px;">
      <label style="display:block;font-size:12px;font-weight:600;margin-bottom:6px;color:var(--ink-soft);">店铺名称</label>
      <input type="text" id="mBizName" value="${escAttr(m.business_name)}" style="width:100%;padding:10px;border:1px solid var(--line);border-radius:8px;font-size:14px;font-family:inherit;">
    </div>
    <div style="margin-bottom:12px;">
      <label style="display:block;font-size:12px;font-weight:600;margin-bottom:6px;color:var(--ink-soft);">微网站地址</label>
      <div style="display:flex;align-items:center;gap:6px;">
        <span style="font-size:12px;color:var(--ink-faint);white-space:nowrap;">escoopcity.com/地区/merchant/</span>
        <input type="text" id="mBizSlug" value="${escAttr(slug)}" placeholder="tea-station" oninput="scheduleMerchantSlugCheck()" onblur="checkMerchantSlugAvailability(false)" style="flex:1;min-width:0;padding:10px;border:1px solid var(--line);border-radius:8px;font-size:14px;font-family:inherit;">
      </div>
      <div id="mBizSlugStatus" style="font-size:11px;color:var(--ink-faint);margin-top:5px;">只能使用英文、数字和短横线；链接每 365 天只能修改一次。</div>
    </div>
    <div style="margin-bottom:12px;">
      <label style="display:block;font-size:12px;font-weight:600;margin-bottom:6px;color:var(--ink-soft);">所在地 <span style="color:var(--berry);">*</span></label>
      <select id="mBizMarket" onchange="scheduleMerchantSlugCheck()" style="width:100%;padding:10px;border:1px solid var(--line);border-radius:8px;font-size:14px;">${marketSelectOptions(m.market_code)}</select>
      <div style="font-size:11px;color:var(--ink-faint);margin-top:5px;">决定微网站地区链接，例如 LA 会显示为 /la/merchant/店铺名。</div>
    </div>
    <div style="display:flex;gap:10px;margin-bottom:12px;">
      <div style="flex:1;">
        <label style="display:block;font-size:12px;font-weight:600;margin-bottom:6px;color:var(--ink-soft);">主营类型</label>
        <select id="mBizCat" style="width:100%;padding:10px;border:1px solid var(--line);border-radius:8px;font-size:14px;">
          ${merchantCategorySelectOptions(m.category)}
        </select>
      </div>
      <div style="flex:1;">
        <label style="display:block;font-size:12px;font-weight:600;margin-bottom:6px;color:var(--ink-soft);">细分业态（如：奶茶）</label>
        <input type="text" id="mBizSubcat" value="${escAttr(m.subcategory)}" style="width:100%;padding:10px;border:1px solid var(--line);border-radius:8px;font-size:14px;font-family:inherit;">
      </div>
    </div>
    <div style="margin-bottom:12px;">
      <label style="display:block;font-size:12px;font-weight:600;margin-bottom:6px;color:var(--ink-soft);">地址</label>
      <div style="display:flex;gap:8px;align-items:center;">
        <input type="text" id="mBizAddr" value="${escAttr(m.address)}" placeholder="请输入完整门牌、街道、城市和州" style="flex:1;min-width:0;padding:10px;border:1px solid var(--line);border-radius:8px;font-size:14px;font-family:inherit;">
        <button type="button" onclick="findMerchantAddressCandidates()" style="flex-shrink:0;border:1px solid var(--sage);border-radius:999px;background:#fff;color:var(--sage-dark);font-size:11px;font-weight:900;padding:9px 10px;">查找位置</button>
      </div>
      <div id="mBizGeocodeCandidates" style="display:grid;gap:7px;margin-top:8px;"></div>
    </div>
    <div style="margin-bottom:12px;padding:11px;border:1px solid var(--line);border-radius:12px;background:var(--bg-alt);">
      <div style="font-size:12px;font-weight:900;color:var(--ink);">门店定位</div>
      <div id="mBizLocationStatus" style="font-size:11px;color:var(--ink-soft);line-height:1.45;margin:5px 0 8px;">${isMembershipCoordinate(m.latitude) && isMembershipCoordinate(m.longitude) ? `已设置门店坐标：${Number(m.latitude).toFixed(5)}, ${Number(m.longitude).toFixed(5)}` : '到店后使用当前定位，可让会员卡“附近”按真实距离排序。'}</div>
      <button type="button" onclick="captureMerchantStoreLocation()" style="border:1px solid var(--sage);border-radius:999px;background:#fff;color:var(--sage-dark);font-size:11px;font-weight:900;padding:7px 10px;">使用当前定位作为门店位置</button>
    </div>
    <div style="margin-bottom:12px;">
      <label style="display:block;font-size:12px;font-weight:600;margin-bottom:6px;color:var(--ink-soft);">电话</label>
      <input type="tel" id="mBizPhone" value="${escAttr(m.phone)}" style="width:100%;padding:10px;border:1px solid var(--line);border-radius:8px;font-size:14px;font-family:inherit;">
    </div>
    <div style="margin-bottom:12px;">
      <label style="display:block;font-size:12px;font-weight:600;margin-bottom:6px;color:var(--ink-soft);">营业时间</label>
      ${merchantHoursEditorHtml(m.business_hours)}
    </div>
    <div style="margin-bottom:12px;">
      <label style="display:block;font-size:12px;font-weight:600;margin-bottom:6px;color:var(--ink-soft);">商家简介</label>
      <textarea id="mBizIntro" maxlength="50" placeholder="介绍店铺特色、适合人群、招牌产品（最多50字，每行建议不超过20字）" style="width:100%;min-height:72px;padding:10px;border:1px solid var(--line);border-radius:8px;font-size:14px;font-family:inherit;resize:vertical;">${escHtml(m.intro || '')}</textarea>
    </div>
    <div style="margin-bottom:12px;">
      <label style="display:block;font-size:12px;font-weight:600;margin-bottom:6px;color:var(--ink-soft);">外部链接（一行一个）</label>
      <textarea id="mBizExternalLinks" placeholder="官网 / Instagram / 小红书 / Yelp / Google Business 链接" style="width:100%;min-height:68px;padding:10px;border:1px solid var(--line);border-radius:8px;font-size:14px;font-family:inherit;resize:vertical;">${escHtml(externalLinksText)}</textarea>
    </div>
    <div style="margin-bottom:12px;">
      <label style="display:block;font-size:12px;font-weight:600;margin-bottom:6px;color:var(--ink-soft);">会员优惠（用逗号分隔，最多4个）</label>
      <input type="text" id="mBizPerks" value="${escAttr(perksStr)}" placeholder="例如: 会员日9折,生日双倍积分" style="width:100%;padding:10px;border:1px solid var(--line);border-radius:8px;font-size:14px;font-family:inherit;">
    </div>
    <div style="display:flex;gap:10px;margin-bottom:16px;">
      <div style="flex:1;">
        <label style="display:block;font-size:12px;font-weight:600;margin-bottom:6px;color:var(--ink-soft);">集章目标</label>
        <input type="number" id="mBizLoyaltyTarget" min="1" max="99" value="${m.loyalty_target || 8}" style="width:100%;padding:10px;border:1px solid var(--line);border-radius:8px;font-size:14px;font-family:inherit;">
      </div>
      <div style="flex:2;">
        <label style="display:block;font-size:12px;font-weight:600;margin-bottom:6px;color:var(--ink-soft);">兑换奖励</label>
        <input type="text" id="mBizLoyaltyReward" value="${escAttr(m.loyalty_reward || '免费一杯')}" style="width:100%;padding:10px;border:1px solid var(--line);border-radius:8px;font-size:14px;font-family:inherit;">
      </div>
    </div>
    <div style="margin:0 0 12px;padding:12px;border:1px solid var(--line);border-radius:12px;background:var(--bg-alt);">
      <div style="font-size:12px;font-weight:900;color:var(--ink);margin-bottom:9px;">积分与会员等级</div>
      <div style="display:flex;gap:10px;">
        <div style="flex:1;"><label style="display:block;font-size:11px;font-weight:700;margin-bottom:5px;color:var(--ink-soft);">每次消费积分</label><input type="number" id="mBizPointsPerVisit" min="0" max="1000" value="${merchantPointsPerVisit(m)}" style="width:100%;padding:10px;border:1px solid var(--line);border-radius:8px;font-size:14px;font-family:inherit;"></div>
        <div style="flex:2;"><label style="display:block;font-size:11px;font-weight:700;margin-bottom:5px;color:var(--ink-soft);">生日月权益</label><input type="text" id="mBizBirthdayReward" maxlength="40" value="${escAttr(m.birthday_reward || '')}" placeholder="例如：双倍积分或赠送小食" style="width:100%;padding:10px;border:1px solid var(--line);border-radius:8px;font-size:14px;font-family:inherit;"></div>
      </div>
      <div style="display:flex;gap:8px;margin-top:10px;">
        <div style="flex:1;"><label style="display:block;font-size:11px;font-weight:700;margin-bottom:5px;color:var(--ink-soft);">银卡积分</label><input type="number" id="mBizTierSilver" min="1" max="999999" value="${merchantTierRules(m).silver}" style="width:100%;padding:9px;border:1px solid var(--line);border-radius:8px;font-size:13px;font-family:inherit;"></div>
        <div style="flex:1;"><label style="display:block;font-size:11px;font-weight:700;margin-bottom:5px;color:var(--ink-soft);">金卡积分</label><input type="number" id="mBizTierGold" min="2" max="999999" value="${merchantTierRules(m).gold}" style="width:100%;padding:9px;border:1px solid var(--line);border-radius:8px;font-size:13px;font-family:inherit;"></div>
        <div style="flex:1;"><label style="display:block;font-size:11px;font-weight:700;margin-bottom:5px;color:var(--ink-soft);">黑金积分</label><input type="number" id="mBizTierBlack" min="3" max="999999" value="${merchantTierRules(m).black}" style="width:100%;padding:9px;border:1px solid var(--line);border-radius:8px;font-size:13px;font-family:inherit;"></div>
      </div>
      <div style="font-size:10.5px;color:var(--ink-faint);line-height:1.45;margin-top:8px;">商家确认一次消费时，会自动增加消费次数并赠送设定的积分。</div>
    </div>
    <div id="merchantProfileSaveStatus" role="status" style="min-height:18px;margin:0 0 8px;color:var(--ink-soft);font-size:12px;"></div>
    <div class="merchant-profile-save-actions">
      <button type="button" id="merchantProfileSaveButton" style="flex:1;padding:12px;border-radius:10px;background:var(--sage);color:#fff;border:none;cursor:pointer;font-weight:600;font-size:13px;">✓ 保存</button>
      <button onclick="closeMerchantEditSheet()" style="flex:1;padding:12px;border-radius:10px;background:var(--bg-alt);color:var(--ink);border:1px solid var(--line);cursor:pointer;font-weight:600;font-size:13px;">✕ 取消</button>
    </div>
  `;
  merchantSlugCheckState = { slug, available:true };
  const saveButton = document.getElementById('merchantProfileSaveButton');
  if(saveButton) saveButton.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    saveMerchantProfile();
  });
  document.getElementById('merchantEditSheet')?.classList.add('open');
}
function closeMerchantEditSheet(){ document.getElementById('merchantEditSheet')?.classList.remove('open'); }
function setMerchantProfileSaveStatus(message, tone){
  const status = document.getElementById('merchantProfileSaveStatus');
  if(!status) return;
  status.textContent = message || '';
  status.style.color = tone === 'error' ? 'var(--berry-dark)' : tone === 'good' ? 'var(--sage-dark)' : 'var(--ink-soft)';
}
window._merchantGeocodeCandidates = [];
async function findMerchantAddressCandidates(){
  if(!(session && session.access_token && currentMerchant && currentMerchant.user_id === session.user.id)){
    showToast('只有已认证商家可以查找门店位置');
    return;
  }
  const input = document.getElementById('mBizAddr');
  const address = input && input.value.trim();
  const resultBox = document.getElementById('mBizGeocodeCandidates');
  const status = document.getElementById('mBizLocationStatus');
  if(!address || address.length < 5){ showToast('请先输入完整门店地址'); return; }
  if(resultBox) resultBox.innerHTML = '<div style="font-size:11px;color:var(--ink-soft);">正在查找候选位置…</div>';
  if(status) status.textContent = '正在根据地址查找门店位置…';
  try {
    const res = await authedFetch(`${SUPABASE_URL}/functions/v1/merchant-geocode`, {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ address })
    });
    const data = await res.json().catch(() => ({}));
    if(!res.ok) throw new Error(data.error || `地址查询失败：${res.status}`);
    const candidates = Array.isArray(data.results) ? data.results : [];
    window._merchantGeocodeCandidates = candidates;
    if(!candidates.length){
      if(resultBox) resultBox.innerHTML = '<div style="font-size:11px;color:var(--ink-faint);">没有找到相符位置，请补充门牌号、城市或州。</div>';
      if(status) status.textContent = '尚未找到门店位置。';
      return;
    }
    if(resultBox) resultBox.innerHTML = candidates.map((item, index) => `
      <button type="button" onclick="selectMerchantGeocodeCandidate(${index})" style="text-align:left;border:1px solid var(--line);border-radius:10px;background:#fff;padding:9px 10px;color:var(--ink);font:inherit;">
        <b style="display:block;font-size:12px;">${escHtml(item.formatted_address)}</b>
        <span style="display:block;margin-top:3px;font-size:10.5px;color:var(--ink-faint);">选择此地址作为门店位置</span>
      </button>
    `).join('');
    if(status) status.textContent = '请选择一个正确的门店地址，确认后再点击保存。';
  } catch(e){
    console.warn('商家地址定位失败:', e.message);
    if(resultBox) resultBox.innerHTML = `<div style="font-size:11px;color:#b9413a;">${escHtml(e.message || '地址查询失败，请稍后再试。')}</div>`;
    if(status) status.textContent = '地址定位暂时不可用。';
  }
}
function selectMerchantGeocodeCandidate(index){
  const item = (window._merchantGeocodeCandidates || [])[index];
  if(!item || !isMembershipCoordinate(item.latitude) || !isMembershipCoordinate(item.longitude)) return;
  currentMerchant = Object.assign({}, currentMerchant, {
    latitude: Number(item.latitude),
    longitude: Number(item.longitude),
    location_updated_at: new Date().toISOString()
  });
  const input = document.getElementById('mBizAddr');
  if(input) input.value = item.formatted_address || input.value;
  const status = document.getElementById('mBizLocationStatus');
  if(status) status.textContent = `已选择门店位置：${currentMerchant.latitude.toFixed(5)}, ${currentMerchant.longitude.toFixed(5)}。点击保存后生效。`;
  const resultBox = document.getElementById('mBizGeocodeCandidates');
  if(resultBox) resultBox.innerHTML = '<div style="font-size:11px;color:var(--sage-dark);font-weight:900;">已选择此门店位置。</div>';
}
function captureMerchantStoreLocation(){
  if(!navigator.geolocation){ showToast('当前设备不支持定位'); return; }
  const status = document.getElementById('mBizLocationStatus');
  if(status) status.textContent = '正在获取当前位置…';
  navigator.geolocation.getCurrentPosition(position => {
    currentMerchant = Object.assign({}, currentMerchant, {
      latitude: Number(position.coords.latitude.toFixed(6)),
      longitude: Number(position.coords.longitude.toFixed(6)),
      location_updated_at: new Date().toISOString()
    });
    if(status) status.textContent = `已取得门店坐标：${currentMerchant.latitude.toFixed(5)}, ${currentMerchant.longitude.toFixed(5)}。点击保存后生效。`;
  }, error => {
    if(status) status.textContent = error && error.code === 1 ? '未获得定位权限，请在浏览器或 App 设置中允许位置权限。' : '定位失败，请在门店内稍后重试。';
  }, { enableHighAccuracy:true, timeout:10000, maximumAge:0 });
}
/* Logo/封面图上传：读取→裁剪→暂存到 currentMerchant，点"保存"时才真正写库 */
function onMerchantImageSelected(event, type){
  const file = event.target.files && event.target.files[0];
  event.target.value = '';
  if(!file || !file.type || !file.type.startsWith('image/')){
    if(file) showToast('请选择图片文件');
    return;
  }
  const reader = new FileReader();
  reader.onload = ev => {
    const img = new Image();
    img.onload = () => {
      // Keep the merchant editor behind the cropper. Logo is square; cover is always wide.
      if(type === 'logo') openAvatarCropper(img, ev.target.result, 'merchantLogo');
      else openCoverCropper(img, ev.target.result, 'merchantCover');
    };
    img.onerror = () => showToast('图片读取失败，请换一张试试');
    img.src = ev.target.result;
  };
  reader.onerror = () => showToast('图片读取失败，请换一张试试');
  reader.readAsDataURL(file);
}
/* 保存商家资料：以店长账号为唯一键直接更新或新建，兼容浏览器和原生 App。 */
async function saveMerchantProfile(){
  setMerchantProfileSaveStatus('正在确认登录状态…');
  if(!(session && session.user)) await loadSession();
  if(!(session && session.user)){ setMerchantProfileSaveStatus('请先登录后再保存。', 'error'); showToast('请先登录'); return; }
  if(!session.access_token && session.refresh_token) await refreshSession();
  const saveButton = document.getElementById('merchantProfileSaveButton');
  if(saveButton){ saveButton.disabled = true; saveButton.textContent = '正在保存…'; }
  try {
  setMerchantProfileSaveStatus('正在检查商家资料…');
  const perksInput = document.getElementById('mBizPerks');
  const slugInput = document.getElementById('mBizSlug');
  if(!perksInput || !slugInput){ setMerchantProfileSaveStatus('编辑页面尚未准备完成，请关闭后重新打开。', 'error'); showToast('编辑页面尚未准备完成，请关闭后重新打开。'); return; }
  const perks = perksInput.value.split(',').map(s => s.trim()).filter(Boolean).slice(0,4);
  const slug = normalizeMerchantSlug(slugInput.value);
  slugInput.value = slug;
  const previousSlug = normalizeMerchantSlug(currentMerchant && currentMerchant.slug);
  const slugMessage = merchantSlugInputMessage(slug);
  if(slugMessage){ setMerchantSlugStatus(slugMessage, 'warn'); setMerchantProfileSaveStatus(slugMessage, 'error'); showToast(slugMessage); return; }
  const cooldownDays = merchantSlugCooldownDays(currentMerchant, slug);
  if(cooldownDays){
    const message = `链接每 365 天只能修改一次，还需 ${cooldownDays} 天后可以更改。`;
    setMerchantSlugStatus(message, 'warn'); setMerchantProfileSaveStatus(message, 'error'); showToast(message); return;
  }
  // Editing ordinary business information must not depend on a second network lookup
  // when the merchant keeps the link they already own.
  let slugCheck = { slug, available:true };
  if(slug !== previousSlug){
    try {
      slugCheck = await checkMerchantSlugAvailability(true);
    } catch(e){
      console.warn('商家链接检查异常:', e.message);
      slugCheck = { slug, available:false };
    }
  }
  if(!slugCheck.available || slugCheck.slug !== slug){
    const message = '这个链接已经被使用，或暂时无法核对，请换一个后再保存。';
    setMerchantSlugStatus(message, 'warn'); setMerchantProfileSaveStatus(message, 'error'); showToast(message); return;
  }
  const externalLinks = document.getElementById('mBizExternalLinks').value
    .split(/\n|,/).map(s => s.trim()).filter(Boolean).slice(0, 5);
  const intro = document.getElementById('mBizIntro').value.trim();
  if(intro.length > 50){ setMerchantProfileSaveStatus('商家介绍最多 50 个字。', 'error'); showToast('商家介绍最多 50 个字'); return; }
  const businessName = document.getElementById('mBizName').value.trim();
  const marketCode = normalizeMarketCode(document.getElementById('mBizMarket')?.value);
  if(!businessName){ setMerchantProfileSaveStatus('请填写商家名称。', 'error'); showToast('请填写商家名称'); return; }
  try {
    const nameAvailable = await merchantBusinessNameAvailable(businessName, marketCode);
    if(!nameAvailable){
      const message = '该地区已有同名商家，请在名称中加入门店或区域后缀后再保存。';
      setMerchantProfileSaveStatus(message, 'error'); showToast(message); return;
    }
  } catch(error){
    setMerchantProfileSaveStatus('暂时无法核对商家名称，请稍后重试。', 'error'); showToast('暂时无法核对商家名称，请稍后重试'); return;
  }
  const tierSilver = Math.max(1, parseInt(document.getElementById('mBizTierSilver').value, 10) || 100);
  const tierGold = Math.max(tierSilver + 1, parseInt(document.getElementById('mBizTierGold').value, 10) || 300);
  const tierBlack = Math.max(tierGold + 1, parseInt(document.getElementById('mBizTierBlack').value, 10) || 600);
  const payload = {
    slug,
    market_code: marketCode,
    business_name: businessName,
    category: document.getElementById('mBizCat').value,
    subcategory: document.getElementById('mBizSubcat').value.trim(),
    address: document.getElementById('mBizAddr').value.trim(),
    phone: document.getElementById('mBizPhone').value.trim(),
    business_hours: collectMerchantHours(),
    intro,
    external_links: externalLinks,
    perks: perks,
    loyalty_target: parseInt(document.getElementById('mBizLoyaltyTarget').value) || 8,
    loyalty_reward: document.getElementById('mBizLoyaltyReward').value.trim() || '免费一杯',
    points_per_visit: Math.max(0, Math.min(1000, parseInt(document.getElementById('mBizPointsPerVisit').value, 10) || 0)),
    birthday_reward: document.getElementById('mBizBirthdayReward').value.trim().slice(0, 40) || null,
    membership_tiers: { silver:tierSilver, gold:tierGold, black:tierBlack },
    logo: (currentMerchant && currentMerchant.logo) || null,
    cover_image: (currentMerchant && currentMerchant.cover_image) || null,
    latitude: isMembershipCoordinate(currentMerchant && currentMerchant.latitude) ? Number(currentMerchant.latitude) : null,
    longitude: isMembershipCoordinate(currentMerchant && currentMerchant.longitude) ? Number(currentMerchant.longitude) : null,
    location_updated_at: (currentMerchant && currentMerchant.location_updated_at) || null,
    updated_at: new Date().toISOString()
  };
    // Upsert is deliberately used here instead of PATCH-then-POST. It works consistently
    // in browser and native WebView, even when a successful update has no response body.
    setMerchantProfileSaveStatus('正在保存到云端…');
    if(!merchantPublicApi) throw new Error('商家资料接口未初始化');
    let rows;
    try { rows = await merchantPublicApi.upsert({ userId:session.user.id, payload }); }
    catch(error) {
      const errorText = error.message || '';
      console.warn('商家资料保存接口失败:', errorText);
      if(errorText.includes('merchant_slug_change_cooldown')) showToast('链接每 365 天只能修改一次。');
      else if(errorText.includes('merchant_slug_reserved')) showToast('这个链接为系统保留地址，请换一个。');
      else if(errorText.includes('merchant_slug_invalid')) showToast('链接只能使用英文、数字和短横线。');
      else if(errorText.includes('duplicate key') || errorText.includes('merchants_slug_unique_idx')) showToast('这个链接已经被其他商家使用。');
      else showToast('保存失败，请稍后重试');
      setMerchantProfileSaveStatus('保存失败，请稍后重试。', 'error');
      return;
    }
    currentMerchant = Object.assign({}, currentMerchant, payload, rows[0] || {});
    setMerchantIdentityCache(session.user.id, currentMerchant);
    closeMerchantEditSheet();
    renderMerchantPage();
    renderFeed();
    const weekPage = document.getElementById('page-week');
    if(weekPage && weekPage.classList.contains('active')) renderWeekFeed();
    if(activePostId) renderPostModal();
    const savedMessage = previousSlug && previousSlug !== slug ? '微网站链接已修改，365 天内不能再次修改。' : '商家资料已保存。';
    setMerchantProfileSaveStatus(savedMessage, 'good');
    showToast(`✓ ${savedMessage}`);
  } catch(e){ console.warn('商家资料保存失败:', e.message); setMerchantProfileSaveStatus('保存失败：' + (e.message || '请稍后重试'), 'error'); showToast('保存失败：' + (e.message || '请稍后重试')); }
  finally { if(saveButton){ saveButton.disabled = false; saveButton.textContent = '✓ 保存'; } }
}

function merchantApplicationStatusLabel(status){
  const map = { pending:'待审核', approved:'已通过', rejected:'未通过' };
  return map[status] || '未申请';
}
function merchantApplicationFriendlyError(message){
  const raw = String(message || '');
  const lower = raw.toLowerCase();
  if(lower.includes('relation') && lower.includes('does not exist')) return '数据库表还没创建：请先执行 3.80 商家认证 SQL。';
  if(lower.includes('permission denied') || lower.includes('row-level security') || lower.includes('violates row-level security')) return '权限不足：请确认已执行 3.80 SQL，并且管理员账号已加入 deal_admins。';
  if(lower.includes('jwt') || lower.includes('401')) return '登录状态已过期，请重新登录。';
  return '操作失败，请稍后重试或检查 Supabase 设置。';
}
function renderMerchantApplyBlock(){
  const el = document.getElementById('merchantApplyBlock');
  const topBtn = document.getElementById('merchantApplyTopBtn');
  if(!el) return;
  el.innerHTML = merchantMatrixWorkspaceCardHtml();
  if(topBtn){
    topBtn.style.display = 'none';
    topBtn.className = 'merchant-apply-top-btn';
    topBtn.innerHTML = `${uiIcon('store',13)}成为商家`;
    topBtn.title = '申请成为认证商家';
  }
  if(currentMerchant && currentMerchant.verified){ return; }
  if(!(session && session.user)){
    return;
  }
  const app = currentMerchantApplication;
  const status = app && app.status ? app.status : '';
  if(topBtn){
    const label = status === 'pending' ? '审核中' : status === 'rejected' ? '重新申请' : '成为商家';
    topBtn.style.display = 'inline-flex';
    topBtn.className = `merchant-apply-top-btn ${status || ''}`;
    topBtn.innerHTML = `${uiIcon('store',13)}${label}`;
    topBtn.title = status === 'pending'
      ? '商家认证申请审核中'
      : status === 'rejected'
        ? '商家认证未通过，可重新申请'
        : '申请成为认证商家';
  }
}
async function loadMerchantApplicationStatus(refreshProfile){
  if(!(session && session.user)){
    currentMerchantApplication = null;
    renderMerchantApplyBlock();
    return;
  }
  try {
    const select = 'id,user_id,status,business_name,category,subcategory,address,phone,contact_name,contact_email,license_note,review_note,created_at,updated_at,reviewed_at';
    if(!merchantApplicationApi) throw new Error('商家认证接口未初始化');
    const rows = await merchantApplicationApi.listMine({userId:session.user.id, select});
    currentMerchantApplication = rows && rows[0] ? rows[0] : null;
  } catch(e){
    console.warn('商家认证申请读取失败:', e.message);
    currentMerchantApplication = null;
  }
  renderMerchantApplyBlock();
  if(refreshProfile && currentTab === 'profile') initProfilePage();
}
function openMerchantApplySheet(){
  if(!(session && session.user)){ showToast('请先登录'); openAuth(); return; }
  const app = currentMerchantApplication || currentMerchant || {};
  const readonly = app.status === 'pending';
  document.getElementById('merchantApplySheetBody').innerHTML = `
    <div style="font-size:15px;font-weight:800;margin:0 0 4px;">商家认证申请</div>
    <div style="font-size:12px;color:var(--ink-faint);line-height:1.6;margin-bottom:14px;">请填写真实店铺资料。审核通过后，你的账号会自动开启认证商家功能。</div>
    ${readonly ? '<div class="merchant-apply-card" style="margin-bottom:14px;"><div class="merchant-apply-sub">申请正在审核中。如需修改，请等待管理员驳回后重新提交。</div></div>' : ''}
    <div style="display:grid;gap:12px;">
      <div>
        <label style="display:block;font-size:12px;font-weight:700;margin-bottom:6px;color:var(--ink-soft);">店铺名称</label>
        <input id="maBizName" type="text" value="${escAttr(app.business_name)}" ${readonly ? 'disabled' : ''} style="width:100%;padding:10px;border:1px solid var(--line);border-radius:8px;font-size:14px;font-family:inherit;">
      </div>
      <div style="display:flex;gap:10px;">
        <div style="flex:1;">
          <label style="display:block;font-size:12px;font-weight:700;margin-bottom:6px;color:var(--ink-soft);">主营类型 <span style="color:#c23f65;">*</span></label>
          <select id="maCategory" onchange="renderMerchantApplicationSubcategories()" ${readonly ? 'disabled' : ''} style="width:100%;padding:10px;border:1px solid var(--line);border-radius:8px;font-size:14px;">
            ${merchantCategorySelectOptions(app.category)}
          </select>
        </div>
        <div style="flex:1;">
          <label style="display:block;font-size:12px;font-weight:700;margin-bottom:6px;color:var(--ink-soft);">细分业态 <span style="color:#c23f65;">*</span></label>
          <select id="maSubcategory" ${readonly ? 'disabled' : ''} style="width:100%;padding:10px;border:1px solid var(--line);border-radius:8px;font-size:14px;"></select>
        </div>
      </div>
      <div id="maCategoryFeature" style="margin-top:-4px;font-size:11px;line-height:1.5;color:var(--sage-dark);padding:9px 10px;border-radius:8px;background:var(--sage-light);"></div>
      <div>
        <label style="display:block;font-size:12px;font-weight:700;margin-bottom:6px;color:var(--ink-soft);">店铺地址</label>
        <input id="maAddress" type="text" value="${escAttr(app.address)}" ${readonly ? 'disabled' : ''} style="width:100%;padding:10px;border:1px solid var(--line);border-radius:8px;font-size:14px;font-family:inherit;">
      </div>
      <div style="display:flex;gap:10px;">
        <div style="flex:1;">
          <label style="display:block;font-size:12px;font-weight:700;margin-bottom:6px;color:var(--ink-soft);">电话</label>
          <input id="maPhone" type="tel" value="${escAttr(app.phone)}" ${readonly ? 'disabled' : ''} style="width:100%;padding:10px;border:1px solid var(--line);border-radius:8px;font-size:14px;font-family:inherit;">
        </div>
        <div style="flex:1;">
          <label style="display:block;font-size:12px;font-weight:700;margin-bottom:6px;color:var(--ink-soft);">联系人</label>
          <input id="maContactName" type="text" value="${escAttr(app.contact_name || currentUser.name)}" ${readonly ? 'disabled' : ''} style="width:100%;padding:10px;border:1px solid var(--line);border-radius:8px;font-size:14px;font-family:inherit;">
        </div>
      </div>
      <div>
        <label style="display:block;font-size:12px;font-weight:700;margin-bottom:6px;color:var(--ink-soft);">联系邮箱</label>
        <input id="maContactEmail" type="email" value="${escAttr(app.contact_email || (session.user && session.user.email) || '')}" ${readonly ? 'disabled' : ''} style="width:100%;padding:10px;border:1px solid var(--line);border-radius:8px;font-size:14px;font-family:inherit;">
      </div>
      <div>
        <label style="display:block;font-size:12px;font-weight:700;margin-bottom:6px;color:var(--ink-soft);">补充说明</label>
        <textarea id="maLicenseNote" placeholder="可填写官网、营业执照信息、Google Business 链接或其他证明" ${readonly ? 'disabled' : ''} style="width:100%;min-height:78px;padding:10px;border:1px solid var(--line);border-radius:8px;font-size:14px;font-family:inherit;resize:vertical;">${escHtml(app.license_note)}</textarea>
      </div>
    </div>
    <div style="display:flex;gap:10px;margin-top:16px;">
      ${readonly ? '' : '<button onclick="submitMerchantApplication()" style="flex:1;padding:12px;border-radius:10px;background:var(--sage);color:#fff;border:none;cursor:pointer;font-weight:800;font-size:13px;">提交认证</button>'}
      <button onclick="closeMerchantApplySheet()" style="flex:1;padding:12px;border-radius:10px;background:var(--bg-alt);color:var(--ink);border:1px solid var(--line);cursor:pointer;font-weight:800;font-size:13px;">关闭</button>
    </div>
  `;
  renderMerchantApplicationSubcategories(app.subcategory || '');
  document.getElementById('merchantApplySheet').style.display = 'block';
}
function closeMerchantApplySheet(){
  const el = document.getElementById('merchantApplySheet');
  if(el) el.style.display = 'none';
}
async function submitMerchantApplication(){
  if(!(session && session.user)){ showToast('请先登录'); openAuth(); return; }
  const businessName = document.getElementById('maBizName').value.trim();
  const category = document.getElementById('maCategory').value;
  const subcategory = document.getElementById('maSubcategory').value.trim();
  const address = document.getElementById('maAddress').value.trim();
  const phone = document.getElementById('maPhone').value.trim();
  const contactName = document.getElementById('maContactName').value.trim();
  const contactEmail = document.getElementById('maContactEmail').value.trim();
  const licenseNote = document.getElementById('maLicenseNote').value.trim();
  const categoryConfig = merchantCategoryConfig(category);
  if(!businessName || !categoryConfig || !subcategory || !address || !phone || !contactName || !contactEmail){
    showToast('请填写店铺名称、主营类型、细分业态、地址、电话、联系人和邮箱');
    return;
  }
  if(!categoryConfig.subcategories.includes(subcategory)){
    showToast('请选择对应主营类型下的细分业态');
    return;
  }
  const payload = {
    user_id: session.user.id,
    user_email: session.user.email || contactEmail,
    status: 'pending',
    business_name: businessName,
    category,
    subcategory,
    address,
    phone,
    contact_name: contactName,
    contact_email: contactEmail,
    license_note: licenseNote,
    review_note: null,
    updated_at: new Date().toISOString()
  };
  try {
    if(!merchantApplicationApi) throw new Error('商家认证接口未初始化');
    const rows = await merchantApplicationApi.submit(payload);
    currentMerchantApplication = rows && rows[0] ? rows[0] : Object.assign({}, payload);
    closeMerchantApplySheet();
    renderMerchantApplyBlock();
    showToast('已提交商家认证申请');
  } catch(e){
    console.warn('商家认证申请提交失败:', e.message);
    showToast(merchantApplicationFriendlyError(e.message));
  }
}
function merchantApplicationCardHtml(a){
  const busy = !!merchantApplicationBusy[a.id];
  const cat = merchantCategoryLabel(a.category);
  return `
    <div class="deals-result-card">
      <div class="deals-result-top">
        <div class="deals-result-name">${escHtml(a.business_name || '未填写店名')}<span>${escHtml(cat)}${a.subcategory ? ' / ' + escHtml(a.subcategory) : ''}</span></div>
        <div class="deals-result-price"><b>${merchantApplicationStatusLabel(a.status)}</b><span>${a.created_at ? new Date(a.created_at).toLocaleDateString('zh-CN') : ''}</span></div>
      </div>
      <div class="deals-result-meta">
        <div><b>地址</b>${escHtml(a.address || '未填写')}</div>
        <div><b>电话</b>${escHtml(a.phone || '未填写')}</div>
        <div><b>联系人</b>${escHtml(a.contact_name || '未填写')}</div>
        <div><b>邮箱</b>${escHtml(a.contact_email || a.user_email || '未填写')}</div>
      </div>
      <div class="deals-result-note">${escHtml(a.license_note || '没有补充说明')}</div>
      <div class="deals-result-actions">
        <button class="primary" ${busy ? 'disabled' : ''} onclick="approveMerchantApplication('${String(a.id).replace(/'/g, '')}')">${busy ? '处理中...' : '通过认证'}</button>
        <button class="danger" ${busy ? 'disabled' : ''} onclick="rejectMerchantApplication('${String(a.id).replace(/'/g, '')}')">${busy ? '处理中...' : '驳回'}</button>
      </div>
    </div>
  `;
}
async function openMerchantApplicationReviewQueue(){
  if(!(session && session.user)){ showToast('请先登录'); openAuth(); return; }
  const ok = isDealAdmin || await checkDealAdmin();
  if(!ok){
    renderDealPanelShell('商家审核', '当前账号没有审核权限。', `<div class="deals-empty-panel">请先把当前 user_id 加入 Supabase 的 deal_admins 表。<br>当前 user_id：${session.user.id}</div>`);
    return;
  }
  renderDealPanelShell('商家审核', '读取待审核商家认证申请。', '<div class="deals-empty-panel">正在读取审核池...</div>');
  try {
    const select = 'id,user_id,user_email,status,business_name,category,subcategory,address,phone,contact_name,contact_email,license_note,review_note,created_at,updated_at';
    if(!merchantApplicationApi) throw new Error('商家认证接口未初始化');
    merchantApplicationRows = await merchantApplicationApi.listPending(select);
    merchantApplicationBusy = {};
    renderDealPanelShell(
      '商家审核',
      `待审核 ${merchantApplicationRows.length} 个商家。通过后会自动创建或更新认证商家资料。`,
      merchantApplicationRows.length
        ? `<div class="deals-result-list">${merchantApplicationRows.map(merchantApplicationCardHtml).join('')}</div>`
        : '<div class="deals-empty-panel">目前没有待审核商家申请。</div>'
    );
  } catch(e){
    console.warn('读取商家审核池失败:', e.message);
    renderDealPanelShell('商家审核', '请确认 3.80 商家认证 SQL 已执行。', `<div class="deals-empty-panel">${merchantApplicationFriendlyError(e.message)}</div>`);
  }
}
function merchantApplicationToMerchantPayload(a){
  return {
    slug: merchantSlugify(`${a.business_name || 'merchant'}-${String(a.user_id || '').slice(0,8)}`, a.user_id),
    business_name: a.business_name,
    category: a.category || '生活',
    subcategory: a.subcategory || null,
    address: a.address,
    phone: a.phone,
    verified: true,
    verified_at: new Date().toISOString(),
    verification_status: 'approved',
    updated_at: new Date().toISOString()
  };
}
async function approveMerchantApplication(id){
  if(merchantApplicationBusy[id]) return;
  const a = merchantApplicationRows.find(x => String(x.id) === String(id));
  if(!a){ showToast('没有找到这条申请'); return; }
  if(!confirm(`确认通过「${a.business_name || '该商家'}」的认证申请？`)) return;
  merchantApplicationBusy[id] = true;
  renderDealPanelShell('商家审核', `待审核 ${merchantApplicationRows.length} 个商家。`, `<div class="deals-result-list">${merchantApplicationRows.map(merchantApplicationCardHtml).join('')}</div>`);
  try {
    const merchantPayload = merchantApplicationToMerchantPayload(a);
    if(!merchantApplicationApi) throw new Error('商家认证接口未初始化');
    await merchantApplicationApi.approve({application:a, merchantPayload, reviewedBy:session.user.id});
    showToast('已通过商家认证');
    openMerchantApplicationReviewQueue();
  } catch(e){
    merchantApplicationBusy[id] = false;
    console.warn('商家认证通过失败:', e.message);
    showToast(merchantApplicationFriendlyError(e.message));
    renderDealPanelShell('商家审核', `待审核 ${merchantApplicationRows.length} 个商家。`, `<div class="deals-result-list">${merchantApplicationRows.map(merchantApplicationCardHtml).join('')}</div>`);
  }
}
async function rejectMerchantApplication(id){
  if(merchantApplicationBusy[id]) return;
  const a = merchantApplicationRows.find(x => String(x.id) === String(id));
  if(!a){ showToast('没有找到这条申请'); return; }
  const note = prompt('请输入驳回原因，用户会在个人页看到：', '资料需要补充或无法核对店铺真实性');
  if(note === null) return;
  merchantApplicationBusy[id] = true;
  renderDealPanelShell('商家审核', `待审核 ${merchantApplicationRows.length} 个商家。`, `<div class="deals-result-list">${merchantApplicationRows.map(merchantApplicationCardHtml).join('')}</div>`);
  try {
    if(!merchantApplicationApi) throw new Error('商家认证接口未初始化');
    await merchantApplicationApi.reject({id, note:note.trim() || '资料需要补充或无法核对店铺真实性', reviewedBy:session.user.id});
    showToast('已驳回申请');
    openMerchantApplicationReviewQueue();
  } catch(e){
    merchantApplicationBusy[id] = false;
    console.warn('商家认证驳回失败:', e.message);
    showToast(merchantApplicationFriendlyError(e.message));
    renderDealPanelShell('商家审核', `待审核 ${merchantApplicationRows.length} 个商家。`, `<div class="deals-result-list">${merchantApplicationRows.map(merchantApplicationCardHtml).join('')}</div>`);
  }
}

/* ====== 商家仪表盘："首页"对已认证商家显示此内容 ====== */
function renderMerchantDashboard(){
  const wrap = document.getElementById('merchantPublishBody');
  if(!wrap || !(session && session.user)) return;
  const m = currentMerchant || {};
  const displayName = (currentUser && currentUser.name) || m.business_name || '老板';
  const myId = session.user.id;
  const myPosts = posts
    .filter(p => p.user_id === myId)
    .sort((a,b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  const latest = myPosts[0];
  const recent = myPosts.slice(0, 5);

  wrap.innerHTML = `
    <div class="merchant-dash-card" style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
      <div>
        <div class="merchant-dash-greeting">早上好，${displayName}</div>
        <div class="merchant-dash-sub">让 AI 帮你轻松创作并发布内容，提升品牌影响力！</div>
      </div>
      <button class="merchant-dash-shopbtn" onclick="closeMerchantPublishDashboard();switchTab('profile');">${uiIcon('store',15)}店铺主页 ›</button>
    </div>

    <div class="merchant-ai-banner">
      <span class="ai-ico">${uiIcon('bot',30)}</span>
      <div class="ai-text">
        <div class="ai-title">今天建议：发布新内容</div>
        <div class="ai-sub">保持更新频率，有助于<b>提升曝光</b></div>
      </div>
      <button onclick="openMerchantAiFlow()">立即生成</button>
    </div>

    <div class="merchant-quick-grid">
      <div class="merchant-quick-card">
        <div class="merchant-quick-ico" style="background:var(--berry-light);color:var(--berry-dark);">${uiIcon('spark',20)}</div>
        <div class="merchant-quick-title">AI 发一篇</div>
        <div class="merchant-quick-sub">AI 帮你生成优质内容</div>
        <button class="merchant-quick-btn" style="background:var(--berry);" onclick="openMerchantAiFlow()">开始创作</button>
      </div>
      <div class="merchant-quick-card">
        <div class="merchant-quick-ico" style="background:var(--sage-light);color:var(--sage-dark);">${uiIcon('edit',20)}</div>
        <div class="merchant-quick-title">手动发一篇</div>
        <div class="merchant-quick-sub">自己编辑已有内容</div>
        <button class="merchant-quick-btn" style="background:var(--sage);" onclick="closeMerchantPublishDashboard();openCompose();">开始发布</button>
      </div>
      <div class="merchant-quick-card">
        <div class="merchant-quick-ico" style="background:var(--sky-light);color:#4C7C83;">${uiIcon('store',20)}</div>
        <div class="merchant-quick-title">提交优惠</div>
        <div class="merchant-quick-sub">进入省钱页审核池</div>
        <button class="merchant-quick-btn" style="background:var(--sky);" onclick="closeMerchantPublishDashboard();switchTab('deals');setTimeout(()=>openDealReportForm('merchant_submit'),80);">提交优惠</button>
      </div>
      <div class="merchant-quick-card">
        <div class="merchant-quick-ico" style="background:var(--sage-light);color:var(--sage-dark);">${uiIcon('eye',20)}</div>
        <div class="merchant-quick-title">数据中心</div>
        <div class="merchant-quick-sub">查看内容与会员数据</div>
        <button class="merchant-quick-btn" style="background:var(--sage-dark);" onclick="closeMerchantPublishDashboard();openMerchantAnalytics();">查看数据</button>
      </div>
    </div>

    <div class="merchant-dash-card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <span style="font-size:15px;font-weight:700;">上一次发布效果</span>
        ${myPosts.length ? `<span style="font-size:12px;color:var(--ink-faint);cursor:pointer;" onclick="closeMerchantPublishDashboard();switchTab('profile');">查看全部 ›</span>` : ''}
      </div>
      ${latest ? `
        <div style="display:flex;gap:10px;align-items:center;">
          ${latest.image ? `<img src="${latest.image}" style="width:56px;height:56px;border-radius:10px;object-fit:cover;flex-shrink:0;">` : ''}
          <div style="flex:1;min-width:0;">
            <div style="font-size:13.5px;font-weight:600;color:var(--ink);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${latest.title}</div>
            <div style="font-size:11.5px;color:var(--ink-faint);margin-top:2px;">${latest.time || ''}</div>
          </div>
          <span class="merchant-badge-ok">已发布</span>
        </div>
        <div class="merchant-stats-grid" id="merchantLatestStats">
          <div class="merchant-stat-box"><div class="merchant-stat-label">${uiIcon('eye',14)}浏览量</div><div class="merchant-stat-num">·</div></div>
          <div class="merchant-stat-box"><div class="merchant-stat-label">${uiIcon('message',14)}互动数</div><div class="merchant-stat-num">·</div></div>
          <div class="merchant-stat-box"><div class="merchant-stat-label">${uiIcon('heart',14)}收藏数</div><div class="merchant-stat-num">·</div></div>
          <div class="merchant-stat-box"><div class="merchant-stat-label">${uiIcon('phone',14)}咨询数</div><div class="merchant-stat-num">0</div></div>
        </div>
      ` : `<div style="text-align:center;color:var(--ink-faint);font-size:13px;padding:20px 0;">还没有发布过笔记</div>`}
    </div>

    <div class="merchant-dash-card">
      <div style="font-size:15px;font-weight:700;margin-bottom:6px;">最近发布</div>
      ${recent.length ? recent.map(p => `
        <div class="merchant-recent-row" onclick="closeMerchantPublishDashboard();openPost(${p.id});" style="cursor:pointer;">
          <img class="merchant-recent-img" src="${p.image || ''}" alt="">
          <div style="flex:1;min-width:0;">
            <div class="merchant-recent-title">${p.title}</div>
            <div class="merchant-recent-meta">${p.time || ''}</div>
          </div>
          <span class="merchant-badge-ok">已发布</span>
        </div>
      `).join('') : `<div style="text-align:center;color:var(--ink-faint);font-size:13px;padding:20px 0;">还没有发布过笔记</div>`}
    </div>
  `;

  if(latest){
    fetchPostStats(latest.id).then(stats => {
      const box = document.getElementById('merchantLatestStats');
      if(!box) return;
      box.innerHTML = `
        <div class="merchant-stat-box"><div class="merchant-stat-label">${uiIcon('eye',14)}浏览量</div><div class="merchant-stat-num">${stats.views}</div></div>
        <div class="merchant-stat-box"><div class="merchant-stat-label">${uiIcon('message',14)}互动数</div><div class="merchant-stat-num">${stats.engagement}</div></div>
        <div class="merchant-stat-box"><div class="merchant-stat-label">${uiIcon('heart',14)}收藏数</div><div class="merchant-stat-num">${stats.favs}</div></div>
        <div class="merchant-stat-box"><div class="merchant-stat-label">${uiIcon('phone',14)}咨询数</div><div class="merchant-stat-num">0</div></div>
      `;
    });
  }
}
/* 拉取某条笔记的真实浏览量/互动数(赞+评论)/收藏数 */
async function fetchPostStats(postId){
  try {
    const stats = await engagementApi.loadPostStats(postId);
    return { views:stats.views, engagement:stats.likes + stats.comments, favs:stats.favorites };
  } catch(e){ console.warn('数据统计加载失败:', e.message); return { views:0, engagement:0, favs:0 }; }
}
let merchantAnalyticsRangeDays = 7;
let merchantAnalyticsLoading = false;

function merchantAnalyticsStart(days){
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - Math.max(1, days) + 1);
  return date;
}
function merchantAnalyticsDateLabel(value){
  const date = new Date(value);
  if(Number.isNaN(date.getTime())) return '';
  return `${date.getMonth() + 1}/${date.getDate()}`;
}
function merchantAnalyticsCountText(value){ return value === null || value === undefined ? '—' : String(value); }
function merchantAnalyticsMetric(label, icon, value, note){
  return `<div class="merchant-analytics-metric"><span>${uiIcon(icon,14)}${label}</span><b>${merchantAnalyticsCountText(value)}</b><small>${escHtml(note)}</small></div>`;
}
function merchantAnalyticsRowsForDays(rows, days){
  const start = merchantAnalyticsStart(days).getTime();
  return (rows || []).filter(row => new Date(row.created_at || row.claimed_at || row.joined_at || row.redeemed_at || 0).getTime() >= start);
}
function merchantAnalyticsTrendRows(rows, days){
  const shownDays = Math.min(days, 7);
  const result = [];
  for(let offset = shownDays - 1; offset >= 0; offset -= 1){
    const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - offset);
    const end = new Date(start); end.setDate(end.getDate() + 1);
    result.push({
      label:merchantAnalyticsDateLabel(start),
      count:(rows || []).filter(row => {
        const time = new Date(row.created_at || 0).getTime();
        return time >= start.getTime() && time < end.getTime();
      }).length
    });
  }
  return result;
}
function merchantAnalyticsPanelShell(){
  const name = (currentMerchant && currentMerchant.business_name) || '店铺';
  return `<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;"><div><h3 style="margin:0;font-size:20px;color:var(--ink);">${escHtml(name)}</h3><p class="merchant-analytics-summary">只统计店铺自己有权限读取的真实内容、优惠券与会员记录。</p></div><button onclick="loadMerchantAnalytics()" style="flex-shrink:0;border:0;border-radius:999px;padding:8px 11px;background:var(--bg-alt);color:var(--sage-dark);font:900 12px inherit;">刷新</button></div><div class="merchant-analytics-range"><button class="${merchantAnalyticsRangeDays === 7 ? 'active' : ''}" onclick="setMerchantAnalyticsRange(7)">近 7 天</button><button class="${merchantAnalyticsRangeDays === 30 ? 'active' : ''}" onclick="setMerchantAnalyticsRange(30)">近 30 天</button></div><div id="merchantAnalyticsContent"><div class="admin-empty">正在读取真实数据...</div></div>`;
}
function openMerchantAnalytics(){
  if(!(session && session.user && currentMerchant && currentMerchant.verified)){
    showToast('认证商家可查看店铺数据中心');
    return;
  }
  const overlay = document.getElementById('merchantAnalyticsOverlay');
  const body = document.getElementById('merchantAnalyticsBody');
  if(!overlay || !body) return;
  overlay.classList.add('open');
  body.innerHTML = merchantAnalyticsPanelShell();
  loadMerchantAnalytics();
}
function closeMerchantAnalytics(){ document.getElementById('merchantAnalyticsOverlay')?.classList.remove('open'); }
function setMerchantAnalyticsRange(days){
  merchantAnalyticsRangeDays = Number(days) === 30 ? 30 : 7;
  const body = document.getElementById('merchantAnalyticsBody');
  if(body) body.innerHTML = merchantAnalyticsPanelShell();
  loadMerchantAnalytics();
}
async function loadMerchantAnalytics(){
  if(merchantAnalyticsLoading || !(session && session.user && currentMerchant && currentMerchant.verified)) return;
  const target = document.getElementById('merchantAnalyticsContent');
  if(!target) return;
  merchantAnalyticsLoading = true;
  target.innerHTML = '<div class="admin-empty">正在汇总真实数据...</div>';
  const merchantId = session.user.id;
  const since = merchantAnalyticsStart(merchantAnalyticsRangeDays).toISOString();
  try {
    const { ownPosts, data, unavailable } = await merchantAnalyticsApi.loadDashboard({merchantUserId:merchantId,since});
    const views = data.views;
    const likes = data.likes;
    const comments = data.comments;
    const favorites = data.favorites;
    const interactions = likes !== null && comments !== null ? likes.length + comments.length : null;
    const performance = ownPosts.map(post => {
      const id = Number(post.id);
      const count = rows => rows === null ? null : rows.filter(row => Number(row.post_id) === id).length;
      const viewCount = count(views);
      const likeCount = count(likes);
      const commentCount = count(comments);
      const favoriteCount = count(favorites);
      const score = (viewCount || 0) + ((likeCount || 0) + (commentCount || 0)) * 3 + (favoriteCount || 0) * 2;
      return { post, viewCount, likeCount, commentCount, favoriteCount, score };
    }).filter(item => item.score > 0).sort((a,b) => b.score - a.score).slice(0, 3);
    const trendRows = merchantAnalyticsTrendRows(views || [], merchantAnalyticsRangeDays);
    const trendMax = Math.max(1, ...trendRows.map(row => row.count));
    target.innerHTML = `
      <div class="merchant-analytics-grid">
        ${merchantAnalyticsMetric('内容浏览', 'eye', views?.length, `近 ${merchantAnalyticsRangeDays} 天`)}
        ${merchantAnalyticsMetric('内容互动', 'message', interactions, '点赞与评论')}
        ${merchantAnalyticsMetric('收藏', 'heart', favorites?.length, `近 ${merchantAnalyticsRangeDays} 天`)}
        ${merchantAnalyticsMetric('领取优惠券', 'bag', data.claims?.length, `近 ${merchantAnalyticsRangeDays} 天`)}
        ${merchantAnalyticsMetric('核销优惠券', 'bag', data.redeemed?.length, `近 ${merchantAnalyticsRangeDays} 天`)}
        ${merchantAnalyticsMetric('新增会员', 'user', data.newMembers?.length, `当前活跃 ${merchantAnalyticsCountText(data.activeMembers?.length)} 位`)}
      </div>
      <section class="merchant-analytics-section"><h4>会员到店记录</h4><div class="merchant-analytics-metric" style="min-height:auto;"><span>${uiIcon('calendar',14)}会员签到</span><b>${merchantAnalyticsCountText(data.checkins?.length)}</b><small>只统计商家完成的会员签到，不等同于销售额。</small></div></section>
      <section class="merchant-analytics-section"><h4>内容表现</h4>${performance.length ? performance.map(item => `<div class="merchant-analytics-post"><img src="${escAttr(item.post.image || '')}" alt=""><div class="merchant-analytics-post-main"><b>${escHtml(item.post.title || '未命名笔记')}</b><span>浏览 ${merchantAnalyticsCountText(item.viewCount)} · 互动 ${merchantAnalyticsCountText(item.likeCount === null || item.commentCount === null ? null : item.likeCount + item.commentCount)} · 收藏 ${merchantAnalyticsCountText(item.favoriteCount)}</span></div><div class="merchant-analytics-post-score">${item.score} 分</div></div>`).join('') : '<div class="admin-empty">这个周期还没有内容互动数据。发布后有人浏览、点赞、评论或收藏时会在这里显示。</div>'}</section>
      <section class="merchant-analytics-section"><h4>最近 ${Math.min(merchantAnalyticsRangeDays, 7)} 天浏览趋势</h4><div class="merchant-analytics-trend">${views === null ? '<div class="admin-empty">浏览记录暂时不可读。</div>' : trendRows.map(row => `<div class="merchant-analytics-trend-row"><span>${row.label}</span><div class="merchant-analytics-bar"><i style="width:${Math.max(row.count ? 8 : 0, Math.round(row.count / trendMax * 100))}%"></i></div><b>${row.count} 次</b></div>`).join('')}</div></section>
      <div class="merchant-analytics-note">统计口径：内容浏览按笔记详情打开次数计算；互动为点赞和评论之和；优惠券与会员数据来自实际领取、核销与签到记录。${unavailable.length ? `其中 ${unavailable.length} 项暂时无法读取，已显示为“—”。` : ''}</div>`;
  } catch(error){
    console.warn('商家数据中心读取失败:', error.message);
    target.innerHTML = '<div class="admin-empty">店铺数据暂时无法读取，请稍后刷新。现有业务数据不会受影响。</div>';
  } finally {
    merchantAnalyticsLoading = false;
  }
}
/* 记录一次真实浏览（仅登录用户，游客暂不记录）。每次打开笔记详情调用一次 */
function recordPostView(postId){
  if(!(session && session.user)) return;
  // The preference is cached locally after settings are loaded. Keep the default on
  // until the account preference is available so opening a note never blocks.
  if(homeAccountSettingsCache?.general?.browsing_history === false) return;
  authedFetch(`${SUPABASE_URL}/rest/v1/post_views`, {
    method: 'POST',
    body: JSON.stringify({ post_id: postId, user_id: session.user.id })
  }).catch(e => console.warn('浏览记录失败:', e.message));
}

/* 真实IP属地（免费接口 ipapi.co，缓存24小时） */
async function fetchIpLocation(){
  try {
    const cached = JSON.parse(localStorage.getItem('wanba_ip_loc') || 'null');
    if(cached && Date.now() - cached.ts < 24*60*60*1000){
      applyIpLocation(cached.loc); return;
    }
    const res = await fetch('https://ipapi.co/json/');
    if(!res.ok) return;
    const d = await res.json();
    const loc = [d.city, d.country_name].filter(Boolean).join(', ') || d.country_name || '';
    if(loc){
      localStorage.setItem('wanba_ip_loc', JSON.stringify({loc, ts: Date.now()}));
      applyIpLocation(loc);
    }
  } catch(e){ console.warn('IP属地获取失败:', e.message); }
}
function applyIpLocation(loc){
  window._ipLocation = loc;
  if(!(session && session.user)) return;
  currentUser.location = loc;
  saveUserProfileToStorage();
  const el = document.getElementById('userLocationDisplay');
  if(el) el.textContent = `IP属地：${loc}`;
  syncIpLocationToDb(loc);
}
async function syncIpLocationToDb(loc){
  if(!(session && session.user) || !loc) return;
  const payload = { ip_location:loc, updated_at:new Date().toISOString() };
  try {
    const res = await profileApi?.write(payload);
    if(res.ok) setProfileCache(Object.assign({ user_id:session.user.id }, cachedProfile(session.user.id, currentUser.name), payload));
  } catch(e){ console.warn('IP属地同步失败:', e.message); }
}

// 进入编辑模式
function enterEditMode(){
  if(!(session && session.user)){
    showToast('请先登录后再编辑资料');
    openAuth();
    return;
  }
  document.getElementById('profileViewMode').style.display = 'none';
  document.getElementById('profileEditMode').style.display = 'block';
  
  // 填充编辑表单
  document.getElementById('editUserName').value = currentUser.name;
  document.getElementById('editUserBio').value = currentUser.bio;
  document.getElementById('editUserGender').value = currentUser.gender;
  document.getElementById('editUserBirth').value = currentUser.birth || '';
  document.getElementById('editUserTags').value = currentUser.tags.join(', ');
  const marketInput = document.getElementById('editUserMarket');
  if(marketInput) marketInput.innerHTML = userMarketSelectOptions(currentUser.market_code);
  
  // 标签输入实时提示
  const tagInput = document.getElementById('editUserTags');
  const updateTagHint = () => {
    const tags = tagInput.value.split(/[,，]/).map(t => t.trim()).filter(t => t);
    const hint = document.getElementById('tagsHint');
    if(!hint) return;
    const overCount = tags.length > 3;
    const longTag = tags.find(t => t.length > 5);
    if(overCount){
      hint.textContent = `⚠️ 已输入 ${tags.length} 个标签，最多3个`;
      hint.style.color = 'var(--berry)';
    } else if(longTag){
      hint.textContent = `⚠️ 「${longTag}」超过5个字`;
      hint.style.color = 'var(--berry)';
    } else {
      hint.textContent = tags.length ? `${tags.length}/3 个标签` : '';
      hint.style.color = 'var(--ink-faint)';
    }
  };
  tagInput.oninput = updateTagHint;
  updateTagHint();
}

// 退出编辑模式
function exitEditMode(){
  document.getElementById('profileViewMode').style.display = 'block';
  document.getElementById('profileEditMode').style.display = 'none';
}

// 保存用户资料
function saveUserProfile(){
  const name = document.getElementById('editUserName').value.trim();
  const bio = document.getElementById('editUserBio').value.trim();
  const gender = document.getElementById('editUserGender').value;
  const birth = document.getElementById('editUserBirth').value; // 如 '1999-06'
  const age = calcAge(birth);
  const marketCode = normalizeUserMarketCode(document.getElementById('editUserMarket')?.value);
  // 支持中英文逗号分隔
  const tags = document.getElementById('editUserTags').value
    .split(/[,，]/).map(t => t.trim()).filter(t => t);
  
  if(!name){
    showToast('用户名不能为空');
    return;
  }
  if(bio.length > 50){ showToast('个人介绍最多 50 个字'); return; }
  // 标签校验：最多3个
  if(tags.length > 3){
    showToast('标签最多只能有3个');
    return;
  }
  // 标签校验：每个不超过5个字
  const tooLong = tags.find(t => t.length > 5);
  if(tooLong){
    showToast(`标签「${tooLong.slice(0,5)}…」超过5个字`);
    return;
  }
  
  // 更新用户信息
  currentUser.name = name;
  currentUser.bio = bio || '还没有介绍呢';
  currentUser.gender = gender;
  currentUser.birth = birth;
  currentUser.age = age;
  currentUser.tags = tags;
  currentUser.market_code = marketCode;
  
  // 保存到存储
  saveUserProfileToStorage();
  
  // 更新显示
  updateProfileDisplay();
  syncCurrentUserAuthorName(name);

  // 同步昵称到 profiles 表（2.93）
  syncProfileToDb();
  
  // 退出编辑模式
  exitEditMode();
  showToast('✓ 资料已保存');
}

// 更新个人资料显示
function updateProfileDisplay(){
  const avatarEl = document.getElementById('userAvatarDisplay');
  const isLoggedIn = !!(session && session.user);
  const coverEl = document.getElementById('profileCoverBg');
  const coverBtn = document.getElementById('profileCoverEditBtn');
  if(coverEl){
    if(currentUser.cover){
      coverEl.classList.add('has-image');
      coverEl.style.backgroundImage = `linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.62)), url("${currentUser.cover}")`;
    } else {
      coverEl.classList.remove('has-image');
      coverEl.style.backgroundImage = '';
    }
  }
  const editCoverPreview = document.getElementById('profileEditCoverPreview');
  if(editCoverPreview){
    editCoverPreview.style.backgroundImage = currentUser.cover
      ? `linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.42)), url("${currentUser.cover}")`
      : '';
  }
  if(coverBtn) coverBtn.style.display = isLoggedIn ? '' : 'none';
  if(!avatarEl) return;
  if(currentUser.avatar){
    avatarEl.innerHTML = `<img src="${currentUser.avatar}" alt="头像" style="width:100%;height:100%;object-fit:cover;">`;
  } else {
    avatarEl.innerHTML = '';
    avatarEl.textContent = isLoggedIn ? currentUser.name.slice(0,1) : '未';
  }
  const nameEl = document.getElementById('userNameDisplay');
  const idEl = document.getElementById('userIdDisplay');
  const locEl = document.getElementById('userLocationDisplay');
  const bioEl = document.getElementById('userBioDisplay');
  if(nameEl) nameEl.textContent = currentUser.name;
  if(idEl) idEl.textContent = isLoggedIn ? `ID: ${String(currentUser.id||'').replace('#','')}` : 'ID：登录后生成';
  if(locEl) locEl.textContent = isLoggedIn ? `IP属地：${window._ipLocation || (currentUser.location||'').replace('📍','').trim() || '获取中…'}` : 'IP属地：登录后显示';
  if(bioEl) bioEl.textContent = currentUser.bio;
  
  // 更新标签显示（年龄由出生年月自动计算）
  const ageNum = calcAge(currentUser.birth) ?? currentUser.age;
  const ageText = isLoggedIn ? (ageNum ? `${currentUser.gender} ${ageNum}岁` : `${currentUser.gender || '未填写'}`) : '游客模式';
  const tagsHtml = isLoggedIn
    ? `
      <span>${ageText}</span>
      ${currentUser.tags.map(tag => `<span>${tag}</span>`).join('')}
    `
    : '<span>游客模式</span><span><button class="profile-login-link" onclick="event.stopPropagation();openProfileLogin()">请登录</button></span>';
  const tagsEl = document.getElementById('userTagsDisplay');
  if(tagsEl) tagsEl.innerHTML = tagsHtml;
  renderProfileFollowStats();
}

function renderProfileFollowStats(){
  const box = document.getElementById('profileFollowStats');
  if(!box) return;
  if(!(session && session.user)){ box.style.display = 'none'; return; }
  const me = session.user.id;
  const rows = window._followRows || [];
  const following = rows.filter(row => row.follower_id === me && row.active).length;
  const followers = rows.filter(row => row.followee_id === me && row.active).length;
  box.style.display = 'flex';
  box.innerHTML = `<button onclick="openFollowDirectory('following')"><b>${following}</b>关注</button><button onclick="openFollowDirectory('followers')"><b>${followers}</b>粉丝</button>`;
}
async function openFollowDirectory(mode){
  if(!(session && session.user)){ openAuth(); return; }
  window._followDirectoryMode = mode === 'followers' ? 'followers' : 'following';
  const sheet = document.getElementById('followDirectory');
  if(!sheet) return;
  sheet.classList.add('open');
  await renderFollowDirectory();
}
function closeFollowDirectory(){ document.getElementById('followDirectory')?.classList.remove('open'); }
async function renderFollowDirectory(){
  const body = document.getElementById('followDirectoryBody');
  const title = document.getElementById('followDirectoryTitle');
  if(!body || !(session && session.user)) return;
  const mode = window._followDirectoryMode || 'following';
  const me = session.user.id;
  const source = (window._followRows || []).filter(row => row.active && (mode === 'following' ? row.follower_id === me : row.followee_id === me));
  const ids = source.map(row => mode === 'following' ? row.followee_id : row.follower_id);
  if(title) title.textContent = mode === 'following' ? '我的关注' : '我的粉丝';
  body.innerHTML = `<div style="display:flex;gap:8px;margin-bottom:14px;"><button class="${mode==='following'?'primary':''}" onclick="openFollowDirectory('following')" style="flex:1;padding:10px;border-radius:10px;border:1px solid var(--line);">关注</button><button class="${mode==='followers'?'primary':''}" onclick="openFollowDirectory('followers')" style="flex:1;padding:10px;border-radius:10px;border:1px solid var(--line);">粉丝</button></div><div class="deals-empty-panel">正在读取最新资料...</div>`;
  await loadProfilesForIds(ids);
  const items = source.map(row => {
    const userId = mode === 'following' ? row.followee_id : row.follower_id;
    const profile = cachedProfile(userId, row.follower_name);
    const name = profile.name || row.follower_name || '乐生活用户';
    const avatar = resolveAvatarUrl(userId) || profile.avatar;
    const relation = followRelationshipLabel(userId);
    const button = userId === me ? '' : `<button onclick="event.stopPropagation();toggleFollowUser('${String(userId).replace(/'/g,'')}','${String(name).replace(/'/g,'')}');renderFollowDirectory();" style="padding:7px 11px;border-radius:999px;border:1px solid ${isFollowing(userId)?'var(--line)':'var(--berry)'};background:${isFollowing(userId)?'#fff':'var(--berry)'};color:${isFollowing(userId)?'var(--ink-soft)':'#fff'};font-size:12px;font-weight:800;">${relation}</button>`;
    return `<div onclick="openUserPublicPage('${String(userId).replace(/'/g,'')}','${String(name).replace(/'/g,'')}')" style="display:flex;align-items:center;gap:11px;padding:12px 0;border-bottom:1px solid var(--line);cursor:pointer;">${avatarHomeLinkHtml(userId,name,46)}<div style="min-width:0;flex:1;"><b style="font-size:14px;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escHtml(name)}</b><span style="font-size:11px;color:var(--ink-faint);">${mode==='followers'?'关注了你':'关注于'} · ${escHtml(fmtTime(row.created_at))}</span></div>${button}</div>`;
  });
  body.innerHTML = `<div style="display:flex;gap:8px;margin-bottom:14px;"><button class="${mode==='following'?'primary':''}" onclick="openFollowDirectory('following')" style="flex:1;padding:10px;border-radius:10px;border:1px solid var(--line);">关注</button><button class="${mode==='followers'?'primary':''}" onclick="openFollowDirectory('followers')" style="flex:1;padding:10px;border-radius:10px;border:1px solid var(--line);">粉丝</button></div>${items.length ? items.join('') : '<div class="deals-empty-panel">还没有'+(mode==='following'?'关注的人':'粉丝')+'。</div>'}`;
}

let posts = [
  {
    id:1, category:'美食', title:'巷口张阿姨的葱油饼,排队35分钟到底值不值?',
    excerpt:'每天下午四点准时出摊,面团现擀现烙,葱花是自己种的……',
    content:'每天下午四点,张阿姨的小推车准时出现在巷口第三棵梧桐树下。面团是现擀的,葱花是自家阳台种的,油要烧到冒青烟才下饼,滋啦一声,整条巷子都是香味。\n\n排队的人从下午四点半就开始排,高峰期要等35分钟左右。我的建议是:提前十分钟去,能少排一半的队。饼皮酥、内里软,咬开还能拉丝,10块钱一个,巷子里的性价比之王。',
    image:'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=60',
    youtube:null,
    author:'豆沙包', time:'2小时前', likes:128, liked:false,
    event:null,
    comments:[
      {id:1,name:'阿柴',text:'昨天去晚了,排到我这份卖完了555',likes:6,replies:[
        {id:2,name:'豆沙包',text:'建议四点二十就去蹲点,亲测有效'}
      ]},
      {id:3,name:'路过的猫',text:'葱花是真的香,推荐加个蛋',likes:3,replies:[]}
    ]
  },
  {
    id:2, category:'美食', title:'社区限定手冲试饮会:埃塞俄比亚耶加雪菲',
    excerpt:'巷尾那家新开的豆子铺,这周六下午办一场免费试饮会,名额有限……',
    content:'巷尾新开的豆子铺这周六下午两点办一场手冲试饮会,主理人会现场演示三种冲煮手法,让大家对比同一支豆子不同萃取方式的风味差异。\n\n这次用的是一支水洗处理的耶加雪菲,花香明显,尾调带柑橘。到场即可免费试饮,还会讲讲怎么在家用最简单的器具冲出还不错的一杯。位置有限,建议提前报名。',
    image:'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=60',
    youtube:null,
    author:'豆子铺-阿桥', time:'昨天', likes:64, liked:false,
    tags:['免费活动','本月活动','本周末活动'],
    event:{capacity:20, registered:15, deadline:'本周六 12:00 前', userJoined:false},
    comments:[
      {id:1,name:'早起的鸟',text:'请问可以带朋友一起吗?',likes:2,replies:[
        {id:2,name:'豆子铺-阿桥',text:'可以哦,朋友也需要单独报名占一个名额~'}
      ]}
    ]
  },
  {
    id:3, category:'玩乐', title:'周末城市漫步:老城区骑行路线实测',
    excerpt:'花了一个下午把老城区的巷子骑了个遍,剪了条视频给大家看看路线',
    content:'趁着好天气把老城区的巷子骑了个遍,从东门牌坊一路骑到河边老码头,全程大概8公里,坡不多,很适合周末慢慢逛。\n\n视频里标了几个容易错过的小拐角,还有中途可以歇脚喝茶的地方,想自己去骑的可以参考一下路线。',
    image:null,
    youtube:'M7lc1UVf-VE',
    author:'轮子上的老王', time:'3天前', likes:203, liked:false,
    event:null,
    comments:[]
  },
  {
    id:4, category:'玩乐', title:'社区草坪电影夜:本周六放什么?',
    excerpt:'露天投影+躺椅+爆米花,自带野餐垫更佳,这周六晚八点不见不散',
    content:'这周六晚八点,老地方——社区中心草坪,继续我们的露天电影夜。现场提供躺椅和免费爆米花,建议大家自带野餐垫和外套,晚上草坪有点凉。\n\n这次放的是一部轻松的喜剧片,具体片名到场揭晓,给大家留个悬念。名额有限,报名截止到周五晚上。',
    image:'https://images.unsplash.com/photo-1489599162946-4b8b6b3b4f4a?w=800&q=60',
    youtube:null,
    author:'社区活动组', time:'4天前', likes:156, liked:false,
    tags:['免费活动','本月活动','本周末活动','遛娃'],
    event:{capacity:50, registered:38, deadline:'本周五 20:00 前', userJoined:false},
    comments:[
      {id:1,name:'夜猫子',text:'带娃可以去吗?',likes:1,replies:[]}
    ]
  },
  {
    id:5, category:'美食', title:'深夜食堂:三家开到凌晨的隐藏巷子小馆',
    excerpt:'加班到深夜也不用饿肚子,这三家我私藏了好久,终于决定分享出来',
    content:'第一家是巷子中段的无名馄饨摊,只在晚上十点后出摊,老板一个人包一个人煮,汤底是猪骨吊了六个小时的。\n\n第二家是二楼的居酒屋,菜单没有中文,但老板会画画给你看,烤鸡皮和玉子烧是招牌。\n\n第三家最隐蔽,要从五金店旁边的铁门进去,里面别有洞天,主打粥品和小菜,凌晨两点还有人在排队。',
    image:'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&q=60',
    youtube:null,
    author:'夜行动物', time:'5天前', likes:311, liked:false,
    event:null,
    comments:[]
  },
  {
    id:7, category:'玩乐', title:'周日儿童手工市集:陶艺、扎染、彩绘任选',
    excerpt:'社区广场周日上午开摊,三个手作摊位免费体验,遛娃好去处……',
    content:'这周日上午九点到十二点,社区广场会摆三个手作摊位:陶艺拉坯、扎染小方巾、石头彩绘,都是免费体验,材料社区包了。\n\n每个摊位大概能玩20-30分钟,建议按年龄段错峰去,3岁以上小朋友基本都能上手。广场旁边有遮阳棚和长椅,带娃的家长也能歇脚。名额有限,建议提前报名占坑。',
    image:'https://images.unsplash.com/photo-1503457574465-52a7a4b7d1e5?w=800&q=60',
    youtube:null,
    author:'社区活动组', time:'6小时前', likes:97, liked:false,
    tags:['遛娃','免费活动','本月活动','本周末活动'],
    event:{capacity:30, registered:19, deadline:'本周六 20:00 前', userJoined:false},
    comments:[]
  },
  {
    id:6, category:'美食', title:'自制气泡水配方分享,夏天续命神器',
    excerpt:'气泡水机到手一个月,试了十几种搭配,把最好喝的三个配方整理出来了',
    content:'气泡水机到手一个月,已经试了十几种水果+香草的搭配,今天把最好喝的三个配方整理出来:\n\n1. 青柠+薄荷+一点点蜂蜜,酸甜清爽\n2. 冷萃乌龙茶打气泡,茶香更突出,适合下午茶\n3. 黄瓜+罗勒叶,意外地很解腻,配沙拉一绝\n\n气泡强度建议打两次,口感更绵密。',
    image:'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=60',
    youtube:null,
    author:'气泡水狂人', time:'1周前', likes:89, liked:false,
    event:null,
    comments:[]
  }
];

let currentFilter = '全部';
let currentSubcategory = '全部';
let currentTag = null;
let activityLongTerm = false;
let feedMode = localStorage.getItem('leshenghuo_feed_mode') || 'recommend';
let mutedFeedCategories = new Set();
let preferredFeedInterests = new Set();
let feedInterestDraft = new Set();
let feedPreferencesLoadedFor = null;
let feedOnboardingCompleted = false;
let feedIsLoading = false;
let feedLoadFailed = false;
let activePostId = null;
let selectedCat = null;
let selectedSubcategory = null;
let communityPostMeta = {};
let eventOn = false;
let uploadedImages = [];
let editingImageThumbnails = [];
let customTags = []; // 自定义标签（最多10个）
let selectedVideos = []; // 已选视频（仅本地预览占位，不上传数据库；后续通过YouTube API上传）
let imageProcessingCount = 0;
let imageProcessingTotal = 0;
let imageProcessingDone = 0;
let imageProcessingWaiters = [];
let textCardCover = null;
let textCoverDraftTheme = 'garden';
let textCoverDraftImage = '';
let textCoverAssetUploadBusy = false;
const TEXT_COVER_ASSET_BUCKET = 'post-assets';
const TEXT_COVER_ASSET_MAX_BYTES = 5 * 1024 * 1024;
const TEXT_COVER_THEMES = [
  { id:'garden', name:'绿意', note:'侧栏清爽', bg:'#E8F1E6', ink:'#23412C', accent:'#6C9870', label:'#F9FCF7' },
  { id:'paper', name:'留白', note:'网格留白', bg:'#FFFDF7', ink:'#292721', accent:'#C87B55', label:'#FFFDF8' },
  { id:'sunset', name:'暖橙', note:'大色块标题', bg:'#E6764C', ink:'#FFF9F2', accent:'#FFE2C9', label:'#FDE9D9' },
  { id:'night', name:'夜色', note:'深色海报', bg:'#202B27', ink:'#F7F4E9', accent:'#B8D5A0', label:'#31443A' }
];

let merchantAiState = null;
let merchantAiProgressTimer = null;
let merchantAiReturnAfterPost = false;
const MERCHANT_AI_DAILY_LIMIT = 10;
const MERCHANT_AI_REGEN_LIMIT = 3;

function handleTagInput(e){
  const input = e.target;
  // 回车或逗号触发添加
  if(e.key === 'Enter' || e.key === ',' || e.key === '，'){
    e.preventDefault();
    addCustomTag(input.value);
    input.value = '';
  } else if(e.key === 'Backspace' && input.value === '' && customTags.length > 0){
    // 空输入框按退格删除最后一个标签
    customTags.pop();
    renderCustomTags();
    scheduleComposeDraftSave();
  }
}
function addCustomTag(raw){
  const t = raw.replace(/[,，#]/g,'').trim();
  if(!t) return;
  if(customTags.length >= 10){ showToast('自定义标签最多10个'); return; }
  if(t.length > 10){ showToast('单个标签不超过10个字'); return; }
  if(customTags.includes(t)){ showToast('标签已存在'); return; }
  customTags.push(t);
  renderCustomTags();
  scheduleComposeDraftSave();
}
function removeCustomTag(i){
  customTags.splice(i, 1);
  renderCustomTags();
  scheduleComposeDraftSave();
}
function renderCustomTags(){
  const box = document.getElementById('customTagChips');
  if(!box) return;
  box.innerHTML = customTags.map((t,i) => `
    <span style="display:inline-flex;align-items:center;gap:4px;background:var(--sage-light);color:var(--sage-dark);padding:4px 10px;border-radius:999px;font-size:12px;font-weight:600;">
      #${t}<button type="button" onclick="removeCustomTag(${i})" style="border:none;background:none;color:var(--sage-dark);cursor:pointer;font-size:13px;padding:0;line-height:1;">✕</button>
    </span>
  `).join('') + (customTags.length ? `<span style="font-size:11px;color:var(--ink-faint);align-self:center;">${customTags.length}/10</span>` : '');
}
let coverImageIndex = 0;
let nextPostId = 100;
let nextCommentId = 1000;

/* ---------------- render: chips ---------------- */
function renderChips(){
  const row = document.getElementById('chipRow');
  row.innerHTML = CATS.map(c => `
    <button class="chip ${currentFilter===c.key?'active':''}" onclick="setFilter('${c.key}')">
      ${c.icon ? catIcon(c.key, 18) + ' ' : ''}${c.key}
    </button>
  `).join('');
  renderFeedSubcategoryFilter();
}
function renderFeedSubcategoryFilter(){
  const row = document.getElementById('feedSubcategoryRow');
  if(!row) return;
  const options = currentTag ? [] : postSubcategoryOptions(currentFilter);
  if(!options.length){ row.classList.remove('show'); row.innerHTML = ''; return; }
  if(!options.includes(currentSubcategory)) currentSubcategory = '全部';
  row.classList.add('show');
  row.innerHTML = ['全部', ...options].map(item => `<button class="subcategory-filter-chip ${currentSubcategory===item?'active':''}" onclick="setSubcategoryFilter('${item}')">${item}</button>`).join('');
}
function setFilter(cat){ currentFilter = cat; currentSubcategory = '全部'; currentTag = null; renderChips(); renderQuicklinks(); renderFeed(); }
function setSubcategoryFilter(item){ currentSubcategory = item; renderFeedSubcategoryFilter(); renderFeed(); }

function renderFeedModes(){
  const row = document.getElementById('feedModeRow');
  if(!row) return;
  const hasSignals = !!(session && session.user && ((window._likeRows || []).length || (window._favRows || []).length || (window._cmtRows || []).length || (window._followRows || []).length));
  const note = feedMode === 'latest'
    ? '按发布时间排列'
    : (hasSignals ? '根据你的关注和互动排序' : '结合新鲜内容与大家的互动排序');
  row.innerHTML = `<div class="feed-mode-switch"><button class="${feedMode==='recommend'?'active':''}" onclick="setFeedMode('recommend')">推荐</button><button class="${feedMode==='latest'?'active':''}" onclick="setFeedMode('latest')">最新</button></div><span class="feed-mode-note">${note}</span><button class="feed-preference-btn" onclick="openFeedPreferences()">偏好</button>`;
}
function setFeedMode(mode){
  feedMode = mode === 'latest' ? 'latest' : 'recommend';
  localStorage.setItem('leshenghuo_feed_mode', feedMode);
  renderFeedModes();
  renderFeed();
}
function postTimestamp(post){
  const parsed = Date.parse(post && post.created_at ? post.created_at : '');
  return Number.isFinite(parsed) ? parsed : 0;
}
function feedInterestSignals(){
  const me = session && session.user && session.user.id;
  const categories = Object.create(null);
  const authors = Object.create(null);
  const postById = new Map(posts.map(p => [String(p.id), p]));
  const add = (postId, weight) => {
    const p = postById.get(String(postId));
    if(!p) return;
    const category = normalizeCategory(p.category);
    categories[category] = (categories[category] || 0) + weight;
    if(p.user_id) authors[p.user_id] = (authors[p.user_id] || 0) + weight;
  };
  (window._likeRows || []).filter(row => row.user_id === me).forEach(row => add(row.post_id, 2));
  (window._favRows || []).filter(row => row.user_id === me).forEach(row => add(row.post_id, 4));
  (window._cmtRows || []).filter(row => row.user_id === me).forEach(row => add(row.post_id, 3));
  return { categories, authors };
}
function feedScore(post, signals){
  const category = normalizeCategory(post.category);
  if(mutedFeedCategories.has(category)) return -100000;
  const now = Date.now();
  const ageDays = Math.max(0, (now - postTimestamp(post)) / 86400000);
  const recency = Math.max(0, 18 - ageDays * 1.25);
  const quality = Math.min(12, Math.log2(1 + Number(post.likes || 0)) * 2) + Math.min(6, Number(post.commentCount || 0) * 0.75) + Math.min(6, Number(post.favs || 0) * 0.9);
  let score = recency + quality;
  const postSubcategory = normalizePostSubcategory(post.category, post.subcategory) || String(post.subcategory || '').trim();
  const postText = `${post.title || ''} ${post.excerpt || ''} ${post.content || ''} ${(post.tags || []).join(' ')}`.toLowerCase();
  FEED_INTEREST_OPTIONS.forEach(interest => {
    if(!preferredFeedInterests.has(interest.key)) return;
    if(interest.categories.includes(category)) score += 4;
    if(interest.subcategories && interest.subcategories.includes(postSubcategory)) score += 11;
    if((interest.keywords || []).some(keyword => postText.includes(String(keyword).toLowerCase()))) score += 7;
  });
  score += Math.min(20, (signals.categories[category] || 0) * 2.5);
  if(post.user_id) score += Math.min(16, (signals.authors[post.user_id] || 0) * 2);
  const me = session && session.user && session.user.id;
  if(me && post.user_id && (window._followRows || []).some(row => row.active && row.follower_id === me && row.followee_id === post.user_id)) score += 24;
  return score;
}
function orderedFeedPosts(list){
  const base = list.slice();
  if(feedMode === 'latest') return base.sort((a,b) => postTimestamp(b) - postTimestamp(a) || Number(b.id) - Number(a.id));
  const signals = feedInterestSignals();
  return base
    .map((post, index) => ({ post, index, score:feedScore(post, signals) }))
    .filter(row => row.score > -100000)
    .sort((a,b) => b.score - a.score || postTimestamp(b.post) - postTimestamp(a.post) || a.index - b.index)
    .map(row => row.post);
}

/* ---------------- render: quicklinks ---------------- */
function renderQuicklinks(){
  const row = document.getElementById('quickRow');
  row.innerHTML = QUICKLINKS.map(q => `
    <button class="quick-link ${currentTag===q.key?'active':''}" onclick="${q.action==='youtube' ? 'openYoutubeHub()' : q.action==='services' ? 'openServicesHub()' : `setTagFilter('${q.key}')`}">
      <span class="ic">${uiIcon(q.icon, 14)}</span>${q.key}
    </button>
  `).join('');
}
function setTagFilter(tag){
  currentTag = (currentTag===tag) ? null : tag;
  currentFilter = '全部';
  renderChips();
  renderQuicklinks();
  renderFeed();
}

function postQuickSearchText(post){
  const tags = Array.isArray(post?.tags) ? post.tags.join(' ') : '';
  return [post?.title, post?.content, post?.excerpt, post?.subcategory, tags].filter(Boolean).join(' ').toLowerCase();
}
function localDateFromYmd(value){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}
function activityPeriodForPost(post){
  const event = post && post.event && typeof post.event === 'object' ? post.event : null;
  const start = localDateFromYmd(event?.start_date);
  const end = localDateFromYmd(event?.end_date);
  return start && end && end >= start ? {start, end} : null;
}
function dateRangesOverlap(startA, endA, startB, endB){ return startA <= endB && endA >= startB; }
function todayLocalDate(){ const now = new Date(); return new Date(now.getFullYear(), now.getMonth(), now.getDate()); }
function isActivityInCurrentMonth(post){
  const period = activityPeriodForPost(post);
  if(!period) return false;
  const today = todayLocalDate();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return dateRangesOverlap(period.start, period.end, monthStart, monthEnd);
}
function isActivityInNextSevenDays(post){
  const period = activityPeriodForPost(post);
  if(!period) return false;
  const start = todayLocalDate();
  const end = new Date(start); end.setDate(end.getDate() + 6);
  return dateRangesOverlap(period.start, period.end, start, end);
}
function postHasExactTag(post, tag){ return Array.isArray(post?.tags) && post.tags.some(value => String(value || '').trim() === tag); }
function postMatchesQuickLink(post, tag){
  const text = postQuickSearchText(post);
  if(tag === '遛娃') return text.includes('遛娃');
  if(tag === '免费活动') return postHasExactTag(post, tag) || text.includes('免费活动') || text.includes('免费');
  if(tag === '本月活动') return isActivityInCurrentMonth(post) || postHasExactTag(post, tag);
  if(tag === '本周末活动') return isActivityInNextSevenDays(post) || postHasExactTag(post, tag);
  return postHasExactTag(post, tag);
}
function isSignupEvent(event){ return !!(event && Number(event.capacity) > 0); }
function activityPeriodLabel(post){
  const period = activityPeriodForPost(post);
  if(!period) return '';
  const event = post.event || {};
  return event.start_date === event.end_date ? event.start_date : `${event.start_date} 至 ${event.end_date}`;
}

function youtubeHubVideos(){
  const seen = new Set();
  return orderedFeedPosts([...(posts || []), ...(window._youtubeHubRemoteVideos || [])]
    .filter(p => p && p.youtube && (p.visibility || 'public') === 'public' && !seen.has(p.youtube) && seen.add(p.youtube)));
}
async function loadYoutubeHubVideos(){
  if(window._youtubeHubLoading) return window._youtubeHubLoading;
  window._youtubeHubLoading = (async () => {
    const select = ['id','title','youtube','category','subcategory','author','likes','event','tags','user_id','visibility','pinned','created_at','location'].join(',');
    const url = `${SUPABASE_URL}/rest/v1/posts?youtube=not.is.null&or=(visibility.eq.public,visibility.is.null)&select=${select}&order=created_at.desc,id.desc&limit=300`;
    const res = await fetchPostFeed(url, {
      method:'GET',
      headers:{'Content-Type':'application/json','Accept':'application/json','apikey':SUPABASE_KEY,'Authorization':`Bearer ${(session && session.access_token) || SUPABASE_KEY}`}
    }, 8000);
    if(!res.ok) throw new Error(`视频读取失败 ${res.status}`);
    const rows = await res.json();
    window._youtubeHubRemoteVideos = Array.isArray(rows) ? rows.map(compactFeedPost) : [];
    await ensureAvatarsFor(window._youtubeHubRemoteVideos.map(p => p.user_id));
    return window._youtubeHubRemoteVideos;
  })();
  try {
    return await window._youtubeHubLoading;
  } catch(error){
    console.warn('视频页读取全部视频失败，继续显示已加载内容:', error.message);
    return window._youtubeHubRemoteVideos || [];
  } finally {
    window._youtubeHubLoading = null;
  }
}
function youtubeHubPlay(id, title='YouTube 视频'){
  const safeId = cleanYoutubeId(id);
  if(!safeId){ showToast('请粘贴有效的 YouTube 链接或视频 ID'); return; }
  const player = document.getElementById('youtubeHubPlayer');
  if(!player) return;
  player.innerHTML = `<iframe src="${youtubeEmbedUrl(safeId, {autoplay:1, mute:0})}" title="${escAttr(title)}" allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
  const scroll = document.querySelector('#youtubeHubOverlay .youtube-hub-scroll');
  if(scroll) scroll.scrollTo({top:0, behavior:'smooth'});
}
function extractYoutubePlaylistId(value){
  const raw = String(value || '').trim();
  if(!raw) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    const list = String(url.searchParams.get('list') || '').trim();
    return /^[A-Za-z0-9_-]{8,180}$/.test(list) ? list : null;
  } catch(e) {
    const match = raw.match(/[?&]list=([A-Za-z0-9_-]{8,180})/i);
    return match ? match[1] : null;
  }
}
function youtubeHubPlayPlaylist(playlistId, title='YouTube 播放列表'){
  const safeList = String(playlistId || '').trim();
  if(!/^[A-Za-z0-9_-]{8,180}$/.test(safeList)){ showToast('请粘贴有效的 YouTube 播放列表链接'); return; }
  const player = document.getElementById('youtubeHubPlayer');
  if(!player) return;
  const params = new URLSearchParams({list:safeList, rel:'0', autoplay:'1'});
  player.innerHTML = `<iframe src="https://www.youtube.com/embed/videoseries?${params.toString()}" title="${escAttr(title)}" allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
  const scroll = document.querySelector('#youtubeHubOverlay .youtube-hub-scroll');
  if(scroll) scroll.scrollTo({top:0, behavior:'smooth'});
}
function renderYoutubeHub(){
  const list = document.getElementById('youtubeHubList');
  if(!list) return;
  const videos = youtubeHubVideos();
  if(!videos.length){
    list.innerHTML = `<div class="empty" style="grid-column:1/-1;padding:24px 10px;">暂时没有可播放的视频笔记</div>`;
    return;
  }
  list.innerHTML = videos.map(p => `<button class="youtube-hub-card" onclick="youtubeHubPlay('${escAttr(p.youtube)}','${escAttr(p.title || 'YouTube 视频')}')"><img src="${youtubeThumbUrl(p.youtube)}" onerror="this.onerror=null;this.src='${youtubeThumbUrl(p.youtube, 'default')}';" alt=""><b>${escHtml(p.title || 'YouTube 视频')}</b></button>`).join('');
}
let youtubeHubReturnFocus = null;
function openYoutubeHub(){
  const overlay = document.getElementById('youtubeHubOverlay');
  if(!overlay) return;
  youtubeHubReturnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  overlay.classList.add('open'); overlay.setAttribute('aria-hidden','false');
  renderYoutubeHub();
  const first = youtubeHubVideos()[0];
  if(first) youtubeHubPlay(first.youtube, first.title || 'YouTube 视频');
  loadYoutubeHubVideos().then(() => {
    if(!overlay.classList.contains('open')) return;
    renderYoutubeHub();
    const player = document.getElementById('youtubeHubPlayer');
    if(player && !player.innerHTML){
      const preferred = youtubeHubVideos()[0];
      if(preferred) youtubeHubPlay(preferred.youtube, preferred.title || 'YouTube 视频');
    }
  });
}
function openServicesHub(){
  openInternalModule('/services/', '5.585');
}
function closeYoutubeHub(){
  const overlay = document.getElementById('youtubeHubOverlay');
  if(!overlay) return;
  // 先移走焦点，再隐藏容器，避免浏览器报 aria-hidden 焦点警告。
  if(overlay.contains(document.activeElement) && document.activeElement instanceof HTMLElement){
    document.activeElement.blur();
  }
  overlay.classList.remove('open'); overlay.setAttribute('aria-hidden','true');
  const player = document.getElementById('youtubeHubPlayer');
  if(player) player.innerHTML = '';
  const returnFocus = youtubeHubReturnFocus;
  youtubeHubReturnFocus = null;
  if(returnFocus && document.contains(returnFocus)) setTimeout(() => returnFocus.focus({preventScroll:true}), 0);
}
function playYoutubeHubInput(){
  const input = document.getElementById('youtubeHubInput');
  const raw = input && input.value;
  const playlistId = extractYoutubePlaylistId(raw);
  if(playlistId){ youtubeHubPlayPlaylist(playlistId, 'YouTube 播放列表'); return; }
  const id = extractYoutubeId(raw);
  if(!id){ showToast('请粘贴有效的 YouTube 链接或 11 位视频 ID'); return; }
  youtubeHubPlay(id, 'YouTube 视频');
}

function localFeedPreferenceKey(){
  return `leshenghuo_muted_feed_categories_${session && session.user ? session.user.id : 'guest'}`;
}
function localFeedInterestKey(){ return `leshenghuo_feed_interests_${session && session.user ? session.user.id : 'guest'}`; }
function feedOnboardingKey(){ return `leshenghuo_feed_onboarding_done_${session && session.user ? session.user.id : 'guest'}`; }
function normalizeFeedInterestKeys(values){
  const legacyMap = { 美食:'food', 玩乐:'weekend', 好物:'deals', 生活:'home', 社区:'friends' };
  return Array.isArray(values) ? values.map(value => legacyMap[normalizeCategory(value)] || String(value || '')).filter(value => FEED_INTEREST_OPTIONS.some(option => option.key === value)) : [];
}
function readLocalFeedInterests(){
  try {
    const saved = JSON.parse(localStorage.getItem(localFeedInterestKey()) || '[]');
    preferredFeedInterests = new Set(normalizeFeedInterestKeys(saved));
  } catch(e){ preferredFeedInterests = new Set(); }
}
function saveLocalFeedInterests(){ localStorage.setItem(localFeedInterestKey(), JSON.stringify([...preferredFeedInterests])); }
function feedInterestOptions(){ return FEED_INTEREST_OPTIONS; }
function renderFeedInterestPicker(targetId, selected){
  const target = document.getElementById(targetId);
  if(!target) return;
  target.innerHTML = feedInterestOptions().map(interest => `<button class="${selected.has(interest.key) ? 'selected' : ''}" onclick="toggleFeedInterest('${interest.key}','${targetId}')">${uiIcon(interest.icon,15)}${interest.label}</button>`).join('');
}
function toggleFeedInterest(category, targetId){
  if(feedInterestDraft.has(category)) feedInterestDraft.delete(category); else feedInterestDraft.add(category);
  renderFeedInterestPicker(targetId, feedInterestDraft);
}
async function maybeOpenFeedOnboarding(){
  const userId = session && session.user && session.user.id;
  if(userId && feedPreferencesLoadedFor !== userId) await loadFeedPreferences();
  if(userId ? feedOnboardingCompleted : localStorage.getItem(feedOnboardingKey())) return;
  const overlay = document.getElementById('feedOnboardingOverlay');
  if(!overlay) return;
  feedInterestDraft = new Set(preferredFeedInterests);
  renderFeedInterestPicker('feedOnboardingPicker', feedInterestDraft);
  overlay.classList.add('open');
}
function saveFeedOnboarding(){
  preferredFeedInterests = new Set(feedInterestDraft);
  saveLocalFeedInterests();
  localStorage.setItem(feedOnboardingKey(), '1');
  feedOnboardingCompleted = true;
  persistFeedInterestState(true);
  document.getElementById('feedOnboardingOverlay')?.classList.remove('open');
  renderFeedModes(); renderFeed();
  showToast(preferredFeedInterests.size ? '已按你的兴趣调整推荐' : '已进入推荐内容');
}
function skipFeedOnboarding(){
  localStorage.setItem(feedOnboardingKey(), '1');
  feedOnboardingCompleted = true;
  persistFeedInterestState(true);
  document.getElementById('feedOnboardingOverlay')?.classList.remove('open');
}
function readLocalFeedPreferences(){
  try {
    const saved = JSON.parse(localStorage.getItem(localFeedPreferenceKey()) || '[]');
    mutedFeedCategories = new Set(Array.isArray(saved) ? saved.map(normalizeCategory) : []);
  } catch(e){ mutedFeedCategories = new Set(); }
}
function saveLocalFeedPreferences(){
  localStorage.setItem(localFeedPreferenceKey(), JSON.stringify([...mutedFeedCategories]));
}
async function loadFeedPreferences(){
  const userId = session && session.user && session.user.id;
  if(!userId){
    readLocalFeedPreferences();
    readLocalFeedInterests();
    feedOnboardingCompleted = !!localStorage.getItem(feedOnboardingKey());
    feedPreferencesLoadedFor = 'guest';
    renderFeedModes();
    renderFeed();
    return;
  }
  if(feedPreferencesLoadedFor === userId) return;
  readLocalFeedPreferences();
  readLocalFeedInterests();
  const localOnboardingDone = !!localStorage.getItem(feedOnboardingKey());
  feedOnboardingCompleted = false;
  try {
    const res = await authedFetch(`${SUPABASE_URL}/rest/v1/user_feed_preferences?user_id=eq.${userId}&select=muted_categories,feed_interests,onboarding_completed_at`, { method:'GET' });
    if(res.ok){
      const rows = await res.json();
      if(rows[0]){
        if(Array.isArray(rows[0].muted_categories)){
          mutedFeedCategories = new Set(rows[0].muted_categories.map(normalizeCategory));
          saveLocalFeedPreferences();
        }
        if(Array.isArray(rows[0].feed_interests)){
          preferredFeedInterests = new Set(normalizeFeedInterestKeys(rows[0].feed_interests));
          saveLocalFeedInterests();
        }
        feedOnboardingCompleted = !!rows[0].onboarding_completed_at;
      }
    } else if(res.status !== 404){
      console.warn('内容偏好读取失败:', res.status);
    }
  } catch(e){ console.warn('内容偏好读取失败:', e.message); }
  feedPreferencesLoadedFor = userId;
  if(localOnboardingDone && !feedOnboardingCompleted){
    feedOnboardingCompleted = true;
    persistFeedInterestState(true);
  }
  renderFeedModes();
  renderFeed();
}
async function persistFeedInterestState(markOnboardingComplete=false){
  saveLocalFeedInterests();
  const userId = session && session.user && session.user.id;
  if(!userId) return;
  const body = { user_id:userId, feed_interests:[...preferredFeedInterests], updated_at:new Date().toISOString() };
  if(markOnboardingComplete) body.onboarding_completed_at = new Date().toISOString();
  try {
    const res = await authedFetch(`${SUPABASE_URL}/rest/v1/user_feed_preferences?on_conflict=user_id`, {
      method:'POST',
      headers:{ Prefer:'resolution=merge-duplicates,return=minimal' },
      body:JSON.stringify(body)
    });
    if(!res.ok) console.warn('兴趣偏好保存失败:', res.status);
  } catch(e){ console.warn('兴趣偏好保存失败:', e.message); }
}
async function persistFeedPreferences(){
  saveLocalFeedPreferences();
  const userId = session && session.user && session.user.id;
  if(!userId) return;
  try {
    const res = await authedFetch(`${SUPABASE_URL}/rest/v1/user_feed_preferences?on_conflict=user_id`, {
      method:'POST',
      headers:{ Prefer:'resolution=merge-duplicates,return=minimal' },
      body:JSON.stringify({ user_id:userId, muted_categories:[...mutedFeedCategories], updated_at:new Date().toISOString() })
    });
    if(!res.ok && res.status !== 404) console.warn('内容偏好保存失败:', res.status);
  } catch(e){ console.warn('内容偏好保存失败:', e.message); }
}
function reduceFeedCategory(category){
  const normalized = normalizeCategory(category);
  mutedFeedCategories.add(normalized);
  persistFeedPreferences();
  closeShareSheet();
  renderFeedModes();
  renderFeed();
  showToast(`将减少 ${normalized} 内容，可在“偏好”恢复`);
}
function openFeedPreferences(){
  const overlay = document.getElementById('feedPreferenceOverlay');
  const body = document.getElementById('feedPreferenceBody');
  if(!overlay || !body) return;
  const muted = [...mutedFeedCategories];
  feedInterestDraft = new Set(preferredFeedInterests);
  body.innerHTML = `<div class="feed-preference-help">推荐会参考你关注的人、互动、兴趣标签和发布时间；“最新”始终按时间排列。</div><div><label style="display:block;font-size:12px;font-weight:900;color:var(--ink-soft);margin-bottom:8px;">我关心的内容</label><div class="feed-interest-picker" id="feedPreferenceInterestPicker"></div><button class="feedback-submit" style="margin-top:12px;" onclick="saveFeedPreferenceInterests()">保存兴趣选择</button></div><div><label style="display:block;font-size:12px;font-weight:900;color:var(--ink-soft);margin-bottom:8px;">已减少的内容</label><div class="feed-preference-list">${muted.length ? muted.map(category => `<span class="feed-preference-tag">${escHtml(category)}<button onclick="restoreFeedCategory('${String(category).replace(/'/g, '')}')" aria-label="恢复 ${escAttr(category)}">×</button></span>`).join('') : '<span style="font-size:13px;color:var(--ink-faint);">目前没有减少任何分类。</span>'}</div></div><div class="feedback-meta">登录后，兴趣选择会随账号同步到其他设备。</div>`;
  renderFeedInterestPicker('feedPreferenceInterestPicker', feedInterestDraft);
  overlay.classList.add('open');
}
function saveFeedPreferenceInterests(){ preferredFeedInterests = new Set(feedInterestDraft); persistFeedInterestState(false); renderFeedModes(); renderFeed(); closeFeedPreferences(); showToast('兴趣偏好已保存'); }
function closeFeedPreferences(){ document.getElementById('feedPreferenceOverlay')?.classList.remove('open'); }
function restoreFeedCategory(category){
  mutedFeedCategories.delete(normalizeCategory(category));
  persistFeedPreferences();
  renderFeedModes();
  renderFeed();
  openFeedPreferences();
}

/* ---------------- render: feed ---------------- */
function feedCardHtml(p){
  const media = postCardMediaHtml(p, 40);
  const stub = isSignupEvent(p.event) ? `<div class="stub display">${p.event.userJoined?'已报名':(p.event.capacity-p.event.registered)+'席剩余'}</div>` : '';
  return `
  <div class="card" onclick="openPost(${p.id})">
    <div class="card-media">
      ${media}
      ${cardCategoryTag(p.category, p.subcategory)}
      ${mediaWatermarkHtml(p.author)}
      ${stub}
    </div>
    <div class="card-body">
      <div class="card-title">${p.title}</div>
      <div class="card-meta">
        <div class="author">
          ${avatarHomeLinkHtml(p.user_id, p.author, 20)}
          <span class="author-name" onclick="event.stopPropagation();openUserPublicPage('${String(p.user_id || '').replace(/'/g, '')}','${String(p.author || '乐生活用户').replace(/'/g, '')}')" style="display:flex;align-items:center;gap:5px;min-width:0;cursor:pointer;">${authorNameHtml(p.author, p.user_id)}</span>
        </div>
        <div class="stat-row"><span>${p.liked?'♥':'♡'} ${p.likes}</span></div>
      </div>
    </div>
  </div>`;
}
function renderFeed(){
  const el = document.getElementById('feed');
  if(!el) return;
  renderFeedModes();
  let list;
  const hiddenUsers = new Set([
    ...(Array.isArray(homeAccountSettingsCache?.privacy?.hide) ? homeAccountSettingsCache.privacy.hide : []),
    ...(Array.isArray(homeAccountSettingsCache?.privacy?.blacklist) ? homeAccountSettingsCache.privacy.blacklist : [])
  ].map(String));
  const publicPosts = posts.filter(p => (p.visibility || 'public') === 'public' && !hiddenUsers.has(String(p.user_id || '')));
  if(currentTag){
    list = publicPosts.filter(p => postMatchesQuickLink(p, currentTag));
  } else {
    list = currentFilter==='全部' ? publicPosts : publicPosts.filter(p=>normalizeCategory(p.category)===currentFilter);
    if(currentSubcategory !== '全部') list = list.filter(p => normalizePostSubcategory(p.category, p.subcategory) === currentSubcategory);
  }
  list = orderedFeedPosts(list);
  const emptyHtml = `<div class="empty" style="grid-column:1/-1;"><span class="display">这里还空空的</span>${currentTag ? '暂时没有符合条件的内容,换个分类看看' : '成为第一个分享的人吧'}</div>`;
  const result = window.LeshenghuoFeedRender?.render({
    element: el,
    list,
    loading: feedIsLoading,
    failed: feedLoadFailed,
    cardHtml: feedCardHtml,
    emptyHtml,
    onRetry: () => loadPostsFromSupabase({force:true})
  });
  if(result?.rendered){
    if(result.hasItems) warmPostMediaCache(list, false);
    return;
  }
  el.innerHTML = list.length ? list.map(feedCardHtml).join('') : emptyHtml;
  if(list.length) warmPostMediaCache(list, false);
}
function customPostTagLabel(value){ return String(value || '').trim().replace(/^#+/, '').slice(0, 60); }
function customPostTagHtml(value){
  const label = customPostTagLabel(value);
  if(!label) return '';
  return `<button class="xhs-tag-link" onclick="openTagResults(decodeURIComponent('${encodeURIComponent(label)}'))">#${escHtml(label)}</button>`;
}
function tagResultCardHtml(p){
  const media = postCardMediaHtml(p, 40);
  const stub = isSignupEvent(p.event) ? `<div class="stub display">${p.event.userJoined?'已报名':(p.event.capacity-p.event.registered)+'席剩余'}</div>` : '';
  const safeId = Number(p.id);
  return `<div class="card" onclick="openPost(${Number.isFinite(safeId) ? safeId : 0})"><div class="card-media">${media}${cardCategoryTag(p.category, p.subcategory)}${mediaWatermarkHtml(p.author)}${stub}</div><div class="card-body"><div class="card-title">${escHtml(p.title || '无标题')}</div><div class="card-meta"><div class="author">${avatarHomeLinkHtml(p.user_id, p.author, 20)}<span class="author-name" onclick="event.stopPropagation();openUserPublicPage('${String(p.user_id || '').replace(/'/g, '')}','${String(p.author || '乐生活用户').replace(/'/g, '')}')" style="display:flex;align-items:center;gap:5px;min-width:0;cursor:pointer;">${authorNameHtml(p.author, p.user_id)}</span></div><div class="stat-row"><span>${p.liked?'♥':'♡'} ${p.likes || 0}</span></div></div></div></div>`;
}
async function openTagResults(tag){
  const label = customPostTagLabel(tag);
  if(!label) return;
  const overlay = document.getElementById('tagResultsOverlay');
  const title = document.getElementById('tagResultsTitle');
  const summary = document.getElementById('tagResultsSummary');
  const feed = document.getElementById('tagResultsFeed');
  if(!overlay || !title || !summary || !feed) return;
  title.textContent = `#${label}`;
  summary.textContent = '正在读取标签笔记…';
  feed.innerHTML = Array.from({length:4}, () => `<div class="feed-loading-card" aria-label="正在加载笔记"><div class="feed-loading-media"></div><div class="feed-loading-lines"><i></i><i></i></div></div>`).join('');
  overlay.classList.add('open');
  try {
    const select = ['id','title','content','excerpt','category','subcategory','author','image','youtube','likes','event','tags','user_id','visibility','pinned','created_at','location'].join(',');
    const params = new URLSearchParams({ select, tags:`cs.${JSON.stringify([label])}`, or:'(visibility.eq.public,visibility.is.null)', order:'created_at.desc,id.desc', limit:'200' });
    const res = await fetchPostFeed(`${SUPABASE_URL}/rest/v1/posts?${params.toString()}`, {
      method:'GET', headers:{ 'Content-Type':'application/json', 'Accept':'application/json', 'apikey':SUPABASE_KEY, 'Authorization':`Bearer ${(session && session.access_token) || SUPABASE_KEY}`, 'Prefer':'count=exact' }
    }, 7000);
    if(!res.ok) throw new Error(`标签读取失败 ${res.status}`);
    const rows = await res.json();
    const range = res.headers.get('content-range') || '';
    const matchedCount = Number(range.split('/')[1]);
    const total = Number.isFinite(matchedCount) ? matchedCount : rows.length;
    const list = rows.map(compactFeedPost);
    await ensureAvatarsFor(list.map(p => p.user_id));
    summary.innerHTML = `<b>${total} 篇笔记</b><span>${total > list.length ? `当前显示前 ${list.length} 篇` : '按最新发布排序'}</span>`;
    feed.innerHTML = list.length ? list.map(tagResultCardHtml).join('') : `<div class="empty" style="grid-column:1/-1;"><span class="display">还没有相关笔记</span>换一个标签看看吧</div>`;
  } catch(e){
    console.warn('标签笔记读取失败:', e.message);
    const local = posts.filter(p => (p.tags || []).map(customPostTagLabel).includes(label));
    summary.innerHTML = `<b>${local.length} 篇笔记</b><span>暂时显示已加载内容</span>`;
    feed.innerHTML = local.length ? local.map(tagResultCardHtml).join('') : `<div class="empty" style="grid-column:1/-1;">标签内容暂时无法读取，请稍后重试</div>`;
  }
}
function closeTagResults(){ document.getElementById('tagResultsOverlay')?.classList.remove('open'); }
function playIcon(){
  return `<svg viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="11" fill="rgba(0,0,0,0.45)"/><path d="M10 8.5L16 12L10 15.5V8.5Z" fill="white"/></svg>`;
}

/* ---------------- post modal ---------------- */
function returnFromPost(){ return appNavigation?.back() || closePost(); }

function postDetailLoadingHtml(message='正在打开这篇笔记…'){
  return `<div style="min-height:100%;display:flex;align-items:center;justify-content:center;padding:32px;background:#fff;"><div style="text-align:center;color:var(--ink-soft);font-size:14px;"><div style="width:28px;height:28px;margin:0 auto 12px;border:3px solid var(--sage-light);border-top-color:var(--sage-dark);border-radius:50%;animation:spin .8s linear infinite;"></div>${escHtml(message)}</div></div>`;
}
async function loadSingleSharedPost(postId){
  const existing = findPostById(postId);
  if(existing) return existing;
  try {
    // 分享链接可能比首页列表更早打开；单独读取这一篇，避免详情页先变成空白。
    const raw = await postDetailApi?.fetchSharedPost(postId);
    if(!raw) return null;
    const post = compactFeedPost(raw);
    post.images = Array.isArray(raw.images) ? raw.images : null;
    post.content = raw.content || '';
    posts = [post, ...posts.filter(item => String(item.id) !== String(post.id))];
    return post;
  } catch(error){
    console.warn('分享笔记读取失败:', error.message);
    return null;
  }
}
function openPostFromUserPage(id){
  if(!appNavigation?.isRestoring()) appNavigation?.enter({ type:'post', id });
  closeUserPublicPage();
  return openPost(id, null, true);
}

function openPostFromMerchantPage(id){
  if(!appNavigation?.isRestoring()) appNavigation?.enter({ type:'post', id });
  closeMerchantPublicPage();
  return openPost(id, null, true);
}

function openPostFromSearch(id){
  if(!appNavigation?.isRestoring()) appNavigation?.enter({ type:'post', id });
  closeSearchPage();
  return openPost(id, null, true);
}

async function openPost(id, explicitReturnRoute=null, routeRecorded=false){
  if(!routeRecorded && !appNavigation?.isRestoring()) appNavigation?.enter({ type:'post', id });
  activePostId = id;
  const overlay = document.getElementById('postOverlay');
  let p = getPost();
  if(!p){
    document.getElementById('postModal').innerHTML = postDetailLoadingHtml();
    overlay.classList.add('open');
    p = await loadSingleSharedPost(id);
    if(String(activePostId) !== String(id)) return;
    if(!p){
      document.getElementById('postModal').innerHTML = postDetailLoadingHtml('这篇笔记暂时无法打开，请稍后重试。');
      return;
    }
  }
  renderPostModal();
  overlay.classList.add('open');
  hydratePostDetail(id);
  loadCommentsFromDb(id); // 从数据库加载评论
  recordPostView(id); // 记录一次真实浏览（供商家仪表盘"浏览量"统计使用）
  // 2.94修复：兜底确保笔记作者头像已缓存（一般在首页加载时已批量拉过）
  ensureAvatarsFor([p.user_id], true).then(changed => { if(changed && String(activePostId) === String(id)) renderPostModal(); });
}
async function hydratePostDetail(postId){
  const post = findPostById(postId);
  if(!post || hydratedPostIds.has(String(postId))) return;
  hydratedPostIds.add(String(postId));
  try {
    const full = await postDetailApi?.fetchDetailFields(postId);
    if(!full) return;
    post.content = full.content || post.content || '';
    post.images = Array.isArray(full.images) ? full.images : post.images;
    post.community_meta = full.community_meta && typeof full.community_meta === 'object' ? full.community_meta : null;
    post.location = full.location || post.location || null;
    if(String(activePostId) === String(postId)) renderPostModal();
  } catch(error){
    hydratedPostIds.delete(String(postId));
    console.warn('笔记详情补充读取失败:', error.message);
  }
}
async function loadCommentsFromDb(postId){
  try {
    const rows = await postDetailApi?.fetchComments(postId);
    if(!rows) throw new Error('详情接口未初始化');
    const p = getPost();
    // URL、卡片和数据库的 id 类型可能分别是字符串/数字，统一转字符串比较，避免成功读到评论却不渲染。
    if(!p || String(p.id) !== String(postId)) return;
    p.comments = rows.map(r => ({
      id: r.id, name: r.name, text: r.text, user_id: r.user_id,
      parent_id: r.parent_id || null, reply_to_name: r.reply_to_name || null,
      time: r.created_at ? new Date(r.created_at).toLocaleString('zh-CN') : ''
    }));
    await ensureAvatarsFor(p.comments.map(c => c.user_id));
    renderCommentsList(p);
  } catch(e){ console.warn('评论加载失败:', e.message); }
}
/* 从数据库同步所有帖子的点赞/收藏状态 */
async function loadEngagement(){
  try {
    if(session && session.user && accessTokenExpiresSoon(session.access_token)){
      const refreshed = await refreshSession();
      if(!refreshed) logoutUser(true);
    }
    const summary = await engagementLoader?.load();
    if(!summary) throw new Error('互动加载器未初始化');
    const {
      likes,
      favorites:favs,
      comments:cmts,
      follows,
      likeCount,
      favoriteCount:favCount,
      commentCount:cmtCount,
      myLikes,
      myFavorites:myFavs,
      partialFailure
    } = summary;
    posts.forEach(p => {
      if(likes){ p.likes = likeCount[p.id] || 0; p.liked = myLikes.has(p.id); }
      if(favs){ p.favs = favCount[p.id] || 0; p.collected = myFavs.has(p.id); }
      if(cmts){ p.commentCount = cmtCount[p.id] || 0; }
    });
    if(likes) window._likeRows = likes;
    if(favs) window._favRows = favs;
    if(cmts) window._cmtRows = cmts;
    if(follows) window._followRows = follows;
    if(partialFailure) console.warn('互动数据部分读取失败，已保留上一轮显示。');
    await loadFeedPreferences();
    renderFeed();
    renderProfileFollowStats();
    updateNavMsgDot();
    console.log('✓ 点赞/收藏已同步（Shared Engagement Loader）');
  } catch(e){ console.warn('互动数据同步失败:', e.message); }
}
function closePost(){
  closeCommentComposer();
  const overlay = document.getElementById('postOverlay');
  overlay.classList.remove('open', 'image-detail-open');
  document.getElementById('postModal')?.classList.remove('image-detail-layout');
  activePostId = null;
  currentImageIndex = 0;
  if(merchantAiReturnAfterPost && merchantAiState){
    merchantAiReturnAfterPost = false;
    document.getElementById('merchantAiOverlay').classList.add('open');
    renderMerchantAiFlow();
  }
  if(window.adminReportPostReturn){
    window.adminReportPostReturn = false;
    adminTab = 'reports';
    switchTab('admin');
    setTimeout(() => switchAdminTab('reports'), 0);
  }
}
function findPostById(id){
  return posts.find(p=>String(p.id)===String(id)) || ownProfilePosts.find(p=>String(p.id)===String(id));
}
function getPost(){ return findPostById(activePostId); }
function syncPostCopies(source){
  if(!source || source.id == null) return;
  [posts, ownProfilePosts].forEach(list => list.forEach(item => {
    if(item !== source && String(item.id) === String(source.id)) Object.assign(item, source);
  }));
}

/* ---- profile page ---- */
let browsingHistory = [];
let ownProfilePosts = [];
let ownProfilePostsLoadedFor = null;
let ownProfilePostsLoadPromise = null;

function profilePostTimestamp(post){
  const value = post && (post.scheduled_at || post.created_at);
  const timestamp = value ? new Date(value).getTime() : 0;
  return Number.isFinite(timestamp) ? timestamp : 0;
}
function isPendingScheduledPost(post){
  if(!post || post.visibility !== 'scheduled' || !post.scheduled_at) return false;
  return profilePostTimestamp(post) > Date.now();
}
function profilePostsForCurrentUser(){
  const myUid = session && session.user ? session.user.id : null;
  const merged = new Map();
  [...posts, ...ownProfilePosts].forEach(post => {
    if(!post) return;
    const belongsToMe = (myUid && String(post.user_id || '') === String(myUid)) ||
      (!post.user_id && (post.author === '我' || post.author === currentUser.name));
    if(belongsToMe) merged.set(String(post.id), post);
  });
  return [...merged.values()].sort((a,b) => {
    const pinnedFirst = Number(!!b.pinned) - Number(!!a.pinned);
    return pinnedFirst || profilePostTimestamp(b) - profilePostTimestamp(a) || Number(b.id) - Number(a.id);
  });
}
async function loadOwnProfilePosts(){
  const myUid = session && session.user ? session.user.id : null;
  if(!myUid){
    ownProfilePosts = [];
    ownProfilePostsLoadedFor = null;
    return [];
  }
  if(ownProfilePostsLoadedFor === myUid) return ownProfilePosts;
  if(ownProfilePostsLoadPromise) return ownProfilePostsLoadPromise;
  ownProfilePostsLoadPromise = (async () => {
    const select = [
      'id','title','content','excerpt','category','subcategory','author','image','image_thumbnail','images','image_thumbnails',
      'youtube','likes','event','tags','user_id','visibility','pinned','created_at','scheduled_at','location'
    ].join(',');
    const url = `${SUPABASE_URL}/rest/v1/posts?user_id=eq.${encodeURIComponent(myUid)}&select=${select}&order=created_at.desc,id.desc&limit=300`;
    const res = await authedFetch(url, { method:'GET' });
    if(!res.ok) throw new Error(`个人笔记读取失败 ${res.status}`);
    const rows = await res.json();
    ownProfilePosts = Array.isArray(rows) ? rows.map(compactFeedPost) : [];
    ownProfilePostsLoadedFor = myUid;
    return ownProfilePosts;
  })();
  try {
    return await ownProfilePostsLoadPromise;
  } catch(error){
    console.warn('个人笔记读取失败，继续显示当前内容:', error.message);
    return ownProfilePosts;
  } finally {
    ownProfilePostsLoadPromise = null;
  }
}
function initProfilePage(){
  const wrapMerchant = document.getElementById('merchantPageWrap');
  const wrapNormal = document.getElementById('normalProfileWrap');
  if(currentMerchant && currentMerchant.verified){
    if(wrapNormal) wrapNormal.style.display = 'none';
    if(wrapMerchant) wrapMerchant.style.display = 'block';
    renderMerchantPage();
    return;
  }
  if(wrapMerchant) wrapMerchant.style.display = 'none';
  if(wrapNormal) wrapNormal.style.display = '';

  // 首先更新用户信息显示
  console.log('👤 初始化个人资料页面...');
  console.log('当前用户:', currentUser);
  
  updateProfileDisplay();
  renderMerchantApplyBlock();
  loadMerchantApplicationStatus(false);
  
  // 个人页读取账号的所有笔记：公开、私密、互关及待定时发布内容都只在这里展示给本人。
  const myUid = session && session.user ? session.user.id : null;
  if(myUid && ownProfilePostsLoadedFor !== myUid){
    loadOwnProfilePosts().then(() => {
      if(currentTab === 'profile') initProfilePage();
    });
  }
  const userPosts = profilePostsForCurrentUser();
  const notesContent = document.getElementById('userNotes');
  
  if(!notesContent){
    console.warn('⚠️ userNotes 元素不存在');
    return;
  }
  
  if(userPosts.length > 0){
    console.log('📝 显示', userPosts.length, '条笔记');
    notesContent.innerHTML = userPosts.map(p => `
      <div onclick="openPost(${p.id})" style="position:relative;border-radius:12px;overflow:hidden;background:var(--bg-alt);cursor:pointer;">
        ${p.pinned ? '<span style="position:absolute;top:6px;left:6px;z-index:3;background:var(--berry);color:#fff;font-size:10px;padding:2px 8px;border-radius:999px;font-weight:600;">置顶</span>' : ''}
        ${isPendingScheduledPost(p) ? `<span style="position:absolute;top:${p.pinned ? '31' : '6'}px;left:6px;z-index:3;background:var(--sage-dark);color:#fff;font-size:10px;padding:2px 8px;border-radius:999px;font-weight:700;">定时发布</span>` : ''}
        <button onclick="event.stopPropagation();togglePinById(${p.id})" style="position:absolute;top:6px;right:6px;z-index:4;border:0;border-radius:999px;background:rgba(255,255,255,.94);color:${p.pinned ? 'var(--berry)' : 'var(--ink-soft)'};padding:5px 8px;font-size:10px;font-weight:900;box-shadow:0 1px 5px rgba(42,39,33,.14);">${p.pinned ? '取消置顶' : '置顶'}</button>
        <div style="position:relative;aspect-ratio:3/4;background:var(--bg-alt);overflow:hidden;">${postCardMediaHtml(p, 38)}</div>
        <div style="position:absolute;inset:0;background:rgba(0,0,0,0);opacity:0;transition:opacity 0.3s;display:flex;align-items:flex-end;justify-content:space-around;padding:12px;gap:8px;background:linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.7));" class="post-overlay-${p.id}">
          <button onclick="event.stopPropagation();editPost(${p.id})" style="flex:1;padding:8px 12px;background:var(--sage);color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:600;font-size:12px;">编辑</button>
          <button onclick="event.stopPropagation();ownerDeletePost(${p.id})" style="flex:1;padding:8px 12px;background:#d9534f;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:600;font-size:12px;">删除</button>
        </div>
        <div style="padding:10px;background:#fff;">
          <div style="font-size:12px;font-weight:600;color:var(--ink);line-height:1.4;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${p.title}</div>
          ${isPendingScheduledPost(p) ? `<div style="margin-top:5px;font-size:10px;color:var(--sage-dark);font-weight:700;">${escHtml(formatLaDateTime(p.scheduled_at))} 发布</div>` : ''}
        </div>
      </div>
    `).join('');
    
    // 添加悬停效果
    notesContent.querySelectorAll('[class^="post-overlay-"]').forEach(el => {
      el.parentElement.addEventListener('mouseenter', () => {
        el.style.opacity = '1';
      });
      el.parentElement.addEventListener('mouseleave', () => {
        el.style.opacity = '0';
      });
    });
  } else {
    console.log('📭 没有笔记');
    notesContent.innerHTML = `<div class="empty-state" style="grid-column:1/-1;text-align:center;padding:40px 20px;"><span style="display:block;margin:0 auto 10px;width:40px;height:40px;color:var(--ink-faint);">${uiIcon('edit',40)}</span><p style="color:var(--ink-soft);">还没有发布笔记</p></div>`;
  }
  
  // 评论和收藏暂时为空
  const commentEl = document.getElementById('userComments');
  const favoriteEl = document.getElementById('userFavorites');
  
  if(commentEl) commentEl.innerHTML = `<div class="empty-state" style="text-align:center;padding:40px 20px;"><span style="display:block;margin:0 auto 10px;width:40px;height:40px;color:var(--ink-faint);">${uiIcon('message',40)}</span><p style="color:var(--ink-soft);">还没有评论</p></div>`;
  if(favoriteEl) favoriteEl.innerHTML = `<div class="empty-state" style="text-align:center;padding:40px 20px;"><span style="display:block;margin:0 auto 10px;width:40px;height:40px;color:var(--ink-faint);">${uiIcon('heart',40)}</span><p style="color:var(--ink-soft);">还没有收藏</p></div>`;
  loadUserMembershipCards(false);
  
  console.log('✓ 个人资料页面初始化完成');
}
function switchProfileTab(tab){
  // Hide all tab contents
  document.getElementById('notes-content').style.display = 'none';
  document.getElementById('comments-content').style.display = 'none';
  document.getElementById('favorites-content').style.display = 'none';
  const membershipContent = document.getElementById('memberships-content');
  if(membershipContent) membershipContent.style.display = 'none';
  
  // Reset tab button styles
  document.querySelectorAll('.content-tab').forEach(btn => {
    btn.style.color = 'var(--ink-faint)';
    btn.style.borderBottomColor = 'transparent';
  });
  
  // Show selected tab
  document.getElementById(`${tab}-content`).style.display = 'block';
  const activeBtn = document.querySelector(`.content-tab[data-tab="${tab}"]`) || (typeof event !== 'undefined' ? event.target : null);
  if(activeBtn){
    activeBtn.style.color = 'var(--berry)';
    activeBtn.style.borderBottomColor = 'var(--berry)';
  }
  if(tab === 'memberships') loadUserMembershipCards(true);
}
async function showProfileBrowsingHistory(){
  return openUnifiedBrowsingHistory();
}
async function openUnifiedBrowsingHistory(){
  if(!(session && session.user)){ showToast('登录后可查看浏览记录'); openAuth(); return; }
  openHomeFeature('浏览记录', '<div class="home-feature-empty">正在读取浏览记录...</div>');
  try {
    const response = await authedFetch(`${SUPABASE_URL}/rest/v1/post_views?user_id=eq.${encodeURIComponent(session.user.id)}&select=post_id,created_at&order=created_at.desc&limit=240`, { method:'GET' });
    if(!response.ok) throw new Error(await response.text());
    const rows = await response.json();
    const latestByPost = new Map();
    (rows || []).forEach(row => { if(row.post_id != null && !latestByPost.has(String(row.post_id))) latestByPost.set(String(row.post_id), row.created_at); });
    const needed = [...latestByPost.keys()];
    let missing = [];
    const localById = new Map((posts || []).map(post => [String(post.id), post]));
    needed.forEach(id => { if(!localById.has(id)) missing.push(id); });
    if(missing.length){
      const postResponse = await authedFetch(`${SUPABASE_URL}/rest/v1/posts?id=in.(${missing.map(encodeURIComponent).join(',')})&select=id,title,image,images,author,category,created_at&limit=${Math.min(missing.length, 240)}`, { method:'GET' });
      if(postResponse.ok) (await postResponse.json()).forEach(post => localById.set(String(post.id), post));
    }
    browsingHistory = needed.map(id => {
      const post = localById.get(String(id));
      return post ? Object.assign({}, post, { viewedAt:latestByPost.get(String(id)) }) : null;
    }).filter(Boolean);
    const items = browsingHistory.length ? browsingHistory.map(item => `
      <button class="home-history-row" type="button" onclick="closeHomeFeature();openPost(${JSON.stringify(item.id)})">
        <span class="home-history-thumb">${item.image ? `<img src="${escAttr(item.image)}" alt="">` : '<span></span>'}</span>
        <span class="home-history-info"><b>${escHtml(item.title || '未命名笔记')}</b><small>${escHtml(item.author || '乐生活用户')} · ${new Date(item.viewedAt).toLocaleString('zh-CN')}</small></span>
        <i>›</i>
      </button>
    `).join('') : '<div class="home-feature-empty">还没有浏览记录。打开一篇笔记后会在这里留下记录。</div>';
    openHomeFeature('浏览记录', `<div class="home-history-list">${items}</div>`);
  } catch(error){
    console.warn('浏览记录读取失败:', error.message);
    openHomeFeature('浏览记录', '<div class="home-feature-empty">浏览记录暂时无法读取，请稍后重试。</div>');
  }
}
function closeBrowsingHistory(){
  document.getElementById('browsingModal').style.display = 'none';
}

/* ---- page navigation ---- */
function renderWeekFeed(){
  const weekFeed = document.getElementById('weekFeed');
  const weekPosts = orderedFeedPosts(posts.filter(p => (p.visibility || 'public') === 'public' && postMatchesQuickLink(p, '本周末活动')));
  weekFeed.innerHTML = weekPosts.length > 0 
    ? `<div class="feed">${weekPosts.map(p=>`
        <div class="card" onclick="openPost(${p.id})">
          <div class="card-media">
            ${p.image ? `<img src="${p.image}" alt="">` : '<div style="width:100%;height:100%;background:var(--bg-alt);"></div>'}
            ${cardCategoryTag(p.category, p.subcategory)}
            ${mediaWatermarkHtml(p.author)}
          </div>
          <div class="card-body">
            <div class="card-title">${p.title}</div>
            <div class="card-meta">
              <div class="author">
                ${avatarHomeLinkHtml(p.user_id, p.author, 20)}
                <span class="author-name" onclick="event.stopPropagation();openUserPublicPage('${String(p.user_id || '').replace(/'/g, '')}','${String(p.author || '乐生活用户').replace(/'/g, '')}')" style="display:flex;align-items:center;gap:5px;min-width:0;cursor:pointer;">${authorNameHtml(p.author, p.user_id)}</span>
              </div>
              <div class="stat-row"><span>${p.liked?'♥':'♡'} ${p.likes}</span></div>
            </div>
          </div>
        </div>
      `).join('')}</div>`
    : `<div class="empty-state"><span style="display:block;margin:0 auto 12px;width:40px;height:40px;color:var(--ink-faint);">${uiIcon('calendar',40)}</span><p>本周还没有活动</p></div>`;
}

/* ================= 省钱(Deals)页面 ================= */
/* 静态站可用版：本地精选 + 商家官网跳转；后续可由 Supabase Edge Function 每日写入同结构数据 */
let dealsFilter = 'today';
const DEAL_RETAILERS = [
  { key:'today', name:'今日最新' },
  { key:'costco', name:'Costco', url:'https://www.costco.com/CatalogSearch?dept=All&keyword=' },
  { key:'samsclub', name:"Sam's Club", url:'https://www.samsclub.com/s/' },
  { key:'walmart', name:'Walmart', url:'https://www.walmart.com/shop/deals/flash-deals' },
  { key:'target', name:'Target', url:'https://www.target.com/weekly-ad?promo' },
  { key:'aldi', name:'ALDI', url:'https://info.aldi.us/weekly-specials/weekly-ads' },
  { key:'99ranch', name:'99大华', url:'https://www.99ranch.com/' },
  { key:'gw', name:'GW超市', url:'https://www.gw-supermarket.com/' },
  { key:'bestbuy', name:'Best Buy', url:'https://www.bestbuy.com/site/misc/deal-of-the-day/pcmcat248000050016.c?id=pcmcat248000050016' },
  { key:'tjmaxx', name:'TJ Maxx', url:'https://tjmaxx.tjx.com/store/shop/?_dyncharset=utf-8&initSubmit=true&Ntt=' },
  { key:'macys', name:"Macy's", url:'https://www.macys.com/shop/featured/' },
  { key:'clearance', name:'清仓' }
];
const DEAL_SEARCH_TARGETS = [
  { key:'walmart', name:'Walmart', type:'限时优惠', url:'https://www.walmart.com/shop/deals/flash-deals' },
  { key:'target', name:'Target', type:'每周优惠', url:'https://www.target.com/weekly-ad?promo' },
  { key:'costco', name:'Costco', type:'会员仓储', url:'https://www.costco.com/CatalogSearch?dept=All&keyword=' },
  { key:'samsclub', name:"Sam's Club", type:'会员仓储', url:'https://www.samsclub.com/s/' },
  { key:'bestbuy', name:'Best Buy', type:'今日特惠', url:'https://www.bestbuy.com/site/misc/deal-of-the-day/pcmcat248000050016.c?id=pcmcat248000050016' },
  { key:'tjmaxx', name:'TJ Maxx', type:'家居 / 清仓', url:'https://tjmaxx.tjx.com/store/shop/?_dyncharset=utf-8&initSubmit=true&Ntt=' },
  { key:'macys', name:"Macy's", type:'百货', url:'https://www.macys.com/shop/featured/' },
  { key:'google', name:'Google Shopping', type:'全网比价', url:'https://www.google.com/search?tbm=shop&q=' }
];
const DEAL_QUERY_TRANSLATIONS = [
  ['鸡胸肉', 'chicken breast'],
  ['生活纸品', 'paper towels'],
  ['厨房用品', 'kitchenware'],
  ['小家电', 'small appliances'],
  ['大屏电视', 'tv'],
  ['食用油', 'cooking oil'],
  ['大米', 'rice'],
  ['白米', 'rice'],
  ['米', 'rice'],
  ['鸡蛋', 'eggs'],
  ['蛋', 'eggs'],
  ['牛奶', 'milk'],
  ['鸡肉', 'chicken'],
  ['牛肉', 'beef'],
  ['猪肉', 'pork'],
  ['海鲜', 'seafood'],
  ['蔬果', 'produce'],
  ['水果', 'fruit'],
  ['蔬菜', 'vegetables'],
  ['香蕉', 'banana'],
  ['面粉', 'flour'],
  ['纸巾', 'paper towels'],
  ['纸品', 'paper towels'],
  ['洗衣液', 'laundry detergent'],
  ['清洁', 'cleaning supplies'],
  ['家居', 'home goods'],
  ['床品', 'bedding'],
  ['行李箱', 'luggage'],
  ['玩具', 'toys'],
  ['电视', 'tv'],
  ['耳机', 'headphones'],
  ['电脑', 'laptop'],
  ['笔记本', 'laptop'],
  ['火锅', 'hot pot'],
  ['清仓', 'clearance'],
  ['折扣', 'deals'],
  ['优惠', 'deals']
];
const DEALS = [
  { id:1, dealType:'product', store:'costco', storeName:'Costco', location:'Torrance / Alhambra', name:'Kirkland 生活纸品家庭装', rating:5, origPrice:24.99, curPrice:18.99, percentOff:24, inStock:true, hot:true, tags:['costco','纸品','家庭装'], url:'https://www.costco.com/CatalogSearch?dept=All&keyword=Kirkland%20paper' },
  { id:2, dealType:'product', store:'costco', storeName:'Costco', location:'Cypress / Monterey Park', name:'LG / Samsung 大屏电视', rating:5, origPrice:1499, curPrice:1099, percentOff:27, inStock:true, hot:true, tags:['costco','电视','电器','bestbuy'], url:'https://www.costco.com/CatalogSearch?dept=All&keyword=oled%20tv' },
  { id:3, dealType:'product', store:'samsclub', storeName:"Sam's Club", location:'Hawthorne / Cerritos', name:'冷冻鸡胸肉 10lb', rating:4, origPrice:29.99, curPrice:22.99, percentOff:23, inStock:true, tags:['samsclub','生鲜','鸡肉'], url:'https://www.samsclub.com/s/chicken%20breast' },
  { id:4, dealType:'daily_deals', store:'walmart', storeName:'Walmart', location:'全美门店 / 网购', name:'Walmart 限时优惠', rating:4, discountText:'限时优惠', percentOff:0, dealNote:'来自 Walmart Flash Deals，具体商品名、价格和库存以官网为准', inStock:true, hot:true, tags:['walmart','日用品','清洁','flash deals'], url:'https://www.walmart.com/shop/deals/flash-deals' },
  { id:5, dealType:'weekly_ad', store:'target', storeName:'Target', location:'本周广告', name:'Target 本周优惠', rating:4, discountText:'周广告', percentOff:0, dealNote:'来自 Target Weekly Ad，每周一更新，具体价格以官网和门店为准', inStock:true, hot:true, tags:['target','weekly ad','Target Circle'], url:'https://www.target.com/weekly-ad?promo' },
  { id:6, dealType:'weekly_ad', store:'aldi', storeName:'ALDI', location:'本周广告', name:'ALDI 本周蔬果、肉类和早餐食品', rating:4, discountText:'周广告价', percentOff:0, dealNote:'食品价格以当周广告和门店库存为准', inStock:true, hot:true, tags:['aldi','超市','weekly ad'], url:'https://info.aldi.us/weekly-specials/weekly-ads' },
  { id:7, dealType:'weekly_ad', store:'99ranch', storeName:'99 Ranch Market', location:'Arcadia / Gardena / Irvine', name:'亚洲蔬果、海鲜与火锅食材', rating:4, discountText:'本周特价', percentOff:23, dealNote:'适合看海鲜、火锅食材、亚洲蔬果，价格按门店广告核对', inStock:true, tags:['99大华','99ranch','亚洲超市','海鲜'], url:'https://www.99ranch.com/' },
  { id:8, dealType:'weekly_ad', store:'gw', storeName:'GW Supermarket', location:'Rowland Heights / San Gabriel', name:'华人超市周末生鲜组合', rating:4, discountText:'周末特价', percentOff:22, dealNote:'生鲜、肉类、蔬果和米面粮油，建议到店核对', inStock:true, tags:['gw','华人超市','生鲜'], url:'https://www.gw-supermarket.com/' },
  { id:9, dealType:'daily_deals', store:'bestbuy', storeName:'Best Buy', location:'网购 / 门店自取', name:'Best Buy 今日特惠', rating:5, discountText:'今日特惠', percentOff:0, inStock:true, hot:true, tags:['bestbuy','耳机','电器','deal of the day'], dealNote:'来自 Best Buy Deal of the Day，只有抓到具体商品时才显示价格', url:'https://www.bestbuy.com/site/misc/deal-of-the-day/pcmcat248000050016.c?id=pcmcat248000050016' },
  { id:11, dealType:'category', store:'tjmaxx', storeName:'TJ Maxx', location:'门店 / 网购', name:'厨房用品、行李箱、家居清仓', rating:4, discountText:'低至 3 折', percentOff:70, dealNote:'适合看锅具、餐具、行李箱、收纳和家居装饰，不代表单一商品价格', inStock:true, tags:['tjmaxx','家居','行李箱','clearance'], url:'https://tjmaxx.tjx.com/store/shop/clearance/_/N-3951437597' },
  { id:12, dealType:'category', store:'macys', storeName:"Macy's", location:'网购 / 门店', name:'床品、锅具、小家电 Sale', rating:4, discountText:'最高 6 折', percentOff:60, dealNote:'百货类促销集合，需进入官网核对具体品牌和型号', inStock:true, tags:['macys','百货','床品','小家电'], url:'https://www.macys.com/shop/sale' },
  { id:13, dealType:'category', store:'clearance', storeName:'Home Depot', location:'Gardena / Torrance', name:'工具、电池、收纳清仓', rating:4, discountText:'最高 4 折', percentOff:40, dealNote:'工具、电池、收纳和季节品类清仓，门店库存差异较大', inStock:true, tags:['home depot','工具','clearance'], url:'https://www.homedepot.com/SpecialBuy/SpecialBuyOfTheDay' },
];
const FOOD_LOW_PRICES = [
  { id:'eggs', name:'鸡蛋', price:'$2.99', unit:'12枚', store:'ALDI / Walmart', note:'适合每周采购，价格以门店和当日库存为准', query:'eggs' },
  { id:'milk', name:'牛奶', price:'$3.49', unit:'1 gallon', store:'Walmart / Target', note:'全脂或 2% 牛奶常见低价区间', query:'milk gallon' },
  { id:'rice', name:'大米', price:'$18.99', unit:'25 lb', store:'99大华 / GW超市', note:'适合华人家庭囤货，需核对品牌和重量', query:'rice 25 lb' },
  { id:'chicken', name:'鸡胸肉', price:'$2.29', unit:'每磅', store:"Sam's Club / ALDI", note:'冷冻大包装通常更划算', query:'chicken breast' },
  { id:'beef', name:'牛肉', price:'$5.99', unit:'每磅', store:'Costco / 99大华', note:'适合火锅、炖肉或家庭分装', query:'beef' },
  { id:'oil', name:'食用油', price:'$9.99', unit:'48 oz', store:'Walmart / Costco', note:'看单位容量比只看瓶价更准确', query:'cooking oil' },
  { id:'banana', name:'香蕉', price:'$0.49', unit:'每磅', store:'ALDI / Walmart', note:'水果类价格波动小，适合日常参考', query:'banana' },
  { id:'flour', name:'面粉', price:'$3.29', unit:'5 lb', store:'Target / Walmart', note:'烘焙和家用基础食品', query:'flour 5 lb' }
];
let dealLikes = {};
let unifiedDealRows = [];
let unifiedDealFavorites = {};
let dailyPriceCacheRows = [];
let dailyPriceCacheLoaded = false;
let dailyPriceCacheLoading = false;

function renderDealsPage(){
  refreshDealsIfNeeded();
  updateDealReviewButton();
  loadDailyPriceCache();
  renderDealsTabs();
  renderHotPicks();
  renderFoodLowPrices();
  renderDealsList();
}
function renderDealsTabs(){
  const row = document.getElementById('dealsBanner');
  if(!row) return;
  row.innerHTML = DEAL_RETAILERS.map(r => `
    <button class="deals-tab ${dealsFilter===r.key?'active':''}" data-store="${r.key}" onclick="setDealsFilter('${r.key}')">${r.name}</button>
  `).join('');
}
function setDealsFilter(store){
  dealsFilter = store;
  document.querySelectorAll('.deals-tab').forEach(b => b.classList.toggle('active', b.dataset.store === store));
  renderHotPicks();
  renderFoodLowPrices();
  renderDealsList();
}
function todayDealKey(){
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function refreshDealsIfNeeded(){
  const key = todayDealKey();
  const last = localStorage.getItem('leshenghuo_deals_refresh_date');
  if(last !== key) localStorage.setItem('leshenghuo_deals_refresh_date', key);
  const time = document.getElementById('dealsUpdateTime');
  if(time) time.textContent = `自动刷新：${new Date().toLocaleDateString('zh-CN')} 06:00`;
}
function normalizeDealSearchQuery(raw){
  let q = (raw || '').trim();
  if(!q) return 'grocery deals';
  DEAL_QUERY_TRANSLATIONS.forEach(([cn, en]) => {
    q = q.replaceAll(cn, ` ${en} `);
  });
  q = q.replace(/[，。、“”‘’]/g, ' ').replace(/\s+/g, ' ').trim();
  if(/[\u4e00-\u9fff]/.test(q)) return 'deals';
  return q || 'deals';
}
function hideDealsSearchPanel(){
  const panel = document.getElementById('dealsSearchPanel');
  if(panel) panel.style.display = 'none';
}
function dealSearchTerms(raw, query){
  const terms = [raw, query, ...String(query || '').split(' ')]
    .map(t => String(t || '').trim())
    .filter(t => t.length >= 2 && t !== 'deals');
  return [...new Set(terms)].slice(0, 6);
}
async function loadDailyPriceCache(force=false){
  if(dailyPriceCacheLoading || (dailyPriceCacheLoaded && !force)) return dailyPriceCacheRows;
  dailyPriceCacheLoading = true;
  const select = 'id,deal_date,retailer_key,retailer_name,category,product_name,product_name_cn,original_price,current_price,unit,percent_off,save_amount,location,source_url,is_hot,is_food_low_price,stock_status,price_note,ai_summary_cn,source_type,review_status,display_status,admin_note,verified_at,updated_at,expires_at';
  try {
    const url = `${SUPABASE_URL}/rest/v1/deal_current_prices?select=${select}&order=is_food_low_price.desc&order=is_hot.desc&order=updated_at.desc&limit=80`;
    const res = await authedFetch(url, { method:'GET' });
    if(!res.ok) throw new Error(await res.text());
    dailyPriceCacheRows = await res.json();
    dailyPriceCacheLoaded = true;
    renderHotPicks();
    renderFoodLowPrices();
    renderDealsList();
  } catch(e){
    console.warn('每日价格缓存读取失败:', e.message);
  } finally {
    dailyPriceCacheLoading = false;
  }
  return dailyPriceCacheRows;
}
function officialDealFallbackUrl(d){
  const key = String(d.retailer_key || '').toLowerCase();
  const type = String(d.source_type || '').toLowerCase();
  if(key === 'bestbuy') return 'https://www.bestbuy.com/site/misc/deal-of-the-day/pcmcat248000050016.c?id=pcmcat248000050016';
  if(key === 'walmart' && type !== 'product_page') return 'https://www.walmart.com/shop/deals/flash-deals';
  if(key === 'aldi') return 'https://info.aldi.us/weekly-specials/weekly-ads';
  if(key === 'target' && type !== 'product_page') return 'https://www.target.com/weekly-ad?promo';
  return '';
}
function dealSourceUrl(d){
  return String((d && d.source_url) || officialDealFallbackUrl(d || {}) || '').trim();
}
function cachedPriceDeals(){
  return dailyPriceCacheRows.map((d, i) => ({
    id: `cache_${d.id || i}`,
    cacheId: d.id,
    dealType: d.source_type === 'weekly_ad_page' ? 'weekly_ad' : (d.source_type === 'daily_deals_page' ? 'daily_deals' : 'product'),
    store: d.retailer_key || 'cache',
    storeName: d.retailer_name || d.retailer_key || '商家',
    location: d.location || '网购 / 门店',
    name: d.product_name_cn || d.product_name || '未命名商品',
    rating: d.is_hot ? 5 : 4,
    origPrice: Number(d.original_price || 0),
    curPrice: Number(d.current_price || 0),
    percentOff: Number(d.percent_off || 0),
    inStock: d.stock_status !== 'out_of_stock',
    hot: d.is_hot === true,
    tags: [d.retailer_key, d.retailer_name, d.category, d.product_name, d.product_name_cn].filter(Boolean),
    url: dealSourceUrl(d),
    sourceType: d.source_type || 'daily_cache',
    reviewStatus: d.review_status || 'unreviewed',
    displayStatus: d.display_status || 'visible',
    verifiedAt: d.verified_at || '',
    expiresAt: d.expires_at || '',
    unit: d.unit || '',
    note: d.ai_summary_cn || d.price_note || d.admin_note || '每日价格缓存，价格以官网最终显示为准',
    updatedAt: d.updated_at || d.deal_date
  }));
}
function moneyText(v){
  if(v === null || v === undefined || v === '') return '';
  const n = Number(v);
  return Number.isFinite(n) ? `$${n.toFixed(n % 1 === 0 ? 0 : 2)}` : String(v);
}
function dealDateText(v){
  if(!v) return '今日';
  const d = new Date(v);
  if(Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleDateString('zh-CN', { month:'numeric', day:'numeric' });
}
function dealTimeValue(v){
  const t = v ? new Date(v).getTime() : 0;
  return Number.isFinite(t) ? t : 0;
}
function dealIsExpired(row){
  return row && row.expires_at ? dealTimeValue(row.expires_at) < Date.now() : false;
}
function dealQualityScore(d){
  let score = 0;
  if(d.reviewStatus === 'approved') score += 1000;
  if(d.hot === true) score += 500;
  if(Number(d.curPrice) > 0) score += 220;
  if(d.reviewStatus === 'needs_review') score -= 260;
  if(d.displayStatus === 'hidden') score -= 1000;
  if(d.expiresAt && dealTimeValue(d.expiresAt) < Date.now()) score -= 180;
  score += Math.min(120, Math.max(0, d.percentOff || 0));
  score += Math.min(160, dealTimeValue(d.updatedAt) / 100000000000);
  return score;
}
function dealUnitPriceText(price, unit, name=''){
  const n = Number(price);
  if(!Number.isFinite(n) || n <= 0) return '';
  const raw = `${unit || ''} ${name || ''}`.toLowerCase();
  const match = raw.match(/(\d+(?:\.\d+)?)\s*(lb|磅|枚|ct|count|gallon|gal|加仑)/);
  if(!match) return '';
  const qty = Number(match[1]);
  if(!Number.isFinite(qty) || qty <= 0) return '';
  const labelMap = { lb:'磅', '磅':'磅', '枚':'枚', ct:'枚', count:'枚', gallon:'加仑', gal:'加仑', '加仑':'加仑' };
  return `约 $${(n / qty).toFixed(2)} / ${labelMap[match[2]] || match[2]}`;
}
function dealSourceButtonText(sourceType){
  return '官网核对';
}
function dealSourceLabel(sourceType){
  const map = {
    manual: '人工维护',
    user_report: '用户爆料',
    merchant_submit: '商家提交',
    bestbuy_api: '官方 API',
    json_feed: '联盟 Feed',
    manual_json: '人工 Feed',
    daily_cache: '每日缓存',
    official_api: '官方 API',
    affiliate_feed: '联盟 Feed',
    public_page: '公开页面',
    experimental_scraper: '实验抓取',
    fixed_product_page: '固定商品页',
    weekly_ad_page: '官方周广告',
    daily_deals_page: '官方限时优惠',
    target_scraper_config: '配置抓取',
    playwright_config: '浏览器抓取',
    costco_product_tracker: 'Costco 商品页'
  };
  return map[sourceType] || '真实来源';
}
function updateDealReviewButton(){
  const actionRow = document.querySelector('.deals-action-row');
  if(actionRow){
    const duplicateMerchantBtns = Array.from(actionRow.querySelectorAll('button'))
      .filter(btn => btn.id === 'merchantReviewBtn' || btn.textContent.trim() === '商家审核');
    duplicateMerchantBtns.forEach((btn, i) => {
      if(i === 0){
        btn.id = 'merchantReviewBtn';
        btn.onclick = openMerchantApplicationReviewQueue;
      } else {
        btn.remove();
      }
    });
  }
  const btn = document.getElementById('dealReviewBtn');
  if(btn) btn.style.display = isDealAdmin ? '' : 'none';
  const merchantBtn = document.getElementById('merchantReviewBtn');
  if(merchantBtn) merchantBtn.style.display = isDealAdmin ? '' : 'none';
  const adminBtn = document.getElementById('siteAdminBtn');
  if(adminBtn) adminBtn.style.display = isDealAdmin ? '' : 'none';
  const profileAdminBtn = document.getElementById('profileAdminBtn');
  if(profileAdminBtn) profileAdminBtn.style.display = isDealAdmin ? '' : 'none';
}
function friendlyDealReviewError(message){
  const raw = String(message || '');
  const lower = raw.toLowerCase();
  if(lower.includes('permission denied') || lower.includes('row-level security') || lower.includes('violates row-level security')){
    return '权限不足：请确认已执行 3.70 管理审核 SQL，并把当前账号加入 deal_admins。';
  }
  if(lower.includes('relation') && lower.includes('does not exist')){
    return '数据库表缺失：请先执行 3.60 和 3.70 的 Supabase SQL。';
  }
  if(lower.includes('duplicate') || lower.includes('unique')){
    return '这条优惠可能已经发布过，请刷新审核池后再确认。';
  }
  if(lower.includes('jwt') || lower.includes('401')){
    return '登录状态已过期，请重新登录管理员账号。';
  }
  return '操作失败，请稍后重试或检查 Supabase 权限设置。';
}
async function checkDealAdmin(){
  if(!(session && session.user)){
    isDealAdmin = false;
    updateDealReviewButton();
    return false;
  }
  try {
    if(!adminAccessApi) throw new Error('管理员权限接口未初始化');
    isDealAdmin = await adminAccessApi.isAdmin(session.user.id);
  } catch(e){
    isDealAdmin = false;
    console.warn('优惠管理员检查失败:', e.message);
  }
  updateDealReviewButton();
  return isDealAdmin;
}
async function fetchUnifiedDealResults(raw, query){
  await loadDailyPriceCache();
  const terms = dealSearchTerms(raw, query);
  const cachedRows = dailyPriceCacheRows.filter(d => {
    const text = `${d.product_name || ''} ${d.product_name_cn || ''} ${d.category || ''} ${d.retailer_name || ''} ${d.retailer_key || ''}`.toLowerCase();
    return terms.length ? terms.some(t => text.includes(String(t).toLowerCase())) : true;
  });
  if(cachedRows.length){
    return cachedRows.sort((a,b) =>
      (b.is_food_low_price === true) - (a.is_food_low_price === true) ||
      (b.is_hot === true) - (a.is_hot === true) ||
      Number(a.current_price || 999999) - Number(b.current_price || 999999)
    ).slice(0, 20);
  }
  return [];
}
function unifiedDealCardHtml(d, i){
  const isLanding = ['weekly_ad_page','daily_deals_page'].includes(d.source_type);
  const price = isLanding ? (d.source_type === 'weekly_ad_page' ? '本周优惠' : '限时优惠') : (moneyText(d.current_price) || d.price_note || '查看详情');
  const orig = moneyText(d.original_price);
  const save = isLanding ? '官方入口' : (d.percent_off ? `省 ${d.percent_off}%` : (d.save_amount ? `省 ${moneyText(d.save_amount)}` : (d.is_food_low_price ? '食品低价' : '已收录')));
  const stock = d.stock_status === 'in_stock' ? '有货' : (d.stock_status === 'out_of_stock' ? '缺货' : '需核对');
  const sourceLabel = dealSourceButtonText(d.source_type);
  const sourceUrl = dealSourceUrl(d);
  return `
    <div class="deals-result-card">
      <div class="deals-result-top">
        <div class="deals-result-name">
          ${i + 1}. ${d.product_name_cn || d.product_name || '未命名商品'}
          <span>${d.product_name || ''}</span>
        </div>
        <div class="deals-result-price">
          <b>${price}</b>
          <span>${d.unit || '单位待核对'}</span>
        </div>
      </div>
      <div class="deals-result-meta">
        <div><b>商家</b>${d.retailer_name || d.retailer_key || '未知'}</div>
        <div><b>地区</b>${d.location || '网购 / 门店'}</div>
        <div><b>状态</b>${stock}</div>
        <div><b>更新</b>${dealDateText(d.updated_at || d.deal_date)}</div>
      </div>
      <div class="deals-result-note">
        ${orig ? `原价 ${orig}，` : ''}${save}<span class="deal-source-pill">${dealSourceLabel(d.source_type)}</span>。${d.ai_summary_cn || d.price_note || '价格来自数据库记录，请进入来源链接最终核对。'}
      </div>
      <div class="deals-result-actions">
        <button onclick="copyUnifiedDeal('${String(d.id).replace(/'/g, '')}')">复制</button>
        <button class="${unifiedDealFavorites[d.id] ? 'liked' : ''}" onclick="favoriteUnifiedDeal('${String(d.id).replace(/'/g, '')}')">${unifiedDealFavorites[d.id] ? '已收藏' : '收藏'}</button>
        <button class="primary" onclick="openDealSource(${dealUrlArg(sourceUrl)})">${sourceLabel}</button>
      </div>
    </div>
  `;
}
function renderDealPanelShell(title, sub, body){
  const panel = document.getElementById('dealsSearchPanel');
  if(!panel) return;
  panel.innerHTML = `
    <div class="deals-search-panel-head">
      <div class="deals-search-panel-title">${title}<span>${sub}</span></div>
      <button class="deals-search-panel-close" onclick="hideDealsSearchPanel()">×</button>
    </div>
    ${body}
  `;
  panel.style.display = 'block';
}
function openDealReportForm(type){
  const isMerchant = type === 'merchant_submit';
  renderDealPanelShell(
    isMerchant ? '商家提交优惠' : '用户爆料',
    isMerchant ? '商家提交后进入审核，审核通过才展示到省钱页。' : '请填写你看到的真实优惠，乐生活核对后发布。',
    `
      <div class="deal-form-grid">
        <div class="deal-form-field">
          <label>商家名称</label>
          <input id="dealReportRetailer" placeholder="例如 Walmart / ALDI">
        </div>
        <div class="deal-form-field">
          <label>分类</label>
          <select id="dealReportCategory">
            <option value="food">食品刚需</option>
            <option value="household">日用品</option>
            <option value="electronics">电器数码</option>
            <option value="home">家居百货</option>
            <option value="clearance">清仓折扣</option>
          </select>
        </div>
        <div class="deal-form-field full">
          <label>商品名称</label>
          <input id="dealReportProduct" placeholder="例如 Great Value Long Grain Rice 20 lb">
        </div>
        <div class="deal-form-field">
          <label>中文名称</label>
          <input id="dealReportProductCn" placeholder="例如 长粒米 20磅">
        </div>
        <div class="deal-form-field">
          <label>现价</label>
          <input id="dealReportPrice" type="number" step="0.01" placeholder="12.98">
        </div>
        <div class="deal-form-field">
          <label>原价（可选）</label>
          <input id="dealReportOrigPrice" type="number" step="0.01" placeholder="15.98">
        </div>
        <div class="deal-form-field">
          <label>单位</label>
          <input id="dealReportUnit" placeholder="20 lb / 每磅 / 12枚">
        </div>
        <div class="deal-form-field">
          <label>地区/门店</label>
          <input id="dealReportLocation" placeholder="网购 / 门店 / LA周边">
        </div>
        <div class="deal-form-field full">
          <label>来源链接</label>
          <input id="dealReportUrl" placeholder="官网商品页、周广告或可核对链接">
        </div>
        <div class="deal-form-field full">
          <label>补充说明</label>
          <textarea id="dealReportNote" placeholder="例如会员价、限时、门店库存差异、优惠码等"></textarea>
        </div>
      </div>
      <div class="deal-form-actions">
        <button onclick="hideDealsSearchPanel()">取消</button>
        <button class="primary" onclick="submitDealReport('${type}')">提交审核</button>
      </div>
    `
  );
}
async function submitDealReport(type){
  const retailer = document.getElementById('dealReportRetailer')?.value.trim();
  const product = document.getElementById('dealReportProduct')?.value.trim();
  const price = document.getElementById('dealReportPrice')?.value;
  const url = document.getElementById('dealReportUrl')?.value.trim();
  if(!retailer || !product || !price || !url){ showToast('请填写商家、商品、现价和来源链接'); return; }
  const payload = {
    report_type: type,
    status: 'pending',
    user_id: session && session.user ? session.user.id : null,
    user_name: currentUser && currentUser.name ? currentUser.name : null,
    merchant_id: type === 'merchant_submit' && currentMerchant ? currentMerchant.id : null,
    retailer_key: retailer.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 30) || null,
    retailer_name: retailer,
    category: document.getElementById('dealReportCategory')?.value || 'general',
    product_name: product,
    product_name_cn: document.getElementById('dealReportProductCn')?.value.trim() || null,
    original_price: document.getElementById('dealReportOrigPrice')?.value || null,
    current_price: price,
    unit: document.getElementById('dealReportUnit')?.value.trim() || null,
    location: document.getElementById('dealReportLocation')?.value.trim() || '网购 / 门店',
    source_url: url,
    price_note: document.getElementById('dealReportNote')?.value.trim() || '提交后待乐生活核对',
    submit_note: type === 'merchant_submit' ? '商家后台提交优惠' : '用户爆料'
  };
  try {
    const res = await authedFetch(`${SUPABASE_URL}/rest/v1/deal_reports`, {
      method:'POST',
      headers:{'Prefer':'return=minimal'},
      body: JSON.stringify(payload)
    });
    if(!res.ok) throw new Error(await res.text());
    showToast('已提交，审核后展示');
    hideDealsSearchPanel();
  } catch(e){
    console.warn('提交优惠失败:', e.message);
    showToast('提交失败，请确认数据库升级 SQL 已执行');
  }
}
async function openDealRankings(){
  renderDealPanelShell('实时热榜', '按精选标记、食品低价与近期优惠排序。', '<div class="deals-empty-panel">正在读取热榜...</div>');
  try {
    const select = 'id,deal_date,retailer_key,retailer_name,category,product_name,product_name_cn,original_price,current_price,unit,percent_off,save_amount,location,source_url,is_hot,is_food_low_price,stock_status,price_note,ai_summary_cn,source_type,updated_at,click_count,favorite_count,copy_count,hot_score';
    const res = await authedFetch(`${SUPABASE_URL}/rest/v1/deal_rankings?select=${select}&order=hot_score.desc&limit=20`, { method:'GET' });
    if(!res.ok) throw new Error(await res.text());
    const rows = await res.json();
    renderUnifiedDealPanel('实时热榜', 'hot ranking', rows, null);
  } catch(e){
    console.warn('读取热榜失败:', e.message);
    renderDealPanelShell('实时热榜', '请先执行 3.60 数据库升级 SQL。', '<div class="deals-empty-panel">热榜暂时不可用。</div>');
  }
}
function reviewReportCardHtml(r, i){
  const price = moneyText(r.current_price) || '待核对';
  const orig = moneyText(r.original_price);
  const typeLabel = r.report_type === 'merchant_submit' ? '商家提交' : '用户爆料';
  const created = dealDateText(r.created_at);
  const busy = !!dealReviewBusy[r.id];
  const statusLabel = busy ? '处理中' : (r.status || 'pending');
  return `
    <div class="deals-result-card">
      <div class="deals-result-top">
        <div class="deals-result-name">
          ${i + 1}. ${r.product_name_cn || r.product_name || '未命名商品'}
          <span>${r.product_name || ''}</span>
        </div>
        <div class="deals-result-price">
          <b>${price}</b>
          <span>${r.unit || '单位待核对'}</span>
        </div>
      </div>
      <div class="deals-result-meta">
        <div><b>来源</b>${typeLabel}</div>
        <div><b>商家</b>${r.retailer_name || '未知'}</div>
        <div><b>分类</b>${r.category || 'general'}</div>
        <div><b>提交</b>${created}</div>
        <div><b>状态</b>${statusLabel}</div>
      </div>
      <div class="deals-result-note">
        ${orig ? `原价 ${orig}，` : ''}${r.price_note || r.submit_note || '待人工核对'}${r.location ? `。地区：${r.location}` : ''}
      </div>
      <div class="deals-result-actions">
        <button onclick="openDealSource('${String(r.source_url || '').replace(/'/g, "\\'")}')">官网核对</button>
        <button class="primary" ${busy ? 'disabled' : ''} onclick="approveDealReport('${String(r.id).replace(/'/g, '')}')">${busy ? '发布中...' : '通过并发布'}</button>
        <button class="danger" ${busy ? 'disabled' : ''} onclick="rejectDealReport('${String(r.id).replace(/'/g, '')}')">${busy ? '处理中...' : '驳回'}</button>
      </div>
    </div>
  `;
}
async function openDealReviewQueue(){
  if(!(session && session.user)){ showToast('请先登录'); openAuth(); return; }
  const ok = isDealAdmin || await checkDealAdmin();
  if(!ok){
    renderDealPanelShell(
      '优惠审核',
      '当前账号没有审核权限。',
      `<div class="deals-empty-panel">请先把当前 user_id 加入 Supabase 的 deal_admins 表。<br>当前 user_id：${session.user.id}</div>`
    );
    return;
  }
  renderDealPanelShell('优惠审核', '读取用户爆料和商家提交的待审核优惠。', '<div class="deals-empty-panel">正在读取审核池...</div>');
  try {
    const select = 'id,report_type,status,user_id,user_name,merchant_id,retailer_key,retailer_name,category,product_name,product_name_cn,original_price,current_price,unit,location,source_url,image_url,price_note,submit_note,ai_summary_cn,created_at';
    const res = await authedFetch(`${SUPABASE_URL}/rest/v1/deal_reports?select=${select}&status=eq.pending&order=created_at.desc&limit=50`, { method:'GET' });
    if(!res.ok) throw new Error(await res.text());
    dealReviewRows = await res.json();
    dealReviewBusy = {};
    renderDealPanelShell(
      '优惠审核',
      `待审核 ${dealReviewRows.length} 条。价格只按提交值发布，AI 不生成价格。`,
      dealReviewRows.length
        ? `<div class="deals-result-list">${dealReviewRows.map(reviewReportCardHtml).join('')}</div>`
        : '<div class="deals-empty-panel">目前没有待审核优惠。可以先用“用户爆料”提交一条测试，再回到这里审核。</div>'
    );
  } catch(e){
    console.warn('读取优惠审核池失败:', e.message);
    renderDealPanelShell('优惠审核', '请确认 3.70 管理审核 SQL 已执行。', `<div class="deals-empty-panel">${friendlyDealReviewError(e.message)}</div>`);
  }
}

/* ================= 管理后台：用户 / 帖子 / 评论 ================= */
let adminTab = 'users';
let adminUsers = [];
let adminPosts = [];
let adminPostSubcategoryFilter = '全部';
let adminComments = [];
let adminBanned = [];
let adminDealPrices = [];
let adminFeedback = [];
let adminFeedbackAttachmentMap = new Map();
let activeAdminFeedbackReply = null;
let adminFeedbackStatusFilter = 'pending';
let adminContentReports = [];
let adminReportFilter = 'pending';
let adminMarketplaceReports = [];
let adminDealOpsReady = true;
let adminEditingDealId = '';
let adminActiveUser = null;

function adminHasAccess(silent=false){
  if(session && session.user && isDealAdmin) return true;
  if(!silent) showToast('当前账号没有管理员权限');
  return false;
}
function renderAdminStatus(title, detail=''){
  const stats = document.getElementById('adminStats');
  if(stats) stats.innerHTML = adminStatsHtml();
  const body = document.getElementById('adminBody');
  if(!body) return;
  body.innerHTML = `<div class="admin-empty">${escHtml(title)}${detail ? `<br>${escHtml(detail)}` : ''}</div>`;
}
function adminTimeText(v){
  if(!v) return '';
  try { return new Date(v).toLocaleString('zh-CN', { month:'numeric', day:'numeric', hour:'2-digit', minute:'2-digit' }); }
  catch(e){ return String(v); }
}
function switchAdminTab(tab){
  adminTab = tab;
  document.querySelectorAll('.admin-tab').forEach(btn => btn.classList.toggle('active', btn.dataset.adminTab === tab));
  const input = document.getElementById('adminSearchInput');
  if(input) input.placeholder = tab === 'deals' ? '搜索商家、商品、来源、状态...' : '搜索用户、帖子、评论...';
  if(tab === 'deals' && !adminDealPrices.length){
    loadAdminDealPrices(true).then(() => {
      if(adminTab === 'deals') renderAdminPanel();
    });
  }
  if(tab === 'feedback' && !adminFeedback.length){ loadAdminFeedback().then(() => { if(adminTab === 'feedback') renderAdminPanel(); }); }
  if(tab === 'reports' && !adminContentReports.length){ loadAdminContentReports().then(() => { if(adminTab === 'reports') renderAdminPanel(); }); }
  if(tab === 'marketplace' && !adminMarketplaceReports.length){ loadAdminMarketplaceReports().then(() => { if(adminTab === 'marketplace') renderAdminPanel(); }); }
  renderAdminPanel();
}
async function loadAdminCenter(force){
  if(!adminHasAccess(true)){
    renderAdminStatus('当前账号没有管理员权限。', '请先把当前 user_id 加入 deal_admins 表。');
    return;
  }
  const body = document.getElementById('adminBody');
  if(body) body.innerHTML = '<div class="admin-empty">正在读取管理数据...</div>';
  try {
    if(!adminCenterApi) throw new Error('管理员中心接口未初始化');
    const snapshot = await adminCenterApi.readSnapshot();
    if(snapshot.ok){
      const snap = snapshot.data;
      adminUsers = Array.isArray(snap.users) ? snap.users : [];
      adminPosts = Array.isArray(snap.posts) ? snap.posts : [];
      adminComments = Array.isArray(snap.comments) ? snap.comments : [];
      adminBanned = Array.isArray(snap.banned) ? snap.banned : [];
      await loadAdminDealPrices(false);
      await loadAdminFeedback();
      await loadAdminContentReports();
      await loadAdminMarketplaceReports();
      renderAdminPanel();
      return;
    }
    console.warn('管理员 RPC 不可用，回退旧查询:', snapshot.error);
    const fallback = await adminCenterApi.readFallback();
    adminUsers = fallback.users;
    adminPosts = fallback.posts;
    adminComments = fallback.comments;
    adminBanned = fallback.banned;
    await loadAdminDealPrices(false);
    await loadAdminFeedback();
    await loadAdminContentReports();
    await loadAdminMarketplaceReports();
    renderAdminPanel();
  } catch(e){
    console.warn('管理后台读取失败:', e.message);
    if(body) body.innerHTML = `<div class="admin-empty">管理数据暂时无法读取。<br>${escHtml(friendlyDealReviewError(e.message))}</div>`;
  }
}
function adminFiltered(list, fields){
  const kw = (document.getElementById('adminSearchInput')?.value || '').trim().toLowerCase();
  if(!kw) return list;
  return list.filter(row => fields.some(f => String(row[f] || '').toLowerCase().includes(kw)));
}
function adminStatsHtml(){
  return `
    <div class="admin-stat"><b>${adminUsers.length}</b><span>注册用户</span></div>
    <div class="admin-stat"><b>${adminPosts.length}</b><span>近期帖子</span></div>
    <div class="admin-stat"><b>${adminComments.length}</b><span>近期评论</span></div>
    <div class="admin-stat"><b>${adminDealPrices.length}</b><span>省钱数据</span></div>
    <div class="admin-stat"><b>${adminBanned.length}</b><span>封禁记录</span></div>
    <div class="admin-stat"><b>${adminFeedback.filter(x => x.status !== 'resolved').length}</b><span>待处理反馈</span></div>
    <div class="admin-stat"><b>${adminContentReports.filter(x => !['resolved','dismissed'].includes(x.status)).length}</b><span>待处理举报</span></div>
    <div class="admin-stat"><b>${adminMarketplaceReports.filter(x => !['resolved','dismissed'].includes(x.status)).length}</b><span>商品合规</span></div>
  `;
}
function renderAdminPanel(){
  const stats = document.getElementById('adminStats');
  if(stats) stats.innerHTML = adminStatsHtml();
  const body = document.getElementById('adminBody');
  if(!body) return;
  if(!adminHasAccess(true)){
    body.innerHTML = '<div class="admin-empty">当前账号没有管理员权限。请先把当前 user_id 加入 deal_admins 表。</div>';
    return;
  }
  if(adminTab === 'users') return renderAdminUsers(body);
  if(adminTab === 'posts') return renderAdminPosts(body);
  if(adminTab === 'comments') return renderAdminComments(body);
  if(adminTab === 'deals') return renderAdminDeals(body);
  if(adminTab === 'feedback') return renderAdminFeedback(body);
  if(adminTab === 'reports') return renderAdminContentReports(body);
  if(adminTab === 'marketplace') return renderAdminMarketplaceReports(body);
  renderAdminBanned(body);
}
async function loadAdminFeedback(){
  if(!adminHasAccess(true)) return [];
  try {
    if(!adminFeedbackApi) throw new Error('管理员反馈接口未初始化');
    adminFeedback = await adminFeedbackApi.readAll();
    try { adminFeedbackAttachmentMap = await loadFeedbackAttachmentMap(adminFeedback); }
    catch(error){ console.warn('公测反馈截图读取失败:', error.message); adminFeedbackAttachmentMap = new Map(); }
  } catch(e){ console.warn('公测反馈读取失败:', e.message); adminFeedback = []; adminFeedbackAttachmentMap = new Map(); }
  return adminFeedback;
}
function renderAdminFeedback(body){
  const rows = adminFiltered(adminFeedback, ['title','body','user_name','type','status']).filter(row => adminFeedbackStatusFilter === 'all' || (row.status || 'pending') === adminFeedbackStatusFilter);
  const filters = [['pending','待处理'],['reviewing','处理中'],['resolved','已解决'],['all','全部']];
  body.innerHTML = `<div class="search-filter-row" style="margin:0 0 14px;padding:0;">${filters.map(([value,label]) => `<button class="search-filter-chip ${adminFeedbackStatusFilter===value?'active':''}" onclick="setAdminFeedbackStatusFilter('${value}')">${label}</button>`).join('')}</div>` + (rows.length ? `<div class="admin-list">${rows.map(row => `<div class="admin-row"><div class="admin-row-top"><div class="admin-row-main"><div class="admin-row-title">${escHtml(row.title || '未命名反馈')} <span class="admin-badge ${row.status === 'resolved' ? 'good' : row.status === 'reviewing' ? 'warn' : 'muted'}">${row.status === 'resolved' ? '已解决' : row.status === 'reviewing' ? '处理中' : '待处理'}</span></div><div class="admin-row-meta">${escHtml(row.user_name || '用户')} · ${escHtml(row.type || '')} · v${escHtml(row.app_version || '')}<br>${adminTimeText(row.created_at)} · ${escHtml(row.page_path || '')}</div><div class="admin-row-text">${escHtml(row.body || '')}</div>${row.admin_reply ? `<div class="my-feedback-reply"><b>已回复用户</b>${escHtml(row.admin_reply)}${row.replied_at ? `<div class="my-feedback-meta">${adminTimeText(row.replied_at)}</div>` : ''}</div>` : ''}</div></div><div class="admin-actions">${feedbackAttachmentButtonHtml(row.id, adminFeedbackAttachmentMap)}<button class="primary" onclick="openAdminFeedbackReply(${row.id})">${row.admin_reply ? '修改回复' : '回复用户'}</button><button onclick="adminUpdateFeedback(${row.id},'reviewing')">处理中</button><button onclick="adminUpdateFeedback(${row.id},'resolved')">标记已解决</button></div></div>`).join('')}</div>` : '<div class="admin-empty">当前筛选下没有公测反馈。</div>');
}
function setAdminFeedbackStatusFilter(value){ adminFeedbackStatusFilter = value; const body = document.getElementById('adminBody'); if(body) renderAdminFeedback(body); }
async function loadAdminContentReports(){
  if(!adminHasAccess(true)) return [];
  try {
    if(!contentReportApi) throw new Error('举报接口未初始化');
    adminContentReports = await contentReportApi.readAll();
  } catch(e){ console.warn('内容举报读取失败:', e.message); adminContentReports = []; }
  return adminContentReports;
}
function contentReportReasonText(reason){ return ({ spam:'垃圾广告或引流', misinformation:'虚假信息或误导', harassment:'骚扰或仇恨内容', privacy:'侵犯隐私', illegal:'违法或危险内容', other:'其他原因' })[reason] || '其他原因'; }
function renderAdminContentReports(body){
  const postById = new Map(adminPosts.map(post => [String(post.id), post]));
  const rows = adminFiltered(adminContentReports, ['reason','detail','status','reported_user_id','reporter_user_id']).filter(row => {
    const post = postById.get(String(row.post_id));
    if(adminReportFilter === 'all') return true;
    if(adminReportFilter === 'pending') return !['resolved','dismissed'].includes(row.status);
    if(adminReportFilter === 'community') return post?.subcategory === '二手交易';
    return post?.subcategory === adminReportFilter;
  });
  const filters = [['pending','待处理'],['community','社区交易'],['房屋出租','房屋出租'],['求职招聘','求职招聘'],['all','全部']];
  body.innerHTML = `<div class="search-filter-row" style="margin:0 0 14px;padding:0;">${filters.map(([value,label]) => `<button class="search-filter-chip ${adminReportFilter===value?'active':''}" onclick="setAdminReportFilter('${value}')">${label}</button>`).join('')}</div>` + (rows.length ? `<div class="admin-list">${rows.map(row => { const post = postById.get(String(row.post_id)); const path = post ? postCategoryPath(post.category, post.subcategory) : '笔记已删除或未加载'; return `<div class="admin-row"><div class="admin-row-top"><div class="admin-row-main"><div class="admin-row-title">${escHtml(contentReportReasonText(row.reason))} <span class="admin-badge ${row.status === 'resolved' ? 'good' : row.status === 'reviewing' ? 'warn' : 'muted'}">${row.status === 'resolved' ? '已处理' : row.status === 'dismissed' ? '已驳回' : row.status === 'reviewing' ? '处理中' : '待处理'}</span></div><div class="admin-row-meta">举报时间：${adminTimeText(row.created_at)}<br>笔记：${escHtml(row.post_id || '无')} · ${escHtml(path)} · 被举报用户：${escHtml(uidToNumericId(String(row.reported_user_id || '')))}</div>${row.detail ? `<div class="admin-row-text">${escHtml(row.detail)}</div>` : ''}</div></div><div class="admin-actions"><button class="primary" onclick="adminUpdateContentReport(${row.id},'reviewing')">处理中</button><button onclick="adminOpenReportedPost(${JSON.stringify(row.post_id)})">查看笔记</button><button onclick="adminUpdateContentReport(${row.id},'resolved')">已处理</button><button class="danger" onclick="adminUpdateContentReport(${row.id},'dismissed')">驳回</button></div></div>`; }).join('')}</div>` : '<div class="admin-empty">当前筛选下没有内容举报。</div>');
}
function setAdminReportFilter(value){ adminReportFilter = value; const body = document.getElementById('adminBody'); if(body) renderAdminContentReports(body); }
async function loadAdminMarketplaceReports(){
  if(!adminHasAccess(true)) return [];
  try {
    const response = await authedFetch(`${SUPABASE_URL}/rest/v1/rpc/marketplace_admin_listing_reports`, { method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify({ p_limit:120 }) });
    if(!response.ok) throw new Error(await response.text());
    adminMarketplaceReports = await response.json();
  } catch(error) {
    console.warn('商品合规举报读取失败:', error.message);
    adminMarketplaceReports = [];
  }
  return adminMarketplaceReports;
}
function marketplaceReportReasonText(reason){ return ({ prohibited:'禁售或违法商品', counterfeit:'假冒或侵权', fraud:'疑似欺诈', unsafe:'安全风险', stolen:'疑似赃物', privacy:'隐私风险', other:'其他' })[reason] || '其他'; }
function marketplaceStatusText(status){ return ({ pending:'待处理', reviewing:'审核中', resolved:'已处理', dismissed:'已驳回', review:'合规审核中', frozen:'已冻结', removed:'已下架', active:'已公开' })[status] || status || '待处理'; }
function renderAdminMarketplaceReports(body){
  const rows = adminFiltered(adminMarketplaceReports, ['listing_title','reason','detail','source_type','status','listing_status']);
  body.innerHTML = rows.length ? `<div class="admin-list">${rows.map((row,index) => `<div class="admin-row"><div class="admin-row-top"><div class="admin-row-main"><div class="admin-row-title">${escHtml(row.listing_title || '未命名商品')} <span class="admin-badge ${row.listing_status === 'active' ? 'good' : row.listing_status === 'frozen' || row.listing_status === 'removed' ? 'warn' : 'muted'}">${marketplaceStatusText(row.listing_status || row.status)}</span></div><div class="admin-row-meta">${row.source_type === 'merchant_product' ? '认证商家商品' : '个人小店商品'} · ${marketplaceReportReasonText(row.reason)} · ${adminTimeText(row.created_at)}<br>商品编号：${escHtml(row.source_id || '')}</div>${row.detail ? `<div class="admin-row-text">${escHtml(row.detail)}</div>` : ''}</div></div><div class="admin-actions"><button onclick="adminModerateMarketplaceListing(${index},'review')">审核中</button><button class="primary" onclick="adminModerateMarketplaceListing(${index},'active')">恢复公开</button><button onclick="adminModerateMarketplaceListing(${index},'frozen')">冻结</button><button class="danger" onclick="adminModerateMarketplaceListing(${index},'removed')">下架</button></div></div>`).join('')}</div>` : '<div class="admin-empty">当前没有商品举报。受监管商品会自动进入“合规审核中”。</div>';
}
async function adminModerateMarketplaceListing(index,status){
  if(!adminHasAccess()) return;
  const row = adminMarketplaceReports[index];
  if(!row) return;
  const note = prompt('处理备注（会保存在审核记录中，可留空）', row.moderator_note || '') || '';
  try {
    const response = await authedFetch(`${SUPABASE_URL}/rest/v1/rpc/marketplace_moderate_listing`, { method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify({ p_owner_user_id:row.owner_user_id, p_source_type:row.source_type, p_source_id:row.source_id, p_status:status, p_reason_code:row.reason || null, p_note:note }) });
    if(!response.ok) throw new Error(await response.text());
    await loadAdminMarketplaceReports();
    renderAdminPanel();
    showToast(status === 'active' ? '商品已恢复公开' : status === 'review' ? '商品已转入合规审核' : status === 'frozen' ? '商品已冻结' : '商品已下架');
  } catch(error) {
    console.warn('商品合规处理失败:', error.message);
    showToast('处理失败，请检查管理员权限');
  }
}
function adminOpenReportedPost(postId){
  if(postId === null || postId === undefined){ showToast('该举报没有关联笔记'); return; }
  window.adminReportPostReturn = true;
  switchTab('home');
  setTimeout(() => openPost(postId), 50);
}
async function adminUpdateContentReport(id, status){
  try { if(!contentReportApi) throw new Error('举报接口未初始化'); await contentReportApi.updateStatus({ id, status, handledBy:session.user.id }); await loadAdminContentReports(); renderAdminPanel(); showToast(status === 'reviewing' ? '已标记处理中' : status === 'resolved' ? '已标记处理完成' : '已驳回举报'); } catch(e){ showToast('更新失败，请检查管理员权限'); }
}
async function adminUpdateFeedback(id, status){
  try { if(!adminFeedbackApi) throw new Error('管理员反馈接口未初始化'); await adminFeedbackApi.updateStatus({ id, status, handledBy:session.user.id }); await loadAdminFeedback(); renderAdminPanel(); showToast(status === 'resolved' ? '已标记为解决' : '已标记处理中'); } catch(e){ showToast('更新失败，请检查管理员权限'); }
}
function openAdminFeedbackReply(id){
  if(!adminHasAccess()) return;
  const row = adminFeedback.find(item => Number(item.id) === Number(id));
  if(!row){ showToast('暂时找不到这条反馈'); return; }
  activeAdminFeedbackReply = row;
  const context = document.getElementById('adminFeedbackReplyContext');
  const text = document.getElementById('adminFeedbackReplyText');
  const status = document.getElementById('adminFeedbackReplyStatus');
  if(context) context.innerHTML = `<b>${escHtml(row.title || '未命名反馈')}</b><br>${escHtml(row.user_name || '用户')} · ${feedbackTypeLabel(row.type)}<br><span style="white-space:pre-wrap;">${escHtml(row.body || '')}</span>`;
  if(text) text.value = row.admin_reply || '';
  if(status) status.value = ['pending','reviewing','resolved'].includes(row.status) ? row.status : 'reviewing';
  document.getElementById('adminFeedbackReplyOverlay')?.classList.add('open');
}
function closeAdminFeedbackReply(){
  document.getElementById('adminFeedbackReplyOverlay')?.classList.remove('open');
  activeAdminFeedbackReply = null;
}
async function saveAdminFeedbackReply(){
  if(!adminHasAccess() || !activeAdminFeedbackReply) return;
  const reply = document.getElementById('adminFeedbackReplyText')?.value.trim() || '';
  const status = document.getElementById('adminFeedbackReplyStatus')?.value || 'reviewing';
  if(!reply){ showToast('请填写回复内容'); return; }
  if(reply.length > 1000){ showToast('回复不能超过 1000 个字'); return; }
  try {
    if(!adminFeedbackApi) throw new Error('管理员反馈接口未初始化');
    await adminFeedbackApi.reply({ id:activeAdminFeedbackReply.id, replyText:reply, status, handledBy:session.user.id });
    closeAdminFeedbackReply();
    await loadAdminFeedback();
    renderAdminPanel();
    showToast('回复已发送给用户');
  } catch(error){
    console.warn('公测反馈回复失败:', error.message);
    showToast('发送失败，请先运行 5.154 SQL 并检查管理员权限');
  }
}
function renderAdminUsers(body){
  const counts = {};
  adminPosts.forEach(p => { if(p.user_id) counts[p.user_id] = (counts[p.user_id] || 0) + 1; });
  const rows = adminFiltered(adminUsers, ['name','user_id','email']);
  body.innerHTML = rows.length ? `<div class="admin-list">${rows.map(u => `
    <div class="admin-row">
      <div class="admin-row-top">
        ${avatarCircleSizedHtml(u.name || '用户', u.user_id, 42)}
        <div class="admin-row-main">
          <div class="admin-row-title">${escHtml(u.name || '未命名用户')} ${adminUserStatusLabel(u)}</div>
          <div class="admin-row-meta">ID: ${uidToNumericId(String(u.user_id))}<br>user_id: ${escHtml(u.user_id || '')}${u.email ? `<br>邮箱：${escHtml(u.email)}` : ''}<br>注册：${adminTimeText(u.created_at) || '未知'} · 更新：${adminTimeText(u.updated_at) || '未知'} · 发帖 ${counts[u.user_id] || 0}</div>
        </div>
      </div>
      <div class="admin-actions">
        <button class="primary" onclick="openAdminUserProfile('${String(u.user_id || '').replace(/'/g,'')}')">用户资料</button>
        <button onclick="openUserPublicPage('${String(u.user_id || '').replace(/'/g,'')}','${String(u.name || '').replace(/'/g,'')}')">查看主页</button>
        <button onclick="adminShowUserPosts('${String(u.user_id || '').replace(/'/g,'')}')">看TA帖子</button>
        <button class="danger" onclick="openAdminModeration('${String(u.user_id || '').replace(/'/g,'')}','ban')">用户处理</button>
      </div>
    </div>
  `).join('')}</div>` : '<div class="admin-empty">没有找到注册用户。请确认已执行 4.60 管理后台数据读取 SQL。</div>';
}
function adminUserStatusActive(u){ return ['banned','muted'].includes(u?.moderation_status) && (!u.moderation_expires_at || new Date(u.moderation_expires_at) > new Date()); }
function adminUserStatusLabel(u){ if(!adminUserStatusActive(u)) return ''; return `<span class="admin-badge warn">${u.moderation_status === 'banned' ? '已封禁' : '已禁言'}</span>`; }
function adminReasonOptions(){ return [['违法','违反法律法规'],['privacy','侵犯隐私或肖像权'],['violent','血腥、暴力或危险内容'],['spam','垃圾广告或引流'],['harassment','骚扰、辱骂或歧视'],['fraud','虚假信息或诈骗'],['other','其他']]; }
function closeAdminUserProfile(){ document.getElementById('adminUserProfileOverlay')?.classList.remove('open'); }
function openAdminUserProfile(userId){
  const u = adminUsers.find(row => String(row.user_id) === String(userId)); if(!u) return showToast('未找到用户资料'); adminActiveUser = u;
  const body=document.getElementById('adminUserProfileBody');
  body.innerHTML=`<div style="display:flex;align-items:center;gap:13px;margin-bottom:18px;">${avatarCircleSizedHtml(u.name||'用户',u.user_id,64)}<div><b style="font-size:18px;">${escHtml(u.name||'未命名用户')}</b><div style="font-size:12px;color:var(--ink-faint);margin-top:4px;">${adminUserStatusLabel(u) || '正常账号'}</div></div></div><div class="admin-row-meta" style="line-height:1.8;">注册邮箱：${escHtml(u.email||'未提供')}<br>用户 ID：${escHtml(u.user_id||'')}<br>注册时间：${adminTimeText(u.created_at)||'未知'}<br>最后登录：${adminTimeText(u.last_sign_in_at)||'暂无记录'}<br>IP 属地：${escHtml(u.ip_location||'暂未显示')}<br>发笔记：${Number(u.post_count||0)} 篇<br>个人简介：${escHtml(u.bio||'未填写')}</div><div class="admin-actions" style="margin-top:18px;"><button class="primary" onclick="openUserPublicPage('${String(u.user_id).replace(/'/g,'')}','${String(u.name||'').replace(/'/g,'')}')">查看主页</button><button onclick="adminShowUserPosts('${String(u.user_id).replace(/'/g,'')}');closeAdminUserProfile()">查看帖子</button><button class="danger" onclick="openAdminModeration('${String(u.user_id).replace(/'/g,'')}','ban')">处理用户</button></div>`;
  document.getElementById('adminUserProfileOverlay')?.classList.add('open');
}
function closeAdminModeration(){ document.getElementById('adminModerationOverlay')?.classList.remove('open'); }
function openAdminModeration(userId, preset='warning'){
  const u=adminUsers.find(row=>String(row.user_id)===String(userId)); if(!u) return showToast('未找到用户'); adminActiveUser=u;
  const body=document.getElementById('adminModerationBody'); const active=adminUserStatusActive(u);
  body.innerHTML=`<div class="feedback-meta">处理对象：<b>${escHtml(u.name||'用户')}</b><br>${escHtml(u.email||'')}</div><div class="feedback-field"><label>处理方式</label><select id="moderationAction"><option value="warning" ${preset==='warning'?'selected':''}>警告</option><option value="mute" ${preset==='mute'?'selected':''}>禁言</option><option value="ban" ${preset==='ban'?'selected':''}>封禁</option>${active?'<option value="unban">解除限制</option>':''}</select></div><div class="feedback-field"><label>违规原因</label><select id="moderationReason">${adminReasonOptions().map(([v,l])=>`<option value="${v}">${l}</option>`).join('')}</select></div><div class="feedback-field"><label>处理天数 <span style="font-weight:400;color:var(--ink-faint);">（留空为长期；警告无需填写）</span></label><input id="moderationDays" type="number" min="1" max="3650" placeholder="例如：7"></div><div class="feedback-field"><label>附加留言</label><textarea id="moderationNote" maxlength="500" placeholder="这段内容会发送给用户"></textarea></div><button class="feedback-submit" onclick="submitAdminModeration()">确认发送处理通知</button>`;
  closeAdminUserProfile(); document.getElementById('adminModerationOverlay')?.classList.add('open');
}
async function submitAdminModeration(){
  if(!adminHasAccess() || !adminActiveUser) return; const action=document.getElementById('moderationAction')?.value||'warning'; const reason=document.getElementById('moderationReason')?.value||''; const note=document.getElementById('moderationNote')?.value.trim()||''; const daysRaw=document.getElementById('moderationDays')?.value||''; const days=daysRaw?Number(daysRaw):null;
  if(days!==null && (!Number.isInteger(days)||days<1||days>3650)) return showToast('处理天数请填写 1 到 3650');
  try { if(!adminAccessApi) throw new Error('管理员权限接口未初始化'); await adminAccessApi.moderateUser({userId:adminActiveUser.user_id,action,reason,note,days}); closeAdminModeration(); await loadAdminCenter(true); showToast('处理已发送给用户'); } catch(e){ showToast('处理失败：'+friendlyDealReviewError(e.message)); }
}
function renderAdminPosts(body){
  const options = [...new Set(adminPosts.map(p => p.subcategory).filter(Boolean))];
  if(!options.includes(adminPostSubcategoryFilter)) adminPostSubcategoryFilter = '全部';
  const rows = adminFiltered(adminPosts, ['title','author','content','user_id','subcategory']).filter(p => adminPostSubcategoryFilter === '全部' || p.subcategory === adminPostSubcategoryFilter);
  const filterHtml = `<div class="search-filter-row" style="margin:0 0 14px;padding:0;">${['全部', ...options].map(item => `<button class="search-filter-chip ${adminPostSubcategoryFilter===item?'active':''}" onclick="setAdminPostSubcategoryFilter('${item}')">${item}</button>`).join('')}</div>`;
  body.innerHTML = filterHtml + (rows.length ? `<div class="admin-list">${rows.map(p => `
    <div class="admin-row">
      <div class="admin-row-top">
        ${avatarCircleSizedHtml(p.author || '用户', p.user_id, 38)}
        <div class="admin-row-main">
          <div class="admin-row-title">${escHtml(p.title || '无标题')}</div>
          <div class="admin-row-meta">${escHtml(p.author || '用户')} · ${escHtml(postCategoryPath(p.category, p.subcategory))} · ${adminTimeText(p.created_at) || escHtml(p.time || '')}<br>post_id: ${escHtml(p.id)}</div>
          <div class="admin-row-text">${escHtml(p.content || '')}</div>
        </div>
      </div>
      <div class="admin-actions">
        <button class="primary" onclick="openPost(${JSON.stringify(p.id)})">查看帖子</button>
        <button onclick="adminShowUserPosts('${String(p.user_id || '').replace(/'/g,'')}')">看作者</button>
        <button class="danger" onclick="adminDeletePost(${JSON.stringify(p.id)})">删除帖子</button>
      </div>
    </div>
  `).join('')}</div>` : '<div class="admin-empty">没有找到近期帖子。</div>');
}
function setAdminPostSubcategoryFilter(item){ adminPostSubcategoryFilter = item; const body = document.getElementById('adminBody'); if(body) renderAdminPosts(body); }
function renderAdminComments(body){
  const postTitle = id => (adminPosts.find(p => String(p.id) === String(id)) || {}).title || '';
  const rows = adminFiltered(adminComments, ['name','text','user_id','post_id']);
  body.innerHTML = rows.length ? `<div class="admin-list">${rows.map(c => `
    <div class="admin-row">
      <div class="admin-row-top">
        ${avatarCircleSizedHtml(c.name || '用户', c.user_id, 38)}
        <div class="admin-row-main">
          <div class="admin-row-title">${escHtml(c.name || '用户')} ${c.parent_id ? '<span class="admin-badge">回复</span>' : '<span class="admin-badge">评论</span>'}</div>
          <div class="admin-row-meta">${adminTimeText(c.created_at)} · post_id: ${escHtml(c.post_id || '')}<br>${escHtml(postTitle(c.post_id))}</div>
          <div class="admin-row-text">${c.reply_to_name ? `回复 @${escHtml(c.reply_to_name)}：` : ''}${escHtml(c.text || '')}</div>
        </div>
      </div>
      <div class="admin-actions">
        <button class="primary" onclick="openPost(${JSON.stringify(c.post_id)})">查看帖子</button>
        <button class="danger" onclick="adminDeleteComment(${JSON.stringify(c.id)})">删除评论</button>
      </div>
    </div>
  `).join('')}</div>` : '<div class="admin-empty">没有找到近期评论。</div>';
}
function adminDealStatusLabel(row){
  const display = row.display_status || 'visible';
  const review = row.review_status || 'unreviewed';
  if(display === 'hidden') return '<span class="admin-badge warn">已隐藏</span>';
  if(dealIsExpired(row)) return '<span class="admin-badge warn">已过期</span>';
  if(review === 'approved') return '<span class="admin-badge good">人工确认</span>';
  if(review === 'needs_review') return '<span class="admin-badge warn">需核对</span>';
  if(review === 'rejected') return '<span class="admin-badge warn">不展示</span>';
  return '<span class="admin-badge muted">未审核</span>';
}
function adminDealSourceStatus(row){
  if(row.current_price !== null && row.current_price !== undefined && row.current_price !== '') return '<span class="admin-badge good">有价格</span>';
  if(['weekly_ad_page','daily_deals_page'].includes(row.source_type)) return '<span class="admin-badge">官网入口</span>';
  return '<span class="admin-badge warn">无价格</span>';
}
async function loadAdminDealPrices(force=false){
  if(!adminHasAccess(true)) return [];
  if(adminDealPrices.length && !force) return adminDealPrices;
  const baseSelect = 'id,product_id,price_date,retailer_key,retailer_name,category,product_name,product_name_cn,original_price,current_price,unit,percent_off,save_amount,location,source_url,source_type,stock_status,is_food_low_price,is_hot,price_note,ai_summary_cn,refreshed_at,expires_at,updated_at';
  const opsSelect = `${baseSelect},review_status,display_status,admin_note,verified_at,verified_by`;
  try {
    let res = await authedFetch(`${SUPABASE_URL}/rest/v1/deal_daily_price_cache?select=${opsSelect}&order=refreshed_at.desc&limit=120`, { method:'GET' });
    if(!res.ok){
      adminDealOpsReady = false;
      res = await authedFetch(`${SUPABASE_URL}/rest/v1/deal_daily_price_cache?select=${baseSelect}&order=refreshed_at.desc&limit=120`, { method:'GET' });
    } else {
      adminDealOpsReady = true;
    }
    if(!res.ok) throw new Error(await res.text());
    adminDealPrices = await res.json();
  } catch(e){
    adminDealPrices = [];
    adminDealOpsReady = false;
    console.warn('读取省钱运营数据失败:', e.message);
  }
  return adminDealPrices;
}
function renderAdminDeals(body){
  if(!adminDealPrices.length){
    body.innerHTML = `<div class="admin-empty">没有读取到省钱缓存数据。${adminDealOpsReady ? '' : '<br>如果你还没执行 4.70 SQL，先执行后再刷新。'}</div>`;
    return;
  }
  const rows = adminFiltered(adminDealPrices, ['retailer_name','retailer_key','product_name','product_name_cn','source_type','review_status','display_status','price_note','ai_summary_cn'])
    .sort((a,b) =>
      (dealIsExpired(b) === true) - (dealIsExpired(a) === true) ||
      (String(b.review_status || '') === 'needs_review') - (String(a.review_status || '') === 'needs_review') ||
      (b.is_hot === true) - (a.is_hot === true) ||
      dealTimeValue(b.refreshed_at || b.updated_at) - dealTimeValue(a.refreshed_at || a.updated_at)
    );
  body.innerHTML = `
    ${adminDealOpsReady ? '' : '<div class="admin-empty" style="margin-bottom:10px;">当前还没有 4.70 运营字段，只能查看基础价格。执行 4.70 SQL 后可使用确认、隐藏、状态管理。</div>'}
    <div class="admin-list">${rows.map(row => {
      const price = moneyText(row.current_price) || (['weekly_ad_page','daily_deals_page'].includes(row.source_type) ? '官网入口' : '待核对');
      const original = moneyText(row.original_price);
      const source = dealSourceLabel(row.source_type);
      const hot = row.is_hot ? '<span class="admin-badge hot">热门</span>' : '';
      const unitText = dealUnitPriceText(row.current_price, row.unit, `${row.product_name_cn || ''} ${row.product_name || ''}`);
      const editing = String(adminEditingDealId) === String(row.id);
      return `
        <div class="admin-row">
          <div class="admin-row-top">
            <div class="admin-row-main">
              <div class="admin-row-title">${escHtml(row.product_name_cn || row.product_name || '未命名商品')} ${hot} ${adminDealStatusLabel(row)} ${adminDealSourceStatus(row)}</div>
              <div class="admin-row-meta">${escHtml(row.retailer_name || row.retailer_key || '商家')} · ${escHtml(source)} · ${escHtml(row.location || '网购 / 门店')}<br>更新：${adminTimeText(row.refreshed_at || row.updated_at || row.price_date)} · 过期：${adminTimeText(row.expires_at) || '未设置'}<br>${escHtml(row.source_url || '')}</div>
              <div class="admin-price-line"><b>${escHtml(price)}</b>${original ? `<del>${escHtml(original)}</del>` : ''}<span>${unitText || (row.percent_off ? `省 ${row.percent_off}%` : (row.unit || ''))}</span></div>
              <div class="admin-row-text">${escHtml(row.ai_summary_cn || row.price_note || row.admin_note || '暂无摘要')}</div>
            </div>
          </div>
          ${editing ? adminDealEditFormHtml(row) : ''}
          <div class="admin-actions">
            <button class="primary" onclick="openDealSource(${dealUrlArg(dealSourceUrl(row))})">官网核对</button>
            <button onclick="adminStartEditDeal(${dealActionArg(row.id)})">${editing ? '收起编辑' : '编辑'}</button>
            <button onclick="adminToggleDealHot(${dealActionArg(row.id)}, ${row.is_hot ? 'false' : 'true'})">${row.is_hot ? '取消热门' : '设为热门'}</button>
            <button onclick="adminMarkDealPrice(${dealActionArg(row.id)}, 'approved')">人工确认</button>
            <button onclick="adminMarkDealPrice(${dealActionArg(row.id)}, 'needs_review')">需核对</button>
            <button onclick="adminExpireDealPrice(${dealActionArg(row.id)})">标记过期</button>
            ${row.display_status === 'hidden' ? `<button onclick="adminRestoreDealPrice(${dealActionArg(row.id)})">恢复显示</button>` : `<button class="danger" onclick="adminHideDealPrice(${dealActionArg(row.id)})">隐藏</button>`}
          </div>
        </div>
      `;
    }).join('')}</div>
  `;
}
function adminDealEditFormHtml(row){
  const id = escAttr(row.id);
  return `
    <div class="admin-edit-grid">
      <div class="admin-edit-field">
        <label>商品中文名</label>
        <input id="dealEditNameCn_${id}" value="${escAttr(row.product_name_cn || '')}" placeholder="例如：牛奶 1加仑">
      </div>
      <div class="admin-edit-field">
        <label>商品英文名</label>
        <input id="dealEditName_${id}" value="${escAttr(row.product_name || '')}" placeholder="Great Value Milk 1 Gallon">
      </div>
      <div class="admin-edit-field">
        <label>当前价格</label>
        <input id="dealEditCur_${id}" type="number" step="0.01" value="${row.current_price ?? ''}" placeholder="不确定可留空">
      </div>
      <div class="admin-edit-field">
        <label>原价</label>
        <input id="dealEditOrig_${id}" type="number" step="0.01" value="${row.original_price ?? ''}" placeholder="无原价可留空">
      </div>
      <div class="admin-edit-field">
        <label>单位</label>
        <input id="dealEditUnit_${id}" value="${escAttr(row.unit || '')}" placeholder="如 1 gallon、20 lb、12枚">
      </div>
      <div class="admin-edit-field">
        <label>库存状态</label>
        <select id="dealEditStock_${id}">
          <option value="unknown" ${row.stock_status === 'unknown' ? 'selected' : ''}>需核对</option>
          <option value="in_stock" ${row.stock_status === 'in_stock' ? 'selected' : ''}>有货</option>
          <option value="out_of_stock" ${row.stock_status === 'out_of_stock' ? 'selected' : ''}>缺货</option>
        </select>
      </div>
      <div class="admin-edit-field full">
        <label>来源链接</label>
        <input id="dealEditUrl_${id}" value="${escAttr(row.source_url || '')}" placeholder="https://...">
      </div>
      <div class="admin-edit-field full">
        <label>中文摘要 / 推荐理由</label>
        <textarea id="dealEditSummary_${id}" placeholder="说明为什么值得看，价格以官网为准。">${escHtml(row.ai_summary_cn || '')}</textarea>
      </div>
      <div class="admin-edit-field full">
        <label>价格说明</label>
        <textarea id="dealEditNote_${id}" placeholder="例如：管理员人工维护，价格以官网最终显示为准。">${escHtml(row.price_note || '')}</textarea>
      </div>
      <div class="admin-edit-field">
        <label>食品低价</label>
        <select id="dealEditFood_${id}">
          <option value="false" ${row.is_food_low_price ? '' : 'selected'}>否</option>
          <option value="true" ${row.is_food_low_price ? 'selected' : ''}>是</option>
        </select>
      </div>
      <div class="admin-edit-field">
        <label>热门</label>
        <select id="dealEditHot_${id}">
          <option value="false" ${row.is_hot ? '' : 'selected'}>否</option>
          <option value="true" ${row.is_hot ? 'selected' : ''}>是</option>
        </select>
      </div>
      <div class="admin-edit-note">价格由管理员人工填写或外部来源抓取，AI 只整理中文摘要，不生成价格。保存后会自动标记为“人工确认”。</div>
      <div class="admin-actions" style="grid-column:1/-1;margin-top:0;">
        <button class="primary" onclick="adminSaveDealEdit(${dealActionArg(row.id)})">保存编辑</button>
        <button onclick="adminCancelDealEdit()">取消</button>
      </div>
    </div>
  `;
}
function adminStartEditDeal(id){
  adminEditingDealId = String(adminEditingDealId) === String(id) ? '' : id;
  renderAdminPanel();
}
function adminCancelDealEdit(){
  adminEditingDealId = '';
  renderAdminPanel();
}
function adminEditValue(id, key){
  return document.getElementById(`dealEdit${key}_${id}`)?.value.trim() || '';
}
function adminNullableNumber(value){
  if(value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}
function adminDealDiscountPatch(original, current){
  if(Number.isFinite(original) && Number.isFinite(current) && original > current){
    const save = Number((original - current).toFixed(2));
    return {
      save_amount: save,
      percent_off: Math.round((save / original) * 100)
    };
  }
  return { save_amount: null, percent_off: null };
}
async function adminSaveDealEdit(id){
  const row = adminDealPrices.find(x => String(x.id) === String(id));
  if(!row){ showToast('没有找到这条省钱数据'); return; }
  const current = adminNullableNumber(adminEditValue(id, 'Cur'));
  const original = adminNullableNumber(adminEditValue(id, 'Orig'));
  const discount = adminDealDiscountPatch(original, current);
  const payload = Object.assign({
    product_name_cn: adminEditValue(id, 'NameCn') || null,
    product_name: adminEditValue(id, 'Name') || row.product_name || '未命名商品',
    current_price: current,
    original_price: original,
    unit: adminEditValue(id, 'Unit') || null,
    stock_status: adminEditValue(id, 'Stock') || 'unknown',
    source_url: adminEditValue(id, 'Url') || row.source_url || '',
    ai_summary_cn: adminEditValue(id, 'Summary') || null,
    price_note: adminEditValue(id, 'Note') || '管理员人工维护，价格以官网最终显示为准。',
    is_food_low_price: adminEditValue(id, 'Food') === 'true',
    is_hot: adminEditValue(id, 'Hot') === 'true',
    review_status: 'approved',
    display_status: 'visible',
    admin_note: '管理员在 4.90 后台手动编辑并确认。',
    verified_by: session && session.user ? session.user.id : null,
    verified_at: new Date().toISOString(),
    refreshed_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 30 * 60 * 60 * 1000).toISOString()
  }, discount);
  const ok = await adminPatchDealPrice(id, payload);
  if(ok){
    adminEditingDealId = '';
    showToast('省钱数据已保存');
  }
}
async function adminPatchDealPrice(id, patch){
  if(!adminHasAccess()) return false;
  if(!adminDealOpsReady && ('review_status' in patch || 'display_status' in patch || 'admin_note' in patch)){
    showToast('请先执行 4.70 SQL，再使用运营状态管理');
    return false;
  }
  try {
    const res = await authedFetch(`${SUPABASE_URL}/rest/v1/deal_daily_price_cache?id=eq.${encodeURIComponent(id)}`, {
      method:'PATCH',
      body: JSON.stringify(Object.assign({ updated_at: new Date().toISOString() }, patch))
    });
    if(!res.ok) throw new Error(await res.text());
    adminDealPrices = adminDealPrices.map(row => String(row.id) === String(id) ? Object.assign({}, row, patch, { updated_at: new Date().toISOString() }) : row);
    dailyPriceCacheLoaded = false;
    renderAdminPanel();
    if(document.getElementById('page-deals')?.style.display !== 'none') loadDailyPriceCache(true);
    return true;
  } catch(e){
    showToast('省钱数据更新失败：' + friendlyDealReviewError(e.message));
    return false;
  }
}
function adminToggleDealHot(id, next){
  adminPatchDealPrice(id, { is_hot: next === true || next === 'true' });
}
function adminMarkDealPrice(id, status){
  const note = status === 'approved'
    ? '管理员已人工核对，价格仍以官网最终显示为准。'
    : '需要人工再次核对来源、价格或库存。';
  adminPatchDealPrice(id, {
    review_status: status,
    display_status: 'visible',
    admin_note: note,
    verified_by: session && session.user ? session.user.id : null,
    verified_at: new Date().toISOString()
  }).then(ok => { if(ok) showToast(status === 'approved' ? '已标记人工确认' : '已标记需核对'); });
}
function adminHideDealPrice(id){
  if(!confirm('确认从前台隐藏这条省钱数据？')) return;
  adminPatchDealPrice(id, {
    review_status: 'rejected',
    display_status: 'hidden',
    admin_note: '管理员已隐藏，前台不展示。',
    verified_by: session && session.user ? session.user.id : null,
    verified_at: new Date().toISOString()
  }).then(ok => { if(ok) showToast('已隐藏'); });
}
function adminRestoreDealPrice(id){
  adminPatchDealPrice(id, {
    review_status: 'needs_review',
    display_status: 'visible',
    admin_note: '管理员已恢复显示，建议重新核对价格和库存。',
    verified_by: session && session.user ? session.user.id : null,
    verified_at: new Date().toISOString()
  }).then(ok => { if(ok) showToast('已恢复显示'); });
}
function adminExpireDealPrice(id){
  adminPatchDealPrice(id, {
    review_status: 'needs_review',
    admin_note: '管理员标记为过期，需要重新核对后再推荐。',
    expires_at: new Date().toISOString(),
    verified_by: session && session.user ? session.user.id : null,
    verified_at: new Date().toISOString()
  }).then(ok => { if(ok) showToast('已标记过期'); });
}
function renderAdminBanned(body){
  const rows = adminFiltered(adminBanned, ['user_id','action_type','reason_code','note']);
  body.innerHTML = rows.length ? `<div class="admin-list">${rows.map(r => `
    <div class="admin-row">
      <div class="admin-row-title">${escHtml(({ban:'封禁',mute:'禁言',warning:'警告',unban:'解除封禁',unmute:'解除禁言'})[r.action_type] || r.action_type || '处理记录')} <span class="admin-badge warn">用户处理</span></div>
      <div class="admin-row-meta">user_id: ${escHtml(r.user_id || '')}<br>时间：${adminTimeText(r.created_at)}<br>原因：${escHtml(r.reason_code || '未填写')}${r.expires_at ? `<br>截止：${adminTimeText(r.expires_at)}` : ''}</div>${r.note ? `<div class="admin-row-text">${escHtml(r.note)}</div>` : ''}
      <div class="admin-actions">
        ${['ban','mute'].includes(r.action_type) ? `<button class="danger" onclick="openAdminModeration('${String(r.user_id || '').replace(/'/g,'')}','unban')">解除限制</button>` : ''}
      </div>
    </div>
  `).join('')}</div>` : '<div class="admin-empty">暂无封禁记录。</div>';
}
function adminShowUserPosts(userId){
  adminTab = 'posts';
  document.getElementById('adminSearchInput').value = userId || '';
  document.querySelectorAll('.admin-tab').forEach(btn => btn.classList.toggle('active', btn.dataset.adminTab === 'posts'));
  renderAdminPanel();
}
async function adminDeletePost(id){
  if(!adminHasAccess()) return;
  if(!confirm('确认删除这篇帖子？删除后不可恢复。')) return;
  try {
    if(!adminCenterApi) throw new Error('管理员中心接口未初始化');
    await adminCenterApi.deletePost(id);
    posts = posts.filter(p => String(p.id) !== String(id));
    adminPosts = adminPosts.filter(p => String(p.id) !== String(id));
    savePosts();
    renderFeed();
    renderAdminPanel();
    showToast('帖子已删除');
  } catch(e){ showToast('删除失败：' + friendlyDealReviewError(e.message)); }
}
async function adminDeleteComment(id){
  if(!adminHasAccess()) return;
  if(!confirm('确认删除这条评论/回复？')) return;
  try {
    if(!adminCenterApi) throw new Error('管理员中心接口未初始化');
    await adminCenterApi.deleteComment(id);
    adminComments = adminComments.filter(c => String(c.id) !== String(id));
    posts.forEach(p => { if(Array.isArray(p.comments)) p.comments = p.comments.filter(c => String(c.id) !== String(id)); });
    savePosts();
    if(activePostId) renderPostModal();
    renderAdminPanel();
    showToast('评论已删除');
  } catch(e){ showToast('删除失败：' + friendlyDealReviewError(e.message)); }
}
async function adminBanUser(userId, name){
  if(!adminHasAccess()) return;
  const reason = prompt(`封禁 ${name || '该用户'} 的原因（可留空）`, '违规内容');
  if(reason === null) return;
  try {
    const payload = { status:'banned', reason: reason || '', created_by: session.user.id, updated_at: new Date().toISOString() };
    if(!adminAccessApi) throw new Error('管理员权限接口未初始化');
    await adminAccessApi.setLegacyBan({ userId, reason:payload.reason, createdBy:payload.created_by });
    await loadAdminCenter(true);
    showToast('已记录封禁');
  } catch(e){ showToast('封禁失败：' + friendlyDealReviewError(e.message)); }
}
async function adminUnbanUser(userId){
  openAdminModeration(userId, 'unban');
}
function dealReportToDealPayload(r){
  const current = r.current_price === null || r.current_price === undefined || r.current_price === '' ? null : Number(r.current_price);
  const original = r.original_price === null || r.original_price === undefined || r.original_price === '' ? null : Number(r.original_price);
  const save = Number.isFinite(original) && Number.isFinite(current) && original > current ? Number((original - current).toFixed(2)) : null;
  const percent = save && original > 0 ? Math.round((save / original) * 100) : null;
  return {
    deal_date: new Date().toISOString().slice(0, 10),
    retailer_key: r.retailer_key || String(r.retailer_name || 'manual').toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 30) || 'manual',
    retailer_name: r.retailer_name,
    category: r.category || 'general',
    product_name: r.product_name,
    product_name_cn: r.product_name_cn || null,
    original_price: Number.isFinite(original) ? original : null,
    current_price: Number.isFinite(current) ? current : null,
    unit: r.unit || null,
    percent_off: percent,
    save_amount: save,
    location: r.location || '网购 / 门店',
    source_url: r.source_url,
    merchant_id: r.merchant_id || null,
    image_url: r.image_url || null,
    is_hot: false,
    is_food_low_price: r.category === 'food',
    stock_status: 'unknown',
    price_note: r.price_note || '人工审核通过，价格以来源页面最终显示为准',
    ai_summary_cn: r.ai_summary_cn || '这条优惠已通过乐生活人工核对，建议进入来源页面确认最终价格和库存。',
    source_type: r.report_type || 'user_report',
    raw_payload: { approved_from_report_id: r.id, submit_note: r.submit_note || null }
  };
}
async function approveDealReport(id){
  if(dealReviewBusy[id]) return;
  const r = dealReviewRows.find(x => String(x.id) === String(id));
  if(!r){ showToast('没有找到这条审核记录'); return; }
  if(r.status && r.status !== 'pending'){ showToast('这条记录已经处理过，请刷新审核池'); return; }
  if(!confirm('确认通过并发布这条优惠？价格会按提交记录写入，不由 AI 生成。')) return;
  dealReviewBusy[id] = true;
  renderDealPanelShell(
    '优惠审核',
    `待审核 ${dealReviewRows.length} 条。价格只按提交值发布，AI 不生成价格。`,
    `<div class="deals-result-list">${dealReviewRows.map(reviewReportCardHtml).join('')}</div>`
  );
  try {
    const dealPayload = dealReportToDealPayload(r);
    const insertRes = await authedFetch(`${SUPABASE_URL}/rest/v1/deals`, {
      method:'POST',
      body: JSON.stringify(dealPayload)
    });
    if(!insertRes.ok) throw new Error(await insertRes.text());
    const updateRes = await authedFetch(`${SUPABASE_URL}/rest/v1/deal_reports?id=eq.${encodeURIComponent(id)}`, {
      method:'PATCH',
      body: JSON.stringify({
        status: 'approved',
        reviewed_at: new Date().toISOString(),
        reviewed_by: session.user.id
      })
    });
    if(!updateRes.ok) throw new Error(await updateRes.text());
    showToast('已通过并发布');
    openDealReviewQueue();
  } catch(e){
    dealReviewBusy[id] = false;
    console.warn('通过发布失败:', e.message);
    showToast(friendlyDealReviewError(e.message));
    renderDealPanelShell(
      '优惠审核',
      `待审核 ${dealReviewRows.length} 条。价格只按提交值发布，AI 不生成价格。`,
      `<div class="deals-result-list">${dealReviewRows.map(reviewReportCardHtml).join('')}</div>`
    );
  }
}
async function rejectDealReport(id){
  if(dealReviewBusy[id]) return;
  const r = dealReviewRows.find(x => String(x.id) === String(id));
  if(r && r.status && r.status !== 'pending'){ showToast('这条记录已经处理过，请刷新审核池'); return; }
  if(!confirm('确认驳回这条优惠？')) return;
  dealReviewBusy[id] = true;
  renderDealPanelShell(
    '优惠审核',
    `待审核 ${dealReviewRows.length} 条。价格只按提交值发布，AI 不生成价格。`,
    `<div class="deals-result-list">${dealReviewRows.map(reviewReportCardHtml).join('')}</div>`
  );
  try {
    const res = await authedFetch(`${SUPABASE_URL}/rest/v1/deal_reports?id=eq.${encodeURIComponent(id)}`, {
      method:'PATCH',
      body: JSON.stringify({
        status: 'rejected',
        reviewed_at: new Date().toISOString(),
        reviewed_by: session.user.id
      })
    });
    if(!res.ok) throw new Error(await res.text());
    showToast('已驳回');
    openDealReviewQueue();
  } catch(e){
    dealReviewBusy[id] = false;
    console.warn('驳回失败:', e.message);
    showToast(friendlyDealReviewError(e.message));
    renderDealPanelShell(
      '优惠审核',
      `待审核 ${dealReviewRows.length} 条。价格只按提交值发布，AI 不生成价格。`,
      `<div class="deals-result-list">${dealReviewRows.map(reviewReportCardHtml).join('')}</div>`
    );
  }
}
function dealSessionKey(){
  let key = localStorage.getItem('leshenghuo_deal_session_key');
  if(!key){
    key = 'deal_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('leshenghuo_deal_session_key', key);
  }
  return key;
}
async function recordDealInteraction(id, type){
  if(!id) return;
  try {
    const res = await authedFetch(`${SUPABASE_URL}/rest/v1/deal_interactions`, {
      method:'POST',
      headers:{'Prefer':'return=minimal'},
      body: JSON.stringify({
        deal_id: id,
        event_type: type,
        user_id: session && session.user ? session.user.id : null,
        session_key: dealSessionKey()
      })
    });
    if(!res.ok && res.status !== 409) console.warn('互动记录失败:', res.status);
  } catch(e){
    console.warn('互动记录失败:', e.message);
  }
}
function renderUnifiedDealPanel(raw, query, rows, error){
  const panel = document.getElementById('dealsSearchPanel');
  if(!panel) return;
  unifiedDealRows = rows || [];
  const hasRows = rows && rows.length;
  panel.innerHTML = `
    <div class="deals-search-panel-head">
      <div class="deals-search-panel-title">
        站内统一搜索结果
        <span>搜索「${raw || '优惠'}」；英文关键词：${query}。结果优先来自每日价格缓存，不实时抓取外部网站，不由 AI 编造价格。</span>
      </div>
      <button class="deals-search-panel-close" onclick="hideDealsSearchPanel()">×</button>
    </div>
    ${hasRows ? `
      <div class="deals-result-toolbar"><b>找到 ${rows.length} 条真实记录</b><span>按食品低价、热门和价格排序</span></div>
      <div class="deals-result-list">${rows.map(unifiedDealCardHtml).join('')}</div>
    ` : `
      <div class="deals-empty-panel">
        ${error ? '数据库查询失败，可能还没有创建每日价格缓存表或读取权限未开放。' : '数据库暂时没有这个关键词的今日缓存价格。'}<br>
        请先刷新每日价格缓存，或在 Supabase 中人工维护该商品价格后再搜索。
      </div>
    `}
  `;
  panel.style.display = 'block';
}
function currentDealsList(){
  const kw = (document.getElementById('dealsSearchInput')?.value || '').trim().toLowerCase();
  let list = dailyPriceCacheRows.length ? cachedPriceDeals() : DEALS.slice();
  if(dealsFilter !== 'today') list = list.filter(d => d.store === dealsFilter || (dealsFilter === 'clearance' && d.tags.includes('clearance')));
  if(kw){
    list = list.filter(d =>
      d.name.toLowerCase().includes(kw) ||
      d.storeName.toLowerCase().includes(kw) ||
      d.location.toLowerCase().includes(kw) ||
      d.tags.some(t => t.toLowerCase().includes(kw))
    );
  }
  return list.sort((a,b) => dealQualityScore(b) - dealQualityScore(a));
}
function isProductDeal(d){
  return (d.dealType || 'product') === 'product';
}
function dealHotPriceHtml(d){
  if(isProductDeal(d)){
    const hasOrig = Number(d.origPrice) > 0;
    const current = Number(d.curPrice) > 0 ? `$${Number(d.curPrice).toLocaleString()}` : '官网核对';
    return `
      <div class="hot-pick-price-row">
        ${hasOrig ? `<div><span class="deals-price-label">原价</span><span class="deals-price-orig">$${Number(d.origPrice).toLocaleString()}</span></div>` : ''}
        <div><span class="deals-price-label">今日缓存</span><span class="deals-price-cur">${current}</span></div>
      </div>
      <div class="hot-pick-save">${d.percentOff ? `省 ${d.percentOff}%` : (d.unit || '每日价格')}</div>
    `;
  }
  return `
    <div class="hot-pick-price-row">
      <div><span class="deals-price-label">官方入口</span><span class="deals-price-cur">${d.dealType === 'weekly_ad' ? '本周优惠' : '限时优惠'}</span></div>
    </div>
    <div class="hot-pick-save">${d.dealType === 'weekly_ad' ? '周广告' : '每日优惠'}</div>
  `;
}
function dealPriceHtml(d){
  const sourceText = dealSourceLabel(d.sourceType);
  const updateText = d.updatedAt ? ` · 更新 ${dealDateText(d.updatedAt)}` : '';
  const unitText = dealUnitPriceText(d.curPrice, d.unit, d.name);
  if(isProductDeal(d)){
    const hasOrig = Number(d.origPrice) > 0;
    const current = Number(d.curPrice) > 0 ? `$${Number(d.curPrice).toLocaleString()}` : '官网核对';
    return `
      <div class="deal-price-row">
        ${hasOrig ? `<div><span class="deals-price-label">原价</span> <span class="deals-price-orig">$${d.origPrice}</span></div><span>↓</span>` : ''}
        <div><span class="deals-price-label">今日缓存</span> <span class="deals-price-cur">${current}</span></div>
        <span class="deal-percent">${d.percentOff ? `省${d.percentOff}%` : (d.unit || '每日价格')}</span>
      </div>
      <div style="font-size:12px;color:var(--ink-soft);line-height:1.55;margin-bottom:8px;"><span class="deal-source-pill">${sourceText}</span>${updateText}。${d.note || '价格以官网最终显示为准'}</div>
      ${unitText ? `<div style="font-size:12px;color:var(--sage-dark);font-weight:900;margin:-2px 0 8px;">${unitText}</div>` : ''}
    `;
  }
  return `
    <div class="deal-price-row">
      <div><span class="deals-price-label">官方入口</span> <span class="deals-price-cur">${d.dealType === 'weekly_ad' ? '本周优惠' : '限时优惠'}</span></div>
      <span class="deal-percent">${d.dealType === 'weekly_ad' ? '周广告' : '每日优惠'}</span>
    </div>
    <div style="font-size:12px;color:var(--ink-soft);line-height:1.55;margin-bottom:8px;"><span class="deal-source-pill">${sourceText}</span>${updateText}。${d.note || d.dealNote || '进入官网核对具体商品和门店价格'}</div>
  `;
}
function dealInlineArg(value){
  return `'${String(value || '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r/g, '')
    .replace(/\n/g, ' ')}'`;
}
function dealActionArg(id){
  return dealInlineArg(id);
}
function dealUrlArg(url){
  return dealInlineArg(String(url || '').trim());
}
function renderHotPicks(){
  const el = document.getElementById('dealsHotScroll');
  if(!el) return;
  const list = currentDealsList().filter(d => d.hot).slice(0, 6);
  el.innerHTML = (list.length ? list : currentDealsList().slice(0, 6)).map(d => `
    <div class="hot-pick-card">
      <div class="hot-pick-store">${d.storeName}</div>
      <div class="hot-pick-name">${d.name}</div>
      ${dealHotPriceHtml(d)}
      <button class="hot-pick-btn" onclick="openDealSource(${dealUrlArg(d.url)})">去核对</button>
    </div>
  `).join('');
}
function renderFoodLowPrices(){
  const el = document.getElementById('foodPriceGrid');
  if(!el) return;
  const kw = (document.getElementById('dealsSearchInput')?.value || '').trim().toLowerCase();
  const cachedFood = dailyPriceCacheRows.filter(d => d.is_food_low_price === true);
  const foodRows = cachedFood.length ? cachedFood.map(d => ({
    id: d.id,
    name: d.product_name_cn || d.product_name || '食品',
    price: moneyText(d.current_price) || '待核对',
    unit: d.unit || '单位待核对',
    store: d.retailer_name || d.retailer_key || '商家',
    note: `${dealUnitPriceText(d.current_price, d.unit, `${d.product_name_cn || ''} ${d.product_name || ''}`) || '单位价格待核对'} · ${d.ai_summary_cn || d.price_note || `每日缓存：${dealDateText(d.updated_at || d.deal_date)} 更新，价格以官网最终显示为准`}`,
    query: d.product_name || d.product_name_cn || ''
  })) : FOOD_LOW_PRICES;
  const list = kw
    ? foodRows.filter(f => `${f.name} ${f.store} ${f.note} ${f.query}`.toLowerCase().includes(kw))
    : foodRows;
  el.innerHTML = (list.length ? list : foodRows.slice(0, 4)).map(f => `
    <div class="food-price-card">
      <div class="food-price-name">${f.name}</div>
      <div class="food-price-main"><b>${f.price}</b><span>/ ${f.unit}</span></div>
      <div class="food-price-store">${f.store}</div>
      <div class="food-price-note">${f.note}</div>
      <button onclick="openFoodSearch('${f.query.replace(/'/g,'')}')">查看哪里买</button>
    </div>
  `).join('');
}
function renderDealsList(){
  const el = document.getElementById('dealsList');
  if(!el) return;
  const list = currentDealsList();
  const count = document.getElementById('dealsCountText');
  if(count) count.textContent = `显示 ${list.length} 条优惠`;
  if(!list.length){
    el.innerHTML = '<div style="text-align:center;color:var(--ink-faint);font-size:13px;padding:30px 0;">没有找到符合条件的优惠。可以点“全网找”去商家官网搜索。</div>';
    return;
  }
  el.innerHTML = list.slice(0, 10).map((d, i) => `
    <div class="deal-card ${d.hot ? 'hot' : ''}">
      <div class="deal-card-head">
        <div class="deal-name">${i + 1}. ${d.name}</div>
        ${d.hot ? '<span class="deal-badge">热门</span>' : ''}
      </div>
      <div class="deal-store-row"><span>${d.storeName}</span><span>${uiIcon('map',12)} ${d.location}</span></div>
      <div class="deal-rating">${'★'.repeat(d.rating)}</div>
      ${dealPriceHtml(d)}
      <div class="deal-stock" style="color:${d.inStock ? 'var(--sage-dark)' : 'var(--berry)'};">${d.inStock ? '✓ 官网/门店可核对' : '✕ 库存不足'}</div>
      <div class="deal-actions">
        <button class="${dealLikes[d.id] ? 'liked' : ''}" onclick="toggleDealLike(${dealActionArg(d.id)})">${dealLikes[d.id] ? '已收藏' : '收藏'}</button>
        <button onclick="shareDeal(${dealActionArg(d.id)})">分享</button>
        <button onclick="openDealDetail(${dealActionArg(d.id)})">官网核对</button>
      </div>
    </div>
  `).join('');
}
function toggleDealLike(id){
  dealLikes[id] = !dealLikes[id];
  renderDealsList();
}
function shareDeal(id){
  const d = currentDealsList().find(x => String(x.id) === String(id)) || DEALS.find(x => String(x.id) === String(id));
  if(d && navigator.clipboard) navigator.clipboard.writeText(d.url);
  showToast('优惠链接已复制');
}
function openDealDetail(id){
  const d = currentDealsList().find(x => String(x.id) === String(id)) || DEALS.find(x => String(x.id) === String(id));
  if(!d){ showToast('没有找到这条优惠'); return; }
  openDealSource(d.url);
}
async function openRetailerSearch(){
  const raw = (document.getElementById('dealsSearchInput')?.value || '').trim();
  const query = normalizeDealSearchQuery(raw);
  const panel = document.getElementById('dealsSearchPanel');
  if(!panel) return;
  panel.innerHTML = `
    <div class="deals-search-panel-head">
      <div class="deals-search-panel-title">
        正在查询数据库
        <span>已将「${raw || '优惠'}」转换为英文搜索词：${query}，正在读取 Supabase 每日价格缓存。</span>
      </div>
      <button class="deals-search-panel-close" onclick="hideDealsSearchPanel()">×</button>
    </div>
    <div class="deals-empty-panel">正在整理真实价格...</div>
  `;
  panel.style.display = 'block';
  try {
    const rows = await fetchUnifiedDealResults(raw, query);
    renderUnifiedDealPanel(raw, query, rows, null);
  } catch(e) {
    console.warn('省钱统一搜索失败:', e.message);
    renderUnifiedDealPanel(raw, query, [], e);
  }
}
function openFoodSearch(query){
  const input = document.getElementById('dealsSearchInput');
  if(input) input.value = query || '';
  openRetailerSearch();
}
function openDealSource(url, id){
  const target = String(url || '').trim();
  if(!target){ showToast('这条记录还没有来源链接'); return; }
  window.open(target, '_blank', 'noopener');
  if(id) recordDealInteraction(id, 'click');
}
function copyUnifiedDeal(id){
  const d = unifiedDealRows.find(x => String(x.id) === String(id));
  if(!d){ showToast('没有找到这条优惠'); return; }
  const text = `${d.product_name_cn || d.product_name}｜${d.retailer_name || d.retailer_key}｜${moneyText(d.current_price) || d.price_note || '查看详情'} ${d.unit || ''}｜${d.source_url || ''}`;
  if(navigator.clipboard) navigator.clipboard.writeText(text);
  recordDealInteraction(id, 'copy');
  showToast('已复制该优惠摘要');
}
function favoriteUnifiedDeal(id){
  unifiedDealFavorites[id] = !unifiedDealFavorites[id];
  if(unifiedDealFavorites[id]) recordDealInteraction(id, 'favorite');
  const raw = document.getElementById('dealsSearchInput')?.value || '实时热榜';
  renderUnifiedDealPanel(raw, normalizeDealSearchQuery(raw), unifiedDealRows, null);
  showToast(unifiedDealFavorites[id] ? '已收藏优惠' : '已取消收藏');
}

/* ================= 搜索页面 ================= */
const SEARCH_HISTORY_KEY = 'wanba_search_history';
/* 热搜词条：想给大家多曝光什么内容，直接在这个数组里加一条就行（badge可选，不填就不显示小标签） */
const HOT_SEARCHES = [
  { text: '洛杉矶 ADU 改建', badge: '热' },
  { text: '周末免费活动' },
  { text: '社区菜市场推荐' },
  { text: '施工现场实拍' },
  { text: '奶茶探店' },
  { text: '搬家清单' },
];
let searchCatFilter = '全部';
let searchSubcategoryFilter = '全部';
let searchTypeFilter = '全部';
let searchKeyword = '';

function openSearchPage(){
  if(!appNavigation?.isRestoring()) appNavigation?.enter({ type:'search' });
  const overlay = document.getElementById('searchOverlay');
  const input = document.getElementById('searchInput');
  overlay.classList.add('open');
  document.body.classList.add('search-page-open');
  input.value = '';
  searchKeyword = '';
  renderSearchHome();
  // iOS only opens its keyboard when focus happens in the original tap gesture.
  input.focus({preventScroll:true});
  requestAnimationFrame(() => input.focus({preventScroll:true}));
}
function closeSearchPage(){
  document.getElementById('searchOverlay').classList.remove('open');
  document.body.classList.remove('search-page-open');
  document.getElementById('searchInput')?.blur();
}
function getSearchHistory(){
  try { return JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || '[]'); } catch(e){ return []; }
}
function addSearchHistory(kw){
  if(!kw) return;
  let list = getSearchHistory().filter(x => x !== kw);
  list.unshift(kw);
  list = list.slice(0, 10);
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(list));
}
function removeSearchHistoryItem(kw){
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(getSearchHistory().filter(x => x !== kw)));
  renderSearchHome();
}
function clearSearchHistory(){
  localStorage.removeItem(SEARCH_HISTORY_KEY);
  renderSearchHome();
}
/* 初始状态（还没搜索时）：历史记录 + 热搜 */
function renderSearchHome(){
  const body = document.getElementById('searchBody');
  if(!body) return;
  const history = getSearchHistory();
  body.innerHTML = `
    ${history.length ? `
      <div class="search-section-title">
        <span>最近搜索</span>
        <span style="font-size:12px;color:var(--ink-faint);font-weight:400;cursor:pointer;" onclick="clearSearchHistory()">清空</span>
      </div>
      <div class="search-history-tags" style="margin-bottom:22px;">
        ${history.map(kw => `
          <span class="search-history-tag" onclick="performSearch('${kw.replace(/'/g,'')}')">
            ${kw}
            <span class="rm" onclick="event.stopPropagation();removeSearchHistoryItem('${kw.replace(/'/g,'')}')">✕</span>
          </span>
        `).join('')}
      </div>
    ` : ''}
    <div class="search-section-title"><span>近期热搜</span></div>
    <div>
      ${HOT_SEARCHES.map((h, i) => `
        <div class="search-hot-row" onclick="performSearch('${h.text.replace(/'/g,'')}')">
          <span class="search-hot-rank ${i < 3 ? 'top3' : ''}">${i+1}</span>
          <span class="search-hot-text">${h.text}</span>
          ${h.badge ? `<span class="search-hot-badge">${h.badge}</span>` : ''}
        </div>
      `).join('')}
    </div>
  `;
}
function setSearchCatFilter(cat){ searchCatFilter = cat; searchSubcategoryFilter = '全部'; renderSearchResults(); }
function setSearchSubcategoryFilter(item){ searchSubcategoryFilter = item; renderSearchResults(); }
function setSearchTypeFilter(type){ searchTypeFilter = type; renderSearchResults(); }
async function performSearch(kw){
  kw = (kw || '').trim();
  if(!kw) return;
  searchKeyword = kw;
  const input = document.getElementById('searchInput');
  if(input) input.value = kw;
  addSearchHistory(kw);
  searchCatFilter = '全部';
  searchSubcategoryFilter = '全部';
  searchTypeFilter = '全部';
  await renderSearchResults();
}
/* 渲染一级分类筛选 + 二级类型筛选 + 结果 */
async function renderSearchResults(){
  const body = document.getElementById('searchBody');
  if(!body) return;
  if(!searchKeyword){ renderSearchHome(); return; }
  const catOptions = ['全部', ...CATS.filter(c => c.key !== '全部').map(c => c.key)];
  const subcategoryOptions = postSubcategoryOptions(searchCatFilter);
  const typeOptions = ['全部', '用户', '笔记', '地点', '群聊'];
  body.innerHTML = `
    <div class="search-filter-row">
      ${catOptions.map(c => `<button class="search-filter-chip ${searchCatFilter===c?'active':''}" onclick="setSearchCatFilter('${c}')">${c}</button>`).join('')}
    </div>
    ${subcategoryOptions.length ? `<div class="search-filter-row type-row">${['全部', ...subcategoryOptions].map(item => `<button class="search-filter-chip ${searchSubcategoryFilter===item?'active':''}" onclick="setSearchSubcategoryFilter('${item}')">${item}</button>`).join('')}</div>` : ''}
    <div class="search-filter-row type-row">
      ${typeOptions.map(t => `<button class="search-filter-chip ${searchTypeFilter===t?'active':''}" onclick="setSearchTypeFilter('${t}')">${t}</button>`).join('')}
    </div>
    <div id="searchResultsBox"><div class="search-empty">搜索中...</div></div>
  `;
  const kwAtRequestTime = searchKeyword;
  const results = await runSearch(searchKeyword, searchCatFilter, searchSubcategoryFilter, searchTypeFilter);
  if(kwAtRequestTime !== searchKeyword) return; // 搜索期间关键词已变化，结果作废
  const box = document.getElementById('searchResultsBox');
  if(box) box.innerHTML = renderSearchResultsHtml(results);
}
/* 真正执行搜索：笔记本地过滤；用户/地点(认证商家)走数据库真实查询；群聊功能暂未上线 */
async function runSearch(kw, cat, subcategory, type){
  const kwLower = kw.toLowerCase();
  const result = { users: [], posts: [], places: [] };

  if(type === '全部' || type === '笔记'){
    result.posts = posts.filter(p => {
      const matchKw = (p.title||'').toLowerCase().includes(kwLower)
        || (p.content||'').toLowerCase().includes(kwLower)
        || (p.tags||[]).some(t => (t||'').toLowerCase().includes(kwLower));
      const matchCat = (cat === '全部') || normalizeCategory(p.category) === cat;
      const matchSubcategory = (subcategory === '全部') || p.subcategory === subcategory;
      return matchKw && matchCat && matchSubcategory && (p.visibility === 'public' || !p.visibility);
    }).slice(0, 30);
  }

  if(type === '全部' || type === '用户'){
    try {
      result.users = await profileApi?.searchByName({ keyword:kw, limit:20 }) || [];
      result.users.forEach(u => { window._avatarCache[u.user_id] = u.avatar || null; }); // 顺便预热头像缓存
      await ensureAvatarsFor(result.users.map(u => u.user_id));
    } catch(e){ console.warn('用户搜索失败:', e.message); }
  }

  if(type === '全部' || type === '地点'){
    try {
      if(!merchantPublicApi) throw new Error('商家资料接口未初始化');
      let list = await merchantPublicApi.searchVerified({ keyword:kw, limit:20 });
      if(cat !== '全部') list = list.filter(m => normalizeCategory(m.category) === cat);
      list.forEach(m => setMerchantIdentityCache(m.user_id, Object.assign({}, m, { verified: true })));
      result.places = list;
    } catch(e){ console.warn('地点搜索失败:', e.message); }
  }
  // 群聊：暂无此功能，始终空结果
  return result;
}
function renderSearchResultsHtml(r){
  const total = r.users.length + r.posts.length + r.places.length;
  if(!total && searchTypeFilter !== '群聊'){
    return `<div class="search-empty">没有找到"${searchKeyword}"相关的内容<br>换个关键词试试吧</div>`;
  }
  let html = '';
  if(r.users.length){
    html += `<div class="search-result-group-title">用户 (${r.users.length})</div>`;
    html += r.users.map(u => `
      <div class="search-result-user" onclick="openUserPublicPage('${String(u.user_id || '').replace(/'/g, '')}','${String(u.name || '乐生活用户').replace(/'/g, '')}')">
        ${avatarCircleSizedHtml(u.name || '用户', u.user_id, 40)}
        <span style="font-size:14px;color:var(--ink);font-weight:600;display:flex;align-items:center;gap:6px;min-width:0;">${authorNameHtml(u.name || '用户', u.user_id)}</span>
      </div>
    `).join('');
  }
  if(r.posts.length){
    html += `<div class="search-result-group-title">笔记 (${r.posts.length})</div>`;
    html += r.posts.map(p => `
      <div class="search-result-post" onclick="openPostFromSearch(${p.id})">
        ${p.image ? `<img src="${p.image}" alt="">` : ''}
        <div style="flex:1;min-width:0;">
          <div style="font-size:14px;font-weight:600;color:var(--ink);overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${p.title}</div>
          <div style="font-size:12px;color:var(--ink-faint);margin-top:4px;">${catIcon(p.category,14)} ${escHtml(postCategoryPath(p.category, p.subcategory))} · ${p.author} · ${p.time || ''}</div>
        </div>
      </div>
    `).join('');
  }
  if(r.places.length){
    html += `<div class="search-result-group-title">地点 (${r.places.length})</div>`;
    html += r.places.map(m => `
      <div class="search-result-place" onclick="openMerchantPublicPage('${String(m.user_id || '').replace(/'/g, '')}')">
        <div style="width:44px;height:44px;border-radius:10px;overflow:hidden;background:var(--bg-alt);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:20px;">
          ${m.logo ? `<img src="${m.logo}" style="width:100%;height:100%;object-fit:cover;">` : uiIcon('store',22)}
        </div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:14px;font-weight:600;color:var(--ink);display:flex;align-items:center;gap:6px;flex-wrap:wrap;">${escHtml(m.business_name || '商家')} ${identityBadgeHtml(m.user_id)}</div>
          <div style="font-size:12px;color:var(--ink-faint);margin-top:2px;display:flex;align-items:center;gap:4px;">${uiIcon('map',12)} ${escHtml(m.address || '')}</div>
          <div style="font-size:11px;color:var(--sage-dark);margin-top:2px;">${escHtml(merchantCategoryLabel(m.category))}${m.subcategory ? ' / ' + escHtml(m.subcategory) : ''}</div>
        </div>
      </div>
    `).join('');
  }
  if(searchTypeFilter === '全部' || searchTypeFilter === '群聊'){
    html += `<div class="search-result-group-title">群聊</div><div class="search-empty" style="padding:16px 0;">群聊功能暂未上线，敬请期待</div>`;
  }
  return html;
}

/* ---- text validation ---- */
function updateTitleCount(){
  const titleInput = document.getElementById('fTitle');
  const count = titleInput.value.length;
  document.getElementById('titleCount').textContent = count;
  if(count > 30){
    titleInput.value = titleInput.value.substring(0, 30);
    document.getElementById('titleCount').textContent = 30;
  }
}
function updateContentCount(){
  const contentInput = document.getElementById('fContent');
  const count = contentInput.value.length;
  document.getElementById('contentCount').textContent = count;
  if(count > 1000) contentInput.value = contentInput.value.substring(0, 1000);
}

/* ---- device detection ---- */
function isPC(){
  return !('ontouchstart' in window) && !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/* ---- image carousel ---- */
let currentImageIndex = 0;
let touchStartX = 0;
function carouselNav(direction){
  const p = getPost();
  if(!p || !p.images) return;
  currentImageIndex = Math.max(0, Math.min(p.images.length - 1, currentImageIndex + direction));
  updateCarousel();
}
function updateCarousel(){
  const track = document.getElementById('carouselTrack');
  if(!track) return;
  track.style.transition = 'transform .3s ease';
  track.style.transform = `translateX(-${currentImageIndex * 100}%)`;
  const counter = document.getElementById('carouselCounter');
  const p = getPost();
  if(counter && p) counter.textContent = `${currentImageIndex + 1}/${p.images.length}`;
  const dots = document.querySelectorAll('#carouselDots .dot');
  dots.forEach((d,i) => d.classList.toggle('on', i === currentImageIndex));
}
function setupCarouselTouch(){
  const carousel = document.getElementById('carousel');
  const track = document.getElementById('carouselTrack');
  if(!carousel || !track) return;
  const p = getPost();
  const total = p && p.images ? p.images.length : 1;
  let startX = 0, startY = 0, deltaX = 0, deltaY = 0, dragging = false, horizontalSwipe = false;

  carousel.addEventListener('touchstart', e=>{
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    deltaX = 0;
    deltaY = 0;
    dragging = true;
    horizontalSwipe = false;
    track.style.transition = 'none'; // 拖动时关闭动画，实时跟手
  }, {passive:true});

  carousel.addEventListener('touchmove', e=>{
    if(!dragging) return;
    deltaX = e.touches[0].clientX - startX;
    deltaY = e.touches[0].clientY - startY;
    if(!horizontalSwipe && Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 6){
      track.style.transform = `translateX(-${currentImageIndex * 100}%)`;
      return;
    }
    if(Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 6){
      horizontalSwipe = true;
      e.preventDefault();
    }
    if(!horizontalSwipe) return;
    // 第一张往右拖 / 最后一张往左拖时增加阻尼
    if((currentImageIndex === 0 && deltaX > 0) || (currentImageIndex === total-1 && deltaX < 0)){
      deltaX = deltaX / 3;
    }
    const pct = (deltaX / carousel.offsetWidth) * 100;
    track.style.transform = `translateX(calc(-${currentImageIndex * 100}% + ${pct}%))`;
  }, {passive:false});

  carousel.addEventListener('touchend', ()=>{
    if(!dragging) return;
    dragging = false;
    // 滑动超过 1/4 宽度则翻页，否则弹回
    if(horizontalSwipe && Math.abs(deltaX) > carousel.offsetWidth / 4){
      currentImageIndex += (deltaX < 0 ? 1 : -1);
      currentImageIndex = Math.max(0, Math.min(total - 1, currentImageIndex));
    }
    updateCarousel();
  }, false);
}

function renderPostModal(){
  const p = getPost();
  if(!p){
    document.getElementById('postModal').innerHTML = postDetailLoadingHtml();
    return;
  }
  let media = '';
  const isImagePost = !p.youtube && !!((Array.isArray(p.images) && p.images.length) || p.image);
  const visibleContent = cleanPostContent(p.content);
  if(p.youtube){
    const ytVertical = getPostYoutubeVertical(p);
    const safeYtId = String(p.youtube || '').replace(/[^A-Za-z0-9_-]/g, '');
    media = `<div class="yt-wrap ${ytVertical ? 'vertical' : ''}">
      <iframe id="ytFrame-${safeYtId}" src="${youtubeEmbedUrl(safeYtId)}" title="YouTube video" allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen onload="primeYoutubeSound('${safeYtId}')"></iframe>
    </div>`;
  } else if(p.images && p.images.length > 0){
    media = `
      <div class="image-carousel" id="carousel">
        <div class="carousel-track" id="carouselTrack">
          ${p.images.map(img => `<div class="carousel-slide"><img src="${img}" alt=""></div>`).join('')}
        </div>
        ${p.images.length > 1 && isPC() ? `
          <button class="carousel-nav prev" onclick="carouselNav(-1)">‹</button>
          <button class="carousel-nav next" onclick="carouselNav(1)">›</button>
        ` : ''}
        ${p.images.length > 1 ? `<div class="carousel-counter" id="carouselCounter">1/${p.images.length}</div>` : ''}
      </div>`;
  } else if(p.image){
    media = `<img src="${p.image}" alt="">`;
  }
  const mediaTools = '';

  const activityPeriod = activityPeriodLabel(p);
  const ticketEventBlock = p.event?.ticketing && p.event?.ticket_event_id ? `
    <div class="event-box ticket-event-post-box">
      <div class="row">
        <span class="label">${uiIcon('ticket',14)} 票务活动</span>
        <span class="event-nums">${activityPeriod ? escHtml(activityPeriod) : '活动时间以票务页为准'}</span>
      </div>
      <div class="event-foot">
        <span class="event-nums">选择票种或座位后即可购票</span>
        <button class="btn-rsvp" onclick="openTicketEventFromPost(${JSON.stringify(String(p.event.merchant_slug || ''))},${JSON.stringify(String(p.event.ticket_event_id || ''))})">购票 / 选座</button>
      </div>
    </div>` : '';
  const eventBlock = ticketEventBlock || (isSignupEvent(p.event) ? `
    <div class="event-box">
      <div class="row">
        <span class="label">${uiIcon('calendar',14)} 活动报名</span>
        <span class="event-nums">截止 ${p.event.deadline}</span>
      </div>
      <div class="progress"><div class="progress-fill" style="width:${Math.min(100, p.event.registered/p.event.capacity*100)}%"></div></div>
      <div class="event-foot">
        <span class="event-nums">${p.event.registered} / ${p.event.capacity} 人已报名</span>
        <button class="btn-rsvp ${p.event.userJoined?'done':''}" onclick="rsvp()">${p.event.userJoined?'✓ 已报名':'我要报名'}</button>
      </div>
    </div>` : (activityPeriod ? `<div class="event-box" style="padding:12px 14px;"><div class="row" style="margin:0;"><span class="label">${uiIcon('calendar',14)} 活动时间</span><span class="event-nums">${escHtml(activityPeriod)}</span></div></div>` : ''));

  const commentThreads = buildCommentThreads(p.comments || []);
  const commentsHtml = commentThreads.map(t => renderCommentThread(t)).join('') || `<div style="font-size:13px;color:var(--ink-faint);padding:6px 0 12px;">还没有评论,来说第一句吧</div>`;
  const authorUserId = String(p.user_id || '').replace(/'/g, '');
  const safeAuthor = escHtml(p.author || '乐生活用户');
  const isOwnPost = !!(session && session.user && String(p.user_id || '') === String(session.user.id));

  const postModal = document.getElementById('postModal');
  const postOverlay = document.getElementById('postOverlay');
  postModal.classList.toggle('image-detail-layout', isImagePost);
  postOverlay.classList.toggle('image-detail-open', isImagePost);
  const detailContent = `
      <div class="modal-body">
        <h2 class="modal-title display">${p.title}</h2>
        <div class="modal-content">${visibleContent}</div>
        <div class="xhs-tags">${catIcon(p.category, 18)} ${escHtml(postCategoryPath(p.category, p.subcategory))}${(p.tags && p.tags.length) ? ' ' + p.tags.map(customPostTagHtml).filter(Boolean).join(' ') : ''}</div>
        ${communityMetaHtml(p)}
        ${p.location ? `<div style="font-size:13px;color:var(--ink-faint);margin:-6px 0 10px;display:flex;align-items:center;gap:4px;">${uiIcon('map',13)} ${p.location}</div>` : ''}
        <div class="xhs-time">编辑于 ${p.time} · 洛杉矶</div>
        ${eventBlock}
        <div class="xhs-comments-count">共 ${countComments(p)} 条评论</div>
        <div id="commentsList">${commentsHtml}</div>
        <div style="height:10px;"></div>
      </div>`;
  const detailMain = isImagePost ? `
      <div class="xhs-detail-grid">
        <div class="xhs-media-column">
          ${media ? `<div class="modal-media">${media}${mediaWatermarkHtml(p.author)}${mediaTools}</div>` : ''}
          ${p.images && p.images.length > 1 ? `<div class="carousel-dots" id="carouselDots">${p.images.map((_,i) => `<span class="dot ${i===0?'on':''}"></span>`).join('')}</div>` : ''}
        </div>
        <div class="xhs-content-column">${detailContent}</div>
      </div>` : `
      ${media ? `<div class="modal-media ${p.youtube ? 'video' : ''}">${media}${mediaWatermarkHtml(p.author)}${mediaTools}</div>` : ''}
      ${p.images && p.images.length > 1 ? `<div class="carousel-dots" id="carouselDots">${p.images.map((_,i) => `<span class="dot ${i===0?'on':''}"></span>`).join('')}</div>` : ''}
      ${detailContent}`;

  postModal.innerHTML = `
    <div class="xhs-topbar">
      <button class="xhs-back" onclick="returnFromPost()">‹</button>
      <span onclick="openAuthorHome('${authorUserId}')" style="cursor:pointer;display:inline-flex;">${avatarCircleHtml(p.author, p.user_id)}</span>
      <span class="xhs-author-name" onclick="openAuthorHome('${authorUserId}')" style="cursor:pointer;display:flex;align-items:center;gap:6px;min-width:0;">${safeAuthor}${identityBadgeHtml(p.user_id)}</span>
      ${p.user_id && !isOwnPost ? `<button class="xhs-follow ${isFollowing(p.user_id)?'on':''}" id="followBtn" onclick="toggleFollowUser('${p.user_id}','${(p.author||'').replace(/'/g,'')}')">${isFollowing(p.user_id)?'已关注':'关注'}</button>` : ''}
      ${isOwnPost ? `<button class="xhs-share" title="管理笔记" aria-label="管理笔记" onclick="openOwnerSheet(event)" style="font-size:20px;position:relative;z-index:6;">☰</button>` : `<button class="xhs-share" title="转发" onclick="openPostShare(${JSON.stringify(p.id)})">${uiIcon('share',19)}</button>`}
    </div>
    <div class="xhs-scroll">
      ${detailMain}
    </div>
    <div class="xhs-bottombar">
      <input type="text" id="newCommentInput" placeholder="说点什么…" readonly
        onclick="openCommentComposer()" onfocus="this.blur()">
      <button class="xhs-send" id="xhsSend" onclick="openCommentComposer()">发送</button>
      <button class="xhs-act ${p.liked?'liked':''}" id="xhsLike" onclick="toggleLike()">
        <span class="ico">${p.liked?'♥':'♡'}</span><span id="xhsLikeNum">${p.likes}</span>
      </button>
      <button class="xhs-act ${p.collected?'collected':''}" id="xhsCollect" onclick="toggleCollect()">
        <span class="ico">${p.collected?'★':'☆'}</span><span id="xhsFavNum">${p.favs||0}</span>
      </button>
      <button class="xhs-act" onclick="openCommentComposer()">
        <span class="ico">${uiIcon('message',20)}</span><span id="xhsCmtNum">${countComments(p)}</span>
      </button>
    </div>
  `;
  // 浏览器与封装 App 都支持水平翻图；只在明确水平滑动时阻止页面的上下滚动。
  setupCarouselTouch();
  warmPostMediaCache([p], true);
  if(p.youtube){
    primeYoutubeSound(String(p.youtube || '').replace(/[^A-Za-z0-9_-]/g, ''));
  }
}
/* 关注状态查询（基于 follows 表） */
function isFollowing(uid){
  const me = session && session.user ? session.user.id : null;
  if(!me || !uid) return false;
  return (window._followRows || []).some(f => f.follower_id === me && f.followee_id === uid && f.active);
}
function isFollowedBy(uid){
  const me = session && session.user ? session.user.id : null;
  if(!me || !uid) return false;
  return (window._followRows || []).some(f => f.follower_id === uid && f.followee_id === me && f.active);
}
function followRelationshipLabel(uid){
  return isFollowing(uid) ? (isFollowedBy(uid) ? '互相关注' : '已关注') : (isFollowedBy(uid) ? '回关' : '关注');
}
async function toggleFollowUser(uid, name){
  if(!session || !session.user){ showToast('请先登录'); openAuth(); return; }
  const me = session.user.id;
  const nick = (currentUser && currentUser.name) || (session.user.user_metadata && session.user.user_metadata.name) || session.user.email.split('@')[0];
  const now = isFollowing(uid);
  const newActive = !now;
  try {
    const rows = await followApi?.setFollow({ followerId:me, followeeId:uid, followerName:nick, active:newActive });
    if(!rows) throw new Error('关注接口未初始化');
    // 更新本地缓存
    window._followRows = window._followRows || [];
    const ex = window._followRows.find(f => f.follower_id === me && f.followee_id === uid);
    if(ex) ex.active = newActive;
    else if(rows[0]) window._followRows.push(rows[0]);
    else window._followRows.push({ follower_id: me, follower_name: nick, followee_id: uid, active: newActive, created_at: new Date().toISOString() });
    const btn = document.getElementById('followBtn');
    if(btn){ btn.classList.toggle('on', newActive); btn.textContent = newActive ? followRelationshipLabel(uid) : '关注'; }
    renderProfileFollowStats();
    showToast(newActive ? '✓ 已关注' : '已取消关注');
    if(document.getElementById('msgDetail') && document.getElementById('msgDetail').style.display !== 'none' && window._msgCat === 'fans'){
      openMsgCat('fans', true);
    }
  } catch(e){ showToast('操作失败：' + e.message); }
}
async function toggleCollect(){
  if(!session || !session.user){ showToast('请先登录后再收藏'); openAuth(); return; }
  const p = getPost();
  p.collected = !p.collected;
  const btn = document.getElementById('xhsCollect');
  if(btn){
    btn.classList.toggle('collected', p.collected);
    btn.querySelector('.ico').textContent = p.collected ? '★' : '☆';
    const fn = document.getElementById('xhsFavNum');
    p.favs = (p.favs||0) + (p.collected ? 1 : -1);
    if(p.favs < 0) p.favs = 0;
    if(fn) fn.textContent = p.favs;
  }
  showToast(p.collected ? '✓ 已收藏' : '已取消收藏');
  try {
    if(p.collected){
      const nick = (session.user.user_metadata && session.user.user_metadata.name) || session.user.email.split('@')[0];
      const res = await engagementApi?.setReaction({ table:'favorites', postId:p.id, userId:session.user.id, name:nick, active:true });
      if(!res.ok && res.status !== 409) throw new Error(res.status);
    } else {
      await engagementApi?.setReaction({ table:'favorites', postId:p.id, userId:session.user.id, active:false });
    }
  } catch(e){ console.warn('收藏同步失败:', e); }
}
function countComments(p){
  return (p.comments || []).length;
}
/* 2.93.1：按 root 主评论分组，回复（含"回复的回复"）统一展开在主评论下方——小红书式楼中楼 */
function buildCommentThreads(comments){
  return window.LeshenghuoCommentThreading?.buildThreads(comments) || [];
}
/* 统一刷新评论列表+计数（新增/删除/回复共用） */
function renderCommentsList(p){
  const threads = buildCommentThreads(p.comments || []);
  const list = document.getElementById('commentsList');
  if(list){
    list.innerHTML = threads.map(t => renderCommentThread(t)).join('') ||
      '<div style="text-align:center;color:var(--ink-faint);font-size:13px;padding:16px 0;">还没有评论，来抢沙发～</div>';
  }
  const total = countComments(p);
  const countEl = document.querySelector('.xhs-comments-count');
  if(countEl) countEl.textContent = `共 ${total} 条评论`;
  const cmtNum = document.getElementById('xhsCmtNum');
  if(cmtNum) cmtNum.textContent = total;
}
function renderCommentThread(t){
  const repliesHtml = t.replies.map(r => renderComment(r, true)).join('');
  return `${renderComment(t.root, false)}${repliesHtml ? `<div class="replies">${repliesHtml}</div>` : ''}`;
}
function renderComment(c, isReply){
  const mine = !!(session && session.user && String(c.user_id || '') === String(session.user.id));
  const replyPrefix = (isReply && c.reply_to_name) ? `<span style="color:var(--sage-dark);font-weight:600;">回复 @${c.reply_to_name}：</span>` : '';
  const uid = String(c.user_id || '').replace(/'/g, '');
  const safeName = String(c.name || '乐生活用户').replace(/'/g, '');
  return `
    <div class="comment">
      ${avatarHomeLinkHtml(c.user_id, c.name, 30)}
      <div class="comment-body">
        <div class="comment-name" onclick="openUserPublicPage('${uid}','${safeName}')" style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;cursor:pointer;">${authorNameHtml(c.name, c.user_id)} <span style="font-weight:400;color:var(--ink-faint);font-size:11px;">${c.time || ''}</span></div>
        <div class="comment-text">${replyPrefix}${c.text}</div>
        <div class="comment-actions">
          <button type="button" onclick="toggleReplyInput(${c.id},event)">回复</button>
        </div>
      </div>
      ${mine ? `<button onclick="deleteComment(${c.id})" title="删除这条评论" style="border:1px solid var(--line);background:#fff;color:var(--berry);cursor:pointer;font-size:11px;font-weight:800;padding:5px 7px;border-radius:999px;align-self:flex-start;">删除</button>` : ''}
    </div>
  `;
}
/* 评论统一使用独立半屏编辑器，避免 WebView 键盘把笔记详情与首页层同时挤开。 */
let commentComposerParentId = null;
function syncCommentComposerViewport(){
  const viewport = window.visualViewport;
  const layoutHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
  const viewportTop = Math.max(0, Math.round(viewport?.offsetTop || 0));
  const visibleHeight = Math.max(280, Math.round(viewport?.height || layoutHeight || 640));
  const keyboardInset = Math.max(0, Math.round(layoutHeight - visibleHeight - viewportTop));
  document.documentElement.style.setProperty('--comment-composer-visible-height', `${visibleHeight}px`);
  document.documentElement.style.setProperty('--comment-composer-keyboard-inset', `${keyboardInset}px`);
}
function bindCommentComposerViewport(){
  if(window.__leshenghuoCommentViewportBound) return;
  window.__leshenghuoCommentViewportBound = true;
  window.visualViewport?.addEventListener('resize', syncCommentComposerViewport);
  window.visualViewport?.addEventListener('scroll', syncCommentComposerViewport);
  window.addEventListener('orientationchange', () => setTimeout(syncCommentComposerViewport, 120));
}
function openCommentComposer(parentId=null){
  if(!session || !session.user){ showToast('请先登录后再评论'); openAuth(); return; }
  const p = getPost();
  if(!p) return;
  const parent = parentId == null ? null : (p.comments || []).find(c => String(c.id) === String(parentId));
  if(parentId != null && !parent){ showToast('找不到要回复的评论'); return; }
  commentComposerParentId = parent ? parent.id : null;
  const overlay = document.getElementById('commentComposerOverlay');
  const sheet = document.getElementById('commentComposerSheet');
  if(!overlay || !sheet) return;
  const postOverlay = document.getElementById('postOverlay');
  if(postOverlay && activePostId != null) postOverlay.classList.add('open');
  if(overlay.parentElement !== document.body) document.body.appendChild(overlay);
  const targetName = parent ? String(parent.name || '乐生活用户') : '';
  sheet.innerHTML = `<div class="comment-composer-head"><span></span><b>${parent ? `回复 ${escHtml(targetName)}` : '写评论'}</b><button class="comment-composer-close" onclick="closeCommentComposer()" aria-label="关闭">×</button></div><textarea id="commentComposerText" class="comment-composer-text" maxlength="500" placeholder="${parent ? `回复 ${escHtml(targetName)}…` : '说点什么…'}"></textarea><button class="comment-composer-submit" onclick="submitCommentComposer()">发送</button>`;
  bindCommentComposerViewport();
  syncCommentComposerViewport();
  document.documentElement.classList.add('reply-composer-open');
  document.body.classList.add('reply-composer-open');
  overlay.classList.add('open');
  void overlay.offsetHeight;
  window.setTimeout(() => document.getElementById('commentComposerText')?.focus(), 90);
}
function closeCommentComposer(){
  document.getElementById('commentComposerText')?.blur();
  document.getElementById('commentComposerOverlay')?.classList.remove('open');
  document.documentElement.classList.remove('reply-composer-open');
  document.body.classList.remove('reply-composer-open');
  document.documentElement.style.removeProperty('--comment-composer-keyboard-inset');
  document.documentElement.style.removeProperty('--comment-composer-visible-height');
  commentComposerParentId = null;
}
function toggleReplyInput(id,event){
  event?.preventDefault?.();
  event?.stopPropagation?.();
  openCommentComposer(id);
}
async function submitCommentComposer(){
  const input = document.getElementById('commentComposerText');
  const text = String(input?.value || '').trim();
  if(!text) return;
  if(commentComposerParentId != null) await submitReply(commentComposerParentId, text);
  else await addComment(text);
}
/* 回复某条评论/回复：真正写入数据库（parent_id + reply_to_user_id + reply_to_name） */
async function submitReply(parentId, textOverride=null){
  const input = document.getElementById(`replyText-${parentId}`);
  const text = String(textOverride == null ? input?.value : textOverride || '').trim();
  if(!text) return;
  if(!session || !session.user){ showToast('请先登录后再回复'); openAuth(); return; }
  const p = getPost();
  const parent = (p.comments || []).find(c => String(c.id) === String(parentId));
  if(!parent){ showToast('找不到要回复的评论'); return; }
  const nick = myNick();
  try {
    const res = await engagementApi?.createComment({
      post_id: p.id, user_id: session.user.id, name: nick, text,
      parent_id: parentId, reply_to_user_id: parent.user_id || null, reply_to_name: parent.name
    });
    if(!res.ok){
      const t = await res.text();
      throw new Error(`${res.status}: ${t.slice(0,80)}`);
    }
    const saved = (await res.json())[0];
    p.comments.push({
      id: saved.id, name: nick, text, user_id: session.user.id,
      parent_id: parentId, reply_to_name: parent.name,
      time: new Date().toLocaleString('zh-CN')
    });
    renderCommentsList(p);
    closeCommentComposer();
    showToast('回复已发送');
  } catch(e){
    console.warn('回复保存失败:', e.message);
    showToast('回复发送失败，请重试');
  }
}
/* 收集某条评论的所有下级回复id（本地级联删除，数据库侧已有 ON DELETE CASCADE 兜底） */
function collectDescendantIds(comments, id){
  return window.LeshenghuoCommentThreading?.descendantIds(comments, id) || new Set([id]);
}
async function deleteComment(id){
  if(!confirm('删除这条评论？其下的回复也会一并删除')) return;
  try {
    const res = await engagementApi?.deleteComment(id);
    if(!res.ok) throw new Error('删除失败 ' + res.status);
    const p = getPost();
    const toRemove = collectDescendantIds(p.comments, id);
    p.comments = p.comments.filter(c => !toRemove.has(c.id));
    renderCommentsList(p);
    showToast('评论已删除');
  } catch(e){ showToast('删除失败：' + e.message); }
}
async function addComment(textOverride=null){
  const input = document.getElementById('newCommentInput');
  const text = String(textOverride == null ? input?.value : textOverride || '').trim();
  if(!text) return;
  if(!session || !session.user){
    showToast('请先登录后再评论');
    openAuth();
    return;
  }
  const p = getPost();
  const nick = myNick();
  try {
    const res = await engagementApi?.createComment({ post_id: p.id, user_id: session.user.id, name: nick, text });
    if(!res.ok){
      const t = await res.text();
      throw new Error(`${res.status}: ${t.slice(0,80)}`);
    }
    const saved = (await res.json())[0];
    p.comments.push({
      id: saved.id, name: nick, text, user_id: session.user.id,
      time: new Date().toLocaleString('zh-CN')
    });
    renderCommentsList(p);
    if(input) input.value = '';
    const sendBtn = document.getElementById('xhsSend');
    if(sendBtn) sendBtn.style.display = 'none';
    closeCommentComposer();
    showToast('评论已发送');
  } catch(e){
    console.warn('评论保存失败:', e.message);
    showToast('评论发送失败，请重试');
  }
}
async function toggleLike(){
  if(!session || !session.user){ showToast('请先登录后再点赞'); openAuth(); return; }
  const p = getPost();
  const willLike = !p.liked;
  // 乐观更新UI
  p.liked = willLike;
  p.likes += willLike ? 1 : -1;
  const btn = document.getElementById('xhsLike');
  if(btn){
    btn.classList.toggle('liked', p.liked);
    btn.querySelector('.ico').textContent = p.liked ? '♥' : '♡';
    const num = document.getElementById('xhsLikeNum');
    if(num) num.textContent = p.likes;
  }
  renderFeed();
  try {
    if(willLike){
      const nick = (session.user.user_metadata && session.user.user_metadata.name) || session.user.email.split('@')[0];
      const res = await engagementApi?.setReaction({ table:'likes', postId:p.id, userId:session.user.id, name:nick, active:true });
      if(!res.ok && res.status !== 409) throw new Error(res.status);
    } else {
      await engagementApi?.setReaction({ table:'likes', postId:p.id, userId:session.user.id, active:false });
    }
  } catch(e){
    console.warn('点赞同步失败:', e);
    showToast('操作未同步，请重试');
  }
}
function rsvp(){
  if(!session || !session.user){ showToast('请先登录后再报名'); openAuth(); return; }
  const p = getPost();
  if(!isSignupEvent(p.event) || p.event.userJoined) return;
  if(p.event.registered >= p.event.capacity){ showToast('名额已满'); return; }
  p.event.registered += 1;
  p.event.userJoined = true;
  renderPostModal();
  renderFeed();
  savePosts();
  showToast('报名成功，已为你留好位置');
}

/* ---------------- compose ---------------- */
/* 发布入口分发：认证商家先看专属发布仪表盘；普通用户/未认证商家和以前一样直接进入发布 */
function handlePublishClick(){
  if(currentMerchant && currentMerchant.verified){
    openMerchantPublishDashboard();
  } else {
    openCompose();
  }
}
function openMerchantPublishDashboard(){
  document.getElementById('merchantPublishOverlay').classList.add('open');
  renderMerchantDashboard();
}
function closeMerchantPublishDashboard(){
  document.getElementById('merchantPublishOverlay').classList.remove('open');
}

/* ====== 乐生活 3.1：商家 AI 发布流程 ====== */
function merchantAiTodayKey(){
  const uid = session && session.user ? session.user.id : 'guest';
  return `leshenghuo_ai_usage_${uid}_${new Date().toISOString().slice(0,10)}`;
}
function getMerchantAiDailyUsage(){
  return parseInt(localStorage.getItem(merchantAiTodayKey()) || '0', 10) || 0;
}
function setMerchantAiDailyUsage(n){
  localStorage.setItem(merchantAiTodayKey(), String(Math.max(0, n)));
}
function canUseMerchantAi(){
  return getMerchantAiDailyUsage() < MERCHANT_AI_DAILY_LIMIT;
}
function consumeMerchantAiUse(){
  const used = getMerchantAiDailyUsage();
  if(used >= MERCHANT_AI_DAILY_LIMIT) return false;
  setMerchantAiDailyUsage(used + 1);
  return true;
}
function merchantAiUsesLeft(){
  return Math.max(0, MERCHANT_AI_DAILY_LIMIT - getMerchantAiDailyUsage());
}
function aiEsc(s){
  return (s == null ? '' : String(s)).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function syncMerchantAiMaterialDraft(){
  if(!merchantAiState) return;
  const input = document.getElementById('merchantAiRawText');
  if(input) merchantAiState.rawText = input.value;
  const videoInput = document.getElementById('merchantAiVideoUrl');
  if(videoInput) merchantAiState.videoUrl = videoInput.value.trim();
}
function merchantAiHasWork(){
  if(!merchantAiState) return false;
  return !!(
    merchantAiState.rawText ||
    (merchantAiState.images && merchantAiState.images.length) ||
    merchantAiState.videoUrl ||
    (merchantAiState.versions && merchantAiState.versions.length) ||
    merchantAiState.publishedPostId
  );
}
function openMerchantAiFlow(){
  if(!(session && session.user)){
    showToast('请先登录后再使用 AI 发布');
    openAuth('login');
    return;
  }
  closeMerchantPublishDashboard();
  merchantAiState = {
    step: 1,
    type: '新品推荐',
    tone: '自然',
    rawText: '',
    images: [],
    videoUrl: '',
    activePlatform: '乐生活',
    versions: [],
    selectedVersion: 0,
    regenCount: 0,
    publishedPostId: null,
    isGenerating: false,
    generateStartedAt: 0,
    isPublishing: false,
    publishWarning: '',
    platforms: { leshenghuo:true, xhs:true, instagram:true, facebook:true, google:true, x:false, english:true }
  };
  document.getElementById('merchantAiOverlay').classList.add('open');
  renderMerchantAiFlow();
}
function closeMerchantAiFlow(force=false){
  syncMerchantAiMaterialDraft();
  syncMerchantAiEdits();
  if(!force && merchantAiHasWork()){
    document.getElementById('merchantAiExitConfirm').classList.add('open');
    return;
  }
  stopMerchantAiProgressTimer();
  document.getElementById('merchantAiOverlay').classList.remove('open');
  if(force) merchantAiState = null;
}
function closeMerchantAiExitConfirm(){
  document.getElementById('merchantAiExitConfirm').classList.remove('open');
}
function confirmMerchantAiExit(){
  closeMerchantAiExitConfirm();
  closeMerchantAiFlow(true);
}
function finishMerchantAiFlow(){
  closeMerchantAiFlow(true);
}
function merchantAiBack(){
  if(!merchantAiState) return closeMerchantAiFlow();
  syncMerchantAiMaterialDraft();
  if(merchantAiState.step <= 1){ closeMerchantAiFlow(); return; }
  merchantAiState.step -= 1;
  renderMerchantAiFlow();
}
function merchantAiStepLabel(step){
  return ['类型','素材','预览','平台','成功'][step - 1] || '';
}
function merchantAiStepper(step){
  return `<div class="ai-stepper">${[1,2,3,4,5].map(n => `
    <div class="ai-step ${n < step ? 'done' : ''} ${n === step ? 'active' : ''}">
      <div class="dot">${n < step ? '✓' : n}</div>
      <label>${merchantAiStepLabel(n)}</label>
    </div>
  `).join('')}</div>`;
}
function renderMerchantAiFlow(){
  if(!merchantAiState) return;
  const body = document.getElementById('merchantAiBody');
  const topTitle = document.getElementById('merchantAiTopTitle');
  if(topTitle) topTitle.textContent = merchantAiState.step === 5 ? '发布成功' : 'AI 发一篇';
  if(!body) return;
  if(merchantAiState.step === 1) body.innerHTML = renderMerchantAiTypeStep();
  if(merchantAiState.step === 2) body.innerHTML = renderMerchantAiMaterialStep();
  if(merchantAiState.step === 3) body.innerHTML = renderMerchantAiPreviewStep();
  if(merchantAiState.step === 4) body.innerHTML = renderMerchantAiPlatformStep();
  if(merchantAiState.step === 5) body.innerHTML = renderMerchantAiSuccessStep();
  if(merchantAiState.step === 2) setTimeout(updateMerchantAiVideoPreview, 0);
  if(merchantAiState.isGenerating) startMerchantAiProgressTimer();
  else stopMerchantAiProgressTimer();
}
function renderMerchantAiTypeStep(){
  const types = [
    ['新品推荐','food','新菜、饮品、到货','var(--berry-light)'],
    ['优惠活动','bag','折扣、套餐、会员日','var(--sage-light)'],
    ['店铺动态','map','营业、排队、现场','var(--sky-light)'],
    ['种草笔记','spark','适合乐生活信息流','var(--bg-alt)'],
    ['节日提醒','calendar','周末、节庆、限定','var(--sage-light)'],
    ['自定义内容','edit','一句话自由生成','var(--berry-light)'],
    ['视频创作','upload','暂未开放','var(--bg-alt)', true]
  ];
  return `
    ${merchantAiStepper(1)}
    <h3 class="ai-headline">今天想发布什么？</h3>
    <p class="ai-sub">选择一个内容方向，乐生活会帮你生成适合本地用户看的文案。</p>
    <div class="ai-note">当前版本由后端真实 AI 生成标题、正文和多平台文案；价格、库存和优惠数字仍需商家自己确认，AI 不会代填事实信息。</div>
    <div class="ai-type-grid">
      ${types.map(t => `
        <button class="ai-type-card ${merchantAiState.type === t[0] ? 'selected' : ''} ${t[4] ? 'disabled' : ''}"
          onclick="${t[4] ? "showToast('视频 AI 创作暂未开放，当前只能用图片生成文案')" : `selectMerchantAiType('${t[0]}')`}">
          <div class="ai-type-icon" style="background:${t[3]};color:var(--sage-dark);">${uiIcon(t[1],18)}</div>
          <b>${t[0]}</b><span>${t[2]}</span>
        </button>
      `).join('')}
    </div>
    <div class="ai-tip"><strong>AI 提示</strong><span>越像老板平时说话，生成结果越自然。先不用写完整文案，一句话就够。</span></div>
    <button class="ai-primary" onclick="merchantAiState.step=2;renderMerchantAiFlow();">下一步</button>
  `;
}
function selectMerchantAiType(type){
  merchantAiState.type = type;
  renderMerchantAiFlow();
}
function renderMerchantAiMaterialStep(){
  if(merchantAiState.isGenerating) return renderMerchantAiGeneratingStep();
  return `
    ${merchantAiStepper(2)}
    <h3 class="ai-headline">告诉 AI 重点</h3>
    <p class="ai-sub">用老板自己的话描述就好，乐生活会整理成适合多个平台的版本。</p>
    <div class="ai-note">AI 会整理你提供的素材，但不会编造价格、库存、折扣比例、活动日期等事实信息；这些内容以商家实际情况为准。</div>
    <div class="ai-quota">今日 AI 使用 ${getMerchantAiDailyUsage()}/${MERCHANT_AI_DAILY_LIMIT} 次，还剩 ${merchantAiUsesLeft()} 次。生成和重生成都会计入。</div>
    <div class="ai-label">一句话内容</div>
    <textarea class="ai-textarea" id="merchantAiRawText" maxlength="300" placeholder="例如：今天新上了芒果千层，下午茶买二送一，适合附近上班族和学生来店里坐坐。" oninput="syncMerchantAiMaterialDraft()">${aiEsc(merchantAiState.rawText)}</textarea>
    <div class="ai-label">上传图片</div>
    <input type="file" id="merchantAiImagesInput" accept="image/*" multiple style="display:none" onchange="handleMerchantAiImageUpload(event)">
    <div class="ai-upload-grid">
      ${[0,1,2].map(i => merchantAiState.images[i] ? `<div class="ai-thumb"><img src="${merchantAiState.images[i]}" alt="" style="width:100%;height:100%;object-fit:cover;"></div>` : `<div class="ai-thumb"></div>`).join('')}
      <button class="ai-thumb add" onclick="document.getElementById('merchantAiImagesInput').click()">＋</button>
    </div>
    <div class="ai-video-disabled">
      <div style="font-size:20px;color:var(--ink-faint);">${uiIcon('upload',20)}</div>
      <div><b>视频 AI 创作暂未开放</b><span>入口保留，当前只能上传图片生成文案。</span></div>
    </div>
    <div class="ai-label">视频链接</div>
    <input id="merchantAiVideoUrl" type="url" value="${aiEsc(merchantAiState.videoUrl || '')}" placeholder="粘贴 YouTube 视频链接" oninput="syncMerchantAiMaterialDraft();updateMerchantAiVideoPreview()" style="width:100%;border:1.5px solid var(--line);border-radius:12px;padding:11px 12px;font-family:inherit;color:var(--ink);">
    <div class="youtube-preview" id="merchantAiVideoPreview"></div>
    <div class="ai-label">选择语气</div>
    <div class="ai-tone-row">
      ${['自然','种草','专业','促销'].map(t => `<button class="ai-tone ${merchantAiState.tone === t ? 'on' : ''}" onclick="selectMerchantAiTone('${t}')">${t}</button>`).join('')}
    </div>
    <button class="ai-primary" onclick="generateMerchantAiContent(false)" ${merchantAiState.isGenerating ? 'disabled style="opacity:.62;"' : ''}>${merchantAiState.isGenerating ? '整理中...' : '生成文案'}</button>
  `;
}
function renderMerchantAiGeneratingStep(){
  const elapsed = merchantAiGenerateElapsed();
  return `
    ${merchantAiStepper(2)}
    <div class="ai-generating-card">
      <div class="ai-spinner"></div>
      <div class="ai-generating-title">AI 正在整理文案</div>
      <div class="ai-generating-sub">正在生成中文主稿和英文版，通常需要 30-60 秒。请不要关闭页面。</div>
      <div class="ai-progress-track"><div class="ai-progress-bar" id="merchantAiProgressBar" style="width:${merchantAiProgressPercent(elapsed)}%;"></div></div>
      <div class="ai-progress-meta"><span id="merchantAiProgressText">已等待 ${elapsed} 秒</span><span>预计 60 秒内完成</span></div>
    </div>
    <div class="ai-tip"><strong>正在工作</strong><span>这不是卡住。AI 会先写中文稿，再翻译英文版，完成后自动进入预览页。</span></div>
  `;
}
function merchantAiGenerateElapsed(){
  if(!merchantAiState || !merchantAiState.generateStartedAt) return 0;
  return Math.max(0, Math.floor((Date.now() - merchantAiState.generateStartedAt) / 1000));
}
function merchantAiProgressPercent(elapsed){
  return Math.min(96, Math.max(12, Math.round((elapsed / 60) * 100)));
}
function updateMerchantAiProgressUi(){
  if(!merchantAiState || !merchantAiState.isGenerating) return;
  const elapsed = merchantAiGenerateElapsed();
  const text = document.getElementById('merchantAiProgressText');
  const bar = document.getElementById('merchantAiProgressBar');
  if(text) text.textContent = `已等待 ${elapsed} 秒`;
  if(bar) bar.style.width = `${merchantAiProgressPercent(elapsed)}%`;
}
function startMerchantAiProgressTimer(){
  updateMerchantAiProgressUi();
  if(merchantAiProgressTimer) return;
  merchantAiProgressTimer = setInterval(updateMerchantAiProgressUi, 1000);
}
function stopMerchantAiProgressTimer(){
  if(!merchantAiProgressTimer) return;
  clearInterval(merchantAiProgressTimer);
  merchantAiProgressTimer = null;
}
function updateMerchantAiVideoPreview(){
  const input = document.getElementById('merchantAiVideoUrl');
  const box = document.getElementById('merchantAiVideoPreview');
  if(!input || !box) return;
  const raw = input.value.trim();
  if(!raw){
    box.classList.remove('open');
    box.innerHTML = '';
    return;
  }
  const info = extractVideoInfo(raw);
  box.classList.add('open');
  if(!info){
    box.innerHTML = `<div class="youtube-preview-note">${uiIcon('alert',14)} 目前仅支持 YouTube 视频链接。</div>`;
    return;
  }
  if(info.provider === 'youtube'){
    const shortHint = isYoutubeVerticalSource(info.url) ? ' · 已按竖屏视频展示' : '';
    box.innerHTML = `<div class="youtube-preview-thumb">${youtubeThumbImgHtml(info.id, 'YouTube封面')}<div class="play-badge">${playIcon()}</div></div><div class="youtube-preview-note">${uiIcon('video',14)} 已识别 YouTube 视频${shortHint}。</div>`;
  }
}
function selectMerchantAiTone(tone){
  syncMerchantAiMaterialDraft();
  merchantAiState.tone = tone;
  renderMerchantAiFlow();
}
function handleMerchantAiImageUpload(e){
  syncMerchantAiMaterialDraft();
  const files = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/')).slice(0, 6);
  if(!files.length) return;
  let pending = files.length;
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = ev => {
      compressImage(ev.target.result, dataUrl => {
        merchantAiState.images.push(dataUrl);
        merchantAiState.images = merchantAiState.images.slice(0, 6);
        pending -= 1;
        if(pending === 0) renderMerchantAiFlow();
      }, 0.72, 900);
    };
    reader.readAsDataURL(file);
  });
}
async function generateMerchantAiContent(isRegen){
  if(merchantAiState.isGenerating) return;
  const input = document.getElementById('merchantAiRawText');
  if(input) merchantAiState.rawText = input.value.trim();
  if(!merchantAiState.rawText){ showToast('先输入一句话内容'); return; }
  if(isRegen && merchantAiState.regenCount >= MERCHANT_AI_REGEN_LIMIT){
    showToast('本篇已达到 3 次重生成上限');
    return;
  }
  if(!canUseMerchantAi()){
    showToast('今日 AI 使用次数已达 10 次');
    return;
  }
  merchantAiState.isGenerating = true;
  merchantAiState.generateStartedAt = Date.now();
  renderMerchantAiFlow();
  try {
    const version = await requestMerchantAiVersion(isRegen);
    if(!consumeMerchantAiUse()){
      showToast('今日 AI 使用次数已达 10 次');
      return;
    }
    merchantAiState.versions.push(version);
    merchantAiState.selectedVersion = merchantAiState.versions.length - 1;
    if(isRegen) merchantAiState.regenCount += 1;
    merchantAiState.step = 3;
  } catch(e){
    console.warn('真实 AI 生成失败:', e);
    showToast(e.message || 'AI 生成失败，请稍后再试');
  } finally {
    merchantAiState.isGenerating = false;
    merchantAiState.generateStartedAt = 0;
    renderMerchantAiFlow();
  }
}
async function requestMerchantAiVersion(isRegen){
  if(!(session && session.access_token)) throw new Error('请先登录');
  const priorVersions = (merchantAiState.versions || []).map(v => ({
    title: v.title,
    body: v.body,
    tags: v.tags,
    platforms: v.platforms
  }));
  const payload = {
    type: merchantAiState.type,
    tone: merchantAiState.tone,
    rawText: merchantAiState.rawText,
    isRegen: !!isRegen,
    regenCount: merchantAiState.regenCount,
    priorVersions,
    merchant: currentMerchant ? {
      business_name: currentMerchant.business_name || '',
      category: currentMerchant.category || '',
      subcategory: currentMerchant.subcategory || '',
      address: currentMerchant.address || ''
    } : null,
    images: (merchantAiState.images || []).slice(0, 3)
  };
  const res = await fetch(`${SUPABASE_URL}/functions/v1/merchant-ai-generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${session.access_token}`
    },
    body: JSON.stringify(payload)
  });
  const data = await res.json().catch(() => ({}));
  if(!res.ok){
    throw new Error(data.error || `AI 后端请求失败：${res.status}`);
  }
  return normalizeMerchantAiVersion(data.version || data);
}
function normalizeMerchantAiVersion(raw){
  if(!raw || typeof raw !== 'object') throw new Error('AI 返回内容格式不正确');
  const fallbackTags = ['#乐生活', '#本地生活', `#${merchantAiState.type}`];
  const cleanTags = tags => (Array.isArray(tags) ? tags : fallbackTags)
    .map(t => String(t || '').trim())
    .filter(Boolean)
    .map(t => t.startsWith('#') ? t : `#${t}`)
    .slice(0, 8);
  const textOr = (value, fallback='') => {
    const text = String(value == null ? '' : value).trim();
    return text || fallback;
  };
  const normalizePost = (p, maxTitleLength=40) => ({
    title: textOr(p && p.title, textOr(raw.title, '乐生活商家动态')).slice(0, maxTitleLength),
    body: textOr(p && p.body, textOr(raw.body, merchantAiState.rawText || '')),
    tags: cleanTags((p && p.tags) || raw.tags)
  });
  const platforms = raw.platforms && typeof raw.platforms === 'object' ? raw.platforms : {};
  const local = normalizePost(platforms['乐生活'] || raw);
  const shared = normalizePost(platforms['小红书'] || local);
  const english = normalizePost(platforms['English'] || {
    title: local.title,
    body: local.body,
    tags: local.tags
  }, 80);
  return {
    title: shared.title,
    body: shared.body,
    tags: shared.tags,
    platforms: {
      '乐生活': shared,
      '小红书': shared,
      'Instagram': shared,
      'Facebook': shared,
      'Google': shared,
      'X': shared,
      'English': english
    }
  };
}
function buildMerchantAiVersion(seed){
  const m = currentMerchant || {};
  const shop = m.business_name || ((currentUser && currentUser.name) || '本地小店');
  const raw = merchantAiState.rawText;
  const type = merchantAiState.type;
  const tone = merchantAiState.tone;
  const shortRaw = raw.length > 34 ? raw.slice(0, 34) + '…' : raw;
  const titlePool = [
    `${type}：今天来看看`,
    `今天店里有新内容`,
    `${shop} 今日推荐`,
    `附近生活新发现`
  ];
  const title = titlePool[(seed - 1) % titlePool.length].slice(0, 20);
  const base = `今天想和大家分享：${raw}\n\n如果你刚好在附近，欢迎顺路来看看。我们会尽量把体验做好，也希望乐生活上的朋友能发现更多身边的小惊喜。`;
  const promo = `今日重点：${raw}\n\n适合附近上班、放学或周末顺路的朋友。到店前可以先收藏这篇，方便之后查看地址和联系方式。`;
  const pro = `${shop} 更新：${raw}\n\n我们会持续在乐生活发布店内动态、优惠和新品信息，方便附近用户及时了解。`;
  const body = tone === '促销' ? promo : tone === '专业' ? pro : base;
  const tags = ['#乐生活', '#本地生活', `#${type}`, '#洛杉矶华人', shop ? `#${shop.replace(/\s+/g,'')}` : '#本地小店'].slice(0,5);
  return {
    title,
    body,
    tags,
    platforms: {
      '乐生活': { title, body, tags },
      '小红书': { title, body, tags },
      'Instagram': { title, body, tags },
      'Facebook': { title, body, tags },
      'Google': { title, body, tags },
      'X': { title, body, tags },
      'English': { title: `${shop} update`, body: `${raw}\n\nA local find from Scoop City. Save it for your next stop.`, tags: ['#ScoopCity', '#LocalBusiness'] }
    }
  };
}
function currentMerchantAiVersion(){
  return merchantAiState && merchantAiState.versions[merchantAiState.selectedVersion];
}
function merchantAiPlatformNameFromKey(key){
  const map = { leshenghuo:'乐生活', xhs:'小红书', instagram:'Instagram', facebook:'Facebook', google:'Google', x:'X', english:'English' };
  return map[key] || key;
}
function merchantAiDisplayPlatformName(name){
  return name === 'English' ? '英文版' : name;
}
function updateMerchantAiCurrent(field){
  const v = currentMerchantAiVersion();
  if(!v) return;
  const platform = merchantAiState.activePlatform || '乐生活';
  const p = v.platforms[platform] || v.platforms['乐生活'];
  if(!p) return;
  if(field === 'title') p.title = document.getElementById('merchantAiEditTitle')?.value.trim() || p.title;
  if(field === 'body') p.body = document.getElementById('merchantAiEditBody')?.value.trim() || p.body;
  if(field === 'tags'){
    const raw = document.getElementById('merchantAiEditTags')?.value.trim() || '';
    p.tags = raw.split(/\s+/).filter(Boolean).map(t => t.startsWith('#') ? t : `#${t}`).slice(0, 8);
  }
}
function syncMerchantAiEdits(){
  if(!merchantAiState || merchantAiState.step !== 3) return;
  updateMerchantAiCurrent('title');
  updateMerchantAiCurrent('body');
  updateMerchantAiCurrent('tags');
}
function switchMerchantAiPreviewPlatform(platform){
  syncMerchantAiEdits();
  merchantAiState.activePlatform = platform;
  renderMerchantAiFlow();
}
function switchMerchantAiVersion(index){
  syncMerchantAiEdits();
  merchantAiState.selectedVersion = index;
  renderMerchantAiFlow();
}
function goMerchantAiPlatformStep(){
  syncMerchantAiEdits();
  merchantAiState.step = 4;
  renderMerchantAiFlow();
}
function renderMerchantAiPreviewStep(){
  const v = currentMerchantAiVersion();
  if(!v) return renderMerchantAiMaterialStep();
  const p = v.platforms[merchantAiState.activePlatform] || v.platforms['乐生活'];
  return `
    ${merchantAiStepper(3)}
    <div class="ai-tabs">
      ${['乐生活','小红书','English'].map(t => `<button class="ai-tab ${merchantAiState.activePlatform === t ? 'on' : ''}" onclick="switchMerchantAiPreviewPlatform('${t}')">${merchantAiDisplayPlatformName(t)}</button>`).join('')}
    </div>
    <div class="ai-result-card">
      <div class="ai-field-label">标题</div>
      <div class="ai-copy-line"><input id="merchantAiEditTitle" value="${aiEsc(p.title)}" oninput="updateMerchantAiCurrent('title')" style="flex:1;border:1px solid var(--line);border-radius:10px;padding:9px 10px;font-family:inherit;font-weight:800;color:var(--ink);"><button class="ai-copy-btn" onclick="copyMerchantAiText('title')">复制</button></div>
      <div class="ai-field-label">正文</div>
      <textarea id="merchantAiEditBody" class="ai-textarea" style="height:150px;margin-bottom:12px;" oninput="updateMerchantAiCurrent('body')">${aiEsc(p.body)}</textarea>
      ${merchantAiState.images[0] ? `<div class="ai-preview-img"><img src="${merchantAiState.images[0]}" alt="" style="width:100%;height:100%;object-fit:cover;"></div>` : `<div class="ai-preview-img"></div>`}
      <div class="ai-field-label">标签</div>
      <input id="merchantAiEditTags" value="${aiEsc(p.tags.join(' '))}" oninput="updateMerchantAiCurrent('tags')" style="width:100%;border:1px solid var(--line);border-radius:10px;padding:9px 10px;font-family:inherit;color:var(--berry-dark);font-weight:800;">
    </div>
    <div class="ai-tip"><strong>发布说明</strong><span>乐生活、小红书和其他中文平台暂时使用同一篇中文稿；英文版可单独复制。AI 只辅助整理文案，不生成价格、库存或优惠事实，视频 AI 暂未开放。</span></div>
    <div class="ai-quota">本篇已重生成 ${merchantAiState.regenCount}/${MERCHANT_AI_REGEN_LIMIT} 次，今日 AI 使用 ${getMerchantAiDailyUsage()}/${MERCHANT_AI_DAILY_LIMIT} 次。旧版本会保留，可随时切回。</div>
    <div class="ai-version-row">
      ${merchantAiState.versions.map((_, i) => `<button class="ai-version-pill ${merchantAiState.selectedVersion === i ? 'on' : ''}" onclick="switchMerchantAiVersion(${i})">版本 ${i + 1}</button>`).join('')}
    </div>
    <button class="ai-secondary" onclick="openMerchantAiRegenConfirm()" ${merchantAiState.regenCount >= MERCHANT_AI_REGEN_LIMIT ? 'disabled style="opacity:.5;"' : ''}>重生成</button>
    <button class="ai-primary ai-green" onclick="goMerchantAiPlatformStep()">下一步：选择平台</button>
  `;
}
function copyMerchantAiText(part){
  syncMerchantAiEdits();
  const v = currentMerchantAiVersion();
  if(!v) return;
  const p = v.platforms[merchantAiState.activePlatform] || v.platforms['乐生活'];
  const text = part === 'title' ? p.title : `${p.title}\n\n${p.body}\n\n${p.tags.join(' ')}`;
  navigator.clipboard && navigator.clipboard.writeText(text).then(() => showToast('已复制')).catch(() => showToast('复制失败，请手动选择文本'));
}
function openMerchantAiRegenConfirm(){
  syncMerchantAiEdits();
  if(merchantAiState.regenCount >= MERCHANT_AI_REGEN_LIMIT){ showToast('本篇已达到 3 次重生成上限'); return; }
  if(!canUseMerchantAi()){ showToast('今日 AI 使用次数已达 10 次'); return; }
  const text = document.getElementById('merchantAiRegenConfirmText');
  if(text) text.textContent = `本篇最多可重生成 3 次，每天 AI 生成和重生成合计最多 10 次。本次会消耗 1 次，旧版本会保留。当前本篇已重生成 ${merchantAiState.regenCount}/${MERCHANT_AI_REGEN_LIMIT} 次，今日还剩 ${merchantAiUsesLeft()} 次。`;
  document.getElementById('merchantAiRegenConfirm').classList.add('open');
}
function closeMerchantAiRegenConfirm(){
  document.getElementById('merchantAiRegenConfirm').classList.remove('open');
}
function confirmMerchantAiRegenerate(){
  closeMerchantAiRegenConfirm();
  generateMerchantAiContent(true);
}
function renderMerchantAiPlatformStep(){
  syncMerchantAiEdits();
  const selected = Object.entries(merchantAiState.platforms).filter(([key, on]) => on && key !== 'leshenghuo').length;
  return `
    ${merchantAiStepper(4)}
    <h3 class="ai-headline">选择要发布的平台</h3>
    <p class="ai-sub">目前乐生活支持站内发布，其他平台会按勾选项生成文案，方便复制粘贴。已选择 ${selected} 个外部平台。</p>
    <div class="ai-platform-card">
      <div class="ai-platform-head"><b>站内发布</b><span class="ai-count">自动发布</span></div>
      ${merchantAiPlatformRow('leshenghuo','乐','乐生活','进入本地生活信息流', true)}
    </div>
    <div class="ai-platform-card">
      <div class="ai-platform-head"><b>复制到其他平台</b><span class="ai-count">手动发布</span></div>
      ${merchantAiPlatformRow('xhs','小','小红书','复制种草版本')}
      ${merchantAiPlatformRow('instagram','IG','Instagram','复制同一中文稿')}
      ${merchantAiPlatformRow('facebook','F','Facebook','复制同一中文稿')}
      ${merchantAiPlatformRow('google','G','Google Business','复制同一中文稿')}
      ${merchantAiPlatformRow('x','X','X','复制同一中文稿')}
      ${merchantAiPlatformRow('english','EN','英文版','复制英文版本')}
      <div class="ai-platform disabled"><div class="ai-picon">▶</div><div><b>视频平台</b><span>视频 AI 创作暂未开放</span></div><div class="ai-radio"></div></div>
    </div>
    <button class="ai-primary" onclick="publishMerchantAiPost()" ${merchantAiState.isPublishing ? 'disabled style="opacity:.62;"' : ''}>${merchantAiState.isPublishing ? '发布中...' : '发布到乐生活'}</button>
    <button class="ai-secondary" onclick="copySelectedMerchantAiText()">复制已选平台文案</button>
  `;
}
function merchantAiPlatformRow(key, icon, name, sub, locked){
  const on = !!merchantAiState.platforms[key];
  return `<div class="ai-platform" onclick="${locked ? '' : `toggleMerchantAiPlatform('${key}')`}">
    <div class="ai-picon">${icon}</div>
    <div><b>${name}</b><span>${sub}</span></div>
    <div class="ai-radio ${on ? 'on' : ''}">${on ? '✓' : ''}</div>
  </div>`;
}
function toggleMerchantAiPlatform(key){
  merchantAiState.platforms[key] = !merchantAiState.platforms[key];
  renderMerchantAiFlow();
}
function merchantAiSelectedPlatformEntries(includeLocal=false){
  const v = currentMerchantAiVersion();
  if(!v) return [];
  return Object.entries(merchantAiState.platforms)
    .filter(([key, on]) => on && (includeLocal || key !== 'leshenghuo'))
    .map(([key]) => {
      const name = merchantAiPlatformNameFromKey(key);
      return [name, v.platforms[name] || v.platforms['乐生活']];
    })
    .filter(([, p]) => !!p);
}
function copySelectedMerchantAiText(){
  syncMerchantAiEdits();
  const rows = merchantAiSelectedPlatformEntries(false);
  if(!rows.length){ showToast('请至少选择一个外部平台'); return; }
  const text = rows.map(([, p]) => `${p.title}\n\n${p.body}\n\n${p.tags.join(' ')}`).join('\n\n---\n\n');
  navigator.clipboard && navigator.clipboard.writeText(text).then(() => showToast('多平台文案已复制')).catch(() => showToast('复制失败，请手动选择文本'));
}
function merchantAiPlatformText(name){
  syncMerchantAiEdits();
  const v = currentMerchantAiVersion();
  if(!v) return '';
  const p = v.platforms[name] || v.platforms['乐生活'];
  if(!p) return '';
  return `${p.title}\n\n${p.body}\n\n${(p.tags || []).join(' ')}`.trim();
}
function merchantAiPublishedLink(){
  try {
    const url = new URL(window.location.origin + window.location.pathname);
    if(merchantAiState && merchantAiState.publishedPostId) url.searchParams.set('post', merchantAiState.publishedPostId);
    return url.href;
  } catch(e){
    return window.location.href.split('#')[0];
  }
}
function copyMerchantAiPlatformText(name){
  const text = merchantAiPlatformText(name);
  if(!text){ showToast('暂无可复制文案'); return Promise.resolve(false); }
  if(!navigator.clipboard){
    showToast('请手动选择复制文案');
    return Promise.resolve(false);
  }
  return navigator.clipboard.writeText(text)
    .then(() => { showToast(`${merchantAiDisplayPlatformName(name)} 文案已复制`); return true; })
    .catch(() => { showToast('复制失败，请手动选择文本'); return false; });
}
function merchantAiPlatformOpenUrl(name){
  const text = merchantAiPlatformText(name);
  const link = merchantAiPublishedLink();
  const encodedText = encodeURIComponent(`${text}\n\n${link}`.trim());
  const encodedLink = encodeURIComponent(link);
  const key = String(name || '').toLowerCase();
  if(key === 'facebook') return `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}&quote=${encodedText}`;
  if(key === 'x') return `https://twitter.com/intent/tweet?text=${encodedText}`;
  if(key === 'google') return 'https://business.google.com/';
  if(key === 'instagram') return 'https://www.instagram.com/';
  if(key === '小红书') return 'https://www.xiaohongshu.com/';
  if(key === 'english') return `https://twitter.com/intent/tweet?text=${encodedText}`;
  return link;
}
function openMerchantAiPlatform(name){
  if(name === '乐生活'){
    viewMerchantAiPublishedPost();
    return;
  }
  copyMerchantAiPlatformText(name).finally(() => {
    const url = merchantAiPlatformOpenUrl(name);
    window.open(url, '_blank', 'noopener');
  });
}
function merchantAiSuccessActionHtml(name){
  if(name === '乐生活'){
    return `<div class="ai-done-actions"><button class="primary" onclick="viewMerchantAiPublishedPost()">查看效果</button></div>`;
  }
  const openLabelMap = {
    'Facebook':'打开 Facebook',
    'X':'打开 X',
    'Google':'打开 Google Business',
    'Instagram':'打开 Instagram',
    '小红书':'打开小红书',
    'English':'打开 X'
  };
  const safe = String(name).replace(/'/g, "\\'");
  return `<div class="ai-done-actions">
    <button onclick="copyMerchantAiPlatformText('${safe}')">复制文案</button>
    <button class="primary" onclick="openMerchantAiPlatform('${safe}')">${openLabelMap[name] || '打开平台'}</button>
  </div>`;
}
async function publishMerchantAiPost(){
  syncMerchantAiEdits();
  syncMerchantAiMaterialDraft();
  if(merchantAiState.isPublishing) return;
  const v = currentMerchantAiVersion();
  if(!v){ showToast('请先生成文案'); return; }
  if(!(session && session.user)){ showToast('请先登录'); return; }
  merchantAiState.isPublishing = true;
  merchantAiState.publishWarning = '';
  renderMerchantAiFlow();
  const p = v.platforms['乐生活'];
  const videoInfo = extractVideoInfo(merchantAiState.videoUrl || '');
  if((merchantAiState.videoUrl || '').trim() && !videoInfo){
    showToast('视频链接无法识别，目前仅支持 YouTube');
    return;
  }
  const ytId = videoInfo && videoInfo.provider === 'youtube' ? videoInfo.id : null;
  const ytVertical = videoInfo && videoInfo.provider === 'youtube' && isYoutubeVerticalSource(videoInfo.url);
  const content = p.body + '\n\n' + p.tags.join(' ') + (ytVertical ? `\n\n${youtubeVerticalMarker()}` : '');
  const title = p.title.slice(0,20);
  // 有上传图片时始终作为笔记封面；YouTube 仅在没有自定义封面时才回退显示视频缩略图。
  const image = merchantAiState.images[0] || (ytId ? null : 'https://images.unsplash.com/photo-1521305916504-4a1121188589?w=800&q=60');
  const images = merchantAiState.images.length ? merchantAiState.images : null;
  const cat = (currentMerchant && currentMerchant.category) || '生活';
  const authorName = (currentMerchant && currentMerchant.business_name) || myNick();
  const postTags = Array.from(new Set(p.tags.map(t => t.replace(/^#/,'')).concat(['商家发布']))).slice(0,10);
  const localPost = {
    id: nextPostId++, category:cat, title, excerpt: content.slice(0,40) + (content.length > 40 ? '…' : ''),
    user_id: session.user.id, content, image, images, tags: postTags,
    location: (currentMerchant && currentMerchant.address) || null,
    youtube:ytId, youtube_vertical: ytVertical, author:authorName, time:'刚刚', likes:0, liked:false, event:null, comments:[]
  };
  posts.unshift(localPost);
  merchantAiState.publishedPostId = localPost.id;
  currentFilter = '全部';
  renderChips(); renderFeed(); savePosts();
  try {
    const saved = await supabaseInsertPost({
      title: localPost.title, content: localPost.content, excerpt: localPost.excerpt, category:cat,
      author: authorName, image, images, youtube:ytId, likes:0, event:null, tags: postTags,
      location: localPost.location, user_id: session.user.id, visibility:'public', pinned:false
    });
    if(saved && saved.id){ localPost.id = saved.id; merchantAiState.publishedPostId = saved.id; savePosts(); }
  } catch(e){
    console.warn('⚠️ AI发布保存到数据库失败:', e.message);
    merchantAiState.publishWarning = '内容已先显示在本机页面，云端保存失败，请检查数据库权限后再刷新页面。';
    showToast('⚠️ 云端保存失败，请检查数据库权限');
  }
  merchantAiState.isPublishing = false;
  merchantAiState.step = 5;
  renderMerchantAiFlow();
}
function renderMerchantAiSuccessStep(){
  const rows = merchantAiSelectedPlatformEntries(true);
  const externalCount = rows.filter(([name]) => name !== '乐生活').length;
  return `
    ${merchantAiStepper(5)}
    <div class="ai-success-mark">✓</div>
    <div class="ai-success-title">内容发布成功</div>
    <div class="ai-success-sub">已发布到乐生活。${externalCount ? `另外 ${externalCount} 个外部平台文案已准备好，可复制后手动发布。` : '没有选择外部平台。'}</div>
    ${merchantAiState.publishWarning ? `<div class="ai-tip"><strong>云端提醒</strong><span>${merchantAiState.publishWarning}</span></div>` : ''}
    <div class="ai-done-list">
      ${rows.map(([name]) => `<div class="ai-done-item ${name === '乐生活' ? '' : 'external'}">
        <div class="ai-picon">${name === 'Instagram' ? 'IG' : merchantAiDisplayPlatformName(name).slice(0,1)}</div>
        <div class="ai-done-main"><b>${merchantAiDisplayPlatformName(name)}</b><span>${name === '乐生活' ? '本地信息流已发布' : '先复制文案，再打开平台手动发布'}</span>${merchantAiSuccessActionHtml(name)}</div>
        <div class="ai-done-status">${name === '乐生活' ? '已发布' : '已生成'}</div>
      </div>`).join('')}
    </div>
    <button class="ai-primary ai-green" onclick="viewMerchantAiPublishedPost()">查看发布效果</button>
    <button class="ai-secondary" onclick="copySelectedMerchantAiText()">复制已选平台文案</button>
    <button class="ai-secondary" onclick="openMerchantAiFlow()">再发一篇</button>
    <button class="ai-secondary" onclick="finishMerchantAiFlow()">完成</button>
    <div class="ai-tip"><strong>使用额度</strong><span>今日 AI 还剩 ${merchantAiUsesLeft()} 次。本篇已保留 ${merchantAiState.versions.length} 个版本，可在本次关闭前继续复制。</span></div>
  `;
}
function viewMerchantAiPublishedPost(){
  const id = merchantAiState && merchantAiState.publishedPostId;
  merchantAiReturnAfterPost = true;
  document.getElementById('merchantAiOverlay').classList.remove('open');
  switchTab('home');
  if(id) setTimeout(() => openPost(id), 120);
}
/* ====== 本机草稿箱：内容仅保存在当前设备，不写入云端 ====== */
const COMPOSE_DRAFT_LIMIT = 12;
let composeDraftId = null;
let composeDraftSaveTimer = null;
let postPublishMode = 'now';

function laDateTimeParts(date = new Date()){
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone:'America/Los_Angeles', year:'numeric', month:'2-digit', day:'2-digit',
    hour:'2-digit', minute:'2-digit', hourCycle:'h23'
  }).formatToParts(date).reduce((result, part) => {
    if(part.type !== 'literal') result[part.type] = part.value;
    return result;
  }, {});
  return parts;
}
function laDateTimeLocalValue(date = new Date()){
  const parts = laDateTimeParts(date);
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}
function laOffsetMinutes(at){
  const zone = new Intl.DateTimeFormat('en-US', {
    timeZone:'America/Los_Angeles', timeZoneName:'longOffset'
  }).formatToParts(at).find(part => part.type === 'timeZoneName')?.value || 'GMT-08:00';
  const match = zone.match(/^GMT([+-])(\d{2}):(\d{2})$/);
  if(!match) return -480;
  const minutes = Number(match[2]) * 60 + Number(match[3]);
  return match[1] === '+' ? minutes : -minutes;
}
function laLocalDateTimeToIso(value){
  const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if(!match) return null;
  const [, year, month, day, hour, minute] = match;
  const wallClockUtc = Date.UTC(Number(year), Number(month)-1, Number(day), Number(hour), Number(minute));
  let instant = wallClockUtc - laOffsetMinutes(new Date(wallClockUtc)) * 60000;
  instant = wallClockUtc - laOffsetMinutes(new Date(instant)) * 60000;
  const roundTrip = laDateTimeLocalValue(new Date(instant));
  return roundTrip === value ? new Date(instant).toISOString() : null;
}
function formatLaDateTime(iso){
  if(!iso) return '';
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone:'America/Los_Angeles', year:'numeric', month:'long', day:'numeric',
    weekday:'short', hour:'2-digit', minute:'2-digit', hourCycle:'h23'
  }).format(new Date(iso)) + '（洛杉矶时间）';
}
function updateSchedulePublishUi(){
  const scheduled = postPublishMode === 'scheduled';
  document.querySelectorAll('#publishTimePicker [data-mode]').forEach(button => button.classList.toggle('active', button.dataset.mode === postPublishMode));
  document.getElementById('schedulePublishFields')?.classList.toggle('show', scheduled);
  if(scheduled){
    const input = document.getElementById('fScheduledAt');
    if(input){
      input.min = laDateTimeLocalValue(new Date(Date.now() + 60000));
      if(!input.value) input.value = laDateTimeLocalValue(new Date(Date.now() + 10 * 60000));
    }
  }
}
function setPostPublishMode(mode){
  postPublishMode = mode === 'scheduled' ? 'scheduled' : 'now';
  updateSchedulePublishUi();
  scheduleComposeDraftSave();
}
function selectedScheduledPublishAt(){
  if(postPublishMode !== 'scheduled') return null;
  const value = document.getElementById('fScheduledAt')?.value || '';
  const scheduledAt = laLocalDateTimeToIso(value);
  if(!scheduledAt) return { error:'请选择有效的洛杉矶发布时间' };
  if(new Date(scheduledAt).getTime() < Date.now() + 30000) return { error:'定时时间需晚于当前洛杉矶时间至少 1 分钟' };
  return { value:scheduledAt };
}

function composeDraftOwner(){ return session && session.user ? session.user.id : 'guest'; }
async function composeDraftStore(action, value){
  if(!composeDraftStoreApi) throw new Error('草稿接口未初始化');
  if(action === 'getAll') return composeDraftStoreApi.getAll(value);
  if(action === 'put') return composeDraftStoreApi.put(value);
  if(action === 'delete') return composeDraftStoreApi.remove(value);
  throw new Error('不支持的草稿操作');
}
function composeDraftHasContent(draft){
  return !!(draft && (draft.title || draft.content || draft.location || draft.youtube || draft.activityStartDate || draft.activityEndDate || draft.activityLongTerm || (draft.customTags || []).length || (draft.uploadedImages || []).length || draft.textCardCover));
}
function composeDraftSnapshot(){
  const value = id => document.getElementById(id)?.value || '';
  return {
    id: composeDraftId || `draft_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,
    owner: composeDraftOwner(),
    title: value('fTitle').trim(), content: value('fContent').trim(), location: (document.getElementById('fLocation')?.dataset.locationCanonical || value('fLocation')).trim(), youtube: value('fYoutube').trim(),
    capacity: value('fCapacity'), deadline: value('fDeadline').trim(), activityStartDate:value('fActivityStartDate'), activityEndDate:value('fActivityEndDate'), activityLongTerm, customTags:[...customTags], selectedCat, selectedSubcategory, communityPostMeta:{...communityPostMeta}, eventOn,
    postPublishMode, scheduledAt: value('fScheduledAt'),
    uploadedImages:[...uploadedImages], coverImageIndex, textCardCover: textCardCover ? {...textCardCover} : null,
    createdAt: Date.now(), updatedAt: Date.now(), videoNeedsReselect: selectedVideos.length > 0
  };
}
function updateComposeDraftStatus(text){
  const status = document.getElementById('composeDraftStatus');
  if(status) status.textContent = text || '本机草稿会自动保存';
}
function scheduleComposeDraftSave(){
  if(!document.getElementById('composeOverlay')?.classList.contains('open') || editingPostId !== null) return;
  clearTimeout(composeDraftSaveTimer);
  composeDraftSaveTimer = setTimeout(() => saveComposeDraft(), 450);
}
async function saveComposeDraft(){
  if(editingPostId !== null) return;
  const draft = composeDraftSnapshot();
  if(!composeDraftHasContent(draft)) return;
  composeDraftId = draft.id;
  try {
    const existing = await composeDraftStore('getAll', draft.owner);
    const old = (existing || []).find(item => item.id === draft.id);
    if(old) draft.createdAt = old.createdAt || draft.createdAt;
    if(!old && (existing || []).length >= COMPOSE_DRAFT_LIMIT){
      const oldest = [...existing].sort((a,b) => (a.updatedAt || 0) - (b.updatedAt || 0))[0];
      if(oldest) await composeDraftStore('delete', oldest.id);
    }
    await composeDraftStore('put', draft);
    updateComposeDraftStatus('草稿已保存到本机');
  } catch(error){
    console.warn('草稿保存失败:', error.message);
    updateComposeDraftStatus('草稿暂未保存，请勿清除浏览器数据');
  }
}
async function removeComposeDraft(id = composeDraftId){
  if(!id) return;
  try { await composeDraftStore('delete', id); } catch(error) { console.warn('草稿删除失败:', error.message); }
  if(id === composeDraftId) composeDraftId = null;
}
function resetComposeForm(){
  selectedCat = null; selectedSubcategory = null; communityPostMeta = {}; eventOn = false; activityLongTerm = false; editingPostId = null; composeDraftId = null; postPublishMode = 'now';
  document.getElementById('fTitle').value=''; document.getElementById('fContent').value=''; document.getElementById('fYoutube').value='';
  updateYoutubePreview(); document.getElementById('fCapacity').value=''; document.getElementById('fDeadline').value='';
  document.getElementById('fActivityStartDate').value=''; document.getElementById('fActivityEndDate').value=''; document.getElementById('fActivityLongTerm').checked=false;
  document.getElementById('eventSwitch').classList.remove('on'); document.getElementById('eventFields').classList.remove('open');
  document.querySelectorAll('.cat-pick').forEach(b=>b.classList.remove('sel'));
  renderPostSubcategoryPicker();
  renderCommunityPostFields();
  renderActivityPeriodFields();
  uploadedImages = []; editingImageThumbnails = []; textCardCover = null; textCoverDraftImage = '';
  selectedVideos.forEach(v => URL.revokeObjectURL(v.url)); selectedVideos = []; customTags = []; renderCustomTags();
  const tagIn = document.getElementById('fCustomTag'); if(tagIn) tagIn.value = '';
  coverImageIndex = 0; document.getElementById('fImages').value = ''; document.getElementById('imagesGrid').style.display = 'none'; document.getElementById('uploadBox').style.display = 'flex';
  document.getElementById('titleCount').textContent = '0'; document.getElementById('contentCount').textContent = '0';
  const locInput = document.getElementById('fLocation'); if(locInput){ locInput.value = ''; delete locInput.dataset.locationCanonical; }
  const locBox = document.getElementById('locationSuggestions'); if(locBox){ locBox.style.display = 'none'; locBox.innerHTML = ''; }
  const scheduleInput = document.getElementById('fScheduledAt'); if(scheduleInput) scheduleInput.value = '';
  updateSchedulePublishUi();
  updateComposeDraftStatus();
}
async function openComposeDrafts(){
  const overlay = document.getElementById('composeDraftOverlay'); const body = document.getElementById('composeDraftBody');
  if(!overlay || !body) return;
  overlay.classList.add('open'); body.innerHTML = '<div class="admin-empty">正在读取本机草稿...</div>';
  try {
    const rows = (await composeDraftStore('getAll', composeDraftOwner())).sort((a,b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    body.innerHTML = rows.length ? rows.map(draft => {
      const title = draft.title || '未命名草稿'; const preview = draft.content || draft.location || draft.youtube || '继续编辑这篇内容';
      const image = draft.uploadedImages?.[draft.coverImageIndex || 0] || draft.textCardCover?.dataUrl || '';
      return `<div class="compose-draft-card" onclick="resumeComposeDraft('${draft.id}')"><div class="compose-draft-art">${image ? `<img src="${escAttr(image)}" alt="">` : uiIcon('edit',22)}</div><div class="compose-draft-main"><b>${escHtml(title)}</b><p>${escHtml(preview)}</p><span>${draft.selectedCat || '未分类'} · ${new Date(draft.updatedAt || Date.now()).toLocaleString('zh-CN',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})}${draft.videoNeedsReselect ? ' · 视频需重新选择' : ''}</span></div><button class="compose-draft-delete" onclick="event.stopPropagation();deleteComposeDraft('${draft.id}')" aria-label="删除草稿">×</button></div>`;
    }).join('') + '<div class="compose-draft-local-note">草稿只保存在这台设备，不会上传到乐生活服务器。清除浏览器数据、卸载 App 或更换设备后，草稿会消失。</div>' : '<div class="admin-empty">还没有本机草稿。写到一半返回或关闭发布页，内容会自动保存在这里。</div><div class="compose-draft-local-note">草稿只保存在这台设备，不会上传到乐生活服务器。清除浏览器数据、卸载 App 或更换设备后，草稿会消失。</div>';
  } catch(error){ body.innerHTML = '<div class="admin-empty">本机草稿暂时不可读。请确认浏览器没有关闭网站数据存储权限。</div>'; }
}
function closeComposeDrafts(){ document.getElementById('composeDraftOverlay')?.classList.remove('open'); }
async function deleteComposeDraft(id){
  if(!confirm('删除这篇本机草稿？此操作无法恢复。')) return;
  await removeComposeDraft(id); openComposeDrafts();
}
async function resumeComposeDraft(id){
  try {
    const rows = await composeDraftStore('getAll', composeDraftOwner()); const draft = rows.find(item => item.id === id);
    if(!draft) throw new Error('草稿不存在');
    closeComposeDrafts(); resetComposeForm(); composeDraftId = draft.id;
    document.getElementById('fTitle').value = draft.title || ''; document.getElementById('fContent').value = draft.content || ''; document.getElementById('fYoutube').value = draft.youtube || ''; document.getElementById('fLocation').value = draft.location || ''; delete document.getElementById('fLocation').dataset.locationCanonical;
    document.getElementById('fCapacity').value = draft.capacity || ''; document.getElementById('fDeadline').value = draft.deadline || ''; document.getElementById('fActivityStartDate').value = draft.activityStartDate || ''; document.getElementById('fActivityEndDate').value = draft.activityEndDate || '';
    selectedCat = draft.selectedCat || null; selectedSubcategory = isValidPostSubcategory(selectedCat, draft.selectedSubcategory) ? draft.selectedSubcategory : null; communityPostMeta = draft.communityPostMeta && typeof draft.communityPostMeta === 'object' ? {...draft.communityPostMeta} : {}; eventOn = !!draft.eventOn; activityLongTerm = !!draft.activityLongTerm; customTags = Array.isArray(draft.customTags) ? [...draft.customTags] : []; uploadedImages = Array.isArray(draft.uploadedImages) ? [...draft.uploadedImages] : []; coverImageIndex = Number.isFinite(draft.coverImageIndex) ? draft.coverImageIndex : 0; textCardCover = draft.textCardCover || null; postPublishMode = draft.postPublishMode === 'scheduled' ? 'scheduled' : 'now';
    const scheduleInput = document.getElementById('fScheduledAt'); if(scheduleInput) scheduleInput.value = draft.scheduledAt || '';
    document.querySelectorAll('.cat-pick').forEach(b=>b.classList.toggle('sel', b.dataset.c === selectedCat)); renderPostSubcategoryPicker(); renderCommunityPostFields(); renderActivityPeriodFields(); document.getElementById('eventSwitch').classList.toggle('on', eventOn); document.getElementById('eventFields').classList.toggle('open', eventOn); updateSchedulePublishUi();
    document.getElementById('titleCount').textContent = (draft.title || '').length; document.getElementById('contentCount').textContent = (draft.content || '').length; renderCustomTags(); renderImageGrid(); updateYoutubePreview();
    document.getElementById('composeOverlay').classList.add('open'); updateComposeDraftStatus(draft.videoNeedsReselect ? '草稿已恢复，视频文件需重新选择' : '已恢复本机草稿');
  } catch(error){ showToast('草稿恢复失败，请稍后重试'); }
}
function openCompose(){
  if(!document.getElementById('composeOverlay').classList.contains('open') && editingPostId === null) resetComposeForm();
  document.getElementById('composeOverlay').classList.add('open');
}
function closeCompose(saveDraft=true){
  if(saveDraft) saveComposeDraft();
  document.getElementById('composeOverlay').classList.remove('open');
  resetComposeForm();
}
function closeComposePreview(){ document.getElementById('composePreviewOverlay')?.classList.remove('open'); }
function composePreviewMediaHtml(){
  const videoUrl = document.getElementById('fYoutube')?.value.trim() || '';
  const videoInfo = extractVideoInfo(videoUrl);
  if(videoInfo?.provider === 'youtube'){
    return `<div style="position:relative;aspect-ratio:16/9;background:#161816;overflow:hidden;border-radius:12px;"><img src="${escAttr(youtubeThumbUrl(videoInfo.id))}" alt="视频预览" style="width:100%;height:100%;object-fit:cover;"><span style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:54px;height:54px;border-radius:50%;background:rgba(0,0,0,.62);color:#fff;display:grid;place-items:center;font-size:22px;">▶</span></div>`;
  }
  const image = uploadedImages[coverImageIndex] || textCardCover?.dataUrl || createTextCoverDataUrl((document.getElementById('fTitle')?.value || '').trim(), (document.getElementById('fContent')?.value || '').trim(), selectedCat, textCoverDraftTheme || 'garden');
  return image ? `<img src="${escAttr(image)}" alt="笔记封面" style="width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:12px;display:block;background:var(--bg-alt);">` : `<div style="aspect-ratio:3/4;border-radius:12px;background:var(--bg-alt);display:grid;place-items:center;color:var(--ink-faint);">封面预览</div>`;
}
function openComposePreview(){
  const title = document.getElementById('fTitle')?.value.trim() || '';
  const content = document.getElementById('fContent')?.value.trim() || '';
  if(!selectedCat){ showToast('请先选择分类'); return; }
  if(!title){ showToast('请先填写标题'); document.getElementById('fTitle')?.focus(); return; }
  if(!content){ showToast('请先填写内容'); document.getElementById('fContent')?.focus(); return; }
  const pendingTag = customPostTagLabel(document.getElementById('fCustomTag')?.value || '');
  const previewTags = [...customTags, ...(pendingTag && !customTags.includes(pendingTag) ? [pendingTag] : [])];
  const start = document.getElementById('fActivityStartDate')?.value || '';
  const end = document.getElementById('fActivityEndDate')?.value || '';
  const activity = activityLongTerm ? '长期活动' : (start && end ? (start === end ? start : `${start} 至 ${end}`) : '');
  const body = document.getElementById('composePreviewBody');
  if(!body) return;
  const author = (currentUser?.name || (session?.user?.email || '乐生活用户').split('@')[0]);
  body.innerHTML = `<article style="max-width:680px;margin:0 auto;"><div style="margin-bottom:14px;">${composePreviewMediaHtml()}</div><div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px;"><span class="cat-tag">${catIcon(selectedCat,13)}<span>${escHtml(selectedSubcategory || catLabel(selectedCat))}</span></span>${activity ? `<span style="font-size:12px;color:var(--sage-dark);font-weight:800;">${uiIcon('calendar',14)}${escHtml(activity)}</span>` : ''}</div><h2 style="font-size:20px;line-height:1.4;margin:0 0 12px;color:var(--ink);">${escHtml(title)}</h2><div style="font-size:15px;line-height:1.8;white-space:pre-wrap;color:var(--ink);">${escHtml(content)}</div>${previewTags.length ? `<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:18px;">${previewTags.map(tag => `<span style="font-size:13px;color:var(--berry);">#${escHtml(tag)}</span>`).join('')}</div>` : ''}<div style="display:flex;align-items:center;gap:8px;margin-top:22px;padding-top:14px;border-top:1px solid var(--line);">${avatarHomeLinkHtml(session?.user?.id, author, 30)}<span style="font-size:13px;color:var(--ink-soft);font-weight:700;">${escHtml(author)}</span><span style="font-size:12px;color:var(--ink-faint);">发布后将显示在首页</span></div></article>`;
  document.getElementById('composePreviewOverlay')?.classList.add('open');
}
function pickCat(c){
  selectedCat = c;
  selectedSubcategory = null;
  communityPostMeta = {};
  document.querySelectorAll('.cat-pick').forEach(b=>b.classList.toggle('sel', b.dataset.c===c));
  renderPostSubcategoryPicker();
  renderCommunityPostFields();
  renderActivityPeriodFields();
  scheduleComposeDraftSave();
}
function renderActivityPeriodFields(){
  const field = document.getElementById('activityPeriodField');
  const longTerm = document.getElementById('fActivityLongTerm');
  const dates = document.getElementById('activityDateInputs');
  const start = document.getElementById('fActivityStartDate');
  const end = document.getElementById('fActivityEndDate');
  if(!field || !longTerm || !dates || !start || !end) return;
  const visible = normalizeCategory(selectedCat) === '玩乐';
  field.style.display = visible ? 'block' : 'none';
  longTerm.checked = activityLongTerm;
  start.disabled = activityLongTerm;
  end.disabled = activityLongTerm;
  dates.style.opacity = activityLongTerm ? '.42' : '1';
  dates.style.pointerEvents = activityLongTerm ? 'none' : 'auto';
}
function toggleActivityLongTerm(){
  activityLongTerm = !!document.getElementById('fActivityLongTerm')?.checked;
  renderActivityPeriodFields();
  scheduleComposeDraftSave();
}
function renderPostSubcategoryPicker(){
  const field = document.getElementById('subcategoryField');
  const picker = document.getElementById('subcategoryPicker');
  if(!field || !picker) return;
  const options = postSubcategoryOptions(selectedCat);
  if(!options.length){ field.style.display = 'none'; picker.innerHTML = ''; return; }
  field.style.display = 'block';
  picker.innerHTML = options.map(item => `<button type="button" class="subcategory-pick ${selectedSubcategory === item ? 'selected' : ''}" onclick="pickPostSubcategory('${item}')">${item}</button>`).join('') + (selectedSubcategory ? '<button type="button" class="subcategory-clear" onclick="pickPostSubcategory(\'\')">不设置</button>' : '');
}
function pickPostSubcategory(item){
  selectedSubcategory = normalizePostSubcategory(selectedCat, item);
  communityPostMeta = {};
  renderPostSubcategoryPicker();
  renderCommunityPostFields();
  scheduleComposeDraftSave();
}
function renderCommunityPostFields(){
  const field = document.getElementById('communityPostField');
  if(!field) return;
  const config = selectedCat === '社区' ? COMMUNITY_POST_CONFIG[selectedSubcategory] : null;
  if(!config){ field.style.display = 'none'; field.innerHTML = ''; return; }
  field.style.display = 'block';
  field.innerHTML = `<label>${config.title} <span class="hint">（可选）</span></label><div class="community-post-fields">${config.fields.map(([key,label,placeholder]) => `<div class="form-field"><label>${label}</label><input type="text" id="communityMeta_${key}" value="${escAttr(communityPostMeta[key] || '')}" placeholder="${escAttr(placeholder)}" maxlength="60" oninput="syncCommunityPostMeta()"></div>`).join('')}</div><div class="community-post-safety">${escHtml(config.hint)} 交易、租赁和招聘由发布者与参与者自行判断，遇到可疑内容可在笔记详情中举报。</div>`;
}
function syncCommunityPostMeta(){
  const config = selectedCat === '社区' ? COMMUNITY_POST_CONFIG[selectedSubcategory] : null;
  if(!config){ communityPostMeta = {}; return; }
  communityPostMeta = config.fields.reduce((result, [key]) => {
    const value = document.getElementById(`communityMeta_${key}`)?.value.trim() || '';
    if(value) result[key] = value;
    return result;
  }, {});
  scheduleComposeDraftSave();
}
function communityMetaHtml(post){
  const config = post && normalizeCategory(post.category) === '社区' ? COMMUNITY_POST_CONFIG[post.subcategory] : null;
  const meta = post && post.community_meta && typeof post.community_meta === 'object' ? post.community_meta : null;
  if(!config || !meta || !Object.keys(meta).length) return '';
  const rows = config.fields.filter(([key]) => meta[key]).map(([key,label]) => `<span><b>${escHtml(label)}：</b>${escHtml(meta[key])}</span>`);
  return rows.length ? `<div class="post-community-meta">${rows.join('')}</div>` : '';
}
function validateCommunityPostSafety(title, content, category, subcategory){
  if(normalizeCategory(category) !== '社区' || !['二手交易','房屋出租','求职招聘'].includes(subcategory)) return true;
  const text = `${title}\n${content}`.toLowerCase();
  if(/身份证|护照|银行卡|信用卡|验证码|cvv|social security/.test(text)){
    showToast('请勿在公开内容中发布证件、银行卡或验证码等敏感信息');
    return false;
  }
  if(subcategory === '求职招聘' && /入职费|培训费|押金|中介费|交钱上岗|先交钱/.test(text)){
    showToast('招聘内容不能向求职者收取入职、培训或押金费用');
    return false;
  }
  const typeLabel = subcategory === '二手交易' ? '交易' : subcategory === '房屋出租' ? '租房' : '招聘';
  return confirm(`发布${typeLabel}信息前请确认：内容真实，不含敏感隐私或收费求职要求；${typeLabel}相关的线下沟通与交易请自行核实。是否继续发布？`);
}
/* ====== 标记地点：自建地点库（不依赖Google Maps），输入时先搜本地已有地点，没有就直接用新地点 ====== */
let locationSearchTimer = null;
function onLocationInput(val){
  clearTimeout(locationSearchTimer);
  const input = document.getElementById('fLocation');
  if(input) delete input.dataset.locationCanonical;
  const box = document.getElementById('locationSuggestions');
  if(!box) return;
  if(!val || !val.trim()){ box.style.display = 'none'; box.innerHTML = ''; return; }
  locationSearchTimer = setTimeout(() => searchLocations(val.trim()), 250);
}
async function searchLocations(kw){
  try {
    if(!locationApi) throw new Error('地点接口未初始化');
    const rows = await locationApi.search(kw);
    renderLocationSuggestions(rows, kw);
  } catch(e){ console.warn('地点搜索失败:', e.message); }
}
function renderLocationSuggestions(rows, kw){
  const box = document.getElementById('locationSuggestions');
  if(!box) return;
  window._locationSuggestionRows = Array.isArray(rows) ? rows : [];
  const exactMatch = rows.some(r => [r.name, r.name_en, r.name_zh].some(name => String(name || '').toLowerCase() === String(kw || '').toLowerCase()));
  let html = rows.map(r => `
    <div onmousedown="pickLocationSuggestion(${window._locationSuggestionRows.indexOf(r)})" style="padding:9px 12px;font-size:13.5px;color:var(--ink);cursor:pointer;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:6px;">${uiIcon('map',13)} ${escHtml(locationSuggestionLabel(r))}</div>
  `).join('');
  if(!exactMatch && kw){
    html += `<div onmousedown="pickLocation('${kw.replace(/'/g,'')}')" style="padding:9px 12px;font-size:13.5px;color:var(--sage-dark);cursor:pointer;font-weight:600;">＋ 使用新地点"${kw}"</div>`;
  }
  box.innerHTML = html || `<div style="padding:9px 12px;font-size:13px;color:var(--ink-faint);">没有匹配，直接使用"${kw}"就行</div>`;
  box.style.display = 'block';
}
function locationSuggestionLabel(row){
  const language = window.LeshenghuoI18n?.getLanguage?.() || 'zh-CN';
  return language === 'en' ? (row?.name_en || row?.name || '') : (row?.name_zh || row?.name_en || row?.name || '');
}
function pickLocationSuggestion(index){
  const row = window._locationSuggestionRows?.[index];
  if(!row) return;
  const input = document.getElementById('fLocation');
  if(input){
    input.value = locationSuggestionLabel(row);
    input.dataset.locationCanonical = row.name_en || row.name || input.value;
  }
  const box = document.getElementById('locationSuggestions');
  if(box){ box.style.display = 'none'; box.innerHTML = ''; }
}
function pickLocation(name){
  const input = document.getElementById('fLocation');
  if(input){ input.value = name; delete input.dataset.locationCanonical; }
  const box = document.getElementById('locationSuggestions');
  if(box){ box.style.display = 'none'; box.innerHTML = ''; }
}
/* 发布/编辑成功后调用：地点库里有就使用次数+1，没有就新建一条（不需要Google Maps，纯本地库） */
async function upsertLocation(name){
  if(!name || !(session && session.user)) return;
  try {
    if(!locationApi) throw new Error('地点接口未初始化');
    // 已有地点仅复用名称；使用次数不再由客户端直接修改，避免任意用户改写地点库。
    await locationApi.ensure({ name, userId:session.user.id });
  } catch(e){ console.warn('地点保存失败:', e.message); }
}
/* ---- image compression ---- */
function compressImage(dataUrl, callback, onError=()=>{}, quality=0.76, maxEdge=1440){
  // 兼容旧调用形式 compressImage(dataUrl, callback, quality, maxEdge)。
  if(typeof onError === 'number'){
    maxEdge = Number(quality) || maxEdge;
    quality = onError;
    onError = ()=>{};
  }
  const img = new Image();
  img.onload = ()=>{
    const canvas = document.createElement('canvas');
    let w = img.width, h = img.height;
    const longest = Math.max(w, h);
    if(longest > maxEdge){
      const scale = maxEdge / longest;
      w = Math.round(w * scale);
      h = Math.round(h * scale);
    }
    canvas.width = w;
    canvas.height = h;
    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
    let nextQuality = quality;
    let output = canvas.toDataURL('image/jpeg', nextQuality);
    // 约 700KB 以内通常已足够清晰；超出时逐步降低质量，控制多图发布的存储占用。
    while(output.length > 940000 && nextQuality > 0.56){
      nextQuality -= 0.06;
      output = canvas.toDataURL('image/jpeg', nextQuality);
    }
    callback(output);
  };
  img.onerror = () => onError();
  img.src = dataUrl;
}
function isTextCoverAssetUrl(value){ return /\/text-covers\//i.test(String(value || '')); }
function textCoverTheme(themeId){
  return TEXT_COVER_THEMES.find(theme => theme.id === themeId) || TEXT_COVER_THEMES[0];
}
function textCoverSourceText(){
  const title = (document.getElementById('fTitle')?.value || '').trim() || '写下今天想分享的事';
  const content = (document.getElementById('fContent')?.value || '').trim().replace(/\s+/g, ' ');
  return { title, content:content || '把这一刻、这个地点或这份心情分享给附近的朋友。', category:selectedCat || '生活' };
}
function wrapTextForCanvas(context, text, maxWidth, maxLines){
  const lines = [];
  let line = '';
  for(const char of String(text || '')){
    const candidate = line + char;
    if(line && context.measureText(candidate).width > maxWidth){
      lines.push(line);
      line = char;
      if(lines.length >= maxLines) break;
    } else {
      line = candidate;
    }
  }
  if(line && lines.length < maxLines) lines.push(line);
  const used = lines.join('').length;
  if(used < String(text || '').length && lines.length){
    let last = lines[lines.length - 1];
    while(last && context.measureText(`${last}…`).width > maxWidth) last = last.slice(0, -1);
    lines[lines.length - 1] = `${last}…`;
  }
  return lines;
}
function createTextCoverDataUrl(title, content, category, themeId){
  try {
    const theme = textCoverTheme(themeId);
    const canvas = document.createElement('canvas');
    canvas.width = 720;
    canvas.height = 960;
    const context = canvas.getContext('2d');
    if(!context) return '';
    context.fillStyle = theme.bg;
    context.fillRect(0, 0, canvas.width, canvas.height);
    let x = 76;
    let y = 306;
    let titleWidth = 570;
    let bodyWidth = 540;
    let titleColor = theme.ink;
    let bodyColor = theme.ink;

    if(theme.id === 'garden'){
      context.fillStyle = theme.accent;
      context.fillRect(0, 0, 128, canvas.height);
      context.globalAlpha = .32;
      context.fillStyle = '#fff';
      context.fillRect(38, 74, 12, 812);
      context.globalAlpha = 1;
      x = 166;
      titleWidth = 470;
      bodyWidth = 452;
      context.fillStyle = theme.label;
      context.fillRect(x, 88, 126, 42);
      context.fillStyle = theme.accent;
      context.font = '800 20px "PingFang SC", "Noto Sans SC", sans-serif';
      context.fillText(String(category || '生活').slice(0, 8), x + 17, 116);
      context.fillStyle = theme.accent;
      context.font = '700 82px Georgia, serif';
      context.fillText('“', x, 248);
    } else if(theme.id === 'paper'){
      context.strokeStyle = '#E5DDD0';
      context.lineWidth = 2;
      for(let offset = 84; offset < 900; offset += 88){
        context.beginPath(); context.moveTo(58, offset); context.lineTo(662, offset); context.stroke();
      }
      context.fillStyle = theme.accent;
      context.fillRect(76, 84, 90, 14);
      context.fillStyle = theme.ink;
      context.font = '800 21px "PingFang SC", "Noto Sans SC", sans-serif';
      context.fillText(String(category || '生活').slice(0, 8), 76, 145);
      context.fillStyle = theme.accent;
      context.font = '700 102px Georgia, serif';
      context.fillText('“', 72, 270);
      y = 330;
    } else if(theme.id === 'sunset'){
      context.fillStyle = theme.label;
      context.fillRect(58, 80, 604, 616);
      context.fillStyle = theme.accent;
      context.fillRect(58, 80, 604, 126);
      context.fillStyle = '#5D3329';
      context.font = '900 22px "PingFang SC", "Noto Sans SC", sans-serif';
      context.fillText(String(category || '生活').slice(0, 8), 86, 157);
      context.fillStyle = '#5D3329';
      context.font = '700 98px Georgia, serif';
      context.fillText('“', 78, 294);
      titleColor = '#4A2A22';
      bodyColor = '#654036';
      x = 86;
      y = 354;
      titleWidth = 530;
      bodyWidth = 510;
    } else if(theme.id === 'night'){
      context.strokeStyle = theme.accent;
      context.globalAlpha = .55;
      context.lineWidth = 4;
      context.strokeRect(42, 42, 636, 876);
      context.beginPath(); context.moveTo(78, 186); context.lineTo(642, 186); context.stroke();
      context.globalAlpha = 1;
      context.fillStyle = theme.accent;
      context.font = '800 20px "PingFang SC", "Noto Sans SC", sans-serif';
      context.fillText(String(category || '生活').slice(0, 8).toUpperCase(), 78, 130);
      context.fillStyle = theme.accent;
      context.font = '700 96px Georgia, serif';
      context.fillText('“', 72, 300);
      y = 354;
    }

    context.fillStyle = titleColor;
    context.font = '900 52px "PingFang SC", "Noto Sans SC", sans-serif';
    const titleLines = wrapTextForCanvas(context, title, titleWidth, 4);
    titleLines.forEach(line => { context.fillText(line, x, y); y += 72; });
    context.fillStyle = theme.accent;
    context.fillRect(x, y + 20, theme.id === 'sunset' ? 122 : 74, 8);
    context.fillStyle = bodyColor;
    context.globalAlpha = .82;
    context.font = '500 26px "PingFang SC", "Noto Sans SC", sans-serif';
    const bodyLines = wrapTextForCanvas(context, content, bodyWidth, 4);
    y += 92;
    bodyLines.forEach(line => { context.fillText(line, x, y); y += 42; });
    context.globalAlpha = 1;
    context.fillStyle = theme.accent;
    context.font = '800 18px "PingFang SC", "Noto Sans SC", sans-serif';
    context.fillText('乐生活  SCOOP CITY', x, 884);
    context.globalAlpha = .52;
    context.fillStyle = theme.accent;
    context.fillRect(x, 906, theme.id === 'garden' ? 452 : 568, 2);
    context.globalAlpha = 1;
    return canvas.toDataURL('image/jpeg', .84);
  } catch(error){
    console.warn('文字配图生成失败:', error.message);
    return '';
  }
}
function textCoverAssetPath(){
  const token = globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function'
    ? globalThis.crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `text-covers/${session.user.id}/${Date.now()}-${token}.jpg`;
}
function publicStorageObjectUrl(bucket, path){
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${storageObjectPathUrl(path)}`;
}
async function uploadTextCoverAsset(dataUrl){
  return uploadMediaDataUrl(dataUrl, 'text-covers');
}
function renderTextCoverThemes(){
  const holder = document.getElementById('textCoverThemes');
  if(!holder) return;
  holder.innerHTML = TEXT_COVER_THEMES.map(theme => `<button type="button" class="text-cover-theme ${theme.id === textCoverDraftTheme ? 'active' : ''}" onclick="selectTextCoverTheme('${theme.id}')">${theme.name}<span>${theme.note}</span></button>`).join('');
}
function renderTextCoverPreview(){
  const source = textCoverSourceText();
  textCoverDraftImage = createTextCoverDataUrl(source.title, source.content, source.category, textCoverDraftTheme);
  const preview = document.getElementById('textCoverPreviewImage');
  if(preview){
    preview.src = textCoverDraftImage;
    preview.alt = `${textCoverTheme(textCoverDraftTheme).name}文字配图预览`;
  }
  renderTextCoverThemes();
}
function openTextCoverMaker(){
  const title = (document.getElementById('fTitle')?.value || '').trim();
  if(!title){ showToast('先写一个标题，再制作文字配图'); document.getElementById('fTitle')?.focus(); return; }
  textCoverDraftTheme = textCardCover?.theme || textCoverDraftTheme || 'garden';
  renderTextCoverPreview();
  document.getElementById('textCoverOverlay')?.classList.add('open');
}
function closeTextCoverMaker(){ document.getElementById('textCoverOverlay')?.classList.remove('open'); }
function selectTextCoverTheme(themeId){
  textCoverDraftTheme = themeId;
  renderTextCoverPreview();
}
function useTextCover(){
  if(!textCoverDraftImage){ showToast('文字配图生成失败，请重试'); return; }
  const source = textCoverSourceText();
  textCardCover = { dataUrl:textCoverDraftImage, theme:textCoverDraftTheme, title:source.title, content:source.content };
  closeTextCoverMaker();
  renderImageGrid();
  scheduleComposeDraftSave();
  showToast('已使用文字配图作为封面');
}
function removeTextCardCover(event){
  if(event) event.stopPropagation();
  textCardCover = null;
  renderImageGrid();
  scheduleComposeDraftSave();
}
function setPublishProgress(text, percent){
  const panel = document.getElementById('publishProgress');
  const label = document.getElementById('publishProgressText');
  const value = document.getElementById('publishProgressPercent');
  const bar = document.getElementById('publishProgressBar');
  const safePercent = Math.max(0, Math.min(100, Math.round(Number(percent) || 0)));
  if(label) label.textContent = text || '正在发布';
  if(value) value.textContent = `${safePercent}%`;
  if(bar) bar.style.width = `${safePercent}%`;
  if(panel) panel.classList.add('show');
}
function hidePublishProgress(delay=650){
  window.setTimeout(() => document.getElementById('publishProgress')?.classList.remove('show'), delay);
}
function beginImageProcessing(count){
  if(imageProcessingCount === 0){ imageProcessingTotal = 0; imageProcessingDone = 0; }
  imageProcessingCount += count;
  imageProcessingTotal += count;
}
function finishImageProcessing(){
  imageProcessingCount = Math.max(0, imageProcessingCount - 1);
  imageProcessingDone += 1;
  const progressPanel = document.getElementById('publishProgress');
  if(progressPanel?.classList.contains('show') && imageProcessingTotal > 0){
    const percent = 18 + Math.round((imageProcessingDone / imageProcessingTotal) * 32);
    setPublishProgress(imageProcessingCount ? `正在处理图片（${imageProcessingDone}/${imageProcessingTotal}）` : '图片已准备完成，正在发布…', percent);
  }
  if(imageProcessingCount === 0){
    const waiters = imageProcessingWaiters.splice(0);
    waiters.forEach(resolve => resolve());
  }
}
function waitForImageProcessing(){
  if(imageProcessingCount === 0) return Promise.resolve();
  return new Promise(resolve => imageProcessingWaiters.push(resolve));
}
function handleMultiImageUpload(e){
  const all = Array.from(e.target.files);
  const videos = all.filter(f => f.type.startsWith('video/'));
  let files = all.filter(f => f.type.startsWith('image/'));
  // 编辑文字配图笔记时，上传真实照片即视为替换原文字封面，而不是在后面追加。
  if(files.length && editingPostId !== null && uploadedImages.length && uploadedImages.every(isTextCoverAssetUrl)){
    uploadedImages = [];
    coverImageIndex = 0;
  }
  if(videos.length || files.length) textCardCover = null;
  const videoMode = selectedVideos.length > 0;

  /* ---- 视频：独占模式，仅1个，且不能与照片轮播混用 ---- */
  if(videos.length){
    if(uploadedImages.length > 0 && !videoMode){
      showToast('已选择照片，不能再添加视频（如需发视频请先删除照片）');
    } else if(videoMode){
      showToast('只能选择1个视频');
    } else {
      const v = videos[0];
      const vObj = { name: v.name, url: URL.createObjectURL(v), size: v.size, file: v, uploadedId: null };
      selectedVideos.push(vObj);
      showToast('已选视频，正在自动截取封面…');
      captureVideoPoster(vObj); // 自动截第一帧做封面（可手动替换）
    }
    renderImageGrid();
    scheduleComposeDraftSave();
  }

  /* ---- 照片 ---- */
  if(files.length === 0){ e.target.value=''; return; }
  if(selectedVideos.length > 0){
    // 视频模式：照片只能作为1张封面
    if(files.length > 1) showToast('视频模式只需1张封面，已取第一张');
    files = [files[0]];
    const file = files[0];
    if(file.size > 10*1024*1024){ showToast('封面图片不超过10MB'); e.target.value=''; return; }
    const reader = new FileReader();
    reader.onload = ev=>{
      compressImage(ev.target.result, compressedData=>{
        uploadedImages = [compressedData]; // 覆盖为唯一封面
        coverImageIndex = 0;
        renderImageGrid();
        scheduleComposeDraftSave();
        showToast('✓ 封面已设置');
      });
    };
    reader.readAsDataURL(file);
    e.target.value='';
    return;
  }

  const available = Math.max(0, 15 - uploadedImages.length);
  if(!available){ showToast('照片最多15张'); e.target.value=''; return; }
  if(files.length > available){ showToast(`照片最多15张，已选择前${available}张`); files = files.slice(0, available); }
  const validFiles = files.filter(file => {
    if(file.size <= 10*1024*1024) return true;
    showToast('单张图片不超过10MB');
    return false;
  });
  if(!validFiles.length){ e.target.value=''; return; }
  const shouldPromoteNewImage = editingPostId !== null;
  const compressedImages = new Array(validFiles.length);
  let processed = 0;
  beginImageProcessing(validFiles.length);
  const completeOne = () => {
    processed += 1;
    if(processed === validFiles.length){
      const readyImages = compressedImages.filter(Boolean);
      if(readyImages.length){
        // 编辑既有笔记时，新选的第一张图会移到第一位，第一位永远是封面。
        uploadedImages = shouldPromoteNewImage ? [...readyImages, ...uploadedImages] : [...uploadedImages, ...readyImages];
        coverImageIndex = 0;
        renderImageGrid();
        scheduleComposeDraftSave();
      }
    }
    finishImageProcessing();
  };
  validFiles.forEach((file, index)=>{
    const reader = new FileReader();
    reader.onload = ev=>{
      compressImage(ev.target.result, compressedData=>{
        compressedImages[index] = compressedData;
        completeOne();
      }, () => {
        showToast('有图片处理失败，请换一张后重试');
        completeOne();
      });
    };
    reader.onerror = () => { showToast('图片读取失败，请重试'); completeOne(); };
    reader.readAsDataURL(file);
  });
  e.target.value = ''; // 允许再次选择相同文件
}
function renderImageGrid(){
  const grid = document.getElementById('imagesGrid');
  if(uploadedImages.length === 0 && selectedVideos.length === 0){
    if(textCardCover?.dataUrl){
      grid.style.display = 'grid';
      document.getElementById('uploadBox').style.display = 'none';
      grid.innerHTML = `<div class="text-cover-tile"><img src="${textCardCover.dataUrl}" alt="文字配图封面"><b>文字配图</b><button type="button" aria-label="移除文字配图" onclick="removeTextCardCover(event)">×</button></div><div class="image-item add-more" onclick="document.getElementById('fImages').click()" title="上传照片或视频"><span class="add-plus">＋</span><span class="add-hint">上传图片</span></div>`;
      return;
    }
    grid.style.display = 'none';
    document.getElementById('uploadBox').style.display = 'flex';
    return;
  }
  document.getElementById('uploadBox').style.display = 'none';
  grid.style.display = 'grid';
  grid.innerHTML = selectedVideos.length > 0 ? '' : uploadedImages.map((img,idx)=>`
    <div class="image-item ${idx===0?'cover':''}" draggable="true" data-image-index="${idx}"
      onclick="setCover(${idx})" ondragstart="startImageDrag(event,${idx})" ondragover="dragOverImage(event,${idx})" ondragleave="leaveImageDrag(event)" ondrop="dropImageDrag(event,${idx})" ondragend="endImageDrag()"
      ontouchstart="startImageTouchDrag(event,${idx})" ontouchend="endImageTouchDrag(event)">
      <img src="${img}" alt="">
      ${idx===0?'<span class="cover-label">封面</span>':''}
      <button type="button" class="remove-btn" onclick="removeImage(event,${idx})">✕</button>
    </div>
  `).join('');

  /* 视频模式：视频卡 + 封面卡/上传封面＋（不显示9张计数） */
  if(selectedVideos.length > 0){
    const v = selectedVideos[0];
    const coverTile = uploadedImages.length > 0 ? `
      <div class="image-item cover">
        <img src="${uploadedImages[0]}" alt="">
        <span class="cover-label">封面</span>
        <button type="button" class="remove-btn" onclick="removeImage(event,0)">✕</button>
      </div>` : `
      <div class="image-item add-more" onclick="document.getElementById('fImages').click()" title="上传封面">
        <span class="add-plus">＋</span>
        <span class="add-hint">上传封面</span>
      </div>`;
    const uploaded = !!v.uploadedId;
    grid.innerHTML = `
      <div class="image-item video-item">
        <video src="${v.url}" muted playsinline style="width:100%;height:100%;object-fit:cover;"></video>
        <span class="video-badge">${uploaded ? '✓ 已上传YouTube' : '视频'}</span>
        <button type="button" class="remove-btn" onclick="removeVideo(event,0)">✕</button>
      </div>` + coverTile + `
      <div style="grid-column:1/-1;margin-top:4px;">
        ${uploaded ? `
          <div style="font-size:12px;color:var(--sage-dark);font-weight:600;">✓ 已上传到你的YouTube频道，发布后即可播放</div>
        ` : `
          <button type="button" onclick="uploadToYouTube()" id="ytUploadBtn"
            style="width:100%;padding:11px;border-radius:10px;border:none;background:#FF0000;color:#fff;font-weight:600;font-size:13px;cursor:pointer;">
            ▶️ 授权并上传到我的 YouTube
          </button>
          <div id="ytProgressWrap" style="display:none;margin-top:8px;">
            <div style="height:8px;background:var(--bg-alt);border-radius:999px;overflow:hidden;">
              <div id="ytProgressBar" style="height:100%;width:0%;background:#FF0000;transition:width .2s;"></div>
            </div>
            <div id="ytProgressText" style="font-size:11px;color:var(--ink-faint);margin-top:4px;text-align:center;">准备中…</div>
          </div>
          <div style="font-size:11px;color:var(--ink-faint);margin-top:6px;text-align:center;">或自行上传YouTube后，把链接粘到下方"YouTube视频链接"栏</div>
        `}
      </div>`;
    return;
  }

  /* 照片模式：追加＋号 */
  grid.innerHTML += (uploadedImages.length < 15 ? `
    <div class="image-item add-more" onclick="document.getElementById('fImages').click()" title="继续添加照片或视频">
      <span class="add-plus">＋</span>
      <span class="add-hint">${uploadedImages.length}/15</span>
    </div>
  ` : '');
}
/* ====== YouTube 授权上传（用户上传到自己的频道）====== */
const GOOGLE_CLIENT_ID = '799459882539-r6ahgpdqsdvtp16u1cdl185m8jvpteu0.apps.googleusercontent.com';
let ytTokenClient = null;
let ytAccessToken = null;

function ensureYtTokenClient(){
  if(ytTokenClient) return true;
  if(!(window.google && google.accounts && google.accounts.oauth2)){
    showToast('Google 组件加载中，请稍后重试');
    return false;
  }
  ytTokenClient = google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: 'https://www.googleapis.com/auth/youtube.upload',
    callback: (resp) => {
      if(resp && resp.access_token){
        ytAccessToken = resp.access_token;
        doYouTubeUpload();
      } else {
        showToast('YouTube 授权未完成');
      }
    }
  });
  return true;
}
function uploadToYouTube(){
  const v = selectedVideos[0];
  if(!v || !v.file){ showToast('请先选择视频'); return; }
  if(!ensureYtTokenClient()) return;
  if(ytAccessToken){ doYouTubeUpload(); }
  else { ytTokenClient.requestAccessToken(); } // 弹出Google授权窗口
}
async function doYouTubeUpload(){
  const v = selectedVideos[0];
  if(!v || !v.file) return;
  const btn = document.getElementById('ytUploadBtn');
  const wrap = document.getElementById('ytProgressWrap');
  const bar = document.getElementById('ytProgressBar');
  const txt = document.getElementById('ytProgressText');
  if(btn) btn.disabled = true, btn.textContent = '上传中…';
  if(wrap) wrap.style.display = 'block';

  const title = (document.getElementById('fTitle').value.trim() || v.name || '乐生活视频').slice(0, 90);
  const meta = {
    snippet: { title, description: '来自乐生活 escoopcity.com' },
    status: { privacyStatus: 'unlisted' } // 不公开列出，但有链接可看和嵌入
  };
  try {
    /* 第一步：初始化可续传上传，拿到上传地址 */
    const init = await fetch('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ytAccessToken}`,
        'Content-Type': 'application/json',
        'X-Upload-Content-Type': v.file.type || 'video/mp4',
        'X-Upload-Content-Length': String(v.file.size)
      },
      body: JSON.stringify(meta)
    });
    if(init.status === 401){ ytAccessToken = null; ytTokenClient.requestAccessToken(); return; }
    if(!init.ok){
      const t = await init.text();
      throw new Error(`初始化失败 ${init.status}: ${t.slice(0,120)}`);
    }
    const uploadUrl = init.headers.get('Location');
    if(!uploadUrl) throw new Error('未获得上传地址');

    /* 第二步：XHR 上传文件（带进度） */
    const videoId = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', v.file.type || 'video/mp4');
      xhr.upload.onprogress = (e) => {
        if(e.lengthComputable && bar && txt){
          const pct = Math.round(e.loaded / e.total * 100);
          bar.style.width = pct + '%';
          txt.textContent = `上传中 ${pct}%（${(e.loaded/1048576).toFixed(1)}MB / ${(e.total/1048576).toFixed(1)}MB）`;
        }
      };
      xhr.onload = () => {
        if(xhr.status >= 200 && xhr.status < 300){
          try { resolve(JSON.parse(xhr.responseText).id); }
          catch(e){ reject(new Error('解析响应失败')); }
        } else reject(new Error(`上传失败 ${xhr.status}: ${xhr.responseText.slice(0,120)}`));
      };
      xhr.onerror = () => reject(new Error('网络错误'));
      xhr.send(v.file);
    });

    /* 第三步：填入链接，标记完成 */
    v.uploadedId = videoId;
    document.getElementById('fYoutube').value = `https://youtu.be/${videoId}`;
    updateYoutubePreview();
    if(txt) txt.textContent = '✓ 上传完成！';
    renderImageGrid();
    showToast('🎉 视频已上传到你的YouTube频道！');
  } catch(err){
    console.error('YouTube上传失败:', err);
    if(txt) txt.textContent = '❌ ' + err.message;
    if(btn) btn.disabled = false, btn.textContent = '▶️ 重试上传';
    const em = err.message.toLowerCase();
    if(em.includes('quota')) showToast('今日上传名额已用完，请自行上传后贴链接');
    else if(em.includes('youtubesignuprequired') || em.includes('channelnotfound') || em.includes('unauthorized')) showToast('该Google账号还没有YouTube频道，请先去YouTube创建');
    else showToast('上传失败：' + err.message.slice(0, 60));
  }
}

/* 自动截取视频第1秒附近作为封面（用户没手动传封面时使用） */
function captureVideoPoster(vObj){
  try {
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.src = vObj.url;
    const cleanup = () => { video.src = ''; };
    video.onloadeddata = () => {
      // 跳到第1秒附近，避开纯黑首帧；过短视频则退到安全位置。
      const duration = video.duration || 1;
      video.currentTime = Math.min(1, Math.max(0.1, duration - 0.05));
    };
    video.onseeked = () => {
      try {
        const maxW = 700;
        const scale = Math.min(1, maxW / (video.videoWidth || maxW));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round((video.videoWidth || 400) * scale);
        canvas.height = Math.round((video.videoHeight || 533) * scale);
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        const poster = canvas.toDataURL('image/jpeg', 0.7);
        // 只在用户尚未手动设封面时应用
        if(uploadedImages.length === 0 && selectedVideos.length > 0){
          uploadedImages = [poster];
          coverImageIndex = 0;
          renderImageGrid();
          showToast('✓ 已自动生成封面（可点封面上的✕换成自己的图）');
        }
      } catch(err){
        console.warn('截帧失败:', err.message);
      }
      cleanup();
    };
    video.onerror = () => { console.warn('视频封面截取失败'); cleanup(); };
  } catch(e){ console.warn('captureVideoPoster:', e.message); }
}

/* ====== 消息中心 2.91：评论和@ / 新增粉丝 / 赞和收藏 + 私信 ====== */
let dmRows = [];
let memberActivityRows = [];
let moderationNoticeRows = [];
window._msgCat = null;

function readTsKey(){ return 'wanba_read_' + (session && session.user ? session.user.id : 'guest'); }
function getReadTs(){
  try { return JSON.parse(localStorage.getItem(readTsKey()) || '{}'); } catch(e){ return {}; }
}
function setReadTs(cat){
  const t = getReadTs(); t[cat] = new Date().toISOString();
  localStorage.setItem(readTsKey(), JSON.stringify(t));
}
function myPostIds(){
  const me = session && session.user ? session.user.id : null;
  if(!me) return new Set();
  return new Set(posts.filter(p => p.user_id === me).map(p => p.id));
}
function myNick(){
  if(!(session && session.user)) return null;
  // 2.93：优先取"我的"页可编辑的昵称，其次才回退到注册时的邮箱前缀
  return (typeof currentUser !== 'undefined' && currentUser.name)
    ? currentUser.name
    : ((session.user.user_metadata && session.user.user_metadata.name) || session.user.email.split('@')[0]);
}
/* 评论和@：我帖子下的评论 + 任何@我的评论 */
function cmtNotifs(){
  const me = session && session.user ? session.user.id : null;
  const mine = myPostIds();
  const nick = myNick();
  return (window._cmtRows || []).filter(r =>
    r.user_id !== me && (mine.has(r.post_id) || r.reply_to_user_id === me || (nick && r.text && r.text.includes('@' + nick)))
  ).sort((a,b) => (b.created_at||'').localeCompare(a.created_at||''));
}
/* 赞和收藏合并 */
function lfNotifs(){
  const me = session && session.user ? session.user.id : null;
  const mine = myPostIds();
  const L = (window._likeRows || []).filter(r => mine.has(r.post_id) && r.user_id !== me).map(r => ({...r, _t:'like'}));
  const F = (window._favRows || []).filter(r => mine.has(r.post_id) && r.user_id !== me).map(r => ({...r, _t:'fav'}));
  return L.concat(F).sort((a,b) => (b.created_at||'').localeCompare(a.created_at||''));
}
/* 新增粉丝：关注过我的（含已取关，靠active区分） */
function fanRows(){
  const me = session && session.user ? session.user.id : null;
  if(!me) return [];
  return (window._followRows || []).filter(f => f.followee_id === me)
    .sort((a,b) => (b.created_at||'').localeCompare(a.created_at||''));
}
function unreadCounts(){
  const ts = getReadTs();
  const me = session && session.user ? session.user.id : null;
  const dm = dmRows.filter(m => m.to_id === me && (!ts.dm || m.created_at > ts.dm)).length;
  const cmt = cmtNotifs().filter(r => !ts.cmt || (r.created_at||'') > ts.cmt).length;
  const fans = fanRows().filter(r => r.active && (!ts.fans || (r.created_at||'') > ts.fans)).length;
  const lf = lfNotifs().filter(r => !ts.lf || (r.created_at||'') > ts.lf).length;
  return { dm, cmt, fans, lf, total: dm + cmt + fans + lf };
}
function updateNavMsgDot(){
  const btn = document.querySelector('[data-tab="message"]');
  if(!btn) return;
  btn.style.position = 'relative';
  let dot = btn.querySelector('.nav-msg-dot');
  const u = unreadCounts();
  if(u.total > 0){
    if(!dot){ dot = document.createElement('span'); dot.className = 'nav-msg-dot'; btn.appendChild(dot); }
  } else if(dot){ dot.remove(); }
  const map = { dotDm:'dm', dotCmt:'cmt', dotFans:'fans', dotLf:'lf' };
  Object.entries(map).forEach(([id, k]) => {
    const el = document.getElementById(id);
    if(el) el.classList.toggle('on', u[k] > 0);
  });
}
async function loadDms(){
  try { dmRows = await messageDataLoader?.loadDirectMessages() || []; }
  catch(e){ dmRows = []; }
}
async function loadMemberActivityNotifications(){
  if(!(session && session.user)){ memberActivityRows = []; updateNavMsgDot(); return []; }
  try {
    memberActivityRows = await messageDataLoader?.loadMemberActivities() || [];
  } catch(e){ console.warn('会员权益通知读取失败:', e.message); memberActivityRows = []; }
  updateNavMsgDot();
  return memberActivityRows;
}
async function loadModerationNotices(showLatest=false){
  if(!(session && session.user)){ moderationNoticeRows=[]; return []; }
  try {
    moderationNoticeRows=await messageDataLoader?.loadModerationNotices() || [];
    const unread=moderationNoticeRows.find(row=>!row.read_at);
    if(showLatest && unread) openModerationNotice(unread);
  } catch(e){ moderationNoticeRows=[]; }
  return moderationNoticeRows;
}
function openModerationNotice(row){
  if(!row) return;
  const body=document.getElementById('moderationNoticeBody');
  if(body) body.innerHTML=`<div style="padding:4px 0 14px;"><div style="font-size:18px;font-weight:900;color:var(--ink);">${escHtml(row.title||'账号通知')}</div><div style="white-space:pre-wrap;font-size:14px;line-height:1.75;color:var(--ink-soft);margin-top:12px;">${escHtml(row.body||'')}</div><div style="font-size:11px;color:var(--ink-faint);margin-top:14px;">${fmtTime(row.created_at)}</div></div><button class="feedback-submit" onclick="closeModerationNotice()">我知道了</button>`;
  document.getElementById('moderationNoticeOverlay')?.classList.add('open');
}
async function closeModerationNotice(){
  document.getElementById('moderationNoticeOverlay')?.classList.remove('open');
  const ids=moderationNoticeRows.filter(row=>!row.read_at).map(row=>row.id); if(!ids.length) return;
  try { await authedFetch(`${SUPABASE_URL}/rest/v1/user_moderation_notices?id=in.(${ids.join(',')})`,{method:'PATCH',body:JSON.stringify({read_at:new Date().toISOString()})}); moderationNoticeRows=moderationNoticeRows.map(row=>ids.includes(row.id)?Object.assign({},row,{read_at:new Date().toISOString()}):row); } catch(e){}
}
async function markMemberActivityRead(){
  if(!(session && session.user)) return;
  try { memberActivityRows = await messageDataLoader?.markMemberActivitiesRead(memberActivityRows) || memberActivityRows; }
  catch(e){}
}
async function openMemberActivityTarget(row){
  if(!row) return;
  if(row.kind === 'coupon' && row.coupon_claim_id){ openMerchantCouponWallet(row.coupon_claim_id); return; }
  await loadUserMembershipCards(true);
  const card = (window._userMembershipCards.rows || []).find(item => String(item.id) === String(row.membership_id));
  if(card) showMemberCardPresenter(card.id);
  else showToast('对应会员卡暂时不可用');
}
function openMemberActivityTargetById(id){
  const row = (memberActivityRows || []).find(item => String(item.id) === String(id));
  if(row) openMemberActivityTarget(row);
}
function initMessagePage(){
  window._msgCat = null;
  document.getElementById('msgDetail')?.classList.remove('dm-thread-detail');
  document.getElementById('msgHome').style.display = 'block';
  document.getElementById('msgDetail').style.display = 'none';
  loadDms().then(() => { renderDmList(); updateNavMsgDot(); });
  renderDmList();
  updateNavMsgDot();
}
function fmtTime(iso){
  try { return new Date(iso).toLocaleString('zh-CN', {month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'}); } catch(e){ return ''; }
}
function avatarSpan(name, size){
  return `<span class="avatar" style="background:${avatarColor(name||'友')};width:${size}px;height:${size}px;border-radius:50%;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0;">${initials(name||'友')}</span>`;
}
/* ---- 私信会话列表（消息首页下方） ---- */
function renderDmList(){
  const box = document.getElementById('dmList');
  if(!box) return;
  const me = session && session.user ? session.user.id : null;
  if(!me){
    box.innerHTML = `<div class="empty-state"><span style="display:block;margin:0 auto 10px;width:36px;height:36px;color:var(--ink-faint);">${uiIcon('lock',36)}</span><p>登录后查看消息</p></div>`;
    return;
  }
  const convs = {};
  dmRows.forEach(m => {
    const other = m.from_id === me ? m.to_id : m.from_id;
    if(!convs[other]) convs[other] = { id: other, name: '对方', msgs: [] };
    if(m.from_id !== me) convs[other].name = m.from_name;
    convs[other].msgs.push(m);
  });
  const list = Object.values(convs).sort((a,b) => b.msgs[b.msgs.length-1].created_at.localeCompare(a.msgs[a.msgs.length-1].created_at));
  box.innerHTML = list.length ? list.map(c => {
    const last = c.msgs[c.msgs.length-1];
    return `<div onclick="openThread('${c.id}','${(c.name||'').replace(/'/g,'')}')" style="display:flex;gap:12px;align-items:center;padding:13px 16px;border-bottom:1px solid var(--line);cursor:pointer;">
      ${avatarHomeLinkHtml(c.id, c.name, 44)}
      <div style="flex:1;min-width:0;">
        <div style="font-size:14px;font-weight:600;">${c.name||'用户'}</div>
        <div style="font-size:12px;color:var(--ink-faint);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${last.from_id===me?'我: ':''}${escHtml(dmMessagePreview(last.text))}</div>
      </div>
      <span style="font-size:11px;color:var(--ink-faint);flex-shrink:0;">${fmtTime(last.created_at)}</span>
    </div>`;
  }).join('') : '<div style="text-align:center;padding:30px 20px;color:var(--ink-faint);font-size:13px;">暂无私信 · 在帖子页可私信作者</div>';
}
/* ---- 三大分类详情页 ---- */
function msgDetailShell(title, inner){
  return `
    <div style="display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid var(--line);">
      <button onclick="initMessagePage()" style="border:none;background:none;font-size:22px;cursor:pointer;padding:0;">‹</button>
      <b style="font-size:15px;">${title}</b>
    </div>
    <div>${inner}</div>`;
}
function openMsgCat(cat, keep){
  window._msgCat = cat;
  if(!keep) setReadTs(cat);
  const home = document.getElementById('msgHome');
  const detail = document.getElementById('msgDetail');
  home.style.display = 'none';
  detail.style.display = 'block';
  const me = session && session.user ? session.user.id : null;
  if(!me){
    detail.innerHTML = msgDetailShell('消息', '<div class="empty-state"><p>请先登录</p></div>');
    updateNavMsgDot();
    return;
  }
  if(cat === 'cmt'){
    const rows = cmtNotifs();
    if(!keep && rows.length){
      loadProfilesForIds(rows.map(row => row.user_id)).then(() => {
        if(window._msgCat === 'cmt' && document.getElementById('msgDetail')?.style.display !== 'none') openMsgCat('cmt', true);
      });
    }
    const nick = myNick();
    detail.innerHTML = msgDetailShell('评论和@', rows.length ? rows.map(r => {
      const p = posts.find(x => x.id === r.post_id);
      const profile = cachedProfile(r.user_id, r.name);
      const displayName = profile.name || r.name || '用户';
      const isReplyToMe = r.reply_to_user_id === me;
      const isAt = !isReplyToMe && nick && r.text && r.text.includes('@' + nick) && !myPostIds().has(r.post_id);
      const verb = isReplyToMe ? '回复了你的评论' : (isAt ? '@了你' : '评论了你的笔记');
      return `<div style="display:flex;gap:12px;padding:13px 16px;border-bottom:1px solid var(--line);cursor:pointer;" onclick="${p?`openPost(${p.id})`:''}">
        ${avatarHomeLinkHtml(r.user_id, displayName, 40)}
        <div style="flex:1;min-width:0;">
          <div style="font-size:13.5px;"><b>${escHtml(displayName)}</b> ${verb}</div>
          <div style="font-size:13px;color:var(--ink-soft);margin:3px 0;">${r.text}</div>
          <div style="font-size:11px;color:var(--ink-faint);">${p ? '《'+p.title.slice(0,18)+'》 · ' : ''}${fmtTime(r.created_at)}</div>
        </div>
      </div>`;
    }).join('') : `<div class="empty-state"><span style="display:block;margin:0 auto 10px;width:36px;height:36px;color:var(--ink-faint);">${uiIcon('message',36)}</span><p>还没有评论或@</p></div>`);
  } else if(cat === 'fans'){
    const rows = fanRows();
    const missingProfiles = rows.map(r => r.follower_id).filter(id => id && !window._profileCache[id]);
    if(missingProfiles.length){
      loadProfilesForIds(missingProfiles).then(() => {
        if(window._msgCat === 'fans' && document.getElementById('msgDetail')?.style.display !== 'none') openMsgCat('fans', true);
      });
    }
    detail.innerHTML = msgDetailShell('新增关注', rows.length ? rows.map(r => {
      const profile = cachedProfile(r.follower_id, r.follower_name);
      const displayName = profile.name || r.follower_name || '用户';
      const iFollow = isFollowing(r.follower_id);
      let btn;
      if(iFollow){
        btn = `<button onclick="event.stopPropagation();toggleFollowUser('${r.follower_id}','${String(displayName).replace(/'/g,'')}')" style="padding:6px 14px;border-radius:999px;border:1px solid var(--line);background:#fff;color:var(--ink-faint);font-size:12px;font-weight:600;cursor:pointer;">${isFollowedBy(r.follower_id)?'互相关注':'已关注'}</button>`;
      } else if(r.active){
        btn = `<button onclick="event.stopPropagation();toggleFollowUser('${r.follower_id}','${String(displayName).replace(/'/g,'')}')" style="padding:6px 14px;border-radius:999px;border:none;background:var(--berry);color:#fff;font-size:12px;font-weight:600;cursor:pointer;">回关</button>`;
      } else {
        btn = `<button onclick="event.stopPropagation();toggleFollowUser('${r.follower_id}','${String(displayName).replace(/'/g,'')}')" style="padding:6px 14px;border-radius:999px;border:1px solid var(--berry);background:#fff;color:var(--berry);font-size:12px;font-weight:600;cursor:pointer;">关注</button>`;
      }
      return `<div onclick="openUserPublicPage('${String(r.follower_id || '').replace(/'/g,'')}','${String(displayName).replace(/'/g,'')}')" style="display:flex;gap:12px;align-items:center;padding:13px 16px;border-bottom:1px solid var(--line);cursor:pointer;">
        <span onclick="event.stopPropagation();openUserPublicPage('${String(r.follower_id || '').replace(/'/g,'')}','${String(displayName).replace(/'/g,'')}')" style="display:inline-flex;cursor:pointer;flex-shrink:0;">${avatarCircleSizedHtml(displayName, r.follower_id, 44)}</span>
        <div style="flex:1;min-width:0;">
          <div style="font-size:14px;font-weight:600;">${escHtml(displayName)}</div>
          <div style="font-size:12px;color:var(--ink-faint);">${r.active ? '关注了你' : '曾关注过你（已取关）'} · ${fmtTime(r.created_at)}</div>
        </div>
        ${btn}
      </div>`;
    }).join('') : `<div class="empty-state"><span style="display:block;margin:0 auto 10px;width:36px;height:36px;color:var(--ink-faint);">${uiIcon('user',36)}</span><p>还没有新粉丝</p></div>`);
  } else if(cat === 'lf'){
    const rows = lfNotifs();
    if(!keep && rows.length){
      loadProfilesForIds(rows.map(row => row.user_id)).then(() => {
        if(window._msgCat === 'lf' && document.getElementById('msgDetail')?.style.display !== 'none') openMsgCat('lf', true);
      });
    }
    detail.innerHTML = msgDetailShell('赞和收藏', rows.length ? rows.map(r => {
      const p = posts.find(x => x.id === r.post_id);
      const profile = cachedProfile(r.user_id, r.name);
      const displayName = profile.name || r.name || '用户';
      const verb = r._t === 'like' ? '赞了你的笔记' : '收藏了你的笔记';
      return `<div style="display:flex;gap:12px;align-items:center;padding:13px 16px;border-bottom:1px solid var(--line);">
        ${avatarHomeLinkHtml(r.user_id, displayName, 40)}
        <div style="flex:1;min-width:0;">
          <div style="font-size:13.5px;"><b>${escHtml(displayName)}</b> ${verb}</div>
          <div style="font-size:11px;color:var(--ink-faint);">${p ? '《'+p.title.slice(0,18)+'》 · ' : ''}${fmtTime(r.created_at)}</div>
        </div>
        ${p ? `<button onclick="openPost(${p.id})" style="padding:6px 12px;border-radius:999px;border:1px solid var(--sage);background:#fff;color:var(--sage-dark);font-size:12px;font-weight:600;cursor:pointer;flex-shrink:0;">查看笔记</button>` : ''}
      </div>`;
    }).join('') : `<div class="empty-state"><span style="display:block;margin:0 auto 10px;width:36px;height:36px;color:var(--ink-faint);">${uiIcon('heart',36)}</span><p>还没有赞和收藏</p></div>`);
  } else if(cat === 'member'){
    if(!keep) loadMemberActivityNotifications().then(() => {
      if(window._msgCat === 'member' && document.getElementById('msgDetail')?.style.display !== 'none') openMsgCat('member', true);
    });
    const rows = memberActivityRows || [];
    detail.innerHTML = msgDetailShell('会员权益', rows.length ? rows.map(row => {
      const icon = row.kind === 'coupon' ? uiIcon('inbox',18) : row.kind === 'reward' ? uiIcon('star',18) : row.kind === 'points' ? uiIcon('spark',18) : uiIcon('bag',18);
      return `<div onclick="openMemberActivityTargetById(${Number(row.id)})" style="display:flex;gap:12px;align-items:center;padding:13px 16px;border-bottom:1px solid var(--line);cursor:pointer;"><span style="width:38px;height:38px;border-radius:12px;background:var(--berry-light);color:var(--berry-dark);display:flex;align-items:center;justify-content:center;flex-shrink:0;">${icon}</span><div style="flex:1;min-width:0;"><div style="font-size:13.5px;font-weight:900;">${escHtml(row.title || '会员权益更新')}</div><div style="font-size:12px;color:var(--ink-soft);line-height:1.5;margin-top:3px;">${escHtml(row.body || '')}</div><div style="font-size:11px;color:var(--ink-faint);margin-top:4px;">${escHtml(fmtTime(row.created_at))}</div></div></div>`;
    }).join('') : `<div class="empty-state"><span style="display:block;margin:0 auto 10px;width:36px;height:36px;color:var(--ink-faint);">${uiIcon('inbox',36)}</span><p>还没有会员权益记录</p></div>`);
    if(!keep) markMemberActivityRead().then(updateNavMsgDot);
  }
  updateNavMsgDot();
}
/* ---- 私信聊天流 ---- */
function sharedMessageParts(text){
  const raw = String(text || '');
  if(raw.startsWith('[[LSH_POST_CARD]]')){
    try {
      const card = JSON.parse(raw.slice('[[LSH_POST_CARD]]'.length));
      if(!card || card.postId == null) return null;
      return {
        postId:String(card.postId),
        title:String(card.title || '乐生活笔记'),
        image:String(card.image || ''),
        url:`${window.location.origin}/?post=${encodeURIComponent(card.postId)}`,
        text:''
      };
    } catch(e){ return null; }
  }
  const lines = raw.split('\n');
  if(lines[0] !== '【乐生活分享】' || lines.length < 3) return null;
  const url = lines[lines.length - 1] || '';
  const body = lines.slice(2, -1);
  const coverLineIndex = body.findIndex(line => line.startsWith('【封面】'));
  const image = coverLineIndex >= 0 ? decodeURIComponent(body[coverLineIndex].slice(4)) : '';
  if(coverLineIndex >= 0) body.splice(coverLineIndex, 1);
  let postId = '';
  try { postId = new URL(url, window.location.origin).searchParams.get('post') || ''; } catch(e){}
  return { postId, title:lines[1] || '乐生活内容', text:body.join(' ') || '', url, image };
}
function dmMessagePreview(text){
  const shared = sharedMessageParts(text);
  return shared ? `分享了一篇笔记：${shared.title}` : String(text || '');
}
function openSharedMessage(url){
  try {
    const target = new URL(url, window.location.origin);
    const postId = target.searchParams.get('post');
    if(postId){ switchTab('home'); setTimeout(() => openPost(postId), 120); return; }
  } catch(e){}
  if(url) window.open(url, '_blank', 'noopener');
}
function renderDmMessage(m){
  const shared = sharedMessageParts(m.text);
  if(!shared) return escHtml(m.text || '');
  return `<button onclick="openSharedMessage(decodeURIComponent('${encodeURIComponent(shared.url)}'))" class="dm-shared-post-card">${shared.image ? `<img src="${escAttr(shared.image)}" alt="">` : `<span class="dm-shared-post-placeholder">${uiIcon('image',24)}</span>`}<span><small>乐生活笔记</small><b>${escHtml(shared.title)}</b></span></button>`;
}
function openThread(otherId, otherName){
  setReadTs('dm');
  const home = document.getElementById('msgHome');
  const detail = document.getElementById('msgDetail');
  home.style.display = 'none';
  detail.style.display = 'block';
  detail.classList.add('dm-thread-detail');
  const me = session.user.id;
  const msgs = dmRows.filter(m =>
    (String(m.from_id) === String(me) && String(m.to_id) === String(otherId)) ||
    (String(m.from_id) === String(otherId) && String(m.to_id) === String(me))
  );
  detail.innerHTML = `
    <div class="dm-thread-shell">
    <div class="dm-thread-head" style="display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid var(--line);">
      <button onclick="initMessagePage()" style="border:none;background:none;font-size:22px;cursor:pointer;padding:0;">‹</button>
      <b>${otherName}</b>
    </div>
    <div id="threadList" class="dm-thread-list" style="padding:16px;display:flex;flex-direction:column;gap:10px;overflow-y:auto;">
      ${msgs.map(m => `
        <div style="align-self:${m.from_id===me?'flex-end':'flex-start'};max-width:75%;background:${m.from_id===me?'var(--sage-light)':'var(--bg-alt)'};padding:9px 13px;border-radius:14px;font-size:14px;line-height:1.5;">${renderDmMessage(m)}</div>
      `).join('')}
    </div>
    <div class="dm-thread-composer" style="display:flex;gap:8px;padding:12px 16px;border-top:1px solid var(--line);">
      <input type="text" id="threadInput" placeholder="回复 ${otherName}…" style="flex:1;padding:10px 14px;border:1px solid var(--line);border-radius:999px;font-size:14px;font-family:inherit;">
      <button onclick="sendDm('${otherId}','${(otherName||'').replace(/'/g,'')}')" style="background:var(--berry);color:#fff;border:none;border-radius:999px;padding:10px 18px;font-weight:600;cursor:pointer;">发送</button>
    </div></div>`;
  const tl = document.getElementById('threadList');
  if(tl) tl.scrollTop = tl.scrollHeight;
  updateNavMsgDot();
}
async function sendDm(toId, toName){
  const input = document.getElementById('threadInput') || document.getElementById('dmComposeInput');
  const text = input ? input.value.trim() : '';
  if(!text) return;
  const nick = myNick();
  try {
    if(!messageApi) throw new Error('私信接口未初始化');
    const saved = await messageApi.send({ fromId:session.user.id, fromName:nick, toId, text });
    dmRows.push(saved);
    if(document.getElementById('threadList')) openThread(toId, toName);
    else { closeXhsImport(); showToast('✓ 私信已发送'); }
  } catch(e){ showToast('发送失败：' + e.message); }
}
function openDmTo(toId, toName){
  if(!session || !session.user){ showToast('请先登录'); openAuth(); return; }
  const modal = document.getElementById('xhsModal');
  const content = document.getElementById('xhsContent');
  modal.style.display = 'flex';
  content.innerHTML = `
    <h3 style="font-size:16px;font-weight:700;margin-bottom:14px;">私信 ${toName}</h3>
    <textarea id="dmComposeInput" placeholder="想对TA说什么…" style="width:100%;min-height:100px;padding:12px;border:1px solid var(--line);border-radius:10px;font-size:14px;font-family:inherit;"></textarea>
    <button onclick="sendDm('${toId}','${(toName||'').replace(/'/g,'')}')" style="width:100%;margin-top:12px;background:var(--berry);color:#fff;border:none;padding:12px;border-radius:10px;font-weight:600;cursor:pointer;">发送</button>`;
}

/* ====== 笔记所有者管理：权限/置顶/删除/编辑/转发 ====== */
function visLabel(v){
  if(v === 'private') return '仅自己可见';
  if(v === 'mutual') return '互关好友可见';
  return '公开可见';
}
function openOwnerSheet(event){
  event?.preventDefault?.();
  event?.stopPropagation?.();
  const p = getPost();
  if(!p) return;
  const body = document.getElementById('ownerSheetBody');
  body.innerHTML = `
    <button class="sheet-item" onclick="closeOwnerSheet();closePost();editPost(${p.id})"><span class="si">${uiIcon('edit',19)}</span>编辑</button>
    <button class="sheet-item" onclick="openVisSheet()"><span class="si">${uiIcon('lock',19)}</span>权限设置 <span style="margin-left:auto;font-size:12px;color:var(--ink-faint);font-weight:400;">${visLabel(p.visibility)}</span></button>
    <button class="sheet-item" onclick="togglePin()"><span class="si">${uiIcon('star',19)}</span>${p.pinned ? '取消置顶' : '置顶'}</button>
    <button class="sheet-item" onclick="closeOwnerSheet();openPostShare(${p.id})"><span class="si">${uiIcon('share',19)}</span>转发</button>
    <button class="sheet-item" style="color:#d9534f;" onclick="ownerDeletePost(${p.id})"><span class="si">${uiIcon('trash',19)}</span>删除</button>
  `;
  const sheet = document.getElementById('ownerSheet');
  if(sheet){
    sheet.style.display = 'block';
    // 立即触发布局，避免移动端在下一次触摸事件前才绘制底部菜单。
    void sheet.offsetHeight;
  }
}
function closeOwnerSheet(){ document.getElementById('ownerSheet').style.display = 'none'; }
function openVisSheet(){
  const p = getPost();
  if(!p) return;
  const cur = p.visibility || 'public';
  const opt = (val, label, desc) => `
    <button class="sheet-item" onclick="setVisibility('${val}')">
      <span class="si">${uiIcon(val === 'public' ? 'eye' : (val === 'mutual' ? 'user' : 'lock'),19)}</span>${label}
      <span style="margin-left:auto;font-size:16px;">${cur === val ? '✔️' : ''}</span>
    </button>
    <div style="font-size:11px;color:var(--ink-faint);padding:0 8px 8px 46px;margin-top:-8px;">${desc}</div>`;
  document.getElementById('ownerSheetBody').innerHTML = `
    <div style="font-size:14px;font-weight:700;padding:4px 8px 12px;">谁可以看这篇笔记</div>
    ${opt('public','公开可见','所有人都能在主页看到')}
    ${opt('mutual','互关好友可见','只有互相关注的好友能看到')}
    ${opt('private','仅自己可见','只有你自己能看到')}
    <button class="sheet-item" onclick="openOwnerSheet()" style="justify-content:center;color:var(--ink-faint);">‹ 返回</button>
  `;
}
async function setVisibility(v){
  const p = getPost();
  if(!p) return;
  try {
    await supabaseUpdatePost(p.id, { visibility: v });
    p.visibility = v;
    const st = document.getElementById('visStatus');
    if(st) st.textContent = visLabel(v);
    closeOwnerSheet();
    showToast('✓ 已设为' + visLabel(v).slice(2));
    savePosts();
  } catch(e){ showToast('设置失败：' + e.message); }
}
async function togglePin(){
  const p = getPost();
  if(!p) return;
  return togglePinById(p.id);
}
async function togglePinById(postId){
  const p = findPostById(postId);
  if(!p) return;
  if(!(session && session.user) || String(p.user_id || '') !== String(session.user.id)){ showToast('只能置顶自己的笔记'); return; }
  try {
    const np = !p.pinned;
    if(np){
      const pinnedCount = profilePostsForCurrentUser().filter(item => item.pinned && String(item.id) !== String(p.id)).length;
      if(pinnedCount >= 2){
        showToast('已有两篇置顶，请取消一篇后再尝试');
        return;
      }
    }
    await supabaseUpdatePost(p.id, { pinned: np });
    p.pinned = np;
    closeOwnerSheet();
    showToast(np ? '已置顶' : '已取消置顶');
    savePosts();
    renderFeed();
    initProfilePage();
  } catch(e){ showToast('操作失败：' + e.message); }
}
async function ownerDeletePost(id){
  if(!confirm('确定删除这篇笔记吗？删除后无法恢复')) return;
  try {
    await supabaseDeletePost(id);
    posts = posts.filter(x => String(x.id) !== String(id));
    ownProfilePosts = ownProfilePosts.filter(x => String(x.id) !== String(id));
    closeOwnerSheet();
    closePost();
    renderFeed();
    initProfilePage();
    savePosts();
    showToast('✓ 笔记已删除');
  } catch(e){ showToast('删除失败：' + e.message); }
}

function removeVideo(e, i){
  e.stopPropagation();
  URL.revokeObjectURL(selectedVideos[i].url);
  selectedVideos.splice(i, 1);
  renderImageGrid();
  scheduleComposeDraftSave();
  showToast('已移除视频');
}
let draggedImageIndex = null;
function moveImageToIndex(fromIndex, toIndex){
  if(!Number.isInteger(fromIndex) || !Number.isInteger(toIndex) || fromIndex === toIndex) return;
  const [image] = uploadedImages.splice(fromIndex, 1);
  uploadedImages.splice(toIndex, 0, image);
  coverImageIndex = 0;
  renderImageGrid();
  scheduleComposeDraftSave();
}
function startImageDrag(event, index){
  draggedImageIndex = index;
  event.currentTarget?.classList.add('dragging');
  if(event.dataTransfer){ event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/plain', String(index)); }
}
function dragOverImage(event, index){
  event.preventDefault();
  if(draggedImageIndex !== null && draggedImageIndex !== index) event.currentTarget?.classList.add('drag-over');
}
function leaveImageDrag(event){ event.currentTarget?.classList.remove('drag-over'); }
function dropImageDrag(event, index){
  event.preventDefault();
  const from = draggedImageIndex !== null ? draggedImageIndex : Number(event.dataTransfer?.getData('text/plain'));
  endImageDrag();
  moveImageToIndex(from, index);
}
function endImageDrag(){
  document.querySelectorAll('.image-item.dragging,.image-item.drag-over').forEach(item => item.classList.remove('dragging','drag-over'));
  draggedImageIndex = null;
}
function startImageTouchDrag(event, index){
  draggedImageIndex = index;
  event.currentTarget?.classList.add('dragging');
}
function endImageTouchDrag(event){
  const touch = event.changedTouches && event.changedTouches[0];
  const target = touch ? document.elementFromPoint(touch.clientX, touch.clientY)?.closest('[data-image-index]') : null;
  const from = draggedImageIndex;
  const to = target ? Number(target.dataset.imageIndex) : from;
  endImageDrag();
  if(Number.isInteger(from) && Number.isInteger(to)) moveImageToIndex(from, to);
}
function setCover(idx){
  if(idx === 0) return;
  moveImageToIndex(idx, 0);
  showToast('已移到第一张，作为封面');
}
function removeImage(e, idx){
  e.stopPropagation();
  uploadedImages.splice(idx, 1);
  coverImageIndex = 0;
  renderImageGrid();
  scheduleComposeDraftSave();
}
function toggleEvent(){
  eventOn = !eventOn;
  document.getElementById('eventSwitch').classList.toggle('on', eventOn);
  document.getElementById('eventFields').classList.toggle('open', eventOn);
  scheduleComposeDraftSave();
}
function cleanYoutubeId(value){
  const m = String(value || '').match(/[A-Za-z0-9_-]{11}/);
  return m ? m[0] : null;
}
function extractYoutubeId(url){
  if(!url) return null;
  const raw = String(url).trim();
  if(/^[A-Za-z0-9_-]{11}$/.test(raw)) return raw;
  try {
    const parsed = new URL(raw);
    const host = parsed.hostname.replace(/^www\./, '').replace(/^m\./, '');
    if(host === 'youtu.be') return cleanYoutubeId(parsed.pathname.split('/').filter(Boolean)[0]);
    if(host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')){
      const watchId = parsed.searchParams.get('v');
      if(watchId) return cleanYoutubeId(watchId);
      const parts = parsed.pathname.split('/').filter(Boolean);
      if(['shorts','embed','live','v'].includes(parts[0])) return cleanYoutubeId(parts[1]);
    }
  } catch(e){
    const m = raw.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?[^#]*v=|embed\/|shorts\/|live\/|v\/))([A-Za-z0-9_-]{11})/);
    return m ? m[1] : null;
  }
  return null;
}
function extractVideoInfo(url){
  const youtubeId = extractYoutubeId(url);
  if(youtubeId) return { provider:'youtube', id:youtubeId, url:String(url || '').trim() };
  return null;
}
function cleanPostContent(content){
  return String(content || '')
    .replace(/\n?\s*\[\[tiktok:[^\]]+\]\]\s*/g, '')
    .replace(/\n?\s*\[\[yt_vertical\]\]\s*/g, '')
    .trim();
}
function updateYoutubePreview(){
  const input = document.getElementById('fYoutube');
  const box = document.getElementById('youtubePreview');
  if(!input || !box) return;
  const raw = input.value.trim();
  if(!raw){
    box.classList.remove('open');
    box.innerHTML = '';
    return;
  }
  const info = extractVideoInfo(raw);
  box.classList.add('open');
  if(!info){
    box.innerHTML = `<div class="youtube-preview-note">${uiIcon('alert',14)} 目前仅支持 YouTube 视频链接。</div>`;
    return;
  }
  box.innerHTML = `
    <div class="youtube-preview-thumb">
      ${youtubeThumbImgHtml(info.id, 'YouTube封面')}
      <div class="play-badge">${playIcon()}</div>
    </div>
    <div class="youtube-preview-note">${uiIcon('video',14)} 已识别视频，发布后会用 YouTube 封面作为帖子封面${isYoutubeVerticalSource(info.url) ? '，并按竖屏展示' : ''}。</div>
  `;
}
/* ====== Supabase 写入操作 ====== */
let supabaseClient = null;
function supabaseHeaders(){
  return supabaseClient?.headers() || { 'Content-Type':'application/json', apikey:SUPABASE_KEY, Authorization:`Bearer ${SUPABASE_KEY}`, Prefer:'return=representation' };
}
/* 令牌过期自动刷新（access_token 默认1小时有效） */
async function refreshSession(){
  if(sessionRefreshInFlight) return sessionRefreshInFlight;
  if(!session || !session.refresh_token) return false;
  sessionRefreshInFlight = (async () => {
    const next = await authSessionStore?.refresh(session);
    if(!next) return false;
    session = next;
    authSessionStore?.write(session);
    return true;
  })().finally(() => { sessionRefreshInFlight = null; });
  return sessionRefreshInFlight;
}
supabaseClient = window.LeshenghuoSupabaseClient?.create({
  supabaseKey: SUPABASE_KEY,
  getSession: () => session,
  refreshSession,
  onSessionExpired: ({ isRead }) => {
    logoutUser();
    if(!isRead) showToast('登录已过期，请重新登录');
  }
});
/* 带自动重试的请求：401 时刷新令牌重试一次 */
async function authedFetch(url, options){
  return supabaseClient?.authedFetch(url, options) || fetch(url, options);
}
async function supabaseInsertPost(p){
  if(!postApi) throw new Error('发布接口未初始化');
  return postApi.createPost(p);
}
async function supabaseUpdatePost(id, fields){
  if(!postApi) throw new Error('发布接口未初始化');
  return postApi.updatePost(id, fields);
}
async function supabaseDeletePost(id){
  if(!postApi) throw new Error('发布接口未初始化');
  return postApi.deletePost(id);
}

/* ====== 帖子编辑与删除 ====== */
let editingPostId = null;

function editPost(id){
  const p = findPostById(id);
  if(!p){ showToast('找不到该帖子'); return; }
  editingPostId = id;
  openCompose();
  document.getElementById('fTitle').value = p.title || '';
  document.getElementById('fContent').value = cleanPostContent(p.content || '');
  document.getElementById('fYoutube').value = p.youtube ? ('https://youtu.be/' + p.youtube) : '';
  updateYoutubePreview();
  document.getElementById('fLocation').value = p.location || ''; delete document.getElementById('fLocation').dataset.locationCanonical;
  document.getElementById('titleCount').textContent = (p.title || '').length;
  document.getElementById('contentCount').textContent = (p.content || '').length;
  selectedCat = p.category;
  selectedSubcategory = normalizePostSubcategory(selectedCat, p.subcategory);
  communityPostMeta = p.community_meta && typeof p.community_meta === 'object' ? {...p.community_meta} : {};
  eventOn = isSignupEvent(p.event);
  activityLongTerm = !!(p.event && p.event.activity_long_term);
  document.getElementById('fCapacity').value = eventOn ? (p.event.capacity || '') : '';
  document.getElementById('fDeadline').value = eventOn ? (p.event.deadline || '') : '';
  document.getElementById('fActivityStartDate').value = p.event?.start_date || '';
  document.getElementById('fActivityEndDate').value = p.event?.end_date || '';
  postPublishMode = isPendingScheduledPost(p) ? 'scheduled' : 'now';
  const scheduleInput = document.getElementById('fScheduledAt');
  if(scheduleInput) scheduleInput.value = isPendingScheduledPost(p) ? laDateTimeLocalValue(new Date(p.scheduled_at)) : '';
  updateSchedulePublishUi();
  // 高亮对应分类按钮
  document.querySelectorAll('.cat-pick').forEach(b => {
    b.classList.toggle('sel', b.dataset.c === p.category);
  });
  renderPostSubcategoryPicker();
  renderCommunityPostFields();
  renderActivityPeriodFields();
  document.getElementById('eventSwitch').classList.toggle('on', eventOn);
  document.getElementById('eventFields').classList.toggle('open', eventOn);
  // 加载已有图片到编辑器（可继续追加/删除/换封面）
  const isDefaultImg = p.image && p.image.startsWith('https://images.unsplash.com');
  editingImageThumbnails = Array.isArray(p.image_thumbnails) ? [...p.image_thumbnails] : [];
  if(p.images && p.images.length > 0){
    uploadedImages = [...p.images];
    const ci = p.image ? p.images.indexOf(p.image) : 0;
    if(ci > 0){
      const [cover] = uploadedImages.splice(ci, 1);
      uploadedImages.unshift(cover);
      if(editingImageThumbnails.length){ const [thumb] = editingImageThumbnails.splice(ci, 1); editingImageThumbnails.unshift(thumb); }
    }
    coverImageIndex = 0;
  } else if(p.image && !isDefaultImg){
    uploadedImages = [p.image];
    editingImageThumbnails = [p.image_thumbnail || p.image];
    coverImageIndex = 0;
  } else {
    uploadedImages = [];
    editingImageThumbnails = [];
    coverImageIndex = 0;
  }
  renderImageGrid();
  customTags = Array.isArray(p.tags) ? [...p.tags] : [];
  renderCustomTags();
  showToast('编辑模式：修改后点击发布保存');
}

async function deletePost(id){
  const p = posts.find(x => x.id === id);
  if(!p){ showToast('找不到该帖子'); return; }
  if(!confirm(`确定删除「${p.title}」吗？此操作不可恢复`)) return;

  // 本地删除
  posts = posts.filter(x => x.id !== id);
  savePosts();
  renderFeed();
  initProfilePage();
  showToast('已删除');

  // 同步删除数据库
  try {
    await supabaseDeletePost(id);
    console.log('✓ 数据库已同步删除 id=', id);
  } catch(e){
    console.warn('⚠️ 数据库删除失败（帖子可能在刷新后重新出现）:', e.message);
    showToast('⚠️ 云端删除失败，请检查数据库权限');
  }
}

async function submitPost(){
  const title = document.getElementById('fTitle').value.trim();
  const content = document.getElementById('fContent').value.trim();
  const videoUrl = document.getElementById('fYoutube').value.trim();
  const locationInput = document.getElementById('fLocation');
  const location = (locationInput?.dataset.locationCanonical || locationInput?.value || '').trim();
  if(!session || !session.user){
    showToast('请先登录后再发布');
    openAuth('login');
    return;
  }
  if(!selectedCat){ showToast('请选择一个分类'); return; }
  if(!title){ showToast('请填写标题'); return; }
  if(!content){ showToast('请填写内容'); return; }
  if(title.length > 30){ showToast('标题不能超过30个字'); return; }
  if(content.length > 1000){ showToast('内容不能超过1000个字'); return; }

  const videoInfo = extractVideoInfo(videoUrl);
  const ytId = videoInfo && videoInfo.provider === 'youtube' ? videoInfo.id : null;
  if(videoUrl && !videoInfo){
    showToast('目前仅支持 YouTube 视频链接');
    updateYoutubePreview();
    return;
  }
  const cat = selectedCat; // 在关闭发布页前保留当前分类
  const activityStartDate = document.getElementById('fActivityStartDate').value;
  const activityEndDate = document.getElementById('fActivityEndDate').value;
  const hasActivityDate = !!(activityStartDate || activityEndDate);
  if(cat === '玩乐' && !activityLongTerm && hasActivityDate){
    if(!activityStartDate || !activityEndDate){ showToast('请同时填写活动开始日期和截止日期'); return; }
    if(activityEndDate < activityStartDate){ showToast('截止日期不能早于开始日期'); return; }
  }
  let event = null;
  // 以当前开关的真实 UI 状态为准，避免旧草稿/编辑状态残留出现在未勾选的新笔记中。
  const registrationEnabled = !!document.getElementById('eventSwitch')?.classList.contains('on');
  if(registrationEnabled){
    const cap = parseInt(document.getElementById('fCapacity').value) || 10;
    const dl = document.getElementById('fDeadline').value.trim() || '尽快报名';
    event = {capacity:cap, registered:0, deadline:dl, userJoined:false, registration_enabled:true};
  }
  if(cat === '玩乐' && activityLongTerm){
    event = {...(event || {}), activity_long_term:true};
  } else if(cat === '玩乐' && hasActivityDate){
    event = {...(event || {}), start_date:activityStartDate, end_date:activityEndDate};
  }
  const scheduleSelection = selectedScheduledPublishAt();
  if(scheduleSelection && scheduleSelection.error){ showToast(scheduleSelection.error); return; }
  const scheduledAt = scheduleSelection && scheduleSelection.value ? scheduleSelection.value : null;
  const isScheduledPost = !!scheduledAt;

  const subcategory = isValidPostSubcategory(cat, selectedSubcategory) ? selectedSubcategory : null;
  if(!validateCommunityPostSafety(title, content, cat, subcategory)) return;
  syncCommunityPostMeta();
  const communityMeta = cat === '社区' && COMMUNITY_POST_CONFIG[subcategory] ? {...communityPostMeta} : null;
  // 收纳输入框中未确认的标签，并捕获标签数组（closeCompose 会清空）
  const pendingTag = document.getElementById('fCustomTag');
  if(pendingTag && pendingTag.value.trim()) addCustomTag(pendingTag.value);
  const tagsArr = [...customTags];
  if(imageProcessingCount > 0){
    setPublishProgress(`正在处理图片（${imageProcessingDone}/${imageProcessingTotal}）`, 18);
    await waitForImageProcessing();
  }
  setPublishProgress('正在发布笔记…', 52);
  const ytVertical = videoInfo && videoInfo.provider === 'youtube' && isYoutubeVerticalSource(videoInfo.url);
  const contentToSave = content
    + (ytVertical ? `\n\n${youtubeVerticalMarker()}` : '');
  const excerpt = content.slice(0,40)+(content.length>40?'…':'');
  // 最终发布时按当前已选版式重新生成，避免预览主题没有被带到发布封面。
  const selectedTextCoverTheme = textCardCover?.theme || textCoverDraftTheme || 'garden';
  const automaticTextCover = editingPostId === null && !videoInfo && selectedVideos.length === 0 && uploadedImages.length === 0
    ? createTextCoverDataUrl(title, content, cat, selectedTextCoverTheme)
    : '';
  const rawTextCoverImage = automaticTextCover || (editingPostId === null ? textCardCover?.dataUrl : '') || '';
  let textCoverImage = '';
  let textCoverThumbnail = '';
  if(rawTextCoverImage){
    if(textCoverAssetUploadBusy){ showToast('文字配图正在上传，请稍候'); hidePublishProgress(); return; }
    textCoverAssetUploadBusy = true;
    setPublishProgress('正在保存文字配图…', 68);
    try {
      const textCoverThumbnailData = await createThumbnailDataUrl(rawTextCoverImage);
      [textCoverImage, textCoverThumbnail] = await Promise.all([
        uploadTextCoverAsset(rawTextCoverImage),
        uploadMediaDataUrl(textCoverThumbnailData, 'text-covers')
      ]);
    } catch(error){
      console.warn('文字配图资产上传失败:', error.message);
      showToast(error.message || '文字配图上传失败，请重试');
      hidePublishProgress();
      return;
    } finally {
      textCoverAssetUploadBusy = false;
    }
  }
  let postMedia = { originals:uploadedImages, thumbnails:editingImageThumbnails };
  if(uploadedImages.length){
    try {
      setPublishProgress('正在上传原图与首页缩略图…', 70);
      postMedia = await uploadPostMediaAssets(uploadedImages, editingImageThumbnails);
    } catch(error){
      console.warn('图片上传失败:', error.message);
      showToast(error.message || '图片上传失败，请重试');
      hidePublishProgress();
      return;
    }
  }
  // 用户上传的第一张图是封面，即使同时附有 YouTube 链接也不能被视频默认缩略图覆盖。
  const image = postMedia.originals.length > 0 ? postMedia.originals[0] : (ytId ? null : (textCoverImage || null));
  const images = postMedia.originals.length > 0 ? postMedia.originals : (textCoverImage ? [textCoverImage] : null);
  const imageThumbnail = postMedia.thumbnails.length > 0 ? postMedia.thumbnails[0] : (ytId ? null : (textCoverThumbnail || null));
  const imageThumbnails = postMedia.thumbnails.length > 0 ? postMedia.thumbnails : (textCoverThumbnail ? [textCoverThumbnail] : null);
  // 发布页关闭会清空上传队列。编辑旧笔记时，必须在关闭前固定本次是否有媒体，
  // 否则新封面虽已上传，却会在后续数据库更新阶段被误判为没有图片。
  const hasPostMedia = postMedia.originals.length > 0;
  // 2.93：优先取"我的"页可编辑的昵称
  const authorName = (typeof currentUser !== 'undefined' && currentUser.name && currentUser.name !== '未登录用户')
    ? currentUser.name
    : (session && session.user)
      ? ((session.user.user_metadata && session.user.user_metadata.name) || session.user.email.split('@')[0])
      : '我';

  if(editingPostId !== null){
    /* ---- 编辑模式：更新已有帖子 ---- */
    const p = findPostById(editingPostId);
    if(p){
      p.title = title; p.content = contentToSave; p.excerpt = excerpt;
      p.category = cat; p.subcategory = subcategory; p.community_meta = communityMeta; p.youtube = ytId; p.youtube_vertical = ytVertical; p.event = event; p.tags = tagsArr;
      p.location = location || null;
      p.visibility = isScheduledPost ? 'scheduled' : 'public';
      p.scheduled_at = scheduledAt;
      if(hasPostMedia){ p.image = image; p.images = images; p.image_thumbnail = imageThumbnail; p.image_thumbnails = imageThumbnails; }
      syncPostCopies(p);
    }
    const idToUpdate = editingPostId;
    editingPostId = null;
    await removeComposeDraft();
    closeCompose(false);
    renderChips(); renderFeed(); initProfilePage(); savePosts();
    showToast('✓ 已更新');
    if(location) upsertLocation(location);
    try {
      setPublishProgress('正在同步更新…', 84);
      const fields = { title, content: contentToSave, excerpt, category:cat, subcategory, community_meta:communityMeta, youtube:ytId, youtube_vertical:ytVertical, event, tags: tagsArr, location: location || null, visibility:isScheduledPost ? 'scheduled' : 'public', scheduled_at:scheduledAt };
      if(hasPostMedia){ fields.image = image; fields.images = images; fields.image_thumbnail = imageThumbnail; fields.image_thumbnails = imageThumbnails; }
      const savedPost = await supabaseUpdatePost(idToUpdate, fields);
      if(hasPostMedia && !savedPost?.image){
        throw new Error('封面保存未生效，请重试');
      }
      if(p && savedPost){
        Object.assign(p, savedPost);
        syncPostCopies(p);
        // 个人页首次才读到的旧笔记也要立即补进首页，不能等下次网络刷新。
        if((savedPost.visibility || 'public') === 'public' && !posts.some(item => String(item.id) === String(savedPost.id))){
          posts.unshift(compactFeedPost(savedPost));
        }
        renderFeed();
        if(currentTab === 'profile') initProfilePage();
      }
      console.log('✓ 数据库已同步更新 id=', idToUpdate);
      setPublishProgress(isScheduledPost ? '定时已更新' : '发布完成', 100);
      hidePublishProgress();
    } catch(e){
      console.warn('⚠️ 数据库更新失败:', e.message);
      showToast('⚠️ 云端保存失败，请检查数据库权限');
      hidePublishProgress();
    }
    return;
  }

  /* ---- 新建模式 ---- */
  const localPost = {
    id: nextPostId++, category:cat, title, excerpt,
    user_id: session.user.id,
    content: contentToSave, image, images, image_thumbnail:imageThumbnail, image_thumbnails:imageThumbnails, tags: tagsArr, location: location || null, subcategory, community_meta:communityMeta,
    youtube: ytId, youtube_vertical: ytVertical, author: authorName, time:'刚刚', likes:0, liked:false,
    event, comments:[], visibility: isScheduledPost ? 'scheduled' : 'public', scheduled_at: scheduledAt
  };
  if(!isScheduledPost) posts.unshift(localPost);

  if(!isScheduledPost){
    await removeComposeDraft();
    closeCompose(false);
    currentFilter = '全部';
    renderChips();
    renderFeed();
    savePosts();
    showToast(selectedVideos.length ? '发布成功 🎉（视频未保存，等待YouTube接口上线）' : '发布成功 🎉');
    if(location) upsertLocation(location);
  }

  // 同步保存到 Supabase 数据库
  try {
    setPublishProgress('正在同步到乐生活…', 84);
    const saved = await supabaseInsertPost({
      title, content: contentToSave, excerpt, category:cat,
      author: authorName, image, images, image_thumbnail:imageThumbnail, image_thumbnails:imageThumbnails, youtube: ytId, subcategory, community_meta:communityMeta,
      likes: 0, event, tags: tagsArr, location: location || null,
      user_id: session.user.id, visibility: isScheduledPost ? 'scheduled' : 'public', scheduled_at: scheduledAt, pinned: false
    });
    if(saved && saved.id){
      if(!isScheduledPost){
        localPost.id = saved.id; // 使用数据库生成的 id，保证后续编辑/删除一致
        savePosts();
      } else {
        localPost.id = saved.id;
        ownProfilePosts = [localPost, ...ownProfilePosts.filter(post => String(post.id) !== String(saved.id))];
        ownProfilePostsLoadedFor = session.user.id;
        await removeComposeDraft();
        closeCompose(false);
        if(currentTab === 'profile') initProfilePage();
        showToast(`已定时：${formatLaDateTime(scheduledAt)}`);
      }
      console.log('✓ 已保存到数据库, id=', saved.id);
      setPublishProgress('发布完成', 100);
      hidePublishProgress();
    }
  } catch(e){
    if(isScheduledPost){
      showToast('⚠️ 定时保存失败，内容仍保留在当前页面');
      hidePublishProgress();
      return;
    }
    console.warn('⚠️ 保存到数据库失败（刷新后帖子会消失）:', e.message);
    showToast('⚠️ 云端保存失败，请检查数据库权限');
    hidePublishProgress();
  }
}

/* ---------------- toast ---------------- */
let toastTimer;
function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove('show'), 2000);
}

const FEEDBACK_ATTACHMENT_BUCKET = 'beta-feedback';
const FEEDBACK_ATTACHMENT_MAX_COUNT = 3;
const FEEDBACK_ATTACHMENT_MAX_BYTES = 4 * 1024 * 1024;
let feedbackAttachmentQueue = [];
let myFeedbackAttachmentMap = new Map();
let feedbackAttachmentObjectUrls = [];
const FEEDBACK_REPLY_SEEN_KEY = 'leshenghuo_feedback_reply_seen_v1';

function feedbackReplySeenStorageKey(){
  return session && session.user ? `${FEEDBACK_REPLY_SEEN_KEY}:${session.user.id}` : '';
}
function getSeenFeedbackReplyKeys(){
  const key = feedbackReplySeenStorageKey();
  if(!key) return new Set();
  try { return new Set(JSON.parse(localStorage.getItem(key) || '[]')); }
  catch(error){ return new Set(); }
}
function saveSeenFeedbackReplyKeys(keys){
  const key = feedbackReplySeenStorageKey();
  if(!key) return;
  try { localStorage.setItem(key, JSON.stringify([...keys].slice(-200))); }
  catch(error){}
}
function feedbackReplyKey(row){
  return `${row.id}:${row.replied_at || ''}`;
}
function updateMyFeedbackReplyBadge(count){
  const badge = document.getElementById('myFeedbackReplyBadge');
  const button = document.getElementById('myFeedbackMenuBtn');
  if(!badge) return;
  const visible = Number(count) > 0;
  badge.textContent = visible ? (count > 9 ? '9+' : String(count)) : '';
  badge.classList.toggle('show', visible);
  if(button) button.setAttribute('aria-label', visible ? `我的反馈，有 ${count} 条新的管理员回复` : '我的反馈');
}
async function checkFeedbackReplyNotices(){
  if(!(session && session.user)){ updateMyFeedbackReplyBadge(0); return; }
  try {
    const seen = getSeenFeedbackReplyKeys();
    if(!feedbackApi) throw new Error('反馈接口未初始化');
    const replies = (await feedbackApi.listMine(session.user.id)).filter(row => row.admin_reply && row.replied_at);
    updateMyFeedbackReplyBadge(replies.filter(row => !seen.has(feedbackReplyKey(row))).length);
  } catch(error){
    console.warn('反馈回复提醒读取失败:', error.message);
    updateMyFeedbackReplyBadge(0);
  }
}
function markFeedbackRepliesSeen(rows){
  const seen = getSeenFeedbackReplyKeys();
  (rows || []).filter(row => row.admin_reply && row.replied_at).forEach(row => seen.add(feedbackReplyKey(row)));
  saveSeenFeedbackReplyKeys(seen);
  updateMyFeedbackReplyBadge(0);
}

function clearFeedbackAttachmentObjectUrls(){
  feedbackAttachmentObjectUrls.forEach(url => URL.revokeObjectURL(url));
  feedbackAttachmentObjectUrls = [];
}
function resetFeedbackAttachmentQueue(){
  feedbackAttachmentQueue.forEach(item => URL.revokeObjectURL(item.previewUrl));
  feedbackAttachmentQueue = [];
  const input = document.getElementById('feedbackAttachmentInput');
  if(input) input.value = '';
  renderFeedbackAttachmentQueue();
}
function renderFeedbackAttachmentQueue(){
  const grid = document.getElementById('feedbackAttachmentPreview');
  const count = document.getElementById('feedbackAttachmentCount');
  if(count) count.innerHTML = feedbackAttachmentQueue.length ? `已选 ${feedbackAttachmentQueue.length} / ${FEEDBACK_ATTACHMENT_MAX_COUNT} 张<br>单张不超过 4MB` : '最多 3 张<br>每张不超过 4MB';
  if(!grid) return;
  grid.innerHTML = feedbackAttachmentQueue.map((item, index) => `<div class="feedback-attachment-preview"><img src="${item.previewUrl}" alt="待上传截图 ${index + 1}"><button type="button" aria-label="移除截图" onclick="removeFeedbackAttachment(${index})">×</button></div>`).join('');
}
function removeFeedbackAttachment(index){
  const item = feedbackAttachmentQueue[index];
  if(item) URL.revokeObjectURL(item.previewUrl);
  feedbackAttachmentQueue.splice(index, 1);
  renderFeedbackAttachmentQueue();
}
function compressFeedbackAttachment(file){
  if(!feedbackAttachmentsApi) return Promise.reject(new Error('反馈截图接口未初始化'));
  return feedbackAttachmentsApi.compressImage(file, { maxBytes:FEEDBACK_ATTACHMENT_MAX_BYTES });
}
async function handleFeedbackAttachments(input){
  const remaining = FEEDBACK_ATTACHMENT_MAX_COUNT - feedbackAttachmentQueue.length;
  const selected = Array.from(input.files || []);
  input.value = '';
  if(!remaining){ showToast(`最多上传 ${FEEDBACK_ATTACHMENT_MAX_COUNT} 张截图`); return; }
  if(!selected.length) return;
  if(selected.length > remaining) showToast(`本次只添加前 ${remaining} 张截图`);
  const files = selected.slice(0, remaining);
  if(files.some(file => !String(file.type || '').startsWith('image/'))){ showToast('请选择图片文件'); return; }
  showToast('正在整理截图…');
  const results = await Promise.allSettled(files.map(compressFeedbackAttachment));
  const failures = results.filter(item => item.status === 'rejected');
  results.filter(item => item.status === 'fulfilled').forEach(item => {
    const file = item.value;
    feedbackAttachmentQueue.push({ file, previewUrl:URL.createObjectURL(file) });
  });
  renderFeedbackAttachmentQueue();
  if(failures.length) showToast(failures[0].reason?.message || '部分截图无法使用');
}
function storageObjectPathUrl(path){
  return feedbackAttachmentsApi?.objectPath(path) || String(path || '').split('/').map(encodeURIComponent).join('/');
}
async function uploadFeedbackAttachment(feedback, item, slot){
  if(!feedbackAttachmentsApi || !(session && session.user)) throw new Error('反馈截图接口未初始化');
  return feedbackAttachmentsApi.upload({ userId:session.user.id, feedbackId:feedback.id, file:item.file, slot, bucket:FEEDBACK_ATTACHMENT_BUCKET });
}
function attachmentMapFromRows(rows){
  return feedbackAttachmentsApi?.groupByFeedback(rows) || new Map();
}
async function loadFeedbackAttachmentMap(feedbackRows){
  if(!feedbackAttachmentsApi) throw new Error('反馈截图接口未初始化');
  return feedbackAttachmentsApi.listForFeedbackRows(feedbackRows);
}
function feedbackAttachmentButtonHtml(feedbackId, map){
  const count = (map.get(String(feedbackId)) || []).length;
  return count ? `<button onclick="openFeedbackAttachments(${Number(feedbackId)})">查看截图（${count}）</button>` : '';
}
async function openFeedbackAttachments(feedbackId){
  const rows = adminFeedbackAttachmentMap.get(String(feedbackId)) || myFeedbackAttachmentMap.get(String(feedbackId)) || [];
  if(!rows.length){ showToast('这条反馈没有截图'); return; }
  clearFeedbackAttachmentObjectUrls();
  const viewer = document.getElementById('feedbackAttachmentViewer');
  const body = document.getElementById('feedbackAttachmentViewerBody');
  if(!viewer || !body) return;
  viewer.classList.add('open');
  body.innerHTML = rows.map((row, index) => `<figure class="feedback-viewer-item"><div id="feedbackAttachmentImage${row.id}" style="min-height:160px;display:grid;place-items:center;color:#cfd5cb;font-size:13px;">正在加载截图 ${index + 1}…</div><figcaption>${escHtml(row.file_name || `截图 ${index + 1}`)}</figcaption></figure>`).join('');
  for(const row of rows){
    const target = document.getElementById(`feedbackAttachmentImage${row.id}`);
    try {
      if(!feedbackAttachmentsApi) throw new Error('反馈截图接口未初始化');
      const objectUrl = await feedbackAttachmentsApi.loadObjectUrl({ bucket:FEEDBACK_ATTACHMENT_BUCKET, storagePath:row.storage_path, contentType:row.content_type });
      feedbackAttachmentObjectUrls.push(objectUrl);
      if(target) target.innerHTML = `<img src="${objectUrl}" alt="${escAttr(row.file_name || '反馈截图')}">`;
    } catch(error){
      if(target) target.textContent = '截图暂时无法读取';
    }
  }
}
function closeFeedbackAttachments(){
  document.getElementById('feedbackAttachmentViewer')?.classList.remove('open');
  clearFeedbackAttachmentObjectUrls();
}
function openFeedback(){
  if(!(session && session.user)){ showToast('登录后即可提交公测反馈'); openAuth('login'); return; }
  document.getElementById('feedbackTitle').value = '';
  document.getElementById('feedbackBody').value = '';
  resetFeedbackAttachmentQueue();
  document.getElementById('feedbackMeta').textContent = `将附带：v${APP_VERSION} · ${window.location.pathname} · ${navigator.userAgent.slice(0, 120)}`;
  document.getElementById('feedbackOverlay').classList.add('open');
}
function closeFeedback(){ document.getElementById('feedbackOverlay')?.classList.remove('open'); resetFeedbackAttachmentQueue(); }
function openBetaInfo(){ document.getElementById('betaInfoOverlay')?.classList.add('open'); }
function closeBetaInfo(){ document.getElementById('betaInfoOverlay')?.classList.remove('open'); }
function openPolicy(){ document.getElementById('policyOverlay')?.classList.add('open'); }
function closePolicy(){ document.getElementById('policyOverlay')?.classList.remove('open'); }
async function exportMyData(){
  if(!(session && session.user)){ showToast('登录后即可导出个人数据'); openAuth('login'); return; }
  const uid = encodeURIComponent(session.user.id);
  const resources = {
    profile: `profiles?user_id=eq.${uid}&select=*`,
    posts: `posts?user_id=eq.${uid}&select=*&order=created_at.desc&limit=1000`,
    comments: `comments?user_id=eq.${uid}&select=*&order=created_at.desc&limit=1000`,
    likes: `likes?user_id=eq.${uid}&select=*&order=created_at.desc&limit=1000`,
    favorites: `favorites?user_id=eq.${uid}&select=*&order=created_at.desc&limit=1000`,
    follows: `follows?or=(follower_id.eq.${uid},followee_id.eq.${uid})&select=*&order=created_at.desc&limit=1000`,
    messages: `messages?or=(from_id.eq.${uid},to_id.eq.${uid})&select=*&order=created_at.desc&limit=1000`,
    memberships: `merchant_memberships?user_id=eq.${uid}&select=*&order=created_at.desc&limit=500`,
    member_transactions: `merchant_member_transactions?user_id=eq.${uid}&select=*&order=created_at.desc&limit=1000`,
    coupon_claims: `merchant_coupon_claims?user_id=eq.${uid}&select=*&order=created_at.desc&limit=500`,
    feedback: `user_feedback?user_id=eq.${uid}&select=*&order=created_at.desc&limit=500`,
    feedback_attachments: `user_feedback_attachments?user_id=eq.${uid}&select=*&order=created_at.desc&limit=1500`
  };
  showToast('正在整理你的数据…');
  const entries = await Promise.all(Object.entries(resources).map(async ([key, path]) => {
    try {
      const res = await authedFetch(`${SUPABASE_URL}/rest/v1/${path}`, { method:'GET' });
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      return [key, await res.json()];
    } catch(e){
      console.warn(`个人数据导出跳过 ${key}:`, e.message);
      return [key, { unavailable:true, reason:'暂时无法读取此项数据' }];
    }
  }));
  const data = {
    export_format: 'leshenghuo-personal-data-v1',
    exported_at: new Date().toISOString(),
    app_version: APP_VERSION,
    account: { user_id:session.user.id, email:session.user.email || null },
    data: Object.fromEntries(entries)
  };
  const file = new Blob([JSON.stringify(data, null, 2)], { type:'application/json;charset=utf-8' });
  const href = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = href;
  link.download = `乐生活-我的数据-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(href), 1500);
  showToast('个人数据已开始导出');
}
function feedbackStatusLabel(status){ return status === 'resolved' ? '已解决' : status === 'reviewing' ? '处理中' : '待处理'; }
function feedbackStatusDescription(status){ return status === 'resolved' ? '问题已处理完成，可查看管理员回复或重新提交。' : status === 'reviewing' ? '我们正在核查或处理，会在有结论后回复。' : '已收到，等待管理员查看。'; }
function feedbackTypeLabel(type){ return ({ bug:'问题反馈', suggestion:'功能建议', experience:'体验建议' })[type] || '公测反馈'; }
function feedbackStatusClass(status){ return status === 'resolved' ? 'good' : status === 'reviewing' ? 'warn' : 'muted'; }
async function openMyFeedback(){
  if(!(session && session.user)){ showToast('登录后即可查看反馈状态'); openAuth('login'); return; }
  const overlay = document.getElementById('myFeedbackOverlay');
  const list = document.getElementById('myFeedbackList');
  if(!overlay || !list) return;
  overlay.classList.add('open');
  list.innerHTML = '<div class="admin-empty">正在读取你的反馈...</div>';
  try {
    if(!feedbackApi) throw new Error('反馈接口未初始化');
    const rows = await feedbackApi.listMine(session.user.id);
    try { myFeedbackAttachmentMap = await loadFeedbackAttachmentMap(rows); }
    catch(error){ console.warn('我的反馈截图读取失败:', error.message); myFeedbackAttachmentMap = new Map(); }
    list.innerHTML = rows.length ? rows.map(row => `<article class="my-feedback-card"><div class="my-feedback-title"><span>${escHtml(row.title || '未命名反馈')}</span><span class="admin-badge ${feedbackStatusClass(row.status)}">${feedbackStatusLabel(row.status)}</span></div><div class="my-feedback-meta">${feedbackTypeLabel(row.type)} · v${escHtml(row.app_version || '')} · ${adminTimeText(row.created_at)}</div><div class="my-feedback-meta">${feedbackStatusDescription(row.status)}</div><div class="my-feedback-text">${escHtml(row.body || '')}</div>${row.admin_reply ? `<div class="my-feedback-reply"><b>管理员回复</b>${escHtml(row.admin_reply)}${row.replied_at ? `<div class="my-feedback-meta">${adminTimeText(row.replied_at)}</div>` : ''}</div>` : ''}${row.resolved_at ? `<div class="my-feedback-meta">处理时间：${adminTimeText(row.resolved_at)}</div>` : ''}${feedbackAttachmentButtonHtml(row.id, myFeedbackAttachmentMap)}</article>`).join('') : '<div class="admin-empty">你还没有提交过公测反馈。使用下方按钮告诉我们你的体验。</div>';
    markFeedbackRepliesSeen(rows);
  } catch(e){ console.warn('我的反馈读取失败:', e.message); myFeedbackAttachmentMap = new Map(); list.innerHTML = '<div class="admin-empty">暂时无法读取反馈状态，请稍后重试。</div>'; }
}
function closeMyFeedback(){ document.getElementById('myFeedbackOverlay')?.classList.remove('open'); }
let contentReportPostId = null;
function openContentReport(){
  if(!(session && session.user)){ closeShareSheet(); showToast('登录后即可举报内容'); openAuth('login'); return; }
  const p = getPost();
  if(!p){ showToast('暂时找不到要举报的内容'); return; }
  if(String(p.user_id || '') === String(session.user.id)){ showToast('不能举报自己的内容'); return; }
  contentReportPostId = p.id;
  document.getElementById('contentReportReason').value = 'spam';
  document.getElementById('contentReportDetail').value = '';
  document.getElementById('contentReportTarget').textContent = `正在举报：${p.title || '未命名笔记'} · 作者 ${p.author || '乐生活用户'}`;
  closeShareSheet();
  const overlay = document.getElementById('contentReportOverlay');
  if(overlay && overlay.parentElement !== document.body) document.body.appendChild(overlay);
  overlay?.classList.add('open');
}
function closeContentReport(){ document.getElementById('contentReportOverlay')?.classList.remove('open'); contentReportPostId = null; }
async function submitContentReport(){
  if(!(session && session.user) || contentReportPostId === null) return;
  const p = getPost() || posts.find(row => String(row.id) === String(contentReportPostId));
  if(!p){ showToast('内容已不存在'); closeContentReport(); return; }
  const payload = { reporter_user_id:session.user.id, reported_user_id:p.user_id || null, post_id:p.id, reason:document.getElementById('contentReportReason').value, detail:document.getElementById('contentReportDetail').value.trim() || null, status:'pending' };
  try {
    if(!contentReportApi) throw new Error('举报接口未初始化');
    await contentReportApi.submit(payload);
    closeContentReport(); showToast('举报已提交，我们会尽快核查');
  } catch(e){ console.warn('内容举报提交失败:', e.message); showToast('提交失败，请稍后重试'); }
}
async function submitFeedback(){
  if(!(session && session.user)) return;
  const title = document.getElementById('feedbackTitle').value.trim();
  const body = document.getElementById('feedbackBody').value.trim();
  const type = document.getElementById('feedbackType').value;
  if(!title || !body){ showToast('请填写问题说明和具体情况'); return; }
  try {
    if(!feedbackApi) throw new Error('反馈接口未初始化');
    const feedback = await feedbackApi.createFeedback({ user_id:session.user.id, user_name:myNick(), type, title, body, app_version:APP_VERSION, page_path:window.location.pathname + window.location.search, device_info:navigator.userAgent });
    if(!feedback) throw new Error('反馈创建后未返回记录');
    const attachments = [...feedbackAttachmentQueue];
    let failedCount = 0;
    for(let index = 0; index < attachments.length; index += 1){
      try { await uploadFeedbackAttachment(feedback, attachments[index], index + 1); }
      catch(error){ failedCount += 1; console.warn('反馈截图上传失败:', error.message); }
    }
    closeFeedback();
    showToast(failedCount ? `反馈已提交，${failedCount} 张截图未上传成功` : '反馈已提交，谢谢你帮助乐生活变得更好');
  } catch(e){ console.warn('反馈提交失败:', e.message); showToast('提交失败，请稍后重试'); }
}

/* close overlays on background click */
document.getElementById('postOverlay').addEventListener('click', e=>{
  if(e.target.id==='postOverlay') returnFromPost();
});
document.getElementById('composeOverlay').addEventListener('click', e=>{
  if(e.target.id==='composeOverlay') closeCompose();
});
document.getElementById('composeOverlay').addEventListener('input', e=>{
  if(e.target && e.target.matches('input,textarea')) scheduleComposeDraftSave();
});
document.getElementById('composeOverlay').addEventListener('change', e=>{
  if(e.target && e.target.matches('input,textarea')) scheduleComposeDraftSave();
});
window.addEventListener('pagehide', () => {
  if(document.getElementById('composeOverlay')?.classList.contains('open')) saveComposeDraft();
});
if(document.getElementById('browsingModal')){
  document.getElementById('browsingModal').addEventListener('click', e=>{
    if(e.target.id==='browsingModal') closeBrowsingHistory();
  });
}

/* ---- localStorage persistence ---- */
/* ---- Xiaohongshu Import ---- */
let xhsAccountVerified = false;
let xhsUsername = '';
const MOCK_XHS_POSTS = [
  { id:1, title:'小红书: 巷口张阿姨的葱油饼评测', content:'每天下午四点准时出摊，面团现擀现烙，葱花是自己种的……', image:'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=60', category:'美食' },
  { id:2, title:'小红书: 社区咖啡馆手冲体验', content:'巷尾新开的豆子铺，这周六有免费试饮会，位置有限……', image:'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=60', category:'美食' },
  { id:3, title:'小红书: 老城区骑行路线实测', content:'花了一个下午把老城区的巷子骑了个遍，推荐8公里路线……', image:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=60', category:'玩乐' },
];

function openXhsImport(){
  const modal = document.getElementById('xhsModal');
  const content = document.getElementById('xhsContent');
  if(!modal || !content){ console.warn('小红书导入组件不存在'); return; }
  modal.style.display = 'flex';
  
  if(!xhsAccountVerified){
    content.innerHTML = `
      <div style="text-align:center;padding:40px 20px;">
        <div style="width:48px;height:48px;margin:0 auto 20px;color:var(--sage-dark);">${uiIcon('phone',48)}</div>
        <h3 style="font-size:16px;font-weight:700;margin-bottom:12px;">连接您的小红书账户</h3>
        <p style="font-size:13px;color:var(--ink-faint);margin-bottom:24px;">验证账户后，可以一键导入您在小红书上发布的所有笔记</p>
        <div style="background:var(--bg-alt);border-radius:10px;padding:16px;margin-bottom:20px;text-align:left;font-size:12px;">
          <div style="margin-bottom:8px;"><strong>✓ 连接安全</strong> - 我们只读取您的公开笔记</div>
          <div style="margin-bottom:8px;"><strong>✓ 隐私保护</strong> - 不存储您的账户密码</div>
          <div><strong>✓ 快速导入</strong> - 一键导入所有笔记</div>
        </div>
        <button onclick="verifyXhsAccount()" style="width:100%;background:var(--sage);color:#fff;border:none;padding:12px;border-radius:8px;font-weight:600;font-size:14px;cursor:pointer;">授权连接小红书</button>
        <button onclick="closeXhsImport()" style="width:100%;background:none;border:1px solid var(--line);padding:12px;border-radius:8px;margin-top:12px;font-weight:600;font-size:14px;cursor:pointer;">取消</button>
      </div>
    `;
  } else {
    showXhsPostsList();
  }
  
  modal.style.display = 'flex';
}

function verifyXhsAccount(){
  xhsUsername = '小红书用户' + Math.random().toString().slice(2,6);
  xhsAccountVerified = true;
  showToast('✓ 小红书账户已连接');
  showXhsPostsList();
}

function showXhsPostsList(){
  const content = document.getElementById('xhsContent');
  content.innerHTML = `
    <div style="margin-bottom:16px;">
      <div style="font-size:12px;color:var(--ink-faint);margin-bottom:8px;">已连接账户: <strong>${xhsUsername}</strong></div>
      <div style="font-size:13px;color:var(--ink);margin-bottom:16px;">发现 ${MOCK_XHS_POSTS.length} 篇可导入的笔记</div>
    </div>
    ${MOCK_XHS_POSTS.map((post, idx) => `
      <div style="background:var(--bg-alt);border-radius:10px;padding:12px;margin-bottom:12px;">
        <div style="display:flex;gap:10px;">
          <img src="${post.image}" alt="" style="width:60px;height:75px;border-radius:6px;object-fit:cover;flex-shrink:0;">
          <div style="flex:1;">
            <div style="font-size:12px;font-weight:700;line-height:1.4;margin-bottom:6px;">${post.title}</div>
            <div style="font-size:11px;color:var(--ink-faint);line-height:1.4;margin-bottom:8px;">${post.content.substring(0,60)}...</div>
            <button onclick="importXhsPost(${idx})" style="background:var(--sage);color:#fff;border:none;padding:6px 12px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;">导入</button>
          </div>
        </div>
      </div>
    `).join('')}
    <button onclick="closeXhsImport()" style="width:100%;background:none;border:1px solid var(--line);padding:12px;border-radius:8px;margin-top:20px;font-weight:600;font-size:14px;cursor:pointer;">关闭</button>
  `;
}

function importXhsPost(idx){
  const post = MOCK_XHS_POSTS[idx];
  closeCompose();
  closeXhsImport();
  
  // Fill in the compose form
  selectedCat = post.category;
  selectedSubcategory = null;
  document.getElementById('fTitle').value = post.title.replace('小红书: ', '');
  document.getElementById('fContent').value = post.content;
  document.getElementById('fYoutube').value = '';
  
  // Simulate image upload
  uploadedImages = [post.image];
  coverImageIndex = 0;
  document.getElementById('imagesGrid').innerHTML = `
    <div style="position:relative;border-radius:8px;overflow:hidden;cursor:pointer;" onclick="removeImage(null, 0)">
      <img src="${post.image}" style="width:100%;aspect-ratio:3/4;object-fit:cover;">
      <div style="position:absolute;top:8px;right:8px;background:var(--berry);color:#fff;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600;">封面</div>
      <div style="position:absolute;inset:0;background:rgba(0,0,0,0);transition:background 0.2s;" onmouseover="this.style.background='rgba(0,0,0,0.3)'" onmouseout="this.style.background='rgba(0,0,0,0)'"></div>
    </div>
  `;
  document.getElementById('imagesGrid').style.display = 'grid';
  document.getElementById('uploadBox').style.display = 'none';
  
  // Update cat picker
  document.querySelectorAll('.cat-pick').forEach(b => {
    b.classList.remove('sel');
    if(b.dataset.c === post.category) b.classList.add('sel');
  });
  renderPostSubcategoryPicker();
  
  // Update char counts
  document.getElementById('titleCount').textContent = document.getElementById('fTitle').value.length;
  document.getElementById('contentCount').textContent = document.getElementById('fContent').value.length;
  
  showToast('✓ 笔记已导入到编辑框，请检查后发布');
  document.getElementById('composeOverlay').classList.add('open');
}

/* 真实可用：粘贴文案自动整理 */
function openXhsPaste(){
  const modal = document.getElementById('xhsModal');
  const content = document.getElementById('xhsContent');
  if(!modal || !content) return;
  modal.style.display = 'flex';
  content.innerHTML = `
    <h3 style="font-size:16px;font-weight:700;margin-bottom:6px;">粘贴文案，自动整理</h3>
    <p style="font-size:12.5px;color:var(--ink-faint);margin-bottom:14px;line-height:1.6;">
      在小红书 App 中打开你的笔记 → 点分享 → <b>复制文案</b>，粘贴到下方。<br>
      系统会自动拆分：<b>第一行 → 标题</b>，其余 → 正文，<b>#话题 → 自定义标签</b>。图片请回到发布页手动上传。
    </p>
    <textarea id="xhsPasteBox" placeholder="长按粘贴小红书复制的文案……" style="width:100%;min-height:180px;padding:12px;border:1px solid var(--line);border-radius:10px;font-size:14px;font-family:inherit;line-height:1.7;resize:vertical;"></textarea>
    <button onclick="applyXhsPaste()" style="width:100%;margin-top:14px;background:#FF2442;color:#fff;border:none;padding:12px;border-radius:10px;font-weight:600;font-size:14px;cursor:pointer;">自动整理并填入</button>
  `;
  setTimeout(()=>{ const t = document.getElementById('xhsPasteBox'); if(t) t.focus(); }, 100);
}
function applyXhsPaste(){
  const box = document.getElementById('xhsPasteBox');
  if(!box) return;
  let text = box.value.trim();
  if(!text){ showToast('请先粘贴文案'); return; }

  // 1) 提取 #话题# 或 #话题 → 自定义标签（去重、最多10个、每个≤10字）
  const tagMatches = [...text.matchAll(/#([^#\s，,]{1,10})#?/g)].map(m => m[1].trim()).filter(Boolean);
  // 2) 从正文中移除话题串与末尾的"链接/@"杂质
  text = text.replace(/#([^#\s，,]{1,10})#?/g, '').replace(/\n{3,}/g, '\n\n').trim();

  // 3) 第一行 → 标题（≤20字截断），其余 → 正文
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);
  if(lines.length === 0){ showToast('未识别到有效内容'); return; }
  const title = lines[0].slice(0, 20);
  const body = lines.slice(1).join('\n').slice(0, 1000);

  document.getElementById('fTitle').value = title;
  document.getElementById('fContent').value = body || title;
  document.getElementById('titleCount').textContent = title.length;
  document.getElementById('contentCount').textContent = (body || title).length;

  // 4) 填入标签
  tagMatches.forEach(t => { if(customTags.length < 10 && !customTags.includes(t)) customTags.push(t); });
  renderCustomTags();

  closeXhsImport();
  showToast(`✓ 已整理：标题+正文${tagMatches.length ? '+'+Math.min(tagMatches.length,10)+'个标签' : ''}，请上传图片并选分类`);
}

function closeXhsImport(){
  const m = document.getElementById('xhsModal');
  if(m) m.style.display = 'none';
}
// 打开时用 flex 居中
function showXhsModal(){
  const m = document.getElementById('xhsModal');
  if(m) m.style.display = 'flex';
}

function cacheSafeImage(value){
  return typeof value === 'string' && value.startsWith('data:image/') ? null : value;
}
function lightweightPostCache(post){
  const cached = Object.assign({}, post, {
    image: cacheSafeImage(post.image),
    images: Array.isArray(post.images) ? post.images.map(cacheSafeImage).filter(Boolean) : post.images
  });
  return cached;
}
function savePosts(){
  const sharedCache = window.LeshenghuoFeedCache;
  if(sharedCache){
    const result = sharedCache.save('wanba_posts', posts);
    window._postCacheCompacted = !!result.compacted;
    if(result.saved){
      if(result.compacted) console.info('✓ 本地笔记缓存已自动精简，完整内容会继续从云端读取');
      return;
    }
    console.warn('本地笔记缓存保存失败:', result.error);
    return;
  }
  try {
    localStorage.setItem('wanba_posts', JSON.stringify(posts));
    window._postCacheCompacted = false;
  } catch(e) {
    if(e && e.name === 'QuotaExceededError'){
      try {
        // 图片已写入云端；本地只保留轻量索引，避免 Base64 图片撑满浏览器缓存。
        localStorage.setItem('wanba_posts', JSON.stringify(posts.map(lightweightPostCache)));
        window._postCacheCompacted = true;
        console.info('✓ 本地笔记缓存已自动精简，完整内容会继续从云端读取');
        return;
      } catch(compactError){
        console.warn('轻量缓存保存失败:', compactError);
      }
    }
    console.warn('本地笔记缓存保存失败:', e);
  }
}
function loadPosts(){
  const sharedCache = window.LeshenghuoFeedCache;
  if(sharedCache){
    const cached = sharedCache.load('wanba_posts');
    if(cached){
      posts = cached;
      return true;
    }
    return false;
  }
  try {
    const saved = localStorage.getItem('wanba_posts');
    if(saved){
      posts = JSON.parse(saved);
      return true;
    }
  } catch(e) {
    console.warn('读取失败:', e);
  }
  return false;
}


// ====== Supabase 配置 ======
identityLoader = window.LeshenghuoIdentityLoader?.create({
  supabaseUrl: SUPABASE_URL,
  authedFetch: (...args) => authedFetch(...args),
  setProfile: setProfileCache,
  setMerchantIdentity: setMerchantIdentityCache,
  hasAvatar: userId => userId in window._avatarCache,
  hasMerchantLogo: userId => userId in window._merchantLogoCache,
  markAvatarMissing: userId => { window._avatarCache[userId] = null; },
  markMerchantLogoMissing: userId => setMerchantLogoCache(userId, null),
  warn: (...args) => console.warn(...args)
});
const R2_MEDIA_API_URL = 'https://upload.escoopcity.com';
const R2_MEDIA_PUBLIC_ORIGIN = 'https://media.escoopcity.com';
const MEDIA_CACHE_NAME = 'leshenghuo-media-v2';
const MEDIA_CACHE_META_KEY = 'leshenghuo-media-cache-meta-v2';
// Upper bound only. The operating system/browser may grant less space per device.
const MEDIA_CACHE_MAX_BYTES = 3 * 1024 * 1024 * 1024;
const MEDIA_CACHE_MAX_ENTRIES = 1200;
const POSTS_REFRESH_COOLDOWN_MS = 30000;
const POSTS_NETWORK_BACKOFF_MS = 6000;
const POSTS_FEED_LIMIT = 24;
const POSTS_FEED_FALLBACK_LIMIT = 12;
let postsRetryTimer = null;
let postsRetryDelayMs = POSTS_NETWORK_BACKOFF_MS;
let postsRetryAt = 0;
const postsRetryController = window.LeshenghuoRetryController?.create({
  initialDelay: POSTS_NETWORK_BACKOFF_MS,
  onRetry: () => loadPostsFromSupabase({force:true})
});
const hydratedPostIds = new Set();

function isDataImageUrl(value){ return typeof value === 'string' && value.startsWith('data:image/'); }
const mediaCacheController = window.LeshenghuoMediaCache?.create({
  publicOrigin: R2_MEDIA_PUBLIC_ORIGIN,
  cacheName: MEDIA_CACHE_NAME,
  metaKey: MEDIA_CACHE_META_KEY,
  maxBytes: MEDIA_CACHE_MAX_BYTES,
  maxEntries: MEDIA_CACHE_MAX_ENTRIES
});
function isR2MediaUrl(value){ return mediaCacheController ? mediaCacheController.isMediaUrl(value) : typeof value === 'string' && value.startsWith(R2_MEDIA_PUBLIC_ORIGIN + '/'); }
const mediaUploadController = window.LeshenghuoMediaUpload?.create({
  apiUrl: R2_MEDIA_API_URL,
  supabaseUrl: SUPABASE_URL,
  supabaseKey: SUPABASE_KEY,
  publicOrigin: R2_MEDIA_PUBLIC_ORIGIN,
  getAccessToken: () => session?.access_token || null,
  refreshAccessToken: () => typeof refreshSession === 'function' ? refreshSession() : false
});
async function dataUrlToBlob(dataUrl){ return mediaUploadController?.dataUrlToBlob(dataUrl); }
async function createThumbnailDataUrl(dataUrl){ return mediaUploadController?.createThumbnailDataUrl(dataUrl); }
async function uploadMediaBlob(blob, kind){ return mediaUploadController?.uploadBlob(blob, kind); }
async function uploadMediaDataUrl(value, kind){ return mediaUploadController?.uploadDataUrl(value, kind); }
async function uploadPostMediaAssets(values, existingThumbnails=[]){ return mediaUploadController?.uploadPostAssets(values, existingThumbnails); }
async function releaseMediaUrl(value){
  try {
    const removed = await mediaUploadController?.releaseUrl(value);
    if(removed) console.info('已回收未引用的媒体文件');
    return !!removed;
  } catch(error){
    console.warn('媒体回收跳过:', error?.message || error);
    return false;
  }
}
async function warmMediaCache(url){
  if(mediaCacheController) return mediaCacheController.warm(url);
}
function warmPostMediaCache(list, detail=false){
  if(mediaCacheController) return mediaCacheController.warmPosts(list, detail);
  const urls = [];
  (list || []).forEach(post => {
    if(detail && Array.isArray(post.images)) urls.push(...post.images);
    else urls.push(post.image_thumbnail || post.image);
  });
  [...new Set(urls.filter(Boolean))].slice(0, detail ? 20 : 12).forEach(warmMediaCache);
}

async function fetchPostFeed(url, options, timeoutMs = 6500){
  if(window.LeshenghuoModuleRuntime?.fetchWithTimeout){
    return window.LeshenghuoModuleRuntime.fetchWithTimeout(url, options, timeoutMs);
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, Object.assign({}, options, { signal:controller.signal }));
  } finally {
    clearTimeout(timer);
  }
}
function schedulePostsRetry(){
  if(postsRetryController){
    const scheduled = postsRetryController.schedule();
    postsRetryTimer = postsRetryController.scheduled ? true : null;
    postsRetryAt = postsRetryController.nextAt;
    postsRetryDelayMs = postsRetryController.delay;
    return scheduled;
  }
  if(postsRetryTimer || !navigator.onLine) return;
  const delay = postsRetryDelayMs;
  postsRetryAt = Date.now() + delay;
  postsRetryDelayMs = Math.min(postsRetryDelayMs * 2, 60000);
  postsRetryTimer = setTimeout(() => {
    postsRetryTimer = null;
    postsRetryAt = 0;
    loadPostsFromSupabase({force:true});
  }, delay);
}
function clearPostsRetry(){
  if(postsRetryController){
    postsRetryController.clear();
    postsRetryTimer = null;
    postsRetryAt = 0;
    postsRetryDelayMs = POSTS_NETWORK_BACKOFF_MS;
    return;
  }
  if(postsRetryTimer) clearTimeout(postsRetryTimer);
  postsRetryTimer = null;
  postsRetryAt = 0;
  postsRetryDelayMs = POSTS_NETWORK_BACKOFF_MS;
}
function compactFeedPost(raw){
  if(window.LeshenghuoFeedData?.compactPost){
    return window.LeshenghuoFeedData.compactPost(raw, { isValidSubcategory: isValidPostSubcategory, normalizeSubcategory: normalizePostSubcategory });
  }
  return {
    id: raw.id,
    title: raw.title || '无标题',
    content: raw.content || '',
    excerpt: raw.excerpt || '',
    category: raw.category || '',
    subcategory: normalizePostSubcategory(raw.category, raw.subcategory),
    author: raw.author || '游客',
    image: raw.image || null,
    image_thumbnail: raw.image_thumbnail || null,
    image_thumbnails: raw.image_thumbnails || null,
    images: null,
    youtube: raw.youtube || '',
    youtube_vertical: false,
    likes: raw.likes || 0,
    liked: false,
    collected: false,
    event: raw.event,
    tags: raw.tags || [],
    user_id: raw.user_id || null,
    visibility: raw.visibility || 'public',
    pinned: !!raw.pinned,
    time: raw.created_at ? new Date(raw.created_at).toLocaleString('zh-CN') : new Date().toLocaleString('zh-CN'),
    created_at: raw.created_at || null,
    scheduled_at: raw.scheduled_at || null,
    location: raw.location || null,
    comments: []
  };
}

// 从Supabase加载帖子（直接REST API调用）
async function loadPostsFromSupabase(options = {}){
  const force = options === true || options.force === true;
  if(window._postsLoadPromise){
    console.log('⏳ 帖子正在加载，复用当前请求...');
    return window._postsLoadPromise;
  }
  if(!force && window._postsLastFetchedAt && Date.now() - window._postsLastFetchedAt < POSTS_REFRESH_COOLDOWN_MS){
    console.log('✓ 帖子刚刚更新，暂不重复读取');
    return posts;
  }
  if(!force && window._postsNextRetryAt && Date.now() < window._postsNextRetryAt){
    console.log('✓ 网络恢复等待中，继续显示已加载内容');
    return posts;
  }
  const shouldShowLoading = posts.length === 0;
  if(shouldShowLoading){
    feedIsLoading = true;
    feedLoadFailed = false;
    renderFeed();
  }
  window._postsLoadPromise = (async () => {
  try {
    console.log('📥 从 Supabase 加载帖子...');
    
    // 首页只取封面与摘要。多图原图在用户打开详情时才读取，避免 Base64 图片让首屏请求过大。
    // Homepage data shape and public filtering are shared with future feed modules.
    const feedUrls = window.LeshenghuoFeedData?.buildPublicFeedUrls({
      baseUrl: SUPABASE_URL,
      limit: POSTS_FEED_LIMIT,
      fallbackLimit: POSTS_FEED_FALLBACK_LIMIT
    });
    const url = feedUrls?.url || `${SUPABASE_URL}/rest/v1/posts?select=*&order=created_at.desc,id.desc&limit=${POSTS_FEED_LIMIT}`;
    const fallbackUrl = feedUrls?.fallbackUrl || `${SUPABASE_URL}/rest/v1/posts?select=*&order=created_at.desc,id.desc&limit=${POSTS_FEED_FALLBACK_LIMIT}`;
    
    console.log('🔗 API请求:', url.slice(0, 60) + '...');
    
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    };
    let response;
    try {
      response = await fetchPostFeed(url, requestOptions);
    } catch(fetchError){
      console.warn('⚠️ 帖子加载连接中断，正在重试一次:', fetchError.message);
      await new Promise(resolve => setTimeout(resolve, 800));
      try {
        response = await fetchPostFeed(url, requestOptions, 5000);
      } catch(retryError) {
        window._postsNextRetryAt = Date.now() + postsRetryDelayMs;
        console.warn('⚠️ 帖子服务暂时不可达，稍后自动恢复:', retryError.message);
        feedIsLoading = false;
        feedLoadFailed = posts.length === 0;
        renderFeed();
        schedulePostsRetry();
        return;
      }
    }
    
    console.log('📡 HTTP状态:', response.status, response.statusText);
    
    if(!response.ok && response.status >= 500){
      const errorText = await response.text();
      console.warn(`⚠️ Supabase主查询错误 ${response.status}:`, errorText.slice(0, 160));
      console.log('🔁 使用轻量备用查询重试...');
      response = await fetchPostFeed(fallbackUrl, requestOptions, 5000);
    }

    if(!response.ok){
      const errorText = await response.text();
      console.warn(`⚠️ Supabase错误 ${response.status}:`, errorText.slice(0, 100));
      console.log('💾 使用本地缓存数据');
      feedIsLoading = false;
      feedLoadFailed = posts.length === 0;
      renderFeed();
      schedulePostsRetry();
      return;
    }
    
    const data = await response.json();
    console.log('📦 收到数据:', data.length, '条记录');
    
    if(Array.isArray(data) && data.length > 0){
      console.log('✓ 已从数据库加载', data.length, '条帖子');
      posts = data.map(compactFeedPost);
      // Keep a lightweight local snapshot so the next App launch can paint the
      // feed before the remote version and database checks complete.
      savePosts();
      hydratedPostIds.clear();
      window._postsLastFetchedAt = Date.now();
      window._postsNextRetryAt = 0;
      clearPostsRetry();
      feedIsLoading = false;
      feedLoadFailed = false;
      renderChips();
      renderQuicklinks();
      renderFeed();
      console.log('✓ 页面已刷新');
      loadEngagement(); // 同步点赞/收藏
      // 2.94修复：批量拉取帖子作者头像，拿到后刷新一次feed显示真实头像
      ensureAvatarsFor(posts.map(p => p.user_id)).then(changed => {
        if(changed){
          renderFeed();
          const weekPage = document.getElementById('page-week');
          if(weekPage && weekPage.classList.contains('active')) renderWeekFeed();
        }
      });
      // 若商家发布弹层正打开着，数据到齐后刷新一次里面的统计
      const mpOverlay = document.getElementById('merchantPublishOverlay');
      if(mpOverlay && mpOverlay.classList.contains('open')) renderMerchantDashboard();
    } else {
      console.log('📭 暂无数据或数据格式不正确');
      feedIsLoading = false;
      feedLoadFailed = false;
      renderFeed();
    }
  } catch(error){
    console.warn('⚠️ 加载失败:', error.message);
    console.error('错误详情:', error);
    console.log('💾 使用本地缓存数据');
      feedIsLoading = false;
      feedLoadFailed = posts.length === 0;
      renderFeed();
      schedulePostsRetry();
  }
  })();
  try {
    return await window._postsLoadPromise;
  } finally {
    window._postsLoadPromise = null;
  }
}

function ensureAdminPageAtRoot(){
  const admin = document.getElementById('page-admin');
  if(!admin) return;
  const nestedProfile = admin.parentElement && admin.parentElement.closest && admin.parentElement.closest('#page-profile');
  if(!nestedProfile) return;
  const bottomNav = document.querySelector('.bottom-nav');
  if(bottomNav && bottomNav.parentNode){
    bottomNav.parentNode.insertBefore(admin, bottomNav);
  } else {
    document.body.appendChild(admin);
  }
}

function menuGlyph(kind){
  const glyphs={
    user:'<circle cx="12" cy="8" r="3.5"></circle><path d="M4 21a8 8 0 0 1 16 0"></path>',
    pen:'<path d="m4 20 4.2-1 9.7-9.7a2.2 2.2 0 0 0-3.1-3.1L5.1 15.9z"></path><path d="m13.5 7.5 3 3"></path>',
    clock:'<circle cx="12" cy="12" r="8"></circle><path d="M12 7v5l3.2 2"></path>',
    bag:'<path d="M5 8h14v12H5z"></path><path d="M8 8V6a4 4 0 0 1 8 0v2"></path>',
    cart:'<path d="M3 4h2l2.2 11h10.6l2-8H6"></path><circle cx="10" cy="20" r="1"></circle><circle cx="17" cy="20" r="1"></circle>',
    wallet:'<path d="M4 7h15v13H4z"></path><path d="M4 7V5h12"></path><path d="M15 13h4"></path>',
    shield:'<path d="M12 3 20 6v5c0 5-3.4 8-8 10-4.6-2-8-5-8-10V6z"></path>',
    scan:'<path d="M4 9V5h4M16 5h4v4M20 15v4h-4M8 19H4v-4"></path>',
    help:'<circle cx="12" cy="12" r="8"></circle><path d="M9.5 9a2.6 2.6 0 1 1 4.2 2.1c-1.1.8-1.7 1.3-1.7 2.9"></path><path d="M12 17h.01"></path>',
    settings:'<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.1 2.1-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2h-3v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1L6.6 17l.1-.1A1.7 1.7 0 0 0 7 15a1.7 1.7 0 0 0-1.5-1H5.3v-3h.2A1.7 1.7 0 0 0 7 10a1.7 1.7 0 0 0-.3-1.9l-.1-.1 2.1-2.1.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5v-.2h3v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 2.1 2.1-.1.1A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.5 1h.2v3h-.2a1.7 1.7 0 0 0-1.5 1z"></path>'
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${glyphs[kind]||glyphs.settings}</svg>`;
}
function ensureHomeFeatureOverlay(){
  let overlay = document.getElementById('homeFeatureOverlay');
  if(overlay) return overlay;
  overlay = document.createElement('div');
  overlay.id = 'homeFeatureOverlay';
  overlay.className = 'home-feature-overlay';
  overlay.innerHTML = '<section class="home-feature-panel" role="dialog" aria-modal="true"><header class="home-feature-header"><button type="button" aria-label="返回" onclick="closeHomeFeature()">‹</button><h2 id="homeFeatureTitle"></h2><span></span></header><main id="homeFeatureBody" class="home-feature-body"></main></section>';
  // Keep taps inside this full-screen layer from leaking through to the root App navigation.
  overlay.addEventListener('click', event => event.stopPropagation());
  overlay.addEventListener('touchend', event => event.stopPropagation(), { passive:true });
  document.body.appendChild(overlay);
  return overlay;
}
let homeFeatureBackAction = null;
function returnToHomeSettings(){
  const menu = ensureHomeMenu();
  menu.classList.add('open','settings-open');
  document.body.classList.add('home-menu-open');
}
function openHomeFeatureFromSettings(openFeature){
  homeFeatureBackAction = returnToHomeSettings;
  openFeature();
}
function returnToHomeFeature(openFeature){
  return () => {
    homeFeatureBackAction = returnToHomeSettings;
    openFeature();
  };
}
function openHomeFeature(title, html){
  const overlay = ensureHomeFeatureOverlay();
  document.getElementById('homeFeatureTitle').textContent = title;
  document.getElementById('homeFeatureBody').innerHTML = html;
  overlay.classList.add('open');
}
function closeHomeFeature(){
  if(window._homeScanTimer) clearInterval(window._homeScanTimer);
  window._homeScanTimer = null;
  if(window._homeScanStream){ window._homeScanStream.getTracks().forEach(track => track.stop()); window._homeScanStream = null; }
  document.getElementById('homeFeatureOverlay')?.classList.remove('open');
  const backAction = homeFeatureBackAction;
  homeFeatureBackAction = null;
  if(typeof backAction === 'function') setTimeout(backAction, 0);
}
function homeFeatureRequireAuth(){
  if(session && session.user) return true;
  closeHomeFeature();
  showToast('请先登录');
  openAuth();
  return false;
}
function homeFriendScore(profile, keyword){
  const name = String(profile.name || '').trim().toLowerCase();
  const query = String(keyword || '').trim().toLowerCase();
  const publicId = String(uidToNumericId(String(profile.user_id || '')) || '');
  if(publicId === query) return 10000;
  if(name === query) return 9000;
  if(name.startsWith(query)) return 7000 - name.length;
  if(name.includes(query)) return 5000 - name.indexOf(query);
  const overlap = [...new Set(query)].filter(char => name.includes(char)).length;
  return overlap * 100;
}
function openHomeFriendSearch(){
  if(!homeFeatureRequireAuth()) return;
  openHomeFeature('添加好友', `<div class="home-feature-intro">可搜索昵称或乐生活 ID。昵称结果会优先显示最相近的用户。</div><div class="home-friend-search"><input id="homeFriendKeyword" maxlength="48" placeholder="昵称或乐生活 ID" onkeydown="if(event.key==='Enter')searchHomeFriends()"><button type="button" onclick="searchHomeFriends()">搜索</button></div><div id="homeFriendResults" class="home-feature-list"><div class="home-feature-empty">输入昵称或 ID 开始寻找好友。</div></div>`);
  setTimeout(() => document.getElementById('homeFriendKeyword')?.focus(), 50);
}
async function searchHomeFriends(){
  if(!homeFeatureRequireAuth()) return;
  const input = document.getElementById('homeFriendKeyword');
  const target = document.getElementById('homeFriendResults');
  const keyword = String(input?.value || '').trim();
  if(!keyword){ target.innerHTML = '<div class="home-feature-empty">请输入昵称或乐生活 ID。</div>'; return; }
  target.innerHTML = '<div class="home-feature-empty">正在搜索用户...</div>';
  try {
    const safeKeyword = keyword.replace(/[,%()']/g, '').slice(0, 48);
    const fields = 'user_id,name,avatar,bio,market_code,updated_at';
    const isId = /^\d{5,}$/.test(safeKeyword);
    const url = isId
      ? `${SUPABASE_URL}/rest/v1/profiles?select=${fields}&limit=500`
      : `${SUPABASE_URL}/rest/v1/profiles?select=${fields}&name=ilike.*${encodeURIComponent(safeKeyword)}*&limit=80`;
    const response = await authedFetch(url, { method:'GET' });
    if(!response.ok) throw new Error(await response.text());
    const rows = (await response.json()).filter(row => String(row.user_id) !== String(session.user.id));
    const matches = rows.filter(row => !isId || String(uidToNumericId(String(row.user_id))) === safeKeyword || String(row.name || '').toLowerCase().includes(safeKeyword.toLowerCase()))
      .sort((a,b) => homeFriendScore(b, safeKeyword) - homeFriendScore(a, safeKeyword));
    target.innerHTML = matches.length ? matches.map(row => {
      const id = String(row.user_id || '');
      const name = row.name || '乐生活用户';
      const avatar = row.avatar || resolveAvatarUrl(id);
      return `<article class="home-friend-row"><button class="home-friend-main" type="button" onclick="closeHomeFeature();openUserPublicPage('${id.replace(/'/g,'')}','${String(name).replace(/'/g,'')}')"><span class="home-friend-avatar">${avatar ? `<img src="${escAttr(avatar)}" alt="">` : escHtml(initials(name))}</span><span><b>${escHtml(name)}</b><small>ID: ${escHtml(uidToNumericId(id))}${row.bio ? ` · ${escHtml(row.bio).slice(0,24)}` : ''}</small></span></button><button class="home-friend-follow ${isFollowing(id)?'following':''}" type="button" onclick="homeFriendToggle('${id.replace(/'/g,'')}','${String(name).replace(/'/g,'')}')">${isFollowing(id) ? '已添加' : '添加'}</button></article>`;
    }).join('') : '<div class="home-feature-empty">没有找到相符的用户。</div>';
  } catch(error){
    console.warn('好友搜索失败:', error.message);
    target.innerHTML = '<div class="home-feature-empty">搜索暂时不可用，请稍后重试。</div>';
  }
}
async function homeFriendToggle(userId, name){
  await toggleFollowUser(userId, name);
  searchHomeFriends();
}
function openHomeCreatorCenter(){
  if(!homeFeatureRequireAuth()) return;
  if(currentMerchant && currentMerchant.verified){
    closeHomeFeature();
    openMerchantAiFlow();
    return;
  }
  openHomeFeature('创作中心', `<section class="home-feature-card"><div class="home-feature-icon">${uiIcon('spark',26)}</div><h3>专业用户专属</h3><p>商家认证通过后，可使用 AI 发文、内容同步和店铺运营工具。</p><button class="home-feature-primary" type="button" onclick="closeHomeFeature();openMerchantApplySheet()">申请成为商家</button></section>`);
}
async function openHomeCart(){
  if(!homeFeatureRequireAuth()) return;
  openHomeFeature('购物车','<div class="home-feature-empty">正在读取未结算商品...</div>');
  const groups=new Map();
  try{
    for(let i=0;i<localStorage.length;i+=1){
      const key=localStorage.key(i)||'';if(!key.startsWith('scoop_merchant_cart_'))continue;
      const merchantId=key.slice('scoop_merchant_cart_'.length);let lines=[];try{lines=JSON.parse(localStorage.getItem(key)||'[]');}catch(error){}if(!Array.isArray(lines)||!lines.length)continue;
      groups.set(merchantId,{merchantId,lines:lines.filter(row=>row&&Number(row.quantity)>0),source:'retail'});
    }
    const state=typeof merchantOrderState==='function'?merchantOrderState():null;
    const restaurantLines=state&&state.merchant?merchantOrderCartRows():[];
    if(restaurantLines.length&&state.merchant?.user_id) groups.set(String(state.merchant.user_id),{merchantId:String(state.merchant.user_id),lines:restaurantLines,source:'restaurant',merchant:state.merchant});
    const cloudRows=[];
    if(session?.user?.id){
      const cloudResponse=await authedFetch(`${SUPABASE_URL}/rest/v1/user_cart_items?user_id=eq.${encodeURIComponent(session.user.id)}&select=merchant_user_id,source_type,product_key,quantity,item_snapshot,updated_at&order=updated_at.desc`,{method:'GET'});
      if(cloudResponse.ok) cloudRows.push(...(await cloudResponse.json()));
      cloudRows.forEach(row=>{
        const merchantId=String(row.merchant_user_id||''); if(!merchantId) return;
        const key=`${merchantId}:${row.source_type||'retail'}`;
        const existing=groups.get(key)||groups.get(merchantId);
        const snapshot=row.item_snapshot&&typeof row.item_snapshot==='object'?row.item_snapshot:{};
        const line={id:String(row.product_key||snapshot.id||''),name:snapshot.name||'商品',price:snapshot.price,image:snapshot.image||'',quantity:Number(row.quantity||0)};
        if(!line.id||!line.quantity) return;
        if(existing){
          existing.source=row.source_type||existing.source||'retail';
          if(!existing.lines.some(item=>String(item.id)===line.id)) existing.lines.push(line);
          groups.delete(merchantId); groups.set(key,existing);
        }else groups.set(key,{merchantId,lines:[line],source:row.source_type||'retail'});
      });
    }
    const ids=[...groups.values()].map(group=>group.merchantId).filter(Boolean);
    if(ids.length){const response=await authedFetch(`${SUPABASE_URL}/rest/v1/merchants?user_id=in.(${ids.map(encodeURIComponent).join(',')})&select=user_id,business_name,logo,slug`,{method:'GET'});if(response.ok){(await response.json()).forEach(row=>{const group=groups.get(String(row.user_id));if(group)group.merchant=Object.assign({},group.merchant||{},row);});}}
    const rows=[...groups.values()].filter(group=>group.lines.length);
    openHomeFeature('购物车',rows.length?rows.map(group=>{const total=group.lines.reduce((sum,row)=>sum+merchantOrderPriceNumber(row.price)*Number(row.quantity||0),0),merchant=group.merchant||{};return `<section class="home-feature-card"><div class="home-cart-merchant"><b>${escHtml(merchant.business_name||'商家')}</b><small>${group.source==='restaurant'?'餐饮点餐':'零售商品'} · ${group.lines.reduce((n,row)=>n+Number(row.quantity||0),0)} 件未结算</small></div>${group.lines.slice(0,8).map(row=>`<div class="home-cart-line"><span>${escHtml(row.name||'商品')} × ${Number(row.quantity||0)}</span><b>${merchantOrderMoney(merchantOrderPriceNumber(row.price)*Number(row.quantity||0))}</b></div>`).join('')}${group.lines.length>8?'<div class="home-feature-note">其余商品请回到商家继续查看。</div>':''}<div class="home-cart-line home-cart-total"><b>合计</b><b>${merchantOrderMoney(total)}</b></div><button class="home-feature-primary" type="button" onclick="closeHomeFeature();openMerchantPublicPage('${String(group.merchantId).replace(/'/g,'')}')">回到商家结算</button><button class="home-feature-secondary" type="button" onclick="clearHomeCartGroup('${escAttr(String(group.merchantId))}','${escAttr(group.source||'retail')}')">清空此商家购物车</button></section>`;}).join(''):'<div class="home-feature-empty">购物车暂时为空。餐饮、零售等未完成下单的商品会按商家显示在这里。</div>');
  }catch(error){console.warn('购物车读取失败:',error.message);openHomeFeature('购物车','<div class="home-feature-empty">购物车暂时无法读取，请稍后重试。</div>');}
}
async function clearHomeCartGroup(merchantUserId, sourceType){
  if(!confirm('确认清空这家商家的未结算商品吗？')) return;
  try{
    if(session?.user?.id){const response=await authedFetch(`${SUPABASE_URL}/rest/v1/user_cart_items?user_id=eq.${encodeURIComponent(session.user.id)}&merchant_user_id=eq.${encodeURIComponent(merchantUserId)}&source_type=eq.${encodeURIComponent(sourceType||'retail')}`,{method:'DELETE'});if(!response.ok)throw new Error(await response.text());}
    if(sourceType==='retail') localStorage.removeItem(`scoop_merchant_cart_${merchantUserId}`);
    showToast('已清空此商家购物车');openHomeCart();
  }catch(error){showToast('购物车清理失败，请稍后重试');}
}
async function homeWalletRequest(payload){
  const response=await authedFetch(`${SUPABASE_URL}/functions/v1/stripe-wallet`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  const data=await response.json().catch(()=>({}));
  if(!response.ok) throw new Error(data.error||'钱包服务暂时不可用');
  return data;
}
function loadStripeJs(){
  if(window.Stripe) return Promise.resolve(window.Stripe);
  return new Promise((resolve,reject)=>{const old=document.getElementById('stripe-js-sdk');if(old){old.addEventListener('load',()=>resolve(window.Stripe),{once:true});old.addEventListener('error',reject,{once:true});return;}const script=document.createElement('script');script.id='stripe-js-sdk';script.src='https://js.stripe.com/v3/';script.onload=()=>resolve(window.Stripe);script.onerror=()=>reject(new Error('Stripe 加载失败'));document.head.appendChild(script);});
}
async function openHomeWallet(){
  if(!homeFeatureRequireAuth()) return;
  openHomeFeature('钱包','<div class="home-feature-empty">正在读取安全支付方式...</div>');
  try{
    const data=await homeWalletRequest({action:'list'}),methods=Array.isArray(data.methods)?data.methods:[];
    openHomeFeature('钱包',`<section class="home-feature-card"><div class="home-feature-icon">${uiIcon('wallet',26)}</div><h3>安全支付方式</h3><p>银行卡、Apple Pay、Google Pay 和 Link 由 Stripe 的加密页面管理。乐生活不会读取或保存完整卡号。</p><div class="home-wallet-list">${methods.length?methods.map(method=>`<div>${uiIcon('card',18)}${escHtml(String(method.brand||'card').toUpperCase())} •••• ${escHtml(method.last4||'')} <span>${method.exp_month||''}/${method.exp_year||''}</span><button type="button" onclick="walletRemoveMethod('${escAttr(method.id)}')">移除</button></div>`).join(''):'<div class="home-feature-note">尚未保存支付方式。</div>'}</div><button class="home-feature-primary" type="button" onclick="walletBeginSetup()">添加支付方式</button><p class="home-feature-note">${data.payment_environment==='test'?'当前为 Stripe 测试环境，不会产生真实扣款。':'支付方式会用于后续结算，实际扣款仍需你确认。'}</p></section>`);
  }catch(error){openHomeFeature('钱包',`<div class="home-feature-empty">${escHtml(error.message||'钱包暂时无法读取')}</div>`);}
}
async function walletBeginSetup(){
  try{
    openHomeFeature('添加支付方式','<div class="home-feature-empty">正在建立 Stripe 安全支付页...</div>');
    const data=await homeWalletRequest({action:'setup'}),StripeCtor=await loadStripeJs();
    if(!StripeCtor||!data.client_secret||!data.publishable_key) throw new Error('Stripe 支付方式暂不可用');
    const stripe=StripeCtor(data.publishable_key),elements=stripe.elements({clientSecret:data.client_secret}),payment=elements.create('payment');
    openHomeFeature('添加支付方式',`<section class="home-feature-card"><h3>添加支付方式</h3><p>卡号、Apple Pay、Google Pay 或 Link 仅在 Stripe 加密组件内填写。</p><div id="walletPaymentElement" class="wallet-payment-element"></div><button class="home-feature-primary" type="button" onclick="walletConfirmSetup()">安全保存</button><button class="home-feature-secondary" type="button" onclick="openHomeWallet()">取消</button></section>`);
    payment.mount('#walletPaymentElement');window._walletStripe={stripe,elements};
  }catch(error){showToast(error.message||'暂时无法打开支付方式');openHomeWallet();}
}
async function walletConfirmSetup(){
  const context=window._walletStripe;if(!context){showToast('支付页面已失效，请重新打开');return;}
  try{const submit=await context.elements.submit();if(submit.error)throw submit.error;const result=await context.stripe.confirmSetup({elements:context.elements,confirmParams:{return_url:window.location.href},redirect:'if_required'});if(result.error)throw result.error;window._walletStripe=null;showToast('支付方式已安全保存');openHomeWallet();}catch(error){showToast(error.message||'保存支付方式失败');}
}
async function walletRemoveMethod(paymentMethodId){
  if(!confirm('确认移除这张支付卡吗？'))return;
  try{await homeWalletRequest({action:'detach',payment_method_id:paymentMethodId});showToast('已移除支付方式');openHomeWallet();}catch(error){showToast(error.message||'移除失败');}
}
function openHomeCommunity(){
  openHomeFeature('社区公约', `<section class="home-feature-terms"><h3>一起把乐生活做成可信赖的社区</h3><p>欢迎分享真实的本地生活、商品、活动与经验。请尊重每一位用户，不发布违法、有害、欺诈、侵权、仇恨、骚扰或明显误导的信息。</p><h4>内容与交易</h4><p>发布者应对内容、商品、服务及交易信息的真实性负责。涉及门票、零售、预约或线下服务时，请清楚说明价格、条件、时间和取消规则。</p><h4>保护彼此</h4><p>不得盗用他人的照片、身份、商标或作品；未经同意不得公开他人的私人信息。发现风险内容可使用举报入口，我们会依照社区规则处理。</p><h4>账户与沟通</h4><p>不得冒充他人、批量骚扰、刷量或利用平台进行诈骗。多次或严重违规可能导致内容下架、功能限制或账户处理。</p><p class="home-feature-note">本公约是社区使用规则的基础说明，不构成法律意见；正式服务条款与隐私规则会在公测前补充。</p></section>`);
}
async function openHomeScanner(){
  openHomeFeature('扫一扫', '<div id="homeScannerStatus" class="home-feature-empty">正在打开相机...</div><div class="home-scan-frame"><video id="homeScannerVideo" autoplay muted playsinline></video><span></span></div><p class="home-feature-note">可扫描乐生活二维码、商家二维码或商品条码。</p>');
  const status = document.getElementById('homeScannerStatus');
  if(!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)){ if(status) status.textContent = '当前浏览器不支持扫码相机。'; return; }
  try {
    window._homeScanStream = await navigator.mediaDevices.getUserMedia({ video:{ facingMode:'environment' }, audio:false });
    const video = document.getElementById('homeScannerVideo');
    if(video) video.srcObject = window._homeScanStream;
    if(!('BarcodeDetector' in window)){ if(status) status.textContent = '相机已打开，请使用支持扫码的 App 版本。'; return; }
    const detector = new BarcodeDetector({ formats:['qr_code','code_128','code_39','ean_13'] });
    if(status) status.textContent = '将二维码或条码放入取景框内。';
    window._homeScanTimer = setInterval(async () => {
      try { const codes = await detector.detect(document.getElementById('homeScannerVideo')); const value = codes?.[0]?.rawValue; if(value){ clearInterval(window._homeScanTimer); window._homeScanTimer=null; if(status) status.textContent = `已识别：${String(value).slice(0,80)}`; } } catch(error){}
    }, 650);
  } catch(error){ if(status) status.textContent = '相机未能打开，请检查相机权限。'; }
}
function openHomeHelp(){ openHomeFeature('帮助与客服', '<section class="home-feature-card"><h3>帮助与客服</h3><p>常见问题、反馈进度与人工客服入口正在整理中。公测期间可使用“我的反馈”提交问题与截图。</p><button class="home-feature-primary" type="button" onclick="closeHomeFeature();openFeedback()">提交反馈</button></section>'); }
async function clearHomeLocalCache(){
  try{
    await clearWebRuntimeCaches();
    Object.keys(localStorage).filter(key=>key.startsWith('leshenghuo_media_')||key.startsWith('wanba_posts_')).forEach(key=>localStorage.removeItem(key));
    showToast('已清理本机缓存');
    openHomeStorageSpace();
  }catch(error){showToast('缓存清理失败，请稍后再试');}
}
async function openHomeStorageSpace(){
  openHomeFeature('存储空间','<div class="home-feature-empty">正在统计本机缓存...</div>');
  let usage=0, quota=0;
  try{const estimate=await navigator.storage?.estimate?.(); usage=Number(estimate?.usage||0); quota=Number(estimate?.quota||0);}catch(error){}
  const bytesLabel=value => value >= 1024*1024*1024 ? `${(value/1024/1024/1024).toFixed(2)} GB` : `${(value/1024/1024).toFixed(1)} MB`;
  const localBytes=keys => keys.reduce((total,key)=>total+new Blob([localStorage.getItem(key)||'']).size,0);
  const keys=Object.keys(localStorage);
  const cacheBytes=localBytes(keys.filter(key=>key.startsWith('leshenghuo_media_')||key.startsWith('wanba_posts_')||key.startsWith('scoop_')));
  const draftBytes=localBytes(keys.filter(key=>key.includes('draft')));
  const percent=quota ? Math.min(100,Math.round(usage/quota*100)) : 0;
  openHomeFeature('存储空间',`<section class="home-storage-summary"><div class="home-storage-meter"><i style="width:${percent}%"></i></div><div class="home-storage-legend"><span>● 乐生活本机数据</span><span>● 设备已用空间</span><span>● 可用空间</span></div><b>${bytesLabel(usage)}</b><small>${quota?`设备可用配额约 ${bytesLabel(quota)}`:'浏览器未提供可用空间数据'}</small></section><section class="home-storage-list"><div><span><b>缓存</b><small>${bytesLabel(cacheBytes)} · 图片与已浏览内容</small></span><button type="button" onclick="clearHomeLocalCache()">清理</button></div><div><span><b>我的下载</b><small>0 KB · 已保存到设备的内容由系统相册或文件管理</small></span><button type="button" onclick="showToast('当前设备没有乐生活离线下载')">管理</button></div><div><span><b>笔记草稿</b><small>${bytesLabel(draftBytes)} · 仅保存在本机，删除 App 或清理草稿后无法恢复</small></span><button type="button" onclick="clearHomeDrafts()">管理</button></div><div><span><b>聊天文件</b><small>0 KB · 当前没有独立缓存的聊天附件</small></span><button type="button" onclick="showToast('当前没有可清理的聊天文件')">管理</button></div></section><section class="home-storage-fixed"><b>不可清理内容</b><p>账户、云端笔记、订单和已完成交易保存在服务器，清理本机缓存不会影响它们。</p></section>`);
}
window.clearHomeDrafts=function(){
  if(!confirm('清理本机笔记草稿吗？清理后无法恢复。')) return;
  Object.keys(localStorage).filter(key=>key.toLowerCase().includes('draft')).forEach(key=>localStorage.removeItem(key));
  showToast('本机草稿已清理'); openHomeStorageSpace();
};
let homeAccountSettingsCache = null;
function homeDefaultAccountSettings(){
  return {
    notifications:{ likes:true, follows:true, comments:true, mentions:true, shares:true, direct_messages:true, followed_updates:true, livestream:true, content_recommendations:true, user_recommendations:true, other:true, merchant_orders:true, app_banner:true },
    preferences:{ categories:[], topics:[] },
    privacy:{ discoverable:true, show_region:true, recommend_me:false, recommend_to_others:false, one_tap_protection:false, dm_scope:'default', comment_scope:'all', mention_scope:'all', chat_marker:true, online_status:'mutual', follow_list:'public', favorites:'private', hide_from:[], hide:[], blacklist:[] },
    general:{ font_size:'medium', theme:'system', auto_refresh:true, browsing_history:true },
    security:{ phone:'', identity_status:'not_started', deletion_requested_at:'' }
  };
}
function homeMergeAccountSettings(base, patch){
  return {
    ...base,
    ...patch,
    notifications:{...(base.notifications||{}),...(patch.notifications||{})},
    preferences:{...(base.preferences||{}),...(patch.preferences||{})},
    privacy:{...(base.privacy||{}),...(patch.privacy||{})},
    general:{...(base.general||{}),...(patch.general||{})},
    security:{...(base.security||{}),...(patch.security||{})}
  };
}
async function loadHomeAccountSettings(force=false){
  if(!homeFeatureRequireAuth()) return homeDefaultAccountSettings();
  if(homeAccountSettingsCache && !force) return homeAccountSettingsCache;
  const url=`${SUPABASE_URL}/rest/v1/user_account_settings?user_id=eq.${encodeURIComponent(session.user.id)}&select=settings&limit=1`;
  const res=await authedFetch(url,{headers:{apikey:SUPABASE_KEY}});
  if(!res.ok) throw new Error('设置读取失败');
  const rows=await res.json();
  homeAccountSettingsCache=homeMergeAccountSettings(homeDefaultAccountSettings(), rows?.[0]?.settings||{});
  return homeAccountSettingsCache;
}
async function saveHomeAccountSettings(patch){
  if(!homeFeatureRequireAuth()) return null;
  const current=await loadHomeAccountSettings();
  const settings=homeMergeAccountSettings(current,patch);
  const res=await authedFetch(`${SUPABASE_URL}/rest/v1/user_account_settings?on_conflict=user_id`,{method:'POST',headers:{apikey:SUPABASE_KEY,'Content-Type':'application/json',Prefer:'resolution=merge-duplicates,return=representation'},body:JSON.stringify({user_id:session.user.id,settings,updated_at:new Date().toISOString()})});
  if(!res.ok) throw new Error('设置保存失败');
  homeAccountSettingsCache=settings;
  applyHomeAccountDisplayPreferences(settings);
  return settings;
}
function applyHomeAccountDisplayPreferences(settings){
  const general=settings?.general||{};
  document.documentElement.dataset.accountTheme=['light','dark'].includes(general.theme)?general.theme:'system';
  document.documentElement.dataset.accountFontSize=['small','medium','large'].includes(general.font_size)?general.font_size:'medium';
}
function homeSettingChoice(label, detail, value, options, handler, key){
  // Older setting rows pass the action directly as the fourth argument. Keep both
  // call styles working while the account center is gradually expanded.
  if(typeof options === 'string'){
    key = handler;
    handler = options;
    options = {};
  }
  options = options && typeof options === 'object' ? options : {};
  return `<button class="home-setting-choice" type="button" onclick="${handler}('${key}')"><span><b>${escHtml(label)}</b><small>${escHtml(detail)}</small></span><em>${escHtml(options[value]||value||'默认')}</em><i>›</i></button>`;
}
function homeSettingSelect(title, key, value, options, saver){
  const list=Object.entries(options).map(([id,label])=>`<button class="home-select-option ${id===value?'selected':''}" type="button" onclick="${saver}('${key}','${id}')">${escHtml(label)}${id===value?' ✓':''}</button>`).join('');
  openHomeFeature(title, `<section class="home-feature-card"><h3>${escHtml(title)}</h3><div class="home-select-list">${list}</div></section>`);
}
function homeSettingToggle(label, description, checked, handler, key){
  return `<label class="home-setting-toggle"><span><b>${escHtml(label)}</b><small>${escHtml(description)}</small></span><input type="checkbox" ${checked?'checked':''} onchange="${handler}('${key}',this.checked)"><i aria-hidden="true"></i></label>`;
}
async function openHomeNotificationSettings(){
  if(!homeFeatureRequireAuth()) return;
  openHomeFeature('通知设置','<div class="home-feature-empty">正在读取通知偏好...</div>');
  try{
    const settings=await loadHomeAccountSettings(); const n=settings.notifications||{};
    openHomeFeature('通知设置',`<div class="home-setting-section-title">互动通知</div><section class="home-feature-card home-setting-card">${homeSettingToggle('赞和收藏','有人赞或收藏你的笔记',n.likes!==false,'updateHomeNotificationSetting','likes')}${homeSettingToggle('新增关注','有用户关注你',n.follows!==false,'updateHomeNotificationSetting','follows')}${homeSettingToggle('评论','有人评论你的笔记',n.comments!==false,'updateHomeNotificationSetting','comments')}${homeSettingToggle('@ 提及','有人在内容中提及你',n.mentions!==false,'updateHomeNotificationSetting','mentions')}${homeSettingToggle('分享','有人分享你的笔记',n.shares!==false,'updateHomeNotificationSetting','shares')}</section><div class="home-setting-section-title">私信通知</div><section class="home-feature-card home-setting-card">${homeSettingToggle('私信','接收新的站内私信提示',n.direct_messages!==false,'updateHomeNotificationSetting','direct_messages')}</section><div class="home-setting-section-title">社区内容通知</div><section class="home-feature-card home-setting-card">${homeSettingToggle('关注者更新','关注用户发布新内容时通知',n.followed_updates!==false,'updateHomeNotificationSetting','followed_updates')}${homeSettingToggle('开播提醒','关注的创作者开始直播时通知',n.livestream!==false,'updateHomeNotificationSetting','livestream')}${homeSettingToggle('内容推荐','接收与你兴趣相关的推荐',n.content_recommendations!==false,'updateHomeNotificationSetting','content_recommendations')}${homeSettingToggle('用户推荐','接收可能认识的用户推荐',n.user_recommendations!==false,'updateHomeNotificationSetting','user_recommendations')}${homeSettingToggle('其他通知','系统、安全与服务提醒',n.other!==false,'updateHomeNotificationSetting','other')}</section><div class="home-setting-section-title">购物与服务</div><section class="home-feature-card home-setting-card">${homeSettingToggle('购物及售后通知','订单、物流、预约、票务与售后状态',n.merchant_orders!==false,'updateHomeNotificationSetting','merchant_orders')}${homeSettingToggle('App 内通知横幅','在使用乐生活时显示顶部横幅',n.app_banner!==false,'updateHomeNotificationSetting','app_banner')}</section><p class="home-feature-note">此处保存站内通知偏好。设备系统推送权限会在你主动开启推送功能时申请。</p>`);
  }catch(error){openHomeFeature('通知设置','<div class="home-feature-empty">暂时无法读取通知偏好，请稍后重试。</div>');}
}
window.updateHomeNotificationSetting=async function(key,checked){
  try{await saveHomeAccountSettings({notifications:{[key]:checked}});showToast('通知偏好已保存');}catch(error){showToast(error.message||'保存失败');}
};
async function openHomePreferences(){
  if(!homeFeatureRequireAuth()) return;
  openHomeFeature('内容偏好','<div class="home-feature-empty">正在读取内容偏好...</div>');
  try{
    const settings=await loadHomeAccountSettings(); const selected=Array.isArray(settings.preferences?.categories)?settings.preferences.categories:[];
    const groups={
      '吃喝':['探店','中餐','奶茶','咖啡','烘焙甜品','家常菜','美食攻略'],
      '玩乐':['旅行攻略','展览演出','电影影视','运动健身','桌游电玩','摄影','动漫二次元'],
      '生活':['亲子遛娃','租房买房','宠物','家政服务','交友社群','本地资讯'],
      '好物与省钱':['数码','美妆穿搭','家居用品','二手交易','超市优惠','本周活动']
    };
    const sections=Object.entries(groups).map(([title,choices])=>`<section class="home-feature-card home-preference-card"><h3>${title}</h3><div class="home-preference-chips">${choices.map(name=>`<button type="button" class="${selected.includes(name)?'selected':''}" onclick="toggleHomeContentPreference('${name}')">${name}${selected.includes(name)?' ✓':''}</button>`).join('')}</div></section>`).join('');
    openHomeFeature('内容偏好',`<p class="home-feature-intro">选择更细的兴趣标签，用于调整“推荐”内容。不会隐藏其他公开内容。</p>${sections}`);
  }catch(error){openHomeFeature('内容偏好','<div class="home-feature-empty">暂时无法读取内容偏好，请稍后重试。</div>');}
}
window.toggleHomeContentPreference=async function(name){
  try{
    const settings=await loadHomeAccountSettings(); const current=Array.isArray(settings.preferences?.categories)?settings.preferences.categories:[];
    const categories=current.includes(name)?current.filter(item=>item!==name):[...current,name];
    await saveHomeAccountSettings({preferences:{categories}}); await openHomePreferences(); showToast('内容偏好已保存');
  }catch(error){showToast(error.message||'保存失败');}
};
async function openHomePrivacySettings(){
  if(!homeFeatureRequireAuth()) return;
  openHomeFeature('隐私设置','<div class="home-feature-empty">正在读取展示偏好...</div>');
  try{
    const settings=await loadHomeAccountSettings(); const p=settings.privacy||{};
    const simpleOptions={default:'默认',all:'全部',mutual:'互相关注',followers:'我关注的人',private:'不公开',off:'关闭',on:'开启'};
    const privacyCount = key => Array.isArray(p[key]) ? p[key].length : 0;
    openHomeFeature('隐私设置',`<div class="home-setting-section-title">发现与推荐</div><section class="home-feature-card home-setting-card">${homeSettingToggle('找到我的方式','允许其他用户通过昵称或乐生活 ID 找到你',p.discoverable!==false,'updateHomePrivacySetting','discoverable')}${homeSettingToggle('推荐可能认识的人给我','使用公开资料推荐可能认识的人',p.recommend_me===true,'updateHomePrivacySetting','recommend_me')}${homeSettingToggle('把我推荐给可能认识的人','允许系统将你作为推荐用户展示',p.recommend_to_others===true,'updateHomePrivacySetting','recommend_to_others')}${homeSettingToggle('展示所属地区','仅显示你选择的大区，不显示精确地址',p.show_region!==false,'updateHomePrivacySetting','show_region')}</section><div class="home-setting-section-title">屏蔽与黑名单</div><section class="home-feature-card home-setting-card">${homeSettingChoice('不让他（她）看','管理无法查看你公开主页的用户', privacyCount('hide_from') ? `${privacyCount('hide_from')} 人` : '', {},'openHomePrivacyPeople','hide_from')}${homeSettingChoice('不看他（她）','管理你不想看到内容的用户', privacyCount('hide') ? `${privacyCount('hide')} 人` : '', {},'openHomePrivacyPeople','hide')}${homeSettingChoice('黑名单','管理被限制互动的用户', privacyCount('blacklist') ? `${privacyCount('blacklist')} 人` : '', {},'openHomePrivacyPeople','blacklist')}</section><div class="home-setting-section-title">互动权限</div><section class="home-feature-card home-setting-card">${homeSettingToggle('一键防护','快速收紧私信、评论和 @ 权限',p.one_tap_protection===true,'updateHomePrivacySetting','one_tap_protection')}${homeSettingChoice('谁可以私信我','设置站内私信的接收范围',p.dm_scope,simpleOptions,'openHomePrivacyChoice','dm_scope')}${homeSettingChoice('谁可以评论和回复','设置笔记评论范围',p.comment_scope,simpleOptions,'openHomePrivacyChoice','comment_scope')}${homeSettingChoice('谁可以 @ 我','设置提及范围',p.mention_scope,simpleOptions,'openHomePrivacyChoice','mention_scope')}${homeSettingToggle('聊天标识','在私信中显示已读等状态',p.chat_marker!==false,'updateHomePrivacySetting','chat_marker')}</section><div class="home-setting-section-title">内容与状态权限</div><section class="home-feature-card home-setting-card">${homeSettingChoice('在线状态','谁可以看到你的在线状态',p.online_status,{all:'全部',mutual:'互相关注的人',private:'不公开'},'openHomePrivacyChoice','online_status')}${homeSettingChoice('关注与粉丝列表','设置关注与粉丝列表可见范围',p.follow_list,{public:'全部公开',mutual:'互相关注可见',private:'不公开'},'openHomePrivacyChoice','follow_list')}${homeSettingChoice('我的收藏','设置收藏内容可见范围',p.favorites,{public:'公开',private:'不公开'},'openHomePrivacyChoice','favorites')}</section><section class="home-feature-terms"><p>相机、位置、相册和通讯录只会在你主动使用扫码、地图、上传或添加好友等功能时请求授权。</p></section>`);
  }catch(error){openHomeFeature('隐私设置','<div class="home-feature-empty">暂时无法读取展示偏好，请稍后重试。</div>');}
}
window.updateHomePrivacySetting=async function(key,checked){
  try{await saveHomeAccountSettings({privacy:{[key]:checked}});showToast('展示偏好已保存');}catch(error){showToast(error.message||'保存失败');}
};
window.openHomePrivacyChoice=function(key){
  homeFeatureBackAction = returnToHomeFeature(openHomePrivacySettings);
  loadHomeAccountSettings().then(settings=>{
    const value=settings.privacy?.[key]||'default';
    const options=key==='online_status'?{all:'全部',mutual:'互相关注的人',private:'不公开'}:key==='follow_list'?{public:'全部公开',mutual:'互相关注可见',private:'不公开'}:key==='favorites'?{public:'公开',private:'不公开'}:{default:'默认',all:'全部',mutual:'互相关注',followers:'我关注的人',private:'不公开'};
    homeSettingSelect('选择隐私范围',key,value,options,'saveHomePrivacyChoice');
  }).catch(()=>showToast('设置暂时无法读取'));
};
window.saveHomePrivacyChoice=async function(key,value){try{await saveHomeAccountSettings({privacy:{[key]:value}});showToast('隐私设置已保存');homeFeatureBackAction=returnToHomeSettings;openHomePrivacySettings();}catch(error){showToast('保存失败，请稍后重试');}};
window.openHomePrivacyPeople=async function(kind){
  if(!homeFeatureRequireAuth()) return;
  const labels={hide_from:'不让他（她）看',hide:'不看他（她）',blacklist:'黑名单'};
  const notes={hide_from:'加入后会保存为你的主页可见控制名单；完整的服务端访问限制会随隐私策略一起执行。',hide:'加入后，首页推荐会隐藏此人的公开笔记。',blacklist:'加入后，首页会隐藏此人的内容，并作为后续私信与互动限制名单。'};
  homeFeatureBackAction=returnToHomeFeature(openHomePrivacySettings);
  const render=async () => {
    const settings=await loadHomeAccountSettings(true);
    const ids=Array.isArray(settings.privacy?.[kind])?settings.privacy[kind].map(String):[];
    let rows=[];
    if(ids.length){
      const response=await authedFetch(`${SUPABASE_URL}/rest/v1/profiles?user_id=in.(${ids.map(id=>encodeURIComponent(id)).join(',')})&select=user_id,name,avatar,bio`,{headers:{apikey:SUPABASE_KEY}});
      if(response.ok) rows=await response.json();
    }
    const list=ids.map(id=>rows.find(row=>String(row.user_id)===id)||{user_id:id,name:'乐生活用户'});
    openHomeFeature(labels[kind]||'隐私名单',`<p class="home-feature-intro">${notes[kind]||''}</p><div class="home-friend-search"><input id="homePrivacyKeyword" maxlength="48" placeholder="输入昵称或乐生活 ID" onkeydown="if(event.key==='Enter')searchHomePrivacyPeople('${kind}')"><button type="button" onclick="searchHomePrivacyPeople('${kind}')">添加</button></div><div id="homePrivacyResults" class="home-feature-list"></div><div class="home-setting-section-title">当前名单</div><div class="home-feature-list">${list.length?list.map(row=>`<article class="home-friend-row"><button class="home-friend-main" type="button" onclick="openUserPublicPage('${String(row.user_id).replace(/'/g,'')}','${String(row.name||'').replace(/'/g,'')}')"><span class="home-friend-avatar">${row.avatar?`<img src="${escAttr(row.avatar)}" alt="">`:escHtml(initials(row.name||'用'))}</span><span><b>${escHtml(row.name||'乐生活用户')}</b><small>ID: ${escHtml(uidToNumericId(String(row.user_id))||'')}</small></span></button><button class="home-friend-follow" type="button" onclick="removeHomePrivacyPerson('${kind}','${String(row.user_id).replace(/'/g,'')}')">移除</button></article>`).join(''):'<div class="home-feature-empty">当前没有用户。</div>'}</div>`);
  };
  try{await render();}catch(error){openHomeFeature(labels[kind]||'隐私名单','<div class="home-feature-empty">暂时无法读取名单，请稍后重试。</div>');}
};
window.searchHomePrivacyPeople=async function(kind){
  const keyword=String(document.getElementById('homePrivacyKeyword')?.value||'').trim();
  const target=document.getElementById('homePrivacyResults');
  if(!keyword||!target) return;
  target.innerHTML='<div class="home-feature-empty">正在查找用户...</div>';
  try{
    const safe=encodeURIComponent(keyword.replace(/[(),]/g,''));
    const response=await authedFetch(`${SUPABASE_URL}/rest/v1/profiles?select=user_id,name,avatar,bio&or=(name.ilike.*${safe}*)&limit=20`,{headers:{apikey:SUPABASE_KEY}});
    if(!response.ok) throw new Error('搜索失败');
    const rows=(await response.json()).filter(row=>String(row.user_id)!==String(session?.user?.id)).sort((a,b)=>homeFriendScore(b,keyword)-homeFriendScore(a,keyword));
    target.innerHTML=rows.length?rows.map(row=>`<article class="home-friend-row"><button class="home-friend-main" type="button" onclick="openUserPublicPage('${String(row.user_id).replace(/'/g,'')}','${String(row.name||'').replace(/'/g,'')}')"><span class="home-friend-avatar">${row.avatar?`<img src="${escAttr(row.avatar)}" alt="">`:escHtml(initials(row.name||'用'))}</span><span><b>${escHtml(row.name||'乐生活用户')}</b><small>ID: ${escHtml(uidToNumericId(String(row.user_id))||'')}</small></span></button><button class="home-friend-follow" type="button" onclick="addHomePrivacyPerson('${kind}','${String(row.user_id).replace(/'/g,'')}')">加入</button></article>`).join(''):'<div class="home-feature-empty">没有找到相符的用户。</div>';
  }catch(error){target.innerHTML='<div class="home-feature-empty">搜索暂时不可用，请稍后重试。</div>';}
};
window.addHomePrivacyPerson=async function(kind,userId){try{const settings=await loadHomeAccountSettings();const current=Array.isArray(settings.privacy?.[kind])?settings.privacy[kind].map(String):[];if(!current.includes(String(userId)))await saveHomeAccountSettings({privacy:{[kind]:[...current,String(userId)]}});showToast('已加入名单');openHomePrivacyPeople(kind);}catch(error){showToast('保存失败，请稍后重试');}};
window.removeHomePrivacyPerson=async function(kind,userId){try{const settings=await loadHomeAccountSettings();const current=Array.isArray(settings.privacy?.[kind])?settings.privacy[kind].map(String):[];await saveHomeAccountSettings({privacy:{[kind]:current.filter(id=>id!==String(userId))}});showToast('已移除');openHomePrivacyPeople(kind);}catch(error){showToast('保存失败，请稍后重试');}};
async function openHomeGeneralSettings(){
  if(!homeFeatureRequireAuth()) return;
  openHomeFeature('通用设置','<div class="home-feature-empty">正在读取通用设置...</div>');
  try{
    const settings=await loadHomeAccountSettings(); const g=settings.general||{};
    openHomeFeature('通用设置',`<div class="home-setting-section-title">显示</div><section class="home-feature-card home-setting-card">${homeSettingChoice('字体大小','调整应用中支持缩放的文字',g.font_size,{small:'小',medium:'标准',large:'大'},'openHomeGeneralChoice','font_size')}${homeSettingChoice('显示模式','选择白色、暗色或跟随系统',g.theme,{light:'白色',dark:'暗色',system:'随系统'},'openHomeGeneralChoice','theme')}</section><div class="home-setting-section-title">功能</div><section class="home-feature-card home-setting-card">${homeSettingToggle('自动刷新','打开后，首页、本周、省钱和消息会按页面规则刷新',g.auto_refresh!==false,'updateHomeGeneralSetting','auto_refresh')}${homeSettingToggle('浏览记录','打开后，将在本机和账户浏览记录中保存你打开的笔记',g.browsing_history!==false,'updateHomeGeneralSetting','browsing_history')}</section><p class="home-feature-note">关闭自动刷新后，仍可通过页面下拉手动刷新。</p>`);
  }catch(error){openHomeFeature('通用设置','<div class="home-feature-empty">暂时无法读取通用设置，请稍后重试。</div>');}
}
window.openHomeGeneralChoice=function(key){
  homeFeatureBackAction = returnToHomeFeature(openHomeGeneralSettings);
  loadHomeAccountSettings().then(settings=>{
    const value=settings.general?.[key]||'medium';
    const options=key==='theme'?{light:'白色',dark:'暗色',system:'随系统'}:{small:'小',medium:'标准',large:'大'};
    homeSettingSelect(key==='theme'?'显示模式':'字体大小',key,value,options,'saveHomeGeneralChoice');
  }).catch(()=>showToast('设置暂时无法读取'));
};
window.saveHomeGeneralChoice=async function(key,value){try{await saveHomeAccountSettings({general:{[key]:value}});showToast('通用设置已保存');homeFeatureBackAction=returnToHomeSettings;openHomeGeneralSettings();}catch(error){showToast('保存失败，请稍后重试');}};
window.updateHomeGeneralSetting=async function(key,checked){try{await saveHomeAccountSettings({general:{[key]:checked}});showToast('通用设置已保存');}catch(error){showToast('保存失败，请稍后重试');}};
async function openHomeSecuritySettings(){
  if(!homeFeatureRequireAuth()) return;
  openHomeFeature('账号与安全','<div class="home-feature-empty">正在读取账号信息...</div>');
  try{
    const settings=await loadHomeAccountSettings(); const s=settings.security||{};
    const providers=Array.isArray(session?.user?.app_metadata?.providers)?session.user.app_metadata.providers:[];
    const providerState=name=>providers.includes(name)?'已连接':'未连接';
    openHomeFeature('账号与安全',`<section class="home-feature-card home-security-account"><h3>${escHtml(session?.user?.email||'当前账户')}</h3><p>邮箱为当前登录账号。账户资料与订单不会因切换设备而丢失。</p></section><div class="home-setting-section-title">登录与验证</div><section class="home-feature-card home-setting-card">${homeSettingChoice('手机号',s.phone||'未绑定',s.phone?'已保存为账户联系号码':'用于订单联系与后续账号验证','openHomePhoneForm','phone')}${homeSettingChoice('登录密码','设置或修改登录密码','建议至少 10 位并包含字母和数字','openHomePasswordChange','password')}</section><div class="home-setting-section-title">第三方账号</div><section class="home-feature-card home-setting-card">${homeSettingChoice('Apple 账号',providerState('apple'),'第三方登录连接状态','openHomeProviderInfo','apple')}${homeSettingChoice('Google 账号',providerState('google'),'第三方登录连接状态','openHomeProviderInfo','google')}</section><div class="home-setting-section-title">身份与找回</div><section class="home-feature-card home-setting-card">${homeSettingChoice('身份认证',s.identity_status==='submitted'?'审核申请已提交':'未认证','钟点工、专业服务等功能可能需要身份审核','openHomeIdentityVerification','identity')}${homeSettingChoice('账号找回','通过邮箱重设登录信息','未记住密码时可发送重置邮件','openHomeAccountRecovery','recovery')}</section><div class="home-setting-section-title">账户</div><section class="home-feature-card home-setting-card">${homeSettingChoice('注销账号',s.deletion_requested_at?'已提交注销申请':'申请注销','注销前会保留订单与付款的法定记录','openHomeDeletionRequest','delete')}</section>`);
  }catch(error){openHomeFeature('账号与安全','<div class="home-feature-empty">暂时无法读取账号与安全信息，请稍后重试。</div>');}
}
window.openHomePhoneForm=function(){
  homeFeatureBackAction = returnToHomeFeature(openHomeSecuritySettings);
  loadHomeAccountSettings().then(settings=>openHomeFeature('绑定手机号',`<section class="home-feature-card"><h3>绑定手机号</h3><p>手机号会保存为账户联系号码，用于订单联系与后续验证。短信验证码服务尚未接入时，不会将它标记为已验证。</p><form onsubmit="saveHomePhone(event)"><label class="home-form-label">手机号码<input name="phone" inputmode="tel" maxlength="32" required placeholder="例如 +1 626 000 0000" value="${escAttr(settings.security?.phone||'')}"></label><button class="home-feature-primary" type="submit">保存手机号</button></form></section>`)).catch(()=>showToast('设置暂时无法读取'));
};
window.saveHomePhone=async function(event){event.preventDefault();const phone=String(new FormData(event.currentTarget).get('phone')||'').trim();if(phone.length<7){showToast('请输入有效的手机号码');return;}try{await saveHomeAccountSettings({security:{phone}});showToast('手机号已保存');homeFeatureBackAction=returnToHomeSettings;openHomeSecuritySettings();}catch(error){showToast('手机号保存失败');}};
window.openHomePasswordChange=function(){homeFeatureBackAction=null;closeHomeFeature();openAuth('reset');showToast('请设置新的登录密码');};
window.openHomeProviderInfo=function(provider){
  homeFeatureBackAction = returnToHomeFeature(openHomeSecuritySettings);
  const label=provider==='apple'?'Apple':'Google';
  const linked=(session?.user?.app_metadata?.providers||[]).includes(provider);
  openHomeFeature(`${label} 账号`, `<section class="home-feature-card"><h3>${linked?'已连接':'尚未连接'} ${label}</h3><p>${linked?`当前账户已通过 ${label} 登录连接。`:`${label} 登录将在对应 OAuth 服务完成配置后开放连接。当前仍可用邮箱和密码登录。`}</p></section>`);
};
window.openHomeIdentityVerification=function(){
  homeFeatureBackAction = returnToHomeFeature(openHomeSecuritySettings);
  openHomeFeature('身份认证', `<section class="home-feature-card"><h3>身份认证</h3><p>用于钟点工、专业服务等需要确认真人身份的功能。证件审核服务尚未开放上传，本次可先提交认证意向；开放后会在消息中心通知你补充资料。</p><button class="home-feature-primary" type="button" onclick="submitHomeIdentityVerification()">提交认证申请</button></section>`);
};
window.submitHomeIdentityVerification=async function(){try{await saveHomeAccountSettings({security:{identity_status:'submitted'}});showToast('认证申请已提交');homeFeatureBackAction=returnToHomeSettings;openHomeSecuritySettings();}catch(error){showToast('提交失败，请稍后重试');}};
window.openHomeAccountRecovery=function(){homeFeatureBackAction = returnToHomeFeature(openHomeSecuritySettings);openHomeFeature('账号找回', `<section class="home-feature-card"><h3>找回登录信息</h3><p>当前账户邮箱：${escHtml(session?.user?.email||'未登录')}</p><button class="home-feature-primary" type="button" onclick="openHomeRecoveryAuth()">发送密码重置邮件</button><p class="home-feature-note">系统会将重置链接发送到当前账户邮箱。</p></section>`);};
window.openHomeRecoveryAuth=function(){const email=session?.user?.email||'';homeFeatureBackAction=null;closeHomeFeature();openAuth();const input=document.getElementById('authEmail');if(input)input.value=email;setTimeout(()=>requestPasswordReset(),80);};
window.openHomeDeletionRequest=function(){homeFeatureBackAction = returnToHomeFeature(openHomeSecuritySettings);openHomeFeature('注销账号', `<section class="home-feature-card"><h3>申请注销账号</h3><p>账号注销会停止公开展示账户资料。已完成订单、支付、退款与法律要求保留的记录不会立即删除。</p><button class="home-feature-danger" type="button" onclick="submitHomeDeletionRequest()">提交注销申请</button></section>`);};
window.submitHomeDeletionRequest=async function(){if(!confirm('确认提交注销申请吗？'))return;try{await saveHomeAccountSettings({security:{deletion_requested_at:new Date().toISOString()}});showToast('注销申请已提交');homeFeatureBackAction=returnToHomeSettings;openHomeSecuritySettings();}catch(error){showToast('提交失败，请稍后重试');}};
async function fetchHomeAddresses(){
  if(!homeFeatureRequireAuth()) return [];
  const url=`${SUPABASE_URL}/rest/v1/user_delivery_addresses?user_id=eq.${encodeURIComponent(session.user.id)}&select=*&order=is_default.desc,updated_at.desc`;
  const res=await authedFetch(url,{headers:{apikey:SUPABASE_KEY}});
  if(!res.ok) throw new Error('地址读取失败');
  return res.json();
}
async function openHomeAddresses(){
  if(!homeFeatureRequireAuth()) return;
  openHomeFeature('收货地址','<div class="home-feature-empty">正在读取常用地址...</div>');
  try{
    const addresses=await fetchHomeAddresses();
    const list=addresses.length?addresses.map(item=>`<section class="home-feature-card" style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;gap:12px"><div><h3 style="margin:0">${escHtml(item.label||'常用地址')}${item.is_default?' <small style="color:#5d896a">默认</small>':''}</h3><p style="margin:8px 0 2px">${escHtml(item.recipient_name)} · ${escHtml(item.phone)}</p><p style="margin:2px 0">${escHtml([item.address_line1,item.address_line2,item.city,item.state_region,item.postal_code].filter(Boolean).join(', '))}</p></div><button type="button" onclick="removeHomeAddress(${Number(item.id)})" style="align-self:flex-start;border:0;background:transparent;color:#b34848;font-size:14px">删除</button></div></section>`).join(''):'<div class="home-feature-empty">还没有保存常用收货地址。</div>';
    openHomeFeature('收货地址',`${list}<button class="home-feature-primary" type="button" style="margin-top:12px" onclick="openHomeAddressForm()">添加收货地址</button><p class="home-feature-note">地址保存到当前账户，可在不同设备的零售与配送订单中复用。</p>`);
  }catch(error){openHomeFeature('收货地址','<div class="home-feature-empty">暂时无法读取收货地址，请稍后重试。</div>');}
}
window.openHomeAddressForm=function(){
  homeFeatureBackAction = returnToHomeFeature(openHomeAddresses);
  openHomeFeature('添加收货地址',`<section class="home-feature-card"><form onsubmit="saveHomeAddress(event)"><label>地址名称<input name="label" value="常用地址" required></label><label>收件人姓名<input name="recipient_name" required></label><label>联系电话<input name="phone" inputmode="tel" required></label><label>街道地址<input name="address_line1" required></label><label>门牌、单元（选填）<input name="address_line2"></label><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><label>城市<input name="city"></label><label>州 / 地区<input name="state_region"></label></div><label>邮编<input name="postal_code" inputmode="numeric"></label><label style="display:flex;gap:8px;align-items:center"><input type="checkbox" name="is_default">设为默认收货地址</label><button class="home-feature-primary" type="submit">保存地址</button></form></section>`);
};
window.saveHomeAddress=async function(event){
  event.preventDefault(); if(!homeFeatureRequireAuth()) return;
  const fields=Object.fromEntries(new FormData(event.currentTarget).entries());
  const res=await authedFetch(`${SUPABASE_URL}/rest/v1/user_delivery_addresses`,{method:'POST',headers:{apikey:SUPABASE_KEY,'Content-Type':'application/json',Prefer:'return=representation'},body:JSON.stringify({...fields,user_id:session.user.id,is_default:Boolean(event.currentTarget.is_default.checked)})});
  if(!res.ok){showToast('地址保存失败，请稍后重试');return;}
  showToast('收货地址已保存'); homeFeatureBackAction=returnToHomeSettings; openHomeAddresses();
};
window.removeHomeAddress=async function(id){
  if(!confirm('确认删除这条收货地址吗？')) return;
  const res=await authedFetch(`${SUPABASE_URL}/rest/v1/user_delivery_addresses?id=eq.${encodeURIComponent(id)}`,{method:'DELETE',headers:{apikey:SUPABASE_KEY}});
  if(!res.ok){showToast('删除失败，请稍后重试');return;}
  showToast('收货地址已删除');openHomeAddresses();
};
function ensureHomeMenu(){
  let overlay=document.getElementById('homeMenuOverlay');
  if(overlay) return overlay;
  const row=(label,icon,action,detail='')=>`<button class="home-menu-action" type="button" onclick="handleHomeMenuAction('${action}',event)">${menuGlyph(icon)}<span>${label}</span>${detail?`<small>${detail}</small>`:''}</button>`;
  const setting=(label,icon,action='comingSoon')=>`<button class="home-settings-row" type="button" onclick="handleHomeMenuAction('${action}',event)">${menuGlyph(icon)}<span>${label}</span><i class="home-settings-chevron">›</i></button>`;
  overlay=document.createElement('div');
  overlay.id='homeMenuOverlay'; overlay.className='home-menu-overlay';
  overlay.innerHTML=`<aside class="home-menu-panel" role="dialog" aria-modal="true" aria-label="主页菜单" onclick="event.stopPropagation()"><div class="home-menu-head"><b>乐生活</b><button class="home-menu-close" type="button" onclick="closeHomeMenu()" aria-label="关闭">×</button></div><section class="home-menu-group">${row('添加好友','user','friends')}${row('创作中心','pen','creator')}${row('我的草稿','pen','drafts')}</section><section class="home-menu-group">${row('浏览记录','clock','history')}${row('订单','bag','orders')}${row('购物车','cart','cart')}${row('钱包','wallet','wallet')}</section><section class="home-menu-group">${row('社区公约','shield','community')}</section><div class="home-menu-bottom"><button type="button" onclick="handleHomeMenuAction('scan',event)">${menuGlyph('scan')}<span>扫一扫</span></button><button type="button" onclick="handleHomeMenuAction('help',event)">${menuGlyph('help')}<span>帮助与客服</span></button><button type="button" onclick="openHomeSettings(event)">${menuGlyph('settings')}<span>设置</span></button></div></aside><section class="home-settings-panel" role="dialog" aria-modal="true" aria-label="设置"><header class="home-settings-header"><button class="home-settings-back" type="button" onclick="closeHomeSettings()" aria-label="返回">‹</button><h2>设置</h2><span></span></header><div class="home-settings-card">${setting('账号与安全','user','security')}${setting('通用设置','settings','general')}${setting('通知设置','help','notifications')}${setting('多语言和翻译','pen','language')}${setting('隐私设置','shield','privacy')}</div><div class="home-settings-card">${setting('存储空间','bag','cache')}${setting('内容偏好调节','pen','preferences')}${setting('收货地址','user','address')}${setting('添加小组件','bag')}${setting('未成年人模式','shield')}</div><div class="home-settings-card">${setting('新功能体验','pen')}</div><div class="home-settings-card">${setting('帮助与客服','help','help')}${setting('关于乐生活','help','community')}</div><div class="home-settings-card">${setting('切换账号','user','switchAccount')}</div></section>`;
  overlay.addEventListener('click',()=>closeHomeMenu());
  document.body.appendChild(overlay);
  return overlay;
}
window.openHomeMenu=function(event){ event?.preventDefault?.(); event?.stopPropagation?.(); const overlay=ensureHomeMenu(); overlay.classList.remove('settings-open'); overlay.classList.add('open'); document.body.classList.add('home-menu-open'); };
window.closeHomeMenu=function(){ const overlay=document.getElementById('homeMenuOverlay'); overlay?.classList.remove('open','settings-open'); document.body.classList.remove('home-menu-open'); };
window.openHomeSettings=function(event){ event?.preventDefault?.(); event?.stopPropagation?.(); const overlay=ensureHomeMenu(); overlay.classList.add('settings-open'); };
window.closeHomeSettings=function(){ document.getElementById('homeMenuOverlay')?.classList.remove('settings-open'); };
window.handleHomeMenuAction=function(action,event){
  event?.preventDefault?.(); event?.stopPropagation?.(); event?.stopImmediatePropagation?.();
  if(action==='language'){ closeHomeMenu(); return window.LeshenghuoI18n?.openPicker?.(); }
  if(action==='drafts'){ closeHomeMenu(); return window.openComposeDrafts?.(); }
  if(action==='creator'){ closeHomeMenu(); return openHomeCreatorCenter(); }
  if(action==='friends'){ closeHomeMenu(); return openHomeFriendSearch(); }
  if(action==='history'){ closeHomeMenu(); return openUnifiedBrowsingHistory(); }
  if(action==='orders'){ closeHomeMenu(); return openMerchantOrderHistory(); }
  if(action==='cart'){ closeHomeMenu(); return openHomeCart(); }
  if(action==='wallet'){ closeHomeMenu(); return openHomeWallet(); }
  if(action==='community'){ closeHomeMenu(); return openHomeCommunity(); }
  if(action==='security'){ closeHomeMenu(); return openHomeFeatureFromSettings(openHomeSecuritySettings); }
  if(action==='general'){ closeHomeMenu(); return openHomeFeatureFromSettings(openHomeGeneralSettings); }
  if(action==='notifications'){ closeHomeMenu(); return openHomeFeatureFromSettings(openHomeNotificationSettings); }
  if(action==='privacy'){ closeHomeMenu(); return openHomeFeatureFromSettings(openHomePrivacySettings); }
  if(action==='address'){ closeHomeMenu(); return openHomeFeatureFromSettings(openHomeAddresses); }
  if(action==='switchAccount'){
    closeHomeMenu();
    if(typeof switchAccount==='function') return switchAccount();
    if(typeof window.switchAccount==='function') return window.switchAccount();
    return window.openLogin?.();
  }
  if(action==='preferences'){ closeHomeMenu(); return openHomeFeatureFromSettings(openHomePreferences); }
  if(action==='cache'){ closeHomeMenu(); return openHomeFeatureFromSettings(openHomeStorageSpace); }
  if(action==='scan'){ closeHomeMenu(); return openHomeScanner(); }
  if(action==='help'){ closeHomeMenu(); return openHomeHelp(); }
  showToast('该功能正在逐步开放');
};

const appFixedLayout = window.LeshenghuoAppFixedLayout?.create({ isEmbedded:isEmbeddedAppEntry });
function updateFixedTopLayout(){ return appFixedLayout?.update(); }
appFixedLayout?.bind();

/* ---------- App 下拉刷新：仅在各页面顶部触发 ---------- */
async function refreshActiveAppPage(){
  const tab = currentTab || 'home';
  if(tab === 'home'){
    await loadPostsFromSupabase({force:true});
    await loadEngagement();
  } else if(tab === 'week'){
    await loadPostsFromSupabase({force:true});
    renderWeekFeed();
  } else if(tab === 'deals'){
    await loadDailyPriceCache(true);
    refreshDealsIfNeeded();
    renderDealsPage();
  } else if(tab === 'message'){
    await Promise.all([loadDms(), loadMemberActivityNotifications()]);
    initMessagePage();
  } else if(tab === 'profile'){
    await Promise.all([fetchProfileFromDb(), fetchMerchantProfile()]);
    initProfilePage();
  } else if(tab === 'admin'){
    await checkDealAdmin();
    if(isDealAdmin) await loadAdminCenter(true);
    else renderAdminPanel();
  }
}
const appPullRefresh = window.LeshenghuoAppPullRefresh?.create({ isEnabled:isEmbeddedAppEntry, refresh:refreshActiveAppPage });
function pullRefreshIndicator(state='hidden', label='下拉刷新'){ return appPullRefresh?.indicator(state, label); }
function initAppPullToRefresh(){ return appPullRefresh?.bind(); }
initAppPullToRefresh();

/* ---------- 原生 App 内独立模块导航 ---------- */
const appModuleRouter = window.LeshenghuoAppModuleRouter?.create({
  isEmbedded: isEmbeddedAppEntry,
  getAppVersion: () => APP_VERSION,
  onRootRoute: (detail, controls) => {
  controls.close();
  if(['home','profile','week','deals','message'].includes(detail.route)){
    return appNavigation?.navigate({ type:'tab', tab:detail.route });
  }
  if(detail.route === 'post'){
    return appNavigation?.navigate({ type:'post', id:detail.id });
  }
  if(detail.route === 'user'){
    return appNavigation?.navigate({ type:'user', userId:detail.id, name:detail.name || '' });
  }
  }
});
function closeInternalModule(){ return appModuleRouter?.close(); }
function openInternalModule(path, moduleVersion, params={}){ return appModuleRouter?.open(path, moduleVersion, params); }
window.closeInternalModule = closeInternalModule;

function clearTransientLayersForBottomNavigation(){
  closeShareSheet();
  closeCommentComposer();
  closeContentReport();
  closeOwnerSheet();
  closeHomeMenu();
  document.documentElement.classList.remove('reply-composer-open');
  document.body.classList.remove('reply-composer-open','home-menu-open');
  if(document.getElementById('postOverlay')?.classList.contains('open')) closePost();
}
function setBottomNavActive(tab){
  document.querySelectorAll('.bottom-nav .nav-btn').forEach(button => {
    const active = button.dataset.tab === tab;
    button.classList.toggle('active', active);
    if(active) button.setAttribute('aria-current','page');
    else button.removeAttribute('aria-current');
  });
}
window.activateBottomTab=function(tab,event){
  event?.preventDefault?.();
  event?.stopPropagation?.();
  return appNavigation?.navigate({ type:'tab', tab }) || window.switchTab(tab);
};

// Root-page renderer. Route history is owned exclusively by appNavigation.
window.switchTab = function(tab){
  if(!appNavigation?.isRestoring()) appNavigation?.enter({ type:'tab', tab });
  clearStaleAppScrollLocks();
  clearTransientLayersForBottomNavigation();
  closeInternalModule();
  currentTab = tab;
  setBottomNavActive(tab);
  if(tab === 'message'){
    openInternalModule('/messages/', '5.589');
    return;
  }
  if(tab === 'week'){
    openInternalModule('/week/', '5.589');
    return;
  }
  if(tab === 'deals'){
    openInternalModule('/deals/', '5.589');
    return;
  }
  ensureAdminPageAtRoot();
  // 隐藏所有页面（同时清除内联样式）
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    p.style.display = 'none';
  });
  // 显示选定页面（关键：直接设置 display，覆盖内联 display:none）
  const page = document.getElementById(`page-${tab}`);
  if(page){
    page.classList.add('active');
    page.style.display = 'block';
  }
  // 4.13：非首页不再保留空 header 占位，避免页面顶部出现整块空白
  const topHeader = document.querySelector('header.top');
  if(topHeader) topHeader.classList.toggle('is-hidden', tab !== 'home');

  // 2.93：顶部brand区（logo/slogan/搜索/发布/分类chip）仅主页显示
  const topWrap = document.querySelector('header.top .top-wrap');
  if(topWrap) topWrap.style.display = (tab === 'home') ? '' : 'none';
  // 4.13：绿色quick-bar只在首页显示，避免省钱/消息/本周页顶部留白过大
  const quickBar = document.querySelector('header.top .quick-bar');
  if(quickBar) quickBar.style.display = (tab === 'home') ? '' : 'none';
  if(tab === 'home'){
    const feed = document.getElementById('feed');
    const home = document.getElementById('page-home');
    if(home){ home.style.marginTop = '0'; home.style.paddingTop = '0px'; }
    if(feed){ feed.style.paddingTop = '0'; }
    requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:'auto'}));
  }
  updateFixedTopLayout();
  
  // 根据标签页处理逻辑（首页/导航栏不区分商家与普通用户，两者完全一致）
  if(tab === 'home'){
    console.log('🏠 主页已切换，加载最新数据...');
    loadPostsFromSupabase();
  } else if(tab === 'week'){
    console.log('📅 周末活动已切换');
    renderWeekFeed();
  } else if(tab === 'deals'){
    console.log('💰 省钱页已切换');
    renderDealsPage();
  } else if(tab === 'message'){
    console.log('💬 消息页已切换');
    initMessagePage();
  } else if(tab === 'profile'){
    console.log('👤 个人资料页面已切换，初始化页面...');
    updateProfileDisplay();
    initProfilePage();
  } else if(tab === 'admin'){
    console.log('🛠 管理后台已切换');
    if(!(session && session.user)){
      renderAdminPanel();
    } else {
      renderAdminStatus('正在检查管理员权限…');
      checkDealAdmin()
        .then(ok => {
          updateDealReviewButton();
          if(ok) loadAdminCenter(true);
          else renderAdminPanel();
        })
        .catch(e => {
          console.warn('管理员权限检查失败:', e.message);
          isDealAdmin = false;
          updateDealReviewButton();
          renderAdminStatus('管理后台暂时无法打开。', friendlyDealReviewError(e.message));
        });
    }
  }
  setTimeout(updateFixedTopLayout, 80);
};

/* init */
async function bootApp(){
  const startedAt = Date.now();
  const minSplashMs = 850;
  syncVisibleAppVersion();
  const embeddedAppEntry = isEmbeddedAppEntry();
  updateNetworkOfflineOverlay();

  // A cached page can still open without a connection. Show the dedicated
  // offline screen instead of attempting remote startup work in that state.
  if(navigator.onLine === false){
    hideLaunchScreen();
    return;
  }

  // Show the last verified feed immediately. Version checks and fresh network data
  // continue in the background so cached App starts never wait on the network.
  const hasCachedPosts = loadPosts();
  if(hasCachedPosts){
    feedIsLoading = false;
    feedLoadFailed = false;
    renderChips();
    renderQuicklinks();
    renderFeed();
    updateFixedTopLayout();
  }

  try {
    const updating = await checkRemoteAppVersion();
    if(updating) return;
    clearOldVersionCache();
    setLaunchStatus('正在检查登录状态…');
    if(!hasCachedPosts){
      posts = [];
      feedIsLoading = true;
    } else {
      feedIsLoading = false;
    }
    loadUserProfile(); // 先显示本地资料占位
    await loadSession(); // 登录令牌确认后再读取需要身份的资料
    fetchIpLocation(); // 获取真实IP属地
    setTimeout(() => { if(session) Promise.all([loadDms(), loadMemberActivityNotifications(), loadModerationNotices(true)]).then(updateNavMsgDot); }, 3000); // 消息未读红点
    await handleEmailConfirmRedirect(); // 处理邮箱验证回跳，自动登录

    renderChips();
    renderQuicklinks();
    renderFeed();

    setLaunchStatus('正在加载附近的新鲜事…');
    // 首屏不等待网络。已有本机内容会立即显示，云端内容在后台补齐，弱网不会把启动页卡住。
    loadPostsFromSupabase();
    updateFixedTopLayout();
    const merchantOrderRoute = routeMerchantOrderFromLocation();
    const merchantRouteSlug = routeMerchantSlugFromLocation();
    const postRouteId = routePostIdFromLocation();
    const userRouteId = routeUserIdFromLocation();
    if(merchantOrderRoute) setTimeout(() => openMerchantOrderByRoute(merchantOrderRoute), 120);
    else if(postRouteId != null) setTimeout(() => openPost(postRouteId), 120);
    else if(merchantRouteSlug) setTimeout(() => openMerchantPublicPageBySlug(merchantRouteSlug), 120);
    else if(userRouteId) setTimeout(() => openUserPublicPage(userRouteId), 120);
    else if(routeTabFromLocation()) setTimeout(() => switchTab(routeTabFromLocation()), 0);

    setLaunchStatus('内容很快就到…');
    notifyAppReady();
  } catch(e){
    console.warn('启动流程出现异常，继续进入页面:', e.message);
    renderChips();
    renderQuicklinks();
    renderFeed();
    updateFixedTopLayout();
    const merchantOrderRoute = routeMerchantOrderFromLocation();
    const merchantRouteSlug = routeMerchantSlugFromLocation();
    const postRouteId = routePostIdFromLocation();
    const userRouteId = routeUserIdFromLocation();
    if(merchantOrderRoute) setTimeout(() => openMerchantOrderByRoute(merchantOrderRoute), 120);
    else if(postRouteId != null) setTimeout(() => openPost(postRouteId), 120);
    else if(merchantRouteSlug) setTimeout(() => openMerchantPublicPageBySlug(merchantRouteSlug), 120);
    else if(userRouteId) setTimeout(() => openUserPublicPage(userRouteId), 120);
    else if(routeTabFromLocation()) setTimeout(() => switchTab(routeTabFromLocation()), 0);
    notifyAppReady();
  } finally {
    const elapsed = Date.now() - startedAt;
    if(elapsed < minSplashMs){
      await new Promise(resolve => setTimeout(resolve, minSplashMs - elapsed));
    }
    hideLaunchScreen();
    if(!routeMerchantOrderFromLocation() && !routeMerchantSlugFromLocation() && routePostIdFromLocation() == null && !routeUserIdFromLocation()){
      setTimeout(maybeOpenFeedOnboarding, 500);
    }
  }
}

/* v5.280：后厨单、饮品标签与顾客账单打印预览。 */
window._merchantPrintPreviewState = null;
function closeMerchantPrintPreview(){document.body.classList.remove('printing-merchant-ticket');document.getElementById('merchantPrintPreview')?.classList.remove('open');}
function merchantPrintTime(value){const d=value?new Date(value):new Date();return d.toLocaleString('zh-CN',{hour12:false,month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'});}
async function merchantPrintContext(orderId,itemId){
  const state=merchantOrderState();let merchant=state.merchant,order=(state.orders||[]).find(row=>String(row.id)===String(orderId)),items=(state.items||[]).filter(row=>String(row.order_id)===String(orderId));
  if(!order) order=await restaurantDataApi.getOrder({orderId});
  if(!order)throw new Error('order_not_found');
  if(!merchant||String(merchant.user_id)!==String(order.merchant_user_id))merchant=await getMerchantOrderMerchant(order.merchant_user_id);
  if(!items.length) items=await restaurantDataApi.listOrderItems({orderIds:[orderId]});
  const item=itemId?items.find(row=>Number(row.id)===Number(itemId)):null;return {merchant,order,items,item};
}
function merchantKitchenTicketHtml(ctx){const {merchant,order,items}=ctx;return `<div class="merchant-print-paper ticket"><div class="print-title">后 厨 制 作 单</div><div class="print-subtitle">${escHtml(merchant?.business_name||'乐生活商家')}</div><div class="print-meta"><span>${escHtml(order.table_name||'到店订单')}</span><b>${escHtml(order.order_code||'')}</b></div><div class="print-meta"><span>${escHtml(order.user_name||'顾客')}</span><span>${merchantPrintTime(order.created_at)}</span></div><div class="print-lines">${items.filter(item=>!item.is_served).map(item=>`<div class="print-line"><span><b>${escHtml(item.product_name)}</b> × ${Number(item.quantity||0)}${item.batch_no>1?' · 加菜':''}</span><span>${item.kitchen_done?'已完成':'待制作'}</span></div>`).join('')||'<div class="print-line"><span>该订单菜品均已上桌</span></div>'}</div>${order.note?`<div style="margin-top:12px;font-size:13px;"><b>备注：</b>${escHtml(order.note)}</div>`:''}<div class="print-foot">请按菜品完成制作后交由传菜上桌<br>${merchantPrintTime()}</div></div>`;}
function merchantDrinkLabelHtml(ctx){const {merchant,order,item}=ctx;if(!item)return '<div class="deals-empty-panel">未找到需要打印的商品。</div>';const copies=Math.min(Math.max(Number(item.quantity||1),1),12);return Array.from({length:copies},(_,index)=>`<div class="merchant-print-label"><div><b>${escHtml(item.product_name)}</b><div class="label-meta">${escHtml(merchant?.business_name||'乐生活商家')}<br>${escHtml(order.table_name||'到店订单')} · ${escHtml(order.order_code||'')}<br>${item.batch_no>1?'加菜 · ':''}${merchantPrintTime(order.created_at)} · ${index+1}/${copies}</div>${order.note?`<div class="label-meta" style="margin-top:5px;">备注：${escHtml(order.note)}</div>`:''}</div><div class="label-qty">${index+1}/${copies}</div></div>`).join('');}
function merchantCustomerBillHtml(ctx,bill){const {merchant,order,items}=ctx;const subtotal=Number(bill?.subtotal??order.subtotal??0),discount=Number(bill?.discount_amount??0),tip=Number(bill?.tip_amount??0),total=Number(bill?.total_amount??(subtotal-discount+tip));return `<div class="merchant-print-paper ticket"><div class="print-title">消 费 账 单</div><div class="print-subtitle">${escHtml(merchant?.business_name||'乐生活商家')}</div><div class="print-meta"><span>${escHtml(order.table_name||'到店消费')}</span><b>${escHtml(order.order_code||'')}</b></div><div class="print-meta"><span>${merchantPrintTime(order.created_at)}</span><span>${bill?.payment_method==='cash'?'现金':bill?.payment_method==='card'?'刷卡':bill?.payment_method==='online'?'在线支付':'待结算'}</span></div><div class="print-lines">${items.map(item=>`<div class="print-line"><span>${escHtml(item.product_name)} × ${Number(item.quantity||0)}</span><span>${merchantOrderMoney(Number(item.unit_price||0)*Number(item.quantity||0))}</span></div>`).join('')}<div class="print-line"><span>菜品小计</span><b>${merchantOrderMoney(subtotal)}</b></div>${discount?`<div class="print-line"><span>优惠</span><span>-${merchantOrderMoney(discount)}</span></div>`:''}${tip?`<div class="print-line"><span>小费</span><span>${merchantOrderMoney(tip)}</span></div>`:''}<div class="print-line" style="font-size:16px;"><b>应付合计</b><b>${merchantOrderMoney(total)}</b></div></div><div class="print-foot">感谢光临，欢迎再次到店<br>${merchantPrintTime(bill?.created_at||Date.now())}</div></div>`;}
async function openMerchantPrintPreview(type,orderId,itemId){
  const sheet=document.getElementById('merchantPrintPreview'),body=document.getElementById('merchantPrintPreviewBody'),title=document.getElementById('merchantPrintPreviewTitle');if(!sheet||!body)return;sheet.classList.add('open');body.innerHTML='<div class="deals-empty-panel">正在生成打印内容...</div>';
  try{const ctx=await merchantPrintContext(orderId,itemId);let bill=null;if(type==='bill') bill=await restaurantDataApi.getBillByOrder({orderId});const labels={kitchen:'后厨单预览',label:'饮品标签预览',bill:'顾客账单预览'},content=type==='label'?merchantDrinkLabelHtml(ctx):type==='bill'?merchantCustomerBillHtml(ctx,bill):merchantKitchenTicketHtml(ctx);title.textContent=labels[type]||'打印预览';window._merchantPrintPreviewState={type,orderId,itemId};body.innerHTML=`${content}<div class="merchant-print-actions"><button onclick="closeMerchantPrintPreview()">返回</button><button class="primary" onclick="printMerchantPreview()">调用系统打印</button></div>`;}catch(error){console.warn('打印预览生成失败:',error.message);body.innerHTML='<div class="deals-empty-panel">打印内容读取失败，请刷新订单后再试。</div>';}
}
function printMerchantPreview(){document.body.classList.add('printing-merchant-ticket');const finish=()=>document.body.classList.remove('printing-merchant-ticket');window.addEventListener('afterprint',finish,{once:true});setTimeout(finish,1500);window.print();}
async function renderMerchantKitchenDisplay(silent){
  const sheet=document.getElementById('merchantKitchenDisplay'),body=document.getElementById('merchantKitchenDisplayBody'),merchantUserId=sheet?.dataset.merchantUserId||merchantOrderManagerMerchantId();if(!body||!merchantUserId)return;if(!silent)body.innerHTML='<div class="deals-empty-panel">正在同步后厨订单...</div>';
  try{const [merchant,orders]=await Promise.all([getMerchantOrderMerchant(merchantUserId),restaurantDataApi.listOrders({merchantUserId,statuses:['pending','confirmed','preparing','reminded','served'],limit:120,order:'updated_at.asc'})]);const ids=orders.map(row=>row.id).filter(Boolean);const items=ids.length?await restaurantDataApi.listOrderItems({orderIds:ids,order:'created_at.asc'}):[];
    const groups={};items.filter(item=>!item.is_served).forEach(item=>{const order=orders.find(row=>String(row.id)===String(item.order_id));if(!order)return;const category=merchantKitchenGroupName(item,merchant);(groups[category]||(groups[category]=[])).push({item,order});});
    const html=Object.keys(groups).sort().map(category=>`<section style="margin:0 0 18px;"><div style="position:sticky;top:0;background:var(--bg);padding:8px 0 7px;display:flex;justify-content:space-between;align-items:center;"><b style="font-size:16px;">${escHtml(category)}</b><span style="font-size:12px;color:var(--ink-faint);">${groups[category].filter(row=>!row.item.kitchen_done).length} 道待制作</span></div><div style="display:grid;gap:9px;">${groups[category].sort((a,b)=>new Date(a.item.created_at||0)-new Date(b.item.created_at||0)).map(({item,order})=>`<div class="merchant-order-card" style="margin:0;border-left:4px solid ${item.kitchen_done?'var(--sage)':'#d85151'};"><div style="display:flex;justify-content:space-between;gap:10px;"><div><b style="font-size:16px;">${escHtml(item.product_name)} × ${Number(item.quantity||0)}</b><span style="display:block;margin-top:4px;font-size:12px;color:var(--ink-soft);">${escHtml(order.table_name||'餐桌')} · ${escHtml(order.order_code||'')} ${item.batch_no>1?'· 新加菜':''}</span></div><span style="font-size:12px;font-weight:900;padding:4px 7px;border-radius:7px;background:${item.kitchen_done?'var(--sage-light)':'#fff0f0'};color:${item.kitchen_done?'var(--sage-dark)':'#c64040'};">${item.kitchen_done?'已完成制作':'待制作'}</span></div><div style="display:flex;gap:7px;flex-wrap:wrap;margin-top:10px;"><button onclick="openMerchantPrintPreview('kitchen','${String(order.id).replace(/'/g,'')}')" style="border:1px solid var(--line);border-radius:9px;padding:8px 10px;background:#fff;font:900 12px inherit;">后厨单</button>${item.kitchen_done?`<button style="border:0;border-radius:9px;padding:8px 11px;background:var(--sage);color:#fff;font:900 12px inherit;">已完成</button><button onclick="setMerchantOrderItemKitchenDone(${Number(item.id)},false)" style="border:1px solid var(--line);border-radius:9px;padding:8px 11px;background:#fff;font:900 12px inherit;">取消完成</button>`:`<button onclick="setMerchantOrderItemKitchenDone(${Number(item.id)},true)" style="border:0;border-radius:9px;padding:8px 11px;background:#d85151;color:#fff;font:900 12px inherit;">完成制作</button>`}</div></div>`).join('')}</div></section>`).join('');body.innerHTML=`<div class="order-notice">${escHtml(merchant?.business_name||'商家')} · 每 8 秒自动同步。红色项目为待制作；后厨只负责完成制作，上桌由服务员处理。</div>${html||'<div class="deals-empty-panel">当前没有待出菜品。</div>'}`;
  }catch(error){console.warn('后厨订单屏读取失败:',error.message);if(!silent)body.innerHTML='<div class="deals-empty-panel">后厨订单暂时无法同步，请稍后刷新。</div>';}
}
/* Removed overridden merchantOrderCardHtml implementation during v5.510 cleanup. */


// v5.270 final override: member workbench must respect the new per-employee permission model.
function openMerchantMemberManager(merchantUserId){
  if(String(activeMerchantWorkspaceId())!==String(merchantUserId)||!merchantWorkspaceHasPermission('member_manage')){
    showToast('你没有这家商店的会员操作权限');
    return;
  }
  window._activeMerchantMemberManagerId=merchantUserId;
  document.getElementById('merchantMemberManager')?.classList.add('open');
  renderMerchantMemberManager();
  Promise.all([loadMerchantMemberships(merchantUserId,true),loadMerchantMemberTransactions(merchantUserId,true)]).then(renderMerchantMemberManager);
}

/* ---------- v5.285：付款不等待出餐；订单内扫码核销优惠券 ---------- */
window._merchantCouponOrderContext = null;

function openMerchantOrderCheckout(){
  const state = merchantOrderState();
  if(!state.order || !(state.items || []).length){ showToast('正在读取订单，请稍后再试'); return; }
  loadMerchantCouponClaims(true).finally(() => {
    state.checkout = { method:'cash', selectedClaims:[], tip:0, customTipAmount:null };
    document.getElementById('merchantOrderCheckout')?.classList.add('open');
    renderMerchantOrderCheckout();
  });
}

function merchantOrderPaymentLabel(order){
  return order && order.payment_status === 'paid' ? '已收款' : '待收款';
}

/* Removed overridden merchantOrderCardHtml implementation during v5.510 cleanup. */


async function completeMerchantOrderWithBill(orderId,paymentMethod,claimIds,skipConfirm){
  const couponIds=Array.isArray(claimIds)?claimIds:[];
  if(!skipConfirm && !confirm(`确认该订单已使用${paymentMethod==='cash'?'现金':'刷卡'}完成支付？`)) return;
  try {
    const bill=await restaurantOrderApi.completeWithBill({orderId,paymentMethod,couponClaimIds:couponIds});
    const state=merchantOrderState();
    const order=(state.orders||[]).find(row=>String(row.id)===String(orderId))||state.order;
    if(order&&order.user_id) await createMemberActivityNotification({userId:order.user_id,kind:'order_bill',title:'订单已结算',body:`${merchantOperatorWorkspace()?.business_name||'商家'} 已完成你的订单结算，应付 ${merchantOrderMoney(bill.total_amount)}。`});
    window._merchantCouponOrderContext=null;
    closeMerchantCouponRedeem();
    showToast(`已收款，应付 ${merchantOrderMoney(bill.total_amount)}${Number(bill.discount_amount)?`，已优惠 ${merchantOrderMoney(bill.discount_amount)}`:''}`);
    renderMerchantOrderManager(true);
    setTimeout(()=>openMerchantPrintPreview('bill',orderId),180);
  } catch(error){
    const text=String(error.message||'');
    const messages={coupon_not_for_this_order:'这张优惠券不属于本桌顾客。',coupon_limit_one:'本店每单仅可使用一张优惠券。',coupon_invalid_payment_method:'该优惠券不适用于当前支付方式。',coupon_expired:'该优惠券已过期。',coupon_invalid_weekday:'该优惠券今天不可使用。',coupon_invalid_time:'当前不在优惠券的适用时段。',coupon_already_redeemed:'这张优惠券已经核销。'};
    console.warn('订单收款失败:',text);
    showToast(Object.entries(messages).find(([key])=>text.includes(key))?.[1]||'收款失败，请确认订单和优惠券后重试');
  }
}

function openMerchantCashierPayment(orderId,paymentMethod){
  if(confirm(`本次${paymentMethod==='cash'?'现金':'刷卡'}支付是否需要扫描优惠券？`)){
    openMerchantOrderCouponScanner(orderId,paymentMethod);
    return;
  }
  completeMerchantOrderWithBill(orderId,paymentMethod,[]);
}

async function openMerchantOrderCouponScanner(orderId,paymentMethod){
  window._merchantCouponOrderContext={orderId,paymentMethod};
  await openMerchantMemberScanner();
  const status=document.getElementById('merchantScanStatus');
  if(status) status.textContent='请扫描顾客已领取优惠券的二维码；系统会核对本桌顾客、优惠规则并自动计算优惠金额。';
}

async function openMerchantCouponRedeemByCode(code){
  if(!canOperateMerchantWorkspace()||!activeMerchantWorkspaceId()){showToast('请先进入商家工作台');return;}
  const id=Number(String(code||'').toUpperCase().replace(/^LSHC-?/,'').replace(/\D/g,''));
  if(!id){showToast('优惠券二维码无效');return;}
  const sheet=document.getElementById('merchantCouponRedeem'),body=document.getElementById('merchantCouponRedeemBody');
  if(!sheet||!body)return;
  sheet.classList.add('open');body.innerHTML='<div class="deals-empty-panel">正在核对优惠券…</div>';
  try{
    const claimRes=await authedFetch(`${SUPABASE_URL}/rest/v1/merchant_coupon_claims?id=eq.${id}&merchant_user_id=eq.${encodeURIComponent(activeMerchantWorkspaceId())}&select=*&limit=1`,{method:'GET'});
    if(!claimRes.ok)throw new Error(await claimRes.text());
    const claim=(await claimRes.json())[0];
    if(!claim){body.innerHTML='<div class="deals-empty-panel">没有找到本店的这张优惠券。</div>';return;}
    const context=window._merchantCouponOrderContext;
    if(context){
      const orderRes=await authedFetch(`${SUPABASE_URL}/rest/v1/merchant_orders?id=eq.${encodeURIComponent(context.orderId)}&select=*&limit=1`,{method:'GET'});
      if(!orderRes.ok)throw new Error(await orderRes.text());
      const order=(await orderRes.json())[0];
      if(!order){body.innerHTML='<div class="deals-empty-panel">没有找到当前订单。</div>';return;}
      if(String(claim.user_id)!==String(order.user_id)){body.innerHTML='<div class="deals-empty-panel">这张优惠券不属于本桌顾客，不能用于该订单。</div>';return;}
      const snapshot=claim.coupon_snapshot||{};
      body.innerHTML=`<div class="merchant-dash-card" style="box-shadow:none;"><b style="display:block;font-size:17px;">${escHtml(snapshot.title||'优惠券')}</b><p style="line-height:1.7;color:var(--ink-soft);">${escHtml(snapshot.description||'到店优惠')}</p><div class="order-notice">将用于 ${escHtml(order.table_name||'本桌')} · ${escHtml(order.order_code||'')}。最终优惠金额将由系统按有效期、适用日期、时段、支付方式与订单金额重新计算。</div></div>${claim.status==='redeemed'?'<div class="deals-empty-panel">这张优惠券已经核销。</div>':`<button class="merchant-reward-redeem-btn" onclick="completeMerchantOrderWithBill('${String(order.id).replace(/'/g,'')}','${context.paymentMethod}',[${Number(claim.id)}],true)">确认核销并${context.paymentMethod==='cash'?'现金':'刷卡'}收款</button>`}`;
      return;
    }
    const snapshot=claim.coupon_snapshot||{};
    body.innerHTML=`<div class="merchant-dash-card" style="box-shadow:none;"><b>${escHtml(snapshot.title||'优惠券')}</b><p>${escHtml(snapshot.description||'')}</p></div>${claim.status==='redeemed'?'<div class="deals-empty-panel">这张优惠券已经核销。</div>':`<button class="merchant-reward-redeem-btn" onclick="confirmMerchantCouponRedeem(${Number(claim.id)})">确认核销优惠券</button>`}`;
  }catch(error){console.warn('优惠券核对失败:',error.message);body.innerHTML='<div class="deals-empty-panel">优惠券暂时无法核对，请稍后重试。</div>';}
}

/* ---------- v5.288：优惠券领取频率 ---------- */
function toggleMerchantCouponClaimInterval(){
  const wrap=document.getElementById('merchantCouponClaimIntervalWrap');
  if(wrap) wrap.style.display=document.getElementById('merchantCouponClaimMode')?.value==='interval'?'block':'none';
}
function merchantCouponClaimModeText(coupon){
  const mode=String(coupon?.claim_mode||'once');
  if(mode==='unlimited')return '不限次数领取';
  if(mode==='after_redeem')return '核销后可再次领取';
  if(mode==='daily')return '每天可领一次';
  if(mode==='weekly')return '每周可领一次';
  if(mode==='monthly')return '每月可领一次';
  if(mode==='interval')return `每 ${Math.max(1,Number(coupon?.claim_interval_days||7))} 天可领一次`;
  return '每人限领一次';
}
function merchantCouponMayClaimAgain(merchant,coupon,index){
  const mode=String(coupon?.claim_mode||'once');
  const id=merchantCouponId(coupon,index);
  const claims=(window._merchantCouponClaims.rows||[]).filter(row=>String(row.merchant_user_id)===String(merchant?.user_id)&&String(row.coupon_id)===String(id));
  if(mode==='unlimited')return true;
  if(mode==='after_redeem')return !claims.some(row=>row.status==='claimed');
  if(!claims.length)return true;
  const latest=claims.reduce((result,row)=>!result||new Date(row.claimed_at)>new Date(result.claimed_at)?row:result,null);
  const now=new Date();
  const laDate=value=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Los_Angeles',year:'numeric',month:'2-digit',day:'2-digit'}).format(value);
  if(mode==='daily')return laDate(latest.claimed_at)!==laDate(now);
  if(mode==='weekly'){const week=value=>{const local=new Date(new Date(value).toLocaleString('en-US',{timeZone:'America/Los_Angeles'}));local.setHours(0,0,0,0);local.setDate(local.getDate()-((local.getDay()+6)%7));return local.toISOString().slice(0,10);};return week(latest.claimed_at)!==week(now);}
  if(mode==='monthly')return new Intl.DateTimeFormat('en-US',{timeZone:'America/Los_Angeles',year:'numeric',month:'2-digit'}).format(latest.claimed_at)!==new Intl.DateTimeFormat('en-US',{timeZone:'America/Los_Angeles',year:'numeric',month:'2-digit'}).format(now);
  if(mode==='interval')return Date.now()-new Date(latest.claimed_at).getTime()>=Math.max(1,Number(coupon.claim_interval_days||7))*86400000;
  return false;
}
async function claimMerchantCoupon(userId,index){
  if(!isNativeMerchantApp()){openMerchantCouponAppDownload();return;}
  if(!(session&&session.user)){showToast('请先登录后领取优惠券');openAuth();return;}
  const merchant=(currentMerchant&&String(currentMerchant.user_id)===String(userId))?currentMerchant:window._merchantIdentityCache[userId];
  const coupon=merchantCoupons(merchant)[index];
  const eligibility=merchantCouponEligibility(coupon);
  if(!eligibility.eligible){showToast(eligibility.reason);return;}
  try{
    if(!merchantCouponApi) throw new Error('优惠券接口未初始化');
    await merchantCouponApi.claim({ merchantUserId:userId, couponId:merchantCouponId(coupon,index) });
    await loadMerchantCouponClaims(true);
    showToast('已领取，到店出示二维码即可');
    rerenderMerchantSection(merchant);
  }catch(error){
    const text=String(error.message||'');
    const messages={coupon_claim_once_limit:'这张优惠券每人只能领取一次。',coupon_claim_unredeemed_limit:'请先使用或核销当前已领取的优惠券，再领取下一张。',coupon_claim_daily_limit:'今天已经领取过，明天再来吧。',coupon_claim_weekly_limit:'本周已经领取过，下周可再次领取。',coupon_claim_monthly_limit:'本月已经领取过，下月可再次领取。',coupon_claim_interval_limit:'还未到下次可领取时间。',coupon_expired:'该优惠券已过期。'};
    console.warn('领取优惠券失败:',text);
    showToast(Object.entries(messages).find(([key])=>text.includes(key))?.[1]||'领取失败，请稍后重试');
  }
}
function merchantCouponCardHtml(m,c,i,isOwnerPage){
  const claim=couponClaimFor(m,c,i),canClaimAgain=merchantCouponMayClaimAgain(m,c,i),userId=String(m.user_id||'').replace(/'/g,''),eligibility=merchantCouponEligibility(c);
  const primaryLabel=!eligibility.eligible?'当前不可用':canClaimAgain?(claim?'再次领取':'领取优惠券'):(claim&&claim.status==='redeemed'?'已核销':'出示优惠券');
  const primaryClick=canClaimAgain?`claimMerchantCoupon('${userId}',${i})`:'openMerchantCouponWallet()';
  return `<div class="merchant-coupon-card">${c.image?`<div class="merchant-coupon-image"><img src="${escAttr(c.image)}" alt=""></div>`:''}<div class="merchant-coupon-title">${escHtml(c.title||'优惠券')}<span>${eligibility.eligible?escHtml(c.badge||'优惠'):'暂不可用'}</span></div><div class="merchant-coupon-note">${escHtml(c.description||'到店出示使用，具体规则以商家说明为准。')}</div>${c.expires_at?`<div class="merchant-coupon-note">有效期至：${escHtml(c.expires_at)}</div>`:''}<div class="merchant-coupon-note">适用：${escHtml(merchantCouponRuleText(c))} · ${escHtml(merchantCouponClaimModeText(c))}</div>${!eligibility.eligible?`<div class="merchant-coupon-note" style="color:var(--berry);">${escHtml(eligibility.reason)}</div>`:''}<div class="merchant-coupon-actions"><button class="primary" onclick="${primaryClick}" ${eligibility.eligible?'':'disabled style="opacity:.55;"'}>${primaryLabel}</button><button onclick="${claim?'openMerchantCouponWallet()':`copyMerchantSiteLink('${userId}')`}">${claim?'我的优惠券':'分享店铺'}</button></div>${isOwnerPage?`<div class="merchant-owner-actions"><button onclick="openMerchantCouponEditor('${userId}',${i})">编辑</button><button onclick="toggleMerchantCouponActive(${i})">${c.active===false?'启用':'停用'}</button><button class="danger" onclick="deleteMerchantCoupon(${i})">删除</button></div>`:''}</div>`;
}

/* ---------- v5.287：优惠券扫码关联订单；在线支付规则兼容 ---------- */
function merchantCouponEligibility(coupon,paymentMethod){
  if(!coupon || coupon.active===false) return {eligible:false,reason:'该优惠券已停用'};
  if(merchantCouponExpired(coupon)) return {eligible:false,reason:'该优惠券已过有效期'};
  const clock=merchantCouponLaClock();
  const weekdays=Array.isArray(coupon.weekdays)?coupon.weekdays.map(String):[];
  if(weekdays.length&&!weekdays.includes(clock.weekday)) return {eligible:false,reason:'该优惠券不适用于今天'};
  const start=String(coupon.time_start||''),end=String(coupon.time_end||'');
  if(start&&clock.time<start) return {eligible:false,reason:`该优惠券适用时间为 ${start}-${end||'当天结束'}`};
  if(end&&clock.time>end) return {eligible:false,reason:`该优惠券适用时间为 ${start||'当天开始'}-${end}`};
  const methods=Array.isArray(coupon.payment_methods)?coupon.payment_methods.map(String):[];
  const usable=!paymentMethod||!methods.length||methods.includes(String(paymentMethod))||(paymentMethod==='online'&&methods.includes('card'));
  if(!usable){const labels={cash:'现金',card:'刷卡',online:'在线支付'};return {eligible:false,reason:`该优惠券仅适用于${methods.map(method=>labels[method]||method).join('、')}`};}
  return {eligible:true,reason:''};
}
function merchantCouponDiscountDetail(coupon,subtotal,items){
  const amount=Math.max(0,Number(subtotal)||0);
  const rule=coupon&&coupon.pricing_rule&&typeof coupon.pricing_rule==='object'?coupon.pricing_rule:null;
  if(rule){
    const type=String(rule.type||'fixed'),minimum=Math.max(0,Number(rule.min_spend)||0),value=Math.max(0,Number(rule.value)||0);
    const wholeOrder=type==='whole_fixed'||type==='whole_percent';
    if(!wholeOrder&&(!minimum||amount<minimum))return {amount:0,reason:`订单未满 ${merchantOrderMoney(minimum)}`};
    if(type==='fixed'||type==='whole_fixed')return {amount:Math.min(amount,value),reason:''};
    if(type==='percent'||type==='whole_percent')return {amount:Math.min(amount,amount*Math.min(100,value)/100),reason:''};
    if(type==='tiered_fixed')return {amount:Math.min(amount,value*(rule.repeat?Math.max(1,Math.floor(amount/minimum)):1)),reason:''};
    if(type==='gift'){
      const productId=String(rule.gift_product_id||'');let remaining=Math.max(1,Math.floor(Number(rule.gift_quantity)||1)),giftAmount=0;
      (Array.isArray(items)?items:[]).filter(item=>String(item.product_id||item.id||'')===productId).forEach(item=>{const take=Math.min(remaining,Math.max(0,Number(item.quantity)||0));if(take>0){giftAmount+=take*Math.max(0,Number(item.unit_price??item.price)||0);remaining-=take;}});
      return {amount:Math.min(amount,giftAmount),reason:giftAmount?'':'请先将赠品加入订单'};
    }
  }
  // 兼容历史优惠券；新创建的优惠券全部使用上方结构化规则。
  const text=`${coupon&&coupon.description||''} ${coupon&&coupon.title||''}`;
  const minus=text.match(/满[^0-9]*([0-9]+(?:\.\d+)?)[^0-9]*减[^0-9]*([0-9]+(?:\.\d+)?)/);
  if(minus)return {amount:amount>=Number(minus[1])?Math.min(amount,Number(minus[2])):0,reason:''};
  const percent=text.match(/([0-9]+(?:\.\d+)?)\s*折/);
  if(percent&&Number(percent[1])>0&&Number(percent[1])<10)return {amount:amount*(1-Number(percent[1])/10),reason:''};
  const percentOff=text.match(/(?:优惠|立减|折扣|减免)?\s*([0-9]+(?:\.\d+)?)\s*%/);
  return {amount:percentOff&&Number(percentOff[1])>0&&Number(percentOff[1])<=100?amount*Number(percentOff[1])/100:0,reason:''};
}
function merchantCouponDiscountAmount(coupon,subtotal,items){return merchantCouponDiscountDetail(coupon,subtotal,items).amount;}
function closeMerchantCouponRedeem(){window._merchantCouponOrderContext=null;document.getElementById('merchantCouponRedeem')?.classList.remove('open');}
async function payMerchantOrderWithScannedCoupon(orderId,claimId,paymentMethod){
  if(!confirm(`确认使用优惠券并按${paymentMethod==='cash'?'现金':paymentMethod==='card'?'刷卡':'在线支付'}结算该订单？`))return;
  await completeMerchantOrderWithBill(orderId,paymentMethod,[Number(claimId)],true);
}
async function openMerchantCouponRedeemByCode(code){
  if(!canOperateMerchantWorkspace()||!activeMerchantWorkspaceId()){showToast('请先进入商家工作台');return;}
  const id=Number(String(code||'').toUpperCase().replace(/^LSHC-?/,'').replace(/\D/g,''));
  if(!id){showToast('优惠券二维码无效');return;}
  const sheet=document.getElementById('merchantCouponRedeem'),body=document.getElementById('merchantCouponRedeemBody');
  if(!sheet||!body)return;
  sheet.classList.add('open');body.innerHTML='<div class="deals-empty-panel">正在核对优惠券与订单…</div>';
  try{
    const merchantId=activeMerchantWorkspaceId();
    if(!merchantPublicApi)throw new Error('商家资料接口未初始化');
    const [claimRes,merchant]=await Promise.all([
      authedFetch(`${SUPABASE_URL}/rest/v1/merchant_coupon_claims?id=eq.${id}&merchant_user_id=eq.${encodeURIComponent(merchantId)}&select=*&limit=1`,{method:'GET'}),
      merchantPublicApi.getByUserId({userId:merchantId,select:'user_id,coupons',verified:false})
    ]);
    if(!claimRes.ok)throw new Error(await claimRes.text());
    const claim=(await claimRes.json())[0];
    if(!claim){body.innerHTML='<div class="deals-empty-panel">没有找到本店的这张优惠券。</div>';return;}
    const coupon=merchantCouponForClaim(merchant||{},claim);
    const snapshot=claim.coupon_snapshot||{};
    if(claim.status==='redeemed'){body.innerHTML='<div class="deals-empty-panel">这张优惠券已经核销，不能重复使用。</div>';return;}
    const context=window._merchantCouponOrderContext;
    let orders=[];
    if(context&&context.orderId){
      const result=await authedFetch(`${SUPABASE_URL}/rest/v1/merchant_orders?id=eq.${encodeURIComponent(context.orderId)}&select=*&limit=1`,{method:'GET'});
      if(result.ok)orders=await result.json();
    }else{
      const result=await authedFetch(`${SUPABASE_URL}/rest/v1/merchant_orders?merchant_user_id=eq.${encodeURIComponent(merchantId)}&user_id=eq.${encodeURIComponent(claim.user_id)}&payment_status=eq.unpaid&status=not.in.(cancelled,completed)&select=*&order=updated_at.desc&limit=20`,{method:'GET'});
      if(result.ok)orders=await result.json();
    }
    orders=orders.filter(order=>String(order.user_id)===String(claim.user_id)&&order.payment_status!=='paid');
    const orderIds=orders.map(order=>String(order.id)).filter(Boolean);
    let orderItems=[];
    if(orderIds.length){const itemRes=await authedFetch(`${SUPABASE_URL}/rest/v1/merchant_order_items?order_id=in.(${orderIds.map(encodeURIComponent).join(',')})&select=order_id,product_id,quantity,unit_price`,{method:'GET'});if(itemRes.ok)orderItems=await itemRes.json();}
    const title=`<div class="merchant-dash-card" style="box-shadow:none;"><b style="display:block;font-size:17px;">${escHtml(snapshot.title||coupon?.title||'优惠券')}</b><p style="margin:8px 0 0;line-height:1.7;color:var(--ink-soft);">${escHtml(snapshot.description||coupon?.description||'')}</p></div>`;
    if(!coupon){body.innerHTML=`${title}<div class="deals-empty-panel">该优惠券对应的商家规则已被删除或停用，暂时不能用于订单结算。</div>`;return;}
    if(!orders.length){body.innerHTML=`${title}<div class="deals-empty-panel">没有找到这位顾客待收款的订单。请先在点餐后台打开对应餐桌，再扫描优惠券。</div>`;return;}
    const cards=orders.map(order=>{
      const methods=['cash','card','online'].map(method=>{
        const eligibility=merchantCouponEligibility(coupon,method);
        const discount=eligibility.eligible?merchantCouponDiscountAmount(coupon,Number(order.subtotal||0),orderItems.filter(item=>String(item.order_id)===String(order.id))):0;
        const payable=Math.max(0,Number(order.subtotal||0)-discount);
        const label={cash:'现金',card:'刷卡',online:'在线支付'}[method];
        return `<button ${eligibility.eligible?'':'disabled'} onclick="payMerchantOrderWithScannedCoupon('${String(order.id).replace(/'/g,'')}',${Number(claim.id)},'${method}')" style="border:1px solid ${eligibility.eligible?'var(--sage)':'var(--line)'};border-radius:9px;background:${eligibility.eligible?'var(--sage-light)':'#f4f2ec'};color:${eligibility.eligible?'var(--sage-dark)':'var(--ink-faint)'};padding:9px 8px;font:900 12px inherit;">${label}${eligibility.eligible?`<small style="display:block;margin-top:3px;">优惠 -${merchantOrderMoney(discount)}</small><small style="display:block;margin-top:2px;">应收 ${merchantOrderMoney(payable)}</small>`:`<small style="display:block;margin-top:3px;">不可用</small>`}</button>`;
      }).join('');
      return `<div class="merchant-dash-card" style="box-shadow:none;margin-top:12px;"><div style="display:flex;justify-content:space-between;gap:10px;"><b>${escHtml(order.table_name||'餐桌')} · ${escHtml(order.order_code||'')}</b><b>${merchantOrderMoney(order.subtotal)}</b></div><p style="font-size:12px;color:var(--ink-faint);margin:7px 0 10px;">选择支付方式后会立即按优惠后的金额创建账单。</p><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:7px;">${methods}</div></div>`;
    }).join('');
    body.innerHTML=`${title}<div class="order-notice">请选择要使用该券的订单与支付方式。系统会在收款前再次验证规则，并按优惠后的金额生成账单。</div>${cards}`;
  }catch(error){console.warn('优惠券核对失败:',error.message);body.innerHTML='<div class="deals-empty-panel">优惠券暂时无法核对，请稍后重试。</div>';}
}

/* ---------- v5.289：已收款订单完成状态与上桌操作收口 ---------- */
function merchantOrderCardHtml(order,items){
  const allServed=items.length>0&&items.every(item=>item.is_served===true);
  const paid=order.payment_status==='paid';
  const effectivelyCompleted=paid&&allServed;
  const canManage=merchantWorkspaceHasPermission('order_manage');
  const canComplete=merchantWorkspaceHasPermission('order_complete');
  const canBill=merchantWorkspaceHasPermission('bill_view');
  let actions=[];
  if(canManage&&order.status==='pending') actions.push(['confirmed','确认接单']);
  if(canManage&&['confirmed','preparing','reminded'].includes(order.status)&&!allServed) actions.push(['preparing','开始制作']);
  if(canComplete&&!paid&&order.status!=='cancelled') actions.push(['cashier_cash','现金收款'],['cashier_card','刷卡收款'],['coupon_scan','扫码优惠券']);
  const orderId=String(order.id).replace(/'/g,'');
  const actionHtml=actions.map(([key,label],index)=>{
    const click=key==='cashier_cash'?`openMerchantCashierPayment('${orderId}','cash')`:key==='cashier_card'?`openMerchantCashierPayment('${orderId}','card')`:key==='coupon_scan'?`openMerchantOrderCouponScanner('${orderId}','cash')`:`setMerchantOrderStatus('${orderId}','${key}')`;
    return `<button class="${index===0?'primary':''}" onclick="${click}">${label}</button>`;
  }).join('');
  const paymentNote=paid?`<div style="margin-top:9px;color:var(--sage-dark);font-size:12px;font-weight:800;">${uiIcon('check',13)} 已收款${effectivelyCompleted?'，订单已完成':'，菜品仍可继续制作与上桌'}</div>`:`<div style="margin-top:9px;color:var(--ink-faint);font-size:12px;">${uiIcon('wallet',13)} 待收款，可在菜品未上齐时提前结账</div>`;
  const billButton=canBill&&paid?`<button onclick="openMerchantPrintPreview('bill','${orderId}')" style="margin-top:8px;width:100%;border:1px solid var(--line);border-radius:9px;background:#fff;padding:8px;font:900 12px inherit;">打印顾客账单</button>`:'';
  const statusText=effectivelyCompleted?'已完成':merchantOrderStatusText(order.status);
  return `<div class="merchant-order-card"><div class="merchant-order-card-head"><div><b>${escHtml(order.table_name||'餐桌')} · ${escHtml(order.order_code||'')}</b><span>${escHtml(order.user_name||'乐生活用户')} · ${order.created_at?new Date(order.created_at).toLocaleString('zh-CN'):''}${Number(order.addition_count||0)?` · 加菜 ${order.addition_count} 次`:''}</span></div><i class="merchant-order-state">${statusText} · ${merchantOrderPaymentLabel(order)}</i></div><div class="merchant-order-lines">${merchantOrderBatchHtml(items,order)}${order.note?`<div style="margin-top:8px;color:var(--berry-dark);">备注：${escHtml(order.note)}</div>`:''}<div class="merchant-order-line" style="margin-top:9px;padding-top:9px;border-top:1px solid var(--line);font-size:13px;"><b>合计 ${Number(order.item_count||0)} 件</b><b style="color:var(--berry);">${merchantOrderMoney(order.subtotal)}</b></div></div>${paymentNote}${actionHtml?`<div class="merchant-order-card-actions">${actionHtml}</div>`:''}${billButton}</div>`;
}

/* ---------- v5.384：统一 Purchase（餐饮账单 + 租车预约，后续模块可继续注册） ---------- */
window._merchantOrderHistoryBills = [];
window._merchantOrderHistoryRentals = [];
window._merchantOrderHistoryRetail = [];
window._merchantOrderHistoryTickets = [];
window._merchantOrderHistoryAutoLeads = [];
window._merchantOrderHistoryAutoSales = [];
window._purchaseHistoryRecords = [];
window._merchantOrderHistoryDetailId = null;
function merchantBillPaymentText(method){ return ({cash:'现金',card:'刷卡',online:'在线支付'})[method] || '支付'; }
function purchaseRentalPaymentText(status){ return ({paid:'已付款',refunded:'已退款',partial_refund:'部分退款',waived:'免单',pending:'待付款'})[status] || status || '待付款'; }
function purchaseRentalStatusText(status){ return ({pending:'等待商家确认',confirmed:'已确认',active:'租用中',returned:'已归还',overdue:'已逾期',cancelled:'已取消',rejected:'已拒绝'})[status] || status || '预约中'; }
function purchaseRetailStatusText(status){ return ({pending:'待商家确认',confirmed:'已确认',preparing:'商家备货中',ready_for_pickup:'可到店自取',completed:'已完成',cancelled:'已取消'})[status] || status || '处理中'; }
function closeMerchantOrderHistory(){
  if(window._merchantOrderHistoryDetailId != null){
    window._merchantOrderHistoryDetailId = null;
    renderMerchantOrderHistoryList();
    return;
  }
  document.getElementById('merchantOrderHistory')?.classList.remove('open');
}
function renderMerchantOrderHistoryList(){
  const body=document.getElementById('merchantOrderHistoryBody');
  if(!body)return;
  const records=window._purchaseHistoryRecords||[];
  body.innerHTML=records.length?records.map(record=>{
    if(record.kind==='ticket'){
      const order=record.data;
      return `<button onclick="openPurchaseTicketDetail('${String(order.id).replace(/'/g,'')}')" class="merchant-dash-card" style="display:block;width:100%;text-align:left;box-shadow:none;margin-bottom:12px;"><div style="display:flex;justify-content:space-between;gap:12px;"><div style="min-width:0;"><b>${escHtml(order.merchant_name||'乐生活票务')}</b><span style="display:block;margin-top:4px;font-size:12px;color:var(--ink-faint);">票务订单 · ${new Date(order.created_at).toLocaleString('zh-CN')} · ${escHtml(order.order_code||'')}</span></div><b style="color:var(--berry);">${merchantOrderMoney(order.total_amount)}</b></div><div style="margin-top:10px;font-size:12px;color:var(--ink-soft);">${escHtml(order.event_title||'活动门票')} × ${Number(order.quantity||0)}<span style="float:right;color:var(--sage-dark);font-weight:900;">${escHtml(order.payment_status==='paid'||order.payment_status==='free'?'已出票':'待付款')} ›</span></div></button>`;
    }
    if(record.kind==='auto_lead'||record.kind==='auto_sale'){
      const item=record.data,isSale=record.kind==='auto_sale';
      return `<button onclick="openPurchaseAutoDetail('${record.kind}','${String(item.id).replace(/'/g,'')}')" class="merchant-dash-card" style="display:block;width:100%;text-align:left;box-shadow:none;margin-bottom:12px;"><div style="display:flex;justify-content:space-between;gap:12px;"><div style="min-width:0;"><b>${escHtml(item.merchant_name||'乐生活二手车')}</b><span style="display:block;margin-top:4px;font-size:12px;color:var(--ink-faint);">${isSale?'车辆成交':'估价 / 试驾'} · ${new Date(item.created_at).toLocaleString('zh-CN')}</span></div>${isSale?`<b style="color:var(--berry);">${merchantOrderMoney(item.sale_amount)}</b>`:''}</div><div style="margin-top:10px;font-size:12px;color:var(--ink-soft);">${escHtml(item.listing_title||item.vehicle_data?.title||item.vehicle_data?.make||'车辆记录')}<span style="float:right;color:var(--sage-dark);font-weight:900;">${escHtml(item.status||'处理中')} ›</span></div></button>`;
    }
    if(record.kind==='rental'){
      const booking=record.data,merchant=booking.merchant||window._merchantIdentityCache[booking.merchant_user_id]||{},vehicle=booking.vehicle||{};
      return `<button onclick="openPurchaseRentalDetail('${String(booking.id).replace(/'/g,'')}')" class="merchant-dash-card" style="display:block;width:100%;text-align:left;box-shadow:none;margin-bottom:12px;"><div style="display:flex;justify-content:space-between;gap:12px;"><div style="min-width:0;"><b>${escHtml(merchant.business_name||'乐生活租车')}</b><span style="display:block;margin-top:4px;font-size:12px;color:var(--ink-faint);">租车预约 · ${new Date(booking.created_at).toLocaleString('zh-CN')} · ${escHtml(purchaseRentalPaymentText(booking.payment_status))}</span></div><b style="color:var(--berry);">${merchantOrderMoney(booking.total_amount)}</b></div><div style="margin-top:10px;font-size:12px;color:var(--ink-soft);">${escHtml(vehicle.name||'租赁车辆')} · ${escHtml(booking.booking_code||'')}<span style="float:right;color:var(--sage-dark);font-weight:900;">${escHtml(purchaseRentalStatusText(booking.status))} ›</span></div></button>`;
    }
    if(record.kind==='retail'){
      const order=record.data,merchant=window._merchantIdentityCache[order.merchant_user_id]||{};
      const names=(Array.isArray(order.items)?order.items:[]).slice(0,2).map(item=>`${item.name||'商品'} ×${Number(item.quantity||0)}`).join('、');
      return `<button onclick="openPurchaseRetailDetail('${String(order.id).replace(/'/g,'')}')" class="merchant-dash-card" style="display:block;width:100%;text-align:left;box-shadow:none;margin-bottom:12px;"><div style="display:flex;justify-content:space-between;gap:12px;"><div style="min-width:0;"><b>${escHtml(merchant.business_name||'乐生活商店')}</b><span style="display:block;margin-top:4px;font-size:12px;color:var(--ink-faint);">自取订单 · ${new Date(order.created_at).toLocaleString('zh-CN')} · ${escHtml(order.order_code||'')}</span></div><b style="color:var(--berry);">${merchantOrderMoney(order.subtotal)}</b></div><div style="margin-top:10px;font-size:12px;color:var(--ink-soft);">${escHtml(names||'商品明细')}<span style="float:right;color:var(--sage-dark);font-weight:900;">${escHtml(purchaseRetailStatusText(order.status))} ›</span></div></button>`;
    }
    const bill=record.data,merchant=window._merchantIdentityCache[bill.merchant_user_id]||{};
    return `<button onclick="openMerchantOrderBillDetail('${String(bill.id).replace(/'/g,'')}')" class="merchant-dash-card" style="display:block;width:100%;text-align:left;box-shadow:none;margin-bottom:12px;"><div style="display:flex;justify-content:space-between;gap:12px;"><div><b>${escHtml(merchant.business_name||'乐生活商家')}</b><span style="display:block;margin-top:4px;font-size:12px;color:var(--ink-faint);">餐饮消费 · ${new Date(bill.created_at).toLocaleString('zh-CN')} · ${merchantBillPaymentText(bill.payment_method)}</span></div><b style="color:var(--berry);">${merchantOrderMoney(bill.total_amount)}</b></div><div style="margin-top:10px;font-size:12px;color:var(--ink-soft);">菜品 ${merchantOrderMoney(bill.subtotal)}${Number(bill.discount_amount)?` · 优惠 -${merchantOrderMoney(bill.discount_amount)}`:''}${Number(bill.tip_amount)?` · 小费 ${merchantOrderMoney(bill.tip_amount)}`:''}<span style="float:right;color:var(--sage-dark);font-weight:900;">查看明细 ›</span></div></button>`;
  }).join(''):'<div class="deals-empty-panel">还没有消费记录。</div>';
}
async function openMerchantOrderHistory(){
  if(!(session&&session.user)){openAuth();return;}
  const sheet=document.getElementById('merchantOrderHistory'),body=document.getElementById('merchantOrderHistoryBody');
  if(!sheet||!body)return;
  sheet.classList.add('open');body.innerHTML='<div class="deals-empty-panel">正在读取消费记录...</div>';
  try{
    const [billResult,rentalResult,retailResult,centerResult]=await Promise.allSettled([
      restaurantDataApi.listBills({userId:session.user.id,limit:200}),
      rentalApi.customerBookings(),
      authedFetch(`${SUPABASE_URL}/rest/v1/merchant_retail_orders?customer_user_id=eq.${encodeURIComponent(session.user.id)}&select=*&order=updated_at.desc&limit=200`,{method:'GET'}).then(async response=>{if(!response.ok)throw new Error(await response.text());return response.json();}),
      authedFetch(`${SUPABASE_URL}/rest/v1/rpc/customer_order_center`,{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'}).then(async response=>{if(!response.ok)throw new Error(await response.text());return response.json();})
    ]);
    if(billResult.status!=='fulfilled')throw new Error(billResult.reason?.message);
    const bills=billResult.value;
    let rentalBookings=[];
    if(rentalResult.status==='fulfilled') rentalBookings=Array.isArray(rentalResult.value)?rentalResult.value:[];
    let retailOrders=[];
    if(retailResult.status==='fulfilled') retailOrders=Array.isArray(retailResult.value)?retailResult.value:[];
    const center=centerResult.status==='fulfilled'&&centerResult.value&&typeof centerResult.value==='object'?centerResult.value:{};
    const tickets=Array.isArray(center.tickets)?center.tickets:[],autoLeads=Array.isArray(center.auto_leads)?center.auto_leads:[],autoSales=Array.isArray(center.auto_sales)?center.auto_sales:[];
    const merchantIds=[...new Set(bills.map(b=>b.merchant_user_id).concat(rentalBookings.map(row=>row.merchant_user_id),retailOrders.map(row=>row.merchant_user_id),tickets.map(row=>row.merchant_user_id),autoLeads.map(row=>row.merchant_user_id),autoSales.map(row=>row.merchant_user_id)).filter(Boolean))];
    if(merchantIds.length){
      if(!merchantPublicApi) throw new Error('商家资料接口未初始化');
      (await merchantPublicApi.listByUserIds({userIds:merchantIds,select:'user_id,business_name,logo'})).forEach(row=>setMerchantIdentityCache(row.user_id,row));
    }
    rentalBookings.forEach(row=>{if(row.merchant?.user_id)setMerchantIdentityCache(row.merchant.user_id,row.merchant);});
    window._merchantOrderHistoryBills=bills;window._merchantOrderHistoryRentals=rentalBookings;window._merchantOrderHistoryRetail=retailOrders;window._merchantOrderHistoryTickets=tickets;window._merchantOrderHistoryAutoLeads=autoLeads;window._merchantOrderHistoryAutoSales=autoSales;
    window._purchaseHistoryRecords=[...bills.map(data=>({kind:'restaurant',data,created_at:data.created_at})),...rentalBookings.map(data=>({kind:'rental',data,created_at:data.created_at})),...retailOrders.map(data=>({kind:'retail',data,created_at:data.created_at})),...tickets.map(data=>({kind:'ticket',data,created_at:data.created_at})),...autoLeads.map(data=>({kind:'auto_lead',data,created_at:data.created_at})),...autoSales.map(data=>({kind:'auto_sale',data,created_at:data.created_at}))].sort((a,b)=>new Date(b.created_at||0)-new Date(a.created_at||0));
    window._merchantOrderHistoryDetailId=null;renderMerchantOrderHistoryList();
  }catch(error){console.warn('读取消费记录失败:',error.message);body.innerHTML='<div class="deals-empty-panel">消费记录暂时无法读取，请稍后重试。</div>';}
}
function openPurchaseRentalDetail(bookingId){
  const body=document.getElementById('merchantOrderHistoryBody');
  const booking=(window._merchantOrderHistoryRentals||[]).find(row=>String(row.id)===String(bookingId));
  if(!body||!booking)return;
  window._merchantOrderHistoryDetailId=`rental:${bookingId}`;
  const merchant=booking.merchant||window._merchantIdentityCache[booking.merchant_user_id]||{},vehicle=booking.vehicle||{},addons=Array.isArray(booking.rental_addons)?booking.rental_addons:[];
  body.innerHTML=`<button onclick="closeMerchantOrderHistory()" style="border:0;background:transparent;color:var(--sage-dark);padding:2px 0 14px;font:900 13px inherit;">‹ 返回消费记录</button><section class="merchant-dash-card" style="box-shadow:none;"><b style="font-size:18px;">${escHtml(merchant.business_name||'乐生活租车')}</b><div style="margin-top:7px;font-size:12px;color:var(--ink-faint);">租车预约 · ${new Date(booking.created_at).toLocaleString('zh-CN')} · ${escHtml(booking.booking_code||'')}</div><div style="margin-top:14px;border-top:1px solid var(--line);padding-top:8px;"><div class="merchant-order-line" style="margin:8px 0;"><span>${escHtml(vehicle.name||'租赁车辆')}</span><b>${merchantOrderMoney(booking.base_amount)}</b></div>${addons.map(item=>`<div class="merchant-order-line" style="margin:8px 0;"><span>${escHtml(item.name||'附加服务')}</span><b>${merchantOrderMoney(item.amount??item.price)}</b></div>`).join('')}<div class="merchant-order-line" style="margin:8px 0;"><span>租期</span><span>${new Date(booking.starts_at).toLocaleString('zh-CN')} 至 ${new Date(booking.ends_at).toLocaleString('zh-CN')}</span></div></div><div style="margin-top:13px;padding-top:10px;border-top:1px solid var(--line);"><div class="merchant-order-line"><span>会员/优惠券减免</span><b style="color:var(--berry);">-${merchantOrderMoney(Number(booking.member_discount_amount||0)+Number(booking.coupon_discount_amount||0))}</b></div><div class="merchant-order-line" style="margin-top:8px;"><span>押金</span><b>${merchantOrderMoney(booking.deposit_amount)}</b></div><div class="merchant-order-line" style="margin-top:8px;"><span>支付状态</span><b>${escHtml(purchaseRentalPaymentText(booking.payment_status))}</b></div><div class="merchant-order-line" style="margin-top:11px;font-size:16px;"><b>预约总额</b><b style="color:var(--berry);">${merchantOrderMoney(booking.total_amount)}</b></div></div></section>`;
}
function openPurchaseTicketDetail(orderId){
  const body=document.getElementById('merchantOrderHistoryBody'),order=(window._merchantOrderHistoryTickets||[]).find(row=>String(row.id)===String(orderId));
  if(!body||!order)return;
  window._merchantOrderHistoryDetailId=`ticket:${orderId}`;
  const tickets=Array.isArray(order.tickets)?order.tickets:[];
  body.innerHTML=`<button onclick="closeMerchantOrderHistory()" style="border:0;background:transparent;color:var(--sage-dark);padding:2px 0 14px;font:900 13px inherit;">‹ 返回 Purchase</button><section class="merchant-dash-card" style="box-shadow:none;"><b style="font-size:18px;">${escHtml(order.event_title||'活动门票')}</b><div style="margin-top:7px;font-size:12px;color:var(--ink-faint);">${escHtml(order.merchant_name||'乐生活票务')} · ${escHtml(order.order_code||'')} · ${new Date(order.created_at).toLocaleString('zh-CN')}</div>${order.event_starts_at?`<div style="margin-top:11px;font-size:13px;color:var(--ink-soft);">活动时间：${new Date(order.event_starts_at).toLocaleString('zh-CN')}${order.location_text?` · ${escHtml(order.location_text)}`:''}</div>`:''}<div style="margin-top:14px;border-top:1px solid var(--line);padding-top:8px;">${tickets.length?tickets.map(ticket=>`<div class="merchant-order-line" style="margin:9px 0;"><span>${escHtml(ticket.holder_name||'持票人')} · ${escHtml(ticket.ticket_code||'')}</span><b style="color:${ticket.status==='redeemed'?'var(--sage-dark)':'var(--berry)'};">${ticket.status==='redeemed'?'已核销':ticket.status==='issued'?'可使用':escHtml(ticket.status||'')}</b></div>`).join(''):'<div style="font-size:12px;color:var(--ink-faint);">订单付款完成后会在这里显示电子票。</div>'}</div><div class="merchant-order-line" style="margin-top:14px;padding-top:11px;border-top:1px solid var(--line);font-size:16px;"><b>订单金额</b><b style="color:var(--berry);">${merchantOrderMoney(order.total_amount)}</b></div></section>`;
}
function openPurchaseAutoDetail(kind,id){
  const body=document.getElementById('merchantOrderHistoryBody'),isSale=kind==='auto_sale',item=((isSale?window._merchantOrderHistoryAutoSales:window._merchantOrderHistoryAutoLeads)||[]).find(row=>String(row.id)===String(id));
  if(!body||!item)return;
  window._merchantOrderHistoryDetailId=`${kind}:${id}`;
  const vehicle=item.vehicle_data&&typeof item.vehicle_data==='object'?item.vehicle_data:{};
  body.innerHTML=`<button onclick="closeMerchantOrderHistory()" style="border:0;background:transparent;color:var(--sage-dark);padding:2px 0 14px;font:900 13px inherit;">‹ 返回 Purchase</button><section class="merchant-dash-card" style="box-shadow:none;"><b style="font-size:18px;">${isSale?'车辆成交记录':'车辆服务记录'}</b><div style="margin-top:7px;font-size:12px;color:var(--ink-faint);">${escHtml(item.merchant_name||'乐生活二手车')} · ${new Date(item.created_at).toLocaleString('zh-CN')}</div><div style="margin-top:14px;border-top:1px solid var(--line);padding-top:8px;"><div class="merchant-order-line" style="margin:8px 0;"><span>车辆</span><b>${escHtml(item.listing_title||vehicle.title||[vehicle.year,vehicle.make,vehicle.model].filter(Boolean).join(' ')||'车辆信息')}</b></div><div class="merchant-order-line" style="margin:8px 0;"><span>状态</span><b>${escHtml(item.status||'处理中')}</b></div>${item.preferred_at?`<div class="merchant-order-line" style="margin:8px 0;"><span>预约时间</span><b>${new Date(item.preferred_at).toLocaleString('zh-CN')}</b></div>`:''}${item.appointment_location?`<div class="merchant-order-line" style="margin:8px 0;"><span>地点</span><b>${escHtml(item.appointment_location)}</b></div>`:''}${item.quoted_amount?`<div class="merchant-order-line" style="margin:8px 0;"><span>报价</span><b>${merchantOrderMoney(item.quoted_amount)}</b></div>`:''}${isSale?`<div class="merchant-order-line" style="margin:12px 0 0;padding-top:11px;border-top:1px solid var(--line);font-size:16px;"><b>成交金额</b><b style="color:var(--berry);">${merchantOrderMoney(item.sale_amount)}</b></div>`:''}</div></section>`;
}
function openPurchaseRetailDetail(orderId){
  const body=document.getElementById('merchantOrderHistoryBody');
  const order=(window._merchantOrderHistoryRetail||[]).find(row=>String(row.id)===String(orderId));
  if(!body||!order)return;
  window._merchantOrderHistoryDetailId=`retail:${orderId}`;
  const merchant=window._merchantIdentityCache[order.merchant_user_id]||{};
  const items=Array.isArray(order.items)?order.items:[];
  body.innerHTML=`<button onclick="closeMerchantOrderHistory()" style="border:0;background:transparent;color:var(--sage-dark);padding:2px 0 14px;font:900 13px inherit;">‹ 返回 Purchase</button><section class="merchant-dash-card" style="box-shadow:none;"><b style="font-size:18px;">${escHtml(merchant.business_name||'乐生活商店')}</b><div style="margin-top:7px;font-size:12px;color:var(--ink-faint);">自取订单 · ${new Date(order.created_at).toLocaleString('zh-CN')} · ${escHtml(order.order_code||'')}</div><div style="margin-top:14px;border-top:1px solid var(--line);padding-top:8px;">${items.map(item=>`<div class="merchant-order-line" style="margin:8px 0;"><span>${escHtml(item.name||'商品')} × ${Number(item.quantity||0)}</span><b>${merchantOrderMoney(item.line_total??(Number(item.unit_price||0)*Number(item.quantity||0)))}</b></div>`).join('') || '<div style="font-size:12px;color:var(--ink-faint);">商品明细暂不可用</div>'}</div><div style="margin-top:13px;padding-top:10px;border-top:1px solid var(--line);"><div class="merchant-order-line"><span>订单状态</span><b>${escHtml(purchaseRetailStatusText(order.status))}</b></div>${order.pickup_at?`<div class="merchant-order-line" style="margin-top:8px;"><span>自取时间</span><b>${new Date(order.pickup_at).toLocaleString('zh-CN')}</b></div>`:''}${order.merchant_note?`<div style="margin-top:10px;font-size:13px;color:var(--ink-soft);">商家留言：${escHtml(order.merchant_note)}</div>`:''}<div class="merchant-order-line" style="margin-top:12px;font-size:16px;"><b>商品合计</b><b style="color:var(--berry);">${merchantOrderMoney(order.subtotal)}</b></div></div>${order.status==='pending'?`<button onclick="cancelPurchaseRetailOrder('${String(order.id).replace(/'/g,'')}')" style="width:100%;margin-top:16px;border:1px solid var(--berry);border-radius:10px;padding:11px;background:#fff;color:var(--berry);font:800 13px inherit;">取消订单</button>`:''}</section>`;
}
async function cancelPurchaseRetailOrder(orderId){
  if(!confirm('确认取消这笔自取订单吗？'))return;
  try{
    const response=await authedFetch(`${SUPABASE_URL}/rest/v1/rpc/merchant_retail_order_cancel`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({p_order_id:orderId})});
    if(!response.ok)throw new Error(await response.text());
    const updated=await response.json();
    window._merchantOrderHistoryRetail=(window._merchantOrderHistoryRetail||[]).map(row=>String(row.id)===String(orderId)?updated:row);
    window._purchaseHistoryRecords=(window._purchaseHistoryRecords||[]).map(record=>record.kind==='retail'&&String(record.data?.id)===String(orderId)?{...record,data:updated}:record);
    openPurchaseRetailDetail(orderId);
  }catch(error){console.warn('取消零售订单失败:',error.message);showToast('暂时无法取消订单，请稍后重试');}
}
async function openMerchantOrderBillDetail(billId){
  const body=document.getElementById('merchantOrderHistoryBody');
  const bill=(window._merchantOrderHistoryBills||[]).find(row=>String(row.id)===String(billId));
  if(!body||!bill)return;
  window._merchantOrderHistoryDetailId=String(billId);body.innerHTML='<div class="deals-empty-panel">正在读取账单明细...</div>';
  try{
    const [order,items]=await Promise.all([
      restaurantDataApi.getOrder({orderId:bill.order_id}),
      restaurantDataApi.listOrderItems({orderIds:[bill.order_id],order:'batch_no.asc,created_at.asc,id.asc'})
    ]);
    const claimIds=Array.isArray(bill.coupon_claim_ids)?bill.coupon_claim_ids:[];
    let claims=[];
    if(claimIds.length){const claimRes=await authedFetch(`${SUPABASE_URL}/rest/v1/merchant_coupon_claims?id=in.(${claimIds.map(Number).filter(Number.isFinite).join(',')})&select=id,coupon_snapshot,status`,{method:'GET'});if(claimRes.ok)claims=await claimRes.json();}
    const merchant=window._merchantIdentityCache[bill.merchant_user_id]||{};
    const couponText=claims.length?claims.map(claim=>escHtml((claim.coupon_snapshot||{}).title||'优惠券')).join('、'):'未使用优惠券';
    body.innerHTML=`<button onclick="closeMerchantOrderHistory()" style="border:0;background:transparent;color:var(--sage-dark);padding:2px 0 14px;font:900 13px inherit;">‹ 返回消费记录</button><section class="merchant-dash-card" style="box-shadow:none;"><b style="font-size:18px;">${escHtml(merchant.business_name||'乐生活商家')}</b><div style="margin-top:7px;font-size:12px;color:var(--ink-faint);">${new Date(bill.created_at).toLocaleString('zh-CN')} · ${merchantBillPaymentText(bill.payment_method)} · ${escHtml(order?.order_code||'')}</div><div style="margin-top:14px;border-top:1px solid var(--line);padding-top:8px;">${items.length?items.map(item=>`<div class="merchant-order-line" style="margin:8px 0;"><span>${escHtml(item.product_name||'商品')} × ${Number(item.quantity||0)}</span><b>${merchantOrderMoney(Number(item.unit_price||0)*Number(item.quantity||0))}</b></div>`).join(''):'<div style="font-size:12px;color:var(--ink-faint);">菜品明细暂不可用</div>'}</div><div style="margin-top:13px;padding-top:10px;border-top:1px solid var(--line);"><div class="merchant-order-line"><span>菜品小计</span><b>${merchantOrderMoney(bill.subtotal)}</b></div><div class="merchant-order-line" style="margin-top:8px;"><span>使用优惠券</span><span style="max-width:64%;text-align:right;color:var(--ink-soft);">${couponText}</span></div><div class="merchant-order-line" style="margin-top:8px;"><span>优惠金额</span><b style="color:var(--berry);">-${merchantOrderMoney(bill.discount_amount)}</b></div>${Number(bill.tip_amount)?`<div class="merchant-order-line" style="margin-top:8px;"><span>小费</span><b>${merchantOrderMoney(bill.tip_amount)}</b></div>`:''}<div class="merchant-order-line" style="margin-top:11px;font-size:16px;"><b>实付金额</b><b style="color:var(--berry);">${merchantOrderMoney(bill.total_amount)}</b></div></div></section>`;
  }catch(error){console.warn('账单明细读取失败:',error.message);body.innerHTML='<div class="deals-empty-panel">账单明细暂时无法读取，请稍后重试。</div>';}
}

// Keep the static home panel visible immediately. Data loading remains owned by bootApp.
const initialHomePage = document.getElementById('page-home');
if(initialHomePage){
  initialHomePage.classList.add('active');
  initialHomePage.style.display = 'block';
}
// Keep deep links from the standalone merchant console until the app has restored auth.
// This avoids returning to the home feed before the requested management view is opened.
bootApp().finally(() => launchMerchantAdminAction());

// 独立商家管理后台返回主站时，用这个轻量路由打开既有工作台，避免复制两套业务逻辑。
async function launchMerchantAdminAction(){
  const params = new URLSearchParams(window.location.search);
  const action = params.get('merchant_admin');
  const merchantId = params.get('merchant_id');
  if(!action || !merchantId) return;
  const clear = () => { try { const next = new URL(window.location.href); next.searchParams.delete('merchant_admin'); next.searchParams.delete('merchant_id'); next.searchParams.delete('from'); window.history.replaceState({},'',next.pathname + next.search + next.hash); } catch(error) {} };
  // bootApp normally restores this. The local fallback protects a cold app start.
  if(!(session && session.user)){
    session = authSessionStore?.read() || null;
  }
  if(!(session && session.user)){
    showToast('请先登录后再打开商家管理后台');
    return;
  }
  clear();
  if(action === 'orders') return openMerchantOrderManager(merchantId);
  if(action === 'takeout') return openMerchantTakeoutManager(merchantId);
  if(action === 'queue') return openMerchantQueueManager(merchantId);
  if(action === 'members') return openMerchantMemberManager(merchantId);
  if(action === 'team') return openMerchantTeamManager();
  if(action === 'features') return openMerchantFeatureCenter();
  if(action === 'content') return openMerchantPublishDashboard();
  if(action === 'rental') return openMerchantRentalManager(merchantId);
  if(action === 'auto_sales') return openMerchantAutoManager(merchantId);
  if(action === 'store' || action === 'public') return switchTab('profile');
}

// 定时刷新仅在首页可见时执行，减少后台页面的无效网络请求。
function homeAutoRefreshEnabled(){ return homeAccountSettingsCache?.general?.auto_refresh !== false; }
setInterval(() => {
  const activeTab = document.querySelector('.nav-btn.active');
  if(homeAutoRefreshEnabled() && document.visibilityState === 'visible' && navigator.onLine && activeTab && activeTab.dataset.tab === 'home'){
    console.log('⏰ 自动刷新主页数据...');
    loadPostsFromSupabase();
  }
}, 60000);

window.addEventListener('online', () => {
  updateNetworkOfflineOverlay();
  window._postsNextRetryAt = 0;
  clearPostsRetry();
  if(homeAutoRefreshEnabled() && currentTab === 'home') loadPostsFromSupabase({force:true});
});
document.addEventListener('visibilitychange', () => {
  if(homeAutoRefreshEnabled() && document.visibilityState === 'visible' && navigator.onLine && currentTab === 'home' && (!window._postsLastFetchedAt || Date.now() - window._postsLastFetchedAt > 180000)){
    loadPostsFromSupabase();
  }
});

// The home tab is already active in the static markup. Boot owns the first data load so
// authenticated requests wait for session refresh instead of producing an initial 401 burst.
bindAppEdgeGestures();
console.log(`✓ 页面初始化完成 【版本 ${APP_VERSION} - Android Scroll Recovery】`);
